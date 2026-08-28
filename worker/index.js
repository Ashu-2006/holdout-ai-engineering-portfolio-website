/**
 * The site's backend: one Cloudflare Worker in front of the static
 * assets.
 *
 * STACK CHOICE, stated: the alternatives were a third-party form
 * service (visitor messages flow through someone else's account), or
 * the Astro SSR adapter (turns the whole static site into a server
 * app to power one endpoint). This is instead ~150 lines the owner
 * can read: static files stay static and fast, and exactly one route
 * is dynamic.
 *
 * What it does:
 *   POST /api/contact  validate -> store in D1 -> optionally forward
 *                      by email via Resend -> JSON
 *   everything else    served from the built site in ./dist
 *
 * What it costs: nothing at portfolio scale. Workers free tier is
 * 100k requests/day; D1 free tier is 5M reads/day. Operationally it
 * is one `wrangler deploy`.
 *
 * One-time setup before deploying:
 *   npx wrangler d1 create holdout-contact
 *     -> paste the returned database_id into wrangler.jsonc
 *   (optional) npx wrangler secret put RESEND_API_KEY
 *     -> submissions are then also emailed to CONTACT_TO
 * Local dev needs neither: `wrangler dev` runs D1 on disk.
 *
 * Plain JavaScript with JSDoc on purpose: no build step, no type
 * package, and `astro check` does not need to know it exists.
 */

const MAX = { name: 100, email: 200, message: 5000 };
/** Submissions allowed per IP per 10 minutes. Above this is not a
 *  person typing; it is a loop. */
const RATE_LIMIT = 5;

/**
 * @param {Request} request
 * @param {{ ASSETS: { fetch(r: Request): Promise<Response> },
 *           DB: any, RESEND_API_KEY?: string, CONTACT_TO?: string }} env
 */
async function handleContact(request, env) {
  const json = (status, body) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });

  if (request.method !== "POST") {
    return json(405, { ok: false, error: "POST only" });
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return json(400, { ok: false, error: "Body must be JSON" });
  }

  /* Honeypot: the form has an invisible "website" field a person
     never fills. A bot that fills it gets a cheerful 200 and nothing
     stored, because telling a bot it failed just trains it. */
  if (typeof data.website === "string" && data.website.length > 0) {
    return json(200, { ok: true });
  }

  const name = String(data.name ?? "").trim().slice(0, MAX.name);
  const email = String(data.email ?? "").trim().slice(0, MAX.email);
  const message = String(data.message ?? "").trim().slice(0, MAX.message);

  if (!name) return json(422, { ok: false, error: "Missing name" });
  if (!/^\S+@\S+\.\S+$/.test(email))
    return json(422, { ok: false, error: "Invalid email" });
  if (!message) return json(422, { ok: false, error: "Missing message" });

  /* Idempotent schema. At one table and portfolio traffic, running
     CREATE IF NOT EXISTS per request is simpler and safer than a
     migration system nobody will ever run twice. */
  await env.DB.exec(
    "CREATE TABLE IF NOT EXISTS submissions (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT NOT NULL, ip TEXT, name TEXT NOT NULL, email TEXT NOT NULL, message TEXT NOT NULL, forwarded INTEGER NOT NULL DEFAULT 0)"
  );

  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";

  const recent = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM submissions WHERE ip = ?1 AND created_at > datetime('now', '-10 minutes')"
  )
    .bind(ip)
    .first();
  if ((recent?.n ?? 0) >= RATE_LIMIT) {
    return json(429, { ok: false, error: "Too many messages; try later or email directly" });
  }

  /* The store is the source of truth; email forwarding is best
     effort on top. A dropped email must never lose the message. */
  const inserted = await env.DB.prepare(
    "INSERT INTO submissions (created_at, ip, name, email, message) VALUES (datetime('now'), ?1, ?2, ?3, ?4)"
  )
    .bind(ip, name, email, message)
    .run();

  let forwarded = false;
  if (env.RESEND_API_KEY && env.CONTACT_TO) {
    try {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Portfolio <onboarding@resend.dev>",
          to: [env.CONTACT_TO],
          reply_to: email,
          subject: `Portfolio message from ${name}`,
          text: `${message}\n\n- ${name} (${email})\nip: ${ip}`,
        }),
      });
      forwarded = r.ok;
      if (forwarded) {
        await env.DB.prepare(
          "UPDATE submissions SET forwarded = 1 WHERE id = ?1"
        )
          .bind(inserted.meta.last_row_id)
          .run();
      }
    } catch {
      /* stored is enough; forwarding failure is not the sender's problem */
    }
  }

  return json(200, { ok: true, forwarded });
}

export default {
  /** @param {Request} request */
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/contact") {
      return handleContact(request, env);
    }
    /* Everything else is the static site. */
    return env.ASSETS.fetch(request);
  },
};

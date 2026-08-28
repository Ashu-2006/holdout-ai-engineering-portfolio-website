/**
 * robots.txt, generated so the domain comes from site config rather
 * than being hardcoded in a static file that silently goes stale.
 *
 * Policy: everything is crawlable. This portfolio WANTS to be read
 * by agents; the machine view and llms.txt exist for exactly that.
 * The only rule beyond allow-all is pointing crawlers at the sitemap
 * and pointing language-model agents at the llms.txt index.
 */
import type { APIRoute } from "astro";
import { site } from "../config/site";

export const GET: APIRoute = ({ site: configured }) => {
  const base = (configured ?? new URL(site.url)).href.replace(/\/$/, "");
  const body = [
    "# " + site.name + " - " + site.role,
    "# Agents welcome. Structured version of every page: see llms.txt",
    "",
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${base}/sitemap.xml`,
    "",
    "# For language-model agents:",
    `# ${base}/llms.txt       index of what is here`,
    `# ${base}/llms-full.txt  the whole site as one markdown document`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};

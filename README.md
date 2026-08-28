# Holdout

An evidence-first portfolio for AI and ML engineers. Astro + Tailwind, with an
agent-readable twin of every page.

The name is the thesis: a **holdout** is the data you keep back so the test is
honest. Every project in this template is required to state the baseline it
beat and the conditions under which it fails, because a metric without those
is decoration.

> **Status: early. Feedback wanted.**
> All content is placeholder. Nothing in here is a claim about anyone.

---

## Run it

```bash
pnpm install
pnpm dev            # http://localhost:4321
```

That is the whole setup. No env vars, no database, no accounts needed to see
the site.

To run the contact backend too (Cloudflare Worker + local D1 on disk):

```bash
pnpm dev:backend    # builds, then serves on http://localhost:8787
```

Other scripts:

| Command | What it does |
|---|---|
| `pnpm build` | Generates assets and the resume PDF, then builds to `dist/` |
| `pnpm check` | `astro check`. Should be 0 errors |
| `pnpm gen` | Regenerates the mock posters and `public/resume.pdf` |
| `pnpm deploy` | Builds and `wrangler deploy` |

## Change these three, in this order

1. **`src/config/site.ts`** — name, role, email, availability, education,
   skills, links. Anything reading `Example University` or `+1 555 0100` is a
   placeholder waiting for you.
2. **`src/data/work.ts`** — the projects and the work history. Note the
   `metric` shape: `value`, `label`, `context`, `baseline`. The baseline is
   not optional by accident.
3. **`src/content/posts/` and `src/content/lab/`** — Markdown. Frontmatter is
   validated by Zod schemas in `src/content.config.ts`, so a malformed post
   fails the build instead of rendering wrong.

Then `public/avatar.jpg` for the portrait, and `astro.config.mjs` +
`wrangler.jsonc` for your domain.

## What is unusual about it

**The MACHINE view.** Every page has an agent-readable twin behind the
`[ ] HUMAN  [x] MACHINE` switch in the header: the same facts as markdown,
generated from the same objects the page renders, so the two cannot disagree.
Plus `/llms.txt`, `/llms-full.txt`, `/robots.txt` and `/sitemap.xml`, all
generated from the same data. If you are building for an audience that
increasingly arrives via a model rather than a browser, this is the point.

**Schemas that make the honest thing easy.** A metric carries its context and
its baseline or it does not compile. A project with nothing public to open
renders that gap as a visible, named state rather than quietly omitting it.
Draft posts show their real stage in a queue instead of promising "coming
soon".

**One type size.** All content is set at 16px. Hierarchy comes from weight,
colour and position, which are free, rather than from size, which costs a
scale step every time. Four sizes exist in total: body, a mono micro-label,
section titles, and one display size for the `h1`.

**No shadows anywhere.** Elevation is a surface change plus a hairline. The
content column's edges are drawn as rules that bleed to the viewport, so the
page reads as a measured drawing rather than a stack of cards.

**A real contact backend.** One readable Cloudflare Worker
(`worker/index.js`, ~150 lines): validate, rate-limit, store in D1, optionally
forward by email. The form POSTs there and falls back to composing a prefilled
email in your own mail client if the server is unreachable, so a send gesture
never dead-ends.

## Stack

| Layer | Choice |
|---|---|
| Framework | Astro 7 (static output, zero framework JS by default) |
| Styling | Tailwind CSS 4, driven by tokens in `src/styles/theme.css` |
| Language | TypeScript, `astro check` clean |
| Type | Geist + Geist Mono, loaded non-blocking |
| Icons | Phosphor via `astro-icon`, inlined SVG |
| Interaction | Vanilla TS, CSS-first motion. No React |
| Backend | Cloudflare Worker + D1 |
| Hosting | Cloudflare Workers |

Motion patterns (tooltip, dock hover falloff, accordion, sliding tabs, card
tilt, error shake) follow [transitions.dev](https://transitions.dev), retuned
to this design's tokens.

## Deploying

```bash
npx wrangler d1 create holdout-contact   # paste the id into wrangler.jsonc
npx wrangler secret put RESEND_API_KEY   # optional: email forwarding
pnpm deploy
```

Without the D1 id the site still deploys and works; only the contact endpoint
needs it. Without `RESEND_API_KEY` messages are stored but not emailed, and
readable with:

```bash
npx wrangler d1 execute holdout-contact --command "SELECT * FROM submissions"
```

## Layouts studied

The structure owes a real debt to five portfolios I studied while building
this: **Chánh Đại**, **Taseen Tanvir**, **Saad Basheer**, **Lorenzo de
Lijser**, and **Making Software**. The column-with-bleeding-rules grid, the
mono micro-label system and the expand-in-place row all come from studying
their work. The treatment here diverged into its own thing (light ground, one
type size, the machine view, the contact page), but the debt is worth naming.

## Licence

MIT. The generated mock imagery in `public/mock/` is produced by
`scripts/gen-mock.mjs` and is yours to keep or delete.

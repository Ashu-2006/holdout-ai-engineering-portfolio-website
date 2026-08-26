# Rebuild Plan — AI Engineer Portfolio Template

Building a **sellable portfolio template for AI/ML engineers**, driven by `HIRING-SIGNALS.md`
(~44 sources) and `SITE-STRUCTURE.md`.

**Decisions locked:**
- **Subject:** **Ashutosh Rana**, real content. Built as a live AI-engineer portfolio, with
  the content model kept generic underneath so it extracts to a template at Phase 12.
  Real content forces the design to be honest.
- **Codebase:** keep the Astro 7 + Tailwind 4 + Motion shell. **The folder components are
  kept** and retargeted as a Tier-3 browsing surface (see §1).
- **Positioning:** job-seeker persona (consultant is a later module).

**Weighting of inputs:**
| Input | Weight | Role |
|---|---|---|
| `HIRING-SIGNALS.md` research | **60%** | What sections exist and in what order |
| tanvir.io + aniketpawar.com | **20%** | Layout, motion, the DM pattern |
| Dhairya zip | **20%** | Tone calibration + a few concrete facts |

---

## 1. What we keep, drop, and build

### Keep
```
astro.config.mjs        Astro 7, Tailwind 4 via @tailwindcss/vite, astro-icon
wrangler.jsonc          Cloudflare Workers deploy (already working)
package.json            pnpm 10.22.0 pinned, Motion 12
src/layouts/Layout.astro  rewritten, but the slot stays
tsconfig.json
```

### Keep and retarget — the folder components
```
src/components/Folder.astro     KEEP  -> Tier-3 browsing surface for /lab + gallery
src/components/Card.astro       KEEP  -> item renderer inside a folder
src/components/Carousel.astro   KEEP  -> lab/gallery detail view
src/data/collections.ts         KEEP  -> EXTENDED, not replaced (see below)
```

**Where folders live.** Not at the top. Browsing is a Tier-3 activity (case-study
click-through ≈15% engagement), so folders sitting above the fold would fail the 5-second
recruiter filter. They move **below the fold** as the exploration layer: the reward for
scrolling, not the front door. That keeps the interaction that made this codebase worth
choosing while the tiers above it do the filtering.

**How `collections.ts` extends.** The current union models *images hanging in a folder*:

```ts
CollectionItem = string | {src} | {logo,label} | {note,body}
```

It cannot express a metric, an eval, or a decision — so it gains a typed variant rather than
being thrown away:

```ts
Collection = { slug, title, meta, kind: 'systems'|'lab'|'writing'|'gallery', items[] }
CollectionItem = ...existing four variants
               | { systemRef: string }   // resolves to a System, renders a case-study card
               | { labRef: string }      // resolves to a LabItem
```

So a folder can hold photos (as today) *or* typed content. `kind` drives how `Card.astro`
renders each item. Nothing existing breaks.

### Drop
```
src/components/Welcome.astro     Astro boilerplate
src/components/About.astro       replaced by Tier-1 positioning block
src/pages/[slug].astro           replaced by /work/[slug] + /lab/[slug]
src/assets/*.svg                 Astro placeholder art
```

### From the Dhairya zip (the 20%)
Taken as **calibration, not content**:
- **Tone**: positioning as a *claim*, not a job title. "I build the data that shows where
  frontier models break" >> "Experienced ML Engineer."
- **Grouped skills**: Training / Inference / Rigor beats a flat logo wall. Confirms the
  tiered-skills research finding.
- **A signature background**: a domain-meaningful canvas (his was an SGD run on a 3-basin
  loss surface) as page ground. We build our own version, generalized and optional.
- **Two entry pages** for keyword surface ("recruiters search for one term or the other").
- **The a11y bar**: skip link, focus rings, `aria-current`, real `<table>` headers,
  `prefers-reduced-motion`. That's the floor, not a stretch goal.
- Two invariants if we port a canvas: `body` stays `background-color: transparent`; no
  `overflow:hidden` on hero wrappers.

Nothing else — no persona, no projects, no copy.

---

## 2. Navigation: the persistent floating dock

**The problem you flagged.** The reference site has no bottom nav at all — it's
`header { position: fixed; inset: 0 0 auto 0 }`, a top bar whose links live behind a burger
that opens a fullscreen overlay. Links are invisible until tapped.

**What we build.**

```
┌──────────────────────────────────────────────┐
│                  content                     │
│                                              │
│     ╭────────────────────────────────────╮   │
│     │ ◈  Work · Writing · Lab · CV    ✉  │   │ ← always visible
│     ╰────────────────────────────────────╯   │
└──────────────────────────────────────────────┘
```

- `position: fixed; bottom: var(--s-300); left:50%; translateX(-50%)`
- **Never hides.** No scroll-direction listener. No `translateY(120%)` state. Ever.
- `backdrop-filter: blur(20px)`, token bg at ~85% alpha, hairline border, soft shadow
- Active section via IntersectionObserver → `aria-current="true"` → teal accent
- Contents: brand mark · 3–4 section links · one primary CTA. Nothing more.
- **Mobile: stays a dock.** Does not become a burger. Under 480px labels compress to
  icon + short text. Bottom placement is *better* on mobile (thumb reach).
- `padding-bottom: env(safe-area-inset-bottom)` for the iOS home bar
- `main` gets reserved bottom padding so the dock never occludes the last section
- Keyboard reachable, not a focus trap, skip link lands before it

**[judgment]** Keep a 2px scroll-progress hairline at the *top* of the viewport, separate
from the dock, so the two don't crowd each other.

---

## 3. Reference patterns we're adopting

### tanvir.io → the DM conversation (the thing you loved)

His contact section is an iMessage-style exchange that answers objections in the visitor's
own voice, with CTAs embedded inside the thread:

> "how do i actually reach you?" → "fastest way is to email me. keep it short, don't write me
> an essay." → `[Copy] hey@… (under 300 chars plz)` → "hmm too lazy to email tho" → "fair.
> just use the form below, lands in the same inbox" → "also where else are you online?"

**Our version: `DMThread` — a config-driven component that merges FAQ + Contact.**

```ts
DMThread = {
  messages: [
    { from: 'them', text: 'so what do you actually do?' },
    { from: 'me',   text: '...' },
    { from: 'me',   action: { kind:'copy-email', value:'…' } },
  ]
}
```

Why it belongs here: the research says contact gets high engagement *but only once the answer
is already yes*, so it sits at the bottom (Tier 3) — precisely where a warm, human section
earns its keep. It also does FAQ work, killing a separate accordion.

Guardrails:
- Real DOM text, never images. SEO + screen readers intact.
- Semantic list markup; chat bubbles are visual styling only.
- Plain `mailto:` and a selectable address always present. Never trap contact behind JS.
- `prefers-reduced-motion` → all messages rendered immediately, no stagger, no typing dots.
- Ships with a default script a buyer edits, not a blank array.

Also taking: **`press c to copy email`** keyboard shortcut, tight experience rows
(`2024 — 2025 · Frontend engineer · at Company · one-line impact`), and a capability marquee.

### aniketpawar.com/crafts → `/lab` + the entrance

His `/crafts` is "motion studies and interaction experiments," each a small piece with its own
page. Generalized for AI engineers, that becomes **`/lab`: small interactive ML explainers** —
a tokenizer visualizer, an attention-map viewer, an eval-score explorer, a quantization
before/after.

This is the highest-leverage section in the product. Earlier research found interactive
explainers do double duty: they're portfolio artifacts *and* the shareable content that gets a
repo traffic (the Josh Comeau model — "the teaching content and the portfolio content are the
same content"). No competing template has this.

**Loading:** adopt the deliberate entrance, but capped. ≤600ms, non-blocking, skippable, never
delays first meaningful paint, disabled under reduced-motion. Research floor: recruiters bail
past 3s; target <2s to interactive. A transition, not a gate.

---

## 4. Structure

```
/                    the spine (tiered)
/work                systems index
/work/[slug]         CASE STUDY — the 11-part evidence chain   ← core differentiator
/writing  /writing/[slug]
/lab      /lab/[slug]        interactive explainers
/resume              web view + print→PDF
/about
/404
```

**Optional second entry page.** The zip's two-track split (AI engineering / ML engineering)
is good keyword surface. We ship it as an **optional preset** — a buyer with one specialty
turns it off; one who spans both turns it on.

### Homepage spine

| # | Section | Tier | Why (research) |
|---|---|---|---|
| 1 | Positioning + availability | 1 | Role+domain+stack in one H1. Unclear role in first 5 words = reject. |
| 2 | **Metric strip** | 1 | "Numbers travel between hiring managers; adjectives don't." Numerals stop the scan. |
| 3 | Proof row | 1 | Company recognition shortcut; falls back to outcome scale. |
| 4 | Stack registry | 1 | Recruiters work from a must-have list. Must be above fold. |
| 5 | Featured system | 2 | ONE, not a grid. Anthropic asks for "the piece of work most relevant." |
| 6 | Experience timeline | 2 | ~60% engagement. Why `bchiang7/v4` is the most-forked portfolio. |
| 7 | Other systems | 3 | 2–5 more, capped. |
| 8 | Lab | 3 | Interactive explainers. |
| 9 | Writing | 3 | Anthropic: "written a thoughtful blog post… put that at the top." |
| 10 | Record / profiles | 3 | Competitions, Kaggle, DSA. Deliberately low — see §6. |
| 11 | **DM thread** (FAQ + contact) | 3 | tanvir.io pattern. |

Single-column primary scan path throughout. Two-column measured a 1–2s scan cost and lower
move-forward rate.

### The case study — `/work/[slug]`

The product. Order lifted from the researched README convention, because reviewers are already
trained to read in it.

```
1  OUTCOME HEADLINE     result + key metric in one sentence
2  LIVE DEMO            second element on the page, before context
                          (only 23% of ML practitioners have EVER deployed)
3  RELEVANCE NOTE       "why this matters for <role>"  ← Anthropic asks for this verbatim
4  METRICS              2+ outcomes, each with context + baseline
5  ARCHITECTURE         diagram legible in 15s without prose
6  DECISIONS            3–5 DecisionRecords                      ← nobody has this
7  EVALUATION           method, dataset size, score, baseline, failure notes  ← nobody has this
8  LIMITATIONS          honest. "87% + error analysis > 99.5% + no explanation"
9  STACK                named tools
10 ARTIFACTS            repo · demo · model card · dataset · paper
11 TALKING POINT        "ask me about…"  ← practitioners use portfolios for interview
                          questions, not competence assessment
```

---

## 5. Content model

```ts
// primitives
Metric      { label, value, unit?, context?, baseline?, featured? }
StackItem   { name, category: 'training'|'inference'|'rigor'|'lang'|'infra', url? }
Artifact    { kind:'repo'|'demo'|'model'|'dataset'|'paper'|'post', url, label? }
Diagram     { kind:'mermaid'|'svg', source, alt }

// the differentiators
DecisionRecord { decision, alternatives[], rationale, tradeoff, secondOrder[] }
EvalResult     { method, datasetSize, metric, score, baseline, failureNotes }
                 //                                  ^^^^^^^^  ^^^^^^^^^^^^ REQUIRED

// entities
System      { slug, title, outcome, relevanceNote?, liveDemo?, problem, metrics[],
              diagram?, decisions[], evals[], limitations[], stack[], artifacts[],
              talkingPoint?, featured?: true }
Experience  { company, title, start, end?, impact, metrics[], stack[] }
Post        { slug, title, date, summary, tags[], status:'live'|'draft' }
LabItem     { slug, title, blurb, component, writeup? }
Profile     { platform, handle, url, stat?, category:'artifact'|'rating' }
Persona     { name, positioning, availability, proofRow[], contact, dmThread }
            //  seeded with Ashutosh's real content; every field editable = template
```

**Anti-pattern guards, structural not advisory.** Justified by: *68% of rejected candidates
highlighted projects hiring teams viewed negatively* — users misjudge their own work.

- `featured` is singular at the type level
- Soft cap 3–6 systems, build warning past that
- Missing `liveDemo` renders an explicit muted "not deployed" state — the gap must *look* like
  a gap, not silently vanish
- `EvalResult` requires `baseline` + `failureNotes`, so "99.8% accuracy" alone is inexpressible
- Build-time lint: tutorial datasets (titanic/iris/mnist), me-too names
  (todo/calculator/snake/weather), `score > 0.99` without a leakage note, missing repo URL

That lint is a real feature. No portfolio template tells you your project is a cliché.

---

## 6. Competitive programming (LeetCode / Codeforces)

Zero of ~44 sources named contest ratings as a hiring signal; the nearest mentions are
negative ("look how smart I am" algorithm implementations are on the reject list). But the
research pool skewed US/EU applied-AI, and DSA ratings genuinely gate campus recruiting,
service companies, and much of the India/China market — likely a real slice of buyers.

**`ProfileStrip` module**: off by default, compact horizontal strip, Tier 3 near contact,
**structurally unable to sit above the featured system**. Supports GitHub, HuggingFace,
Kaggle, Scholar, LeetCode, Codeforces, npm, PyPI. Static values by default (a dead API
breaking the page is worse than a stale number; a dead link is a documented reject).
Artifact platforms order before rating platforms.

---

## 7. Phases

| # | Phase | Output |
|---|---|---|
| 1 | **Foundation** | Tailwind 4 `@theme` tokens, type scale, one easing curve, Layout shell, **the dock** |
| 2 | **Content model** | `src/data/` schema + **Ashutosh's real content**. Generic types = extractable later. |
| 3 | **Tier 1 + 2** | Positioning, metric strip, proof row, stack registry, featured system, timeline |
| 4 | **Case studies** | `/work/[slug]`, 11-part chain, `DecisionRecord` + `EvalResult` rendering |
| 5 | **Lab + folders** | `/lab` + 2 seed explainers; retarget `Folder`/`Card`/`Carousel` to typed collections |
| 6 | **DM thread** | tanvir.io contact/FAQ, copy-email shortcut |
| 7 | **Writing** | `/writing` + MDX, `live`/`draft` states |
| 8 | **Resume** | `/resume` from the same objects + print stylesheet → PDF, single column |
| 9 | **Motion + entrance** | Motion reveals, ≤600ms entrance, reduced-motion throughout |
| 10 | **Signature canvas** | Optional domain-meaningful background, theme-reactive, off under reduced-motion |
| 11 | **Mobile + a11y + perf** | Real-device testing, Lighthouse, <2s interactive, full a11y pass |
| 12 | **Template packaging** | README, `example/` data, lint, one-click deploy |

Phases 1–4 are the product. 5–8 are what justify a price. 9–12 are what make it sellable.

---

## 8. Open items

1. **Free-core vs paid tier** — bites at Phase 12, not before.
2. **Mermaid vs hand-authored SVG** for diagrams. Leaning Mermaid with an SVG escape hatch.
3. **Signature canvas concept** — the loss surface is taken; needs our own idea (attention
   heatmap? embedding-space drift? token stream?). Phase 10, deferrable.
4. **Mobile is untested** in the inherited shell. Non-negotiable before anything ships.
5. **Ashutosh's actual content is the gap.** The schema is ready; the systems are not
   written yet. Needed per system: outcome + metric, live demo URL, 2+ metrics with
   baselines, architecture, 3-5 decisions, an eval with failure notes, limitations, stack,
   artifacts. Research says aim for **3 deep systems, not 10 shallow** — ideally matching
   the top-converting archetypes (RAG + eval harness, multi-agent + observability,
   fine-tuned model + benchmark). This is the one thing I cannot write for you.

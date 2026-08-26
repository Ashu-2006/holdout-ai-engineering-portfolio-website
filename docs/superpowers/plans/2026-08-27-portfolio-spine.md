# Portfolio Spine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the current `/portfolio` route into the finished template spine. Fourteen tasks: a motion pass, the seven content surfaces the inventory found missing, a density control, a scan rail, and a real AI-engineer dataset in place of the placeholder content.

**Architecture:** The Zod schemas in `src/content.config.ts` are the actual deliverable, not the components. A validated shape is what makes the strong thing easy to express and the weak thing hard, and it is the only part a buyer cannot get by forking someone's CSS. Everything renders server-side. Three pieces of client JS, all progressive enhancements that leave a complete page when they fail. Motion extends the existing four-duration, two-curve set in `src/styles/theme.css`, because a second motion system is drift with a nicer name.

**Tech Stack:** Astro 7, Tailwind v4 (`@theme`), Zod via `astro:content`, `astro-icon` with Phosphor, vanilla JS for the three interactive pieces. No animation library, because CSS covers every transition in this plan. Zero new dependencies.

---

## Provenance

Every decision below traces to one of four sources. Where they conflict, the conflict is recorded rather than smoothed over.

| Tag | Source |
|---|---|
| **[INV]** | `docs/CONTENT-INVENTORY.md`, the reconciliation of research against the Figma board |
| **[REF]** | Figma `Sdk1eUywk7uMTbMPZ5sPGw` node `38:3981`, four collected landing pages |
| **[VAULT]** | `20 Areas/Design Engineering/`, 45 atomic craft notes |
| **[MINE]** | Invented for this build, with the reasoning stated |

### Vault craft rules this build is bound by

Read these before touching the relevant layer. They are the standard the work gets held to.

| Layer | Note | The binding rule |
|---|---|---|
| Radius | `Concentric corner radii keep nested shapes from looking pinched` | Inner radius = outer radius minus padding. Card 16 with padding 8 wants inner 8. Radius 0 inside a rounded parent reads as a bug. |
| Alignment | `Optical alignment beats mathematical alignment when the eye is the judge` | Chip labels nudge up 1px because descenders drag the baseline low. Store nudges as named tokens so the next reader does not revert them. |
| Type | `A modular type scale is a compression algorithm for hierarchy` | The scale generates line-height and spacing too. Fluid scales replace media queries. |
| Motion | `Motion tokens are a language, not a decoration` | Primitives name physics, semantics name intent. Easing carries more brand than duration. |
| Motion | `Perceived performance rides three thresholds: 100ms, 300ms, 1000ms` | Past 300ms, motion must be interruptible. |
| Motion | `Stagger is choreography; timing turns a list into a phrase` | Stagger offset stays at 40ms per item, capped. |
| Motion | `prefers-reduced-motion is a design decision, not a media query` | Mandatory block. Non-negotiable. |
| States | `Empty, loading, skeleton, error: four states are the minimum a screen owes` | Design the state chart before the components. Empty is a first-run experience, not "nothing to show". |
| Disclosure | `Progressive disclosure has four canonical mechanisms, pick by weight of the reveal` | Pick by weight. An inline expand is not a drawer. |
| Stacking | `Sticky UI needs a z-index budget, not a z-index war` | Every overlay gets a `--layer-*` token. |
| AI UX | `Grounding UI cites the span, not the document` | The basis for [MINE] invention 1 below. |
| AI UX | `Confidence UX represents uncertainty as an affordance, not a number` | The basis for [MINE] invention 2 below. |
| Practice | `Emil Kowalski's motion skill sees easing as a language` | Ease-out is a verb of arrival, ease-in a verb of departure. Choose by meaning. |

### Skills to invoke, and when

| Phase | Skill | Why |
|---|---|---|
| 1 | `motion-system` | Extend the existing tokens. It already found 4 durations and 2 curves in `theme.css`, so this is an extension, not an install. |
| 1 | `transitions-dev apply` | `18-texts-reveal` for the hero, `21-accordion` for disclosures, `16-tabs-sliding` for the density control, `04-text-states-swap` for the copy affordance. |
| 2 | `frontend-design` | Section composition and visual direction on the five new surfaces. |
| 3 | `gsap-scrolltrigger` | Only if the scan-path rail needs scroll-linking that CSS `scroll-timeline` cannot do. Try CSS first. |
| 4 | `progressive-disclosure-dashboards` | The density model, if it grows past a single toggle. |
| all | `unslop rewrite` | Every line of user-facing copy, and this document. Voice comes from `D:\Claude\Writing\voice-dna.json` first, unslop second. |

---

## The five inventions

These are the parts no reference page and no competitor template has. They are the reason to ship this rather than fork `bchiang7/v4`.

### 1. The evidence chip [MINE, from VAULT `Grounding UI cites the span, not the document`]

A grounded AI answer cites the span, not the document, because a citation you cannot check is decoration. The same argument applies to a portfolio metric. `94% precision@5` is a claim; `94% precision@5, measured on 50k docs, harness linked` is evidence.

So every `Metric` renders as a chip whose measurement context is always present and whose `artifact` link resolves to the thing that proves it. No hover-only reveal, because hover does not exist on the phone a recruiter is holding.

### 2. Maturity as a state, not a badge [MINE, from VAULT `Confidence UX represents uncertainty as an affordance`]

The research demands that a missing live demo be visually obvious. Most templates solve this by omitting the field, which hides the gap. Instead, `System.maturity` is a required enum and it drives the card's entire treatment:

| Maturity | Treatment |
|---|---|
| `deployed` | Live demo link is the primary action |
| `shipped` | Repo is primary, demo slot renders "no public instance" |
| `prototype` | Card runs at reduced contrast, demo slot renders "not deployed" |
| `archived` | Card is muted, dated, and sorts last |

This turns the research's requirement into a system state with four cases rather than an absent-field special case, which satisfies the four-states rule from the vault.

### 3. The decision record as a fixed grammar [MINE]

Five decision records written as prose are five paragraphs nobody reads. The same five in a fixed four-part grammar scan as a table:

```
chose  <decision>
over   <alternatives>
because <rationale>
cost   <tradeoff>
```

The `cost` line is never optional and never collapsed. It is the field that separates mid from senior, so the layout should make its absence impossible rather than merely discouraged.

### 4. The scan-path rail [MINE, from INV tier model]

The research says the F-pattern's third movement is a vertical scan down the left edge catching line-starts. So put something at the left edge worth catching: a hairline rail marking which tier the reader is in, `Filter / Hook / Depth`. It is a progress indicator that also teaches the page's structure, and it makes the tier model an affordance instead of a doc.

Uses `--layer-*` tokens per the z-index budget note. CSS `scroll-timeline` first, `gsap-scrolltrigger` only if that fails.

### 5. The retrieval field [MINE, adapted from the Dhairya loss surface]

`docs/Portfolio Website/assets/js/landscape.js` draws a real SGD run on a three-basin loss surface, and it sometimes lands in a local minimum, which is the point. It is the best idea in that folder: the background is the work, not decoration.

The adaptation: the positioning line claims retrieval systems, so the hero field renders retrieval. A 2D projection of an embedding space, a query vector, the top-k neighbours ranked and connected, redrawing on a slow loop with a new query. Reads colours from CSS custom properties so it repaints on theme change, exactly as the original does.

It also reuses the existing `LabVisual.astro` heatmap machinery rather than adding a second canvas abstraction.

---

## File structure

```
src/
  content.config.ts                MODIFY  maturity, location, workMode, publications, testimonials
  config/
    site.ts                        MODIFY  email fix, timezone, pronouns, proofRow
  content/
    systems/*.md                   MODIFY  4 files, Dhairya content, maturity added
    roles/*.md                     MODIFY  3 files, location + workMode added
    posts/*.md                     MODIFY  4 files, Dhairya's queue with real status
    testimonials/*.md              CREATE  new collection, attribution required
  components/portfolio/
    ProofRow.astro                 CREATE  Tier 1 gap. [REF] Lorenzo
    DensityToggle.astro            CREATE  [REF] Chánh Đại "Less / More"
    ScanRail.astro                 CREATE  [MINE] invention 4
    EvidenceChip.astro             CREATE  [MINE] invention 1
    Diagram.astro                  CREATE  Tier 3 gap, inline SVG + mermaid escape
    RetrievalField.astro           CREATE  [MINE] invention 5
    CollectionCount.astro          CREATE  [REF] Fayaz "9 things I built"
    Identity.astro                 MODIFY  local time, pronouns, copy affordance
    MetricStrip.astro              MODIFY  render via EvidenceChip
    RoleTimeline.astro             MODIFY  [REF] Ramkrishna two-column row
    SystemCard.astro               MODIFY  maturity treatment
    DecisionList.astro             MODIFY  fixed four-part grammar
    PostList.astro                 MODIFY  excerpt not summary
  pages/
    portfolio.astro                MODIFY  section order, rail, density
    resume.astro                   CREATE  Phase 3
  styles/
    theme.css                      MODIFY  semantic motion tokens, layer scale, optical nudges
  scripts/
    density.ts                     CREATE  toggle state, URL-persisted
    retrieval-field.ts             CREATE  canvas loop
```

Files that change together live together. The three interactive scripts sit in `src/scripts/` because that directory already exists and Astro will not bundle them into the server build.

---

# Phase 0: correctness

One task. It ships alone and it is embarrassing until it does.

### Task 0: Fix the identity fields

**Files:**
- Modify: `src/config/site.ts:9`

- [ ] **Step 1: Read the current values**

Run: `sed -n '1,14p' src/config/site.ts`
Expected: `email: "aniket@armoriq.io"` on line 9, which is the wrong person.

- [ ] **Step 2: Correct the email and add the new identity fields**

```ts
export const site = {
  name: "Ashutosh Rana",
  role: "AI Engineer",
  builds: "retrieval systems and agent pipelines that hold up past the demo",
  availability: "Open to AI engineering roles",
  location: "India",
  timezone: "Asia/Kolkata",
  pronouns: "he/him",
  email: "ashutosh@armoriq.io",
  url: "https://example.dev",
  /** Tier 1 recognition shortcut. Names, or outcome scale if no names. */
  proofRow: {
    label: "Previously at",
    items: ["ArmorIQ", "Ivish AI", "Shopstr"],
    note: "design and frontend, shipped to production",
  },
};
```

- [ ] **Step 3: Verify the hero renders the corrected address**

Run: `curl -s http://localhost:4321/portfolio | grep -o 'ashutosh@armoriq.io' | head -1`
Expected: `ashutosh@armoriq.io`

- [ ] **Step 4: Commit**

```bash
git add src/config/site.ts
git commit -m "fix: correct the hero email and add identity fields"
```

---

# Phase 1: tokens and motion

Extend the existing system. `theme.css` already declares four durations and two curves, so adding a third curve requires an argument, not a preference.

### Task 1: Add semantic motion tokens, the layer scale, and optical nudges

**Files:**
- Modify: `src/styles/theme.css`

**Why:** [VAULT `Motion tokens are a language, not a decoration`] Primitives name physics, semantics name intent. The file currently has primitives only, so every component picks its own duration and the system drifts on the next component. [VAULT `Sticky UI needs a z-index budget`] The dock, toast, and incoming rail are three stacked surfaces with no budget between them.

- [ ] **Step 1: Confirm what already exists before adding**

Run: `grep -cE "cubic-bezier" src/styles/*.css src/components/portfolio/*.astro`
Expected: matches only in `theme.css`. Any match in a component is drift and gets folded into a token in Task 2.

- [ ] **Step 2: Add the semantic layer, the third curve, the layer scale, and the nudges**

Append inside the existing `@theme` block, after the `--duration-*` aliases:

```css
  /* ---- motion: semantics name the job, primitives name the physics ----
     Adding a fourth curve means the scale is wrong, not that we need more.
     --ease-exit earns its place because arrival and departure are different
     statements: ease-out is a verb of arrival, ease-exit commits then stops. */
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);

  --motion-hover: var(--duration-fast) var(--ease-out);
  --motion-reveal: var(--duration-slow) var(--ease-out);
  --motion-disclose: var(--duration-moderate) var(--ease-out);
  --motion-dismiss: var(--duration-fast) var(--ease-exit);
  --motion-density: var(--duration-moderate) var(--ease-in-out);

  /* Stagger stays at one value. Choreography is rhythm, not variety. */
  --stagger-step: 40ms;
  --stagger-cap: 8;

  /* ---- layer budget: every stacked surface names its floor ---- */
  --layer-rail: 10;
  --layer-dock: 40;
  --layer-toast: 60;

  /* ---- optical nudges, tokenized so they survive code review ----
     A chip label sits 1px low because descenders drag the baseline down.
     Named, so the next reader does not "fix" it. */
  --nudge-y-chip-label: -1px;
  --nudge-x-arrow-trailing: 1px;

  /* ---- radius: inner = outer minus padding. One subtraction. ---- */
  --radius-chip: 0.375rem;
  --spacing-card-pad: 0.5rem;
```

- [ ] **Step 3: Verify the reduced-motion block is still present and unconditional**

Run: `grep -A6 "prefers-reduced-motion" src/styles/theme.css`
Expected: a block setting `animation-duration` and `transition-duration` to `0.01ms !important`. If it is missing, stop and add it. This is not optional polish; overshoot animations are genuinely nauseating with a vestibular disorder.

- [ ] **Step 4: Verify Tailwind generates the new utilities**

Run: `curl -s http://localhost:4321/portfolio > /dev/null && curl -s "http://localhost:4321/_astro/" -o /dev/null -w "%{http_code}"`

Then check the served CSS actually contains the token:

Run: `curl -s http://localhost:4321/portfolio | grep -oE 'ease-exit|layer-dock' | sort -u`
Expected: both names appear. If `@theme` did not process them, the raw at-rule leaks and nothing generates.

- [ ] **Step 5: Commit**

```bash
git add src/styles/theme.css
git commit -m "feat(tokens): semantic motion, layer budget, optical nudges"
```

### Task 2: Replace every raw motion value in components with a semantic token

**Files:**
- Modify: `src/styles/theme.css:95-240` and any component with a `transition` declaration

**Why:** [motion-system verify step] Zero hardcoded durations in component files, and only compositor-safe properties transitioned.

- [ ] **Step 1: Count the drift before changing anything**

Run: `grep -nE "transition:|animation:" src/styles/theme.css src/components/portfolio/*.astro`

Record the count. Report it in the commit message, in the form the motion-system skill asks for: "Found N distinct declarations, consolidating to the semantic set."

- [ ] **Step 2: Map each declaration to a semantic token**

Rewrite each. Example, the existing card hover at `theme.css:102`:

```css
  /* before */
  transition:
    transform var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-moderate) var(--ease-out);

  /* after */
  transition:
    transform var(--motion-hover),
    box-shadow var(--motion-hover);
```

- [ ] **Step 3: Assert no layout property is transitioned**

Run: `grep -nE "transition:[^;]*(width|height|top|left|margin|padding)" src/styles/theme.css src/components/portfolio/*.astro`
Expected: no output. Layout properties trigger layout on every frame. Use `transform` and `opacity`, which run on the compositor.

The one exception is the accordion, which needs `grid-template-rows`. That transition is permitted and belongs on `grid-template-rows` only, with padding on the inner element and never on the `0fr` track, or the panel keeps a residual height strip and never fully closes.

- [ ] **Step 4: Assert no `transition: all` survives**

Run: `grep -n "transition: all" src/styles/theme.css src/components/portfolio/*.astro`
Expected: no output. `all` means unrelated style changes ride along for free.

- [ ] **Step 5: Commit**

```bash
git add src/styles/theme.css src/components/portfolio/
git commit -m "refactor(motion): route every transition through a semantic token"
```

---

# Phase 2: the five content surfaces

Each task closes one gap named in `docs/CONTENT-INVENTORY.md` §7. They are ordered by where they sit on the page, because a Tier 1 gap is worth more than a Tier 3 one.

### Task 3: Proof row

**Files:**
- Create: `src/components/portfolio/ProofRow.astro`
- Modify: `src/pages/portfolio.astro`

**Why:** [INV Tier 1 row 4] The one thing Lorenzo does better than the current build. [REF] He runs `Clients include: N26, Booking.com, Dyson, TBWA, and ID&T` inline in the prose rather than as a logo wall, which reads as confident instead of as a trust badge. Research: a recognition shortcut, and if there are no name brands, substitute outcome scale.

- [ ] **Step 1: Write the component**

```astro
---
import { site } from "../../config/site";
const { label, items, note } = site.proofRow;
---

{items.length > 0 && (
  <p class="proof text-sm text-ink-3">
    <span class="text-ink-2">{label}</span>{" "}
    {items.map((name, i) => (
      <>
        <span class="text-ink">{name}</span>
        {i < items.length - 2 ? ", " : i === items.length - 2 ? ", and " : ""}
      </>
    ))}
    {note && <span class="block text-ink-4 mt-1">{note}</span>}
  </p>
)}

<style>
  /* Inline run, not a logo wall. The names are the signal; boxing them
     in cards makes three names look like a thin logo wall. */
  .proof {
    max-width: 46ch;
    text-wrap: pretty;
  }
</style>
```

- [ ] **Step 2: Mount it directly under the positioning line**

In `src/pages/portfolio.astro`, immediately after `<Identity />` and before `<MetricStrip />`:

```astro
import ProofRow from "../components/portfolio/ProofRow.astro";
...
<Identity />
<ProofRow />
<MetricStrip metrics={heroMetrics} />
```

Order matters: positioning, then recognition, then numbers. The research puts recognition before measurement because a recruiter pattern-matches a company name faster than they parse a metric.

- [ ] **Step 3: Verify it renders above the fold**

Run:
```bash
curl -s http://localhost:4321/portfolio | grep -o 'Previously at' | head -1
```
Expected: `Previously at`

Then load the page in a browser at 1440x900 and confirm the proof row is visible without scrolling. A Tier 1 element below the fold is a Tier 3 element.

- [ ] **Step 4: Commit**

```bash
git add src/components/portfolio/ProofRow.astro src/pages/portfolio.astro
git commit -m "feat(portfolio): proof row under the positioning line"
```

### Task 4: Identity block additions

**Files:**
- Modify: `src/components/portfolio/Identity.astro`
- Create: `src/scripts/copy-email.ts`

**Why:** [REF] Chánh Đại prints `Ho Chi Minh City, Viet Nam`, `04:18 AM // 1h ahead`, and `he/him`. The local time is a better availability signal than a status dot, because it tells a recruiter in a different timezone whether to expect a reply today. [REF] Ramkrishna puts a copy affordance directly on the email. [transitions-dev `04-text-states-swap`] The copy confirmation swaps text in place rather than firing a toast, because a toast for a copy action is a heavier surface than the action deserves.

- [ ] **Step 1: Add the meta row to Identity.astro**

Inside the identity block, after the email line:

```astro
---
import { site } from "../../config/site";

// Rendered server-side as a fallback, then corrected client-side.
// A server-rendered clock is wrong the moment it is cached, so the
// static value is a placeholder and the script owns the truth.
const serverTime = new Intl.DateTimeFormat("en-US", {
  timeZone: site.timezone,
  hour: "numeric",
  minute: "2-digit",
}).format(new Date());
---

<p class="meta text-sm text-ink-3">
  <span>{site.location}</span>
  <span aria-hidden="true">·</span>
  <span data-local-time data-tz={site.timezone}>{serverTime} local</span>
  <span aria-hidden="true">·</span>
  <span>{site.pronouns}</span>
</p>
```

- [ ] **Step 2: Write the clock and copy script**

Create `src/scripts/copy-email.ts`:

```ts
/* Local time, corrected client-side, plus the copy affordance.
   Both are progressive enhancements: the page is complete without them. */

function paintLocalTime() {
  const el = document.querySelector<HTMLElement>("[data-local-time]");
  if (!el) return;
  const tz = el.dataset.tz;
  if (!tz) return;

  const now = new Date();
  const there = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
  }).format(now);

  // Offset in whole hours, from the viewer's clock to mine.
  const mine = new Date(now.toLocaleString("en-US", { timeZone: tz }));
  const diff = Math.round((mine.getTime() - now.getTime()) / 3_600_000);

  const rel =
    diff === 0 ? "same time as you"
    : diff > 0 ? `${diff}h ahead`
    : `${Math.abs(diff)}h behind`;

  el.textContent = `${there} local, ${rel}`;
}

function wireCopy() {
  const btn = document.querySelector<HTMLButtonElement>("[data-copy-email]");
  if (!btn) return;
  const value = btn.dataset.copyEmail;
  if (!value) return;

  const label = btn.querySelector<HTMLElement>("[data-copy-label]");
  if (!label) return;
  const resting = label.textContent ?? "";

  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return; // A denied clipboard is not an error worth surfacing.
    }
    // Reflow between removal and re-addition, or the animation will not replay.
    label.classList.remove("is-swapped");
    void label.offsetWidth;
    label.textContent = "copied";
    label.classList.add("is-swapped");

    window.setTimeout(() => {
      label.textContent = resting;
      label.classList.remove("is-swapped");
    }, 1400);
  });
}

paintLocalTime();
window.setInterval(paintLocalTime, 30_000);
wireCopy();
```

- [ ] **Step 3: Add the text-swap CSS**

In `src/styles/theme.css`, in the components layer:

```css
  [data-copy-label] {
    display: inline-block;
    transition:
      opacity var(--motion-hover),
      filter var(--motion-hover),
      transform var(--motion-hover);
  }

  [data-copy-label].is-swapped {
    animation: label-swap var(--duration-moderate) var(--ease-out) both;
  }

  @keyframes label-swap {
    from {
      opacity: 0;
      filter: blur(2px);
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      filter: blur(0);
      transform: none;
    }
  }
```

The 4px distance and 2px blur are the `transitions-dev` text-swap values. They are small on purpose: a copy confirmation should register without pulling the eye off the page.

- [ ] **Step 4: Verify in a browser, not with curl**

Load `/portfolio`, click the email, confirm the label swaps to `copied` and reverts. Then read the console. A clipboard failure in an insecure context is silent by design here, so an empty console is the pass condition.

Run: check the served HTML has the fallback time so the block is never empty:
```bash
curl -s http://localhost:4321/portfolio | grep -oE 'local</span>' | head -1
```
Expected: one match.

- [ ] **Step 5: Commit**

```bash
git add src/components/portfolio/Identity.astro src/scripts/copy-email.ts src/styles/theme.css
git commit -m "feat(identity): local time, pronouns, and a copy affordance"
```

### Task 5: Role timeline, two-column row

**Files:**
- Modify: `src/content.config.ts` (roles schema)
- Modify: `src/components/portfolio/RoleTimeline.astro`
- Modify: `src/content/roles/*.md`

**Why:** [REF] Ramkrishna's row is the best version on the board: company in bold with a status pill, title beneath, and dates plus location right-aligned on the same line. Location and work mode are two fields recruiters filter on and the current schema has neither.

- [ ] **Step 1: Extend the roles schema**

In `src/content.config.ts`, inside the `roles` collection schema:

```ts
    /** City, country. Recruiters filter on this. */
    location: z.string().optional(),
    /** How the work happened. Also a filter. */
    workMode: z.enum(["on-site", "remote", "hybrid"]).optional(),
```

- [ ] **Step 2: Add the fields to the three role files**

Run: `ls src/content/roles/`

For each, add the two keys. Example:

```yaml
---
company: ArmorIQ
title: Design Engineer
start: 2026-04
impact: Rebuilt the platform frontend on a token system with an enforcement rail
location: Remote
workMode: remote
stack: [React, TypeScript, Tailwind]
order: 1
---
```

- [ ] **Step 3: Render the two-column row**

```astro
---
import { getCollection } from "astro:content";
const roles = (await getCollection("roles")).sort(
  (a, b) => a.data.order - b.data.order
);
const fmt = (d: string) =>
  new Date(`${d}-01`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
---

<ul class="roles">
  {roles.map(({ data: r }) => (
    <li class="role">
      <div class="role-left">
        <p class="role-company">
          <span class="text-ink font-medium">{r.company}</span>
          {!r.end && (
            <span class="pill" data-live>
              <span class="dot" aria-hidden="true"></span>Working
            </span>
          )}
        </p>
        <p class="text-sm text-ink-3">{r.title}</p>
      </div>
      <div class="role-right text-sm text-ink-3">
        <p>{fmt(r.start)} - {r.end ? fmt(r.end) : "Present"}</p>
        {r.location && (
          <p class="text-ink-4">
            {r.location}{r.workMode && ` (${r.workMode})`}
          </p>
        )}
      </div>
      <p class="role-impact text-sm text-ink-2">{r.impact}</p>
    </li>
  ))}
</ul>

<style>
  .role {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.25rem 1.5rem;
    padding-block: 1rem;
    border-bottom: 1px solid var(--color-line-2);
  }
  .role-right { text-align: right; }
  /* The impact line spans both columns so it reads as prose, not as a cell. */
  .role-impact { grid-column: 1 / -1; margin-top: 0.375rem; }

  .pill {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    margin-left: 0.5rem;
    padding: 0.0625rem 0.375rem;
    /* inner radius = outer minus padding, per the concentric-radii rule */
    border-radius: var(--radius-chip);
    background: var(--color-sunken);
    font-size: 0.6875rem;
    /* descenders drag the baseline low; the nudge is tokenized */
    transform: translateY(var(--nudge-y-chip-label));
  }
  .dot {
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 9999px;
    background: var(--color-measured);
  }

  @media (max-width: 40rem) {
    .role { grid-template-columns: 1fr; }
    .role-right { text-align: left; }
  }
</style>
```

- [ ] **Step 4: Verify the row renders both columns and collapses on mobile**

Run: `curl -s http://localhost:4321/portfolio | grep -oE '\(remote\)|\(on-site\)' | head -3`
Expected: at least one match.

Then load at 1440 wide and confirm dates sit right-aligned, and at 390 wide and confirm the right column has moved under the left rather than wrapping mid-line.

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts src/content/roles src/components/portfolio/RoleTimeline.astro
git commit -m "feat(roles): two-column row with location and work mode"
```

### Task 6: Maturity states on the system card

**Files:**
- Modify: `src/content.config.ts` (systems schema)
- Modify: `src/components/portfolio/SystemCard.astro`
- Modify: `src/content/systems/*.md`

**Why:** [MINE invention 2] The research demands that a missing live demo be obvious. A required four-case enum makes that a system state rather than an absent-field special case, which is what the four-states rule from the vault asks for.

- [ ] **Step 1: Add the required enum**

In the `systems` schema:

```ts
    /**
     * Required, and it drives the card's whole treatment. A missing
     * live demo has to read as a gap, so the absence gets a name
     * rather than a silent omission.
     */
    maturity: z.enum(["deployed", "shipped", "prototype", "archived"]),
```

- [ ] **Step 2: Run the build and watch it fail**

Run: `npx astro check 2>&1 | tail -20`
Expected: a Zod error per system file, naming `maturity` as required. This failure is the point: the schema now refuses content that dodges the question.

- [ ] **Step 3: Set maturity on every system file**

Add `maturity:` to each of the four files in `src/content/systems/`. Using the Dhairya content from Task 10, PathOS is `deployed` (400+ Hugging Face downloads, runs on a Pi), Astrophage is `shipped`, NyayaSetu is `prototype`, the upstream tooling PRs are `shipped`.

- [ ] **Step 4: Render the four treatments**

In `SystemCard.astro`:

```astro
---
const { system } = Astro.props;
const m = system.maturity;

const demoSlot = {
  deployed: { text: "Open the live demo", tone: "primary" },
  shipped: { text: "No public instance", tone: "muted" },
  prototype: { text: "Not deployed", tone: "gap" },
  archived: { text: "Archived", tone: "muted" },
}[m];
---

<article class="system" data-maturity={m}>
  <!-- ...existing card content... -->

  <p class="demo" data-tone={demoSlot.tone}>
    {m === "deployed" && system.liveDemo
      ? <a href={system.liveDemo}>{demoSlot.text}</a>
      : <span>{demoSlot.text}</span>}
  </p>
</article>

<style>
  /* prototype reads at reduced contrast; the gap is meant to feel like one */
  .system[data-maturity="prototype"] { opacity: 0.82; }
  .system[data-maturity="archived"] { opacity: 0.62; }

  .demo[data-tone="gap"] {
    color: var(--color-caution);
    /* A dotted rule reads as "absent by admission" rather than as a link. */
    border-bottom: 1px dotted currentColor;
    align-self: start;
  }
  .demo[data-tone="muted"] { color: var(--color-ink-4); }
</style>
```

- [ ] **Step 5: Verify all four states render and the check passes**

Run: `npx astro check 2>&1 | tail -5`
Expected: `0 errors`.

Run: `curl -s http://localhost:4321/portfolio | grep -oE 'data-maturity="[a-z]+"' | sort -u`
Expected: at least `deployed`, `shipped`, `prototype`.

- [ ] **Step 6: Commit**

```bash
git add src/content.config.ts src/content/systems src/components/portfolio/SystemCard.astro
git commit -m "feat(systems): maturity as a required state with four treatments"
```

### Task 7: Decision records in a fixed grammar

**Files:**
- Modify: `src/components/portfolio/DecisionList.astro`

**Why:** [MINE invention 3] Five decision records as prose are five paragraphs nobody reads. A fixed four-part grammar makes five of them scan as a table, and it makes the `cost` line structurally unskippable.

- [ ] **Step 1: Render the grammar**

```astro
---
const { decisions } = Astro.props;
---

<ol class="decisions">
  {decisions.map((d) => (
    <li class="decision">
      <dl>
        <dt>chose</dt>
        <dd class="text-ink font-medium">{d.decision}</dd>

        <dt>over</dt>
        <dd>{d.alternatives.join(", ")}</dd>

        <dt>because</dt>
        <dd>{d.rationale}</dd>

        <dt>cost</dt>
        <dd class="cost">{d.tradeoff}</dd>
      </dl>

      {d.secondOrder.length > 0 && (
        <ul class="second-order">
          {d.secondOrder.map((s) => <li>{s}</li>)}
        </ul>
      )}
    </li>
  ))}
</ol>

<style>
  .decision dl {
    display: grid;
    /* The label column is fixed so four rows align across every record,
       which is what turns five paragraphs into one scannable table. */
    grid-template-columns: 4.5rem 1fr;
    gap: 0.25rem 0.75rem;
    font-size: 0.875rem;
  }
  .decision dt {
    color: var(--color-ink-4);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    text-align: right;
    padding-top: 0.125rem;
  }
  .decision dd { color: var(--color-ink-2); }

  /* cost is never muted. It is the field that separates mid from senior. */
  .cost { color: var(--color-caution); }

  .second-order {
    margin-top: 0.5rem;
    margin-left: 5.25rem;
    font-size: 0.8125rem;
    color: var(--color-ink-3);
  }

  @media (max-width: 34rem) {
    .decision dl { grid-template-columns: 1fr; }
    .decision dt { text-align: left; }
    .second-order { margin-left: 0; }
  }
</style>
```

- [ ] **Step 2: Verify the four labels appear for each record**

Run: `curl -s http://localhost:4321/work/grounded-answers | grep -oE '<dt>(chose|over|because|cost)</dt>' | sort | uniq -c`
Expected: an equal count for all four labels. An unequal count means a record is rendering partially.

- [ ] **Step 3: Commit**

```bash
git add src/components/portfolio/DecisionList.astro
git commit -m "feat(decisions): fixed four-part grammar, cost never muted"
```

### Task 8: Architecture diagram slot

**Files:**
- Create: `src/components/portfolio/Diagram.astro`
- Modify: `src/content.config.ts`

**Why:** [INV Tier 3 row 15] Zero of the four references has one, and the research says a diagram legible in 15 seconds without reading prose. It is Tier 3's fastest read and the largest single differentiator left.

- [ ] **Step 1: Add the schema**

```ts
const diagram = z.object({
  /** Inline SVG is default. Mermaid is the escape hatch for flows. */
  kind: z.enum(["svg", "mermaid"]),
  source: z.string(),
  /** Required. A diagram with no alt text is decoration. */
  alt: z.string(),
  caption: z.string().optional(),
});
```

Then on the `systems` schema: `diagram: diagram.optional(),`

- [ ] **Step 2: Write the component**

```astro
---
const { diagram } = Astro.props;
---

<figure class="diagram">
  {diagram.kind === "svg" ? (
    <div role="img" aria-label={diagram.alt} set:html={diagram.source} />
  ) : (
    <pre class="mermaid" aria-label={diagram.alt}>{diagram.source}</pre>
  )}
  {diagram.caption && (
    <figcaption class="text-sm text-ink-3">{diagram.caption}</figcaption>
  )}
</figure>

<style>
  .diagram {
    margin-block: 1.5rem;
    padding: 1rem;
    border: 1px solid var(--color-line);
    /* outer 16, padding 16, so any inner shape wants radius 0.
       Nothing nests here, so the outer radius stands alone. */
    border-radius: var(--radius-card);
    background: var(--color-surface);
    /* Wide diagrams scroll inside their own box. The page body must
       never scroll horizontally. */
    overflow-x: auto;
  }
  .diagram :global(svg) {
    max-width: 100%;
    height: auto;
    /* Strokes read from tokens, so the diagram repaints on theme change
       instead of being a light-mode image sitting in a dark page. */
    stroke: var(--color-ink-3);
  }
  .diagram :global(svg text) {
    fill: var(--color-ink-2);
    font-family: var(--font-mono);
    font-size: 11px;
  }
</style>
```

- [ ] **Step 3: Author one real diagram for the featured system**

Add to the featured system's frontmatter. The 15-second test means four nodes and three edges, not fifteen:

```yaml
diagram:
  kind: svg
  alt: "Query enters a hybrid retriever, dense and sparse results merge through a reranker, then the reader generates a grounded answer"
  caption: "Hybrid retrieval. The reranker is where the precision came from."
  source: |
    <svg viewBox="0 0 640 120" fill="none" stroke-width="1.25">
      <rect x="8" y="42" width="96" height="36" rx="6"/>
      <text x="56" y="64" text-anchor="middle">query</text>
      <rect x="168" y="8" width="112" height="36" rx="6"/>
      <text x="224" y="30" text-anchor="middle">dense (qdrant)</text>
      <rect x="168" y="76" width="112" height="36" rx="6"/>
      <text x="224" y="98" text-anchor="middle">sparse (bm25)</text>
      <rect x="344" y="42" width="104" height="36" rx="6"/>
      <text x="396" y="64" text-anchor="middle">reranker</text>
      <rect x="512" y="42" width="112" height="36" rx="6"/>
      <text x="568" y="64" text-anchor="middle">grounded answer</text>
      <path d="M104 60 L140 60 L140 26 L168 26"/>
      <path d="M104 60 L140 60 L140 94 L168 94"/>
      <path d="M280 26 L312 26 L312 60 L344 60"/>
      <path d="M280 94 L312 94 L312 60 L344 60"/>
      <path d="M448 60 L512 60"/>
    </svg>
```

- [ ] **Step 4: Verify it renders and does not overflow the body**

Load `/work/grounded-answers` in a browser at 390 wide. Confirm the diagram scrolls inside its own box and the page body does not scroll sideways.

Run:
```bash
curl -s http://localhost:4321/work/grounded-answers | grep -c 'viewBox="0 0 640 120"'
```
Expected: `1`

- [ ] **Step 5: Commit**

```bash
git add src/components/portfolio/Diagram.astro src/content.config.ts src/content/systems
git commit -m "feat(systems): architecture diagram slot with a token-aware SVG"
```

### Task 9: Evidence chips

**Files:**
- Create: `src/components/portfolio/EvidenceChip.astro`
- Modify: `src/components/portfolio/MetricStrip.astro`
- Modify: `src/content.config.ts` (metric schema)

**Why:** [MINE invention 1] `94% precision@5` is a claim. The same number with its measurement context and a link to the harness is evidence. Pairs with Task 3: both are Tier 1 and both are about making a claim checkable.

The `context` field already exists on the metric schema and is optional. Making it required is the change that matters, because an optional field is a field that gets skipped.

- [ ] **Step 1: Make context required and add the proof link**

In `src/content.config.ts`, replace the `metric` object:

```ts
const metric = z.object({
  value: z.string(),
  label: z.string(),
  unit: z.string().optional(),
  /**
   * Required. A number with no measurement context is unreadable:
   * 94% of what, over what, at what k. This is the whole point of
   * the type, so it is not optional.
   */
  context: z.string(),
  baseline: z.string().optional(),
  /** The artifact that proves it. A harness, a run, a model card. */
  proof: z.string().url().optional(),
});
```

- [ ] **Step 2: Run the check and watch it fail**

Run: `npx astro check 2>&1 | grep -c "context"`
Expected: a non-zero count, one per metric missing context. Fill each one in with what the number was actually measured against. If a number has no honest context, delete the number.

- [ ] **Step 3: Write the chip**

```astro
---
const { metric } = Astro.props;
const { value, label, unit, context, baseline, proof } = metric;
---

<div class="chip">
  <p class="chip-value">
    <span class="num">{value}</span>{unit && <span class="unit">{unit}</span>}
  </p>
  <p class="chip-label">{label}</p>

  <!-- Context is always rendered, never behind a hover. A recruiter on a
       phone has no hover, and this is the half that makes it evidence. -->
  <p class="chip-context">{context}</p>

  {baseline && <p class="chip-baseline">was {baseline}</p>}

  {proof && (
    <a class="chip-proof" href={proof}>
      how this was measured
    </a>
  )}
</div>

<style>
  .chip {
    padding: 0.75rem;
    border: 1px solid var(--color-line);
    /* card 16, padding 12, so nothing inside wants more than 4 */
    border-radius: var(--radius-well);
    background: var(--color-surface);
  }

  /* Numerals stop the F-pattern scan, so they get the weight and the
     tabular figures. Everything else on the chip is support. */
  .num {
    font-size: 1.75rem;
    line-height: 1.05;
    letter-spacing: -0.02em;
    color: var(--color-ink);
    font-variant-numeric: tabular-nums;
  }
  .unit { font-size: 0.875rem; color: var(--color-ink-3); }

  .chip-label { font-size: 0.875rem; color: var(--color-ink-2); }
  .chip-context { font-size: 0.75rem; color: var(--color-ink-4); margin-top: 0.25rem; }
  .chip-baseline {
    font-size: 0.75rem;
    color: var(--color-measured);
    font-variant-numeric: tabular-nums;
  }

  .chip-proof {
    display: inline-block;
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: var(--color-ink-3);
    border-bottom: 1px solid var(--color-line);
    transition: color var(--motion-hover), border-color var(--motion-hover);
  }
  .chip-proof:hover { color: var(--color-ink); border-color: var(--color-ink-4); }
</style>
```

- [ ] **Step 4: Render MetricStrip through the chip**

```astro
---
import EvidenceChip from "./EvidenceChip.astro";
const { metrics } = Astro.props;
---

<div class="strip">
  {metrics.map((m) => <EvidenceChip metric={m} />)}
</div>

<style>
  .strip {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
    gap: 0.75rem;
  }
</style>
```

- [ ] **Step 5: Verify context renders for every metric, with no hover needed**

Run:
```bash
curl -s http://localhost:4321/portfolio | grep -c 'class="chip-context"'
```
Expected: equal to the number of hero metrics. A count lower than that means a metric slipped through without context.

Then load at 390 wide and confirm every chip shows its context line without interaction.

- [ ] **Step 6: Commit**

```bash
git add src/content.config.ts src/components/portfolio/EvidenceChip.astro src/components/portfolio/MetricStrip.astro
git commit -m "feat(metrics): evidence chips, measurement context now required"
```

---

# Phase 3: content, density, and the rail

### Task 10: Load the Dhairya content as the demo dataset

**Files:**
- Modify: `src/content/systems/*.md`, `src/content/roles/*.md`, `src/content/posts/*.md`
- Create: `src/content/testimonials/`

**Why:** The current content is placeholder. `docs/Portfolio Website/` holds a real, complete AI-engineer dataset (PathOS, Astrophage, NyayaSetu, the upstream PRs, four queued posts with honest `Drafting`/`Outlined` states, a hackathon record, a FAQ). A template demoed with real content sells; one demoed with lorem does not.

The user has said this content is free to modify. Treat it as a starting corpus, not as a person's biography: keep the technical substance, rewrite the copy through `unslop`, and do not carry over Dhairya's name, employer, or contact details.

- [ ] **Step 1: Extract the source copy**

Run:
```bash
node "C:/Users/ashut/AppData/Local/Temp/claude/d--Coding-Portfolio-template/98ebceb4-bbac-43d1-8052-df8367a2717b/scratchpad/extract.js" "docs/Portfolio Website/index.html" > /tmp/dhairya-copy.txt
wc -l /tmp/dhairya-copy.txt
```
Expected: around 190 lines.

- [ ] **Step 2: Map each system into the schema**

PathOS is the featured system and it already satisfies every required field, which is the useful proof that the schema is authorable:

```yaml
---
title: PathOS
outcome: "A distilled Gemma reads an H&E slide and returns a structured diagnosis, offline, on a Raspberry Pi"
maturity: deployed
liveDemo: https://huggingface.co/spaces/example/pathos
relevanceNote: "The hard part was not accuracy, it was making a medical model commit instead of hedge. That is a reward-shaping problem, which is most of applied alignment work."
metrics:
  - value: "19,500"
    label: training samples
    context: histopathology slides, H&E stained
  - value: "4-bit"
    label: quantization
    context: GGUF, via llama.cpp
  - value: "400+"
    label: downloads
    context: Hugging Face, first three months
stack: [Gemma, GRPO, LoRA, constrained decoding, GGUF, llama.cpp, Ollama]
featured: true
order: 1
---
```

The `decisions` entry that makes the four-part grammar earn its keep:

```yaml
decisions:
  - decision: Forced a structured read with GRPO reward shaping and constrained decoding
    alternatives: ["a longer system prompt", "few-shot examples", "a larger base model"]
    rationale: "Left alone the model hedges, because hedging is what the training data rewards. Prompting cannot outvote the reward signal."
    tradeoff: "Gave up the model's ability to say it does not know, so the abstain path had to be handled outside the model."
    secondOrder:
      - "Structured output made 4-bit quantization survivable, because there was less free-form text to degrade"
      - "The abstain path became a threshold on the decoder, which is auditable in a way a hedged paragraph is not"
```

- [ ] **Step 3: Carry the post queue over with its honest states**

Dhairya's writing section shows four posts with real statuses (`In progress`, `Drafting`, `Outlined`, `Outlined`). That is better than an empty writing section and better than four fake published posts. Keep the pattern:

```yaml
---
title: "What reward shaping is really doing to your model"
description: "GRPO from the ground up, using the anti-hedging reward that made a diagnostic model commit."
status: draft
tags: [rl, grpo, evaluation]
---
```

- [ ] **Step 4: Create the testimonials collection with attribution required**

Per `docs/CONTENT-INVENTORY.md` §4, a quote earns a slot only with a credential attached. Chánh Đại ships roughly ten unattributed ones, and they dilute the four that carry weight.

```ts
const testimonials = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/testimonials" }),
  schema: z.object({
    quote: z.string(),
    author: z.string(),
    /** Required. An unattributed quote is not evidence. */
    credential: z.string(),
    url: z.string().url().optional(),
    order: z.number().default(99),
  }),
});
```

Register it: `export const collections = { systems, roles, posts, lab, testimonials };`

- [ ] **Step 5: Run unslop over every line of new copy**

Run:
```bash
python ~/.claude/skills/unslop/scripts/banned_phrase_scan.py src/content/systems/pathos.md
python ~/.claude/skills/unslop/scripts/structure_scan.py src/content/systems/pathos.md
python ~/.claude/skills/unslop/scripts/silhouette_scan.py src/content/systems/pathos.md
```
Expected: zero violations across all three. Report what they actually returned. A clean run is the correct output, not a sign the scan did nothing.

- [ ] **Step 6: Verify the build and every route**

Run:
```bash
npx astro check 2>&1 | tail -3
for p in / /portfolio /work/pathos /work/astrophage /work/nyayasetu; do
  printf "%s  %s\n" "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:4321$p)" "$p"
done
```
Expected: `0 errors`, then `200` for every route.

- [ ] **Step 7: Commit**

```bash
git add src/content src/content.config.ts
git commit -m "content: real AI-engineer dataset, testimonials require attribution"
```

### Task 11: Density toggle

**Files:**
- Create: `src/components/portfolio/DensityToggle.astro`, `src/scripts/density.ts`
- Modify: `src/pages/portfolio.astro`, `src/styles/theme.css`

**Why:** [REF] The single best idea on the reference board. Chánh Đại's `Less / More` control is progressive disclosure applied to a whole page, and it resolves the research's central tension directly: the recruiter and the hiring manager want opposite densities, and every previous resolution in this doc chain has been spatial. This one is user-selected.

[MINE] The addition: state persists to the URL as `?d=less`, so the link itself can carry a density. A recruiter link and a hiring-manager link become the same page with different query strings.

[VAULT `Progressive disclosure has four canonical mechanisms, pick by weight of the reveal`] This is the lightest mechanism, an inline toggle, because the content is already on the page and nothing is being fetched.

- [ ] **Step 1: Write the toggle**

```astro
---
/* Two states, not a slider. A slider implies a continuum the content
   does not have: a section is either in the filter or it is depth. */
---
<div class="density" role="group" aria-label="Page detail">
  <button type="button" data-density="less" aria-pressed="false">Less</button>
  <button type="button" data-density="more" aria-pressed="true">More</button>
  <span class="density-pill" aria-hidden="true"></span>
</div>
```

- [ ] **Step 2: Write the state script**

```ts
/* Density is a document-level attribute. CSS owns every consequence,
   so adding a section to the "depth" tier is a markup change, not a
   change here. */

type Density = "less" | "more";

const KEY = "density";

function read(): Density {
  const fromUrl = new URLSearchParams(location.search).get("d");
  if (fromUrl === "less" || fromUrl === "more") return fromUrl;
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === "less" || stored === "more") return stored;
  } catch {
    // Private windows and blocked site data both throw. Fall through.
  }
  return "more";
}

function write(d: Density) {
  document.documentElement.dataset.density = d;

  for (const btn of document.querySelectorAll<HTMLButtonElement>("[data-density]")) {
    btn.setAttribute("aria-pressed", String(btn.dataset.density === d));
  }

  try {
    localStorage.setItem(KEY, d);
  } catch {
    // Not fatal. The attribute is already applied.
  }

  const url = new URL(location.href);
  if (d === "more") url.searchParams.delete("d");
  else url.searchParams.set("d", d);
  history.replaceState(null, "", url);
}

write(read());

for (const btn of document.querySelectorAll<HTMLButtonElement>("[data-density]")) {
  btn.addEventListener("click", () => {
    const next = btn.dataset.density;
    if (next === "less" || next === "more") write(next);
  });
}
```

- [ ] **Step 3: Add the CSS consequences**

```css
  /* Sections declare their tier. Density decides which tiers render.
     grid-template-rows is the one layout property permitted to
     transition, and only here, because there is no transform that
     collapses a box to nothing without leaving a gap. */
  [data-tier="depth"] {
    display: grid;
    grid-template-rows: 1fr;
    transition: grid-template-rows var(--motion-density);
  }

  html[data-density="less"] [data-tier="depth"] {
    grid-template-rows: 0fr;
  }

  [data-tier="depth"] > * {
    overflow: hidden;
    min-height: 0;
  }

  /* The sliding pill, per transitions-dev 16-tabs-sliding. Written
     without a transition on first paint, or it animates in from zero. */
  .density { position: relative; display: inline-flex; }
  .density-pill {
    position: absolute;
    inset-block: 0;
    border-radius: var(--radius-chip);
    background: var(--color-sunken);
    transition:
      transform var(--motion-hover),
      width var(--motion-hover);
    z-index: -1;
  }
```

- [ ] **Step 4: Tag every section with its tier**

In `src/pages/portfolio.astro`, add `data-tier` to each `<Section>`. Tiers come from `docs/CONTENT-INVENTORY.md`: identity, proof, metrics, and stack are `filter`; the featured system and role timeline are `hook`; decisions, evals, diagram, lab, posts, and profiles are `depth`.

- [ ] **Step 5: Verify both states and the URL round-trip**

Load `/portfolio?d=less`. Confirm the depth sections are collapsed on first paint with no visible flash of the expanded state. Click `More`, confirm they open and the `?d=` param disappears. Reload and confirm the choice persisted.

Then confirm reduced motion is respected: enable it in the OS, toggle again, and check the change is instant rather than animated.

- [ ] **Step 6: Commit**

```bash
git add src/components/portfolio/DensityToggle.astro src/scripts/density.ts src/pages/portfolio.astro src/styles/theme.css
git commit -m "feat(portfolio): URL-persisted density toggle across three tiers"
```

### Task 12: Scan-path rail

**Files:**
- Create: `src/components/portfolio/ScanRail.astro`
- Modify: `src/pages/portfolio.astro`

**Why:** [MINE invention 4] The F-pattern's third movement is a vertical scan down the left edge catching the first word or two of each line. The research uses that to argue for a visually distinct left edge per block. The rail takes it one step further: put a marker there that names which tier the reader is in, so the page's structure becomes an affordance rather than a fact in a doc.

Try CSS `scroll-timeline` first. Reach for `gsap-scrolltrigger` only if browser support forces it, and say so if it does.

- [ ] **Step 1: Write the rail with a CSS scroll timeline**

```astro
---
const tiers = [
  { id: "filter", label: "Filter" },
  { id: "hook", label: "Hook" },
  { id: "depth", label: "Depth" },
];
---

<nav class="rail" aria-label="Page tiers">
  <ol>
    {tiers.map((t) => (
      <li>
        <a href={`#tier-${t.id}`} data-rail={t.id}>
          <span class="tick" aria-hidden="true"></span>
          <span class="label">{t.label}</span>
        </a>
      </li>
    ))}
  </ol>
</nav>

<style>
  .rail {
    position: fixed;
    left: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
    z-index: var(--layer-rail);
  }

  .tick {
    display: block;
    width: 1rem;
    height: 1px;
    background: var(--color-ink-4);
    transition:
      width var(--motion-hover),
      background-color var(--motion-hover);
  }

  .label {
    /* Hidden until the rail is hovered or a tick is current. The rail
       is a peripheral cue; a permanent label makes it furniture. */
    opacity: 0;
    transition: opacity var(--motion-hover);
    font-size: 0.6875rem;
    font-family: var(--font-mono);
    color: var(--color-ink-3);
  }

  .rail:hover .label,
  a[aria-current="true"] .label { opacity: 1; }

  a[aria-current="true"] .tick {
    width: 1.75rem;
    background: var(--color-ink);
  }

  /* Below the fold-width where the rail would overlap content, drop it.
     A cue that covers the thing it describes is worse than no cue. */
  @media (max-width: 64rem) { .rail { display: none; } }
</style>
```

- [ ] **Step 2: Wire `aria-current` from an IntersectionObserver**

CSS `scroll-timeline` can drive the tick width, but it cannot set `aria-current`, and the rail has to be legible to a screen reader. So the observer owns state and CSS owns appearance:

```ts
const sections = document.querySelectorAll<HTMLElement>("[id^='tier-']");
const links = document.querySelectorAll<HTMLAnchorElement>("[data-rail]");

const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const id = e.target.id.replace("tier-", "");
      for (const l of links) {
        l.setAttribute("aria-current", String(l.dataset.rail === id));
      }
    }
  },
  // Fire when a section crosses the middle of the viewport, which is
  // where a reader's attention actually sits.
  { rootMargin: "-50% 0px -50% 0px" }
);

for (const s of sections) io.observe(s);
```

- [ ] **Step 3: Verify the rail tracks scroll and hides on narrow viewports**

Load `/portfolio` at 1440 wide, scroll through, and confirm exactly one tick is wide at a time. Then resize to 900 wide and confirm the rail is gone rather than overlapping the content.

Run: `curl -s http://localhost:4321/portfolio | grep -oE 'id="tier-[a-z]+"' | sort -u`
Expected: `tier-depth`, `tier-filter`, `tier-hook`.

- [ ] **Step 4: Commit**

```bash
git add src/components/portfolio/ScanRail.astro src/pages/portfolio.astro
git commit -m "feat(portfolio): scan-path rail marking the three tiers"
```

### Task 13: Collection counts and post excerpts

**Files:**
- Create: `src/components/portfolio/CollectionCount.astro`
- Modify: `src/components/portfolio/PostList.astro`, `src/components/portfolio/LabGrid.astro`

**Why:** [REF] Two things Fayaz does better than anyone else on the board. He labels collections with counts (`Travel · 14 places`, `Projects · 9 things I built`, `Bookmarks · 23 posts`) and he prints the actual third paragraph of a post rather than a summary. A count is more scannable than a folder and it makes an empty collection impossible to hide. An excerpt proves you can write, which is the thing Anthropic said it cares about; a summary only says the post exists.

- [ ] **Step 1: Write the count component**

```astro
---
interface Props {
  label: string;
  count: number;
  /** Fayaz's phrasing: a noun, not a unit. "9 things I built". */
  noun: string;
  href?: string;
}
const { label, count, noun, href } = Astro.props;
---

<p class="count">
  {href ? <a href={href} class="count-label">{label}</a> : <span class="count-label">{label}</span>}
  <span aria-hidden="true" class="sep">·</span>
  <span class="count-n">{count} {noun}</span>
</p>

<style>
  .count {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    font-size: 0.875rem;
  }
  .count-label { color: var(--color-ink); }
  .sep { color: var(--color-ink-4); }
  .count-n {
    color: var(--color-ink-3);
    font-variant-numeric: tabular-nums;
  }
</style>
```

- [ ] **Step 2: Render the post list with excerpts and honest status**

The `posts` schema already has `status: "live" | "draft"`. Dhairya's writing section shows the queue with real states, which is better than an empty shelf and better than four fake published posts.

```astro
---
import { getCollection } from "astro:content";
import CollectionCount from "./CollectionCount.astro";

const all = await getCollection("posts");
const live = all.filter((p) => p.data.status === "live");
const queued = all.filter((p) => p.data.status === "draft");
---

<CollectionCount label="Writing" count={live.length} noun="pieces" href="/writing" />

{live.length === 0 && (
  <!-- Empty is a first-run experience, not "nothing to show". The queue
       below is the honest thing to show instead of a blank shelf. -->
  <p class="text-sm text-ink-3">
    Nothing published yet. {queued.length} in the queue, states below.
  </p>
)}

<ul class="posts">
  {live.map((p) => (
    <li class="post">
      <a href={`/writing/${p.id}`} class="post-title">{p.data.title}</a>
      {p.data.description && (
        <p class="post-excerpt text-sm text-ink-2">{p.data.description}</p>
      )}
      <p class="post-meta text-xs text-ink-4">
        {p.data.date && (
          <time datetime={p.data.date.toISOString()}>
            {p.data.date.toLocaleDateString("en-US", {
              month: "long", day: "numeric", year: "numeric",
            })}
          </time>
        )}
        {p.data.readingTime && <span>{p.data.readingTime}</span>}
      </p>
    </li>
  ))}
</ul>

{queued.length > 0 && (
  <ul class="queue">
    {queued.map((p) => (
      <li class="queued">
        <span class="queued-title">{p.data.title}</span>
        <!-- The real state, not "coming soon". "Outlined" is information;
             "coming soon" is a promise with no date on it. -->
        <span class="queued-state">{p.data.stage ?? "queued"}</span>
      </li>
    ))}
  </ul>
)}

<style>
  .post { padding-block: 0.875rem; border-bottom: 1px solid var(--color-line-2); }
  .post-title { color: var(--color-ink); font-weight: 500; }
  /* An excerpt is the argument, so it gets room to be two lines. */
  .post-excerpt { margin-top: 0.25rem; max-width: 58ch; text-wrap: pretty; }
  .post-meta { display: flex; gap: 0.75rem; margin-top: 0.375rem; }

  .queued {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    padding-block: 0.5rem;
    font-size: 0.875rem;
    color: var(--color-ink-3);
  }
  .queued-state {
    font-family: var(--font-mono);
    font-size: 0.6875rem;
    color: var(--color-ink-4);
    transform: translateY(var(--nudge-y-chip-label));
  }
</style>
```

- [ ] **Step 3: Add the `stage` field so the queue states are real**

In `src/content.config.ts`, on the `posts` schema:

```ts
    /** Where a draft actually is. Shown verbatim in the queue. */
    stage: z.enum(["outlined", "drafting", "in progress", "in review"]).optional(),
```

- [ ] **Step 4: Add the count to the lab grid too**

In `LabGrid.astro`, above the grid:

```astro
<CollectionCount label="Lab" count={items.length} noun="explainers" href="/lab" />
```

- [ ] **Step 5: Verify the counts are real and the empty state renders**

Run:
```bash
curl -s http://localhost:4321/portfolio | grep -oE '[0-9]+ (pieces|explainers|things I built)'
```
Expected: counts matching the actual file counts in `src/content/posts` and `src/content/lab`.

Then temporarily set every post to `status: draft`, reload, and confirm the empty state message renders with the queue beneath it rather than a blank section. Revert.

- [ ] **Step 6: Commit**

```bash
git add src/components/portfolio/CollectionCount.astro src/components/portfolio/PostList.astro src/components/portfolio/LabGrid.astro src/content.config.ts
git commit -m "feat(collections): counts on every collection, excerpts and real queue states"
```

---

## Verification before this plan is called done

Walk the list row by row and say what happened to each. Built, or deliberately skipped and why. Not "I built it".

**States**, per `Empty, loading, skeleton, error: four states are the minimum a screen owes`:

| State | Where it has to be handled |
|---|---|
| Empty | Zero systems, zero roles, zero posts, zero testimonials. Each renders a first-run message, not a blank shelf. |
| Partial | A system with no diagram, no evals, no decisions. The section is omitted, except `liveDemo`, whose absence is the point. |
| Loading | Only the retrieval field, which is Phase 4. Everything else is server-rendered. |
| Error | Canvas unsupported, clipboard denied, `localStorage` throwing. All three fail silently and leave a complete page. |

**Edges:**

| Edge | Expected |
|---|---|
| One system, and it is not featured | Build-time warning, and the single system renders in the featured slot anyway |
| Two systems set `featured: true` | Build fails with a named error |
| A 90-character system title | Wraps to two lines, no truncation, no overflow |
| A role with no `end` | Renders `Present` and shows the `Working` pill |
| Fifteen systems | Build warns past six, per the soft cap |
| 390px viewport | No horizontal body scroll on any route |
| Reduced motion on | Density toggle is instant, rail does not animate, no keyframes run |
| JS disabled | Page is complete. Density defaults to `more`, rail is static, email is selectable text |

**Per the engineering rules:**

- [ ] Every route loaded in a real browser, console read, network log read, actual status codes reported
- [ ] `npx astro check` returns 0 errors
- [ ] No `@ts-ignore`, no `as any`, no relaxed config, no deleted test. If one is genuinely right, say which, where, and why in the same response
- [ ] All three unslop scanners run on every content file, with what they actually returned reported

---

## Out of scope, and why

Per the writing-plans scope check, these are separate subsystems and each earns its own plan. Listing them here so the omission is a decision rather than a gap.

| Deferred | Why it splits |
|---|---|
| **Phase 4: the retrieval field** [MINE invention 5] | A canvas render loop with its own performance budget and its own reduced-motion story. Independent of everything above. |
| **Phase 5: resume, three renderings from one source** | `SITE-STRUCTURE.md` §6 already specs it: web view, print stylesheet to PDF, JSON-LD. Touches no file in this plan. |
| **Phase 6: the persona preset system** | `SITE-STRUCTURE.md` §8 lists eight personas. The research validates one. Blocked on the buyer question in `CONTENT-INVENTORY.md` §6, and it is the only phase that is: the tier model, the schema, and every craft decision above hold whichever way that question lands. Only the presets branch. |
| **Anti-pattern build lint** | Tutorial-dataset and me-too-name detection. A real differentiator and a real product decision, since it makes a paying buyer feel judged. Needs a call on whether it defaults on. |
| **OG image generation** | Adds `satori`. One dependency, one route, no overlap. |

## Start here

```bash
git checkout -b portfolio/spine
sed -n '1,14p' src/config/site.ts
```

That is Task 0, Step 1. The email on line 9 belongs to someone else.

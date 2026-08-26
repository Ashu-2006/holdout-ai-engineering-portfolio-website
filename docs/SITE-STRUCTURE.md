# Site Structure & Content Design

Design spec derived from `HIRING-SIGNALS.md`. Every decision below traces to a research
finding; where it doesn't, it's marked **[judgment]**.

**Persona v1: the AI/ML engineer seeking a role.** Built first, built properly.
Everything is designed so that other developer personas (§8) slot in later as *modules*,
not rewrites.

---

## 1. The governing idea: three readers, one page, descending density

The research gave three distinct time budgets (§0 of HIRING-SIGNALS). The page is designed
as three stacked tiers, each serving one reader, each earning the next.

```
┌──────────────────────────────────────────────────┐
│ TIER 1 · THE FILTER            ~5-10s   recruiter│  ← text-first, keyword-dense
│ positioning · stack · metrics · proof            │     NO decoration
├──────────────────────────────────────────────────┤
│ TIER 2 · THE HOOK              ~60-90s  senior IC│  ← one featured system
│ flagship system, fully evidenced                 │     + timeline
├──────────────────────────────────────────────────┤
│ TIER 3 · THE DEPTH             ~5-10m   hiring mgr│ ← folders, case studies,
│ collections, decisions, evals, writing           │    everything explorable
└──────────────────────────────────────────────────┘
```

**The upstream template's folder metaphor lives entirely in Tier 3.** It's charming and it's
the reason we chose this codebase, but it is a *browsing* interface and browsing is a Tier-3
activity (case-study click-through ≈15% engagement). Putting folders first would fail the
5-second filter. Folders become the reward for scrolling, not the gate.

---

## 2. Page-by-page structure

### `/` — the spine

| # | Section | Tier | Rationale |
|---|---|---|---|
| 1 | **Positioning block** | 1 | Role + domain + stack in one H1. Research: unclear role in first 5 words = reject. |

| 3 | **Proof row** | 1 | Company logos or "previously at" line. Recognition shortcut. If no brands → outcome scale. |
| 4 | **Stack registry** | 1 | Named tools, categorized. Must be above fold — recruiters work from a must-have list. |
| 5 | **Featured system** | 2 | ONE flagship, not a grid. Anthropic asks for "a link to the piece of work most relevant." |
| 6 | **Experience timeline** | 2 | Company/title/dates/one-line impact. ~60% engagement; it's why `bchiang7/v4` is the most-forked portfolio. |
| 7 | **Collections (folders)** | 3 | The upstream metaphor. Projects, writing, evals, experiments. |
| 8 | **Writing** | 3 | Anthropic: "written a thoughtful blog post... put that at the top." Separate field from publications. |
| 9 | **Publications** *(opt)* | 3 | Supporting evidence, never the lead (prestige inversion). Published / under-review states. |
| 10 | **Profiles & activity** *(opt)* | 3 | GitHub, HF, LeetCode et al. See §5 — deliberately low. |
| 11 | **Contact / CTA** | — | High engagement, but only once the answer is already yes. |

### Routes

```
/                       spine (above)
/work/[slug]            case study — the deep artifact
/writing  /writing/[slug]
/resume                 web-native resume + PDF download
/about
/uses          [judgment] dev-culture staple, cheap, good SEO
/now           [judgment] optional, signals active
```

**`/work/[slug]` replaces the current `[slug].astro`.** Collections still render, but a
project slug resolves to a full case study rather than an image carousel.

---

## 3. The case study template (`/work/[slug]`)

This is the highest-value surface in the product and where every competitor is weakest.
Order is taken almost directly from the researched README ordering, because that's the order
reviewers are already trained to read.

```
1  OUTCOME HEADLINE      one sentence, leads with the result + key metric
2  LIVE DEMO             ← second element on the page, before setup/context
                            (only 23% of ML practitioners have EVER deployed)
3  RELEVANCE NOTE        "why this matters for <role>" — Anthropic asks for this verbatim
4  METRICS TABLE         2+ measurable outcomes w/ context + baseline
5  ARCHITECTURE          diagram legible in 15s, no prose required
6  DECISIONS             3-5 records: chose X over Y because Z, cost W
7  EVALUATION            method, dataset size, score, baseline, AND failure notes
8  LIMITATIONS           honest. "87% + error analysis > 99.5% + no explanation"
9  STACK                 named tools
10 ARTIFACTS             repo, model card, dataset, paper, post
11 TALKING POINT         "ask me about..." — practitioners use portfolios for
                            interview questions, not competence assessment
```

Items 6, 7, 8 and 11 exist in **no other portfolio template**. That is the product.

### `DecisionRecord` — the senior signal

The single differentiating type. Research shape, from a practitioner's own words:

> "I tried a gradient-boosted model but a plain logistic regression was within 1% and far
> easier to explain, so I shipped that."

```ts
{
  decision: "Shipped logistic regression, not gradient boosting",
  alternatives: ["XGBoost", "LightGBM"],
  rationale: "Within 1% AUC of GBM",
  tradeoff: "Gave up ~1% AUC for explainability the compliance team required",
  secondOrder: ["Cut p95 inference 340ms→45ms", "No GPU in serving path"]
}
```

Senior bar = "explicit trade-off reasoning, failure anticipation, ownership language,
business awareness." This type forces all four. **[judgment]** `secondOrder` is the field
that separates senior from mid; keep it required-ish in the UI.

---

## 4. Section inventory: what goes in, what stays out

### In — core (persona v1)

- Positioning line, metric strip, stack registry, proof row
- Featured system + case studies w/ full evidence chain
- Experience timeline
- Writing (first-class, per Anthropic)
- Evals & benchmarks — **JDs name "eval harnesses, verifiers" as hireable artifacts**
- Architecture diagrams
- Artifacts: repo / HF model card / dataset / paper
- Resume: web view + PDF (§6)
- Contact + availability status

### In — optional modules (off by default)

- Publications w/ published + under-review states
- Profiles & activity (§5)
- Open-source contributions
- Talks / conferences
- Certifications — **default OFF.** Anthropic: "Strong candidates need not have formal
  certifications or education credentials." Present but discouraged.
- Now / Uses **[judgment]**
- Testimonials — ~30% engagement, read as validation not depth

### Deliberately out

- Skill percentage bars **[judgment]** — unmeasurable, reads junior, universally mocked
- Project grid as primary surface — research says ONE featured beats a grid
- Raw notebook embeds — named red flag
- Accuracy-only metric displays — the schema should make a bare accuracy hard to express
- Visitor counters, "years of experience" odometers **[judgment]**

### Anti-pattern guards (structural, not advisory)

The finding that justifies this: **68% of rejected candidates highlighted projects that
hiring teams viewed negatively.** Users misjudge their own work. So the template nudges:

- **Featured slot is singular.** Type-level, not a convention.
- **Soft cap of 3-6 case studies**, with a build-time warning past that. "2-3 polished beat
  10 unfinished."
- **`liveDemo` absence is visually explicit** — renders a muted "not deployed" state rather
  than silently omitting. Makes the gap feel like a gap.
- **Eval requires `baseline` + `failureNotes`.** You cannot express "99.8% accuracy" alone.
- **Build-time lint** for: tutorial datasets (titanic/iris/mnist), me-too project names
  (todo/calculator/snake/weather/tic-tac-toe), accuracy>0.99 without a leakage note,
  README under N words, missing repo URL.

That lint list is a genuine feature. Nobody ships a portfolio template that tells you your
project is a cliché.

---

## 5. LeetCode / Codeforces — the honest answer

**Research position: zero of ~44 sources named competitive-programming ratings as a hiring
signal.** The nearest mentions are negative: "look how smart I am" algorithm implementations
are on the reject list.

**But** the research pool skewed US/EU applied-AI and frontier labs. DSA ratings *do* gate
campus recruiting, service companies, and much India/China-market screening. Many buyers of
this template will be in exactly that segment.

**Resolution — the `ProfileStrip` module:**

- Off by default, one line to enable
- Renders as a **compact horizontal strip**, never a hero card
- Position: Tier 3, near Contact. **Structurally cannot be placed above the featured system.**
- Supported: GitHub, HuggingFace, LeetCode, Codeforces, Kaggle, Stack Overflow, GitLab,
  Google Scholar, ORCID, npm, PyPI, Docker Hub
- Each entry: `{ platform, handle, url, stat?, verified? }` where `stat` is one short string
  ("Knight · 1847", "3× Kaggle Expert", "12k rep")
- **Static values by default, optional live fetch at build time.** Static because a dead API
  breaking the page is worse than a stale number, and a dead link is a documented reject.

**[judgment]** Ordering within the strip should put artifact platforms (GitHub, HF, Kaggle,
Scholar) before rating platforms (LeetCode, Codeforces). Artifacts are evidence; ratings are
proxies.

GitHub contribution graph is a separate consideration: ~40% engagement *if near the fold*,
and "an empty GitHub is a red flag" per HN — but equally, "most GitHub profiles suck and are
negative signals," and senior engineers' work is private. So: **available, off by default,
never above the featured system.**

---

## 6. Resume feature

Recruiters want a resume; the research shows they read it in 5-10s with an F-pattern.

**Design: one source of truth, three renderings.**

```
resume.ts  ──┬──→  /resume        web view, single-column, F-pattern optimized
             ├──→  resume.pdf     print stylesheet → PDF (no separate maintenance)
             └──→  JSON-LD        machine-readable for ATS/AI parsers  [judgment]
```

Constraints from research, applied directly:
- **Single column.** Two-column measured at 1-2s scan cost + lower move-forward rate.
- Job titles / companies / dates left-aligned, visually distinct — the F-pattern vertical
  scan catches line-starts only.
- First bullet of most recent role **must contain a numeral**.
- Skills near the top, not the bottom.
- Same `Metric` and `Experience` objects as the site — never diverges.

**[judgment]** A "tailor mode" — reorder stack and swap the positioning line per target role
via a query param or config variant — is a strong Pro-tier feature and directly serves
Anthropic's "most relevant to the team" ask.

---

## 7. Content model sketch

```ts
// ---- primitives ----
Metric      { label, value, unit?, context?, baseline?, featured? }
StackItem   { name, category, level?, url? }
Artifact    { kind: 'repo'|'demo'|'model'|'dataset'|'paper'|'post', url, label? }
Diagram     { kind: 'mermaid'|'svg', source, alt }   // inline, legible in 15s

// ---- the differentiators ----
DecisionRecord { decision, alternatives[], rationale, tradeoff, secondOrder[] }
EvalResult     { method, datasetSize, metric, score, baseline, failureNotes }  // last two required
                                                                              // ^ enforced

// ---- entities ----
System      { slug, title, outcome, relevanceNote?, liveDemo?, problem,
              metrics[], diagram?, decisions[], evals[], limitations[],
              stack[], artifacts[], talkingPoint?, featured?: true }
Experience  { company, title, start, end?, impact, metrics[], stack[] }
Publication { title, venue, year, status: 'published'|'under-review'|'preprint', url, authors[] }
Post        { slug, title, date, summary, tags[] }
Profile     { platform, handle, url, stat?, category: 'artifact'|'rating' }
Persona     { positioning, availability, proofRow[], contact }
```

`Collection` (upstream) is **kept**, retargeted at Tier 3 browsing, and gains a
`kind: 'systems'|'writing'|'gallery'|'experiments'` so folders can hold typed content rather
than only images.

---

## 8. Extending beyond AI/ML (the "later" plan)

Build persona v1 properly; make the rest a **config choice, not a fork**. The tier structure
and 80% of primitives are persona-neutral — only the *evidence types* change.

| Persona | Swap in | Swap out |
|---|---|---|
| **AI/ML engineer** (v1) | Evals, benchmarks, architecture, model cards | — |
| Frontend / design engineer | Live component demos, Lighthouse/CWV scores, before-after UI | Evals, model cards |
| Backend / infra | Load-test numbers, SLO/uptime, incident writeups, system diagrams | Model cards |
| Data engineer | Pipeline diagrams, volume/freshness/cost, data-quality checks | Model cards |
| DevOps / SRE | Deploy frequency, MTTR, cost reduction, postmortems | Evals |
| Mobile | Store links, crash-free rate, bundle size, screenshots | Evals, architecture |
| Security | CVEs, disclosures, CTF, writeups | Evals |
| New grad / student | Coursework, hackathons, **DSA profiles promoted** | Experience timeline |

**The abstraction that makes this work:** every persona has the same shape —
*a system, its measurement, and the decisions behind it*. Only the units differ. `Metric`,
`DecisionRecord`, `Artifact`, and `Diagram` are already generic; `EvalResult` is the one
AI-specific type, and it generalizes to `Measurement` with a `kind` discriminator.

**[judgment]** Ship v1 as AI/ML-only with the generic core underneath. Adding a persona later
= a preset file + a few components, not a refactor. Resist building all eight now; the
research is only validated for one.

---

## 9. Open questions for the build

1. **Positioning still unresolved:** job-seeker vs consultant. This spec assumes job-seeker.
   Consultant needs services, methodology, client outcomes, "what I'd tell you not to build."
   ~50% content-model overlap.
2. Mermaid vs hand-authored inline SVG for diagrams. Mermaid is easier to author, SVG is
   lighter and more controllable. Leaning Mermaid with an SVG escape hatch.
3. Does the folder metaphor survive contact with typed content, or does it become a
   conventional grid below the fold? Needs a prototype, not a decision on paper.
4. Mobile: upstream is **explicitly untested on phones**. Non-negotiable fix before anything
   ships.

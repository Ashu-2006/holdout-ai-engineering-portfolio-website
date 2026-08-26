# Content Inventory: what actually goes on the page

Third document in the chain. `HIRING-SIGNALS.md` is the research, `SITE-STRUCTURE.md` is the
spec derived from it, and this is the reconciliation against 4 real portfolio landing pages
collected in Figma (`Sdk1eUywk7uMTbMPZ5sPGw`, node `38:3981`, section "Landing Content").

Every row below is tagged with where it came from:

- **[REF]** present in the Figma references
- **[RES]** required by the research
- **[BOTH]** both agree
- **[CONFLICT]** they disagree, and the resolution is recorded

---

## 0. The finding that reframes everything

**The references and the research are optimizing for different readers, and neither is the
buyer of this template.**

| | Figma references | The research |
|---|---|---|
| Who | 4 design engineers with an existing audience | AI/ML engineer applying for a job |
| Reader | Peers on X. Judges taste. | Recruiter, then senior IC. Judges evidence. |
| Winning move | Look like someone whose craft you trust | Survive a 6-second keyword filter, then a 90-second depth read |
| Project surface | Grid or gallery | ONE featured system |
| Numbers shown | Stars, contributions, follower proof | Latency, precision, cost, at p95, against a baseline |

All four references are **taste-forward**. None of them would pass the research's Tier 1
filter, because none of them state a measured outcome above the fold.

And the reverse is also true: a site built only from the research reads like a resume with
CSS, which is exactly why the upstream folder metaphor was chosen in the first place.

### What the references prove that the research could not

The research predicted the gap. The references confirm it empirically. Across 4 real,
well-regarded portfolios:

| Evidence type | Present in how many of 4 |
|---|---|
| A metric with measurement context | **0** |
| A decision record (chose X over Y, cost Z) | **0** |
| An eval with a stated baseline | **0** |
| Known limitations | **0** |
| An architecture diagram | **0** |
| A live demo treated as a first-class field | **0** |

The closest anything gets is Chánh Đại's `2k stars` and `5,283 contributions`, which are
activity and popularity, not outcome. **That is the product gap, now measured rather than
theorized.** The current `content.config.ts` already encodes exactly these six. Keep them.

---

## 1. Tier 1: the filter (above the fold)

Serves the ~6-10s scan. Text-first, keyword-dense, no decoration.

| # | Field | Source | In build? |
|---|---|---|---|
| 1 | **Positioning line**: role + domain + stack in one H1 | [BOTH] all 4 refs open with role. Research: unclear role in first 5 words = reject | yes |
| 2 | **Availability status** | [BOTH] Lorenzo "Let's work together", Ramkrishna "Working" badge | yes |
| 3 | **Metric strip**, 3 numbers with context | [RES] numerals stop the F-pattern scan. Zero refs have this | yes |
| 4 | **Proof row**: previously-at / clients-include | [BOTH] Lorenzo lists N26, Booking.com, Dyson, TBWA inline in prose. Research calls it a recognition shortcut | **NO** |
| 5 | **Stack registry**, categorized | [BOTH] Chánh Đại groups as Language / Frontend / Backend & Database / Workflow & AI / Design. Research: must be above fold, recruiters work from a must-have list | yes |
| 6 | **Contact**: email, location | [REF] all 4. Chánh Đại adds local time, pronouns, phone | partial |

**Gap to close: the proof row (4).** It is the cheapest Tier 1 win available and the one
thing Lorenzo does better than the current build. If there are no name brands, the research
says substitute outcome scale ("processing $40M/month").

**Steal from Chánh Đại: local time and pronouns.** Two lines, no cost, and they make the
identity block read as a person rather than a header. `04:18 AM // 1h ahead` is a better
availability signal than a green dot because it tells a recruiter in SF whether to expect a
reply today.

---

## 2. Tier 2: the hook (~60-90s, senior IC)

| # | Field | Source | In build? |
|---|---|---|---|
| 7 | **ONE featured system**, not a grid | [CONFLICT] resolved below | yes |
| 8 | `outcome` headline, result first | [RES] | yes |
| 9 | `liveDemo`, absence visually explicit | [RES] only 23% of ML practitioners have ever deployed. Zero refs treat this as a field | yes |
| 10 | `relevanceNote`, why this matters for the role | [RES] Anthropic asks for this verbatim | yes |
| 11 | **Experience timeline** | [BOTH] 3 of 4 refs. Ramkrishna is the best version: company, title, dates, location, on-site/remote, and a status badge | yes |

### [CONFLICT] Grid vs one featured system

All four references use a grid or gallery. The research says one featured beats a grid, and
cites a measured reason: a grid makes the reader choose, a feature makes the choice for them.

**Resolution: the research wins.** It is measured; the references are aesthetic convention.
But the references are right that a single card looks thin. So: one featured system rendered
at full weight, then the rest as a Tier 3 collection, which is what the build already does.

### Steal from Ramkrishna: the timeline row shape

`ASBL · SDE-L1 (Full Stack) · January 2026 – Present · Hyderabad, India (On-Site)` plus a
`Working` badge and a `Show all work experiences` disclosure. Location and work-mode are two
fields the current `roles` schema does not have, and both are things a recruiter filters on.

---

## 3. Tier 3: the depth (5-10m, hiring manager)

| # | Field | Source | In build? |
|---|---|---|---|
| 12 | `decisions[]` (DecisionRecord) | [RES] the senior signal. 0 of 4 refs | yes |
| 13 | `evals[]` with required `baseline` + `failureNotes` | [RES] 0 of 4 refs | yes |
| 14 | `limitations[]` | [RES] "87% with error analysis beats 99.5% with no explanation" | yes |
| 15 | Architecture diagram, legible in 15s | [RES] 0 of 4 refs | **NO** |
| 16 | `talkingPoint` ("ask me about") | [RES] practitioners use portfolios to source interview questions | yes |
| 17 | **Writing, with excerpts** | [BOTH] Fayaz shows 3 lines of actual argument per post, not a summary. Research: Anthropic says put a thoughtful blog post at the top | partial |
| 18 | Collections with counts | [REF] Fayaz: "Travel · 14 places", "Projects · 9 things I built", "Bookmarks · 23 posts" | **NO** |
| 19 | `artifacts[]`: repo, model card, dataset, paper, post | [RES] | yes |
| 20 | Lab / interactive explainers | [REF] Chánh Đại ships Blocks and Components as evidence | yes |
| 21 | Resume: web view + PDF | [RES] recruiters want one, read in 5-10s, F-pattern | **NO** |

**Steal from Fayaz: counts on every collection.** `9 things I built` is more honest and more
scannable than a folder with no number, and it makes an empty collection impossible to hide.

**Steal from Fayaz: post excerpts, not summaries.** He prints the actual third paragraph.
A summary says "this post is about X". An excerpt proves you can write, which is the thing
Anthropic said it cares about.

**Gap to close: the diagram (15) and the resume (21).** The diagram is the highest-value
missing piece, because it is Tier 3's fastest read and no competitor has one.

---

## 4. Off by default, present as modules

Each of these is in the references, and each fails a research test. They ship, but disabled.

| Field | Why off | Source |
|---|---|---|
| **Testimonials** | [CONFLICT] Chánh Đại leads on them, "Trusted by top builders on X". Research: ~30% engagement, "read as validation not depth". **Resolution: keep, but require attribution with credential.** "Guillermo Rauch, CEO @Vercel" is evidence. "great work bro" is noise, and Chánh Đại ships both. Only the first kind earns a slot, and never above the featured system. |
| **Certifications** | [CONFLICT] Chánh Đại has a section. Anthropic states "strong candidates need not have formal certifications or education credentials". Off, and the schema should not make it prominent. |
| **Logo wall** ("trusted by") | [REF] Chánh Đại. Works only with real logos; renders as filler otherwise. |
| **Contribution graph** | [REF] Chánh Đại, with an exact count and a cited source. Research: ~40% engagement if near the fold, but "an empty GitHub is a red flag" and senior work is private. Off, never above the featured system. |
| **Profile strip** (GitHub, HF, LeetCode, Codeforces) | [RES] §5 of SITE-STRUCTURE. Artifact platforms before rating platforms. |
| **Publications** | [RES] prestige inversion. Supporting evidence, never the lead. Not in the schema yet. |
| **Education** | [REF] Chánh Đại, Ramkrishna. De-emphasized by the research, but see §6: many buyers of this template are students. |
| **Awards** | [REF] Chánh Đại. Same reasoning as certifications. |
| **Personal surface** (Books, Movies, Gears, Setup, Terminal, Bookmarks, Travel) | [REF] all 4 refs have some of this; Ramkrishna's footer lists six. Genuine taste signal for someone with an audience. Tier 3, off by default, and only with counts. |

---

## 5. Cut

| Field | Why |
|---|---|
| Skill percentage bars | Unmeasurable, reads junior, universally mocked |
| Project grid as the primary surface | Research: one featured beats a grid |
| Accuracy-only metrics | Schema already makes a bare accuracy hard to express. Keep it that way |
| Unattributed praise quotes | Chánh Đại ships ~10 of these. They dilute the 4 that carry a credential |
| Raw notebook embeds | Named red flag |
| Visitor counters, years-of-experience odometers | |
| Contact form | Lorenzo's prefilled `mailto` with To / Subject / From / body is strictly better. No backend, no spam, and it drafts the awkward first line for the sender |

---

## 6. The unresolved question this analysis surfaces

**This is a template for sale, so the buyer is not Ashutosh and is not the four designers on
the reference board.**

`HIRING-SIGNALS.md` is validated for exactly one persona: the AI/ML engineer job-seeker. The
Figma references are all design engineers with existing audiences. Neither group is
necessarily who pays for this.

That matters for three specific decisions:

1. **Education and DSA profiles.** Research says de-emphasize. But a large share of likely
   buyers are students and new grads for whom coursework and a Codeforces rating are the only
   evidence they have. `SITE-STRUCTURE.md` §8 already anticipates this with a
   "new grad / student" persona that promotes DSA profiles and drops the experience timeline.
2. **Whether the anti-pattern lint ships enabled.** The build-time warnings (tutorial
   datasets, me-too project names, accuracy > 0.99 with no leakage note) are a real
   differentiator, and also the kind of thing that makes a paying buyer feel judged. Default
   on, with a one-line opt-out, is probably right, but that is a product call.
3. **Preset count at launch.** §8 lists eight personas. The research validates one. Shipping
   one preset properly beats eight thin ones, which is the same depth-over-breadth argument
   the research makes about projects.

---

## 7. Build order implied by the gaps

Everything in Tiers 1-3 marked "yes" is already built. Five gaps, in the order they pay off:

1. **Proof row** (Tier 1, cheapest, highest position on the page)
2. **Architecture diagram slot** (Tier 3's fastest read, no competitor has one)
3. **Local time + pronouns in the identity block** (two lines, humanizes Tier 1)
4. **Collection counts + post excerpts** (Tier 3 scannability, both stolen from the refs)
5. **Resume: web view + PDF from one source** (`SITE-STRUCTURE.md` §6 already specs it)

Then the density toggle, below.

## 8. The single best idea on the reference board

Chánh Đại has a **`Less` / `More` toggle** in the identity block.

That is a progressive-disclosure control for the whole page, and it resolves the central
tension in `HIRING-SIGNALS.md` §7 directly. The research demands a front-loaded,
keyword-dense, metric-first scan path for the recruiter, and simultaneously demands depth for
the senior reader. Every previous resolution in this doc chain has been spatial: signal on
top, depth below. The toggle makes it a **user-selected density** instead.

`Less` gives the recruiter Tier 1 and stops. `More` opens Tiers 2 and 3 for the hiring
manager. Same content model, one control, and it means the page does not have to compromise
between two readers who want opposite things.

Worth prototyping before committing: it adds a state that every section must respect, and
the failure mode is a reader who never finds the control and sees a thin page.

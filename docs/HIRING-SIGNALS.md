# What Hiring Managers Actually Look For: AI/ML Engineer Portfolios

Research synthesis, Aug 2026. ~44 sources across two rounds (all via EXA):
recruiter eye-tracking studies, hiring-manager red-flag lists, MLOps interview guides,
AI-engineer resume guides, senior-bar analyses, **primary-source job descriptions from
Anthropic and OpenAI**, **practitioner discussion threads (Hacker News, r/MachineLearning,
r/cscareerquestions)**, and **AI-consultant buying guides**.

This document drives the content model for the portfolio template. It is the "what goes on
the site and in what order" decision record.

> **Source-quality note.** Round 1 leaned on career-advice/SEO sites (learnist.org appeared
> four times) which converge on plausible advice but are not authoritative. Round 2 added
> primary sources (actual JDs) and unfiltered practitioner voices. Where the two disagree,
> §0 records the conflict rather than papering over it. Trust primary > practitioner >
> career-blog.

---

## 0. Where the sources genuinely disagree

This section matters more than any single finding, because the round-1 advice literature is
much more confident than the evidence supports.

### Conflict 1: Do portfolios/GitHub actually matter?

**Career blogs say yes, unanimously.** CoderPad 2025 survey: 68% of technical hiring
managers check GitHub. One claim: candidates with active public repos got 40% more
callbacks (uncited, treat sceptically).

**Practitioners are split, some strongly negative:**
- *"I don't care about your GitHub profile. It's a small value add, nothing more."*
- *"Most github profiles actually suck and are negative signals."*
- *"A GitHub repo is too much time and effort to evaluate on technical merits... I can give
  the repo 30-60 minutes max, just not enough time."*
- *"We literally never hire someone without a technical interview, but we do look at
  github... If there's something interesting we'll ask questions about it during the
  interview."*
- Several note experienced engineers' work is **private employer property**, so an empty
  GitHub is not a negative signal for them.
- Multiple hiring managers say hiring is **network-based** in practice, and referrals
  outrank any portfolio.

**Resolution for our product:** the portfolio's job is *not* to get someone hired on its
own. It is (a) to pass a fast filter, and (b) to **supply talking points for the interview**
— which is the single most consistent thing practitioners say they use it for. That reframes
the design goal: optimize for *"this gives me something to ask about"* rather than
*"this proves competence."*

### Conflict 2: How long is the scan?

Round-1 numbers ranged 4.2s → 11.2s → 30s → 90s → 10min depending on artifact and stage.
Round 2 adds: *"less than 60 seconds on an initial portfolio review"* (Google/Meta
engineers), *"60-90 seconds on your top repo"*, *"~90 seconds"* (repeated).

**The honest synthesis:** resume scan ≈ 5-10s. GitHub/portfolio scan ≈ 60-90s. Senior HM
deep read ≈ 5-10min, and only for candidates already past the filter. Design for all three
tiers rather than a single magic number.

### Conflict 3: Does polish matter?

- *"I want to see your code looking pretty. Consistent indentation, run through a linter."*
- Directly contradicted in the same thread: *"I could care less about how pretty their code
  is. I'm more interested to see if they are PASSIONATE about tech."*

No resolution available. Both are real hiring managers. Build for the stricter case since
it's cheap to satisfy.

---

## 1. The two audiences, and why they conflict

Every source splits the reader into two distinct people with different needs. The template
must serve both without compromising either.

| | Recruiter / HR | Senior dev / hiring manager |
|---|---|---|
| Time budget | 6-30 seconds | 5-10 minutes |
| Goal | Filter out | Find reasons to reject, then reasons to hire |
| Reads | Headline, current role, stack keywords, company names | READMEs, architecture, eval methodology, trade-offs |
| Rejects for | No role match, no stack keywords, slow load | Tutorial projects, no eval, no deployment, overclaiming |
| Wants | Fast pattern-match to the job spec | Evidence of judgment under constraint |

The design consequence: **the top of the page is a keyword-and-metric filter, everything
below is depth for the second reader.** A site optimized only for beauty fails reader one.
A site optimized only for keywords fails reader two.

### Timing evidence (converging, from separate studies)

- Ladders eye-tracking: **6s** (2012), **7.4s** (2018)
- Open Applier, 20 recruiters x 10 resumes: median **4.2s on a reject**, **22s on a
  move-forward**. The scan is real *and asymmetric*: 5x longer on candidates they like.
- InterviewPal: average initial scan **11.2s**, median total review **1m 34s**.
  72% of recruiters spend under 2 minutes total.
- JobsByCulture: **15-30s** initial triage at AI companies.
- GenAI portfolio guide: hiring manager portfolio screen is **under 10 minutes**.
- dataexpert.io: **7-10s** on resumes, but **87% of tech recruiters check GitHub**, spending
  ~**90 seconds** per profile.

Caveat worth respecting: the 6-second figure comes from *resume* eye-tracking. No
peer-reviewed eye-tracking exists for portfolio pages. The reliable finding is not the exact
number, it is the **pattern**: fast, location-specific scan, then a binary decision.

### The F-pattern (Nielsen Norman Group, 2006, updated 2017)

1. Long horizontal scan across the top of the content area
2. Shorter horizontal scan further down
3. Vertical scan down the left edge, catching the first word or two of each line

Design consequences, stated directly by sources:
- **Top of page is premium real estate.** Signal must be front-loaded.
- **Single column.** Two-column layouts force a mid-scan re-orient, measured at 1-2s cost
  and a measurable drop in move-forward rate.
- **Left edge of each block must be visually distinct** or the vertical scan finds nothing.
- **Whitespace aids scanning.** Dense layouts slow it down.
- **Numerals stop the scan.** Digits are visually distinct from prose.

---

## 2. What the 6-second scan must deliver

Three questions, answered above the fold or the screen fails:

**1. Positioning: role + domain + stack, in one line.**
Not "Hi, I'm Alex!" Not a logo animation. Sources are blunt that an unclear role in the
first five words is a reject. Use the role title *from the job spec*, exactly. One source
measured this single change moving 2 of 10 rejects to move-forwards.

**2. Named stack, visible early.**
Recruiters work from a must-have list. Generic "AI/ML" tells them nothing. The named
2026 stack that matters: LangChain, LlamaIndex, vLLM, TGI, Pinecone, Qdrant, Weaviate,
pgvector, OpenAI, Anthropic, Mistral, Llama, Ragas, DeepEval, promptfoo, MLflow, W&B,
Vertex AI, SageMaker, Bedrock, PyTorch, TRL, Axolotl, Unsloth, Docker, FastAPI.
**Must appear in the hero or immediately below. Not in a Skills section at the bottom.**

**3. Recognition shortcuts: company names or outcome numbers.**
"Previously at Stripe" is a trust shortcut. If no name-brand logos, substitute outcome
scale: "Built payment infrastructure processing $40M/month."

### Section engagement (directional, not peer-reviewed)

| Section | Approx. engagement |
|---|---|
| Headline / hero | ~100% |
| Most recent role or featured project | ~60% |
| GitHub activity (only if near the fold) | ~40% |
| Testimonials | ~30% |
| Case studies (click-through) | ~15% (mostly senior HMs, later in funnel) |
| About / bio | ~10% |
| Contact | High, but only once the answer is already yes |

**The hero and one featured project do the heavy lifting. Optimizing below-the-fold before
those two is working on the wrong problem.**

Note the implication for a "grid of projects" design: sources repeatedly say **one featured
project** beats a grid. A grid makes the reader choose; a feature makes the choice for them.

---

## 3. The AI-specific screen (in priority order)

From the AI engineer resume guide, this is the hiring-manager sequence. A miss at any step
ends the screen:

1. **Shipped LLM features in production.** Not a side project against the OpenAI API.
   Real users, observable in a real product. *The single biggest variable.*
2. **Named stack** (see above).
3. **Evaluation discipline.** Hallucination rates, faithfulness, retrieval recall, A/B
   results. Claiming a system "works well" with no eval methodology is an **instant
   downgrade** in 2026.
4. **Latency, cost, and scale numbers.** "Sub-2s p95," "reduced API costs 35%," "serves 4M
   MAU." *Numbers travel between hiring managers; adjectives don't.*
5. **Production systems thinking.** Caching, retries, fallbacks, prompt versioning, feature
   flags, observability, cost monitoring.
6. **Fine-tuning / training experience**, if the role wants it. Name framework, base model,
   dataset, and eval. Don't pad if the role doesn't want it.
7. **Open source / public artifacts.** Repo, HuggingFace model card, published eval dataset,
   paper, or a blog post other engineers cited. Bar is "substantive," not "exists."

**Explicitly NOT on the list: certifications.** Coursera certs, "prompt engineering
bootcamp" badges. Soft signal for early-career at best; skip if you have production work.

### The prestige inversion (important for content design)

2018-2022 order: NeurIPS paper > PhD from top program > Kaggle grandmaster > production
experience.

**2023 onward: that order inverted.** The most hireable AI engineer in 2026 points to a
specific feature in a specific product that real users hit, with eval and cost numbers. The
least hireable has three workshop papers and no shipped systems.

This means: **a "Publications" section is not the lead.** It's supporting evidence. Shipped
systems lead. (Exception: research-lab roles at DeepMind-class orgs, where academic culture
still dominates and PhD + publication record is often required.)

---

## 3b. PRIMARY SOURCES: what frontier labs actually write in their JDs

This is the highest-quality evidence in the document, because it's the hiring bar stated by
the employer rather than paraphrased by a recruiter blog.

### Anthropic careers page — the single most quotable finding

> "We care about what you can do, not where you learned to do it. About half our technical
> staff had no prior ML experience; about half have PhDs, but plenty of brilliant colleagues
> never went to college. **If you've done interesting independent research, written a
> thoughtful blog post, or contributed to open source, put that at the top of your resume.**"

That last sentence is a direct instruction to **lead with independent artifacts**, and it
comes from the employer, not a career coach. It independently confirms the §3 prestige
inversion from an authoritative source.

Repeated across nearly every Anthropic JD, under "Strong candidates need not have" /
"Candidates need not have":
- **"Formal certifications or education credentials"**
- **"Academic research experience or publication history"**
- "100% of the skills needed to perform the job"

Minimum education is consistently *"Bachelor's degree **or an equivalent combination of
education, training, and/or experience**."*

The Alignment Science JD asks applicants directly:
> "**Share a link to the piece of work you've done that is most relevant to the team**,
> along with a brief description of the work and its relevance."

That is a portfolio request embedded in an application form. It wants **one link, described
and contextualized for the specific team** — not a project grid. Strong argument for a
featured-work model with a per-item "why this is relevant" field.

The application form also collects a **Publications (Google Scholar) URL** and a **blog
posts** field as separate first-class inputs.

### What the JDs actually list as desired signal

Recurring across Anthropic RL / Pre-training / Alignment and OpenAI Research Engineer roles:
- Strong software engineering, **"proven track record of building complex systems"**
- Python depth, incl. **async/concurrent** (Trio named explicitly)
- PyTorch / JAX / TensorFlow
- **Large-scale distributed systems**, Kubernetes, GPU clusters, CUDA/TPU kernels
- **Built "coding agents, code-execution sandboxes, eval harnesses, verifiers, or developer
  tooling"** ← note *eval harnesses* named explicitly as a hireable artifact
- Performance profiling, benchmarking, optimization
- **"Comfortable owning systems end to end and debugging across the stack"**
- "Balance research exploration with engineering implementation"
- "Care about code quality, testing, and performance"
- **Communication skills, stated as highly valued** ("we greatly value communication skills")
- Rust and/or C++ (secondary)

OpenAI Applied AI adds: *"Enjoy owning the problems end-to-end, and are willing to pick up
whatever knowledge you're missing to get the job done."*

**Content consequence:** eval harnesses, benchmarks, distributed-systems work, and
end-to-end ownership are *named hiring criteria at frontier labs*. The content model must
make these first-class, not squeeze them into a generic "project" type.

---

## 3c. Project archetypes ranked by measured conversion

From a cohort of 412 portfolio reviews, ranked by phone-screen conversion (the only metric
the source claims matters, noting stars/complexity/originality are proxies that "turned out
to be wrong"). Threshold for inclusion was 25%+ conversion.

| Rank | Archetype | Signal | Δ conversion |
|---|---|---|---|
| 1 | Production RAG **with eval harness** | Highest — covers all four artifacts in one repo | +34% |
| 2 | Multi-agent workflow **with observability** | Very high — "shipped past the demo wall" | +41% |
| 3 | Fine-tuned domain model **with benchmark** | High — past prompt engineering | +12% |
| 4 | Structured-extraction service with schema validation | High — production LLM use, not a chatbot | +22% |
| 5 | End-to-end ML pipeline with feature store | Solid — ML engineer track | ±0% |

Treat the exact percentages with caution (single vendor, self-reported, and the ordering
doesn't perfectly track the deltas). The *pattern* is what's actionable: **every top
archetype pairs a system with its measurement apparatus** — eval harness, observability,
benchmark, schema validation. The measurement is the differentiator, not the model.

### The deployment statistic worth designing around

> A 2024 Kaggle survey found **only 23% of ML practitioners have ever deployed a model to
> production.** Having even one deployed project puts you ahead of three out of four
> candidates.

And the associated warning:
> "An 84% accurate model that is live, documented, and testable beats a 93% accurate model
> locked in an untestable notebook every single time."

**Design consequence: a live-demo URL field should be structurally prominent and its absence
should be visually obvious.** HuggingFace Spaces / Gradio / Streamlit are named as the
free paths, so the field should accept those as first-class.

### The "show your decisions" finding, restated by practitioners

> "I tried a gradient-boosted model but a plain logistic regression was within 1% and far
> easier to explain, so I shipped that" — *tells a hiring manager more than any leaderboard
> score.*

This is the clearest natural-language example of the `DecisionRecord` type in §7. It shows
the shape: alternative considered → measured comparison → constraint that decided it →
what shipped.

---

## 3d. The consultant buyer (different reader, different site)

If the target user is an independent AI consultant rather than a job-seeker, the evaluation
criteria change substantially. This is decision-relevant for the open positioning question.

What consultant buyers are told to demand:
- **"Show me a project you did for a business my size."** Explicitly *not* a case-study PDF
  with a logo and testimonial — **"a walkthrough. What was broken, what they did, what
  changed, in numbers."**
- **"Can I speak to that client?"** Referenceable clients. Hedging is a red flag.
- **Documented, repeatable methodology.** "80% of AI project failures stem from lack of
  systematic approach."
- **Tool/vendor agnosticism.** Vendor exclusivity drives lock-in in 61% of engagements.
- **"What would you tell me NOT to build?"** Described as "the single clearest red flag
  available to you" if they can't answer. Also phrased as: ask where AI does *not* make sense.
- Data protection / GDPR posture, audit trails (34% of engagements flagged data-protection
  risk post-implementation)
- IP ownership clarity (28% of disputes centre on ambiguous IP language)
- ISO/IEC 42001:2023 for regulated/government sectors (only ~15% of UK consultants hold it)
- Outcome-based pricing willingness ("40% higher success rates than fixed-scope")

Structural insight from an ex-consultancy seller:
> "The sale almost always happened **before the client could evaluate the work**... clients
> struggle to judge consulting quality in advance because the product is intangible until
> it's delivered. You're buying a promise wrapped in a brand."

And: the combination of *actually builds* + *has shipped to production* **"eliminates about
70% of the market. Most AI consultancies either don't build (they advise and refer) or
haven't shipped anything to production (perpetual POC mode)."**

**Consultant site needs, which the job-seeker site does not:**
- Client-outcome case studies in *before → intervention → measured after* form
- Named/referenceable clients, or anonymized-but-specific ("a 40-person logistics firm")
- A stated methodology/process section
- Services + engagement model + pricing posture
- A "what I'd tell you not to build" / point-of-view section — this is genuinely
  differentiating and nobody has it
- Trust/compliance surface: data handling, IP terms
- Booking CTA, not a resume download

**These two products share maybe 50% of their content model.** Metrics, decisions, evals,
and architecture are common. Experience timeline, resume download, and publications are
job-seeker only. Services, pricing, client references, and methodology are consultant only.

---

## 4. Per-project structure that earns a callback

Four questions every hiring manager carries into a portfolio review. Most projects answer
question one and go quiet. Callback-earning projects answer all four:

1. What problem does this solve?
2. Does it actually work?
3. Can it survive contact with a real user?
4. Can you *prove* the quality rather than assert it?

### Required artifacts per project

| Element | Weak | Strong |
|---|---|---|
| README | "RAG chatbot built with LangChain." | Problem, demo link, stack, how to run, eval method + results. Readable in 2 min. |
| Live demo | "Clone and run locally" | A public URL, one click, works immediately |
| Evaluation | "Works well in my testing" | 20-50 representative inputs, a measured score, **and an honest note on where it fails** |
| Architecture | Prose description | A diagram legible in **15 seconds** without reading prose |
| Metrics | Accuracy only | 2+ measurable outcomes, e.g. "94% retrieval precision at p95 380ms over 50k docs" |

### README order (from the GenAI guide, matters for our content model)

1. One-sentence headline leading with **outcome + key metric**
2. **Live demo link in the second line** — before any setup instructions
3. Architecture diagram
4. 3-5 key technical decisions **with rationale**
5. Measurable results in a small table
6. Setup / run instructions
7. **Known limitations**

That last one is counterintuitive but repeatedly emphasized: honest failure notes *increase*
credibility. "87% accuracy with thoughtful error analysis is more credible than 99.5% with
no explanation."

### Depth over breadth, unanimously

- "2-3 polished, deployed projects with excellent READMEs beat 10 unfinished ones"
- "3-5 projects, each demonstrating a distinct skill: RAG, agents, evaluation, fine-tuning,
  system design"
- "One flagship project with a live demo can anchor your entire application"
- A wall of thin projects reads as a serial tutorial-follower. One reviewer: *line cook vs
  head chef.*

**Design consequence: the template must make it hard to add 15 shallow projects and easy to
present 3 deep ones.** Structure as an anti-pattern guard.

---

## 5. Red flags: the reject list

Consolidated from four independent red-flag sources. Ordered by speed-to-reject.

### Instant rejects
- **Committed API keys / secrets.** Non-negotiable. Reviewer stops evaluating the model and
  starts questioning whether you can be trusted near production. Automated scans catch these
  in seconds. Note: removal doesn't help, it stays in git history.
- **Fails to run in three commands.** "Clone, install, run. If it falls over before step
  three, the review is over."
- **Dead or missing live demo.** A reviewer who clicks a dead link does not email you.
- **Misrepresenting contributions.** Claiming others' work, inflating role, padded commit
  graphs. Instant rejection when discovered.

### Seconds-to-reject
- **Tutorial datasets**: Titanic, Iris, MNIST, house prices, boston housing
- **Me-too projects**: churn, sentiment, fraud detection, to-do app, calculator, snake game,
  weather app, tic-tac-toe
- **One-line or obviously AI-generated README.** In 2026, prose that reads machine-written
  *raises* suspicion rather than saving time.
- **Accuracy as the only metric.** 99.9% accuracy predicting "not fraud" on an imbalanced
  set is a model that does nothing. Needs precision, recall, F1, confusion matrix.
- **Suspiciously perfect scores.** 99.8% reads as data leakage or test-set overfitting, not
  brilliance.
- **Single massive commit / empty history.** Looks like last-minute panic. No record of how
  you work.
- **"Production-grade" on a toy project.** Overclaiming signals you don't know what
  production involves.
- **Raw Jupyter notebooks as the artifact.** Great for exploration, terrible as portfolio
  output: dead ends, out-of-order cells, debug output. Reads as "cannot present work."
- **No deployment / serving component.** Ends at "model saved to disk."
- **Ten shallow projects instead of two deep ones.**
- **Buzzword bingo.** 5+ trending technologies with no justification, extensive boilerplate,
  superficial implementation, README focused on stack rather than what the app does.
- **Over-engineered todo app.** Found in ~75% of *rejected* tech-lead candidates. Signals
  poor scoping judgment.
- **Abandoned framework/library** featured prominently: no commits in 6-12 months,
  unaddressed issues, no users.
- **"Look how smart I am" algorithm implementations** with no practical application.
- **Clone without a twist.** Twitter/Instagram/e-commerce clones with no differentiation.
- **AI-generated code you can't defend.** Reviewers assume you used AI, that's fine. Code
  that was clearly generated and never understood is what sinks candidates.

Sharpest quote, from a data engineering lead reviewing 50+ resumes/week:
> "Recruiters don't want to see your Model Accuracy. We want to see your Engineering
> Struggle. I would hire the candidate who struggled with web scraping limits over the
> candidate who got 99% accuracy on the Iris dataset any day."

And the survey finding that should inform our defaults: **68% of rejected candidates
highlighted projects that hiring teams viewed *negatively*.** Candidates systematically
misjudge which of their own work is impressive. The template's structure should nudge toward
the right emphasis rather than leaving it to the user's judgment.

---

## 6. The senior bar (what the deep content must support)

For senior/staff roles the evaluation shifts away from models entirely. Eight signals,
consistent across sources:

1. **Explicit trade-off reasoning**, not "best practices." Compare viable approaches,
   explain what you rejected and why, acknowledge second-order effects (cost, latency, risk,
   maintenance).
2. **Comfort under ambiguity**
3. **Ownership language** — accountability for outcomes, not components
4. **Failure anticipation before optimization**
5. **System-level over model-centric thinking.** The model is one component, not the
   centerpiece.
6. **Pragmatism over technical maximalism**
7. **Structured communication under pushback**
8. **Business and user impact awareness**

> "Senior ML engineers are not hired for knowing more. They are hired for deciding better."

Junior = implement. Mid = design. Senior (2026) = **decide under ambiguity, own outcomes.**

### MLOps is now the senior bar

The 2020→2026 shift: the barrier to ML adoption is not modeling expertise, it's
productionization. Senior now requires: automated training + eval pipelines, versioning /
lineage / reproducibility, deployment across distributed systems, drift monitoring (data,
concept, performance decay), feedback loops, reliable infra, alignment with operational SLAs.

The four custody questions a good interview loop answers:
1. Can they tell you what is running?
2. Can they rebuild it?
3. Can they replace it safely?
4. Can they tell when it has quietly stopped being right?

> "Your MLOps hire owns the 95%: configuration, data collection, feature extraction, serving
> infrastructure, monitoring, process management. The whole unglamorous mass around the small
> black box."

**Content consequence:** the template needs a natural home for *decision rationale* and
*failure modes*, not just outcomes. This is what distinguishes it from every existing
portfolio template, all of which model projects as {title, image, description, tech tags}.

---

## 7. Content model requirements (the actionable output)

What the current template has: `Collection { slug, title, meta, items }` where
`CollectionItem = string | {src} | {logo, label} | {note, body}`.

That models **visual collections**. It cannot express any of the above. Required additions:

### Must-have entity types

- **Positioning line** — role + domain + stack, single line, first H1, above the fold
- **Stack registry** — named tools, grouped by category, rendered near the top, keyword-dense
- **Metric** — `{ label, value, unit, context }`. First-class and promotable to hero.
  e.g. `{ p95 latency, 380, ms, "over 50k doc corpus" }`
- **Shipped system** (distinct from side project) — the flagship type. Needs: problem,
  live URL, architecture diagram slot, 2+ metrics, 3-5 decisions-with-rationale,
  known limitations, stack.
- **Decision record** — `{ decision, alternatives_rejected, rationale, second_order_effects }`.
  This is the senior signal no template supports.
- **Eval result** — `{ method, dataset_size, metric, score, baseline, failure_notes }`.
  Baseline and failure notes are required, not optional, per §4.
- **Architecture diagram** — must be legible in 15s. Inline SVG or Mermaid, not a heavy image.
- **Experience timeline** — company, title, dates, one-line impact. Recruiters look here
  second. (This is also what makes `bchiang7/v4` the most-forked portfolio: it leads with
  employment history, not a project grid.)
- **Publications** — with published / under-review states. Supporting evidence, not the lead.
- **Artifacts** — repo, model card, dataset, blog post. "Substantive" bar.

### Hard constraints from the research

- Single-column primary scan path
- Positioning + stack above the fold, no exceptions
- **One featured system**, not a grid, as the primary project surface
- Numerals rendered distinctly (they stop the scan)
- Load under 2s to interactive; no heavy unoptimized images
- **Mobile must work on a real device.** The upstream template is explicitly untested on
  phones, and a recruiter on mobile seeing a broken hero sees nothing useful.
- Generous whitespace; visually distinct left edge per block
- Structure should resist 15 shallow projects and reward 3 deep ones

### Additions from round 2 (primary sources + practitioners)

- **`relevance_note` on featured work** — Anthropic literally asks for "a link to the piece
  of work most relevant to the team, **along with a brief description of the work and its
  relevance**." One link, contextualized. Supports a "tailor this for the role" affordance.
- **`live_demo_url` as a structurally prominent, absence-obvious field** — only 23% of ML
  practitioners have ever deployed; the demo link is the cheapest large differentiator.
- **`eval_harness` as its own artifact type**, not a property of a project. Frontier-lab JDs
  name "eval harnesses, verifiers" as hireable work in their own right.
- **`observability` / `benchmark` slots** — the top-converting archetypes all pair a system
  with its measurement apparatus.
- **Blog posts and Publications as separate first-class fields** — Anthropic's application
  form collects them separately, so they're distinct signals, not one "writing" bucket.
- **Talking-point framing.** Since practitioners overwhelmingly use portfolios to generate
  interview questions rather than to assess competence, each project should surface one
  *"ask me about this"* hook: the hardest problem, the surprising result, the thing that
  broke.
- **Consultant-mode fields (if that positioning is chosen):** client outcome (before/after),
  methodology, services, engagement model, "what I'd tell you not to build", data/IP posture.

### Design tension to resolve deliberately

The upstream template's charm is the folder metaphor: playful, visual, collection-oriented.
The research demands front-loaded text signal, keyword density, and metrics above the fold.
These pull in opposite directions.

Resolution: keep the folder interaction as the **exploration layer below the fold** (where
case-study click-through is ~15% and the audience is the senior reader who wants depth), and
add a scannable, text-first, metric-dense **signal layer above it** for the 6-second reader.
The folders become the reward for scrolling, not the filter.

---

## Sources

Recruiter behavior / scanning: showproof.io, openapplier.com, blog.interviewpal.com,
jobsbyculture.com, Ladders eye-tracking (2012, 2018), Nielsen Norman Group F-pattern.

AI/ML resume + portfolio: turquoisetailoring.com, aitechconnect.in,
myengineeringpath.dev, dataexpert.io (Zach Wilson).

Red flags: learnist.org (x4), docs.bswen.com, medium.com/@sohail_saifi (100 tech-lead
portfolio analysis), soltech.net, LinkedIn (Ravish Kumar).

Senior bar / MLOps: interviewnode.com (x4), kore1.com (x4), calibrd.com, prachub.com,
systemdesignhandbook.com, techpilot.ai, f5hiringsolutions.com, herohunt.ai.

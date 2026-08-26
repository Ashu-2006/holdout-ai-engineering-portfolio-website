import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

/* ============================================================
   Content schemas.

   These are the product. A portfolio template's real value is a
   validated shape that makes the strong thing easy to express and
   the weak thing hard. See docs/HIRING-SIGNALS.md.

   Deliberate constraints, each traceable to research:
   - EvalResult REQUIRES baseline + failureNotes, so a bare
     "99.8% accuracy" cannot be expressed.
   - A system's metrics need at least two entries.
   - liveDemo is optional but its absence renders as a visible
     gap rather than silently vanishing.
   ============================================================ */

/** A measured value. `context` is what makes a number legible. */
const metric = z.object({
  value: z.string(),
  label: z.string(),
  unit: z.string().optional(),
  /**
   * Required, not optional. A number with no measurement context is
   * unreadable: 94% of what, over what, at what k. Making this optional
   * makes it skippable, and it is the half that turns a claim into
   * evidence. If a number has no honest context, delete the number.
   */
  context: z.string(),
  /** What it was before, when there is a before. */
  baseline: z.string().optional(),
  /** The artifact that proves it: a harness, a run, a model card. */
  proof: z.string().url().optional(),
});

/** An external thing a reviewer can open and verify. */
const artifact = z.object({
  kind: z.enum(["repo", "demo", "model", "dataset", "paper", "post"]),
  url: z.string().url(),
  label: z.string().optional(),
});

/**
 * The senior signal. Research finding: seniority is judged on
 * explicit trade-off reasoning, not on model cleverness.
 * `tradeoff` and `secondOrder` are what separate mid from senior,
 * so both are required.
 */
const decisionRecord = z.object({
  decision: z.string(),
  alternatives: z.array(z.string()).min(1),
  rationale: z.string(),
  tradeoff: z.string(),
  secondOrder: z.array(z.string()).min(1),
});

/**
 * An evaluation. `baseline` and `failureNotes` are required by
 * design: a score with no baseline is unreadable, and a system
 * with no known failure modes has not been evaluated.
 */
const evalResult = z.object({
  method: z.string(),
  datasetSize: z.number().int().positive(),
  metric: z.string(),
  score: z.string(),
  baseline: z.string(),
  failureNotes: z.string(),
});

/**
 * An architecture diagram. Must be legible in ~15 seconds without prose,
 * which is a constraint on the author, not on the renderer: four nodes and
 * three edges, not fifteen.
 */
const diagram = z.object({
  /** Inline SVG is the default. Mermaid is the escape hatch for flows. */
  kind: z.enum(["svg", "mermaid"]),
  source: z.string(),
  /** Required. A diagram with no alt text is decoration. */
  alt: z.string(),
  caption: z.string().optional(),
});

/** A shipped system. The primary unit of evidence. */
const systems = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/systems" }),
  schema: z.object({
    title: z.string(),
    /** One sentence leading with the result. */
    outcome: z.string(),
    /** Why this matters for the role being applied to. */
    relevanceNote: z.string().optional(),
    /**
     * Required, and it drives the card's whole treatment.
     *
     * The research demands that a missing live demo read as a gap. Most
     * templates handle that by omitting the field, which hides the gap.
     * A required four-case enum turns the absence into a named state
     * instead of a silent special case.
     */
    maturity: z.enum(["deployed", "shipped", "prototype", "archived"]),
    liveDemo: z.string().url().optional(),
    diagram: diagram.optional(),
    /** At least two, so a single cherry-picked number is not enough. */
    metrics: z.array(metric).min(2),
    stack: z.array(z.string()).min(1),
    artifacts: z.array(artifact).default([]),
    decisions: z.array(decisionRecord).default([]),
    evals: z.array(evalResult).default([]),
    limitations: z.array(z.string()).default([]),
    /** "Ask me about..." Portfolios are used to source interview questions. */
    talkingPoint: z.string().optional(),
    /** Exactly one system should set this. Enforced at build time. */
    featured: z.boolean().default(false),
    order: z.number().default(99),
    draft: z.boolean().default(false),
  }),
});

/** Employment history. Read second-most after the headline. */
const roles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/roles" }),
  schema: z.object({
    company: z.string(),
    title: z.string(),
    start: z.string(),
    /** Omit for a current role. */
    end: z.string().optional(),
    /** One line: what changed because you were there. */
    impact: z.string(),
    /** City, country. Recruiters filter on this. */
    location: z.string().optional(),
    /** How the work happened. Also a filter. */
    workMode: z.enum(["on-site", "remote", "hybrid"]).optional(),
    stack: z.array(z.string()).default([]),
    order: z.number().default(99),
  }),
});

/** Writing. Drafts render as a visible queue, not a blank shelf. */
const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
    readingTime: z.string().optional(),
    status: z.enum(["live", "draft"]).default("draft"),
    /**
     * Where a draft actually is, shown verbatim in the queue. "outlined"
     * is information; "coming soon" is a promise with no date on it.
     */
    stage: z.enum(["outlined", "drafting", "in progress", "in review"]).optional(),
    tags: z.array(z.string()).default([]),
  }),
});

/** Interactive explainers. Each demonstrates one concept. */
const lab = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/lab" }),
  schema: z.object({
    title: z.string(),
    blurb: z.string(),
    /** Which visual to render; keeps the demo out of the content file. */
    visual: z.enum(["tokens", "heatmap", "histogram"]),
    relatedSystem: reference("systems").optional(),
    order: z.number().default(99),
  }),
});

export const collections = { systems, roles, posts, lab };

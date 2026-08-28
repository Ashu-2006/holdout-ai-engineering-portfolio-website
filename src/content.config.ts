import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

/* ============================================================
   Content schemas.

   Systems and roles live in src/data/work.ts rather than here:
   the reference's row layouts want strongly-typed structured
   fields (computed durations, required baselines, evidence
   arrays), and Markdown frontmatter is a worse place to enforce
   that than TypeScript is.

   What stays in collections is what is genuinely prose: writing
   and lab notes. Those are documents, and documents belong in
   Markdown.

   The constraints below are the point. Each one makes the honest
   thing easy to express and the weak thing hard.
   ============================================================ */

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    /** One sentence. Shown in the index, so it has to stand alone. */
    description: z.string(),
    date: z.coerce.date(),
    /** Cover in /mock. Required: the index is a visual grid. */
    cover: z.string(),
    readingTime: z.string(),
    status: z.enum(["live", "draft"]).default("draft"),
    /**
     * Where a draft actually is, shown verbatim in the queue.
     * "outlined" is information. "coming soon" is a promise with
     * no date on it, which is why that is not an option here.
     */
    stage: z.enum(["outlined", "drafting", "in review"]).optional(),
    tags: z.array(z.string()).default([]),
  }),
});

const lab = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/lab" }),
  schema: z.object({
    title: z.string(),
    /** What the reader will understand afterwards, in one line. */
    blurb: z.string(),
    /** Preview in /mock. */
    visual: z.string(),
    /**
     * Required. A lab entry that does not say what it demonstrates
     * is a screenshot, and this collection is for explanations.
     */
    teaches: z.string(),
    order: z.number().default(99),
  }),
});

export const collections = { posts, lab };

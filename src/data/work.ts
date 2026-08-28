/**
 * Experience and projects, shaped for the reference's expandable
 * row pattern (Figma 1:18100 and 1:18554).
 *
 * Structure notes, because the shape is doing design work:
 *
 *  - Experience groups by ORGANISATION, then lists roles inside
 *    it. Two roles at one org is common and a flat list makes it
 *    look like two jobs.
 *  - `end: null` means ongoing and renders as the infinity glyph,
 *    per the reference. Duration is COMPUTED from the dates, so a
 *    stale "2y 6m" cannot be left behind in the copy.
 *  - Every project carries `evidence`: what a reviewer can open.
 *    A project with nothing to open renders that absence as a
 *    visible state rather than quietly omitting the row.
 *
 * ALL PLACEHOLDER. Every organisation, date, metric and bullet below
 * is invented to exercise the layout. Replace with your own; the
 * shapes are the point, not the content.
 */

export type Maturity = "deployed" | "shipped" | "prototype" | "archived";

export interface Role {
  title: string;
  icon: string;
  employment: "Full-time" | "Part-time" | "Internship" | "Research" | "Volunteer";
  /** YYYY-MM. */
  start: string;
  /** YYYY-MM, or null for ongoing. */
  end: string | null;
  bullets: string[];
  chips: string[];
}

export interface OrgGroup {
  org: string;
  location: string;
  mode: "Remote" | "On-site" | "Hybrid";
  verified: boolean;
  roles: Role[];
}

export const experience: OrgGroup[] = [
  {
    org: "Applied ML Lab, Example University",
    location: "India",
    mode: "On-site",
    verified: true,
    roles: [
      {
        title: "Undergraduate Research Assistant",
        icon: "ph:cpu",
        employment: "Research",
        start: "2025-08",
        end: null,
        bullets: [
          "Instrumented three CNC spindles with accelerometers and built the acquisition path from Arduino to a Postgres time-series table.",
          "Trained a bearing-fault classifier on 41 hours of labelled vibration data. Baseline was a fixed RMS threshold at 0.71 F1; the model reached 0.89 F1 on a held-out machine it had never seen.",
          "Wrote the failure-mode note the lab now hands to new students: the model degrades badly below 900 RPM because the fault signature falls under the noise floor.",
        ],
        chips: ["Python", "scikit-learn", "Arduino", "PostgreSQL", "Signal processing"],
      },
    ],
  },
  {
    org: "Kaggle",
    location: "Remote",
    mode: "Remote",
    verified: true,
    roles: [
      {
        title: "Competition Contributor",
        icon: "ph:chart-scatter",
        employment: "Part-time",
        start: "2025-01",
        end: null,
        bullets: [
          "Took part in three competitions, owning data cleaning and preprocessing for a two-person team.",
          "Merged five source datasets into one feature table and wrote a row-for-row equivalence test against the previous pipeline before switching over.",
          "Best finish: 539 of 3,300 entrants. The gap to the top 100 was feature engineering, not model choice, which is written up in the notebook.",
        ],
        chips: ["Pandas", "NumPy", "EDA", "Feature engineering", "Jupyter"],
      },
    ],
  },
  {
    org: "Nuvora Analytics",
    location: "Ahmedabad, India",
    mode: "Remote",
    verified: false,
    roles: [
      {
        title: "Machine Learning Intern",
        icon: "ph:briefcase",
        employment: "Internship",
        start: "2026-05",
        end: "2026-07",
        bullets: [
          "Built the review-triage classifier that now routes support tickets. 12,000 labelled reviews, 0.91 macro F1 against a 0.68 keyword baseline.",
          "Cut inference cost by quantizing the deployed model to INT8, which held accuracy inside 0.4 points and dropped p95 latency from 240ms to 88ms.",
          "Shipped the eval harness alongside it, so the next person can tell whether a change helped.",
        ],
        chips: ["Python", "Hugging Face", "Docker", "Quantization", "Eval"],
      },
    ],
  },
  {
    org: "Example Literacy Program",
    location: "India",
    mode: "On-site",
    verified: true,
    roles: [
      {
        title: "Volunteer Teacher",
        icon: "ph:hand-heart",
        employment: "Volunteer",
        start: "2023-06",
        end: "2024-04",
        bullets: [
          "Taught basic language proficiency to domestic helpers and homemakers, weekly, across one academic year.",
          "Twelve learners. Nine could read a utility bill unaided by the end, which was the only outcome we actually tracked.",
        ],
        chips: ["Teaching", "Curriculum", "Community"],
      },
    ],
  },
];

export interface Project {
  slug: string;
  title: string;
  icon: string;
  /** Poster in /mock. Every project has one; none are optional. */
  poster: string;
  start: string;
  end: string | null;
  maturity: Maturity;
  /** One sentence, leading with the result. */
  outcome: string;
  bullets: string[];
  chips: string[];
  /** The headline measurement, with the context that makes it legible. */
  metric: { value: string; label: string; context: string; baseline: string | null };
  /** What a reviewer can open. An empty array renders as a named gap. */
  evidence: { kind: "repo" | "demo" | "notebook" | "model" | "writeup"; label: string; url: string }[];
  featured: boolean;
}

export const projects: Project[] = [
  {
    slug: "spindle-sentinel",
    title: "Spindle Sentinel",
    icon: "ph:waveform",
    poster: "/mock/poster-spindle.svg",
    start: "2025-09",
    end: null,
    maturity: "deployed",
    outcome:
      "Bearing-fault detection on live CNC spindles, running in the lab since January and catching two failures before they stopped a machine.",
    bullets: [
      "Accelerometer to Arduino to Postgres, sampled at 3.2kHz and downsampled to 128-bin spectrograms for the classifier.",
      "Gradient-boosted trees on spectral features beat a small CNN here, which was the surprise. With 41 hours of data the CNN overfit the three machines it was trained on.",
      "Deployed as a cron job, not a service. It has to survive a lab network that drops out, so it batches and retries rather than streaming.",
      "Known failure: below 900 RPM the fault signature sits under the noise floor and recall falls to 0.41. The threshold is documented in the readme rather than hidden.",
    ],
    chips: ["Python", "scikit-learn", "Arduino", "PostgreSQL", "Spectrograms", "Cron"],
    metric: {
      value: "0.89",
      label: "macro F1",
      context: "held-out machine, 41h labelled vibration data, 3 fault classes",
      baseline: "0.71 with a fixed RMS threshold",
    },
    evidence: [
      { kind: "repo", label: "Source", url: "https://github.com/" },
      { kind: "writeup", label: "Failure modes", url: "https://github.com/" },
      { kind: "notebook", label: "Training run", url: "https://kaggle.com/" },
    ],
    featured: true,
  },
  {
    slug: "grounded",
    title: "Grounded",
    icon: "ph:books",
    poster: "/mock/poster-grounded.svg",
    start: "2026-02",
    end: null,
    maturity: "shipped",
    outcome:
      "Retrieval over four semesters of lecture notes that answers with citations, or says it does not know.",
    bullets: [
      "Hybrid retrieval: BM25 for the exact notation students actually search for, embeddings for the paraphrases. Reciprocal rank fusion over both.",
      "Refuses rather than guesses. If the top chunk scores under threshold the answer is 'not in these notes', which is the whole reason anyone trusts it.",
      "Evaluated on 120 hand-written question and answer pairs, not on vibes. Faithfulness is scored by whether every claim maps to a retrieved span.",
      "Chunking by heading beat fixed-size chunking by 11 points of recall, because lecture notes are already structured and fixed windows cut definitions in half.",
    ],
    chips: ["Python", "BM25", "Embeddings", "RRF", "FastAPI", "Eval"],
    metric: {
      value: "0.84",
      label: "faithfulness",
      context: "120 hand-labelled QA pairs across 4 semesters of notes",
      baseline: "0.52 with embedding-only retrieval",
    },
    evidence: [
      { kind: "demo", label: "Live", url: "https://example.dev/" },
      { kind: "repo", label: "Source", url: "https://github.com/" },
      { kind: "writeup", label: "Eval method", url: "https://github.com/" },
    ],
    featured: false,
  },
  {
    slug: "review-triage",
    title: "Review Triage",
    icon: "ph:chat-centered-text",
    poster: "/mock/poster-sentiment.svg",
    start: "2026-05",
    end: "2026-07",
    maturity: "deployed",
    outcome:
      "Sentiment and intent classifier that routes incoming support reviews, replacing a keyword rule set.",
    bullets: [
      "Started as a coursework sentiment model, then earned its way into production at an internship because the keyword baseline was misrouting a third of angry customers.",
      "Fine-tuned a small encoder rather than calling an API. 12,000 labelled rows was enough, and the cost per million classifications is two orders of magnitude lower.",
      "Quantized to INT8 for serving: p95 latency 240ms to 88ms, accuracy down 0.4 points. That trade was written down and agreed before it shipped.",
      "The confusion matrix is the artifact worth reading. Neutral and mildly-negative are the class pair the model cannot separate, and that is also the pair humans disagree on.",
    ],
    chips: ["Python", "Hugging Face", "Fine-tuning", "INT8", "Docker"],
    metric: {
      value: "0.91",
      label: "macro F1",
      context: "12,000 labelled reviews, 5 classes, held-out 20% split",
      baseline: "0.68 with the keyword rule set it replaced",
    },
    evidence: [
      { kind: "model", label: "Model card", url: "https://huggingface.co/" },
      { kind: "repo", label: "Source", url: "https://github.com/" },
    ],
    featured: false,
  },
  {
    slug: "tabular-cleanroom",
    title: "Tabular Cleanroom",
    icon: "ph:table",
    poster: "/mock/poster-cleanroom.svg",
    start: "2025-01",
    end: "2025-11",
    maturity: "shipped",
    outcome:
      "The preprocessing pipeline behind three Kaggle entries, built so a teammate could rerun it without asking anything.",
    bullets: [
      "Five source datasets, one feature table. Joins, dtype coercion, leakage checks and a manifest of every transform applied.",
      "Ships with an equivalence test against the previous notebook, row for row. Rewriting a pipeline without one is how a leaderboard drop becomes unexplainable.",
      "Best finish 539 of 3,300. The write-up is honest about why: the gap to the top hundred was feature engineering, not the model.",
    ],
    chips: ["Pandas", "NumPy", "EDA", "pytest", "Jupyter"],
    metric: {
      value: "539 / 3,300",
      label: "leaderboard",
      context: "public tabular competition, 2 person team, 4 month run",
      baseline: "1,904 on the starter notebook",
    },
    evidence: [
      { kind: "notebook", label: "Notebook", url: "https://kaggle.com/" },
      { kind: "repo", label: "Source", url: "https://github.com/" },
    ],
    featured: false,
  },
  {
    slug: "edge-ladder",
    title: "Edge Ladder",
    icon: "ph:steps",
    poster: "/mock/poster-ladder.svg",
    start: "2026-03",
    end: null,
    maturity: "prototype",
    outcome:
      "A measured comparison of quantization steps on the same model, so the accuracy-for-latency trade stops being a guess.",
    bullets: [
      "FP32, FP16, INT8 and INT4 on one classifier, same eval set, same hardware, reported together.",
      "INT8 is nearly free here: 0.4 points of accuracy for 2.7x throughput. INT4 is not: 6.1 points, which no product would accept.",
      "Still a prototype because it has only been run on one model family. Generalising from one architecture is exactly the mistake the project exists to avoid.",
    ],
    chips: ["PyTorch", "Quantization", "Benchmarking", "Matplotlib"],
    metric: {
      value: "2.7x",
      label: "throughput at INT8",
      context: "same eval set and hardware, batch 1, 1,000 warm requests",
      baseline: "FP32 at 1.0x, 0.4pt accuracy cost",
    },
    evidence: [{ kind: "repo", label: "Source", url: "https://github.com/" }],
    featured: false,
  },
  {
    slug: "promptproof",
    title: "Promptproof",
    icon: "ph:test-tube",
    poster: "/mock/poster-promptproof.svg",
    start: "2026-06",
    end: null,
    maturity: "prototype",
    outcome:
      "A small harness that fails a build when a prompt change makes the output worse.",
    bullets: [
      "Golden set of 60 cases with assertions, run in CI. A prompt edit that drops any assertion is a red build, not a discussion.",
      "Built because a one-word prompt change silently broke JSON parsing for a week on another project.",
      "Deliberately not a framework. It is 200 lines, and the moment it needs a plugin system it has lost the argument.",
    ],
    chips: ["Python", "pytest", "CI", "Prompt engineering"],
    metric: {
      value: "60",
      label: "golden cases",
      context: "assertions on schema, refusal behaviour and citation presence",
      baseline: "no regression gate before this",
    },
    evidence: [],
    featured: false,
  },
];

/** ---- helpers -------------------------------------------------
 * Duration is derived, never authored. An authored "2y 6m" goes
 * stale the month after it is written.
 */
export function monthsBetween(start: string, end: string | null): number {
  const [sy, sm] = start.split("-").map(Number);
  const e = end ? end.split("-").map(Number) : null;
  const now = new Date();
  const ey = e ? e[0] : now.getUTCFullYear();
  const em = e ? e[1] : now.getUTCMonth() + 1;
  return Math.max(0, (ey - sy) * 12 + (em - sm)) + 1;
}

/** "8m", "2y", "2y 6m". Compact enough to sit in a mono meta line. */
export function humanDuration(start: string, end: string | null): string {
  const m = monthsBetween(start, end);
  const y = Math.floor(m / 12);
  const rem = m % 12;
  if (y === 0) return `${m}m`;
  if (rem === 0) return `${y}y`;
  return `${y}y ${rem}m`;
}

/** "05.2025" for a mono date, matching the reference format. */
export function dotDate(ym: string): string {
  const [y, m] = ym.split("-");
  return `${m}.${y}`;
}

/** The infinity glyph for an ongoing range, per the reference. */
export function dateRange(start: string, end: string | null): string {
  return `${dotDate(start)} - ${end ? dotDate(end) : "∞"}`;
}

export const maturityMeta: Record<Maturity, { label: string; tone: string }> = {
  deployed: { label: "Deployed", tone: "live" },
  shipped: { label: "Shipped", tone: "live" },
  prototype: { label: "Prototype", tone: "caution" },
  archived: { label: "Archived", tone: "muted" },
};

export const findProject = (slug: string) => projects.find((p) => p.slug === slug);

/** Single source of truth for identity. Everything else is content. */
export const site = {
  name: "Ashutosh Rana",
  role: "AI Engineer",
  /** Completes the sentence "I build …" */
  builds: "retrieval systems and agent pipelines that hold up past the demo",
  availability: "Open to AI engineering roles",
  location: "India",
  timezone: "Asia/Kolkata",
  pronouns: "he/him",
  email: "ashutosh@armoriq.io",
  url: "https://example.dev",
  /**
   * Tier 1 recognition shortcut. A recruiter pattern-matches a company
   * name faster than they parse a metric, so this sits above the numbers.
   * With no name brands, substitute outcome scale instead.
   */
  proofRow: {
    label: "Previously at",
    items: ["ArmorIQ", "Ivish AI", "Shopstr"],
    note: "design and frontend, shipped to production",
  },
} as const;

export const profiles = [
  { platform: "GitHub", handle: "ashu-2006", url: "https://github.com/ashu-2006", stat: "142 contributions", kind: "artifact" },
  { platform: "Hugging Face", handle: "ashutosh", url: "https://huggingface.co/", stat: "3 models · 400+ downloads", kind: "artifact" },
  { platform: "Kaggle", handle: "ashutosh", url: "https://kaggle.com/", stat: "Expert", kind: "artifact" },
  { platform: "LeetCode", handle: "ashutosh", url: "https://leetcode.com/", stat: "1847 · Knight", kind: "rating" },
  { platform: "Codeforces", handle: "ashutosh", url: "https://codeforces.com/", stat: "1512 · Specialist", kind: "rating" },
] as const;

/** Grouped by purpose, not a flat logo wall. */
export const stackGroups = [
  { group: "Serving", items: ["vLLM", "FastAPI", "Docker", "Modal"] },
  { group: "Retrieval", items: ["Qdrant", "pgvector", "BM25", "Cohere rerank"] },
  { group: "Training", items: ["PyTorch", "TRL", "LoRA", "Axolotl"] },
  { group: "Rigor", items: ["Ragas", "promptfoo", "W&B", "pytest"] },
] as const;

export const record = [
  { rank: "Top 30", of: "8,000+ teams", what: "national space-tech hackathon" },
  { rank: "539", of: "3,300+", what: "Kaggle optimization competition" },
  { rank: "1st runner up", of: "6,300 participants", what: "MLH hackathon" },
] as const;

/* Shape overrides for how an item hangs inside a folder. Sizes are % of the
   folder's width; `top` is how far down it's pushed. */
export type Shape = { w?: number; ratio?: string; top?: number };

export type CollectionItem =
  | string
  | ({ src: string } & Shape)
  | ({ logo: string; label?: string } & Shape)
  | ({ note: string } & Shape);

export interface Collection {
  slug: string;
  title: string;
  meta: string;
  items: CollectionItem[];
}

export const collections: Collection[] = [
  {
    slug: "travel",
    title: "Travel",
    meta: "14 places",
    items: [
      "https://picsum.photos/seed/kashmir/900/1200",
      "https://picsum.photos/seed/london/1200/900",
      "https://picsum.photos/seed/paris/1000/1000",
      "https://picsum.photos/seed/tokyo/1200/800",
      "https://picsum.photos/seed/lisbon/900/1200",
    ],
  },
  {
    slug: "projects",
    title: "Projects",
    meta: "9 things I built",
    items: [
      { logo: "https://pdfstudio-demo.fayaz.workers.dev/favicon.svg", label: "PDF Studio" },
      { logo: "https://screendrop.fayazahmed.com/favicon.ico", label: "Screendrop" },
      { logo: "https://codereel.fayazahmed.com/logo.png", label: "CodeReel" },
      { logo: "https://supersaas.dev/logo.png", label: "Supersaas" },
    ],
  },
  {
    slug: "writing",
    title: "Writing",
    meta: "23 posts",
    items: [
      { note: "Why I stopped reaching for a framework" },
      { note: "Shipping a side project in a weekend" },
      { note: "The unreasonable effectiveness of boring CSS" },
      { note: "Notes on building for the edge" },
    ],
  },
  {
    slug: "bookmarks",
    title: "Bookmarks",
    meta: "A pile of tabs",
    items: [
      "https://picsum.photos/seed/delta/900/1200",
      "https://picsum.photos/seed/epsilon/1200/900",
      "https://picsum.photos/seed/zeta/1000/1000",
      "https://picsum.photos/seed/eta/1200/800",
      "https://picsum.photos/seed/theta/900/1200",
      "https://picsum.photos/seed/iota/1200/900",
    ],
  },
];

/* A stack of identically-shaped cards reads as a template. Cycling shapes and
   hanging them at different heights makes a folder look like real things stuffed
   into it. Photos vary the most; logos want to stay square and paper stays
   portrait, so those cycles only vary width and how far they're pushed in. */
const SHAPES = {
  photo: [
    { w: 34, ratio: "4/5", top: 5 },
    { w: 44, ratio: "4/3", top: 9 },
    { w: 37, ratio: "1/1", top: 4 },
    { w: 42, ratio: "3/2", top: 10 },
    { w: 32, ratio: "3/4", top: 6 },
  ],
  logo: [
    { w: 36, ratio: "1/1", top: 6 },
    { w: 40, ratio: "1/1", top: 10 },
    { w: 34, ratio: "1/1", top: 4 },
    { w: 38, ratio: "1/1", top: 12 },
  ],
  note: [
    { w: 34, ratio: "3/4", top: 5 },
    { w: 37, ratio: "3/4", top: 9 },
    { w: 33, ratio: "3/4", top: 3 },
    { w: 36, ratio: "3/4", top: 11 },
  ],
};

export type Card = ReturnType<typeof normalise>[number];

/** Resolves the loose authoring format into a kind plus a concrete shape. */
export function normalise(items: CollectionItem[]) {
  return items.map((item, i) => {
    const value = typeof item === "string" ? { src: item } : item;
    const kind = "logo" in value ? "logo" : "note" in value ? "note" : "photo";
    const cycle = SHAPES[kind];
    return { kind, ...cycle[i % cycle.length], ...value } as {
      kind: "photo" | "logo" | "note";
      w: number;
      ratio: string;
      top: number;
      src?: string;
      logo?: string;
      label?: string;
      note?: string;
    };
  });
}

export const findCollection = (slug: string) =>
  collections.find((c) => c.slug === slug);

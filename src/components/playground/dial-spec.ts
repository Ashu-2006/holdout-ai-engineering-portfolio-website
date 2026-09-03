/**
 * The control vocabulary shared by every lab.
 *
 * THERE IS ONE DIAL KIT, NOT ONE PER LAB. The card lab and the post
 * lab differ only in the spec they hand to DialKit and the stage they
 * put next to it. The panel, the persistence, the reset, the copy and
 * every interaction live in DialKit.astro and are written once.
 *
 * Three kinds of control, three mechanisms, no others:
 *
 *   range  writes a custom property onto the stage's inline style
 *   switch writes data-<flag>="on|off" onto the stage
 *   seg    writes data-<attr>="<value>" onto the stage
 *
 * The runtime never learns the name of a single control. It reads
 * `data-var`, `data-flag` and `data-attr` off the DOM, so adding a dial
 * is one line in a spec and no change to any script.
 */

/** A slider. `unit` is appended when the property is written. */
export type Range = {
  kind: "range";
  id: string;
  name: string;
  value: number | string;
  min: number;
  max: number;
  step: number;
  unit: "px" | "em" | "%" | "ms" | "";
  /** Custom property written to the stage. */
  cssVar: string;
  /**
   * When set, a value of 0 also writes data-<zeroAttr>="off" on the
   * stage (and "on" otherwise). This exists for line-clamp, where 0 is
   * not a valid count: setting it collapses the paragraph to nothing
   * instead of removing the clamp, so "off" has to be an attribute.
   */
  zeroAttr?: string;
  /**
   * Set false to keep this property out of the Copy CSS block. For
   * controls that belong to the lab rather than to the component: zoom
   * is how close you are standing, not something the component has.
   */
  export?: boolean;
};

/** A toggle switch. Writes data-<flag> on the stage. */
export type Switch = {
  kind: "switch";
  id: string;
  name: string;
  flag: string;
  on: boolean;
};

/** A segmented control. Writes data-<attr> on the stage. */
export type Seg = {
  kind: "seg";
  id: string;
  name: string;
  /** "@theme" is the one reserved value: it writes <html data-theme>. */
  attr: string;
  value: string;
  options: { v: string; label: string }[];
};

export type Control = Range | Switch | Seg;

export type Group = {
  title: string;
  /** Shown under the legend. Use it to state a finding, not to label. */
  note?: string;
  controls: Control[];
};

/** One layout argument. `note` states what it answers and what it costs. */
export type Variant = {
  v: string;
  index: string;
  name: string;
  note: string;
};

/**
 * A derived slider: `target` is computed as `from` minus `minus` while
 * the lock is on, and its own control is disabled. Used for concentric
 * radii, where inner = outer minus padding is a rule rather than a
 * preference.
 */
export type Lock = {
  label: string;
  /** Range id whose value is derived. */
  target: string;
  from: string;
  minus: string;
  /** Group title to render the lock switch under. */
  group: string;
  on: boolean;
};

/**
 * A content stress test: swaps the text of one element on the stage.
 * The only control that changes text rather than CSS, which is why it
 * is declared rather than inferred.
 */
export type Stress = {
  id: string;
  label: string;
  /** Element id on the stage whose textContent is swapped. */
  target: string;
  text: string;
  /** Group title to render the switch under. */
  group: string;
};

/**
 * One builder, and the unit is never optional.
 *
 * It was optional for about ten minutes, and every control that needed
 * something other than px wrote a bare number into a property that
 * required a length. `border-width: 0.8` is not an error you can see:
 * the declaration is dropped and the value falls back to whatever the
 * cascade had, which looks like a slider that does nothing.
 */
export const dial = (
  id: string,
  name: string,
  cssVar: string,
  unit: Range["unit"],
  value: number,
  min: number,
  max: number,
  step: number,
  zeroAttr?: string,
): Range => ({
  kind: "range",
  id,
  name,
  cssVar,
  unit,
  value,
  min,
  max,
  step,
  zeroAttr,
});

/** px slider. The common case, so it gets the short name. */
export const px = (
  id: string,
  name: string,
  cssVar: string,
  value: number,
  min: number,
  max: number,
  step = 1,
): Range => dial(id, name, cssVar, "px", value, min, max, step);

/**
 * Millisecond slider. Its own helper because a duration written
 * unitless is the exact failure mode the unit rule exists for, and it
 * is invisible: `animation-duration: 260` is dropped, the value falls
 * back to 0s, and the animation appears not to exist. Cost me one
 * verification pass on the grid lab.
 */
export const ms = (
  id: string,
  name: string,
  cssVar: string,
  value: number,
  min: number,
  max: number,
  step: number,
): Range => dial(id, name, cssVar, "ms", value, min, max, step);

/** Unitless slider: ratios, multipliers, weights, counts. */
export const num = (
  id: string,
  name: string,
  cssVar: string,
  value: number,
  min: number,
  max: number,
  step: number,
  zeroAttr?: string,
): Range => dial(id, name, cssVar, "", value, min, max, step, zeroAttr);

export const toggle = (
  id: string,
  name: string,
  flag: string,
  on: boolean,
): Switch => ({ kind: "switch", id, name, flag, on });

export const seg = (
  id: string,
  name: string,
  attr: string,
  value: string,
  options: [string, string][],
): Seg => ({
  kind: "seg",
  id,
  name,
  attr,
  value,
  options: options.map(([v, label]) => ({ v, label })),
});

/**
 * The canvas group, identical in every lab: theme, ground, zoom, and
 * the two diagnostics. Duplicating it per lab is how two labs start
 * disagreeing about what "Ground" means.
 */
export const canvasGroup = (zoomMax = 3): Group => ({
  title: "Canvas",
  controls: [
    seg("theme", "Theme", "@theme", "dark", [
      ["dark", "Dark"],
      ["light", "Light"],
      ["system", "Auto"],
    ]),
    seg("backdrop", "Ground", "backdrop", "ground", [
      ["ground", "Ground"],
      ["surface", "Surface"],
      ["sunken", "Sunken"],
    ]),
    { ...num("zoom", "Zoom", "--lab-zoom", 1, 0.5, zoomMax, 0.05), export: false },
    toggle("f-grid", "8px lattice", "grid", false),
    toggle("f-bounds", "Outline every box", "bounds", false),
  ],
});

/**
 * Generates the site's mock imagery into public/mock as SVG.
 *
 * Why generate rather than drop in stock photography:
 *
 *  1. The subject is machine learning, so the honest "hero image"
 *     for a project is the artifact it produced. A spectrogram, a
 *     confusion matrix and a retrieval graph carry information;
 *     an abstract gradient carries none.
 *  2. Nothing 404s and nothing is hotlinked. Every asset is local,
 *     versioned, and inspectable in a text editor.
 *  3. Seeded, so a rebuild produces byte-identical output. An
 *     unseeded Math.random() would churn the whole directory on
 *     every run and make the diffs useless.
 *
 * Run: node scripts/gen-mock.mjs
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "mock");
mkdirSync(OUT, { recursive: true });

/* ---- seeded PRNG (mulberry32) -----------------------------------
   Deterministic output is the whole point; see note 3 above. */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---- palette ----------------------------------------------------
   The UI chrome is monochrome by design, so all the chroma on the
   site lives in these posters. Each one gets exactly one hue and
   spends it on the data, never on the background. Kept at low
   saturation so a poster reads as an instrument readout rather
   than as decoration. */
const INK = "#f2f2f2";
const DIM = "#8f8f8f";
const GROUND = "#0d0d0e";
const PANEL = "#141416";
const LINE = "rgba(255,255,255,0.10)";
const FAINT = "rgba(255,255,255,0.055)";

const HUES = {
  amber: ["#f59e0b", "#7c4a06"],
  lime: ["#a3e635", "#3f5312"],
  cyan: ["#22d3ee", "#0b4a56"],
  violet: ["#a78bfa", "#3f2d78"],
  rose: ["#fb7185", "#6b1d2b"],
  orange: ["#fb923c", "#6d3311"],
  teal: ["#2dd4bf", "#0d4f47"],
};

const W = 1200;
const H = 750;

/** Shared defs: a grain overlay and the plate gradient. Grain is
 *  what keeps a flat SVG from looking like clip art at large sizes. */
function defs(extra = "") {
  return `<defs>
    <linearGradient id="plate" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${PANEL}"/>
      <stop offset="1" stop-color="${GROUND}"/>
    </linearGradient>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7" result="n"/>
      <feColorMatrix in="n" type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.055"/></feComponentTransfer>
    </filter>
    ${extra}
  </defs>`;
}

/** The plate every poster sits on: gradient ground, hairline frame,
 *  a faint 40px measure grid, and a grain wash on top. */
function plate(children, { grid = true } = {}) {
  let g = "";
  if (grid) {
    const lines = [];
    for (let x = 40; x < W; x += 40) lines.push(`M${x} 0V${H}`);
    for (let y = 40; y < H; y += 40) lines.push(`M0 ${y}H${W}`);
    g = `<path d="${lines.join("")}" stroke="${FAINT}" stroke-width="1" fill="none"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img">
  ${defs()}
  <rect width="${W}" height="${H}" fill="url(#plate)"/>
  ${g}
  ${children}
  <rect width="${W}" height="${H}" filter="url(#grain)" opacity="0.9"/>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" fill="none" stroke="${LINE}"/>
</svg>`;
}

/** Mono caption block, bottom-left, matching the site's label style. */
function caption(kicker, title, sub) {
  return `<g font-family="Geist Mono, ui-monospace, monospace">
    <text x="48" y="${H - 92}" font-size="19" letter-spacing="1.6" fill="${DIM}">${kicker}</text>
    <text x="48" y="${H - 58}" font-size="30" letter-spacing="-0.2" fill="${INK}">${title}</text>
    <text x="48" y="${H - 30}" font-size="17" letter-spacing="0.5" fill="${DIM}">${sub}</text>
  </g>`;
}

/** Axis frame for the plotted posters. */
function axes(x, y, w, h, xlabel, ylabel) {
  return `<g>
    <path d="M${x} ${y}V${y + h}H${x + w}" stroke="${LINE}" stroke-width="1.5" fill="none"/>
    <g font-family="Geist Mono, ui-monospace, monospace" font-size="15" letter-spacing="1.2" fill="${DIM}">
      <text x="${x + w}" y="${y + h + 26}" text-anchor="end">${xlabel}</text>
      <text x="${x - 10}" y="${y - 10}" text-anchor="start">${ylabel}</text>
    </g>
  </g>`;
}

const files = {};

/* =================================================================
   1. Spectrogram. Spindle Sentinel: 3.2kHz vibration, 128 bins.
   A real spectrogram has horizontal harmonic bands and a broadband
   smear at the fault event, so the generator builds both rather
   than emitting uniform noise.
   ================================================================= */
{
  const r = rng(1013);
  const x0 = 48, y0 = 90, w = W - 96, h = 400;
  const cols = 120, rows = 40;
  const cw = w / cols, ch = h / rows;
  const [hot] = HUES.amber;
  let cells = "";
  // Fault event occupies a band of columns; energy is broadband there.
  const faultStart = 74, faultEnd = 92;
  for (let c = 0; c < cols; c++) {
    const inFault = c >= faultStart && c <= faultEnd;
    for (let row = 0; row < rows; row++) {
      // rows counted from the bottom = low frequency
      const f = row / rows;
      // Harmonics at 1x, 2x, 3x of the rotation frequency.
      let e = 0;
      for (const hn of [0.08, 0.17, 0.26, 0.41]) {
        e += Math.exp(-Math.pow((f - hn) / 0.022, 2)) * 0.85;
      }
      e += Math.exp(-f * 3.2) * 0.5; // low-frequency floor
      if (inFault) e += (0.55 + r() * 0.4) * Math.exp(-Math.pow((f - 0.6) / 0.34, 2));
      e += r() * 0.12;
      const a = Math.min(1, e);
      if (a < 0.06) continue;
      const y = y0 + h - (row + 1) * ch;
      cells += `<rect x="${(x0 + c * cw).toFixed(1)}" y="${y.toFixed(1)}" width="${(cw + 0.6).toFixed(1)}" height="${(ch + 0.6).toFixed(1)}" fill="${hot}" opacity="${a.toFixed(3)}"/>`;
    }
  }
  // The detector's decision marker over the fault window.
  const mx = x0 + faultStart * cw;
  const mw = (faultEnd - faultStart + 1) * cw;
  const marker = `<g>
    <rect x="${mx.toFixed(1)}" y="${y0 - 14}" width="${mw.toFixed(1)}" height="${h + 28}" fill="none" stroke="${INK}" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.75"/>
    <text x="${(mx + mw / 2).toFixed(1)}" y="${y0 - 22}" text-anchor="middle" font-family="Geist Mono, ui-monospace, monospace" font-size="16" letter-spacing="1.2" fill="${INK}">FAULT  p=0.94</text>
  </g>`;
  files["poster-spindle.svg"] = plate(
    `<g>${cells}</g>${marker}${axes(x0, y0, w, h, "TIME  12.4s WINDOW", "3.2kHz")}${caption("FIG.01  SPECTROGRAM", "Bearing fault signature", "outer-race defect, 1,480 RPM, 128 mel bins")}`,
    { grid: false }
  );
}

/* =================================================================
   2. Retrieval graph. Grounded: hybrid BM25 + embedding fusion.
   Query node on the left, candidate chunks fanned right, edge
   weight = fused score, and the ones under threshold drawn faint
   because the refusal behaviour is the interesting part.
   ================================================================= */
{
  const r = rng(4409);
  const [hot, cold] = HUES.cyan;
  const qx = 190, qy = H / 2 - 40;
  const nodes = [];
  for (let i = 0; i < 11; i++) {
    const t = i / 10;
    nodes.push({
      x: 640 + r() * 380,
      y: 120 + t * 400 + (r() - 0.5) * 46,
      s: Math.max(0.08, 1 - t * 1.05 + (r() - 0.5) * 0.16),
    });
  }
  let edges = "", dots = "";
  for (const n of nodes) {
    const above = n.s >= 0.42;
    const cx = (qx + n.x) / 2;
    edges += `<path d="M${qx + 26} ${qy} C ${cx} ${qy}, ${cx} ${n.y}, ${(n.x - 16).toFixed(1)} ${n.y.toFixed(1)}"
      fill="none" stroke="${above ? hot : cold}" stroke-width="${(0.8 + n.s * 3.4).toFixed(2)}" opacity="${above ? 0.8 : 0.3}"/>`;
    const rad = 7 + n.s * 12;
    dots += `<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${rad.toFixed(1)}" fill="${above ? hot : "none"}" fill-opacity="0.22" stroke="${above ? hot : cold}" stroke-width="1.6" opacity="${above ? 1 : 0.5}"/>
      <text x="${(n.x + rad + 12).toFixed(1)}" y="${(n.y + 5).toFixed(1)}" font-family="Geist Mono, ui-monospace, monospace" font-size="15" fill="${above ? INK : DIM}" opacity="${above ? 1 : 0.65}">${n.s.toFixed(2)}</text>`;
  }
  const thresh = `<g>
    <path d="M600 ${120 + 0.42 / 1.05 * 400}H${W - 40}" stroke="${INK}" stroke-width="1" stroke-dasharray="5 5" opacity="0.4"/>
  </g>`;
  const q = `<g>
    <circle cx="${qx}" cy="${qy}" r="26" fill="${INK}"/>
    <text x="${qx}" y="${qy + 6}" text-anchor="middle" font-family="Geist Mono, ui-monospace, monospace" font-size="17" fill="${GROUND}">?</text>
    <text x="${qx}" y="${qy + 62}" text-anchor="middle" font-family="Geist Mono, ui-monospace, monospace" font-size="16" letter-spacing="1.2" fill="${DIM}">QUERY</text>
  </g>`;
  files["poster-grounded.svg"] = plate(
    `${edges}${thresh}${q}${dots}${caption("FIG.02  HYBRID RETRIEVAL", "Reciprocal rank fusion", "11 candidates, 4 above threshold, rest refused")}`
  );
}

/* =================================================================
   3. Confusion matrix. Review Triage, 5 classes.
   Strong diagonal, and the neutral/mild-negative pair deliberately
   confusable, because that is the finding the copy talks about.
   ================================================================= */
{
  const [hot] = HUES.lime;
  const labels = ["ANGRY", "NEG", "NEUT", "POS", "PRAISE"];
  // Row-normalised, hand-set so the story in the copy is true.
  const m = [
    [0.93, 0.05, 0.01, 0.01, 0.0],
    [0.06, 0.81, 0.11, 0.02, 0.0],
    [0.01, 0.14, 0.7, 0.13, 0.02],
    [0.0, 0.02, 0.12, 0.82, 0.04],
    [0.0, 0.0, 0.02, 0.07, 0.91],
  ];
  const x0 = 300, y0 = 96, cell = 78;
  let cells = "";
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      const v = m[i][j];
      const x = x0 + j * cell, y = y0 + i * cell;
      cells += `<rect x="${x}" y="${y}" width="${cell - 3}" height="${cell - 3}" rx="2" fill="${hot}" opacity="${(0.06 + v * 0.9).toFixed(3)}"/>
        <text x="${x + (cell - 3) / 2}" y="${y + (cell - 3) / 2 + 6}" text-anchor="middle" font-family="Geist Mono, ui-monospace, monospace" font-size="16" fill="${v > 0.45 ? GROUND : v > 0.1 ? INK : DIM}">${v === 0 ? "." : v.toFixed(2).slice(1)}</text>`;
    }
  }
  let axisText = "";
  labels.forEach((l, i) => {
    axisText += `<text x="${x0 - 16}" y="${y0 + i * cell + cell / 2}" text-anchor="end" font-family="Geist Mono, ui-monospace, monospace" font-size="15" letter-spacing="1" fill="${DIM}">${l}</text>`;
    axisText += `<text x="${x0 + i * cell + (cell - 3) / 2}" y="${y0 - 16}" text-anchor="middle" font-family="Geist Mono, ui-monospace, monospace" font-size="15" letter-spacing="1" fill="${DIM}">${l}</text>`;
  });
  // Ring the confusable pair the write-up names.
  const ring = `<rect x="${x0 + 1 * cell - 4}" y="${y0 + 2 * cell - 4}" width="${cell + 2}" height="${cell + 2}" rx="4" fill="none" stroke="${HUES.rose[0]}" stroke-width="2"/>
    <text x="${x0 + 2 * cell + 22}" y="${y0 + 2 * cell + 46}" font-family="Geist Mono, ui-monospace, monospace" font-size="15" fill="${HUES.rose[0]}">&#8592; humans disagree here too</text>`;
  files["poster-sentiment.svg"] = plate(
    `${cells}${axisText}${ring}
     <text x="${x0 - 16}" y="${y0 + 5 * cell + 34}" text-anchor="end" font-family="Geist Mono, ui-monospace, monospace" font-size="15" letter-spacing="1.2" fill="${DIM}">TRUE</text>
     <text x="${x0 + 5 * cell + 16}" y="${y0 - 16}" font-family="Geist Mono, ui-monospace, monospace" font-size="15" letter-spacing="1.2" fill="${DIM}">PREDICTED</text>
     ${caption("FIG.03  CONFUSION MATRIX", "Row-normalised, 5 classes", "12,000 reviews, held-out 20% split, macro F1 0.91")}`,
    { grid: false }
  );
}

/* =================================================================
   4. Data grid. Tabular Cleanroom: nulls, dtype coercion, leakage.
   Reads as a spreadsheet with the repaired cells marked, which is
   what the project actually did.
   ================================================================= */
{
  const r = rng(777);
  const [hot] = HUES.violet;
  const x0 = 48, y0 = 92, cols = 14, rows = 16;
  const cw = (W - 96) / cols, ch = 24;
  let cells = "";
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const x = x0 + j * cw, y = y0 + i * ch;
      const roll = r();
      const state = roll < 0.07 ? "null" : roll < 0.13 ? "fixed" : "ok";
      const fill = state === "null" ? HUES.rose[1] : state === "fixed" ? hot : "rgba(255,255,255,0.045)";
      const op = state === "ok" ? 1 : 0.5;
      cells += `<rect x="${x.toFixed(1)}" y="${y}" width="${(cw - 3).toFixed(1)}" height="${ch - 3}" fill="${fill}" opacity="${op}"/>`;
      if (state === "null") {
        cells += `<text x="${(x + (cw - 3) / 2).toFixed(1)}" y="${y + 15}" text-anchor="middle" font-family="Geist Mono, ui-monospace, monospace" font-size="12" fill="${HUES.rose[0]}">NaN</text>`;
      } else if (state === "ok") {
        const bw = (cw - 12) * (0.35 + r() * 0.6);
        cells += `<rect x="${(x + 4).toFixed(1)}" y="${y + 9}" width="${bw.toFixed(1)}" height="3" fill="${DIM}" opacity="0.55"/>`;
      }
    }
  }
  // Header strip with column names.
  let head = `<rect x="${x0}" y="${y0 - 28}" width="${W - 96}" height="24" fill="rgba(255,255,255,0.07)"/>`;
  for (let j = 0; j < cols; j++) {
    head += `<text x="${(x0 + j * cw + 4).toFixed(1)}" y="${y0 - 11}" font-family="Geist Mono, ui-monospace, monospace" font-size="12" letter-spacing="0.6" fill="${DIM}">c${String(j).padStart(2, "0")}</text>`;
  }
  const legend = `<g font-family="Geist Mono, ui-monospace, monospace" font-size="15" letter-spacing="0.8">
    <rect x="48" y="${y0 + rows * ch + 22}" width="13" height="13" fill="${HUES.rose[1]}"/>
    <text x="70" y="${y0 + rows * ch + 33}" fill="${DIM}">MISSING  4.1%</text>
    <rect x="250" y="${y0 + rows * ch + 22}" width="13" height="13" fill="${hot}" opacity="0.5"/>
    <text x="272" y="${y0 + rows * ch + 33}" fill="${DIM}">COERCED  6.8%</text>
    <text x="490" y="${y0 + rows * ch + 33}" fill="${DIM}">LEAKAGE CHECKS  PASS 12/12</text>
  </g>`;
  files["poster-cleanroom.svg"] = plate(
    `${head}${cells}${legend}${caption("FIG.04  FEATURE TABLE", "Five sources, one table", "manifest of every transform, equivalence-tested")}`,
    { grid: false }
  );
}

/* =================================================================
   5. Quantization ladder. Edge Ladder: accuracy against throughput
   at four precisions. A paired-bar chart because the whole point is
   that the two move in opposite directions.
   ================================================================= */
{
  const [hot] = HUES.orange;
  const steps = [
    { n: "FP32", acc: 0.914, thr: 1.0 },
    { n: "FP16", acc: 0.913, thr: 1.7 },
    { n: "INT8", acc: 0.91, thr: 2.7 },
    { n: "INT4", acc: 0.853, thr: 3.9 },
  ];
  const x0 = 130, y0 = 96, h = 380, bw = 66, gap = 190;
  let bars = "";
  steps.forEach((s, i) => {
    const cx = x0 + i * gap;
    const accH = ((s.acc - 0.80) / 0.13) * h;
    const thrH = (s.thr / 4.2) * h;
    bars += `<rect x="${cx}" y="${y0 + h - accH}" width="${bw}" height="${accH.toFixed(1)}" fill="${INK}" opacity="0.9"/>`;
    bars += `<rect x="${cx + bw + 8}" y="${y0 + h - thrH}" width="${bw}" height="${thrH.toFixed(1)}" fill="${hot}" opacity="0.85"/>`;
    bars += `<g font-family="Geist Mono, ui-monospace, monospace" font-size="15" fill="${DIM}">
      <text x="${cx + bw + 4}" y="${y0 + h + 26}" text-anchor="middle" letter-spacing="1.2" fill="${INK}">${s.n}</text>
      <text x="${cx + bw / 2}" y="${y0 + h - accH - 12}" text-anchor="middle" fill="${INK}">${s.acc.toFixed(3)}</text>
      <text x="${cx + bw + 8 + bw / 2}" y="${y0 + h - thrH - 12}" text-anchor="middle" fill="${hot}">${s.thr.toFixed(1)}x</text>
    </g>`;
  });
  // Mark the step where the trade stops being free.
  const cliffX = x0 + 3 * gap - 26;
  const cliff = `<path d="M${cliffX} ${y0 - 8}V${y0 + h + 8}" stroke="${HUES.rose[0]}" stroke-width="1.5" stroke-dasharray="5 4"/>
    <text x="${cliffX + 10}" y="${y0 + 12}" font-family="Geist Mono, ui-monospace, monospace" font-size="15" fill="${HUES.rose[0]}">6.1pt drop. no.</text>`;
  const legend = `<g font-family="Geist Mono, ui-monospace, monospace" font-size="15" letter-spacing="0.8">
    <rect x="48" y="${y0 - 40}" width="13" height="13" fill="${INK}"/><text x="70" y="${y0 - 29}" fill="${DIM}">ACCURACY</text>
    <rect x="210" y="${y0 - 40}" width="13" height="13" fill="${hot}"/><text x="232" y="${y0 - 29}" fill="${DIM}">THROUGHPUT</text>
  </g>`;
  files["poster-ladder.svg"] = plate(
    `${legend}${bars}${cliff}${axes(x0 - 30, y0, W - 160, h, "PRECISION", "")}${caption("FIG.05  QUANTIZATION LADDER", "One model, four precisions", "same eval set, same hardware, batch 1")}`,
    { grid: false }
  );
}

/* =================================================================
   6. Eval grid. Promptproof: 60 golden cases as a pass/fail wall,
   with one column of regressions from the prompt edit that broke
   JSON parsing. A build gate rendered as an object.
   ================================================================= */
{
  const r = rng(31337);
  const [hot] = HUES.teal;
  const cols = 12, rows = 5, cell = 74;
  const x0 = (W - cols * cell) / 2, y0 = 120;
  let cells = "";
  let idx = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      idx++;
      // Column 7 is the regression the harness caught.
      const fail = j === 7 && i !== 2;
      const x = x0 + j * cell, y = y0 + i * cell;
      cells += `<rect x="${x}" y="${y}" width="${cell - 6}" height="${cell - 6}" rx="3"
        fill="${fail ? HUES.rose[1] : hot}" opacity="${fail ? 0.65 : (0.22 + r() * 0.3).toFixed(3)}"
        stroke="${fail ? HUES.rose[0] : "none"}" stroke-width="${fail ? 1.5 : 0}"/>`;
      cells += fail
        ? `<path d="M${x + 22} ${y + 22}l${cell - 50} ${cell - 50}M${x + cell - 28} ${y + 22}l-${cell - 50} ${cell - 50}" stroke="${HUES.rose[0]}" stroke-width="2"/>`
        : `<path d="M${x + 20} ${y + 34}l10 11 18 -21" stroke="${INK}" stroke-width="2" fill="none" opacity="0.75"/>`;
    }
  }
  const banner = `<g>
    <rect x="48" y="46" width="${W - 96}" height="42" rx="6" fill="${HUES.rose[1]}" opacity="0.35" stroke="${HUES.rose[0]}" stroke-width="1"/>
    <text x="68" y="73" font-family="Geist Mono, ui-monospace, monospace" font-size="19" letter-spacing="1" fill="${HUES.rose[0]}">BUILD FAILED  56/60 PASS  schema assertion, 4 cases</text>
  </g>`;
  files["poster-promptproof.svg"] = plate(
    `${banner}${cells}${caption("FIG.06  GOLDEN SET", "The gate, not the discussion", "60 cases, run in CI on every prompt edit")}`,
    { grid: false }
  );
}

/* =================================================================
   Lab visuals. Squarer, quieter: these sit in a 2-up grid, so they
   have to read at half the width of a poster.
   ================================================================= */
const LW = 900, LH = 600;
function labPlate(children) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${LW} ${LH}" width="${LW}" height="${LH}" role="img">
  ${defs()}
  <rect width="${LW}" height="${LH}" fill="url(#plate)"/>
  ${children}
  <rect width="${LW}" height="${LH}" filter="url(#grain)" opacity="0.85"/>
  <rect x="0.5" y="0.5" width="${LW - 1}" height="${LH - 1}" fill="none" stroke="${LINE}"/>
</svg>`;
}
function labCaption(t, s) {
  return `<g font-family="Geist Mono, ui-monospace, monospace">
    <text x="36" y="${LH - 46}" font-size="24" fill="${INK}" letter-spacing="-0.2">${t}</text>
    <text x="36" y="${LH - 22}" font-size="15" fill="${DIM}" letter-spacing="0.8">${s}</text>
  </g>`;
}

/* Attention heatmap: one head, a diagonal plus two attention sinks,
   which is what a real head actually looks like. */
{
  const r = rng(88);
  const [hot] = HUES.violet;
  const n = 14, cell = 30, x0 = 36, y0 = 46;
  let cells = "";
  for (let i = 0; i < n; i++) {
    let row = [];
    for (let j = 0; j < n; j++) {
      if (j > i) { row.push(0); continue; }        // causal mask
      let v = j === i ? 0.9 : j === 0 ? 0.55 : 0;   // self + sink on BOS
      v += Math.exp(-Math.abs(i - j) / 2.2) * 0.35;
      v += r() * 0.07;
      row.push(v);
    }
    const s = row.reduce((a, b) => a + b, 0) || 1;
    row = row.map((v) => v / s);
    for (let j = 0; j < n; j++) {
      if (row[j] === 0) {
        cells += `<rect x="${x0 + j * cell}" y="${y0 + i * cell}" width="${cell - 2}" height="${cell - 2}" fill="rgba(255,255,255,0.02)"/>`;
      } else {
        cells += `<rect x="${x0 + j * cell}" y="${y0 + i * cell}" width="${cell - 2}" height="${cell - 2}" fill="${hot}" opacity="${Math.min(1, row[j] * 3.2).toFixed(3)}"/>`;
      }
    }
  }
  files["lab-attention.svg"] = labPlate(
    `${cells}
     <text x="${x0 + n * cell + 24}" y="${y0 + 18}" font-family="Geist Mono, ui-monospace, monospace" font-size="14" fill="${DIM}">causal mask</text>
     <text x="${x0 + n * cell + 24}" y="${y0 + cell * 1.2}" font-family="Geist Mono, ui-monospace, monospace" font-size="14" fill="${hot}">sink on token 0</text>
     ${labCaption("Attention, one head", "14 tokens, layer 6, softmax rows sum to 1")}`
  );
}

/* Tokenizer: the same sentence cut into subwords, boundaries shown. */
{
  const [hot] = HUES.cyan;
  const toks = ["Quant", "ization", " is", " a", " measure", "ment", " problem", ",", " not", " a", " compress", "ion", " one", "."];
  let x = 36, y = 120, out = "";
  toks.forEach((t, i) => {
    const w = 15 + t.length * 13.5;
    if (x + w > LW - 36) { x = 36; y += 62; }
    out += `<rect x="${x}" y="${y}" width="${w}" height="44" rx="5" fill="${hot}" opacity="${i % 2 ? 0.16 : 0.28}" stroke="${hot}" stroke-opacity="0.45"/>
      <text x="${x + w / 2}" y="${y + 29}" text-anchor="middle" font-family="Geist Mono, ui-monospace, monospace" font-size="17" fill="${INK}">${t.replace(/ /g, "&#183;").replace(/,/g, "&#44;")}</text>
      <text x="${x + w / 2}" y="${y + 60}" text-anchor="middle" font-family="Geist Mono, ui-monospace, monospace" font-size="12" fill="${DIM}">${1000 + i * 137}</text>`;
    x += w + 8;
  });
  files["lab-tokenizer.svg"] = labPlate(
    `<text x="36" y="70" font-family="Geist Mono, ui-monospace, monospace" font-size="15" letter-spacing="1.2" fill="${DIM}">14 TOKENS  /  62 CHARS  /  4.4 CHARS PER TOKEN</text>
     ${out}${labCaption("Subword boundaries", "BPE, where the model actually splits your words")}`
  );
}

/* Embedding neighbourhood: 2D projection with three clusters and a
   query point, plus its k nearest ringed. */
{
  const r = rng(2027);
  const [hot] = HUES.lime;
  const centres = [[240, 200], [620, 180], [430, 430]];
  let dots = "";
  const pts = [];
  centres.forEach((c, ci) => {
    for (let i = 0; i < 34; i++) {
      const a = r() * Math.PI * 2, rad = Math.pow(r(), 0.6) * 110;
      const p = [c[0] + Math.cos(a) * rad, c[1] + Math.sin(a) * rad * 0.8, ci];
      pts.push(p);
      dots += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3.6" fill="${ci === 1 ? hot : DIM}" opacity="${ci === 1 ? 0.85 : 0.4}"/>`;
    }
  });
  const q = [600, 210];
  const near = pts
    .map((p) => ({ p, d: Math.hypot(p[0] - q[0], p[1] - q[1]) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 5);
  let rings = "";
  near.forEach(({ p }) => {
    rings += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="9" fill="none" stroke="${hot}" stroke-width="1.6"/>
      <path d="M${q[0]} ${q[1]}L${p[0].toFixed(1)} ${p[1].toFixed(1)}" stroke="${hot}" stroke-width="1" opacity="0.45"/>`;
  });
  files["lab-embedding.svg"] = labPlate(
    `${dots}${rings}
     <circle cx="${q[0]}" cy="${q[1]}" r="7" fill="${INK}"/>
     <text x="${q[0] + 14}" y="${q[1] - 10}" font-family="Geist Mono, ui-monospace, monospace" font-size="14" fill="${INK}">query</text>
     ${labCaption("Nearest neighbours", "UMAP to 2D, k=5, cosine distance")}`
  );
}

/* Quantization error: the weight distribution and where INT4 buckets
   land, which is the visual explanation of why INT4 hurts. */
{
  const r = rng(5150);
  const [hot] = HUES.orange;
  const x0 = 36, y0 = 70, w = LW - 72, h = 340;
  let hist = "";
  const bins = 60;
  for (let i = 0; i < bins; i++) {
    const t = (i / bins) * 6 - 3;
    const v = Math.exp(-t * t / 1.4) + r() * 0.03;
    const bh = v * h * 0.92;
    hist += `<rect x="${(x0 + (i * w) / bins).toFixed(1)}" y="${(y0 + h - bh).toFixed(1)}" width="${(w / bins - 2).toFixed(1)}" height="${bh.toFixed(1)}" fill="${DIM}" opacity="0.35"/>`;
  }
  let buckets = "";
  for (let k = 0; k < 16; k++) {
    const x = x0 + (k / 15) * w;
    buckets += `<path d="M${x.toFixed(1)} ${y0}V${y0 + h}" stroke="${hot}" stroke-width="1.2" opacity="0.6"/>`;
  }
  files["lab-quantization.svg"] = labPlate(
    `${hist}${buckets}
     <text x="${x0}" y="${y0 - 16}" font-family="Geist Mono, ui-monospace, monospace" font-size="15" letter-spacing="1.2" fill="${DIM}">WEIGHT DISTRIBUTION  vs  16 INT4 BUCKETS</text>
     <text x="${x0 + w / 2}" y="${y0 + h + 30}" text-anchor="middle" font-family="Geist Mono, ui-monospace, monospace" font-size="14" fill="${hot}">the tails round to the same bucket. that is the 6.1 points.</text>
     ${labCaption("Where precision goes", "one linear layer, 4.2M weights, symmetric scale")}`
  );
}

/* =================================================================
   Field notes: the fanned strip. Portrait, photo-like, abstract.
   These stand in for photographs, so they are the one place a
   gradient is the right answer rather than a cop-out.
   ================================================================= */
const NOTE_W = 368, NOTE_H = 496;
[
  { f: "note-lab.svg", hue: HUES.amber, seed: 11, cap: "LAB / 03.26", t: "Spindle rig, first run" },
  { f: "note-board.svg", hue: HUES.cyan, seed: 22, cap: "DESK / 05.26", t: "Arduino and a bad solder joint" },
  { f: "note-plot.svg", hue: HUES.lime, seed: 33, cap: "PLOT / 06.26", t: "The run that finally converged" },
  { f: "note-campus.svg", hue: HUES.violet, seed: 44, cap: "JBP / 08.26", t: "Walking back from the lab" },
].forEach(({ f, hue, seed, cap, t }) => {
  const r = rng(seed);
  let shapes = "";
  for (let i = 0; i < 7; i++) {
    const cx = r() * NOTE_W, cy = r() * NOTE_H * 0.8;
    shapes += `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${(50 + r() * 150).toFixed(0)}" fill="${i % 2 ? hue[0] : hue[1]}" opacity="${(0.1 + r() * 0.2).toFixed(2)}"/>`;
  }
  let rules = "";
  for (let y = 30; y < NOTE_H; y += 30) {
    rules += `<path d="M0 ${y}H${NOTE_W}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>`;
  }
  files[f] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${NOTE_W} ${NOTE_H}" width="${NOTE_W}" height="${NOTE_H}" role="img">
  ${defs()}
  <rect width="${NOTE_W}" height="${NOTE_H}" fill="${hue[1]}"/>
  <g filter="url(#blur-soft)">${shapes}</g>
  <defs><filter id="blur-soft"><feGaussianBlur stdDeviation="34"/></filter></defs>
  ${rules}
  <rect width="${NOTE_W}" height="${NOTE_H}" filter="url(#grain)" opacity="1"/>
  <rect x="0" y="${NOTE_H - 92}" width="${NOTE_W}" height="92" fill="rgba(0,0,0,0.55)"/>
  <g font-family="Geist Mono, ui-monospace, monospace">
    <text x="20" y="${NOTE_H - 58}" font-size="13" letter-spacing="1.4" fill="${hue[0]}">${cap}</text>
    <text x="20" y="${NOTE_H - 32}" font-size="15" fill="${INK}">${t}</text>
  </g>
</svg>`;
});

/* =================================================================
   Avatar. A monogram, not a fake face. Generating a synthetic
   portrait of a real person would be worse than not having one.
   ================================================================= */
files["avatar.svg"] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200" role="img">
  <defs>
    <linearGradient id="a" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2b2b30"/>
      <stop offset="0.55" stop-color="#17171a"/>
      <stop offset="1" stop-color="#0c0c0e"/>
    </linearGradient>
    <filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="4"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.08"/></feComponentTransfer></filter>
  </defs>
  <rect width="200" height="200" rx="58" fill="url(#a)"/>
  <g stroke="rgba(255,255,255,0.09)" stroke-width="1" fill="none">
    <path d="M0 66H200M0 134H200M66 0V200M134 0V200"/>
  </g>
  <text x="100" y="126" text-anchor="middle" font-family="Geist Mono, ui-monospace, monospace" font-size="72" letter-spacing="-2" fill="#f2f2f2">AR</text>
  <circle cx="152" cy="48" r="7" fill="${HUES.lime[0]}"/>
  <rect width="200" height="200" rx="58" filter="url(#g)"/>
  <rect x="0.5" y="0.5" width="199" height="199" rx="57.5" fill="none" stroke="rgba(255,255,255,0.14)"/>
</svg>`;

/* =================================================================
   Portrait placeholder.

   A head-and-shoulders silhouette on a warm plate, not a synthesised
   face. Generating a photorealistic likeness of a real person to fill
   an avatar slot would be worse than shipping an obvious placeholder,
   so this is obviously a placeholder: swap in a real photo at
   public/mock/avatar-photo.svg (or point the two <img> tags in
   Hero.astro and SiteFooter.astro at a jpg).
   ================================================================= */
files["avatar-photo.svg"] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200" role="img">
  <defs>
    <linearGradient id="pp" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0" stop-color="#e8e4dc"/>
      <stop offset="0.55" stop-color="#cfc9be"/>
      <stop offset="1" stop-color="#a9a29a"/>
    </linearGradient>
    <linearGradient id="pf" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0" stop-color="#4a4642"/>
      <stop offset="1" stop-color="#2b2825"/>
    </linearGradient>
    <clipPath id="pc"><rect width="200" height="200" rx="46"/></clipPath>
    <filter id="pg"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="9"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.07"/></feComponentTransfer></filter>
  </defs>
  <g clip-path="url(#pc)">
    <rect width="200" height="200" fill="url(#pp)"/>
    <circle cx="100" cy="74" r="34" fill="url(#pf)"/>
    <path d="M28 200c0-40 32-58 72-58s72 18 72 58Z" fill="url(#pf)"/>
    <rect width="200" height="200" filter="url(#pg)"/>
  </g>
  <rect x="0.5" y="0.5" width="199" height="199" rx="45.5" fill="none" stroke="rgba(0,0,0,0.10)"/>
</svg>`;

/* =================================================================
   Post covers. Quieter than posters: a post is prose, so the cover
   is a diagram fragment rather than a full instrument readout.
   ================================================================= */
const PW = 1000, PH = 500;
[
  {
    f: "cover-baseline.svg",
    hue: HUES.amber,
    label: "WITHOUT A BASELINE, 0.94 IS A DECORATION",
    draw: (r, hue) => {
      let s = "";
      // A big number, then the baseline that deflates it.
      s += `<text x="60" y="230" font-family="Geist Mono, ui-monospace, monospace" font-size="150" fill="${INK}" letter-spacing="-6">0.94</text>`;
      s += `<path d="M60 258H430" stroke="${HUES.rose[0]}" stroke-width="3"/>`;
      s += `<text x="60" y="310" font-family="Geist Mono, ui-monospace, monospace" font-size="22" fill="${HUES.rose[0]}">majority class is 0.93</text>`;
      for (let i = 0; i < 40; i++) {
        const x = 560 + (i % 8) * 48, y = 120 + Math.floor(i / 8) * 48;
        s += `<rect x="${x}" y="${y}" width="38" height="38" rx="3" fill="${i % 8 === 0 ? hue[0] : hue[1]}" opacity="${i % 8 === 0 ? 0.8 : 0.35}"/>`;
      }
      return s;
    },
  },
  {
    f: "cover-matrix.svg",
    hue: HUES.lime,
    label: "THE DIAGONAL IS THE PART EVERYONE READS",
    draw: (r, hue) => {
      let s = "";
      for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) {
        const v = i === j ? 0.85 : Math.abs(i - j) === 1 ? 0.3 : 0.06;
        s += `<rect x="${330 + j * 56}" y="${90 + i * 56}" width="52" height="52" rx="3" fill="${hue[0]}" opacity="${v}"/>`;
      }
      return s;
    },
  },
  {
    f: "cover-quant.svg",
    hue: HUES.orange,
    label: "PRECISION IS A BUDGET, NOT A SETTING",
    draw: (r, hue) => {
      let s = "";
      [1, 0.62, 0.38, 0.19].forEach((v, i) => {
        s += `<rect x="${120 + i * 200}" y="${380 - v * 260}" width="130" height="${v * 260}" fill="${hue[0]}" opacity="${0.85 - i * 0.15}"/>`;
        s += `<text x="${185 + i * 200}" y="410" text-anchor="middle" font-family="Geist Mono, ui-monospace, monospace" font-size="19" fill="${DIM}">${["FP32", "FP16", "INT8", "INT4"][i]}</text>`;
      });
      return s;
    },
  },
  {
    f: "cover-refusal.svg",
    hue: HUES.cyan,
    label: "A SYSTEM THAT CANNOT REFUSE CANNOT BE TRUSTED",
    draw: (r, hue) => {
      let s = "";
      for (let i = 0; i < 9; i++) {
        const y = 110 + i * 32;
        const ok = i < 4;
        s += `<rect x="330" y="${y}" width="${ok ? 380 : 180}" height="18" rx="9" fill="${ok ? hue[0] : DIM}" opacity="${ok ? 0.75 : 0.25}"/>`;
      }
      s += `<path d="M320 ${110 + 4 * 32 - 8}H760" stroke="${INK}" stroke-width="1.5" stroke-dasharray="5 5"/>`;
      s += `<text x="770" y="${110 + 4 * 32 - 3}" font-family="Geist Mono, ui-monospace, monospace" font-size="17" fill="${INK}">threshold</text>`;
      return s;
    },
  },
].forEach(({ f, hue, label, draw }) => {
  const r = rng(99);
  files[f] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${PW} ${PH}" width="${PW}" height="${PH}" role="img">
  ${defs()}
  <rect width="${PW}" height="${PH}" fill="url(#plate)"/>
  ${draw(r, hue)}
  <text x="60" y="${PH - 40}" font-family="Geist Mono, ui-monospace, monospace" font-size="17" letter-spacing="1.6" fill="${DIM}">${label}</text>
  <rect width="${PW}" height="${PH}" filter="url(#grain)" opacity="0.85"/>
  <rect x="0.5" y="0.5" width="${PW - 1}" height="${PH - 1}" fill="none" stroke="${LINE}"/>
</svg>`;
});

/* =================================================================
   Open Graph card. 1200x630, the one asset whose dimensions are
   dictated from outside.
   ================================================================= */
files["og.svg"] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" role="img">
  ${defs()}
  <rect width="1200" height="630" fill="url(#plate)"/>
  <g stroke="${FAINT}" stroke-width="1">
    <path d="M216 0V630M984 0V630"/>
  </g>
  <g font-family="Geist Mono, ui-monospace, monospace">
    <text x="216" y="120" font-size="20" letter-spacing="2" fill="${DIM}">EST. 2006</text>
  </g>
  <text x="216" y="330" font-family="Geist, system-ui, sans-serif" font-size="86" font-weight="500" fill="${INK}" letter-spacing="-3">Ashutosh Rana</text>
  <text x="216" y="386" font-family="Geist Mono, ui-monospace, monospace" font-size="26" fill="${DIM}" letter-spacing="0.5">AI Engineer  /  measure it, or it did not happen</text>
  <g font-family="Geist Mono, ui-monospace, monospace" font-size="19" fill="${DIM}" letter-spacing="1.2">
    <text x="216" y="530">6 SYSTEMS</text>
    <text x="400" y="530">3 SHIPPED TO PRODUCTION</text>
    <text x="800" y="530">EVERY NUMBER HAS A BASELINE</text>
  </g>
  <rect width="1200" height="630" filter="url(#grain)" opacity="0.85"/>
</svg>`;

/* ---- write ------------------------------------------------------ */
let bytes = 0;
for (const [name, body] of Object.entries(files)) {
  writeFileSync(join(OUT, name), body, "utf8");
  bytes += Buffer.byteLength(body);
}
console.log(`wrote ${Object.keys(files).length} files, ${(bytes / 1024).toFixed(1)} KB to public/mock`);
for (const n of Object.keys(files).sort()) console.log("  " + n);

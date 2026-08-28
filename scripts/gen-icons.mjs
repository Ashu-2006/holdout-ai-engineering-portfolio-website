/**
 * Generates the favicon set, the app icons and the Open Graph image.
 *
 * WHY THIS EXISTS, and it is not cosmetic:
 *
 *  - The shipped favicon was still Astro's logo. A deployed personal
 *    site wearing the framework's mark is a bug, not a default.
 *  - og:image was an SVG. X, LinkedIn, Slack, WhatsApp, Facebook and
 *    iMessage all refuse SVG for social previews, so every share of
 *    this site rendered with no image at all. OG images must be PNG
 *    or JPEG, at 1200x630, served from an absolute URL.
 *
 * STACK CHOICE: sharp, as a devDependency. Alternatives were
 * @resvg/resvg-js (smaller, rasterize-only) or @vercel/og (needs an
 * edge runtime this static site does not have). sharp is what Astro's
 * own image service uses, so it is the least surprising dependency in
 * this project, and it does rasterise + resize in one pass.
 *
 * Run: node scripts/gen-icons.mjs   (wired into `prebuild`)
 */

import sharp from "sharp";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");
mkdirSync(PUBLIC, { recursive: true });

/* ---- the mark -------------------------------------------------
   A monogram on the ink ground. Hairlines are the site's signature
   but they vanish at 16px, so the favicon carries the one shape that
   survives being tiny: two bold mono letters, with the measure rules
   present only as a faint hint for the larger sizes. */
const INITIALS = "AR";

const markSvg = (size) => {
  const r = Math.round(size * 0.22);
  const fs = Math.round(size * 0.44);
  /* The grid hint is dropped below 64px: at 32px a 1px rule is
     indistinguishable from a compression artefact. */
  const grid =
    size >= 64
      ? `<g stroke="rgba(255,255,255,0.16)" stroke-width="${Math.max(1, size / 128)}">
           <path d="M${size * 0.28} 0V${size}M${size * 0.72} 0V${size}"/>
         </g>`
      : "";
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <rect width="${size}" height="${size}" rx="${r}" fill="#131313"/>
      ${grid}
      <text x="50%" y="50%" dy="0.355em" text-anchor="middle"
            font-family="Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
            font-weight="600" font-size="${fs}" letter-spacing="${-size * 0.02}"
            fill="#fcfcfb">${INITIALS}</text>
    </svg>`
  );
};

/* A crisp vector favicon for browsers that take one, theme-aware so
   it does not disappear against a dark browser chrome. */
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#131313"/>
  <g stroke="rgba(255,255,255,0.16)" stroke-width="1">
    <path d="M18 0V64M46 0V64"/>
  </g>
  <text x="32" y="32" dy="0.355em" text-anchor="middle"
        font-family="Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
        font-weight="600" font-size="28" letter-spacing="-1.3"
        fill="#fcfcfb">${INITIALS}</text>
</svg>
`;

/**
 * Minimal ICO container wrapping a PNG.
 *
 * ICO has allowed embedded PNG payloads since Windows Vista, so this
 * is a 22-byte header plus the PNG. Worth doing rather than deleting
 * favicon.ico: crawlers and older clients request /favicon.ico by
 * convention, and a 404 in the logs of every deploy is noise nobody
 * wants to triage later.
 */
function icoFromPng(png, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // one image
  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 means 256)
  entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
  entry.writeUInt8(0, 2); // palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // colour planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8); // payload size
  entry.writeUInt32LE(22, 12); // payload offset
  return Buffer.concat([header, entry, png]);
}

const wrote = [];
const save = (name, buf) => {
  writeFileSync(join(PUBLIC, name), buf);
  wrote.push(`${name} (${(buf.length / 1024).toFixed(1)}KB)`);
};

/* ---- favicons and app icons ----------------------------------- */
save("favicon.svg", Buffer.from(faviconSvg, "utf8"));

for (const size of [32, 96, 180, 192, 512]) {
  const png = await sharp(markSvg(size), { density: 384 })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toBuffer();
  if (size === 180) save("apple-touch-icon.png", png);
  else if (size === 32) {
    save("favicon-32.png", png);
    save("favicon.ico", icoFromPng(png, 32));
  } else save(`icon-${size}.png`, png);
}

/* ---- Open Graph, as PNG --------------------------------------- */
const ogSvg = readFileSync(join(PUBLIC, "mock", "og.svg"));
const ogPng = await sharp(ogSvg, { density: 200 })
  .resize(1200, 630, { fit: "cover" })
  .png({ compressionLevel: 9 })
  .toBuffer();
save("og.png", ogPng);

/* ---- web app manifest ----------------------------------------- */
const manifest = {
  name: "Ashutosh Rana, AI Engineer",
  short_name: "Ashutosh Rana",
  description:
    "AI engineer. Machine learning that has to survive contact with something real.",
  start_url: "/",
  display: "standalone",
  background_color: "#fcfcfb",
  theme_color: "#fcfcfb",
  icons: [
    { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    {
      src: "/icon-512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
  ],
};
save("site.webmanifest", Buffer.from(JSON.stringify(manifest, null, 2) + "\n"));

console.log(`wrote ${wrote.length} files to public/`);
for (const w of wrote) console.log("  " + w);

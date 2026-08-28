/**
 * sitemap.xml, enumerated from the same data the pages are built
 * from, so a route cannot exist without appearing here and a deleted
 * project cannot leave a ghost entry.
 *
 * Hand-rolled rather than @astrojs/sitemap: nineteen static routes do
 * not justify a dependency, and building it from work.ts / the
 * content collections is what keeps it honest.
 */
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { site } from "../config/site";
import { projects } from "../data/work";

export const GET: APIRoute = async ({ site: configured }) => {
  const base = (configured ?? new URL(site.url)).href.replace(/\/$/, "");

  const posts = (await getCollection("posts")).filter(
    (p) => p.data.status === "live"
  );
  const lab = await getCollection("lab");

  const routes: { path: string; priority: string }[] = [
    { path: "/", priority: "1.0" },
    { path: "/work", priority: "0.9" },
    { path: "/resume", priority: "0.9" },
    { path: "/writing", priority: "0.7" },
    { path: "/contact", priority: "0.8" },
    ...projects.map((p) => ({ path: `/work/${p.slug}`, priority: "0.8" })),
    ...posts.map((p) => ({ path: `/writing/${p.id}`, priority: "0.6" })),
    ...lab.map((e) => ({ path: `/writing/${e.id}`, priority: "0.5" })),
  ];

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    routes
      .map(
        (r) =>
          `  <url><loc>${base}${r.path}</loc><priority>${r.priority}</priority></url>`
      )
      .join("\n") +
    `\n</urlset>\n`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};

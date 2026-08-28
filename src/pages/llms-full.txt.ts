/**
 * /llms-full.txt - the entire site as one markdown document.
 *
 * Assembled from the same serialisers the per-page MACHINE views use
 * (lib/machine.ts), so this file, the switch views and the rendered
 * pages are three projections of one source and cannot disagree.
 *
 * Post and lab bodies are included in full: an agent reading this
 * file is here for the content, and making it fetch nineteen pages
 * to get it defeats the point of the file.
 */
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import {
  machineHome,
  machineWorkIndex,
  machineWritingIndex,
  machinePost,
  machineLabIndex,
  machineLabEntry,
  machineResume,
} from "../lib/machine";

const RULE = "\n\n" + "=".repeat(72) + "\n\n";

export const GET: APIRoute = async () => {
  const posts = (await getCollection("posts")).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );
  const live = posts.filter((p) => p.data.status === "live");
  const drafts = posts.filter((p) => p.data.status === "draft");
  const lab = (await getCollection("lab")).sort(
    (a, b) => a.data.order - b.data.order
  );

  const sections = [
    machineHome(
      live.map((p) => ({
        title: p.data.title,
        description: p.data.description,
        slug: p.id,
      }))
    ),
    machineWorkIndex(),
    machineWritingIndex(
      live.map((p) => ({
        title: p.data.title,
        description: p.data.description,
        slug: p.id,
        date: p.data.date,
        readingTime: p.data.readingTime,
      })),
      drafts.map((p) => ({ title: p.data.title, stage: p.data.stage }))
    ),
    ...live.map((p) =>
      machinePost({
        title: p.data.title,
        description: p.data.description,
        date: p.data.date,
        readingTime: p.data.readingTime,
        tags: [...p.data.tags],
        body: p.body ?? "",
      })
    ),
    machineLabIndex(
      lab.map((e) => ({
        title: e.data.title,
        blurb: e.data.blurb,
        teaches: e.data.teaches,
        slug: e.id,
      }))
    ),
    ...lab.map((e) =>
      machineLabEntry({
        title: e.data.title,
        blurb: e.data.blurb,
        teaches: e.data.teaches,
        body: e.body ?? "",
      })
    ),
    machineResume(),
  ];

  return new Response(sections.join(RULE) + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};

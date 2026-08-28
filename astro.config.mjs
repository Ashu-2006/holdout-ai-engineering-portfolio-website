// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  /**
   * Required for absolute URLs in canonical links, Open Graph tags,
   * sitemap.xml, robots.txt and the llms files. Currently the Vercel
   * production URL; swap it for the custom domain when one is added,
   * or every generated absolute URL points at the wrong host.
   */
  site: "https://holdout-ai-engineering.vercel.app",

  /**
   * Astro's dev toolbar is off.
   *
   * It renders its own floating pill at the bottom centre of every dev
   * page, which is exactly where this site's dock lives. The two
   * overlapped, and the toolbar's icons read as part of the design.
   * It is dev-only and never shipped, but it makes the dev server
   * useless for judging the actual layout.
   */
  /* The lab merged into /writing; anything holding an old link gets
     redirected rather than a 404. */
  redirects: {
    "/lab": "/writing",
    "/lab/[...slug]": "/writing/[...slug]",
  },

  devToolbar: {
    enabled: false,
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [icon()],
});

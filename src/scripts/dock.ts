/**
 * Dock behaviour: active-section tracking, theme persistence, and the
 * copy-email shortcut. Imported by Dock.astro so Astro bundles it.
 */

/** Highlights the dock link whose section is nearest the viewport centre. */
function trackActiveSection(): void {
  const links = Array.from(
    document.querySelectorAll<HTMLElement>("[data-section]"),
  );
  if (links.length === 0) return;

  const linkFor = new Map(links.map((l) => [l.dataset.section!, l]));
  const targets = links
    .map((l) => document.getElementById(l.dataset.section!))
    .filter((el): el is HTMLElement => el !== null);
  if (targets.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const topmost = entries
        .filter((e) => e.isIntersecting)
        .sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
        )[0];
      if (!topmost) return;
      links.forEach((l) => delete l.dataset.active);
      const active = linkFor.get(topmost.target.id);
      if (active) active.dataset.active = "";
    },
    { rootMargin: "-45% 0px -45% 0px" },
  );

  targets.forEach((t) => observer.observe(t));
}

/** Reveals `.reveal` elements once, on first intersection. */
function revealOnScroll(): void {
  const items = document.querySelectorAll(".reveal");
  if (items.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.seen = "true";
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
  );

  items.forEach((i) => observer.observe(i));
}

/** Light/dark toggle, persisted. The initial value is set in the document head. */
function bindThemeToggle(): void {
  const button = document.querySelector<HTMLButtonElement>(
    "[data-theme-toggle]",
  );
  if (!button) return;

  button.addEventListener("click", () => {
    const root = document.documentElement;
    const isDark = root.dataset.theme === "dark";
    if (isDark) delete root.dataset.theme;
    else root.dataset.theme = "dark";
    try {
      localStorage.setItem("theme", isDark ? "light" : "dark");
    } catch {
      /* private mode; the toggle still works for this session */
    }
  });
}

/** `c` copies the email address. Ignored while typing. */
function bindCopyShortcut(): void {
  document.addEventListener("keydown", (event) => {
    if (event.key !== "c" || event.metaKey || event.ctrlKey || event.altKey)
      return;

    const target = event.target as HTMLElement | null;
    if (
      target &&
      (target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable)
    )
      return;

    const mailto = document.querySelector<HTMLAnchorElement>(
      'a[href^="mailto:"]',
    );
    if (!mailto || !navigator.clipboard) return;

    void navigator.clipboard.writeText(mailto.href.replace("mailto:", ""));

    const toast = document.querySelector<HTMLElement>("[data-toast]");
    if (!toast) return;
    toast.dataset.show = "true";
    window.setTimeout(() => delete toast.dataset.show, 1700);
  });
}

export function initDock(): void {
  trackActiveSection();
  revealOnScroll();
  bindThemeToggle();
  bindCopyShortcut();
}

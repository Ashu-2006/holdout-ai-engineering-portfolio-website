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


/* ------------------------------------------------------------------
   Local time. A server-rendered clock is stale the moment the page is
   cached, so the markup ships a fallback and this owns the truth.
   ------------------------------------------------------------------ */
function paintLocalTime(): void {
  const el = document.querySelector<HTMLElement>("[data-local-time]");
  const tz = el?.dataset.tz;
  if (!el || !tz) return;

  const now = new Date();
  const there = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
  }).format(now);

  /* Offset in whole hours from the viewer's clock to mine. Comparing the
     same instant rendered in both zones is the only way to get this
     without shipping a timezone database. */
  const mine = new Date(now.toLocaleString("en-US", { timeZone: tz }));
  const diff = Math.round((mine.getTime() - now.getTime()) / 3_600_000);

  const rel =
    diff === 0
      ? "same time as you"
      : diff > 0
        ? `${diff}h ahead`
        : `${Math.abs(diff)}h behind`;

  el.textContent = `${there} local, ${rel}`;
}

/* ------------------------------------------------------------------
   Click-to-copy on the email. The keyboard shortcut already exists;
   this is the affordance for everyone who does not know about it.
   The confirmation swaps text in place rather than firing a toast,
   because a toast is a heavier surface than a copy deserves.
   ------------------------------------------------------------------ */
function bindCopyButton(): void {
  const btn = document.querySelector<HTMLButtonElement>("[data-copy-email]");
  const value = btn?.dataset.copyEmail;
  const label = btn?.querySelector<HTMLElement>("[data-copy-label]");
  if (!btn || !value || !label) return;

  const resting = label.textContent ?? "copy";

  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* A denied clipboard (insecure context, blocked permission) is not
         an error worth surfacing: the address is selectable text. */
      return;
    }
    /* Force a reflow between removal and re-add, or the animation will
       not replay on a second click. */
    label.classList.remove("is-swapped");
    void label.offsetWidth;
    label.textContent = "copied";
    label.classList.add("is-swapped");

    window.setTimeout(() => {
      label.textContent = resting;
      label.classList.remove("is-swapped");
    }, 1400);
  });
}

/* ------------------------------------------------------------------
   Density. A document-level attribute; CSS owns every consequence, so
   moving a section between tiers is a markup change, not a change here.
   ------------------------------------------------------------------ */
type Density = "less" | "more";

function readDensity(): Density {
  const fromUrl = new URLSearchParams(location.search).get("d");
  if (fromUrl === "less" || fromUrl === "more") return fromUrl;
  try {
    const stored = localStorage.getItem("density");
    if (stored === "less" || stored === "more") return stored;
  } catch {
    /* Private windows and blocked site data both throw on access. */
  }
  return "more";
}

function writeDensity(d: Density): void {
  document.documentElement.dataset.density = d;

  for (const btn of document.querySelectorAll<HTMLButtonElement>("[data-density]")) {
    btn.setAttribute("aria-pressed", String(btn.dataset.density === d));
  }

  try {
    localStorage.setItem("density", d);
  } catch {
    /* Not fatal: the attribute is already applied. */
  }

  /* Persisting to the URL means a link can carry a density, so a
     recruiter link and a hiring-manager link are the same page. */
  const url = new URL(location.href);
  if (d === "more") url.searchParams.delete("d");
  else url.searchParams.set("d", d);
  history.replaceState(null, "", url);
}

function bindDensity(): void {
  writeDensity(readDensity());
  for (const btn of document.querySelectorAll<HTMLButtonElement>("[data-density]")) {
    btn.addEventListener("click", () => {
      const next = btn.dataset.density;
      if (next === "less" || next === "more") writeDensity(next);
    });
  }
}

/* ------------------------------------------------------------------
   Scan rail. CSS could drive the tick width from a scroll timeline, but
   it cannot set aria-current, and the rail has to be legible to a
   screen reader. So the observer owns state and CSS owns appearance.
   ------------------------------------------------------------------ */
function bindScanRail(): void {
  const links = document.querySelectorAll<HTMLAnchorElement>("[data-rail]");
  const tiered = document.querySelectorAll<HTMLElement>("[data-tier]");
  if (!links.length || !tiered.length) return;

  const mark = (tier: string) => {
    for (const l of links) {
      l.setAttribute("aria-current", String(l.dataset.rail === tier));
    }
  };

  /* Recompute from every tiered element rather than trusting the entry
     that fired. An IntersectionObserver only reports *changes*, so an
     element already straddling the centre line never fires again and the
     previously marked tier sticks. There are also several elements per
     tier, which makes callback order significant if you trust one entry. */
  const sync = () => {
    const middle = window.innerHeight / 2;
    let best: string | undefined;
    let bestDistance = Infinity;

    for (const el of tiered) {
      const r = el.getBoundingClientRect();
      if (r.height === 0) continue;
      /* Distance from the viewport middle to this element's nearest edge,
         so a section taller than the viewport still wins while it spans
         the middle. */
      const distance =
        middle < r.top ? r.top - middle : middle > r.bottom ? middle - r.bottom : 0;
      if (distance < bestDistance) {
        bestDistance = distance;
        best = el.dataset.tier;
      }
    }
    if (best) mark(best);
  };

  const io = new IntersectionObserver(sync, {
    /* A band around the viewport middle, which is where attention sits. */
    rootMargin: "-45% 0px -45% 0px",
    threshold: [0, 1],
  });

  for (const el of tiered) io.observe(el);
  sync();
}

export function initDock(): void {
  trackActiveSection();
  revealOnScroll();
  bindThemeToggle();
  bindCopyShortcut();
  bindCopyButton();
  bindDensity();
  bindScanRail();
  paintLocalTime();
  window.setInterval(paintLocalTime, 30_000);
}

// Places the tooltip of an abbreviation (rehype.ts) while it shows: CSS shows
// it on hover and on keyboard or touch focus; this script keeps it inside the
// window (fixed, so a table that scrolls does not cut it) and lets Escape
// hide it until the reader moves on.
const TERM = ".qd-term";
const GAP = 4;
const EDGE = 8;

let current: HTMLElement | null = null;

function place(term: HTMLElement): void {
  const tip = term.querySelector<HTMLElement>(".qd-term-tip");
  if (!tip) return;
  tip.style.position = "fixed";
  const anchor = term.getBoundingClientRect();
  const box = tip.getBoundingClientRect();
  const maxLeft = window.innerWidth - box.width - EDGE;
  const left = Math.max(EDGE, Math.min(anchor.left, maxLeft));
  const below = anchor.bottom + GAP;
  const fits = below + box.height <= window.innerHeight - EDGE;
  const top = fits ? below : Math.max(EDGE, anchor.top - GAP - box.height);
  tip.style.left = `${left}px`;
  tip.style.top = `${top}px`;
}

const termOf = (target: EventTarget | null) =>
  target instanceof Element ? target.closest<HTMLElement>(TERM) : null;

function show(event: Event): void {
  const term = termOf(event.target);
  if (!term) return;
  current = term;
  requestAnimationFrame(() => place(term));
}

// Leaving a term (pointer or focus) undoes Escape, so it shows next time.
function leave(event: MouseEvent | FocusEvent): void {
  const term = termOf(event.target);
  if (term && !term.contains(event.relatedTarget as Node | null)) {
    term.classList.remove("is-dismissed");
  }
}

document.addEventListener("mouseover", show);
document.addEventListener("focusin", show);
document.addEventListener("mouseout", leave);
document.addEventListener("focusout", leave);
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  for (const term of document.querySelectorAll(`${TERM}:hover, ${TERM}:focus-within`)) {
    term.classList.add("is-dismissed");
  }
});
const follow = () => current && place(current);
window.addEventListener("scroll", follow, { capture: true, passive: true });
window.addEventListener("resize", follow, { passive: true });

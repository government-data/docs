// The words beside the drawing, the clock that moves T, and the controls:
// the tour pauses on any interaction and resumes with ▶ or Space. It follows
// live.js in the page's one script and uses its names.
// ---------- words ----------
let lastStop = -1,
  lastFocus = null;
function words(i) {
  if (i === lastStop && focus === lastFocus) return;
  const changed = i !== lastStop;
  lastStop = i;
  lastFocus = focus;
  const tech = TECHS[i];
  techItems.forEach((li, k) => put(li, "data-on", k === i));
  panels.forEach((ol, k) => {
    ol.hidden = k !== i;
  });
  const rows = panels[i] ? [...panels[i].querySelectorAll("li.p")] : [];
  rows.forEach((li, k) => put(li, "data-focus", focus === k));
  readout.textContent = readoutOf(i, focus);
  if (changed) {
    const say = `${tech.name}: ${sayOf(i)}`;
    stage.setAttribute("aria-description", say);
    if (!touring) announcer.textContent = say;
  }
}
function readoutOf(i, k) {
  const tech = TECHS[i];
  if (k !== null && k !== undefined) {
    const p = tech.parts[k];
    const c = countOf({ parts: [p] });
    const where = tf(c.places === 1 ? "{places} place" : "{places} places", c);
    return `${tech.short} · ${STATES[p.state]} · ${where}`;
  }
  const c = countOf(tech);
  return `${i + 1}/${N} · ${tech.short} · ${tf("{parts} roles in {places} places · {optional} optional", c)}`;
}
function sayOf(i) {
  return tf(
    "{parts} roles in {places} places; {optional} of the roles optional. {plan} places only on an optional machine.",
    countOf(TECHS[i]),
  );
}

// ---------- the loop, the tour and the controls ----------
const REST = DUR - 0.5; // the first stop, every place lit
let T = still.matches ? REST : 0;
let touring = !still.matches;
let visible = false,
  raf = 0,
  last = 0;
function draw() {
  words(frame(T));
}
// Any interaction holds the tour on its stop for good; only Space or the
// play button resumes it. Nothing resumes it on a timer.
function sync() {
  if (!playBtn) return;
  playBtn.hidden = still.matches;
  playBtn.textContent = touring ? "❚❚" : "▶";
  playBtn.setAttribute("aria-label", tr(touring ? "Pause the tour" : "Resume the tour"));
  hintText.textContent = tr(
    still.matches
      ? "Click or → next technology"
      : touring
        ? "Touring · click, → or Space to stop"
        : "Paused · press Space or ▶ to resume",
  );
}
function hold() {
  if (touring) {
    touring = false;
    sync();
  }
}
function resume() {
  if (still.matches) return;
  touring = true;
  focus = null;
  sync();
  start();
}
const toggle = () => (touring ? hold() : resume());
// Going to a technology starts its stop from the beginning, so its places
// light one after another.
function goTo(i) {
  hold();
  focus = null;
  const k = Math.floor(T / DUR);
  T = k * DUR + ((((i - (((k % N) + N) % N)) % N) + N) % N) * DUR + 0.01;
}
function step(direction) {
  const { i } = locate(T);
  goTo((i + direction + N) % N);
}
// While held, T advances inside the stop and wraps back to 3.5 s, never into
// the next stop, so its tokens keep travelling.
const advance = (dt) => {
  const k = Math.floor(T / DUR);
  T += dt;
  if (Math.floor(T / DUR) !== k) T = k * DUR + 3.5;
};
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  if (touring) T += dt;
  else advance(dt);
  draw();
  raf = visible && !still.matches ? requestAnimationFrame(tick) : 0;
}
const start = () => {
  if (!raf && visible && !still.matches) {
    last = 0;
    raf = requestAnimationFrame(tick);
  } else if (still.matches) draw();
};
new IntersectionObserver(
  (entries) => {
    visible = entries[entries.length - 1].isIntersecting;
    if (visible) start();
    else {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  },
  { rootMargin: "120px 0px" },
).observe(stage);
stage.addEventListener("pointerenter", (event) => {
  if (event.pointerType === "mouse") hold();
});
stage.addEventListener("click", () => {
  step(1);
  start();
});
stage.addEventListener("focus", () => {
  announcer.textContent = stage.getAttribute("aria-description") || "";
});
stage.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "ArrowDown") step(1);
  else if (event.key === "ArrowLeft" || event.key === "ArrowUp") step(-1);
  else if (event.key === "Home") goTo(0);
  else if (event.key === "End") goTo(N - 1);
  else if (event.key === " " || event.key === "Enter") toggle();
  else if (event.key === "Escape") hold();
  else return;
  event.preventDefault();
  if (still.matches) draw();
  else start();
});
techItems.forEach((li, i) => {
  li.addEventListener("click", () => {
    goTo(i);
    start();
  });
  li.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      goTo(i);
      start();
    }
  });
});
// Reading holds the tour: a key, a tap, the mouse over the descriptions or
// the list, a wheel over them, a text selection.
playBtn?.addEventListener("click", (event) => {
  event.stopPropagation();
  toggle();
});
const reading = [panels[0]?.parentElement, techItems[0]?.parentElement].filter(Boolean);
for (const el of reading) {
  el.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") hold();
  });
  el.addEventListener("wheel", hold, { passive: true });
}
document.addEventListener("keydown", (event) => {
  if (!event.defaultPrevented && event.target !== playBtn) hold();
});
document.addEventListener("pointerdown", (event) => {
  if (!playBtn?.contains(event.target)) hold();
});
document.addEventListener(
  "touchstart",
  (event) => {
    if (!playBtn?.contains(event.target)) hold();
  },
  { passive: true },
);
document.addEventListener("selectionchange", () => {
  if (String(getSelection() || "").trim()) hold();
});
// Pointing at a participation shows its places alone; leaving shows them all.
panels.forEach((ol, i) =>
  [...ol.querySelectorAll("li.p")].forEach((li, k) => {
    const on = () => {
      if (locate(T).i !== i) return;
      hold();
      focus = k;
      if (still.matches) draw();
      else start();
    };
    const off = () => {
      focus = null;
      if (still.matches) draw();
      else start();
    };
    li.addEventListener("pointerenter", on);
    li.addEventListener("pointerleave", off);
    li.addEventListener("focus", on);
    li.addEventListener("blur", off);
  }),
);
sync();
draw();

// Live code. Everything on screen is a pure function of one number, T, the
// tour's time in seconds: stop i (a technology) and the time into it, plus
// the participation the reader points at in the panel, if any. The model
// (model.mjs, inlined above) says where each technology takes part; DATA
// carries the cables' routes from the build.
const P = DATA.P;
const stage = document.querySelector(".qd-stage");
const svg = stage.querySelector("svg");
const readout = document.querySelector("[data-readout]");
const announcer = stage.querySelector(".qd-live");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const $$ = (sel, root = svg) => [...root.querySelectorAll(sel)];
const group = (sel, key) => {
  const out = {};
  for (const node of $$(sel)) (out[node.dataset[key]] ??= []).push(node);
  return out;
};
const UNITS = group("[data-unit]", "unit");
const PLATES = group("[data-plate]", "plate");
const ARROWS = group("[data-arrow]", "arrow");
const PLUGS = group("[data-plug]", "plug");
const CHUNKS = {};
for (const node of $$("[data-route]"))
  (CHUNKS[node.dataset.route] ??= []).push({
    node,
    from: +node.dataset.from,
    to: +node.dataset.to,
  });
const tokens = svg.querySelector("[data-tokens]");
const techItems = [...document.querySelectorAll(".qd-techs li")];
const panels = [...document.querySelectorAll(".qd-parts")];
const playBtn = document.querySelector(".qd-play");
const hintText = document.querySelector("[data-hint]");
const DUR = 22; // seconds a technology stays lit in the idle tour: long enough to read
const N = TECHS.length;

// Write only what changed.
const memo = new WeakMap();
function put(node, name, value) {
  let seen = memo.get(node);
  if (!seen) memo.set(node, (seen = {}));
  if (seen[name] === value) return;
  seen[name] = value;
  if (name === "text") node.textContent = value;
  else if (value === null || value === false) node.removeAttribute(name);
  else node.setAttribute(name, value === true ? "" : value);
}

// ---------- routes ----------
const ROUTES = {};
for (const [id, route] of Object.entries(DATA.routes)) {
  const cum = [0];
  for (let i = 1; i < route.points.length; i++) {
    const [a, b] = [route.points[i - 1], route.points[i]];
    cum.push(cum[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]));
  }
  ROUTES[id] = { ...route, cum };
}
function pointOn(route, s) {
  const { points, cum } = route;
  let i = 1;
  while (i < cum.length - 1 && cum[i] < s) i++;
  const f = Math.min(1, Math.max(0, (s - cum[i - 1]) / (cum[i] - cum[i - 1] || 1)));
  const [a, b] = [points[i - 1], points[i]];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
}
// How visible a token is at s: the build's ray test, softened over ±6 units.
function seen(route, s) {
  let sum = 0,
    n = 0;
  for (let d = -6; d <= 6; d += 2) {
    const j = Math.round((s + d) / 2);
    if (j >= 0 && j < route.vis.length) {
      sum += route.vis[j];
      n++;
    }
  }
  return n ? sum / n : 0;
}
const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));

// ---------- what lights at a stop ----------
// The places of the technology (or of one participation), in the order
// they light: the participations' order, each place once.
const ORDER = TECHS.map((tech) => tech.parts.map((p, k) => placesOf({ parts: [p] })));
function placesAt(i, focus) {
  if (focus !== null && focus !== undefined) return placesOf({ parts: [TECHS[i].parts[focus]] });
  return placesOf(TECHS[i]);
}
function sequence(i, focus) {
  const seq = [];
  const add = (kind, id) => {
    if (!seq.some(([k, d]) => k === kind && d === id)) seq.push([kind, id]);
  };
  const parts = focus !== null && focus !== undefined ? [ORDER[i][focus]] : ORDER[i];
  for (const pl of parts) {
    for (const id of Object.keys(pl.units)) add("units", id);
    for (const id of Object.keys(pl.plates)) add("plates", id);
    for (const id of Object.keys(pl.cables)) add("cables", id);
  }
  return seq;
}

// ---------- tokens: a ring travels each lit cable, opener to listener ----------
const R = DATA.r;
function ringSvg([x, y, z], opacity) {
  if (opacity < 0.02) return "";
  return `<g class="qd-tok" opacity="${opacity.toFixed(2)}">${lineSvg(ring(x, y, 5.4, z - R + 0.2, P, 28), { tone: "lit" })}</g>`;
}

// ---------- one frame ----------
let focus = null;
function locate(T) {
  const k = Math.floor(T / DUR);
  const i = ((k % N) + N) % N;
  return { i, st: T - k * DUR };
}
function frame(T) {
  const { i, st } = locate(T);
  const places = placesAt(i, focus);
  const seq = sequence(i, focus);
  const calm = still.matches;
  // Each place lights 0.07 s after the one before it, from 0.15 s.
  const shown = new Set(
    seq.filter((_, k) => calm || st >= 0.15 + k * 0.07).map(([kind, id]) => `${kind}:${id}`),
  );
  const state = (kind, id) => (shown.has(`${kind}:${id}`) ? places[kind][id] : undefined);
  for (const [id, nodes] of Object.entries(UNITS)) {
    const s = state("units", id);
    for (const node of nodes) {
      put(node, "data-on", s === "on");
      put(node, "data-plan", s === "plan");
    }
  }
  for (const [id, nodes] of Object.entries(PLATES)) {
    const s = state("plates", id);
    for (const node of nodes) {
      put(node, "data-on", s === "on");
      put(node, "data-plan", s === "plan");
    }
  }
  for (const [id, list] of Object.entries(CHUNKS)) {
    const s = state("cables", id);
    for (const c of list) {
      put(c.node, "data-hot", s === "on");
      put(c.node, "data-plan", s === "plan");
    }
  }
  for (const [id, nodes] of Object.entries(PLUGS)) {
    const s = state("cables", id);
    for (const node of nodes) {
      put(node, "data-on", s === "on");
      put(node, "data-plan", s === "plan");
    }
  }
  for (const [id, nodes] of Object.entries(ARROWS)) {
    const s = state("cables", id);
    for (const node of nodes) {
      put(node, "data-on", s === "on");
      put(node, "data-plan", s === "plan");
    }
  }
  tokens.innerHTML = (calm ? [] : tokensAt(places, shown, st)).join("");
  return i;
}

// Tokens on the built cables, staggered, a trip of 2.6 s and a rest of 0.8 s.
function tokensAt(places, shown, st) {
  const drawn = [];
  let n = 0;
  for (const [id, s] of Object.entries(places.cables)) {
    if (s !== "on" || !shown.has(`cables:${id}`)) continue;
    const route = ROUTES[id];
    const cyc = 3.4;
    const t = (st - 0.4 - n * 0.45) / cyc;
    n++;
    if (t < 0) continue;
    const lap = Math.floor(t);
    const f = ((t - lap) * cyc) / 2.6;
    if (f > 1) continue;
    const back = route.both && lap % 2 === 1;
    const g = ease(f);
    const along = back ? (1 - g) * route.total : g * route.total;
    const fade = Math.min(1, f / 0.12, (1 - f) / 0.12);
    drawn.push(ringSvg(pointOn(route, along), seen(route, along) * Math.max(0, fade)));
  }
  return drawn;
}

// The stack of Government Data and every place each technology takes part,
// in the installation's machine room: the figure on the stack's overview and
// its Simulation page.
//
//   node tools/figures/stack/build.mjs           (from the repository root)
//   node tools/figures/stack/build.mjs --es      (the same figure in Spanish)
//   node tools/figures/stack/build.mjs --audit   (the geometry audit only)
//   node tools/figures/stack/build.mjs --crowd   (a quick part of it)
//   node tools/figures/stack/build.mjs --light --out <file>   (light, to check)
//   node tools/figures/stack/build.mjs --draft --out <file>   (no audit, a quick look)
//
// It writes src/figures/stack.html (and stack.es.html), generated files
// (never edit them by hand): a standalone page in the dark theme, which the
// site embeds (src/figures/embed.ts) and switches to light with the site.
// Drawn with the Anatomy kit (MIT, https://github.com/wheresryan22/anatomy),
// vendored unchanged in ../anatomy-kit with its LICENSE; `sha256sum -c
// SHA256SUMS` there checks the copy. The kit's iso-kit.mjs is inlined into
// the page, so the page carries its code and its licence.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../anatomy-kit/iso-kit.mjs";
import * as G from "../anatomy-kit/lathe.mjs";
import * as A from "../anatomy-kit/audit.mjs";
import * as W from "./world.mjs";
import * as M from "./model.mjs";
import { pageOf } from "./page.mjs";
import { setLang, tr, trDeep, missing, browserSource } from "./i18n.mjs";
import { ES } from "./es.mjs";
import { P, R, HALOS } from "./scene.mjs";
import { floors } from "./floors.mjs";
import { cabinets, LCDS } from "./cabinets.mjs";
import { desks } from "./desks.mjs";
import { cables } from "./cables.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const KIT = join(HERE, "..", "anatomy-kit");
const arg = (flag) => {
  const i = process.argv.indexOf(flag);
  return i < 0 ? null : process.argv[i + 1];
};
const OUT =
  arg("--out") ??
  join(HERE, "..", "..", "..", "src", "figures", `stack${process.argv.includes("--es") ? ".es" : ""}.html`);
const THEME = process.argv.includes("--light") ? "light" : "dark";
// --es: the same figure in Spanish. The data are put in the figure's
// language before anything is drawn from them.
const LANG = process.argv.includes("--es") ? "es" : "en";
setLang(LANG);
for (const data of [W.CABINETS, W.LINKS, W.SPECS, M.TECHS, M.ABOUT, M.ROLES, M.NEEDS])
  trDeep(data);
trDeep(M.RESOURCES);
trDeep(M.STATES);

floors();
cabinets();
const OUTLETS = desks();
const ROUTES = cables(OUTLETS);

// ---------- order, audit, page ----------
A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);
const CROWD = [];
// node build.mjs --crowd: the audit's crowding, clearance, terminal and fold
// checks alone, as audit() runs them, for a quick look while routing (the full
// --audit, which also replays depth order, takes half an hour).
if (process.argv.includes("--crowd")) {
  const links = A.linksOf(R.tubes, A.mountsOf(R.tubes, R.solids));
  const mounts = A.mountsOf(R.tubes, R.solids);
  const found = {
    crowding: A.crowding(R.routes, P, {
      links,
      items: R.settled.items,
      allow: CROWD,
      state: 0,
      rods: A.slenderOf(R.solids),
    }),
    clearance: A.clearances(R.tubes, R.solids, { mounts }),
    terminals: A.terminals(R.tubes, R.solids, { mounts }),
    folds: A.folds(R.routes, P, { items: R.settled.items }),
  };
  console.log(A.report(found));
  process.exit(A.failures(found) ? 1 : 0);
}
// --draft: no audit, for a quick look while drawing; never for the file the
// site embeds.
if (!process.argv.includes("--draft")) A.auditOrExit(R, P, { crowd: CROWD });
if (process.argv.includes("--audit")) process.exit(process.exitCode ?? 0);

// Where a token on a cable can be seen: a ray from it toward the viewer that
// meets no cabinet, desk part or plug. Sampled every 2 units along each route.
const V = G.viewOf(P);
const BOXES = [
  ...W.CABINETS.map((c) => [
    [c.x - 1.2, c.y - 1.2, 0],
    [c.x + c.w + 1.2, c.y + c.d + 2.4, c.h + 2.5],
  ]),
  [
    [W.MONITOR.x, W.MONITOR.y - 2, W.DESK.top],
    [W.MONITOR.x + W.MONITOR.w, W.MONITOR.y + 8, W.MONITOR.z + W.MONITOR.h],
  ],
  ...[W.DESK, W.PROVIDER].flatMap((T) => [
    [
      [T.x, T.y, T.top - 12],
      [T.x + T.w, T.y + T.d, T.top + T.t],
    ],
    [
      [T.x + 15, T.y + 14, T.top],
      [T.x + 105, T.y + 24, T.top + T.t + 67],
    ],
  ]),
];
function hidden(p) {
  for (const [lo, hi] of BOXES) {
    let t0 = 0,
      t1 = 1e6,
      ok = true;
    for (let i = 0; i < 3 && ok; i++) {
      if (Math.abs(V[i]) < 1e-9) {
        if (p[i] < lo[i] || p[i] > hi[i]) ok = false;
        continue;
      }
      let a = (lo[i] - p[i]) / V[i],
        b = (hi[i] - p[i]) / V[i];
      if (a > b) [a, b] = [b, a];
      t0 = Math.max(t0, a);
      t1 = Math.min(t1, b);
      if (t0 > t1) ok = false;
    }
    if (ok) return true;
  }
  return false;
}
const round = (v) => Math.round(v * 100) / 100;
const DATA = {
  P,
  routes: Object.fromEntries(
    Object.entries(ROUTES).map(([id, route]) => {
      const total = G.pathLength(route);
      const vis = [];
      for (let s = 0; s <= total; s += 2) {
        const p = G.pointAlong(route, s);
        vis.push(hidden([p[0], p[1], W.CABLE_R * 2 + 3]) ? 0 : 1);
      }
      const link = W.LINKS.find((l) => l.id === id);
      return [
        id,
        {
          points: route.map((p) => p.map(round)),
          total: round(total),
          vis,
          ends: [link.from[0], link.to[0]],
        },
      ];
    }),
  ),
  r: W.CABLE_R,
  // Where a token rests once it has arrived: on the machine's lid (the desk's top).
  tops: {
    ...Object.fromEntries(
      W.CABINETS.map((c) => [c.id, [c.x + c.w * 0.62, c.y + c.d / 2, c.h + 2.5]]),
    ),
    desk: [W.DESK.x + W.DESK.w - 14, W.DESK.y + W.DESK.d - 12, W.DESK.top + W.DESK.t],
  },
};

// The optional machines and their cables are drawn faint as a whole (the
// optional treatment), whatever lights.
const FAINT = /^(tw2[.:-]|replica\.|lake-replica[.:])/;
const items = R.items.map(
  (item) =>
    `<g data-k="${item.key.toFixed(4)}" data-name="${item.name}"${FAINT.test(item.name) ? " data-faint" : ""}>${item.svg}</g>`,
);
const svg = k.figureSvg({
  width: W.WIDTH,
  height: W.HEIGHT,
  label: tr(M.LABEL),
  body: [...HALOS, ...items, `<g data-tokens></g>`],
});
// The page's script, one module: the kit's licence and iso-kit.mjs, the
// model's modules in order, the cables' data, then the live code. The
// modules lose their imports, their re-exports and their `export`s, which the
// concatenation already satisfies.
const MODEL = ["parts", "techs-1", "techs-2", "model", "about", "roles"];
const strip = (file) =>
  readFileSync(file, "utf8")
    .replace(/^import [^;]*;$/gm, "")
    .replace(/^export \* from [^;]*;$/gm, "")
    .replace(/^export /gm, "");
const licence = `/*! The Anatomy kit's iso-kit.mjs follows.\n${readFileSync(join(KIT, "LICENSE"), "utf8")}*/\n`;
const script =
  licence +
  [join(KIT, "iso-kit.mjs"), ...MODEL.map((name) => join(HERE, `${name}.mjs`))]
    .map(strip)
    .join("\n") +
  // The browser's model comes from the English source: it is translated once,
  // before the first frame, with the same dictionary.
  `\n${browserSource(LANG === "es" ? ES : {})}` +
  (LANG === "es" ? "trDeep(TECHS);\ntrDeep(STATES);\n" : "") +
  `\nconst DATA = ${JSON.stringify(DATA)};\n` +
  ["live.js", "tour.js"].map((file) => readFileSync(join(HERE, file), "utf8")).join("\n");
const html = pageOf({ k, theme: THEME, svg, script });
if (missing.size) {
  console.error(`no Spanish for ${missing.size} texts:`);
  for (const text of missing) console.error(JSON.stringify(text));
  process.exit(1);
}
writeFileSync(OUT, html);
console.log(
  "wrote",
  OUT,
  "·",
  R.items.length,
  "items ·",
  R.solids.length,
  "solids ·",
  Object.keys(ROUTES).length,
  "cables · lcds",
  LCDS.join(","),
);

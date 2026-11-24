// The desks: people's browser and a third-party provider.
import * as k from "../anatomy-kit/iso-kit.mjs";
import * as A from "../anatomy-kit/audit.mjs";
import * as W from "./world.mjs";
import { tr } from "./i18n.mjs";

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
import { P, S, L, D, at, HALOS, put, slab, textOn, plane, rrect } from "./scene.mjs";

function desk(
  T,
  id,
  label,
  lines,
  { unitId, cls = "qd-browser", tag = "optional", outlet = true } = {},
) {
  deskFrame(T, id, label);
  monitor(T, id, lines, { unitId, cls, tag });
  return outlet ? outletOf(T, id) : null;
}

// The desk: legs, apron with its label, top and keyboard.
function deskFrame(T, id, label) {
  const top = { x: T.x, y: T.y, w: T.w, d: T.d, r: 2 };
  HALOS.push(`<path class="iso-halo" d="${k.haloOf(k.insetPlan(top, 2), -1, 1, P)}"/>`);
  for (const [x, y] of k.corners(top, 5)) {
    put(
      `${id}.leg`,
      [x, y, T.top / 2],
      S(k.cylinder(x, y, 1.8, 0, T.top, P, 16), { tone: "mid" }),
      [A.cylinder(x, y, 1.8, 0, T.top, { name: `${id}.leg` })],
    );
  }
  const apron = { x: T.x + 9, y: T.y + T.d - 7, w: T.w - 18, d: 2, r: 0.4 };
  slab(
    `${id}.apron`,
    apron,
    T.top - 12,
    12,
    { tone: "mid" },
    {
      steps: 2,
      extra: textOn("left", [apron.x + 5, apron.y + 2], T.top - 10.6, label, {
        size: 7,
        tone: "hi",
      }),
    },
  );
  slab(`${id}.top`, top, T.top, T.t, { tone: "mid" }, { steps: 3, bevel: 0.6 });
  const kb = { x: T.x + 22, y: T.y + T.d - 18, w: 58, d: 12, r: 1.2 };
  slab(
    `${id}.keyboard`,
    kb,
    T.top + T.t,
    2.2,
    { tone: "mid" },
    {
      steps: 2,
      bevel: 0.3,
      extra: D(k.dotGrid(kb.x + 4, kb.y + 3, 12, 3, 4.4, T.top + T.t + 2.2, P), {
        size: 0.45,
        tone: "lo",
      }),
    },
  );
}

// The monitor, its screen showing `lines` and a tag.
function monitor(T, id, lines, { unitId, cls, tag }) {
  const Mn = { x: T.x + 15, y: T.y + 16, w: 90, h: 58, d: 4, z: T.top + T.t + 9 };
  const foot = { x: Mn.x + Mn.w / 2 - 12, y: Mn.y - 2, w: 24, d: 12, r: 2 };
  slab(`${id}.monitor.foot`, foot, T.top + T.t, 1.6, { tone: "mid" }, { steps: 3 });
  const neck = { x: Mn.x + Mn.w / 2 - 3, y: Mn.y - 1, w: 6, d: 4, r: 1 };
  slab(
    `${id}.monitor.neck`,
    neck,
    T.top + T.t + 1.6,
    Mn.z + 8 - (T.top + T.t + 1.6),
    { tone: "mid" },
    { steps: 2 },
  );
  const body = { x: Mn.x, y: Mn.y + 3, w: Mn.w, d: Mn.d, r: 1 };
  const face = body.y + body.d;
  const screen =
    `<g class="qd-unit ${cls}" data-unit="${unitId}"><path class="qd-screen" d="${rrect(0, 0, Mn.w - 8, Mn.h - 8, 1.5)}"/>` +
    lines
      .map(
        (line, i) =>
          `<text class="qd-screen-text"${i ? "" : ' data-screen="0"'} x="3" y="${i ? 9 + i * 8.6 : 8}" font-size="${i ? 5.8 : 6.2}">${esc(tr(line))}</text>`,
      )
      .join("") +
    `<text class="iso-face-text qd-tag qd-screen-tag" x="${Mn.w - 11}" y="${Mn.h - 11}" font-size="5.6" text-anchor="end">${esc(tr(tag))}</text></g>`;
  slab(
    `${id}.monitor`,
    body,
    Mn.z,
    Mn.h,
    { tone: "mid" },
    { steps: 2, bevel: 0.5, extra: plane("left", [Mn.x + 4, face], Mn.z + Mn.h - 4, screen) },
  );
}

// The floor outlet the desk's network cable leaves from.
function outletOf(T, id) {
  const box = { x: T.x + T.w - 26, y: T.y + T.d / 2 - 7, w: 14, d: 14, r: 1.5 };
  slab(
    `${id}.outlet`,
    box,
    0,
    7,
    { tone: "mid" },
    {
      steps: 2,
      bevel: 0.4,
      extra: D([at([box.x + 3, box.y + 3, 7]), at([box.x + box.w - 3, box.y + box.d - 3, 7])], {
        size: 0.45,
      }),
    },
  );
  return { ...box, h: 7 };
}

// Every desk; returns the floor outlets the cables leave from.
export function desks() {
  return {
    desk: desk(
      W.DESK,
      "desk",
      "People · browser",
      ["Government Data", "Quality Data · rules", "Superset dashboards", "Grafana · operations", "this guide"],
      { unitId: "screen" },
    ),
    provider: desk(
      W.PROVIDER,
      "provider",
      "Provider · a third party",
      ["A provider", "delivers a batch", "where agreed", "sees nothing back"],
      { unitId: "provider" },
    ),
  };
}

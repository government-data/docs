// Cabinets: one machine each, its services as named units on its front and
// what it needs written on its top.
import * as k from "../anatomy-kit/iso-kit.mjs";
import * as A from "../anatomy-kit/audit.mjs";
import * as W from "./world.mjs";
import { tr, langOf } from "./i18n.mjs";
import { P, S, L, D, at, HALOS, put, mid, slab, fmt, textOn, plane, rrect } from "./scene.mjs";

export const UNITS = {};
export const LCDS = [];
// A cabinet's front (plate and units) faces +y, or +x when `face: "x"`; on
// a +x front the text runs along −y, which reads left to right on screen.
function frontOf(c) {
  if (c.face === "x")
    return { side: "right", fx: c.x + c.w, along: (u) => [c.x + c.w, c.y + c.d - u], len: c.d };
  return { side: "left", fy: c.y + c.d, along: (u) => [c.x + u, c.y + c.d], len: c.w };
}
function cabinet(c) {
  const plan = { x: c.x, y: c.y, w: c.w, d: c.d, r: 1.5 };
  const F = frontOf(c);
  HALOS.push(`<path class="iso-halo" d="${k.haloOf(k.insetPlan(plan, -3), -1, 1, P)}"/>`);
  slab(`${c.id}.plinth`, plan, 0, W.PLINTH, { tone: "lo" }, { steps: 3 });
  // Side vents on the side face: closed slots, in one or two columns.
  const vents = [];
  const sideLen = c.face === "x" ? c.w : c.d;
  for (let z = W.PLINTH + 10; z < c.h - 12; z += 7) {
    if (sideLen > 30)
      vents.push(
        rrect(8, -z, sideLen / 2 - 12, 3, 1.5),
        rrect(sideLen / 2 + 4, -z, sideLen / 2 - 12, 3, 1.5),
      );
    else vents.push(rrect(6, -z, sideLen - 12, 3, 1.5));
  }
  const side =
    c.face === "x"
      ? plane(
          "left",
          [c.x, c.y + c.d],
          0,
          `<path class="iso-line" data-tone="lo" d="${vents.join("")}"/>`,
        )
      : plane(
          "right",
          [c.x + c.w, c.y + c.d],
          0,
          `<path class="iso-line" data-tone="lo" d="${vents.join("")}"/>`,
        );
  const seam = L(k.sideSeam(plan, c.h - W.HEADER - 1, P, 3), { tone: "faint" });
  slab(
    `${c.id}.body`,
    plan,
    W.PLINTH,
    c.h - W.PLINTH,
    { tone: "mid" },
    { steps: 3, bevel: 0.8, inner: seam, extra: side },
  );
  const cap = k.insetPlan(plan, -1.2);
  const screws = k.corners(cap, 4).map(([x, y]) => at([x, y, c.h + 2.5]));
  // The minimum the machine needs, written on its top (its lid seam left
  // out there, so the words have the whole face).
  const lid = c.top
    ? ""
    : L(k.planOutline(k.insetPlan(cap, 7), c.h + 2.5, P, 3), { tone: "faint" });
  // A small spec card: label in the lighter tone, value in the stronger one,
  // "not stated" faint, in two aligned columns inside the top with a margin.
  // The line of the resource that limits the machine first is red, bold,
  // with a filled dot before its label.
  const topWords = topCard(c, cap);
  slab(
    `${c.id}.cap`,
    cap,
    c.h,
    2.5,
    { tone: "mid" },
    { steps: 3, bevel: 0.6, extra: lid + topWords + D(screws, { size: 0.5 }) },
  );
  const hz = plate(c, F);
  units(c, F, hz);
}

function unit(c, u, plan, z0, z1, off) {
  const F = frontOf(c);
  // A point on the unit's face, `t` along it from its start (front left).
  const fp = (t) => {
    const [x, y] = F.along(off + t);
    return c.face === "x" ? [x + 2.4, y] : [x, y + 2.4];
  };
  const len = c.bayW;
  const h = z1 - z0;
  const parts = [];
  if (u.name)
    parts.push(
      textOn(F.side, fp(6), z0 + (u.rows ?? 1) * W.UNIT - 9.2, u.name, { size: 8, tone: "hi" }),
    );
  if (u.lcd) {
    // A two-line display under the name, saying what the unit keeps.
    const pitch = 9;
    const wh = pitch * u.lcd.lines + 1.4;
    const body =
      `<path class="qd-lcd" d="${rrect(0, 0, u.lcd.w, wh, 1)}"/>` +
      u.lcd.text
        .map(
          (line, i) =>
            `<text class="qd-lcd-text" x="2.2" y="${7.4 + i * pitch}" font-size="7">${tr(line)}</text>`,
        )
        .join("");
    parts.push(plane(F.side, fp(6), z1 - 10.2, body));
    LCDS.push(u.lcd.id);
  }
  // The mark an optional participation shows, hidden otherwise.
  if (u.name)
    parts.push(
      textOn(F.side, fp(len - 8), z0 + (u.rows ?? 1) * W.UNIT - 9.2, "optional", {
        size: 6.4,
        tone: "hi",
        cls: "qd-tag",
        anchor: "end",
      }),
    );
  // An LED and two screws per unit.
  const [lx, ly] = fp(len - 4);
  const led = at([lx, ly, z0 + h / 2]);
  parts.push(`<circle class="qd-led" cx="${fmt(led[0])}" cy="${fmt(led[1])}" r="0.9"/>`);
  const [ax, ay] = fp(2.2),
    [bx, by] = fp(len - 1.6);
  parts.push(D([at([ax, ay, z0 + h / 2]), at([bx, by, z0 + 1.6])], { size: 0.45 }));
  const svg =
    S(k.slabOf(plan, z0, h, P, 2, 0.3), { tone: "mid", crease: "faint" }) + parts.join("");
  put(
    `${c.id}.unit.${u.id}`,
    mid(plan, z0, h),
    `<g class="qd-unit" data-unit="${u.id}">${svg}</g>`,
    [A.slab(plan, z0, h, { name: `${c.id}.unit.${u.id}` }, 2)],
  );
  UNITS[u.id] = c.id;
}

export function cabinets() {
  W.CABINETS.forEach(cabinet);
}

// The spec card on the top: label in the lighter tone, value in the stronger
// one, in two aligned columns; the resource that limits first red, with a dot.
function topCard(c, cap) {
  return (c.top ?? [])
    .map(([label, value, limit], i) => {
      const y = cap.y + 14 + i * 11.6;
      const dot = limit
        ? `<circle class="qd-limit-dot" cx="${fmt(at([cap.x + 5.5, y - 3.4, c.h + 2.5])[0])}" cy="${fmt(at([cap.x + 5.5, y - 3.4, c.h + 2.5])[1])}" r="1.5"/>`
        : "";
      const cls = limit ? " qd-limit" : "";
      return (
        dot +
        textOn("top", [cap.x + 9, y], c.h + 2.5, label, {
          size: 10,
          tone: "mid",
          cls: `qd-min${cls}`,
        }) +
        textOn("top", [cap.x + (langOf() === "es" ? 41 : 35), y], c.h + 2.5, value, {
          size: 10,
          tone: "hi",
          cls: `qd-min qd-min-v${cls}`,
        })
      );
    })
    .join("");
}

// The name plate across the top of the front; returns the height its band
// starts at.
function plate(c, F) {
  const hz = c.h - W.HEADER + 3;
  const head =
    c.face === "x"
      ? { x: F.fx, y: c.y + 4, w: 1.6, d: c.d - 8, r: 0.5 }
      : { x: c.x + 4, y: F.fy, w: c.w - 8, d: 1.6, r: 0.5 };
  const on = (u) => {
    const [x, y] = F.along(u);
    return c.face === "x" ? [x + 1.6, y] : [x, y + 1.6];
  };
  const words =
    textOn(F.side, on(9), hz + 11, c.title, { size: 10, tone: "hi", cls: "qd-title" }) +
    textOn(F.side, on(9), hz + 3.4, c.host, { size: 7.2, tone: "mid", cls: "qd-host" });
  const pz = (u, z) => {
    const [x, y] = on(u);
    return at([x, y, z]);
  };
  slab(
    `${c.id}.plate`,
    head,
    hz,
    W.HEADER - 6,
    { tone: "hi", crease: "lo" },
    {
      steps: 2,
      extra: words + D([pz(F.len - 7, hz + 3), pz(F.len - 7, hz + W.HEADER - 9)], { size: 0.5 }),
      wrap: `class="qd-plate" data-plate="${c.id}"`,
    },
  );
  return hz;
}

// The units, top down in each bay.
function units(c, F, hz) {
  c.bays.forEach((bay, b) => {
    const off = 4 + b * (c.bayW + 4);
    let top = hz - 3;
    for (const u of bay) {
      const rows = u.rows ?? 1;
      const z1 = top - 1;
      const z0 = top - rows * W.UNIT + 1;
      top -= rows * W.UNIT;
      const plan =
        c.face === "x"
          ? { x: F.fx, y: c.y + c.d - off - c.bayW, w: 2.4, d: c.bayW, r: 0.6 }
          : { x: c.x + off, y: F.fy, w: c.bayW, d: 2.4, r: 0.6 };
      unit(c, u, plan, z0, z1, off);
    }
  });
}

// The projection and the drawing helpers every part of the room uses: one
// recorder (anatomy-kit/audit.mjs) for the painter's order and the audit,
// the halos drawn under everything and the marks painted on the floors.
import * as k from "../anatomy-kit/iso-kit.mjs";
import * as A from "../anatomy-kit/audit.mjs";
import * as W from "./world.mjs";
import { tr } from "./i18n.mjs";

const FIT = [
  ...[...W.ROOM_RING, ...W.ORG_RING, ...W.PROV_RING, ...W.AWS_RING, ...W.SITE_RING].flatMap(
    ([x, y]) => [
      [x, y, 0],
      [x, y, -W.FLOOR_H],
    ],
  ),
  ...W.CABINETS.map((c) => k.boxCorners(c, 0, c.h + 3)).flat(),
  ...k.boxCorners(
    { x: W.MONITOR.x, y: W.MONITOR.y, w: W.MONITOR.w, d: 4 },
    0,
    W.MONITOR.z + W.MONITOR.h,
  ),
];
export const P = k.fitProjection(FIT, W.WIDTH, W.HEIGHT, {
  pad: 14,
  azimuth: W.AZIMUTH,
  elevation: W.ELEVATION,
});
export const at = (point) => k.iso(point, P);
export const S = (paths, style) => k.solidSvg(paths, style);
export const L = (d, style) => k.lineSvg(d, style);
export const D = (points, style) => k.dotsSvg(points, style);
export const R = A.recorder(P);
export const HALOS = [];
export const FLOORMARKS = [];

export function put(name, centre, svg, shapes, { bias = 0, attrs = "" } = {}) {
  return R.put({
    name,
    at: centre,
    bias,
    svg,
    attrs,
    shapes: shapes.map((shape) => R.solid(shape)),
  });
}
export const mid = (plan, z, h) => [plan.x + plan.w / 2, plan.y + plan.d / 2, z + h / 2];
export function slab(
  name,
  plan,
  z,
  h,
  style = {},
  { steps = 3, bevel = 0, inner = "", extra = "", wrap = "", ...opts } = {},
) {
  let svg = S(k.slabOf(plan, z, h, P, steps, bevel), { tone: "mid", ...style, inner }) + extra;
  if (wrap) svg = `<g ${wrap}>${svg}</g>`;
  return put(name, mid(plan, z, h), svg, [A.slab(plan, z, h, { name }, steps)], opts);
}
export const fmt = (v) => (Math.round(v * 1000) / 1000).toString();
// Text in the plane of a face: "left" is a face at constant y (text along +x),
// "right" a face at constant x (text along −y); "top" lies on a top face.
export function textOn(
  face,
  [x, y],
  z,
  text,
  { size = 8, tone = "hi", cls = "qd-name", anchor = "start", attrs = "" } = {},
) {
  const m = face === "top" ? k.topMatrix([x, y], z, P, "x") : k.sideMatrix([x, y], z, P, face);
  return `<text class="iso-face-text ${cls}" data-tone="${tone}" transform="${m}" font-size="${size}" text-anchor="${anchor}"${attrs}>${tr(text).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text>`;
}
export const plane = (face, [x, y], z, body) =>
  `<g transform="${face === "top" ? k.topMatrix([x, y], z, P, "x") : k.sideMatrix([x, y], z, P, face)}">${body}</g>`;
export const rrect = (x, y, w, h, r) =>
  `M${fmt(x + r)} ${fmt(y)}H${fmt(x + w - r)}A${r} ${r} 0 0 1 ${fmt(x + w)} ${fmt(y + r)}V${fmt(y + h - r)}A${r} ${r} 0 0 1 ${fmt(x + w - r)} ${fmt(y + h)}H${fmt(x + r)}A${r} ${r} 0 0 1 ${fmt(x)} ${fmt(y + h - r)}V${fmt(y + r)}A${r} ${r} 0 0 1 ${fmt(x + r)} ${fmt(y)}Z`;

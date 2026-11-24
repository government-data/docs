// The floors: the installation's room, the organisation's premises, the
// provider's, the publisher's (AWS) and another site's.
import * as k from "../anatomy-kit/iso-kit.mjs";
import * as A from "../anatomy-kit/audit.mjs";
import * as W from "./world.mjs";
import { P, S, L, HALOS, put, textOn } from "./scene.mjs";

// Where the line x = c (axis 0) or y = c (axis 1) crosses a convex ring.
function chord(ring, axis, c) {
  const hits = [];
  ring.forEach((a, i) => {
    const b = ring[(i + 1) % ring.length];
    if ((a[axis] - c) * (b[axis] - c) < 0) {
      const f = (c - a[axis]) / (b[axis] - a[axis]);
      hits.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]);
    }
  });
  return hits.length === 2 ? hits : null;
}
function floor(name, ring, text, extra = "") {
  HALOS.push(`<path class="iso-halo" d="${k.extrude(ring, -W.FLOOR_H - 2, W.FLOOR_H, P).fill}"/>`);
  const xs = ring.map((p) => p[0]),
    ys = ring.map((p) => p[1]);
  // Tile joints every 60, edge to edge across the top.
  const joints = [];
  for (let x = Math.min(...xs) + 60; x < Math.max(...xs) - 10; x += 60) {
    const h = chord(ring, 0, x);
    if (h) joints.push(k.lineOnTop(h[0], h[1], 0, P));
  }
  for (let y = Math.min(...ys) + 60; y < Math.max(...ys) - 10; y += 60) {
    const h = chord(ring, 1, y);
    if (h) joints.push(k.lineOnTop(h[0], h[1], 0, P));
  }
  const words = text
    .map(([[x, y], words, size, tone]) =>
      textOn("top", [x, y], 0, words, { size, tone, cls: "qd-floor" }),
    )
    .join("");
  const paths = k.extrude(ring, -W.FLOOR_H, W.FLOOR_H, P, { bevel: 1.2 });
  put(
    `stand.${name}`,
    [
      (Math.min(...xs) + Math.max(...xs)) / 2,
      (Math.min(...ys) + Math.max(...ys)) / 2,
      -W.FLOOR_H / 2,
    ],
    S(paths, { tone: "lo" }) + L(joints.join(""), { tone: "faint" }) + words + extra,
    [A.extruded(ring, -W.FLOOR_H, W.FLOOR_H, { name: `stand.${name}` })],
    { bias: -50 },
  );
}

// Every floor, each named on its top.
export function floors() {
  floor("floor.room", W.ROOM_RING, [
    [[-200, 166], "INSTALLATION · the organisation's servers", 12, "mid"],
    [[-200, 179], "private network · mutual TLS · only :443 faces people", 8.5, "mid"],
  ]);
  floor("floor.org", W.ORG_RING, [
    [[-506, 76], "ORGANISATION", 12, "mid"],
    [[-506, 89], "people and their databases", 8.5, "mid"],
  ]);
  floor("floor.provider", W.PROV_RING, [
    [[-334, 320], "PROVIDER", 11, "mid"],
    [[-334, 332], "a third party, outside the organisation", 7.4, "mid"],
  ]);
  floor("floor.aws", W.AWS_RING, [
    [[150, -318], "PUBLISHER", 10, "mid"],
    [[150, -306], "outside the installation", 7.4, "mid"],
  ]);
  floor("floor.site", W.SITE_RING, [
    [[390, 56], "ANOTHER SITE · optional", 10, "mid"],
    [[390, 68], "a copy of the lake, away from it", 7.4, "mid"],
  ]);
}

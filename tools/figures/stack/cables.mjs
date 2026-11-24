// Cables: one per connection, opened from `from`, with plugs and floor arrows.
import * as k from "../anatomy-kit/iso-kit.mjs";
import * as A from "../anatomy-kit/audit.mjs";
import * as W from "./world.mjs";
import * as G from "../anatomy-kit/lathe.mjs";
import { tubePieces, tubeSvg } from "../anatomy-kit/tube.mjs";
import * as M from "./model.mjs";
import { P, R, S, put, slab } from "./scene.mjs";

function portOf([id, face, share], OUTLETS) {
  const c = OUTLETS[id] ?? W.cab(id);
  const n = { "+x": [1, 0], "-x": [-1, 0], "+y": [0, 1], "-y": [0, -1] }[face];
  // A side plug keeps its place on a cabinet deepened backwards (y0, d0).
  const along = face.endsWith("x")
    ? [c.x + (n[0] > 0 ? c.w : 0), (c.y0 ?? c.y) + share * (c.d0 ?? c.d)]
    : [c.x + share * c.w, c.y + (n[1] > 0 ? c.d : 0)];
  return { c, n, at: along };
}

// Draws every cable; returns each one's route by its id.
export function cables(OUTLETS) {
  // A line no built participation uses is planned: always drawn faint.
  const PLANNED_LINKS = new Set(
    W.LINKS.map((l) => l.id).filter(
      (id) =>
        !M.TECHS.some((t) =>
          t.parts.some(
            (p) => (p.state === "built" || p.state === "part") && p.at.includes(`cable:${id}`),
          ),
        ),
    ),
  );
  const ROUTES = {};
  for (const link of W.LINKS) ROUTES[link.id] = cable(link, OUTLETS, PLANNED_LINKS);
  return ROUTES;
}

// One cable: its plugs, its tube in pieces, and its floor arrows.
function cable(link, OUTLETS, PLANNED_LINKS) {
  const ends = [link.from, link.to].map((end) => portOf(end, OUTLETS));
  const r = link.mesh || link.repl ? 1.15 : W.CABLE_R;
  const tips = ends.map(({ n, at: [x, y] }, i) => {
    // A connector on the face at floor level; the cable leaves its outer face.
    const half = link.mesh || link.repl ? 3 : 4;
    const plug = n[0]
      ? { x: n[0] > 0 ? x : x - 3, y: y - half, w: 3, d: half * 2, r: 0.6 }
      : { x: x - half, y: n[1] > 0 ? y : y - 3, w: half * 2, d: 3, r: 0.6 };
    slab(
      `${link.id}.plug${i}`,
      plug,
      0,
      5.4,
      { tone: "hi", crease: "lo" },
      { steps: 2, wrap: `class="qd-plug" data-plug="${link.id}"` },
    );
    return [x + n[0] * 3, y + n[1] * 3];
  });
  const out = (i, d) => [tips[i][0] + ends[i].n[0] * d, tips[i][1] + ends[i].n[1] * d];
  const points = [tips[0], out(0, 9), ...link.via, out(1, 9), tips[1]].map(([x, y]) => [x, y, r]);
  const route = G.fillet(points, 7, 10, { P, tube: r });
  R.route(link.id, route, r, {
    owner: link.id,
    limp: true,
    touch: ["stand.*", `${link.id}.plug*`],
  });
  tubePieces(route, r, P, { maxLength: 12, spacing: 1.4 }).forEach((piece, index) =>
    put(
      `${link.id}:${index}`,
      piece.mid,
      `<g class="qd-chunk${link.mesh ? " qd-mesh" : link.repl ? " qd-repl" : ""}" data-group="${link.group}"${PLANNED_LINKS.has(link.id) ? " data-planned" : ""} data-route="${link.id}" data-from="${piece.from.toFixed(1)}" data-to="${piece.to.toFixed(1)}">${tubeSvg(piece, { tone: "mid" })}</g>`,
      [
        A.tube(piece.points, piece.radii, {
          name: `${link.id}:${index}`,
          owner: link.id,
          limp: true,
        }),
      ],
      { bias: 0.05 },
    ),
  );
  arrows(link, route);
  return route;
}

// Floor arrows: from the side that opens the connection to the side that listens.
function arrows(link, route) {
  const total = G.pathLength(route);
  // A thin cable's arrow sits closer to it; a recipient's sits on its last
  // leg, where no neighbour runs.
  const off = link.repl ? 6.5 : 9;
  const arrows = link.mesh
    ? []
    : link.both
      ? [
          [0.38, 1],
          [0.62, -1],
        ]
      : [[link.arrowEnd ? 1 - link.arrowEnd / total : 0.5, 1]];
  arrows.forEach(([share, sign], i) => {
    const c = G.pointAlong(route, total * share);
    const t = G.tangentAlong(route, total * share);
    const dir = [t[0] * sign, t[1] * sign];
    const side = [-t[1] * (link.side ?? 1), t[0] * (link.side ?? 1)];
    const o = [c[0] + side[0] * off, c[1] + side[1] * off];
    const ring = [
      [o[0] + dir[0] * 6, o[1] + dir[1] * 6],
      [o[0] - dir[0] * 5 + side[0] * 4.6, o[1] - dir[1] * 5 + side[1] * 4.6],
      [o[0] - dir[0] * 2.4, o[1] - dir[1] * 2.4],
      [o[0] - dir[0] * 5 - side[0] * 4.6, o[1] - dir[1] * 5 - side[1] * 4.6],
    ];
    const wind =
      (ring[1][0] - ring[0][0]) * (ring[3][1] - ring[0][1]) -
      (ring[1][1] - ring[0][1]) * (ring[3][0] - ring[0][0]);
    const poly = wind < 0 ? [...ring].reverse() : ring;
    put(
      `${link.id}.arrow${i}`,
      [o[0], o[1], 0.3],
      `<g class="qd-arrow" data-group="${link.group}" data-arrow="${link.id}">${S(k.extrude(poly, 0, 0.6, P, { convex: false }), { tone: "hi", crease: "lo" })}</g>`,
      [A.extruded(poly, 0, 0.6, { name: `${link.id}.arrow${i}` })],
    );
  });
}

import { describe, expect, it } from "vitest";
import { LINKS, NODES, VIEW, ZONES, linkOf, nodeById, pathOf, routeOf, type Node } from "./scene";

type Point = [number, number];

const inside = (n: Node, [x, y]: Point, slack = 0) =>
  Math.abs(x - n.x) < n.w / 2 - slack && Math.abs(y - n.y) < n.h / 2 - slack;

const onEdge = (n: Node, [x, y]: Point) => {
  const [dx, dy] = [Math.abs(x - n.x), Math.abs(y - n.y)];
  const near = (a: number, b: number) => Math.abs(a - b) < 0.01;
  return (near(dx, n.w / 2) && dy <= n.h / 2 + 0.01) || (near(dy, n.h / 2) && dx <= n.w / 2 + 0.01);
};

/** Whether a segment passes through a node's box (Liang–Barsky). */
function crosses(n: Node, [x0, y0]: Point, [x1, y1]: Point): boolean {
  const [l, r, t, b] = [n.x - n.w / 2 + 0.5, n.x + n.w / 2 - 0.5, n.y - n.h / 2 + 0.5, n.y + n.h / 2 - 0.5];
  let [u0, u1] = [0, 1];
  const [dx, dy] = [x1 - x0, y1 - y0];
  for (const [p, q] of [[-dx, x0 - l], [dx, r - x0], [-dy, y0 - t], [dy, b - y0]]) {
    if (p === 0) {
      if (q < 0) return false;
    } else {
      const u = q / p;
      if (p < 0) u0 = Math.max(u0, u);
      else u1 = Math.min(u1, u);
      if (u0 > u1) return false;
    }
  }
  return true;
}

describe("the scene", () => {
  it("names every node once", () => {
    const ids = NODES.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps every node and zone inside the drawing", () => {
    for (const n of NODES) {
      expect(n.x - n.w / 2, n.id).toBeGreaterThanOrEqual(0);
      expect(n.x + n.w / 2, n.id).toBeLessThanOrEqual(VIEW.w);
      expect(n.y - n.h / 2, n.id).toBeGreaterThanOrEqual(0);
      expect(n.y + n.h / 2, n.id).toBeLessThanOrEqual(VIEW.h);
    }
    for (const z of ZONES) expect(z.y + z.h, z.label.en).toBeLessThanOrEqual(VIEW.h);
  });

  it("never lets two nodes overlap", () => {
    for (const a of NODES)
      for (const b of NODES) {
        if (a === b) continue;
        const apart = Math.abs(a.x - b.x) >= (a.w + b.w) / 2 || Math.abs(a.y - b.y) >= (a.h + b.h) / 2;
        expect(apart, `${a.id} and ${b.id}`).toBe(true);
      }
  });

  it("links known nodes, once per pair", () => {
    const pairs = LINKS.map((l) => [l.a, l.b].sort().join("|"));
    expect(new Set(pairs).size).toBe(pairs.length);
    for (const l of LINKS) {
      expect(() => nodeById(l.a)).not.toThrow();
      expect(() => nodeById(l.b)).not.toThrow();
    }
  });

  it("starts and ends every link on its nodes' edges", () => {
    for (const l of LINKS) {
      const path = pathOf(l);
      expect(onEdge(nodeById(l.a), path[0]), `${l.a}→${l.b} start`).toBe(true);
      expect(onEdge(nodeById(l.b), path[path.length - 1]), `${l.a}→${l.b} end`).toBe(true);
    }
  });

  it("routes no link through a node it does not join", () => {
    // The check itself sees a crossing, and a miss.
    expect(crosses(nodeById("core"), [0, 236], [300, 236])).toBe(true);
    expect(crosses(nodeById("core"), [0, 100], [300, 100])).toBe(false);
    for (const l of LINKS) {
      const path = pathOf(l);
      for (const n of NODES) {
        if (n.id === l.a || n.id === l.b) continue;
        for (let k = 1; k < path.length; k++) {
          expect(crosses(n, path[k - 1], path[k]), `${l.a}→${l.b} crosses ${n.id}`).toBe(false);
        }
      }
    }
  });

  it("leaves no point of a route inside its own ends but the first and last", () => {
    for (const l of LINKS) {
      const inner = pathOf(l).slice(1, -1);
      for (const p of inner) {
        expect(inside(nodeById(l.a), p, 1) || inside(nodeById(l.b), p, 1), `${l.a}→${l.b}`).toBe(false);
      }
    }
  });

  it("routes a packet either way along its link", () => {
    expect(routeOf("people", "traefik")).toEqual(routeOf("traefik", "people").reverse());
    expect(linkOf("w1", "coordinator")?.kind).toBe("mtls");
    expect(() => routeOf("people", "pg")).toThrow();
  });
});

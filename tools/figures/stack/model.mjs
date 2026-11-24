// The stack, one technology at a time, and every place each takes part.
// Pure data, used by the build (words) and the page (what lights).
//
// A participation is one role in one place: { what, at, state }.
//   at: unit ids (rack.mjs), "cable:<link id>", "plate:<cabinet id>" for a
//       machine's whole stack, "screen" for people's browser and "provider"
//       for the provider's desk.
//   state: "built" (in every installation) or "optional" (an added Trino
//       worker, the lake replica).

import { TECHS_1 } from "./techs-1.mjs";
import { TECHS_2 } from "./techs-2.mjs";

export const LABEL =
  "An isometric machine room. On the organisation's floor, at left, people's desk with a browser and the organisation's source databases. On the installation's floor: the main server, with the core, the orchestrator and the Trino coordinator it manages, Superset and the operations stack; a Trino worker on a machine of its own, and an optional second one; and the lake server. Behind, AWS, which the agent pulls updates from; at right, an optional lake replica at another site; in front, a third-party provider. Stepping through the stack one technology at a time, every unit and cable where the current technology takes part lights; optional places are outlined and marked optional; the rest dims.";

export const TECHS = [...TECHS_1, ...TECHS_2];

export const STATES = {
  built: "in every installation",
  optional: "optional",
};

// Where each participation lights: unit → "on" (in every installation) or
// "plan" (optional only); the same for cables and plates.
export function placesOf(tech) {
  const rank = { built: 2, optional: 1 };
  const units = {},
    cables = {},
    plates = {};
  for (const p of tech.parts) {
    const r = rank[p.state];
    if (!r) continue;
    for (const at of p.at) {
      const [kind, id] = at.includes(":") ? at.split(":") : ["unit", at];
      const map = kind === "cable" ? cables : kind === "plate" ? plates : units;
      map[id] = Math.max(map[id] ?? 0, r);
    }
  }
  const name = (map) =>
    Object.fromEntries(Object.entries(map).map(([k, v]) => [k, v === 2 ? "on" : "plan"]));
  return { units: name(units), cables: name(cables), plates: name(plates) };
}

export function countOf(tech) {
  const { units, cables, plates } = placesOf(tech);
  const all = [...Object.values(units), ...Object.values(cables), ...Object.values(plates)];
  return {
    places: all.length,
    on: all.filter((s) => s === "on").length,
    plan: all.filter((s) => s === "plan").length,
    parts: tech.parts.length,
    optional: tech.parts.filter((p) => p.state === "optional").length,
  };
}

export * from "./about.mjs";
export * from "./roles.mjs";

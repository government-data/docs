// The cables and their groups. Re-exported by world.mjs.
// Cables: opened from `from` to `to`; each end on a face of a cabinet
// ("+x", "-x", "+y", "-y") at a share along that face, with waypoints on the
// floor between. `both`: the connection is opened from either side. A cable
// stands for every connection between that pair of machines.
export const LINKS = [
  {
    id: "browser",
    from: ["desk", "+x", 0.5],
    to: ["main", "-x", 0.5],
    via: [],
    label: "browser → Traefik :443 on the main server",
  },
  {
    id: "tw1-main",
    from: ["tw1", "-y", 0.6],
    to: ["main", "+y", 0.4],
    via: [],
    both: true,
    label: "Trino coordinator ↔ Trino worker",
  },
  {
    id: "tw1-src",
    from: ["tw1", "-x", 0.5],
    to: ["sources", "+x", 0.5],
    via: [],
    label: "Trino worker → source databases, read only",
  },
  {
    id: "tw1-prov",
    from: ["tw1", "+y", 0.3],
    to: ["provider", "-y", 0.5],
    via: [],
    label: "Trino worker → the provider's delivered batch, read only",
  },
  {
    id: "tw1-lake",
    from: ["tw1", "+y", 0.8],
    to: ["lake", "+y", 0.2],
    via: [
      [-130, 120],
      [230, 120],
    ],
    label: "Trino worker → lake gate · S3 and Iceberg REST",
  },
  {
    id: "tw2-main",
    from: ["tw2", "-y", 0.4],
    to: ["main", "+y", 0.75],
    via: [],
    both: true,
    label: "Trino coordinator ↔ an added Trino worker (optional)",
  },
  {
    id: "tw2-lake",
    from: ["tw2", "+x", 0.5],
    to: ["lake", "-x", 0.5],
    via: [],
    label: "an added Trino worker → lake gate (optional)",
  },
  {
    id: "main-lake",
    from: ["main", "+x", 0.8],
    to: ["lake", "-y", 0.5],
    via: [[275, -225.2]],
    label: "main server → lake gate · the core's lake adapter, Loki and Mimir",
  },
  {
    id: "agent-aws",
    from: ["main", "+x", 0.45],
    to: ["aws", "+y", 0.5],
    via: [[260, -244.8]],
    label: "qd agent → AWS · outbound HTTPS only, nothing comes in",
  },
  {
    id: "lake-replica",
    from: ["lake", "+x", 0.5],
    to: ["replica", "-x", 0.5],
    via: [],
    label: "lake server → lake replica at another site (optional)",
  },
];

// Lines by group, one rule, in this order: People (a line at a desk),
// Updates (the line to AWS), Lake (a line at a lake machine), then Trino
// (the rest, all at Trino's workers).
const AT_DESK = /^(desk|provider)$/;
const AT_LAKE = /^(lake|replica)$/;
export const GROUPS = ["People", "Updates", "Lake", "Trino"];
for (const l of LINKS) {
  const ends = [l.from[0], l.to[0]];
  l.group = ends.some((e) => AT_DESK.test(e))
    ? "People"
    : ends.includes("aws")
      ? "Updates"
      : ends.some((e) => AT_LAKE.test(e))
        ? "Lake"
        : "Trino";
}

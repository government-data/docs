// What each machine needs, written on its top, and the cabinets' heights.
// Re-exported by world.mjs.
//
// Every figure is a proposed starting point, marked * on the card: an
// estimate to size a first installation by, not a measurement. Its basis
// says what it comes from.
import { UNIT, PLINTH, HEADER } from "./dims.mjs";
import { CABINETS } from "./rack.mjs";

const pr = (v, basis) => ({ v: `${v}*`, kind: "proposed", basis });
export const SPECS = {
  main: {
    disk: pr(
      "500 GB SSD",
      "PostgreSQL with its audit log, Dolt, the modules' volumes, the container images and the backups taken before each update; the lake's data is on the lake server",
    ),
    cpu: pr(
      "8 vCPU",
      "every service of the core, the orchestrator, Superset and the observability stores; the heavy query work runs on Trino's workers, not here",
    ),
    ram: pr(
      "32 GB",
      "the same services held in memory at once, among them PostgreSQL, Superset and the Trino coordinator, which plans queries but runs none of their work",
    ),
  },
  worker: {
    disk: pr(
      "100 GB SSD",
      "Trino's spill disk, for a query too big for memory, and the container images; it holds nothing once a query ends",
    ),
    cpu: pr("8 vCPU", "a worker reads and evaluates in parallel: more cores, more of a query at once"),
    ram: pr(
      "16 GB",
      "about 13 GB for Trino, the size of the single-node starting tier, split between quality jobs and dashboard queries, plus the system",
    ),
  },
  lake: {
    disk: pr(
      "4 × 4 TB",
      "bronze, silver and gold, the logs and metrics Loki and Mimir keep there, and the old versions of objects; it grows with the data copied from the sources, so size it from them",
    ),
    cpu: pr("4 vCPU", "RustFS, its catalog and its gate: the queries' work runs on Trino's workers"),
    ram: pr("16 GB", "RustFS, its catalog and its gate, Alloy and the agent"),
  },
  replica: {
    disk: pr(
      "as the lake",
      "at least the lake's data, plus the versions it keeps locked for 30 days; large, slow disks are enough",
    ),
    cpu: pr("2 vCPU", "one RustFS and its gate"),
    ram: pr("8 GB", "one RustFS and its gate"),
  },
};
// The resource each role uses most and that limits it first, red on its card.
const LIMITS = {
  main: {
    res: "ram",
    why: "it holds the most services in memory at once; none of them computes a query's work",
  },
  worker: {
    res: "ram",
    why: "a query runs in a worker's memory and spills to its disk past it: Trino's memory is what limits a job's size",
  },
  lake: {
    res: "disk",
    why: "what grows is the lake: every cut copied into bronze and silver, and its results in gold",
  },
  replica: { res: "disk", why: "it holds every object of the lake and its locked versions" },
};
for (const [id, l] of Object.entries(LIMITS)) SPECS[id].limits = l;
const card = (sp) => [
  ["Disk", sp.disk.v, sp.limits.res === "disk"],
  ["CPU", sp.cpu.v, sp.limits.res === "cpu"],
  ["RAM", sp.ram.v, sp.limits.res === "ram"],
];
const TOPS = {
  main: card(SPECS.main),
  tw1: card(SPECS.worker),
  tw2: card(SPECS.worker),
  lake: card(SPECS.lake),
  replica: card(SPECS.replica),
};
for (const c of CABINETS) c.top = TOPS[c.id];

for (const c of CABINETS) {
  const rows = Math.max(...c.bays.map((bay) => bay.reduce((n, u) => n + (u.rows ?? 1), 0)));
  c.h = PLINTH + 6 + rows * UNIT + 4 + HEADER;
  const len = c.face === "x" ? c.d : c.w;
  c.bayW = (len - 8 - (c.bays.length - 1) * 4) / c.bays.length;
}
export const cab = (id) => CABINETS.find((c) => c.id === id);

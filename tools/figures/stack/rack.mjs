// The machines: one cabinet each, every service on its own named unit.
// Re-exported by world.mjs.
//
// Units: { id, name, rows (pitch count), lcd: { id, w, lines, text } }.
// A cabinet with `faint` is optional as a whole: drawn faint, whatever lights.
// Three machines, plus the optional ones: the main server (its bays are its
// modules, left to right: the edge and the core, the orchestrator with the
// Trino coordinator it manages, the indicators and operations), Trino's
// worker, memory-heavy, and the lake server, disk-heavy. Every machine runs
// Alloy and the qd agent.
const agent = (id) => ({ id: `${id}.agent`, name: "qd agent" });
const alloy = (id) => ({ id: `${id}.alloy`, name: "Alloy" });
const trino = (n) => [
  {
    id: `tw${n}.trino`,
    name: "Trino worker",
    rows: 3,
    lcd: { id: `tw${n}`, w: 74, lines: 2, text: ["reads the sources", "writes the lake"] },
  },
  { id: `tw${n}.spill`, name: "spill disk" },
  agent(`tw${n}`),
  alloy(`tw${n}`),
];
export const CABINETS = [
  {
    id: "main",
    x: -330,
    y: -270,
    w: 450,
    d: 56,
    title: "Main server",
    host: "the core, the orchestrator, indicators, operations",
    bays: [
      [
        { id: "traefik", name: "Traefik · edge" },
        { id: "web", name: "Quality Data · web" },
        { id: "api", name: "Quality Data · API" },
        { id: "iam", name: "Sign-in · OIDC" },
        { id: "ca", name: "CA · certificates" },
        {
          id: "pg",
          name: "PostgreSQL",
          rows: 3,
          lcd: { id: "pg", w: 86, lines: 2, text: ["accounts · audit", "jobs · modules' DBs"] },
        },
        { id: "dolt", name: "Dolt · rules catalog" },
      ],
      [
        { id: "operator", name: "Operator" },
        { id: "runner1", name: "Job runner 1" },
        { id: "runner2", name: "Job runner 2" },
        {
          id: "coordinator",
          name: "Trino coordinator",
          rows: 3,
          lcd: { id: "coord", w: 86, lines: 2, text: ["run and managed", "by the orchestrator"] },
        },
      ],
      [
        { id: "superset", name: "Superset" },
        { id: "valkey", name: "Valkey · cache" },
        { id: "grafana", name: "Grafana" },
        { id: "loki", name: "Loki" },
        { id: "mimir", name: "Mimir" },
        alloy("main"),
        agent("main"),
      ],
    ],
  },
  {
    id: "tw1",
    x: -250,
    y: 20,
    w: 150,
    d: 44,
    title: "Trino worker",
    host: "a machine of its own",
    bays: [trino(1)],
  },
  {
    // Big data: one more Trino worker, added when the data outgrows one.
    id: "tw2",
    x: -40,
    y: 20,
    w: 150,
    d: 44,
    faint: true,
    title: "Trino worker · optional",
    host: "add more for big data",
    bays: [trino(2)],
  },
  {
    id: "lake",
    x: 200,
    y: 0,
    w: 150,
    d: 48,
    title: "Lake server",
    host: "a machine of its own",
    bays: [
      [
        { id: "gate", name: "Lake gate · Traefik" },
        { id: "rustfs", name: "RustFS · S3" },
        {
          id: "iceberg",
          name: "Iceberg REST catalog",
          rows: 3,
          lcd: { id: "layers", w: 86, lines: 2, text: ["bronze · silver", "gold · results"] },
        },
        agent("lake"),
        alloy("lake"),
      ],
    ],
  },
  {
    id: "sources",
    x: -496,
    y: -40,
    w: 136,
    d: 40,
    org: true,
    title: "Source databases",
    host: "the organisation's own",
    bays: [
      [
        { id: "tables", name: "source tables" },
        { id: "login", name: "read-only login" },
      ],
    ],
  },
  {
    id: "aws",
    x: 180,
    y: -380,
    w: 160,
    d: 40,
    title: "AWS",
    host: "published versions · read only",
    bays: [
      [
        { id: "s3", name: "S3 · signed index" },
        { id: "ecr", name: "ECR · images" },
        { id: "kms", name: "KMS · signing key" },
        { id: "rolesanywhere", name: "IAM Roles Anywhere" },
      ],
    ],
  },
  {
    id: "replica",
    x: 420,
    y: -40,
    w: 140,
    d: 40,
    faint: true,
    title: "Lake replica · optional",
    host: "another site",
    bays: [
      [
        { id: "rustfsr", name: "RustFS · object lock" },
        { id: "rgate", name: "gate · Traefik" },
      ],
    ],
  },
];

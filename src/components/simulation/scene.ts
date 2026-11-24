// The scene of the platform simulation (PlatformSimulation.astro): the
// machines of one installation, grouped by module, the links between them
// and the route each link takes on the drawing. Pure data and geometry, no
// DOM, so the drawing, the player in the browser and the tests share it.
//
// Coordinates are the SVG's units: a node is its centre (x, y) and its size
// (w, h); a link is a polyline whose first point is on its first node's
// edge and whose last point is on its second's. Only what an administrator
// needs: no addresses, ports or names of a real installation.

export type Lang = "en" | "es";

/** A text in both languages of the guide. */
export interface Words {
  en: string;
  es: string;
}

const w = (en: string, es: string): Words => ({ en, es });

/** The icon drawn in a node's tile. */
export type Kind =
  | "users"
  | "cloud"
  | "agent"
  | "edge"
  | "app"
  | "key"
  | "db"
  | "branch"
  | "chart"
  | "cache"
  | "gauge"
  | "log"
  | "probe"
  | "clock"
  | "server"
  | "engine"
  | "catalog"
  | "table"
  | "bucket"
  | "provider";

/** A node's state, drawn by its border and its badge. */
export type State = "up" | "busy" | "down" | "maint" | "standby" | "added" | "fail";

export interface Line {
  key: string;
  text: Words;
}

export interface Node {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  kind: Kind;
  title: Words;
  lines: Line[];
  /** Its state when a scenario starts; "up" if not said. */
  state?: State;
}

/** The kind of a link: how the two ends talk, as the stack pages say. */
export type Traffic = "web" | "mtls" | "data" | "pull";

export interface Link {
  a: string;
  b: string;
  kind: Traffic;
  /** The points in between, when the link is not one straight segment. */
  via?: [number, number][];
}

export interface Zone {
  x: number;
  y: number;
  w: number;
  h: number;
  label: Words;
  /** Starlight's colour that tints it. */
  tone: "accent" | "purple" | "blue" | "orange" | "green" | "red";
  /** Where its label goes: at the top, or at the bottom where a link
   * would cross it. */
  labelAt?: "bottom";
}

export const VIEW = { w: 1000, h: 724 } as const;

const sub = (en: string, es: string): Line[] => [{ key: "sub", text: w(en, es) }];
const idle = () => sub("idle", "libre");

const trinoWorker = (n: number, x: number, standby = false): Node => ({
  id: `t${n}`,
  x,
  y: 480,
  w: 120,
  h: 44,
  kind: "engine",
  title: w(`Worker ${n}`, `Worker ${n}`),
  lines: standby ? sub("can be added", "por añadir") : idle(),
  state: standby ? "standby" : "up",
});

const orchestratorWorker = (n: number, x: number): Node => ({
  id: `w${n}`,
  x,
  y: 282,
  w: 88,
  h: 140,
  kind: "server",
  title: w(`Worker ${n}`, `Worker ${n}`),
  lines: [
    { key: "sub", text: w("idle", "libre") },
    { key: "what", text: w("signed SQL", "SQL firmado") },
    { key: "keeps", text: w("no state", "sin estado") },
  ],
});

const table = (id: string, x: number, title: string, en: string, es: string): Node => ({
  id,
  x,
  y: 588,
  w: 120,
  h: 44,
  kind: "table",
  title: w(title, title),
  lines: sub(en, es),
});

const source = (id: string, y: number, kind: Kind, title: Words, line: Words): Node => ({
  id,
  x: 815,
  y,
  w: 250,
  h: 40,
  kind,
  title,
  lines: [{ key: "sub", text: line }],
});

export const NODES: Node[] = [
  { id: "people", x: 400, y: 36, w: 190, h: 44, kind: "users", title: w("People", "Personas"), lines: sub("a browser", "un navegador") },
  { id: "aws", x: 870, y: 36, w: 220, h: 44, kind: "cloud", title: w("AWS", "AWS"), lines: sub("signed index, images", "índice firmado, imágenes") },
  { id: "agent", x: 870, y: 100, w: 220, h: 44, kind: "agent", title: w("qd agent", "agente qd"), lines: sub("on the core's server", "en el servidor del núcleo") },
  { id: "traefik", x: 500, y: 150, w: 940, h: 40, kind: "edge", title: w("Traefik", "Traefik"), lines: sub("web entry (HTTPS) · internal entry (mutual TLS)", "entrada web (HTTPS) · entrada interna (TLS mutuo)") },

  { id: "core", x: 105, y: 236, w: 136, h: 50, kind: "app", title: w("Quality Data", "Quality Data"), lines: sub("compiles SQL", "compila SQL") },
  { id: "signin", x: 255, y: 236, w: 136, h: 50, kind: "key", title: w("Sign-in", "Acceso"), lines: sub("OIDC · CA", "OIDC · CA") },
  { id: "pg", x: 105, y: 312, w: 136, h: 50, kind: "db", title: w("PostgreSQL", "PostgreSQL"), lines: sub("audit log", "auditoría") },
  { id: "dolt", x: 255, y: 312, w: 136, h: 50, kind: "branch", title: w("Dolt", "Dolt"), lines: sub("rules · main", "reglas · main") },

  { id: "superset", x: 420, y: 236, w: 136, h: 50, kind: "chart", title: w("Superset", "Superset"), lines: sub("dashboards", "dashboards") },
  { id: "valkey", x: 420, y: 312, w: 136, h: 50, kind: "cache", title: w("Valkey", "Valkey"), lines: sub("its cache", "su caché") },

  { id: "grafana", x: 585, y: 228, w: 136, h: 40, kind: "gauge", title: w("Grafana", "Grafana"), lines: sub("operations", "operación") },
  { id: "lokimimir", x: 585, y: 278, w: 136, h: 40, kind: "log", title: w("Loki · Mimir", "Loki · Mimir"), lines: sub("logs · metrics", "logs · métricas") },
  { id: "alloy", x: 585, y: 328, w: 136, h: 40, kind: "probe", title: w("Alloy", "Alloy"), lines: sub("on every server", "en cada servidor") },

  {
    id: "operator",
    x: 728,
    y: 282,
    w: 88,
    h: 140,
    kind: "clock",
    title: w("Operator", "Operador"),
    lines: [
      { key: "sub", text: w("waiting", "en espera") },
      { key: "what", text: w("schedules", "programa") },
      { key: "keeps", text: w("leases", "préstamos") },
    ],
  },
  orchestratorWorker(1, 822),
  orchestratorWorker(2, 916),

  { id: "coordinator", x: 869, y: 428, w: 180, h: 48, kind: "engine", title: w("Coordinator", "Coordinador"), lines: sub("plans, splits", "planea, reparte") },
  trinoWorker(1, 110),
  trinoWorker(2, 250),
  trinoWorker(3, 390),
  trinoWorker(4, 530, true),

  table("catalog", 110, "Iceberg", "REST catalog", "catálogo REST"),
  table("bronze", 250, "bronze", "as copied", "como llegó"),
  table("silver", 390, "silver", "as mapped", "mapeado"),
  table("gold", 530, "gold", "results", "resultados"),
  { id: "rustfs", x: 240, y: 666, w: 390, h: 40, kind: "bucket", title: w("RustFS", "RustFS"), lines: sub("S3 · pool of 4 servers · 4 of 4 up", "S3 · pool de 4 servidores · 4 de 4 activos") },
  { id: "replica", x: 540, y: 666, w: 180, h: 40, kind: "bucket", title: w("Replica", "Réplica"), lines: sub("kept 30 days", "guarda 30 días") },

  source("customers", 570, "db", w("Customers DB", "BD de clientes"), w("read only", "solo lectura")),
  source("transactions", 622, "db", w("Transactions DB", "BD de transacciones"), w("read only", "solo lectura")),
  source("provider", 674, "provider", w("Third-party provider", "Proveedor tercero"), w("delivers batches", "entrega lotes")),
];

export const ZONES: Zone[] = [
  { x: 30, y: 186, w: 300, h: 186, label: w("quality-data · core", "quality-data · núcleo"), tone: "accent", labelAt: "bottom" },
  { x: 345, y: 186, w: 150, h: 186, label: w("bi-superset", "bi-superset"), tone: "purple", labelAt: "bottom" },
  { x: 510, y: 186, w: 150, h: 186, label: w("observability", "observability"), tone: "blue", labelAt: "bottom" },
  { x: 675, y: 186, w: 295, h: 186, label: w("orchestrator", "orchestrator"), tone: "orange", labelAt: "bottom" },
  { x: 30, y: 388, w: 940, h: 124, label: w("query-trino · Trino", "query-trino · Trino"), tone: "green" },
  { x: 30, y: 544, w: 610, h: 164, label: w("lake-rustfs", "lake-rustfs"), tone: "red", labelAt: "bottom" },
];

/** The installation's outline: the sources and AWS stay outside it. */
export const INSTALLATION = "M12 70 H988 V528 H660 V716 H12 Z";

// The two buses under Trino's workers: the sources' (to the right, out of
// the installation) and the lake's gate (down to the tables).
const SOURCE_BUS = 520;
const LAKE_BUS = 532;
const COORDINATOR_BUS = 428;
const GUTTER_X = 672;

const trino = ["t1", "t2", "t3", "t4"];
const tables = ["catalog", "bronze", "silver", "gold"];
const sources = ["customers", "transactions", "provider"];
const byIdOf = (id: string) => NODES.find((n) => n.id === id)!;

export const LINKS: Link[] = [
  { a: "people", b: "traefik", kind: "web" },
  { a: "aws", b: "agent", kind: "pull" },
  { a: "agent", b: "traefik", kind: "mtls" },
  { a: "traefik", b: "core", kind: "web" },
  { a: "traefik", b: "signin", kind: "web" },
  { a: "traefik", b: "superset", kind: "web" },
  { a: "traefik", b: "grafana", kind: "web" },
  { a: "traefik", b: "operator", kind: "mtls" },
  { a: "traefik", b: "w1", kind: "mtls" },
  { a: "traefik", b: "w2", kind: "mtls" },
  // The operator hands jobs to its workers, over their heads.
  { a: "operator", b: "w1", kind: "mtls", via: [[746, 201], [806, 201]] },
  { a: "operator", b: "w2", kind: "mtls", via: [[758, 194], [898, 194]] },
  { a: "core", b: "signin", kind: "mtls" },
  { a: "core", b: "pg", kind: "mtls" },
  { a: "core", b: "dolt", kind: "mtls" },
  { a: "superset", b: "valkey", kind: "mtls" },
  // Superset reads gold through Trino: down the gutter between the modules.
  { a: "superset", b: "coordinator", kind: "mtls", via: [[502, 236], [502, 380], [869, 380]] },
  { a: "grafana", b: "lokimimir", kind: "mtls" },
  { a: "alloy", b: "lokimimir", kind: "mtls" },
  { a: "w1", b: "coordinator", kind: "mtls" },
  { a: "w2", b: "coordinator", kind: "mtls" },
  ...trino.map((t): Link => {
    const x = byIdOf(t).x;
    return { a: "coordinator", b: t, kind: "mtls", via: [[x, COORDINATOR_BUS]] };
  }),
  ...trino.flatMap((t) =>
    tables.map((tb): Link => {
      const [x, to] = [byIdOf(t).x, byIdOf(tb).x];
      return { a: t, b: tb, kind: "data", via: [[x, LAKE_BUS], [to, LAKE_BUS]] };
    }),
  ),
  ...trino.flatMap((t) =>
    sources.map((s): Link => {
      const [x, y] = [byIdOf(t).x, byIdOf(s).y];
      return { a: t, b: s, kind: "data", via: [[x, SOURCE_BUS], [GUTTER_X, SOURCE_BUS], [GUTTER_X, y]] };
    }),
  ),
  ...tables.slice(0, 3).map((tb): Link => ({ a: tb, b: "rustfs", kind: "data" })),
  { a: "gold", b: "rustfs", kind: "data", via: [[530, 628], [420, 628]] },
  { a: "rustfs", b: "replica", kind: "data" },
];

export const nodeById = (id: string): Node => {
  const n = NODES.find((m) => m.id === id);
  if (!n) throw new Error(`no node ${id}`);
  return n;
};

type Point = [number, number];

/** Where a node's edge meets the way to `p`: straight down, up or across
 * when `p` faces one of its sides, else on the ray from its centre. */
export function edgeToward(n: Node, p: Point): Point {
  const [dx, dy] = [p[0] - n.x, p[1] - n.y];
  if (Math.abs(dx) <= n.w / 2 && dy !== 0) return [p[0], n.y + Math.sign(dy) * (n.h / 2)];
  if (Math.abs(dy) <= n.h / 2 && dx !== 0) return [n.x + Math.sign(dx) * (n.w / 2), p[1]];
  const s = Math.min(n.w / 2 / Math.abs(dx), n.h / 2 / Math.abs(dy));
  return [n.x + dx * s, n.y + dy * s];
}

/** The middle of the overlap of two spans, or undefined if they do not meet. */
function shared(a0: number, a1: number, b0: number, b1: number, prefer: number) {
  const [lo, hi] = [Math.max(a0, b0), Math.min(a1, b1)];
  return lo < hi ? Math.min(hi, Math.max(lo, prefer)) : undefined;
}

/** A link's polyline, from its first node's edge to its second's. A link
 * with no points in between is straight: upright or level where the two
 * boxes face each other, else from centre to centre. */
export function pathOf(link: Link): Point[] {
  const [a, b] = [nodeById(link.a), nodeById(link.b)];
  const inner = link.via ?? [];
  if (inner.length) {
    return [edgeToward(a, inner[0]), ...inner, edgeToward(b, inner[inner.length - 1])];
  }
  const narrow = a.w < b.w ? a : b;
  const x = shared(a.x - a.w / 2, a.x + a.w / 2, b.x - b.w / 2, b.x + b.w / 2, narrow.x);
  if (x !== undefined) return [edgeToward(a, [x, b.y]), edgeToward(b, [x, a.y])];
  const tall = a.h < b.h ? a : b;
  const y = shared(a.y - a.h / 2, a.y + a.h / 2, b.y - b.h / 2, b.y + b.h / 2, tall.y);
  if (y !== undefined) return [edgeToward(a, [b.x, y]), edgeToward(b, [a.x, y])];
  return [edgeToward(a, [b.x, b.y]), edgeToward(b, [a.x, a.y])];
}

/** The link between two nodes, either way round, or undefined. */
export function linkOf(from: string, to: string): Link | undefined {
  return LINKS.find((l) => (l.a === from && l.b === to) || (l.a === to && l.b === from));
}

/** The route a packet takes from one node to another along their link. */
export function routeOf(from: string, to: string): Point[] {
  const link = linkOf(from, to);
  if (!link) throw new Error(`no link between ${from} and ${to}`);
  const path = pathOf(link);
  return link.a === from ? path : path.reverse();
}

/** A polyline as an SVG path. */
export const dOf = (points: Point[]) =>
  points.map(([x, y], k) => `${k ? "L" : "M"}${round(x)} ${round(y)}`).join(" ");

const round = (v: number) => Math.round(v * 10) / 10;

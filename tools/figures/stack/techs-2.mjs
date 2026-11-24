// The stack's technologies, part 2 of 2: each with every place it takes
// part (model.mjs gathers them into TECHS).
import { pt, AGENTS, ALLOYS } from "./parts.mjs";

export const TECHS_2 = [
  {
    id: "rustfs",
    name: "RustFS · the lake's storage",
    short: "RustFS",
    note: "object storage that speaks S3, on the lake server, behind its gate",
    parts: [
      pt("The lake's tables, bronze, silver and gold, as files", ["rustfs", "iceberg"]),
      pt("Loki's logs and Mimir's metrics, each in a bucket of its own", [
        "rustfs",
        "loki",
        "mimir",
        "cable:main-lake",
      ]),
      pt("The audit log's archive and the rules catalog's backups", ["rustfs", "pg", "dolt"]),
      pt("Only connections with a certificate of the installation pass its gate", [
        "gate",
        "cable:tw1-lake",
        "cable:main-lake",
      ]),
      pt(
        "A replica at another site keeps every object for 30 days, and nobody can delete it sooner",
        ["plate:replica", "rustfsr", "cable:lake-replica"],
        "optional",
      ),
    ],
  },
  {
    id: "iceberg",
    name: "Apache Iceberg · bronze, silver, gold",
    short: "Iceberg",
    note: "the lake's open table format, with its REST catalog served by RustFS",
    parts: [
      pt("Bronze: each cut as copied from its source", ["iceberg", "tw1.trino", "cable:tw1-lake"]),
      pt("Silver: the same data with the dataset's mapping applied", ["iceberg", "tw1.trino"]),
      pt("Gold: the quality results, the system of record", ["iceberg", "tw1.trino", "superset"]),
      pt("Every write is a snapshot, committed at once: a cut always gives the same results", [
        "iceberg",
      ]),
    ],
  },
  {
    id: "superset",
    name: "Apache Superset · the indicators",
    short: "Superset",
    note: "the dashboards of the quality indicators, read from gold through Trino",
    parts: [
      pt("Each dataset's dashboard, embedded in the application's own page", [
        "superset",
        "screen",
        "cable:browser",
      ]),
      pt(
        "Reads gold through Trino as the person who is looking, never the lake's files",
        ["superset", "coordinator", "tw1.trino", "cable:tw1-main"],
      ),
      pt("Signs people in at the core, with their roles from the platform's policies", [
        "superset",
        "iam",
      ]),
      pt("Its own metadata in a database of its own in PostgreSQL", ["superset", "pg"]),
    ],
  },
  {
    id: "valkey",
    name: "Valkey · Superset's cache",
    short: "Valkey",
    note: "an in-memory store, Superset's alone",
    parts: [
      pt("Keeps dashboard results for a few minutes, so many readers ask Trino once", [
        "valkey",
        "superset",
      ]),
      pt("Publishes no port: only Superset reaches it, on the module's own network", ["valkey"]),
    ],
  },
  {
    id: "grafana",
    name: "Grafana · operations and audit",
    short: "Grafana",
    note: "dashboards and alerts for whoever runs the installation, and the audit dashboards",
    parts: [
      pt("Technical logs of every service, read from Loki", ["grafana", "loki"]),
      pt("Metrics of every server and service, read from Mimir", ["grafana", "mimir"]),
      pt("The audit dashboards, read from PostgreSQL", ["grafana", "pg"]),
      pt("Opened from the application's menu; signs in at the core", [
        "grafana",
        "iam",
        "screen",
        "cable:browser",
      ]),
    ],
  },
  {
    id: "loki",
    name: "Loki · technical logs",
    short: "Loki",
    note: "the store of every service's technical logs, which carry no personal data",
    parts: [
      pt("Receives the logs Alloy collects on every server", ["loki", ...ALLOYS]),
      pt("Keeps them in the lake, in a bucket of its own", ["loki", "rustfs", "cable:main-lake"]),
    ],
  },
  {
    id: "mimir",
    name: "Mimir · metrics",
    short: "Mimir",
    note: "the store of every server's and service's metrics, compatible with Prometheus",
    parts: [
      pt("Receives the metrics Alloy collects on every server", ["mimir", ...ALLOYS]),
      pt("Keeps them in the lake, in a bucket of its own", ["mimir", "rustfs", "cable:main-lake"]),
    ],
  },
  {
    id: "alloy",
    name: "Alloy · one collector per server",
    short: "Alloy",
    note: "on every machine, it reads the services' logs and the server's metrics and sends them on",
    parts: [
      pt("One on each machine, set up when the machine joins", ALLOYS),
      pt("Pushes over HTTPS with the machine's certificate", [
        ...ALLOYS,
        "loki",
        "mimir",
        "cable:tw1-main",
        "cable:main-lake",
      ]),
      pt("On an added worker too", ["tw2.alloy"], "optional"),
    ],
  },
  {
    id: "agent",
    name: "The qd agent · updates from AWS",
    short: "qd · AWS",
    note: "installs and updates every module from signed versions, pulled from AWS; nothing comes in",
    parts: [
      pt("Reads the signed version index in S3 and checks it against the key it carries", [
        "main.agent",
        "s3",
        "kms",
        "cable:agent-aws",
      ]),
      pt("Proves who the installation is with its certificate, for one-hour credentials", [
        "main.agent",
        "rolesanywhere",
        "cable:agent-aws",
      ]),
      pt("Pulls the images by digest from ECR", ["main.agent", "ecr", "cable:agent-aws"]),
      pt("Backs up and checks the backup, applies in steps, and goes back by itself if it fails", [
        "main.agent",
        "pg",
        "dolt",
      ]),
      pt("On every machine, an agent keeps its certificate renewed", AGENTS),
    ],
  },
  {
    id: "compose",
    name: "Docker Compose · every module",
    short: "Compose",
    note: "every part runs as a container; each module ships one Compose file, run by the agent",
    parts: [
      pt("Every module's containers on the main server", ["plate:main"]),
      pt("Trino's worker, and the lake server's services", ["plate:tw1", "plate:lake"]),
      pt("Images by digest, as the signed index lists them", ["main.agent", "ecr"]),
      pt("An added worker or the replica runs the same way", ["plate:tw2", "plate:replica"], "optional"),
    ],
  },
];

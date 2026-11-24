// The stack's technologies, part 1 of 2: each with every place it takes
// part (model.mjs gathers them into TECHS).
import { pt, AGENTS } from "./parts.mjs";

export const TECHS_1 = [
  {
    id: "traefik",
    name: "Traefik · the one door",
    short: "Traefik",
    note: "the installation's only entry point, for people and for machines, and the gate in front of the lake",
    parts: [
      pt(
        "The web entry point, HTTPS on :443: the application, the guide and every module's screens, each under its own path",
        ["traefik", "cable:browser", "screen"],
      ),
      pt(
        "The internal entry point: the installation's machines and modules, each with a certificate of its CA",
        ["traefik", "cable:tw1-main", "cable:main-lake"],
      ),
      pt(
        "Forward authentication: for a module with no sign-in of its own, it asks the core for a valid session first",
        ["traefik", "api"],
      ),
      pt(
        "Routes come from the modules' manifests, written by the agent when a module is added",
        ["traefik", "main.agent"],
      ),
      pt(
        "The lake's gate: lets in only connections with a certificate of the installation",
        ["gate", "cable:tw1-lake", "cable:main-lake"],
      ),
      pt("The replica's gate, at the other site", ["rgate", "cable:lake-replica"], "optional"),
    ],
  },
  {
    id: "core",
    name: "Quality Data · the platform core",
    short: "Quality Data",
    note: "the core every module needs: its server in Rust and its web app in SolidJS",
    parts: [
      pt(
        "The web app, a single-page application in SolidJS, served as static files",
        ["web", "screen", "cable:browser"],
      ),
      pt(
        "The server, in Rust: the application's API and the internal API that modules and machines call",
        ["api"],
      ),
      pt(
        "Compiles every quality job's SQL from the rules on the catalog's main line, and signs it",
        ["api", "dolt"],
      ),
      pt("Keeps accounts, policies, settings, the audit log and the jobs' index", ["api", "pg"]),
      pt(
        "Reaches the lake through its adapter, the lake module's admin service: health, warehouses, replication",
        ["api", "gate", "rustfs", "cable:main-lake"],
      ),
      pt("Never runs a job: the orchestrator's workers send its signed SQL to Trino", ["api", "operator"]),
    ],
  },
  {
    id: "oidc",
    name: "Sign-in · OpenID Connect",
    short: "OIDC",
    note: "the core is the installation's identity provider, for people and for every module",
    parts: [
      pt(
        "People sign in once, at the core: a local account, the organisation's directory or an external provider",
        ["iam", "screen", "cable:browser"],
      ),
      pt("Superset and Grafana are its clients: the person's roles come in the tokens", [
        "iam",
        "superset",
        "grafana",
      ]),
      pt("RustFS's console, opened from the application's menu, signs in at the core too", [
        "iam",
        "rustfs",
      ]),
      pt(
        "A token per job, valid for that job alone, which Trino checks",
        ["iam", "worker1", "worker2", "coordinator", "tw1.trino", "cable:tw1-main"],
      ),
    ],
  },
  {
    id: "ca",
    name: "The installation's CA · mutual TLS",
    short: "CA · mTLS",
    note: "every server and service proves who it is with a short-lived certificate of the installation's own authority",
    parts: [
      pt("The CA, made when the installation is installed, kept as files beside the core", ["ca"]),
      pt(
        "A certificate for every machine, about a day long, renewed several times a day by its agent",
        [...AGENTS, "ca"],
      ),
      pt(
        "Both ends of every connection between machines check each other's certificate",
        ["cable:tw1-main", "cable:tw1-lake", "cable:main-lake"],
      ),
      pt("A machine added for big data joins with a one-time command", ["tw2.agent", "cable:tw2-main"], "optional"),
    ],
  },
  {
    id: "pg",
    name: "PostgreSQL",
    short: "PostgreSQL",
    note: "the platform's relational database, on the main server",
    parts: [
      pt(
        "Accounts, policies, settings, sources, datasets, schedules and the index of the results",
        ["pg", "api"],
      ),
      pt("The audit log, append-only, each entry chained to the one before", ["pg", "grafana"]),
      pt("A database and a user of its own for each module that needs one, such as Superset's", [
        "pg",
        "superset",
      ]),
      pt("Backed up, and the backup checked, before every update", ["pg", "main.agent"]),
    ],
  },
  {
    id: "dolt",
    name: "Dolt · the rules catalog",
    short: "Dolt",
    note: "a SQL database with version control built in: branches, commits and merges on tables",
    parts: [
      pt("Every rule and every dataset's mapping, with their whole history", ["dolt"]),
      pt("A draft is a branch; approving it merges it into main", ["dolt", "api", "screen"]),
      pt("Each cut records the catalog commit its SQL was compiled from", ["dolt", "api"]),
    ],
  },
  {
    id: "orchestrator",
    name: "The orchestrator and its workers",
    short: "Orchestrator",
    note: "the operator fires schedules and tracks every job; it also runs and manages the Trino coordinator",
    parts: [
      pt("The operator fires the schedules, keeps each job's state and retries with backoff", [
        "operator",
      ]),
      pt(
        "Its workers fetch the core's signed SQL, check the signature and send each statement to Trino",
        ["worker1", "worker2", "api", "coordinator"],
      ),
      pt("Runs and manages the Trino coordinator, on the main server beside it", [
        "operator",
        "coordinator",
      ]),
      pt("Before Trino restarts, it lets the running jobs finish and holds new ones", [
        "operator",
        "coordinator",
      ]),
      pt("Workers keep no state: more are added without touching the rest", ["worker1", "worker2"]),
      pt("Reports only names, counts and durations back to the core", ["worker1", "worker2", "api"]),
    ],
  },
  {
    id: "trino",
    name: "Trino · the one SQL engine",
    short: "Trino",
    note: "its coordinator runs on the main server, managed by the orchestrator; its workers run on machines of their own",
    parts: [
      pt("The coordinator plans each query and splits it into tasks", ["coordinator"]),
      pt(
        "The worker runs the tasks: it reads the sources, writes bronze and silver, evaluates the rules into gold",
        ["tw1.trino", "cable:tw1-main"],
      ),
      pt("Reads the organisation's databases, read only, with each engine's own protocol", [
        "tw1.trino",
        "tables",
        "login",
        "cable:tw1-src",
      ]),
      pt("Reads a provider's batch where it was delivered, read only, into quarantine", [
        "tw1.trino",
        "provider",
        "cable:tw1-prov",
      ]),
      pt("Reads and writes the lake through its gate: S3 for files, Iceberg REST for tables", [
        "tw1.trino",
        "gate",
        "iceberg",
        "cable:tw1-lake",
      ]),
      pt("A query too big for memory spills to the worker's own disk", ["tw1.spill"]),
      pt("Answers Superset's dashboards, reading gold as the person who is looking", [
        "superset",
        "coordinator",
        "tw1.trino",
      ]),
    ],
  },
  {
    id: "bigdata",
    name: "Big data · more Trino workers",
    short: "Big data",
    note: "when the data outgrows one worker, the installation adds Trino workers; nothing else changes",
    parts: [
      pt("One worker machine is enough to start", ["tw1.trino", "plate:tw1"]),
      pt(
        "Add a worker machine: the coordinator splits each query over every worker, each on its own part of the data",
        ["plate:tw2", "tw2.trino", "coordinator", "cable:tw2-main"],
        "optional",
      ),
      pt("Each added worker reads and writes the lake through the same gate", [
        "tw2.trino",
        "gate",
        "cable:tw2-lake",
      ], "optional"),
      pt("Each has its own spill disk, agent and Alloy", ["tw2.spill", "tw2.agent", "tw2.alloy"], "optional"),
      pt("The main server and the lake server stay as they are", ["coordinator", "gate"]),
    ],
  },
];

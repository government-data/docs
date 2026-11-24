// What each technology is, why this platform uses it, and what it needs to
// run. Re-exported by model.mjs. Every "why" stays as modest as the stack's
// own pages: what it gives the platform, not a ranking of products.
const a = (name, text, why) => ({ name, text, why });
export const ABOUT = {
  traefik: [
    a(
      "Traefik",
      "A reverse proxy: it receives connections, terminates TLS and routes each request to the service behind it by its path. It can require and check client certificates.",
      "One door for people and machines alike: routes come from each module's manifest, so a module added or removed changes its route and nothing else; it authenticates, and leaves what a person may do to the module.",
    ),
  ],
  core: [
    a(
      "Quality Data",
      "The platform's core and its package: the data quality application, plus sign-in, permissions, audit, settings and the installation's machines.",
      "Every module asks one place who a person is and what they may do, and one place writes every SQL statement a job runs.",
    ),
    a(
      "Rust and SolidJS",
      "Rust is a compiled language with memory safety checked by the compiler; SolidJS is a library for the browser that updates only what changed.",
      "Single fast binaries for the server and the agents, and a light web app served as static files.",
    ),
  ],
  oidc: [
    a(
      "OpenID Connect",
      "The standard sign-in protocol built on OAuth 2.0: an application sends the person to the provider and gets back who they are.",
      "People sign in once and enter every module with that session; machines and jobs get short-lived tokens instead of long-lived passwords.",
    ),
  ],
  ca: [
    a(
      "Mutual TLS",
      "In mutual TLS both ends of a connection show a certificate and check the other's. A certificate authority signs them.",
      "Services trust a certificate, not where a connection comes from; the installation's own CA is shared with no one, and agents renew its certificates without hands.",
    ),
  ],
  pg: [
    a(
      "PostgreSQL",
      "An open-source relational database.",
      "A well-known database for the platform's own data and the audit log, and a database of its own for each module that needs one.",
    ),
  ],
  dolt: [
    a(
      "Dolt",
      "A SQL database that versions its data like Git: branches, commits, differences and merges of rows.",
      "Rules are written like code: drafts are branches, approvals are merges, and every cut can be traced to the exact rules it ran.",
    ),
  ],
  orchestrator: [
    a(
      "The orchestrator",
      "The platform's operator of jobs, and the workers it hands them to.",
      "Running a cut is split in three roles, each doing one thing: the core writes and signs, the operator schedules and tracks, the workers send and report. It runs Trino's coordinator, so it knows when Trino may restart.",
    ),
  ],
  trino: [
    a(
      "Trino",
      "A distributed SQL query engine: a coordinator splits each query into tasks, and workers run them in parallel; connectors let it read many databases and table formats with one SQL.",
      "One engine for every job and every dashboard: it reads the organisation's databases and the lake, and it grows by adding workers.",
    ),
  ],
  bigdata: [
    a(
      "Scaling out",
      "Adding machines that share the work, rather than a bigger machine.",
      "Trino's workers keep nothing between queries, so a worker machine is added or removed without moving any data; the coordinator spreads each query over all of them.",
    ),
  ],
  rustfs: [
    a(
      "RustFS",
      "Open-source object storage, written in Rust, that speaks the S3 protocol, and serves an Iceberg REST catalog.",
      "The S3 protocol is what Trino, Loki and Mimir already speak, and its replication with object lock gives a copy nobody can erase early.",
    ),
  ],
  iceberg: [
    a(
      "Apache Iceberg",
      "An open format for analytic tables: Parquet files plus metadata that records each version of a table as a snapshot.",
      "Each cut stays the same when read later, a bad load can be undone, and the tables are open: no engine owns them.",
    ),
  ],
  superset: [
    a(
      "Apache Superset",
      "An open-source application for dashboards and data exploration.",
      "Dashboards embedded in the application's pages, read through Trino as the person looking, so each one sees only what their policy allows.",
    ),
  ],
  valkey: [
    a(
      "Valkey",
      "An open-source, in-memory key-value store that speaks the same protocol as Redis.",
      "A dashboard many people open at once asks Trino once; what it holds can be lost without harm.",
    ),
  ],
  grafana: [
    a(
      "Grafana",
      "An open-source application for dashboards and alerts over logs, metrics and SQL databases.",
      "Operations and audit in one place, apart from the quality indicators, which Superset draws.",
    ),
  ],
  loki: [
    a(
      "Grafana Loki",
      "An open-source log store that indexes a few labels and keeps the lines compressed in object storage.",
      "Its data lives in the lake, so the logs are kept and copied with it.",
    ),
  ],
  mimir: [
    a(
      "Grafana Mimir",
      "An open-source store for metrics, compatible with Prometheus, that keeps its blocks in object storage.",
      "The same storage model as Loki: its data in the lake, a client certificate required.",
    ),
  ],
  alloy: [
    a(
      "Grafana Alloy",
      "An open-source collector: on each machine it reads logs and metrics and sends them on.",
      "One collector for both logs and metrics, so nothing reaches into a machine from outside.",
    ),
  ],
  agent: [
    a(
      "qd and AWS",
      "The installation's agent, a system service on each machine; on the main server it installs and updates every module. Versions are published in AWS: S3, ECR, KMS and IAM Roles Anywhere.",
      "Installations pull: a version is trusted by the signature on its index, never by where it came from, and an installation opens no port for it.",
    ),
  ],
  compose: [
    a(
      "Docker Compose",
      "A tool that starts a set of containers from one file: their images, networks, volumes and secrets.",
      "Each module is one Compose file inside its package: added, updated and removed as a whole, its images pinned by digest.",
    ),
  ],
};

// What each needs to run, as the stack's pages say it.
export const RESOURCES = {
  traefik: [["Ports", ":443 for people; the internal entry point for machines"]],
  core: [["Needs", "PostgreSQL, Dolt and the lake"]],
  oidc: [["Needs", "the core; optionally the organisation's directory or an external provider"]],
  ca: [["Needs", "a time source on every machine: certificates last about a day"]],
  pg: [["Disk", "on the main server, with room for the backups taken before updates"]],
  dolt: [["Disk", "small: the rules and mappings with their history"]],
  orchestrator: [["Needs", "the core and Trino"]],
  trino: [["Memory", "about 13 GB for Trino on a worker machine, to start*"], ["Disk", "a spill disk of its own"]],
  bigdata: [["Each worker", "the same as the first: about 13 GB for Trino and a spill disk*"]],
  rustfs: [["Disk", "the lake server's drives: they grow with the data"]],
  iceberg: [["Needs", "RustFS, which serves its catalog"]],
  superset: [["Needs", "Trino, Valkey, and a database in PostgreSQL"]],
  valkey: [["Memory", "small: results kept a few minutes"]],
  grafana: [["Needs", "Loki, Mimir and PostgreSQL"]],
  loki: [["Disk", "in the lake, 90 days"]],
  mimir: [["Disk", "in the lake"]],
  alloy: [["Needs", "the machine's certificate"]],
  agent: [["Network", "outbound HTTPS to AWS from the main server; no inbound rule"]],
  compose: [["Needs", "Docker on every machine"]],
};

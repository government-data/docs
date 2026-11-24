---
title: Technology stack
description: Every technology Quality Data is built on, what each one does, which module brings it, and how the parts talk to each other.
sidebar:
  label: Overview
---

**For whom:** administrators and technical staff who run an installation
or review it: what runs on its servers, what each part is for, and where
its data lives. You do not need any of this to write rules or read a
dashboard.

This section describes Quality Data's architecture as it is designed. Some
parts are still being rolled out; [Implementation
status](#implementation-status), at the end of this page, says which.

## One installation, one organisation

An installation is the set of servers where one organisation runs Quality
Data. It serves that organisation alone: there is no sharing of an
installation between organisations, and no data leaves it except what the
organisation itself exports. Everything in it runs as containers on
servers the organisation controls, in its own data centre or in its own
cloud account.

## Modules

An installation is made of **modules**. A module is a set of containers
with a manifest that says what it offers to the others, what it needs from
them, where people reach it and what its data is. The core never names a
module: it reads what each one declares. Removing a module keeps its data;
only an explicit purge deletes it, after a backup.

| Module         | What it is                                                                                | Main technologies                    |
| -------------- | ----------------------------------------------------------------------------------------- | ------------------------------------ |
| `quality-data` | The core: the application, sign-in, permissions, audit, settings and the rules catalog    | Rust, Traefik, PostgreSQL, Dolt      |
| `lake-rustfs`  | The data lake, where the copied data and the quality results are kept as tables           | RustFS, Apache Iceberg               |
| `query-trino`  | The SQL engine that reads the sources and the lake and runs the quality rules             | Trino                                |
| `orchestrator` | The operator that schedules jobs, and the workers that run them                           | The orchestrator and its workers     |
| `bi-superset`  | The dashboards of the quality indicators, read from the lake                              | Apache Superset, Valkey              |
| `observability`| Operations: technical logs, metrics and the audit dashboards                              | Grafana, Loki, Mimir, Alloy          |
| `docs`         | This guide, served inside the installation                                                | A static site                        |

Modules depend on **capabilities**, not on each other: the lake module
provides the capability "lake" (the S3 protocol and the Iceberg catalog),
and the query module provides "SQL query". Another module that provides the
same capability, with the same protocols, could take its place.

## The technologies

Each page says what the technology does in Quality Data, which module
brings it, how it talks to the rest and where its data lives.

- **Platform:** the Quality Data core, and Docker Compose, which runs
  every module.
- **Edge and identity:** Traefik, the one entry point; the core's OpenID
  Connect identity provider; mutual TLS with the installation's own
  certificate authority.
- **Data:** PostgreSQL, the platform's database; Dolt, the versioned rules
  catalog; RustFS, the lake's storage; Apache Iceberg, the lake's table
  format.
- **Processing:** Trino, the one SQL engine; the orchestrator and its
  workers.
- **Indicators:** Apache Superset, with Valkey as its cache.
- **Operations:** Grafana, Loki, Mimir and Alloy.
- **Updates:** the installation's agent, `qd`; the signed version index
  and the AWS services it is published with.

## Implementation status

The current release runs part of this architecture. These parts are still
being rolled out:

- **Trino as the one engine.** Trino is replacing the engine that runs
  extraction and rules in the current release. For a while both run side
  by side on the same cuts and their results are compared; Trino takes
  over once they agree.
- **Workers apart from the orchestrator.** The orchestrator becomes the
  operator that schedules and tracks jobs; the workers that run them become
  a separate part that scales on its own.
- **Gold as the record of results.** The quality results move to the
  lake's gold tables. Until then the platform's database keeps them.
- **Apache Superset and Valkey.** The indicator dashboards in Superset are
  designed and not yet shipped; until they are, the application draws its
  own charts.

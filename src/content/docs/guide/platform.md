---
title: Government Data
description: The Government Data platform, its applications and modules, how an installation is built and kept up to date, and where each reader goes next.
sidebar:
  label: Government Data
---

**Government Data is a platform for an organisation's data**, installed on
servers the organisation controls. It brings together the applications
that measure, process and show that data, on one sign-in, one set of
permissions, one audit trail and one data lake. This guide covers the
platform and each of its applications.

## Its applications and modules

| Application or module | What it is for                                                                                          | Guide                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| **Quality Data**      | Data quality: rules written by whoever knows the data, cuts that measure it, indicators and remediation queues | [Introduction to Quality Data](../overview/)  |
| **The orchestrator**  | Schedules and tracks the platform's jobs; its workers run them                                          | [Orchestrator and workers](../stack/orchestrator/) |
| **Analytics**         | Dashboards of the indicators, with Apache Superset                                                      | [Apache Superset](../stack/superset/)         |
| **The data lake**     | Where the platform keeps its copies of the data and its results, as open tables                         | [RustFS](../stack/rustfs/), [Apache Iceberg](../stack/iceberg/) |
| **The user guide**    | These pages, served inside every installation and also published openly                                | This guide                                    |

Underneath them is the platform's **core**: sign-in for every application,
permissions, the audit trail, settings, the installation's machines and
certificates. Its package is called Quality Data, after the application it
carries.

## One installation, one organisation

An installation is the set of servers where one organisation runs
Government Data. It serves that organisation alone, and no data leaves it
except what the organisation itself exports. Each application is a
**module**: it can be added, and removed without losing its data.

Installations **pull** their updates: each installation's agent fetches
signed versions, checks the signature, backs up, and applies them. Nothing
reaches into an installation from outside.

## How it fits together

People enter every application through one door and sign in once, at the
core. The orchestrator schedules the jobs; Trino, the one SQL engine, reads
the organisation's databases and writes the lake; the dashboards read the
lake's results through Trino. The
[architecture figure](../stack/overview/#architecture) draws it on its
machines, the [simulation](../stack/simulation/) tours it one technology at
a time, and each part has a page of its own in the [Technology stack](../stack/overview/).

## Where to go next

- **Using Quality Data:** start with the [Introduction to Quality
  Data](../overview/) and its [Concepts](../concepts/).
- **Running an installation:** [Getting started:
  administrator](../start-admin/), then [Mail, sign-in and
  updates](../administer-the-installation/).
- **Reviewing the architecture:** the [Technology stack](../stack/overview/),
  one page per technology.
- **On paper:** [Download PDF](../../print/) gathers the whole guide on one
  page.

---
title: Trino
description: The one SQL engine of the platform. It reads the organisation's databases, writes the lake's bronze, silver and gold, runs the quality rules, and serves the dashboards' queries.
sidebar:
  label: Trino
---

**Module:** `query-trino`. It provides the capability "SQL query" and
needs the capability "lake".

## What it does

Trino is a distributed SQL query engine. In Government Data it is **the one
engine** that touches data:

- it **reads the sources**, the organisation's databases, read only, and
  writes each cut to the lake's **bronze** layer;
- it derives **silver** by applying the dataset's mapping;
- it **evaluates the quality rules** on silver and writes the results to
  **gold**;
- it answers the **dashboards**: [Superset](../superset/) reads gold through
  it, as the person who is looking.

Being distributed is what fits Trino to large volumes. A coordinator plans
each query and splits it into tasks, and its workers run them in parallel,
each on its own part of the data, so a large source or lake table is read
by several machines at once rather than by one. An installation that needs
more capacity adds workers. The [simulation](../simulation/) shows it in
its big-data job.

Trino never decides what to run. The [core](../core/) writes every
statement, compiled from the rules, and signs it; the
[workers](../orchestrator/) send those statements to Trino. While a rule is
being written, its examples are checked on the spot by the rule editor,
before it ever reaches Trino.

## Isolation

- **A token per job.** Each job reaches Trino with a token that the core
  issues for that job alone, which says which dataset and which kind of
  work it is. Trino's access rules, served by the core, allow that job
  only what it needs: its own dataset's tables, its own source.
- **Source passwords** travel with the job that needs them and are never
  stored by Trino.
- **Only counts come out.** A quality job reports names, counts and
  durations, never a record's values. Samples shown while testing a rule
  go through the application, which checks the person's permission and
  writes the view to the audit log.
- **People read only gold.** For dashboards, Trino offers gold read-only,
  with each person's row filters applied; bronze and silver are for jobs.
- No memory dump is ever written to disk, as it could hold records.

## How it talks to the rest

| With                        | How                                                                       |
| --------------------------- | ------------------------------------------------------------------------- |
| Workers, Superset           | Trino's client protocol over HTTPS, with a token per job or per person    |
| The organisation's databases | Each engine's own protocol (such as SQL Server, Oracle, PostgreSQL or MySQL), read only |
| The lake                    | S3 and Iceberg REST, through the lake's gate, with mutual TLS             |
| The core                    | It reads its access rules from the core                                   |

## Sizing

Most installations run Trino on **one server**, which plans and executes
the queries. Larger ones run a coordinator and several workers. Memory is
divided between quality jobs and dashboard queries, so one cannot starve
the other, and a query too big for the memory spills to a disk of its own.
Before Trino restarts for an update, the orchestrator lets the running
jobs finish and holds new ones.

## Where its data lives

Nowhere of its own: Trino keeps no data between queries. What it writes
goes to the lake; its spill disk holds temporary files only while a query
runs.

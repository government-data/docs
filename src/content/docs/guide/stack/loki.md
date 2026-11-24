---
title: Loki
description: The store of the technical logs of every service of the installation, kept in the lake for 90 days, with no personal data.
sidebar:
  label: Loki
---

**Module:** `observability`.

## What it does

Grafana Loki is an open-source store for logs. In Government Data it keeps
the **technical logs** of every service on every server of the
installation, which [Alloy](../alloy/) collects and
[Grafana](../grafana/) shows.

Technical logs say what happened inside a process, for whoever runs the
installation. Every service writes them as JSON with the same fields:
time, level, service, server, request, run and job. So one search shows
every line of one run, across all servers.

**Technical logs carry no personal data.** Values read from sources, rule
tests or findings are never logged: errors name ids and field names, not
values, and a second layer drops known sensitive fields. Who saw which
personal data is not a technical log: it is the audit log, in
[PostgreSQL](../postgresql/).

## How it talks to the rest

| With        | How                                                       |
| ----------- | --------------------------------------------------------- |
| Alloy       | Alloy pushes each server's logs to Loki                   |
| Grafana     | Grafana queries Loki, inside the observability module     |
| The lake    | Loki keeps its data in a bucket of its own, over S3       |

## Where its data lives

In the lake ([RustFS](../rustfs/)), in a bucket of its own, for **90
days**. Like everything in the lake, the replica keeps a copy. An
organisation that runs its own log system can also have Alloy forward the
logs there.

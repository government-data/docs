---
title: Alloy
description: The collector on every server of the installation, which sends the services' logs to Loki and the server's and services' metrics to Mimir, with the least access that works.
sidebar:
  label: Alloy
---

**Module:** `observability`. One runs on every server of the installation.

## What it does

Grafana Alloy is an open-source collector of logs and metrics. In
Government Data, each server runs its own Alloy, which:

- reads the logs of every service on that server and sends them to
  [Loki](../loki/);
- reads the server's own metrics, CPU, memory, load, disks, network,
  clock and boot time, and sends them to [Mimir](../mimir/);
- collects the metrics that services publish, such as Traefik's, and sends
  them to Mimir too.

The command that adds a server to the installation also sets up its Alloy,
so a new server shows in [Grafana](../grafana/) once it joins.

## The least access that works

Alloy runs in a container with no more access than it needs: it reads
only the disks it watches (Docker's, the database's, the lake's drives…),
read-only, and the server's network counters, not the rest of the server.
It keeps a short list of metrics and drops the rest, and no label carries
a path or a name that a person chose.

## How it talks to the rest

| With                        | How                                                                     |
| --------------------------- | ----------------------------------------------------------------------- |
| Loki, Mimir                 | It pushes over HTTPS with the server's certificate (see [Mutual TLS](../mtls/)) |
| The services' metrics       | It reads them with the server's certificate                             |
| The organisation's own log system | Optionally, it can also forward the logs, by syslog or OpenTelemetry |

## Where its data lives

Nowhere of its own beyond a small buffer: what it collects goes to Loki
and Mimir, in the lake.

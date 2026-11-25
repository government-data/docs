---
title: Mimir
description: The store of the metrics of every server and service of the installation, kept in the lake and read by Grafana.
sidebar:
  label: Mimir
---

**Module:** `observability`.

## What it does

Grafana Mimir is an open-source store for metrics, compatible with
Prometheus. In Government Data it keeps the **metrics** that
[Alloy](../alloy/) collects on every server, which [Grafana](../grafana/)
draws and alerts on:

- each server's CPU, memory, load, disks, network and clock;
- each service's own metrics, such as Traefik's requests, the queue of
  jobs and the live job runners.

Metrics are numbers with a few labels, such as the server, its role and
the service. They carry no data from the sources and no personal data.

## How it talks to the rest

| With     | How                                                                                   |
| -------- | ------------------------------------------------------------------------------------- |
| Alloy    | Every server's Alloy pushes its metrics, presenting the server's certificate (see [Mutual TLS](../mtls/)) |
| Grafana  | Grafana reads them; only the core's server may read                                   |
| The lake | Mimir keeps its data in a bucket of its own, over S3                                  |

## Where its data lives

In the lake ([RustFS](../rustfs/)), in a bucket of its own; the lake's
replica keeps a copy.

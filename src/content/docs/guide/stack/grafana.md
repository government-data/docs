---
title: Grafana
description: The operations application of the platform, with the technical logs, the servers' metrics and alerts, and the audit dashboards.
sidebar:
  label: Grafana
---

**Module:** `observability`, with [Loki](../loki/), [Mimir](../mimir/) and
[Alloy](../alloy/). It needs the capability "lake".

## What it does

Grafana is an open-source application for dashboards and alerts. In
Government Data it is for **operations and audit**, not for the quality
indicators, which [Superset](../superset/) draws:

- **technical logs** of every service, read from Loki, including every
  line of one run across all servers;
- **metrics** of every server and service, read from Mimir: CPU, memory,
  disks, network, the clock, the queue and the job runners;
- **alerts** when a server or a service needs attention, sent by mail;
- the **audit dashboards**: who did what, every view of personal data with
  its reason, and the runs. See [Personal data and the audit
  trail](../../personal-data-and-audit/).

The dashboards come with the installation and are updated with it.

## Who gets in

Grafana is a client of the core's sign-in: people open it from the
application's menu and enter with their own account. Their role in Grafana
comes from their policy: `auditor` reads the audit dashboards, and
`quality-admin` and the Administrators administer Grafana. Anyone else is
refused.

## How it talks to the rest

| With                       | How                                                                     |
| -------------------------- | ----------------------------------------------------------------------- |
| People                     | Its screens through [Traefik](../traefik/); sign-in at the core over OpenID Connect |
| Loki, Mimir                | Their query APIs, inside the observability module                       |
| [PostgreSQL](../postgresql/) | A read-only user, for the audit log; it never writes it               |
| Mail                       | The organisation's mail server, for alerts                              |

## Where its data lives

Grafana keeps its own settings, users and alert state in a database of its
own in PostgreSQL. The logs and metrics it shows are Loki's and Mimir's, in
the lake; the audit log is the core's.

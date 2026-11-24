---
title: Apache Superset
description: The analytics application of the platform, which draws the quality indicators from the lake's gold tables through Trino, as the person who is looking.
sidebar:
  label: Apache Superset
---

**Module:** `bi-superset`. It needs the capability "SQL query", which
[Trino](../trino/) provides.

## What it does

Apache Superset is an open-source application for dashboards and data
exploration. In Government Data it draws the **quality indicators**: each
dataset's dashboard, its charts and their evolution from cut to cut.

- The dataset's dashboard appears **inside the application's own page**,
  embedded, so people do not leave Quality Data to read it.
- People whose policy allows it can also open Superset itself, from the
  applications menu, to explore gold's tables read-only.
- The dashboards the platform ships are replaced at each update; a
  dashboard that someone builds is theirs and stays.

## Where the numbers come from

Superset **never reads the lake's files, its catalog or PostgreSQL**. It
reads gold's views through Trino, **as the person who is looking**: Trino
applies that person's row filters, so each one sees only the datasets and
groups their policy allows. In the embedded dashboard, the core issues a
short-lived guest token for that person and that dashboard.

Gold holds no record values, only counts, indicators and the values of the
grouping fields (see [Apache Iceberg](../iceberg/)).

## How it talks to the rest

| With                     | How                                                                      |
| ------------------------ | ------------------------------------------------------------------------ |
| People                   | Its screens through [Traefik](../traefik/); sign-in at the core over OpenID Connect |
| The application's pages  | Embedded, with a guest token the core issues                             |
| Trino                    | Trino's client protocol over HTTPS, on behalf of the person              |
| [Valkey](../valkey/)     | Its cache, on the module's own network                                   |

Superset's roles come from the person's permissions in the core, computed
at each sign-in, so a change of policy reaches Superset at the next one.

## Where its data lives

Superset keeps its own metadata in a database of its own in
[PostgreSQL](../postgresql/): its users, roles, charts, dashboards, saved
queries and its action log. **No indicator is stored there**: the numbers
stay in gold. Query results are cached in Valkey for a few minutes.
Removing the module keeps its database; only a purge deletes it, after a
backup.

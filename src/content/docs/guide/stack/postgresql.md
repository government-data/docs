---
title: PostgreSQL
description: The platform's relational database, where the core keeps accounts, policies, settings, the audit log and its business objects, and where modules get their own databases.
sidebar:
  label: PostgreSQL
---

**Module:** `quality-data` (the core). Other modules get a database of
their own in it.

## What it does

PostgreSQL is the platform's database. The core keeps in it:

- accounts, groups, policies and the identity providers;
- settings, and the secrets of settings, encrypted with a key kept apart;
- sources, datasets, schedules, cuts and remediation queues;
- an **index** of the quality results: the cuts, their state and their
  totals, which the application's screens and queues read. The record
  of results itself is in the lake's gold tables; if the two ever differ,
  gold wins and the index is rebuilt from it;
- the **audit log**.

Modules that need a relational database, such as Grafana or Superset, get **a database and a user of their own** when they are
added. One module cannot read another's database.

## The audit log

The audit log records who did what, when and on what: sign-ins, access
and settings changes, rule approvals, every view of personal data with its
reason, exports and runs started by hand. It is **append-only**: the
application cannot change or delete an entry, and each entry carries a
hash of the one before it, so a gap or an edit shows. It stays queryable
for five years; older months are archived to the lake. Auditors read it in
[Grafana](../grafana/).

## How it talks to the rest

| With                 | How                                                                     |
| -------------------- | ----------------------------------------------------------------------- |
| The core             | SQL over TLS; the core checks the server's certificate and name         |
| Other modules        | Each with its own user, on its own database                             |
| Grafana              | A read-only user, for the audit dashboards                              |

PostgreSQL is not reachable from outside the core's server: it publishes
no port, and only the services that use it share its network.

## Where its data lives

In a volume on the core's server. Its databases are critical: before every
update they are dumped and the dump checked, and if that cannot be done,
the update does not go ahead. Removing a module keeps its database; only a
purge deletes it, after a backup.

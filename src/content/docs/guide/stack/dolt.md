---
title: Dolt
description: The versioned database that holds the rules catalog, with drafts, approvals to main and the full history of every rule and mapping.
sidebar:
  label: Dolt
---

**Module:** `quality-data` (the core).

## What it does

Dolt is a SQL database with version control built in: branches, commits,
merges and differences, as in Git, but on tables. Quality Data keeps its
**rules catalog** in it: every rule and every dataset's mapping.

What people see in the application is Dolt's versioning:

- a **draft** is a branch of its own, where a rule is written and tested
  without counting;
- **main** is the approved line: only the rules on main are evaluated;
- **approving** a draft merges it into main, as one more commit;
- the **history** of a rule is the list of commits that touched it, with
  who made each one and when; going back or undoing is a new commit on
  top, so nothing on main is ever erased.

Every quality run records the catalog commit it was compiled from, so a
cut can always be traced to the exact rules that produced it. See [Take a
change to main](../../rules-to-main/) and [See a rule's history and undo a
change](../../rule-history/).

## How it talks to the rest

Only the core's server talks to Dolt, over Dolt's MySQL-compatible
protocol, on a network the two share with no one else. The connection uses
TLS with a client certificate of the installation (see [Mutual
TLS](../mtls/)) and a password. Dolt publishes no port.

Other parts of the platform never read the catalog: the core compiles the
rules into SQL and hands that out.

## Where its data lives

In a volume on the core's server, with its databases, users and grants.
It is critical: backed up, and the backup checked, before every update.
Besides, Dolt's own backups are copied to the lake on a schedule. Its two
passwords are generated at installation and kept as files, never in the
repository or the environment.

Dolt has a PostgreSQL-compatible version, Doltgres. It may be considered
in the future; nothing in the catalog depends on that choice.

---
title: RustFS
description: The object storage of the data lake, compatible with S3, behind a gate that requires the installation's certificate, with a replica that keeps every object for 30 days.
sidebar:
  label: RustFS
---

**Module:** `lake-rustfs`. It provides the capability "lake" to the
modules that need it: the core, Trino and observability.

## What it does

RustFS is open-source object storage, written in Rust, that speaks the
**S3** protocol. It is the storage of the installation's data lake:

- the lake's tables, in [Apache Iceberg](../iceberg/) format: the data
  copied from the sources (bronze), the data as mapped (silver) and the
  quality results (gold), with the **Iceberg REST catalog** that lists
  them;
- the technical logs and metrics that [Loki](../loki/) and
  [Mimir](../mimir/) keep;
- the audit log's archive and the rules catalog's backups.

## How it is set up

- **The main lake** is one server, or a **pool** of at least four servers
  whose drives share the data, so it keeps working when a drive or a
  server fails.
- **The replica** is a separate server. The main lake copies the
  installation's warehouse into it, where each object is kept for 30 days
  and nobody, not even an administrator, can delete it or shorten that.
  The main lake keeps old versions of objects for 7 days.
- **The gate** is a small proxy in front of RustFS that lets in only
  connections with a certificate of the installation (see [Mutual
  TLS](../mtls/)).
- **The lake admin service** of the module answers the core alone: the
  lake's health, its warehouses and their replication. The core holds no
  code of RustFS's own; another lake module could serve the same protocol.

The steps to set these up are in [Mail, sign-in and
updates](../../administer-the-installation/#to-keep-the-main-lakes-admin-keys).

## How it talks to the rest

| With                         | How                                                                              |
| ---------------------------- | -------------------------------------------------------------------------------- |
| [Trino](../trino/)           | S3 for the files and Iceberg REST for the tables, through the gate               |
| Loki and Mimir               | S3, each in its own bucket                                                       |
| The core                     | The lake admin protocol, with mutual TLS both ways                               |
| Short-lived credentials      | The S3 security token service: credentials that last minutes, narrowed to what one task needs |
| People                       | RustFS's console, opened from the application's menu, for those whose policy allows it |

## Where its data lives

On the lake servers' drives. The data is critical, and its backup is the
replica: an update of the lake goes ahead only when the replica is in sync
and every server is healthy. Removing the module keeps its data; only a
purge deletes it, after a backup.

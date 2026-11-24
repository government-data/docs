---
title: Apache Iceberg
description: The open table format of the data lake, with its REST catalog, and the three layers bronze, silver and gold, where gold holds the record of the quality results.
sidebar:
  label: Apache Iceberg
---

**Module:** `lake-rustfs` serves the catalog and stores the files;
[Trino](../trino/) reads and writes the tables.

## What it does

Apache Iceberg is an open format for large analytic tables kept as files
in object storage. A table is a set of Parquet data files plus metadata
that says which files make up each version of the table. Every write
creates a new **snapshot**, committed all at once: a reader sees the table
before the write or after it, never half of it, and can read an earlier
snapshot on purpose.

The **Iceberg REST catalog** is the service that lists the tables and
points at their current metadata. In Government Data it is served by
[RustFS](../rustfs/) itself, over HTTPS behind the lake's gate.

## The three layers

Each installation has one warehouse in the lake, with three layers:

| Layer      | Holds                                                                 | Written by                    |
| ---------- | --------------------------------------------------------------------- | ----------------------------- |
| **Bronze** | The data of each cut as copied from the source                        | Extraction jobs               |
| **Silver** | The same data with the dataset's mapping applied                      | Derivation jobs, from bronze  |
| **Gold**   | The quality results: per rule, per field, per group, the findings and the data each chart draws | Rule jobs, from silver |

- **Bronze and silver only grow.** A load adds rows under its own
  identifier; only once every statement succeeded and the counts match does
  the core record it as the cut's accepted load. Readers then read exactly
  that load, at that snapshot, so a cut always gives the same results.
- **Gold is the system of record** of the quality results. Every table
  carries the dataset, the cut and the run. A new run of a cut writes its
  rows, then switches to them in one commit, then deletes the previous
  run's rows; dashboards read views that always show one whole run.
- **No record values in gold**, except the values of the grouping fields
  the indicators are broken down by, such as an office or a region.
  Findings carry keyed hashes of the record keys, not the keys.

Bronze and silver hold copies of the source data, which may include
personal data. Nobody reads them directly: only jobs, through Trino, with
the access their token grants.

## How it talks to the rest

| With               | How                                                          |
| ------------------ | ------------------------------------------------------------ |
| Trino              | The Iceberg REST protocol for the catalog; S3 for the files  |
| Superset           | Never directly: it reads gold's views through Trino          |
| The core           | Never directly: it records what each job reports             |

## Where its data lives

In the lake, on RustFS: the data files, the metadata and the catalog.
Maintenance jobs compact small files and remove superseded loads; old
snapshots are kept, so a past cut can always be read as it was. The lake's
replica keeps a copy of everything.

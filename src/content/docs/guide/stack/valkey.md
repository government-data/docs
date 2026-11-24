---
title: Valkey
description: The in-memory store that caches Superset's query results for a few minutes; it is Superset's alone and never carries the platform's events.
sidebar:
  label: Valkey
---

**Module:** `bi-superset`, beside [Apache Superset](../superset/).

## What it does

Valkey is an open-source, in-memory key-value store, under the BSD licence,
that speaks the same protocol as Redis. In Government Data it is
**Superset's cache**:

- it keeps the results of dashboard queries for a few minutes, so a
  dashboard that many people open at once asks Trino once;
- it holds Superset's rate limits.

Valkey is not a message broker for the platform. The platform's modules
tell each other what happened through the core, never through Valkey.

## How it talks to the rest

Only Superset talks to Valkey, on the module's own network, with a password
that is generated at installation and kept as a file. Valkey publishes no
port and nothing else can reach it.

## Where its data lives

In memory, and in a volume of the module. What it holds can be lost
without harm: it is a cache, filled again from Trino. Removing the module
keeps the volume; only a purge deletes it.

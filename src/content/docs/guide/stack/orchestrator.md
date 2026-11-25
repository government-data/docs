---
title: The orchestrator and its workers
description: The operator that fires schedules and tracks every job, and the workers, apart from it, that send the core's signed SQL to Trino and report counts back.
sidebar:
  label: Orchestrator and workers
---

**Module:** `orchestrator`. It needs the capability "SQL query", which
[Trino](../trino/) provides.

## Who does what

Running a quality cut is split in three roles, each doing one thing:

| Part                       | Does                                                                                     | Never does                                 |
| -------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------ |
| **The core**               | Owns the rules and schedules, compiles and signs every statement, hands out each job's secrets, records the results | Run a job or talk to Trino     |
| **The operator**           | Fires the schedules, keeps each job's state, retries with backoff, makes sure only one job writes a table at a time | Read or change a statement, see a secret |
| **The workers**            | Take a job, fetch its signed statements, check the signature, send each statement to Trino, report counts | Write SQL, keep state, read values |

The **operator** is the orchestrator's service. The **workers** are a
deployable of their own: they keep no state, so an installation adds or
removes workers, on one server or several, without touching the rest.

The orchestrator also runs and manages [Trino](../trino/)'s
**coordinator**, on the main server beside the operator, so it knows when
Trino may restart. Trino's own workers, which do the heavy query work, run
on machines of their own.

## A cut, step by step

1. The operator fires the cut on its schedule, or when someone starts it.
2. The core compiles the statements from the rules on the catalog's main
   line, signs them, and records the bundle.
3. A worker takes the job and fetches the bundle and the job's secrets from
   the core. **A statement that is not in a verified bundle is never
   run.**
4. The worker sends each statement to Trino with the job's token, checks
   that each answer has the expected shape, and records its progress, so a
   retry resumes where it stopped.
5. The worker reports names, counts, durations and the lake's snapshot
   identifiers to the core. The cut runs as three jobs in a chain:
   extraction to bronze, derivation to silver, evaluation into gold.

If a worker stops, its job's lease runs out and another worker takes it;
the old attempt's query is cancelled first, so two attempts never write
the same cut.

## How it talks to the rest

| With        | How                                                                        |
| ----------- | -------------------------------------------------------------------------- |
| The core    | HTTPS on Traefik's internal entry point, with mutual TLS                   |
| Trino       | Trino's client protocol, with a token valid for one job                    |

Before an update, the core asks the orchestrator how much work is running
and due soon, and the update waits for it. While Trino restarts, the
operator holds the jobs that need it and lets the running ones finish.

## Where its data lives

The operator keeps the jobs' state, leases and attempts. The workers keep
nothing.

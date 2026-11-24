---
title: The platform core (Quality Data)
description: The core of Government Data, whose package is Quality Data, written in Rust with a SolidJS web app, that owns the quality objects, compiles every job and holds sign-in, permissions and audit.
sidebar:
  label: Platform core
---

**Module:** `quality-data`. Every installation has it; every other module
needs it.

## What it does

The core is the base of the Government Data platform. Its package is
called Quality Data, after the data quality application it carries, which
owns the business objects of data quality: sources, datasets and their mappings, the rules and their
history, schedules, cuts and the remediation queues. Around them it holds
what the whole platform shares:

- **sign-in** for every module (see [Identity](../identity/));
- **permissions**: one set of policies for the whole platform, which every
  module asks before it acts;
- **audit**: who did what, when and on what, including every view of
  personal data;
- **settings** shared by every module, such as the domain, mail and the
  time zone;
- **machines**: which servers belong to the installation, and their
  certificates (see [Mutual TLS](../mtls/)).

The core **writes every SQL statement** a quality job runs. When a cut is
due, it compiles the rules on the catalog's main line into statements for
[Trino](../trino/), signs the bundle and records it. It never runs a job
itself: the [orchestrator](../orchestrator/) schedules jobs, and its
workers send the signed statements to Trino.

## How it is built

- The **server** is written in Rust. It serves the application's HTTP API
  and the internal API that other modules and machines call.
- The **web app** is a single-page application written in SolidJS and
  built with Vite, served as static files by nginx.
- A **node agent**, from the same image, keeps the server's machine
  certificate renewed.

## How it talks to the rest

| With                    | How                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------- |
| People                  | HTTPS through [Traefik](../traefik/), with a session after signing in                   |
| Other modules, machines | HTTPS on Traefik's internal entry point, each side with a certificate of the installation |
| [PostgreSQL](../postgresql/) | SQL over TLS, the server's certificate checked                                   |
| [Dolt](../dolt/)        | Dolt's MySQL-compatible protocol over TLS, with a client certificate                    |
| The lake                | Through the lake module's admin service, to create the installation's warehouse         |

## Where its data lives

- **PostgreSQL**: accounts, policies, settings, the audit log, the job
  index and every business object but the rules.
- **Dolt**: the rules and the mappings, with their history.
- **Files beside the module**: the installation's certificate authority
  and the secrets the containers read, never in the database or in an
  environment variable.

All three are backed up, and the backup checked, before every update.

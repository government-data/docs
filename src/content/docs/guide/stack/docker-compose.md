---
title: Docker Compose
description: How every module of an installation runs, as containers described by one Compose file per module, started and updated by the installation's agent.
sidebar:
  label: Docker Compose
---

**Module:** all of them. Each module is a Compose project of its own.

## What it does

Every part of Government Data runs as a container. Each module ships one
Compose file that says which containers it runs, from which images, on
which networks and with which volumes. The installation's agent,
[`qd`](../agent/), runs Docker Compose with that file to start, update or
stop the module. Nobody edits these files by hand: they come inside the
module's package, which the signed version index pins.

## How it is used

- **Images by digest.** A module's Compose file names no image itself: the
  agent passes each image by its digest, as the signed index lists it, so
  the containers run exactly the bytes that were published.
- **One network per module.** Each module's containers share a network of
  their own. Only [Traefik](../traefik/) joins every module's network, so a
  module reaches another only through Traefik, never directly.
- **Containers locked down.** Where the software allows it, containers run
  as an unprivileged user, with a read-only filesystem, no Linux
  capabilities and no way to gain privileges.
- **Secrets as files.** Passwords and keys are mounted as files that only
  the container's user can read; they are never in an image, in the Compose
  file or in its environment file.
- **Health.** Each module declares which of its containers must be running
  and healthy, and the commands that prove it. An update waits for them;
  if they do not come up, it goes back to the previous version.

## Where its data lives

In Docker volumes on each server, one per piece of data, each named in the
module's manifest. A volume marked critical is backed up, and the backup
checked, before every update. Removing a module stops its containers and
keeps its volumes; only an explicit purge deletes them, after a backup.

## For the administrator

Each server needs Docker Engine with the Compose plugin. Everything else
comes with the modules: do not install the platform's components on the
host yourself.

---
title: The installation's agent (qd)
description: The program on the installation's server that installs and updates every module from signed versions, backing up first and going back by itself if an update fails.
sidebar:
  label: The agent (qd)
---

**Where it runs:** on the core's server, as a system service, outside the
containers it manages.

## What it does

`qd` is the installation's agent. It installs, configures and updates the
platform and its modules, and nothing else may change them:

- **enrol**: when the installation is set up, it makes the installation's
  own private key, which never leaves the server, and a certificate
  request. Once that request is signed, the certificate is the
  installation's identity towards the versions published in AWS (see
  [Updates from AWS](../aws/)).
- **install** the platform for the first time.
- **check** and **update**: it reads the signed version index, and when a
  new version is due for this installation, it applies it.
- **add** and **remove** modules, from their manifests.

## How an update goes

1. The agent reads the **signed index** and checks its signature with the
   public key it carries. An index that fails the check is ignored.
2. It downloads each module's package and checks its fingerprint against
   the index, and pulls the images by their digest.
3. It asks the core how much work is running or due, and waits for it,
   within the limit set under **Settings**, **Updates**.
4. It **backs up** every critical piece of data, databases, volumes and
   keys, and **checks the backup**. If a critical piece cannot be backed
   up, there is no update.
5. It applies the new version **in steps**. Before each step it writes
   down where it is, so after a power cut it resumes, and every step can
   run twice.
6. It checks each module's health. If the new version does not come up, it
   **goes back** to the previous one by itself.
7. It writes a short **report**: versions, steps, durations and errors,
   never any data of the organisation.

When updates install, with approval, automatically within a window, or by
hand on the server, is chosen in the application, as described in [Mail,
sign-in and updates](../../administer-the-installation/#to-install-updates).

## How it talks to the rest

| With        | How                                                                                     |
| ----------- | --------------------------------------------------------------------------------------- |
| AWS         | Outbound HTTPS only, with short-lived credentials from its certificate; nothing comes in |
| The core    | Traefik's internal entry point, with mutual TLS                                         |
| The modules | Docker Compose, on the same server                                                      |

## `qsdk`, the publisher's tool

`qsdk` is a separate command line, for whoever publishes versions and
manages enrolments: it signs an installation's enrolment request, revokes
an installation, and publishes a module. It **never runs on an
installation's server**.

## Where its data lives

In its own directory on the server: the installation's key and
certificate, the state of the update in progress, the packages and the
backups taken before each update.

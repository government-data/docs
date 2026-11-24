---
title: Mutual TLS and the installation's certificate authority
description: Every server and service of an installation proves who it is with a short-lived certificate from the installation's own authority, renewed without hands.
sidebar:
  label: Mutual TLS
---

**Module:** `quality-data` (the core), and every server that joins the
installation.

## What it does

Inside an installation, services do not trust each other because of where
a connection comes from. They trust a **certificate**. Each installation
has its own **certificate authority** (CA), created when it is installed,
and every server and service that talks to another presents a certificate
signed by it. Both ends check each other's certificate: this is **mutual
TLS** (mTLS).

- The CA belongs to the installation alone. It is not shared with any
  other installation, and nothing outside the installation needs to trust
  it.
- **Machine certificates are short-lived**: each lasts about a day. A
  small node agent on every server renews its certificate several times a
  day, and the services take the new one without restarting.
- A certificate names the server and its **role** (the core's server, a
  worker, a lake node, the replica…). A service accepts only the roles that
  should reach it.

## How a server joins

1. An administrator asks for a command for the new server's role, in
   **Settings**, **Execution**, **Add a machine** (see [Mail, sign-in and
   updates](../../administer-the-installation/#to-add-a-machine)). The
   command carries a join token that works **once, within an hour**.
2. Whoever supports the installation runs it on the new server. The server
   makes its own private key, which never leaves it, and asks for a
   certificate with the token.
3. The server shows as **Pending approval** and gets no work until an
   administrator approves it. From then on its node agent renews its
   certificate by itself.

**Retire** takes a server out: it gets no new certificate, so it can no
longer reach the rest.

## Where it is used

| Connection                                   | Checked                                         |
| -------------------------------------------- | ----------------------------------------------- |
| A server or module to Traefik's internal entry point | Its certificate, by the installation's CA |
| The core to [PostgreSQL](../postgresql/) and [Dolt](../dolt/) | Each side's certificate         |
| Anyone to the lake ([RustFS](../rustfs/))    | The caller's certificate, at the lake's gate    |
| Trino's coordinator to the lake and its rules | Its certificate, from a local proxy that renews without restarting Trino |

## Where its data lives

The CA's key and certificate are files beside the core's module, on the
core's server, readable only by the services that sign and check
certificates. They are critical: backed up, and the backup checked, before
every update. Each server keeps its own key and certificate in its node
agent's directory.

This certificate authority is the installation's own. The certificate an
installation uses to fetch its updates is another one, described in
[Updates from AWS](../aws/).

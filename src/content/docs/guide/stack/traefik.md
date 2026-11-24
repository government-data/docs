---
title: Traefik
description: The one entry point of an installation, for people and for machines, which routes each request to its module and checks the session or the certificate first.
sidebar:
  label: Traefik
---

**Module:** `quality-data` (the core).

## What it does

Traefik is the installation's only door. Every request, from a person's
browser or from another server of the installation, goes through it, and
it sends each one to the module that serves it. No other container is
reachable from outside its own server.

It has two entry points:

- **The web entry point**, over HTTPS, for people. It serves the
  application, the guide and every module's screens, each under its own
  path.
- **The internal entry point**, for the installation's own servers and
  modules. It accepts only connections that present a certificate signed
  by the installation's certificate authority (see [Mutual TLS](../mtls/)).

## Routes come from the modules

Each module's manifest declares its route: its path, the service and how
people sign in to it. When a module is added, the agent writes that route
for Traefik; when it is removed, the route goes. During an update, a
module's route shows a maintenance page.

Traefik **authenticates; it never authorises**. For a module that has no
sign-in of its own, such as this guide, Traefik first asks the core whether
the request comes with a valid session (forward authentication) and sends
the person to sign in if not. What a person may do inside a module is that
module's decision, by the platform's policies.

## How it talks to the rest

| With                   | How                                                                    |
| ---------------------- | ---------------------------------------------------------------------- |
| People                 | HTTPS on the web entry point; plain HTTP only redirects to HTTPS       |
| Each module            | Over that module's own network; Traefik is the only container on all of them |
| The core               | It asks the core to check sessions, and passes machines' certificates to it |
| Servers of the installation | Mutual TLS on the internal entry point                            |

## Certificates

The web entry point's certificate is either your organisation's own,
installed as a file, or one that Traefik obtains and renews by itself from
Let's Encrypt. The internal entry point uses a certificate of the
installation's own authority, renewed automatically.

## Where its data lives

Its configuration comes with the core's package and from the routes the
agent writes. A certificate obtained from Let's Encrypt is kept in a volume
that is not critical: it is obtained again if lost.

## For the administrator

- People need to reach **port 443** (HTTPS) of the server where the core
  runs. **Port 80** is needed only to redirect to HTTPS and, if you use
  Let's Encrypt, for its check.
- The internal entry point must be reachable **only from the
  installation's own servers**, never from the internet or the rest of the
  network. Whoever supports your installation tells you its port when a
  second server is added.

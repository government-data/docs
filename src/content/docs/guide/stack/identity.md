---
title: Identity and sign-in (OpenID Connect)
description: The core is the installation's identity provider, over OpenID Connect, for people and for every module; it can delegate to the company directory or an external provider.
sidebar:
  label: Identity (OpenID Connect)
---

**Module:** `quality-data` (the core).

## What it does

People sign in **once, at the core**, and enter every module with that
session. The core is an identity provider that speaks **OpenID Connect**
(OIDC), the standard sign-in protocol built on OAuth 2.0. Every module
with screens of its own, such as Grafana or Superset, is a client of it:
it sends the person to the core to sign in and gets back who they are and
what roles they have there.

The accounts are the core's. A person can sign in with:

- a **local account** and its password;
- the organisation's **directory**, over LDAP, such as Active Directory;
- an **external provider** that speaks OIDC, such as Microsoft Entra ID or
  Google, linked to an existing account.

Setting these up is described in [Mail, sign-in and
updates](../../administer-the-installation/).

## Permissions travel with the person

- A module with its own sign-in gets the person's roles in its tokens,
  computed from the platform's policies, for example whether a person is
  a viewer or an administrator in Grafana.
- When one module calls another **on behalf of a person**, the call
  carries that person: it is allowed only if both the person and the
  calling module may do it.
- Machines and services that call the core on their own get short-lived
  tokens of their own, limited to what their module declares it uses.
- A quality job gets a token that is valid for **that job only**, which
  [Trino](../trino/) checks before it runs the job's statements.

## How it talks to the rest

| With             | How                                                                         |
| ---------------- | --------------------------------------------------------------------------- |
| People           | The sign-in pages, through [Traefik](../traefik/), over HTTPS               |
| Modules          | OpenID Connect and OAuth 2.0: sign-in, tokens, and token exchange on behalf of a person |
| Directory        | LDAP, with a service account that may read it                               |
| External provider | OpenID Connect, with the client registered at the provider                 |

## Where its data lives

Accounts, groups, policies, linked providers and module clients are in the
core's database, [PostgreSQL](../postgresql/). Passwords are kept only as
salted hashes. Every sign-in and sign-out, and every change to access, is
written to the audit log.

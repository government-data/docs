---
title: Permissions
description: "Reference for every permission a policy can allow: what it lets someone do, what it can be narrowed to, and which ready-made policy holds it."
sidebar:
  order: 7.5
---

A policy is a set of allowed actions, called permissions here; the policy
editor lists them by name under **Data quality** and **Administration**. An
account with the role **Administrator** can do everything without any
policy. How policies are given, and which to give for each job, is in
[Manage users and access](../manage-access/).

The five ready-made policies, marked **built-in** in the product:
**steward** is `quality-steward`, **analyst** `quality-analyst`, **viewer**
`quality-viewer`, **auditor** `auditor`, and **admin** `quality-admin`.

## Data quality

A permission marked with a resource can be narrowed, in a policy of your
own, to one source or one dataset: `source/` followed by the source's name,
or `catalog/`, `dataset/` or `pipeline/` followed by the dataset's name,
such as `pipeline/customers`.

| Permission                     | What it lets someone do                                                                                                               | Resource   | Steward | Analyst | Viewer | Auditor | Admin |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- | ---------- | :-----: | :-----: | :----: | :-----: | :---: |
| **View sources**               | See the sources and their tables, and a table's **Records** (values masked without **View personal data**)                            | `source`   |    ✓    |    ✓    |        |    ✓    |   ✓   |
| **Manage sources**             | Add, change and remove sources, and list the lake's tables again                                                                      | `source`   |    ✓    |         |        |         |   ✓   |
| **View ETL**                   | Nothing in the product uses it yet                                                                                                    | `etl`      |    ✓    |    ✓    |        |    ✓    |   ✓   |
| **Edit ETL**                   | Nothing in the product uses it yet                                                                                                    | `etl`      |    ✓    |         |        |         |   ✓   |
| **View datasets**              | Nothing in the product uses it yet                                                                                                    | `dataset`  |    ✓    |    ✓    |        |    ✓    |   ✓   |
| **Manage datasets**            | Map a table, change a mapping's fields, discard a draft and remove a dataset; with **Approve rules and mappings**, deploy and approve | `dataset`  |    ✓    |         |        |         |   ✓   |
| **View rules**                 | Open, read and test a dataset's rules, their drafts and their history                                                                 | `catalog`  |    ✓    |    ✓    |   ✓    |    ✓    |   ✓   |
| **Edit rules**                 | Save a change to rules as a draft                                                                                                     | `catalog`  |    ✓    |         |        |         |   ✓   |
| **Approve rules and mappings** | With **Manage datasets**: deploy, approve a draft, delete a rule, restore, undo and import rules                                      | `catalog`  |    ✓    |         |        |         |   ✓   |
| **View pipelines**             | See the datasets and their cuts in the Explorer, and the schedules                                                                    | `pipeline` |    ✓    |    ✓    |   ✓    |    ✓    |   ✓   |
| **Edit pipelines**             | Set a dataset's remediation SLAs                                                                                                      | `pipeline` |    ✓    |         |        |         |   ✓   |
| **Run pipelines**              | Run a cut now                                                                                                                         | `pipeline` |    ✓    |    ✓    |        |         |   ✓   |
| **Schedule pipelines**         | Create, change and remove schedules                                                                                                   | `pipeline` |    ✓    |         |        |         |   ✓   |
| **View results**               | Open a dataset's dashboard and its remediation queues                                                                                 | `pipeline` |    ✓    |    ✓    |   ✓    |    ✓    |   ✓   |
| **Export results**             | Nothing in the product uses it yet                                                                                                    | `pipeline` |    ✓    |    ✓    |        |         |   ✓   |
| **View personal data**         | See values from sources whole, in **Test**, **Records** and the console ([Personal data](../personal-data-and-audit/))                | `pipeline` |         |    ✓    |        |         |   ✓   |
| **Query the lake with SQL**    | Open the **Lake SQL console**                                                                                                         |            |    ✓    |         |        |         |   ✓   |
| **Manage notifications**       | Nothing in the product uses it yet                                                                                                    | `pipeline` |    ✓    |         |        |         |   ✓   |

## Administration

These act on the whole installation, so they take no resource, except
**Manage secrets**, which can be narrowed to one secret with `secret/`
followed by its name. Among the ready-made policies only `quality-admin`
holds them, and `auditor` holds **View audit log**.

| Permission                        | What it lets someone do                                                                                                                                        | Auditor | Admin |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-----: | :---: |
| **Configure (mail, LDAP, OAuth)** | Set up outgoing mail, sign-in with the company directory and with an external provider ([Mail, sign-in and updates](../administer-the-installation/)) |         |   ✓   |
| **Manage users**                  | Register, edit and delete accounts, and resend activation links                                                                                                |         |   ✓   |
| **Manage groups and policies**    | Create groups and policies, and attach policies to people and groups                                                                                           |         |   ✓   |
| **Manage secrets**                | Register the connections and keys kept encrypted under **Settings**, **Secrets**                                                                               |         |   ✓   |
| **View audit log**                | Sign in to Grafana and read the audit trail ([Personal data and the audit trail](../personal-data-and-audit/#to-see-who-viewed-what))                          |    ✓    |   ✓   |
| **Manage updates**                | Install updates and choose when they install                                                                                                                   |         |   ✓   |
| **Manage machines**               | Approve, drain and retire the machines that do the heavy work, under **Settings**, **Execution**                                                               |         |   ✓   |

Some things need no permission: anyone signed in can change their own
profile and linked accounts, and create service accounts for their own
integrations, which can do at most what their owner can.

## Two to remember

- **Deploying needs two permissions.** **Approve rules and mappings** and
  **Manage datasets** together; a policy with **Edit rules** alone saves
  drafts that someone else approves ([Take a change to
  main](../rules-to-main/#who-may-do-which)).
- **Values need their own permission.** No ready-made policy but
  `quality-analyst` and `quality-admin` shows values from sources; give
  `quality-steward` and `quality-analyst` together to a steward who must
  see them.

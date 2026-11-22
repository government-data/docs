---
title: "Tasks: manage users and access"
description: How access works, the ready-made policies and which to give for each job, creating and removing accounts, groups, policies of your own and service accounts.
sidebar:
  label: Manage users and access
  order: 2.93
---

**Who does this:** an administrator: an account with the role
**Administrator**, or one whose policies allow **Manage users** (accounts)
and **Manage groups and policies** (groups, policies, and attaching them);
among the ready-made policies, `quality-admin` allows both. Everything here
is under **Settings** (the menu at the top right), **Users and access**.
The first account you create is in [Getting started:
administrator](../start-admin/); this page is the fuller account.

## How access works

- **The role.** An account is an **Administrator**, which can do everything
  without policies, or a **User**, which can do what its policies allow.
  Only an Administrator can make another account Administrator, or change
  or delete one.
- **Policies.** A policy is a set of allowed actions. A user gets the
  policies attached to the account and those of its groups, and they add
  up. A policy of your own can also deny an action; a denial always wins.
- **When it applies.** A change of policies or groups applies at once, at
  the latest within a minute; the person does not need to sign in again.

## The ready-made policies

They come with the product, are marked **built-in**, and cannot be changed
or deleted.

| Policy            | For                             | Allows                                                                                                                         | Does not allow                                                   |
| ----------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `quality-steward` | Whoever owns the rules and cuts | Every data quality action: sources, mapping, writing and approving rules, running and scheduling cuts, queue SLAs, the console | Seeing personal data: values from sources show masked            |
| `quality-analyst` | Whoever works the queues        | Seeing everything, personal data included, and running cuts                                                                    | Changing sources, rules, schedules or SLAs                       |
| `quality-viewer`  | Managers, dashboards            | Reading dashboards, cuts and rules                                                                                             | Sources and their records, personal data, changing anything      |
| `auditor`         | Internal control                | Seeing everything without personal data, and the audit trail in Grafana                                                        | Changing anything                                                |
| `quality-admin`   | Whoever runs the installation   | Everything, Settings included                                                                                                  | Changing or deleting an Administrator account, without that role |

Every permission, what it lets someone do, and which of these policies
holds it is in [Permissions](../permissions/).

## Which policy to give

| To let a colleague…                                              | Give                                                                              |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Read dashboards and indicators                                   | `quality-viewer`                                                                  |
| Read everything, with values masked, and the audit trail         | `auditor`                                                                         |
| Work a remediation queue and see failing records' values         | `quality-analyst`                                                                 |
| Connect sources, map tables, run and schedule cuts               | `quality-steward`                                                                 |
| Approve rules and mappings, and set the queues' SLAs             | `quality-steward`                                                                 |
| Write rules that someone else approves                           | A policy of your own: [Take a change to main](../rules-to-main/#who-may-do-which) |
| Do a steward's work and also see values                          | `quality-steward` and `quality-analyst` together                                  |
| Manage accounts, groups and settings without being Administrator | `quality-admin`                                                                   |

Seeing values from sources is explained in [Personal data and the audit
trail](../personal-data-and-audit/).

## To create an account

Creating accounts needs outgoing mail: the account is activated from a link
sent by e-mail ([Mail, sign-in and
updates](../administer-the-installation/#to-set-up-outgoing-mail)).

1. In **Users and access**, tab **Users**, choose **Register user**.
2. In **New user**, type the **Email**, optionally the **Name (optional)**,
   and choose the **Role**: **User** unless they will run the
   installation.
3. Choose **Create and send the link**.

**You should see** _Done: we sent … the link to activate their account (it
works for 72 hours)._ and the account listed as **Waiting for activation**.
When they choose their password it becomes **Active**. If the link was lost
or expired, choose **Resend link**: the earlier link stops working.

## To give or change policies

1. On the account's row, choose **Edit**.
2. Under **Policies attached directly**, tick or untick policies. Each
   shows what it is for.
3. Choose **Save changes**.

**You should see** _Done: the changes to … were saved._ and the policies,
and the groups the account belongs to, under **Access**. An Administrator
shows **Everything**; an account with nothing shows **Nothing**. The same
dialog changes the **Name (optional)** and the **Role**; nobody can change
their own role.

## To remove someone's access

There is no way to switch an account off and on again. Either:

- **Take its access away**, keeping the account: **Edit**, untick every
  policy, remove it from its groups, **Save changes**. It can still sign in,
  but sees nothing beyond its own account.
- **Delete it**: **Delete** on its row, then confirm **Delete the user**.
  The account goes with its sessions and linked accounts, and cannot be
  brought back; the e-mail can be registered again later.

## To give policies to several people: groups

1. In the **Groups** tab, choose **New group**.
2. Type a **Name** (lowercase letters, digits and `-`) and a
   **Description**.
3. Tick the people under **People added by hand** and the **Policies** the
   group gives.
4. If your organisation signs in through its directory, list under
   **Directory groups** the directory groups whose members join it at
   sign-in, one per line ([directory
   sign-in](../administer-the-installation/#to-let-people-sign-in-with-the-company-directory)).
5. Choose **Save**.

**You should see** _Group … saved._ Deleting a group takes from its people
what its policies gave them.

## To write a policy of your own

1. In the **Policies** tab, choose **New policy**.
2. Type a **Name** and a **Description**.
3. In **Statement 1**, keep **Effect** on **Allow** and **Resources** on
   `*` (everything), and tick the actions under **Data quality** and
   **Administration**, or **Every action**.
4. To narrow it, choose **Add statement** with **Effect** on **Deny**: a
   denial always wins. A resource such as `pipeline/customers` limits a
   dataset's actions, such as **View results** or **View personal data**,
   to the `customers` dataset.
5. Choose **Save**, then attach it to people or groups.

**You should see** _Policy … saved._ and, under **Attached to**, how many
have it. A name or statement that does not hold is refused with a short
reason, in English, naming the field.

## Tokens for integrations: service accounts

Anyone can create a token for a script or another system in the **Service
accounts** tab: **New service account**, a **Name**, optionally **Its own
policies** and **Expires on**, then **Create**. The token is shown once:
copy it then. It can do at most what its owner can, and stops working when
deleted.

## Messages you will meet

| What you see                                                     | What it means and what to do                                                   |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Creating users needs outgoing mail: …**, **Create** greyed     | Set up outgoing mail first (**Set up mail**).                                  |
| **The account for … was created, but the email did not go out.** | Check outgoing mail, then **Resend link**.                                     |
| **There is already an account with that email.**                 | That person has an account: find it in the list.                               |
| **That account is already active.**                              | No link is needed: they sign in with their password.                           |
| **You cannot change your own role.**                             | Another Administrator has to.                                                  |
| **It is the only administrator: it cannot be deleted.**          | Make another account Administrator first.                                      |
| **You cannot delete your own account.**                          | Another Administrator has to.                                                  |
| **Only an admin can do that to an admin.**                       | Only an Administrator changes or deletes an Administrator account.             |
| **The directory (LDAP) sets this account's name and role.**      | A directory account: change it in the directory.                               |
| **Only an administrator can change the settings.**               | Your policies do not allow this.                                               |
| **Check the highlighted fields.**                                | A field of **New user** is not valid, such as **Type a valid email.**: fix it. |

## Where next

- [Personal data and the audit trail](../personal-data-and-audit/): who
  sees values, and who saw them.
- [Mail, sign-in and updates](../administer-the-installation/):
  the rest of **Settings**.

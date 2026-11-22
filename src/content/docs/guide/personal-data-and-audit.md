---
title: "Tasks: personal data and the audit trail"
description: Where values from sources appear, who may see them whole, how to show them with a reason, what is recorded when someone does, how to see who viewed what and why, and what the audit trail covers today.
sidebar:
  label: Personal data and the audit trail
  order: 2.94
---

**Who does this:** an administrator decides who sees values from sources,
with the policies in [Manage users and access](../manage-access/).
Internal control, with the `auditor` policy, reads who saw them.

## Where values from sources appear

Most of Quality Data shows counts, never a record's values: the dashboard,
the queues, the mapping's sample. Values from sources appear in three
places only:

- **Records**, beside a table of a source in the Explorer: a page of the
  table as it is now in the source.
- **Test**, in the rule editor: up to 10 records of each outcome, in the
  **Result** tab.
- The **Lake SQL console**, for data stewards: the rows a query over the
  lake returns, written in SQL (Structured Query Language).

## Who may see them whole

Values always come **masked** first, for everyone: each value as `••••`
followed by its last four characters, or `••••` alone when it is four
characters or fewer. Only someone whose policies allow **View personal
data** can show them whole, and only by saying why. Among the ready-made
policies only `quality-analyst` (and `quality-admin`) allows it; an account
with the role Administrator may too. So `quality-steward`, `quality-viewer`
and `auditor` work with masked values.

| Where       | Showing whole values needs **View personal data** on…                    |
| ----------- | ------------------------------------------------------------------------ |
| **Test**    | the dataset whose rule is tested                                         |
| **Records** | every dataset that reads the table; on all datasets if none reads it yet |
| The console | every dataset                                                            |

Without the permission the screen says _values masked: seeing them whole
needs the personal data permission._ With it, it says _Values masked._ and
offers **Show values**.

## To show values whole

1. Above the masked values, choose **Show values**.
2. In **Show personal data**, choose the **Purpose**:
   - **Data quality review**
   - **Writing or testing rules**
   - **Remediation of data**
   - **A client's request**
   - **Audit or internal control**
   - **Other**
3. In **Reference (optional)**, write the ticket or case the view is for,
   such as `INC-2041` or `CASO/2026/118`: up to 32 characters, letters,
   digits and `- _ / # .`, no spaces, with at least one letter. A ticket
   that is only digits goes with its system's prefix (`T-48213`). Never
   write a name or a document number. With **Other** it is required:
   **Reference (required with Other)**.
4. Choose **Show values**.

The values show whole, and above them a line says why: _Showing values
for: Data quality review, INC-2041_, with **Change** and **Mask again**.

The reason is remembered for that **scope** in this browser tab: a source
(every page of its tables), a dataset (its rule tests) or the lake (the
console). The next page, test or query of the same scope shows whole
without asking again, and each one is still recorded with the reason.

- **Change** asks for another reason; it applies from the next page, test
  or query.
- **Mask again** forgets the reason and masks what is shown.
- Signing out, the session expiring or closing the tab forgets it too.

If the values cannot be shown (you lack the permission, the read has not
ended, or the audit or the service is unavailable), they stay masked: the
screen says _Values masked._ and why, never _Showing values for_. With a
reason remembered, **Change** opens it to try again or to give another,
and **Forget reason** forgets it.

## To let someone see values, or stop them

- **To let them:** attach `quality-analyst` to their account or to a group
  of theirs ([To give or change
  policies](../manage-access/#to-give-or-change-policies)).
- **For one dataset only:** a policy of your own that allows **View
  personal data** with the resource `pipeline/customers`. **Test** on the
  `customers` dataset then lets them show its values; **Records** only if
  no other dataset reads the same table.
- **To stop them:** take that policy away. It applies at once, at the
  latest within a minute.

## What is recorded when someone sees values

Each time someone shows values whole, Quality Data records who, when, from
which address and browser, and what they opened: a page of a source's
table, a test of a dataset's rules, or a query of the console. With it go
the **purpose**, the **reference** if one was given, the read's job, how
many **rows** it showed and the **names of the fields** it showed. A
console column whose name is not a plain name (an alias with a space, a
quote or an accent) is recorded by its position, such as `#2`. If the
record cannot be written, the values are not shown.

It never records a value, nor which records or customers a view showed.
Masked reads are not recorded as views. Each showing is recorded on its
own: a test opened again after reloading the page is recorded again.
Views from before reasons were asked have no purpose: Grafana shows them
as **Not recorded**. There is no way to export personal data from the
product.

## To see who viewed what

Quality Data has no screen of its own for the audit trail. It is read in
**Grafana**, the installation's monitoring application, where there is one;
an installation made with the installer does not include it yet, so ask
whoever supports your installation.

1. In the menu at the top right, under **Applications**, choose
   **Grafana**. It opens signed in as you if your account has `auditor`
   (to read), or `quality-admin` or the role Administrator; anyone else is
   refused.
2. Open the folder **Quality Data · Audit and operations**.
3. Choose **Personal data access**: who saw values, as views over time,
   **By person**, **By purpose**, **By resource (top 20)**, and every view,
   newest first, with its **Purpose**, **Reference**, **Rows shown** and
   **Fields shown**. Narrow it with **Who** and **Resource contains**, such as the name of a
   source, and with the time range at the top.

**Audit trail**, in the same folder, has every event, with **Event type**,
**Who** and **Resource contains**, and charts **By person**, **By action**
and **By dataset**.

## What the audit trail covers today

| Recorded                                                                          | Not recorded yet                                         |
| --------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Sign-ins that succeeded or failed, lockouts and sign-outs                         | Changes to groups, policies and service accounts         |
| Password resets, and external accounts linked or unlinked                         | Changes to outgoing mail, directory and external sign-in |
| Accounts created, edited and deleted, and activation links sent                   | Which records a view showed                              |
| Sources added, changed (a credential as changed, never its value) and removed     |                                                          |
| Rules deployed, drafts approved and discarded, mappings started, datasets removed |                                                          |
| Cuts run by hand, schedules created, changed and removed, remediation SLAs saved  |                                                          |
| Every view of whole values, with its purpose, reference, rows and fields          |                                                          |
| Every query run in the console                                                    |                                                          |

The trail cannot be exported from the product yet.

## Problems

| What you see                                                                            | What it means and what to do                                                        |
| --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **values masked: seeing them whole needs the personal data permission.**, in **Result** | Your policy does not allow **View personal data** on this dataset.                  |
| **The values are masked: …** on **Records**                                             | It is missing on at least one dataset that reads the table.                         |
| **The reference is not a ticket or case number: …**                                     | Write a ticket or case number such as `INC-2041`, with no spaces.                   |
| **With Other, write the reference of the ticket or case.**                              | **Other** needs a reference; or choose the purpose that fits.                       |
| **The audit is unavailable, so the values cannot be shown: …**                          | Nothing was shown or recorded. Try again later.                                     |
| **These values are no longer kept: read them again.**                                   | A read is kept an hour (a test, a day). Read the page, test or query again.         |
| **You may not see this source's records.**                                              | Your policy does not let you see this source.                                       |
| No **Records** beside a table                                                           | The table has gone from the source, or your policy does not let you see sources.    |
| No **Grafana** under **Applications**                                                   | The installation does not include it. Ask whoever supports your installation.       |
| Grafana refuses to sign you in                                                          | Your account has neither `auditor` nor `quality-admin`, nor is it an Administrator. |

## Where next

- [Manage users and access](../manage-access/): the policies and how to
  give them.
- [Connect a source](../connect-a-source/#to-look-at-a-tables-records)
  and [Write, change and test a rule](../write-a-rule/#to-test-a-rule): the
  screens where values appear.

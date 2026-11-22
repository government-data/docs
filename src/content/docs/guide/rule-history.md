---
title: "Tasks: see a rule's history and undo a change"
description: Read every change to a field's rules on main, see what each one changed, go back to an earlier version, undo the last change or bring back a deleted rule.
sidebar:
  label: See a rule's history and undo a change
  order: 2.7
---

**Who does this:** anyone who may see the rules reads their history. Going
back needs the right to deploy, which the `quality-steward` policy gives:
restoring and undoing are deploys of their own ([Take a change to
main](../rules-to-main/)).

## What the history keeps

Every change that reaches `main` is kept, by file: deploys, approved
drafts, deleted rules, restores and undos, and the rules that mapping the
table proposed. Nothing on `main` is ever erased; going back is one more
change on top.

Changing a rule's history does not change past cuts: each cut keeps the
results of the rules it was evaluated with. A version restored today counts
from the next cut.

## To see a field's history

1. Open the field's file in the editor (from the Explorer, or a rule's
   **Id** on the **Rules** page).
2. Choose **History**.

**You should see** **History of Email.yaml**, with **Open drafts** first
and then **Approved changes on main**, newest first. Each change shows a
short code, the account that made it, its date and time, and a line saying
what it was, such as `catalog: edit customers/Email.yaml`. Open one to see
the file before and after it, **Side by side** or **Unified**.

The global rules have a history of their own, from **◆ Global rules**. The
**⎇** beside the dataset in the Explorer opens the dataset's: its mapping's
changes and the drafts of the whole dataset.

## To go back to an earlier version

1. In the field's history, open the change whose version you want back.
2. Choose **Restore this version**. It is offered on every change but the
   newest, which is the version on `main` already.
3. Read the dialog as for a deploy: errors, warnings, which rules change,
   and the change line by line. Choose **Deploy**.

**You should see** _Version deployed to main._, and the restore at the top
of the history.

An earlier version is checked against the dataset as it is now. If it
names a field the mapping no longer has, or a named rule the global rules
no longer declare, the dialog shows the error and it cannot be deployed:
open the file, restore the rest by hand and deploy.

## To undo the last change

1. In the field's history, open the newest change.
2. Choose **Undo this change** and confirm with **Deploy**.

The file goes back to how it was before that change. Undoing the file's
very first change leaves it with no rules. Only the newest change has
**Undo this change**: to go back further, use **Restore this version** on
the change before the one you want gone.

## To bring back a deleted rule

**Delete rule** is a deploy of the file without the rule, so it is in the
field's history like any change. If it is the newest, **Undo this change**
brings the rule back; if not, **Restore this version** on the change just
before it. Other changes made since are lost with the restore, so check
the line-by-line view before you deploy.

## What is not there yet

- No view says who last changed each line of a file: open the changes one
  by one.
- History is by file: there is no history of one rule across files, nor of
  every field at once.
- Who deployed, approved, discarded or restored is also in the audit
  trail, which the `auditor` policy reads in Grafana ([Personal data and
  the audit trail](../personal-data-and-audit/#to-see-who-viewed-what)).

## Problems

| What you see                                                     | What it means and what to do                                                                    |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| No **Restore this version** or **Undo this change**              | Your policy lets you read the history, not deploy. Or the change is the newest (only **Undo**). |
| **No changes on main.**                                          | The file has never been on `main`: it is new, or only a draft has it.                           |
| **2 errors: it cannot be deployed**, in the dialog               | The version does not fit the dataset as it is now; see above.                                   |
| **The file changed on main since you opened it: open it again.** | Someone deployed this file meanwhile: close the history, reload the page and look again.        |

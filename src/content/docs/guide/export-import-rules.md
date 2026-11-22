---
title: "Tasks: export and import rules"
description: Download a dataset's rules as files, and take rules files back in, each one checked and confirmed before it reaches main.
sidebar:
  label: Export and import rules
  order: 2.8
---

**Who does this:** anyone who may see the rules exports them. Importing
deploys, so it needs the right to deploy, which the `quality-steward`
policy gives ([Take a change to main](../rules-to-main/#who-may-do-which)).

Use it to keep a copy of a dataset's rules outside Quality Data, to carry
them from one installation to another (a test one to the one in use), or
to edit many files at once in your own editor.

## To export a dataset's rules

1. In the **Explorer**, choose **▤** beside the dataset to open its
   **Rules** page.
2. Choose **⤓ Export .zip**.

**You should see** a download named like `customers-reglas-2026-11-12.zip`:
every rules file of the dataset as `main` has it, one file per field and
the global rules, `reglas_globales.yaml`, if it has them. It holds neither the mapping nor
any draft.

## To import rules

1. On the dataset's **Rules** page, choose **⤒ Import**.
2. Pick one or more `.yaml` files, or a `.zip` such as an export.
3. For each file that would change `main`, one after another, a dialog
   **Import Email.yaml (1 of 3)** shows what a deploy shows: errors,
   warnings, which rules it adds, removes or changes, and the change line
   by line. Choose **Deploy** to take it, or **Cancel** to leave it out.

**You should see** at the end _Import finished: 2 of 3 files deployed to
main._ Each file deployed is a change in its field's history, which can be
undone like any other ([See a rule's history and undo a
change](../rule-history/)). The rules count from the next cut.

What an import takes:

- **Files are taken by name.** A file goes over the dataset's file of the
  same name, inside a `.zip` too, whatever folder it is in. A name is
  letters, digits, `_` and `-`, ending in `.yaml`; anything else, `.yml`
  included, is left aside and named in a notice.
- **A new file must be a field's own or the global rules.** `WorkEmail.yaml`
  can be added if the dataset has a field `WorkEmail`; a file named after
  no field is refused.
- **Files the same as on `main` are skipped**, and a file `main` has but the
  upload lacks is left as it is: an import adds and replaces, never
  removes. To remove rules, delete them, or deploy their file without them.
- **Every file is checked against this dataset.** Rules carried from
  another dataset or installation fail where they name a field this one
  lacks: fix the file and import it again.

An import always deploys: it cannot save a draft.

## Problems

| What you see                                                                 | What it means and what to do                                                                               |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| No **⤒ Import** beside **⤓ Export .zip**                                     | Your policy does not let you deploy.                                                                       |
| **Nothing to import: the files are the same as main.**                       | Every file uploaded is already on `main` as it is.                                                         |
| **Left aside (not rules files): …**                                          | Those files were not taken: rename them to `<field>.yaml`.                                                 |
| **The uploaded file could not be read: is it a .zip or a .yaml?**            | The `.zip` is damaged, or not a `.zip`.                                                                    |
| **2 errors: it cannot be deployed**, in a file's dialog                      | **Cancel** it, fix the file, and import it again.                                                          |
| **Email.yaml: The file changed on main since you opened it: open it again.** | Someone deployed that file during the import: import it again.                                             |
| **extra.yaml: Could not save. Try again.**                                   | Usually a new file named after no field of the dataset. Check the name against the fields in the Explorer. |

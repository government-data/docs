---
title: "Tasks: share rules across fields"
description: Declare once what several fields use, write a check once and reuse it with extends, change a shared check safely, and move older rules files to one file per field.
sidebar:
  label: Share rules across fields
  order: 2.5
---

**Who does this:** a data steward, with the `quality-steward` policy. The
global rules are a rules file like any other: written, checked and taken to
`main` as in [Write, change and test a rule](../write-a-rule/). What each
section means is in [Rule language: what the dataset declares
once](../rule-language/#what-the-dataset-declares-once).

## What the global rules are for

Each dataset has one **Global rules** file, `reglas_globales.yaml`, beside
its fields' files. It declares once what several fields use, and every file
of the dataset sees it as if it declared it itself:

- **populations**, **lists**, **placeholders**, **derived** fields,
  **references** to other datasets and combination **tables**;
- **named rules**: a check written once, which a field's rule takes with
  `extends`.

It has no rules of its own: each rule stays in its field's file. A name
means one thing in the whole dataset, so a list or population declared in
the global rules is not declared again in a field's file.

## To open the global rules

In the **Explorer**, open the dataset (**◆ customers**) and choose
**◆ Global rules**, its first line. If the dataset has none yet, the editor
opens an empty one, `dataset: customers`, and saving or deploying creates
it.

## To declare a list once and use it

1. In the global rules, add the list:

   ```yaml
   dataset: customers

   lists:
     regions: [NORTH, SOUTH, EAST, WEST]
   ```

2. Deploy it (**Deploy**, then **Deploy** again to confirm).
3. In `Region.yaml`, use it:

   ```yaml
   - id: REG-01
     field: Region
     check: domain
     in: { list: regions }
     alert: The region is not one of the organisation's
   ```

Deploy the global rules first: a field's file is checked with the global
rules on `main`, so until then the editor says **There is no list named
regions** (`QR004`). The same holds for a test.

## To write a check once and reuse it

Say `customers` has two e-mail fields, `Email` and `WorkEmail`, checked the
same way.

1. In the global rules, under `named`, write the check with everything but
   `id` and `field`:

   ```yaml
   named:
     valid_email:
       check: format
       named: email
       severity: major
       alert: The e-mail address is not valid
   ```

2. Deploy the global rules.
3. In each field's file, start the rule from it with `extends`, and change
   only what differs:

   ```yaml
   - id: WEM-01
     field: WorkEmail
     extends: valid_email
     severity: minor
   ```

At the `extends` line the editor says the rule as it results, such as _As
valid_email: it applies to …; it fails when …_, and **As read** shows it
whole. A named rule needs a pattern (`check`) and cannot extend another.

## To change or remove a shared check

A change to a named rule changes every rule that extends it, from the next
cut, without touching their files. Two things to know before you deploy:

- The confirmation of the global rules lists no rules: it says **No rule
  changes what it checks: only how the file is written changes.** even when
  a named rule changed, because the rules that change are in other files.
  Nothing lists the rules that extend a named rule yet: search the dataset's
  **Rules** page (**▤**) for words of what it fails on.
- The global rules are checked alone. A named rule removed while a field
  still extends it leaves that field's file unreadable: the **Rules** page
  then names the file at the top with **… is not a named rule of the
  table's global rules**. So first change or remove the rules that extend
  it, one field's file at a time, then remove the named rule.

A **Test** of a field's file uses the global rules on `main`: test a rule
that extends the named rule right after you deploy, and if it is wrong,
undo the change from the global rules' history
([See a rule's history and undo a change](../rule-history/)).

## To move older files to one file per field

A dataset whose rules were written before files went by field may have
files that hold several fields' rules. **Split by field**, beside **Global
rules** in the Explorer, rewrites them on a draft: each rule in its field's
file, the declarations and the checks several fields share in the global
rules, and fields named as their columns.

1. Choose **Split by field**.
2. **You should see** _Draft made: review it with ⎇ beside the dataset._
3. Review and approve it as in [Take a change to
   main](../rules-to-main/#to-review-a-draft), from the **⎇** beside the
   dataset.

`main` does not change until the draft is approved, and the split is
refused unless the very same rules still run. Renaming fields changes the
mapping, so it needs the right to manage the dataset, which
`quality-steward` gives.

## Findings and refusals you will meet

| What you see                                                                                 | What it means and what to do                                                                               |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **… is not a named rule of the table's global rules** (`QR012`)                              | The name after `extends` is wrong, or the named rule is not deployed yet.                                  |
| **… is already declared by the table's global rules: …** (`QR013`)                           | A field's file declares a name the global rules declare: take it away from the field's file, or rename it. |
| **The global rules have no rules of their own: …** (`QR014`)                                 | Move the rule to its field's file.                                                                         |
| **… repeats what … already says: it is not needed** (`QR211`), a warning                     | The rule repeats a key of its named rule with the same value: remove the key.                              |
| **There is no population named …** (`QR004`), or list, table, reference                      | Declare it in the global rules and deploy them before the file that uses it.                               |
| **The rules are already split by field.**                                                    | Nothing to do.                                                                                             |
| **… has errors: fix them before splitting**                                                  | Fix the file named, deploy it, and split again.                                                            |
| **Split, the rules would not be the same: nothing was split**                                | The split would change what is checked, so it was not made. Move those rules by hand.                      |
| **Two fields would take the name …: …**, **Which field rule … of … is about cannot be told** | Fix as the message says, or move those rules by hand.                                                      |

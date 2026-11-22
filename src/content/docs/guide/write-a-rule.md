---
title: "Tasks: write, change and test a rule"
description: Find a dataset's rules, add one to a field, change or remove one, read what the editor says about it, and test it on the latest cut before it counts.
sidebar:
  label: Write, change and test a rule
  order: 2.4
---

**Who does this:** a data steward, with the `quality-steward` policy,
writes rules and takes them to `main`. Anyone whose policy lets them see the
rules (`quality-analyst`, `quality-viewer`, `auditor`) can open, read and
test them, but not save. The first time through, follow the
[tutorial](../rule-tutorial/); how a rule is written is in [Rule
language](../rule-language/) and [Rule patterns](../rule-patterns/). The
example is the `customers` dataset of [Concepts](../concepts/).

## Where a dataset's rules are

Each field has its own rules file, named as the field: the rules of `Email`
are in `Email.yaml`. What several fields share, such as a list of values or
a check written once, is in the dataset's **Global rules**
([Share rules across fields](../share-rules/)). Only the rules on `main`,
the approved version, are evaluated.

In the **Explorer**, under **Lake**, open the dataset (**◆ customers**):
each field lists its rules by id, and a field with none is marked **no
rules**. The **▤** beside the dataset opens its **Rules** page: every rule
on `main` in words, with its pattern, dimension, severity, what makes it
fail and its file.

## To find a rule

1. Choose **▤** beside the dataset.
2. Type in **Search** an id, a field or words of what fails, such as
   `e-mail`, or narrow the list with **Pattern**, **Dimension** or
   **Severity**.
3. Choose the rule's **Id**.

**You should see** the field's file in the editor, at that rule, with the
file's name in a tab above it. A file whose rules cannot be read is named
at the top of the **Rules** page, with its errors.

## To add a rule to a field

1. In the Explorer, open the dataset and choose **+** beside the field
   (**Add a rule to Email**).
2. The field's file opens (new if it had none) with a rule added at the
   end, ready to change:

   ```yaml
   - id: Email-01
     field: Email
     check: required
   ```

3. Change the pattern under `check`, add what it needs, and write an
   `alert`: the sentence whoever fixes the record reads. For example:

   ```yaml
   - id: EML-02
     field: Email
     check: format
     named: email
     alert: The e-mail address is not valid
   ```

4. Read the rule under **As read** (next section), then test it.

Nothing is saved yet: the tab shows **●** and the head says **Unsaved
changes**; **Restore** takes the file back as it was.

## To change a rule

Open it from the Explorer or the **Rules** page, change it, and test it.
Keep its `id`: results are kept by it from cut to cut, so a new id starts
the rule's history again. A rule changed today counts from the next cut;
earlier cuts stay as they were evaluated.

## What the editor tells you as you type

The file is checked as you type, without data. A mark on the line shows
where something is wrong; beside the editor, four tabs:

- **Problems:** the errors and warnings, each with its message, its code
  (such as `QR003`) and its line; choose one to go to it.
- **Style:** how the file is written. **Tidy** fixes most of it at once,
  keeping comments and values; **Ctrl+Z** undoes it.
- **As read:** each rule in words: what it applies to, when it fails, when
  it does not apply. Read it every time: it is the quickest way to catch a
  rule that does not say what you meant.
- **Result:** the last test (below).

An error blocks saving and deploying; a warning does not.

## To test a rule

1. Put the cursor on the rule, or anywhere outside a rule to test the
   whole file.
2. Choose **Test**.

It runs the text as it is, unsaved, on the dataset's latest cut, and
nothing it finds counts anywhere. It waits for a worker first, then shows
in **Result**, for each rule: **Applies**, **Fails**, **Passes**, **Does
not apply** and **Conformity**, then up to 10 records of each outcome, and
the failures grouped by the value's shape (a digit as 9, a letter as A).
Values come masked; if your policy lets you see personal data
(`quality-analyst` does, `quality-steward` does not), **Show values** shows
them whole with a purpose, and every view of whole values is recorded in
the audit trail ([To show values
whole](../personal-data-and-audit/#to-show-values-whole)). In the Explorer, the rule then shows
**✓** if it passed, or how many records failed.

A test's result is kept for a day: after that, **Result** says _This
test's result is no longer kept (results are kept for a day). Test
again._, and **Test** runs it anew.

If a rule fails on most records, read it again before it counts.

## To take it to main

With `quality-steward` the button is **Deploy**: it shows what the linter
(the checker) finds, which rules the file adds, removes or changes, and
the change line by line; choose **Deploy** again to confirm. **You should
see** _Deployed to main: the rules are under their field now._ Without the
right to approve, the button is **Save as a draft**. Both are in [Take a
change to main](../rules-to-main/). The rule counts from the next cut: run
one now with [Run and schedule cuts](../run-cuts/#to-run-a-cut-now).

## To remove a rule

1. In the Explorer, right-click the rule under its field and choose
   **Delete rule**.
2. Read the dialog (**Delete the rule EML-02**): it shows the file without
   the rule. Choose **Deploy**.

**You should see** _The rule EML-02 deleted; the field's history undoes
it._ It is a deploy like any other, so only whoever may deploy sees **Delete
rule**; [the field's history](../rule-history/) can bring it back. A rule
that a list of fields gives several of cannot be removed from the tree:
open its file and take it out there.

## Findings you will meet

| What the editor says                                                                                | What to do                                                                                                                             |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **The field … is not in the dataset**, maybe with **Did you mean …?** (`QR003`)                     | Write the field's name exactly as the Explorer shows it.                                                                               |
| **Another rule already uses the id …** (`QR009`)                                                    | An id is unique in the whole dataset: choose another.                                                                                  |
| **The parameter … is missing** (`QR006`), **The pattern … does not take the parameter …** (`QR005`) | Look up the pattern in [Rule patterns](../rule-patterns/).                                                                             |
| **There is no population named …** (`QR004`), or list, table, reference                             | Declare it in the [global rules](../share-rules/), or fix its name.                                                                    |
| **The YAML cannot be read: …** (`QR001`)                                                            | The file's layout (YAML, the format rules are written in) is broken where it says: an indent, a quote left open, a `#` inside a value. |
| **The rule has no alert: …** (`QR021`), a warning                                                   | Add an `alert`. A rule added with **+** has none until you write it.                                                                   |
| **It checks the same as …: each failure would count twice** (`QR020`)                               | Remove one of the two.                                                                                                                 |
| **The condition never holds: …** (`QR023`)                                                          | Its `when` or `population` excludes every record: check it.                                                                            |
| **This rule is about …: it goes in its own file, …** (`QR210`)                                      | Move it to the file named.                                                                                                             |
| **The file has … rules and … lines: …** (`QR100`)                                                   | Over 30 rules or 300 lines: move some to their fields' files.                                                                          |

Every code is listed in [Lint findings](../rule-files/).

## Problems

| What you see                                                            | What it means and what to do                                                                                                   |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| No **+** beside the fields, and no **Deploy** or **Save as a draft**    | Your policy lets you read the rules, not change them.                                                                          |
| **Deploy** greyed, **Fix the errors to save.**                          | An error is in **Problems**: fix it.                                                                                           |
| **Fix the errors to test.**                                             | The same, before a test.                                                                                                       |
| **This dataset has no cut extracted yet: extract one in Cuts to test.** | Run a cut first ([Run and schedule cuts](../run-cuts/#to-run-a-cut-now)).                                                      |
| The test stays on **…queued, waiting for a worker to take it…**         | No worker is free. If it lasts, tell your administrator.                                                                       |
| **The file changed on main since you opened it: open it again.**        | Someone deployed this file meanwhile. Keep a copy of your change, reload the page, and make it again on the file as it is now. |
| **EML-02 cannot be deleted from here: …**, after **Delete rule**        | The rule is not written alone in its file: open it in the editor.                                                              |

---
title: Lint findings
description: "Reference for every finding of the rule editor's checker: its code, its message as the editor shows it, what it means and how to fix it."
sidebar:
  order: 7.2
---

The rule editor checks a rules file as you type, without data: this check
is called lint, and what it finds, a **finding**. Each finding has a code
(such as `QR003`), its line, and a message in the language you use
Quality Data in. In the messages below, **…** stands for what the editor
fills in: a field, a value, a count.

- An **error** blocks saving and deploying; a **warning** does not, but
  **Deploy** lists them so you read them first.
- The editor's **Style** tab shows the style warnings (`QR200` to `QR205`)
  and `QR210`; **Problems** shows everything else.
- **Tidy**, in the **Style** tab, fixes in one edit the findings marked
  _Tidy_ below, keeping comments, order and every value; **Ctrl+Z** undoes
  it. A file is never tidied when it is saved.

How the editor shows them while you write is in [Write, change and test a
rule](../write-a-rule/#what-the-editor-tells-you-as-you-type); the keys and
patterns they name, in [Rule language](../rule-language/) and [Rule
patterns](../rule-patterns/).

## Errors

| Code    | What the editor says                                                                           | What it means and how to fix it                                                                                                                                                                                                                                                                                    |
| ------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `QR001` | **The YAML cannot be read: …**                                                                 | The file's layout breaks where it says, and nothing after that point can be read. Most often a `#` that ends a value early, a quote left open, a line that goes on the value above at its key's indent, or a `>-` on a list of names; the rest of the message says which, and whether **Tidy** fixes it            |
| `QR002` | **Expression outside the grammar (column …): …**                                               | A condition uses something the language does not have: a function outside its list, a parameter other than `:cut`, an interval not in `YEAR`, `MONTH` or `DAY`, a type `CAST` does not allow, or text left after the expression. Rewrite it with the [expressions](../rule-language/#expressions) the language has |
| `QR003` | **The field … is not in the dataset**, maybe with **Did you mean …?**                          | Write the field's name exactly as the dataset's mapping, and the Explorer, show it                                                                                                                                                                                                                                 |
| `QR004` | **There is no population named …**, or list, table, reference, derived field                   | The name is declared nowhere the file can see. Declare it in the [global rules](../share-rules/), and deploy them first, or fix the name                                                                                                                                                                           |
| `QR005` | **The pattern … does not take the parameter …**                                                | Remove the parameter, or use the pattern that takes it: each pattern's parameters are in [Rule patterns](../rule-patterns/). Also `on_empty` on `required`, which already finds empty values                                                                                                                       |
| `QR006` | **The parameter … is missing**                                                                 | The pattern needs it: add it. Such as `max_age` for `fresh`, or `dimension` for `expression`                                                                                                                                                                                                                       |
| `QR007` | **The value … of … does not fit the field's type**                                             | A value that cannot be read as the field's type, such as a text bound on a date field, or a `max_age` that is not a whole number and `days`, `months` or `years`. Fix the value, or the field's type in the mapping                                                                                                |
| `QR008` | **Not compiled yet: a table on several fields**                                                | A combination table whose `when` names several fields. Use one field in `when`                                                                                                                                                                                                                                     |
| `QR009` | **Another rule already uses the id …**                                                         | An id is unique in the whole dataset, not only in its file: choose another                                                                                                                                                                                                                                         |
| `QR010` | **The regular expression uses …, which RE2 lacks: …**                                          | Regular expressions have no backreferences and no lookaround. Rewrite it without them, or check part of the value with another rule                                                                                                                                                                                |
| `QR011` | **Example … should fail, but it gives: pass** (or pass, not apply)                             | One of the rule's `examples` does not give what it declares. The editor does not run examples today, so you will not see this finding in the product                                                                                                                                                               |
| `QR012` | **… is not a named rule of the table's global rules**                                          | An `extends` names a rule the global rules do not have. Fix the name, or deploy the global rules that declare it first                                                                                                                                                                                             |
| `QR013` | **… (…) is already declared by the table's global rules: take it away from here or rename it** | A name means one thing in the whole dataset. Remove the declaration from the field's file, or give it another name                                                                                                                                                                                                 |
| `QR014` | **The global rules have no rules of their own: each rule goes in its field's file**            | Move each rule under `rules:` to its field's file                                                                                                                                                                                                                                                                  |

## Warnings

| Code    | What the editor says                                                                                                   | What it means and how to fix it                                                                                                                                      | Tidy |
| ------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| `QR020` | **It checks the same as …: each failure would count twice**                                                            | Two rules check the same thing on the same records. Remove one of them                                                                                               | No   |
| `QR021` | **The rule has no alert: whoever fixes the record will not know what to do**                                           | Add an `alert`: the sentence whoever fixes the record reads. A rule added with **+** has none until you write it                                                     | No   |
| `QR022` | **… already has required, which counts fillers as empty**                                                              | The field has both `required` and `placeholder`; `required` already fails on fillers. Remove the `placeholder` rule                                                  | No   |
| `QR023` | **The condition never holds: the rule would apply to no record**                                                       | Its `when` or population excludes every record, such as one field equal to two values at once, or `FALSE`. Check the condition                                       | No   |
| `QR024` | **… is mapped as a number: a text pattern would read 1234.0; map the code as text**                                    | A text pattern (`format`, `length`…) on a field mapped as a number reads it with decimals and without leading zeros. Map the field as text                           | No   |
| `QR100` | **The file has … rules and … lines: split it by field group (up to 30 rules or 300 lines)**                            | Move rules to their fields' own files                                                                                                                                | No   |
| `QR101` | **The draft changes … rules: split it (up to 25)**                                                                     | A draft should change at most 25 rules, so one person can review it. The product does not show this finding today                                                    | No   |
| `QR103` | **The list … has … values: make it a catalog table**                                                                   | A list of over 50 values is hard to review in a rules file. Keep the values as a dataset of their own and check against it with a reference (`in: { reference: … }`) | No   |
| `QR206` | **The # starts a comment and the value is lost: put it in quotes ("…")**                                               | YAML reads `#` after a space as the start of a comment, so the rest of the value is lost. Put the value in quotes                                                    | Yes  |
| `QR207` | **These quotes are not closed on their line: what follows, up to the next quote, goes into the value**                 | Close the quote on the same line                                                                                                                                     | No   |
| `QR208` | **This line goes on the value above at its key's indent, and reads as a new key: indent it further or use >-**         | A long value broken over lines must indent the lines that follow, or start with `>-`                                                                                 | Yes  |
| `QR209` | **… makes … a single text, but … is a list of names with their values: take … away from here and put it on each name** | A `>-` or `\|` on a key such as `derived` or `populations` makes one text of what is a list. Put it on each name's value instead                                     | Yes  |
| `QR211` | **… repeats what … already says: it is not needed**                                                                    | A rule that `extends` a named rule writes a key with the same value the named rule gives. Remove the key                                                             | No   |

## Style

How a file is written is checked too, so that drafts show only what changed
in meaning. These are warnings.

| Code    | What the editor says                                                              | How to fix it                                                                            | Tidy |
| ------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---- |
| `QR200` | **The indentation is not two spaces a level**                                     | Indent each level two spaces more than the one above                                     | No   |
| `QR201` | **There is a tab: use spaces**                                                    | Replace the tab with spaces                                                              | Yes  |
| `QR202` | **Spaces at the end of the line**                                                 | Remove them                                                                              | Yes  |
| `QR203` | **These quotes are not needed: the value reads the same without them**            | Write the value plain (see below)                                                        | Yes  |
| `QR204` | **The line has … characters (over 120): if it is an expression, fold it with >-** | Fold a long expression with `>-`, one clause a line                                      | Yes  |
| `QR205` | **Leave exactly one blank line before each rule**                                 | Separate rules with one blank line                                                       | Yes  |
| `QR210` | **This rule is about …: it goes in its own file, …**                              | Move the rule to the file named ([A file per field](../rule-language/#a-file-per-field)) | No   |

### Quotes only where needed

A value goes plain (`check: required`, `alert: No employer`) unless, plain,
it would read as something else: a number or a date written as text
(`"0123"`, `"1900-01-01"`), `yes`, `no`, `true`, `false`, `null`; a value
that starts with a sign YAML reads (`- : [ { # & * ! | > ' " % @`, so
`":cut"` and `"- Liabilities"` keep them); one that holds `: ` or ` #`; and
inside `[…]` or `{…}`, one that holds `,` or a bracket.

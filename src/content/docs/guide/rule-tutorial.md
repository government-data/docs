---
title: "Tutorial: your first rules"
description: "Write a dataset's first rules step by step: a required field, a format, a condition, a list, dates against the cut, a rule across fields, reuse, and taking them to main."
sidebar:
  order: 6.9
---

This tutorial writes the rules of one field, then a few more, explaining
each choice as it comes. It takes about half an hour. By the end you will
know how a rule is read, why it fails, passes or does not apply, and how it
reaches `main`.

Every key used here is described in [Rule language](../rule-language/), and
every pattern in [Rule patterns](../rule-patterns/). The dataset, its fields
and its values are synthetic.

## The dataset

A dataset of customers, `clients`, whose mapping has these fields:

| Field         | Holds                                       |
| ------------- | ------------------------------------------- |
| `ClientType`  | `PERSON` or `COMPANY`                       |
| `Mobile`      | A mobile phone number                       |
| `Occupation`  | `EMPLOYEE`, `STUDENT`, `RETIRED`…           |
| `Employer`    | The employer's name, for employees          |
| `BirthDate`   | The customer's birth date                   |
| `LastUpdate`  | When the customer's data was last updated   |
| `HasIncome`   | `YES` or `NO`                               |
| `Status`      | `ACTIVE` or `CLOSED`                        |
| `ClosedOn`    | When the customer's account was closed      |
| `RepDocument` | A company's legal representative's document |

The rules check the dataset at a **cut**: the date its data was taken.
Keep that in mind; it comes back in step 6.

## Before you start

- The dataset is **mapped**: its fields are in the **Explorer**, under **Lake**.
  Mapping a table is done once, by whoever manages datasets, and it takes
  the dataset's first cut by itself, so **Test** has data to run on: see
  [Map a table into a dataset](../map-a-table/).
- If the data of that first cut could not be extracted, **Test** says the
  dataset has no cut extracted yet: take one with **Run now**, under the
  dataset's **Cuts**, as [Run and schedule cuts](../run-cuts/#to-run-a-cut-now)
  explains.
- Your **permissions**: **Edit rules** on the dataset to write rules
  (without it, the **+** beside a field does not show); **Approve rules and
  mappings** **and** **Manage datasets** to deploy to `main`. With only the first,
  you save drafts that someone else approves.

## 1. Open the field's file

Each field has its own rules file, named as the field: `Mobile.yaml`. In
the **Explorer**, **+** beside `Mobile` opens it (new if there is none) with a
rule ready to fill. A file always starts by naming its dataset:

```yaml
dataset: clients

rules:
```

## 2. A first rule: the mobile is required

```yaml
dataset: clients

rules:
  - id: MOB-01
    field: Mobile
    check: required
    alert: The client has no mobile number
```

Four keys, and each says one thing:

- `id` names the rule for good. Results are kept by it over time, so keep
  it when the rule changes.
- `field` is the field it checks.
- `check` is the **pattern**: here `required`, the field has a value.
- `alert` is what the person who fixes the record reads. Write it for them.

Nothing else is needed: `required` already has a dimension (completeness)
and a severity (blocking). Empty means no value, an empty text, or only
spaces; a filler the dataset declares, such as `UPDATE`, counts as empty
too.

Look at **As read** beside the editor: it says the rule in words. Read it
every time you write one; it is the quickest way to catch a rule that does
not say what you meant.

## 3. A second rule: the mobile has its form

```yaml
- id: MOB-02
  field: Mobile
  check: format
  pattern: \d{10}
  alert: The number does not have ten digits
```

`format` takes your own `pattern`, a regular expression that must match
the **whole** value (here, ten digits), or a `named` format Quality Data
maintains, such as `email`.

Notice what happens with an empty mobile: `MOB-01` fails, and `MOB-02`
**does not apply**. Every rule gives one of three results for a record: it
fails, it passes, or it does not apply. Patterns other than `required`
skip an empty value, so a missing mobile is counted once, by the rule that
exists for it.

## 4. Say what the rule must do: examples

```yaml
- id: MOB-02
  field: Mobile
  check: format
  pattern: \d{10}
  alert: The number does not have ten digits
  examples:
    fails: [{ Mobile: "12345" }, { Mobile: "555010123A" }]
    passes: { Mobile: "5550101234" }
    skips: { Mobile: null }
```

`examples` are records the rule must fail, pass and skip. Writing them
makes you say what the rule must do, and tells whoever reviews it the same;
the editor does not run them yet, so check the rule's behaviour with
**Test** (step 10). Write at least one of each for any rule with a
condition.

## 5. A rule with a condition: the employer of an employee

Only employees have an employer. A rule for `Employer`, in
`Employer.yaml`:

```yaml
dataset: clients

rules:
  - id: EMP-01
    field: Employer
    check: required
    when: Occupation = 'EMPLOYEE'
    severity: major
    alert: The employer is missing for an employee
    examples:
      fails: { Occupation: EMPLOYEE, Employer: "" }
      passes: { Occupation: EMPLOYEE, Employer: ACME LTD }
      skips: { Occupation: STUDENT, Employer: "" }
```

- `when` is a condition in plain SQL (Structured Query Language). Where it does not hold, the rule does
  not apply: a student without an employer is not a failure.
- `severity: major` changes the pattern's default (blocking): the record is
  usable, with reservations. Severity weights a failure in the indicators.
- Texts compare trimmed and without telling upper from lower case, so
  `'employee '` matches as well.

If many rules share a condition, such as "only people", declare it once as
a **population** in the dataset's global rules, `reglas_globales.yaml`:

```yaml
dataset: clients

populations:
  individuals: ClientType = 'PERSON'
```

Then any rule says `population: individuals`. With both `when` and
`population`, both must hold.

## 6. Dates are compared with the cut

The customer's data must have been updated within the last 13 months, in
`LastUpdate.yaml`:

```yaml
dataset: clients

rules:
  - id: UPD-01
    field: LastUpdate
    check: fresh
    max_age: 13 months
    alert: The contact data was not updated in the last year
```

"Within the last 13 months" means **before the cut**, never before today.
A cut measured again next year gives the same result. When you need the
cut in an expression, write `:cut`; as a bound alone, quote it:

```yaml
- id: BIR-01
  field: BirthDate
  check: range
  min: "1900-01-01"
  max: ":cut"
  alert: The birth date is not plausible
```

## 7. Allowed values: a list

The occupations that come with an income, declared once in the global
rules:

```yaml
lists:
  income_occupations: [EMPLOYEE, SELF-EMPLOYED, RETIRED]
```

and checked in `Occupation.yaml`:

```yaml
- id: OCC-01
  field: Occupation
  check: domain
  in: { list: income_occupations }
  when: HasIncome = 'YES'
  alert: The occupation does not generate income
```

A short list can go inline (`in: [EMPLOYEE, RETIRED]`). Over 50 values,
lint asks you to make it a catalog table (`QR103`).

## 8. A rule across fields

Some checks are about two fields together. `implies` says: when one
condition holds, another holds too.

```yaml
- id: END-01
  field: ClosedOn
  check: implies
  if: Status = 'CLOSED'
  then: not is_empty(ClosedOn)
  alert: A closed account needs the date it was closed
```

`implies` skips nothing: its conditions decide what an empty value means,
so say it with `is_empty(x)`. **As read** marks the rule as cross-field,
because it reads more than its own field.

## 9. Write a check once, use it in many fields

Several fields hold documents with the same form. Write the check once as
a **named rule** in the global rules:

```yaml
named:
  valid_document:
    check: format
    pattern: \d{5,12}
    severity: major
    alert: The document has 5 to 12 digits
```

and start each field's rule from it with `extends`, changing only what
differs:

```yaml
- id: REPDOC-01
  field: RepDocument
  extends: valid_document
  when: ClientType = 'COMPANY'
```

A change to `valid_document` changes every rule that extends it, at the
next cut. Before you change or remove one, read [Share rules across
fields](../share-rules/#to-change-or-remove-a-shared-check).

## 10. Test, then take it to main

Fix what lint marks, choose **Test** to run the file on the latest cut, and
read the counts: if a rule fails on half the dataset, read it again. Then
choose **Deploy**, or **Save as a draft** if you may not approve. How each
step goes, and what it can refuse, is in [Write, change and test a
rule](../write-a-rule/#to-test-a-rule) and [Take a change to
main](../rules-to-main/). The rules on `main` are the ones the next cut is
evaluated with.

## Common mistakes

| You wrote                                | What happens                    | Write instead                           |
| ---------------------------------------- | ------------------------------- | --------------------------------------- |
| `required` and `on_empty: fail` together | Lint error: it does not apply   | `required` alone                        |
| A date compared with today               | Not possible                    | `:cut`                                  |
| `max: :cut` unquoted                     | YAML reads it as something else | `max: ":cut"`                           |
| A new `id` after changing a rule         | Its history starts again        | Keep the `id`                           |
| A rule in another field's file           | Lint warning `QR210`            | Move it to its field's file             |
| No `alert`                               | Lint warning                    | A sentence for whoever fixes the record |

## Next

- [Rule language](../rule-language/): every key, expressions and their
  functions, and what Quality Data decides for every rule.
- [Rule patterns](../rule-patterns/): the fourteen patterns, one by one.
- [Lint findings](../rule-files/): every message of the editor's checker.
- The Tasks pages, from [Write, change and test a rule](../write-a-rule/)
  to [Export and import rules](../export-import-rules/): sharing rules,
  drafts, history.

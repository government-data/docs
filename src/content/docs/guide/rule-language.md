---
title: Rule language
description: "Reference for how a rule is written: its keys, where rules files live, what a dataset declares once, the expressions and what Quality Data decides for every rule."
sidebar:
  order: 7
---

A rule applies a **pattern** to a field. Most rules need no logic at all:
the pattern and its parameters say everything. Rules are written in YAML,
a plain-text format, with English keys, in the rule editor or in any text editor; the editor
completes keys and values and says what each one is for.

This page is the language itself. The fourteen patterns, one by one, are
in [Rule patterns](../rule-patterns/); every message the editor's checker
gives, in [Lint findings](../rule-files/). Writing, testing and deploying a
rule in the product is in [Write, change and test a
rule](../write-a-rule/).

New to rules? Start with the [tutorial](../rule-tutorial/): it writes a
few rules step by step.

All examples use synthetic fields and values.

## What the language is for

Data quality rules often live in code: a few developers write them, and
the text that explains each one can drift from what it does. The rule
language exists so that:

- **whoever knows the data writes the rules.** A data steward, not a
  developer: most rules are a pattern and two or three parameters, with no
  logic to get wrong;
- **a rule says what it checks, not how.** `check: required` with
  `when: Occupation = 'EMPLOYEE'` is the whole rule; Quality Data writes
  the query and the explanation in words;
- **every rule can be reviewed.** A rule is a few lines of text in a
  versioned catalog: a change is a draft, someone approves it, and the
  history keeps who changed what;
- **a rule means one thing.** The query that evaluates it and its
  explanation in words come from the same reading of the rule, so what
  **As read** says is what runs;
- **results are comparable over time.** Rules compare dates with the cut,
  never with today, and keep their `id`: measuring a cut again gives the
  same result, and a rule's history follows it;
- **a rule cannot do harm.** The language only reads the dataset's own
  record and the references it declares: no other table, no writes, no
  function outside a closed list.

## How it relates to SQL

If you know SQL (Structured Query Language), you already know most of it. Conditions (`when`, `if`,
`then`, `fails`, a population, a derived field) are written as the
condition of a SQL `WHERE`, with the same operators: `=`, `<>`, `AND`,
`OR`, `NOT`, `IN (…)`, `BETWEEN`, `LIKE`, `IS NULL`, `CASE WHEN`,
arithmetic and `CAST`.

What differs:

| In SQL you would…                                | In a rule                                                                                                                      |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Write a query: `SELECT … FROM … WHERE …`         | Write only the condition. A rule looks at **one record** of its dataset; Quality Data runs every rule of a dataset in one pass |
| Write the check itself                           | Name a **pattern** (`required`, `format`, `range`…) and its parameters; `expression` is there for what no pattern covers       |
| `JOIN` another table                             | Declare a **reference** once and use `in: { reference: … }` or `in_reference(x, 'ref.Column')`                                 |
| Use `CURRENT_DATE`                               | Use `:cut`, the date the data was taken                                                                                        |
| Get `NULL` as "unknown"                          | Get three results: **fails**, **passes**, **does not apply** (`NULL` means the rule does not apply to the record)              |
| Treat `''` and `'  '` as values                  | They are **empty**, as `NULL` is; so is a value of only spaces, the no-break space included                                    |
| Compare `'abc' = 'ABC '` as different            | They are equal: texts compare trimmed and case-insensitive (`case: exact` changes it per rule)                                 |
| Match a regular expression anywhere in the value | It matches the **whole** value, and is RE2, Google's dialect (no backreferences, no lookaround)                                |
| Spell a function as your database does           | Use the language's function (`is_empty`, `regexp_like`, `days_since`…), which Quality Data writes in the SQL it runs           |
| Write subqueries, other functions, other tables  | Not possible: the grammar is closed, and lint says where an expression leaves it (`QR002`)                                     |

So a rule is not SQL you run: it is a description Quality Data turns into
SQL. **As read**, beside the editor, shows each rule in words and, folded
under **SQL per engine**, the SQL it becomes; you never write it by hand.

## A first rule

```yaml
dataset: clients

rules:
  - id: EMP-01
    field: Employer
    check: required
    when: Occupation = 'EMPLOYEE'
    population: individuals
    severity: major
    cause: capture
    alert: The employer is missing for an employee
    examples:
      fails: { Occupation: EMPLOYEE, Employer: "" }
      passes: { Occupation: EMPLOYEE, Employer: ACME LTD }
      skips: { Occupation: STUDENT, Employer: "" }
```

A rules file names its `dataset` (as the dataset's mapping calls it) and
lists its `rules`. Each rule is one check, on one field.

## The keys of every rule

| Key          | What it says                                                                                                          |
| ------------ | --------------------------------------------------------------------------------------------------------------------- |
| `id`         | Unique in the dataset. It is how results are kept over time: keep it when a rule changes. Required                    |
| `field`      | The field it checks, or a list of fields (one rule per field). Optional for `combination`, `implies` and `expression` |
| `check`      | The pattern: one of the fourteen of [Rule patterns](../rule-patterns/). Required, unless the rule `extends` one       |
| `when`       | The rule applies only where this condition holds                                                                      |
| `population` | The rule applies only to this population, declared by the dataset                                                     |
| `severity`   | `blocking`, `major` or `minor`. By default, the pattern's                                                             |
| `cause`      | `capture` (fixed by whoever records the data) or `systemic` (fixed once, at the source)                               |
| `alert`      | What the person who fixes the record reads. Lint warns when it is missing                                             |
| `on_empty`   | `fail` counts an empty value as a failure; by default it is skipped (see below)                                       |
| `case`       | `exact` compares texts as written; by default case and outer spaces do not count                                      |
| `examples`   | Records the rule must fail (`fails`), pass (`passes`) and not apply to (`skips`), kept with the rule                  |
| `for_each`   | Repeats the rule for each value: `{ n: ["1", "2"] }` with `Phone{n}`                                                  |
| `extends`    | A named rule of the dataset's global rules this one starts from ([Share rules](../share-rules/))                      |
| `origin`     | Where an imported rule comes from: `{ process: OLD-FLOW, node: "#12" }`                                               |
| `note`       | Free text for whoever maintains the rule; nobody else sees it                                                         |

Each pattern adds its own parameters (`min`, `pattern`, `in`…). A parameter
the pattern does not take is an error with its place (`QR005`), so nothing
written is silently ignored.

When both `when` and `population` are given, both must hold.

### Severity, dimension and weight

The **dimension** comes from the pattern (completeness for `required`,
validity for `format`…; the table in [Rule patterns](../rule-patterns/));
only `expression` declares its own. The **severity** has a default per
pattern and can be changed per rule; it weights a failure in the data reliability index (ICD)
([Formulas](../formulas/)):

| Severity   | Means                    | Weight |
| ---------- | ------------------------ | -----: |
| `blocking` | The data is unusable     |    1.0 |
| `major`    | Usable with reservations |    0.6 |
| `minor`    | A matter of form         |    0.3 |

A rule that reads one field counts in that field's own conformity, the ICD's
**C** component. A rule that reads more than one field, counting the fields
of its `when` and its population, counts in the consistency between fields,
**S**, of each field it reads.

### One rule over several fields

```yaml
# One result per field: ids REP-01.RepName, REP-01.RepDocument…
- id: REP-01
  field: [RepName, RepDocument, RepPhone]
  check: required
  population: companies
  alert: The legal representative's data is incomplete

# One result per value: ids REF-01.1 and REF-01.2.
- id: REF-01
  field: RefEmail{n}
  for_each: { n: ["1", "2"] }
  check: format
  named: email
  alert: Reference e-mail {n} is not an e-mail address
```

`{n}` is replaced everywhere in the rule, the alert included.

### Examples

`examples` holds records the rule must fail, pass and skip (not apply to).
Each is a map of field to value, or a list of them; `null` is no value.
Writing them makes you say what the rule must do, and tells whoever reviews
the rule the same. The product's editor checks that they are well written,
but does not run them yet: to see how a rule behaves on data, use **Test**
([Write, change and test a rule](../write-a-rule/#to-test-a-rule)).

```yaml
examples:
  fails: [{ Mobile: "12345" }, { Mobile: "4001234567" }]
  passes: { Mobile: "3001234567" }
  skips: { Mobile: null }
```

## Where rules are written

### A file per field

A dataset's rules are in its catalog, one file per field, beside the
dataset's global rules:

```text
clients/
  reglas_globales.yaml   the dataset's global rules
  Employer.yaml          the rules of the field Employer
  Mobile.yaml            the rules of the field Mobile
  age.yaml               the rules of the derived field age
```

- A field's file is named exactly as the field in the dataset's mapping,
  `<field>.yaml`, and holds that field's rules.
- A rule belongs to the field in its `field:`. A rule over several fields
  belongs to the first one; one with no field, to the first field it reads.
- What several fields compute together is better written as a derived
  field in the global rules, with its rules in the derived field's own
  file.
- A rule in another field's file gets a warning that names the file it
  belongs to (`QR210`).
- A file holds up to 30 rules or 300 lines (`QR100`), and a list up to 50
  values (`QR103`); a field's rules rarely come near either.

Older datasets may still keep several fields in one file: **Split by
field** moves them to this layout ([Share rules across
fields](../share-rules/#to-move-older-files-to-one-file-per-field)).

### The dataset's global rules

`reglas_globales.yaml` declares once what the dataset's files share: the
sections of the next part, and **named rules** (`named`), which a field's
rule starts from with `extends`. It has no `rules:` of its own (`QR014`),
no field may be called `reglas_globales`, and a name it declares is not
declared again in a field's file (`QR013`). How to use it, and what to
check before changing a named rule: [Share rules across
fields](../share-rules/).

## What the dataset declares once

These sections sit beside `rules:`. In a dataset split by field, they live
in the dataset's global rules, `reglas_globales.yaml`, and every file of the
dataset sees them ([The dataset's global rules](#the-datasets-global-rules)).

```yaml
dataset: clients

populations:
  individuals: ClientType = 'PERSON'
  companies: ClientType = 'COMPANY'

lists:
  income_occupations: [EMPLOYEE, SELF-EMPLOYED, RETIRED]

placeholders:
  text: [UPDATE, NO DATA]
  number: ["-1"]
  date: ["1900-01-01"]
  email: ["noemail@*", "none@*"]

derived:
  age: years_between(BirthDate, :cut)
  days_since_update: days_between(LastUpdate, :cut)

references:
  advisors: { dataset: advisors, key: AdvisorCode }
  active_advisors:
    dataset: advisors
    key: AdvisorCode
    where: Status = 'ACTIVE'

tables:
  occupation_activity:
    when: Occupation
    then: ActivityCode
    rows:
      - { when: RETIRED, allowed: ["1000"] }
      - { when: "*", forbidden: ["1000"] }
```

| Section        | What it holds                                                                                                                       |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `populations`  | Named conditions a rule applies to with `population:`                                                                               |
| `lists`        | Named lists of values, for `domain` (`in: { list: name }`) and `in_list(x, 'name')`. Over 50 values, lint asks for a catalog table  |
| `placeholders` | Fillers that mean "no value", by type: `text`, `number`, `date`, and `email` (with `*` for any text). Declared once, never per rule |
| `derived`      | Fields computed with an expression, against the cut; a rule checks them as any field                                                |
| `references`   | Another dataset looked up by its `key`, at the same cut's date; `where` keeps only some of its records (its fields, as written)     |
| `tables`       | Tables of allowed or forbidden combinations, for `combination` ([Rule patterns](../rule-patterns/#combination))                     |
| `named`        | Rules with everything but `id` and `field`, which a field's rule `extends`. Only in the global rules                                |

The `email` fillers apply to fields the mapping types as e-mail, together
with the `text` ones.

## Expressions

`when`, `if`, `then`, `fails`, the bounds of `range`, the parts of `sum`,
`populations`, `derived` and a reference's `where` are expressions in
standard SQL, from a closed grammar:

- comparisons and logic: `=`, `<>`, `<`, `<=`, `>`, `>=`, `AND`, `OR`,
  `NOT`, `IN (…)`, `BETWEEN`, `LIKE`, `IS NULL`, `CASE WHEN … THEN … END`,
  arithmetic, `CAST`;
- intervals: `INTERVAL 18 YEAR`, `MONTH` or `DAY`;
- the cut: `:cut`, the only parameter;
- functions:

| Function                        | Gives                                                                                   |
| ------------------------------- | --------------------------------------------------------------------------------------- |
| `is_empty(x)`                   | `x` has no value, is empty or only spaces                                               |
| `regexp_like(x, 'pattern')`     | `x` matches the regular expression, anchored to the whole value                         |
| `in_list(x, 'name')`            | `x` is in a list the dataset declares                                                   |
| `in_reference(x, 'ref.Column')` | `x` is in a reference's column                                                          |
| `days_since(x)`                 | The days from the date `x` to the cut                                                   |
| `days_between(a, b)`            | The days between two dates                                                              |
| `years_between(a, b)`           | The whole years between two dates                                                       |
| `upper`, `lower`, `trim`        | The text in upper or lower case, or without its outer spaces                            |
| `length`, `abs`, `round(x, n)`  | A text's length; a number's absolute value; `x` rounded to `n` decimals (0 if left out) |
| `coalesce(a, b, …)`             | The first of its arguments that has a value                                             |

Nothing else: no subqueries, no other functions, nothing outside the
dataset. An expression outside the grammar is a lint error (`QR002`) that
says where and why.

A long expression is folded with `>-`, one clause a line:

```yaml
derived:
  total_income: >-
    CASE
    WHEN ClientType = 'PERSON'
    THEN Salary + OtherIncome
    ELSE SalesIncome
    END
```

## What Quality Data decides for every rule

These are fixed: no rule can change them, except where it says so.

- **Empty** is no value (`NULL`), an empty text, or only spaces, the
  invisible no-break space (U+00A0) counted as a space.
- **Empty values are `required`'s job.** `required` fails on them;
  `empty` fails on filled values; the other patterns skip a record whose
  checked field is empty (it "does not apply"), so a missing value is not
  counted twice. Each pattern's section in [Rule patterns](../rule-patterns/)
  says which fields it skips on, and whether `on_empty: fail` can change it.
  `implies` and `expression` skip nothing: they see empty values as their
  conditions say, so write `is_empty(x)` where it matters.
- **Placeholders count as empty for `required`**, which says so as its
  reason; `placeholder` finds them.
- **Text** is compared trimmed and without telling upper from lower case;
  accents count. `case: exact` compares as written.
- **Regular expressions** match the whole value, never a part of it:
  `3\d{9}` does not match inside a longer number. They are written in the
  common syntax known as RE2: no backreferences, no lookaround (`QR010`).
- **Dates** are compared with the cut (`:cut`), never with the day the rule
  runs: a cut gives the same result when it is measured again.
- **Codes** keep their leading zeros when the mapping types them as text;
  lint warns about a text pattern on a field mapped as a number.
- **The result** of a rule for a record has three values: it **fails**, it
  **passes**, or it **does not apply** (outside its population or
  condition, an empty value it skips, or any other missing value, such as a
  derived field that cannot be computed).

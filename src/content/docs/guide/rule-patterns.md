---
title: Rule patterns
description: "Reference for the fourteen patterns of the rule language: what each checks, its parameters, its dimension and default severity, how it treats empty values, and an example."
sidebar:
  order: 7.1
---

A pattern is a way of validating. The list is closed: fourteen patterns,
each with its parameters. What none of them covers is written as an
`expression` and reviewed; if it repeats, it becomes a pattern or a named
format of Quality Data.

Every pattern also takes the keys every rule has (`when`, `population`,
`severity`, `cause`, `alert`, `examples`…), described in
[Rule language](../rule-language/#the-keys-of-every-rule). A parameter a
pattern does not take is a lint error (`QR005`); one it needs and lacks is
another (`QR006`).

| Pattern                       | Fails when                                     | Dimension    | Default severity |
| ----------------------------- | ---------------------------------------------- | ------------ | ---------------- |
| [`required`](#required)       | The value is empty or a placeholder            | Completeness | Blocking         |
| [`empty`](#empty)             | The value is filled when it must not be        | Consistency  | Major            |
| [`placeholder`](#placeholder) | The value is a filler                          | Accuracy     | Major            |
| [`length`](#length)           | The length is not allowed                      | Validity     | Major            |
| [`format`](#format)           | The value does not have its form               | Validity     | Major            |
| [`domain`](#domain)           | The value is not in its list or reference      | Validity     | Major            |
| [`range`](#range)             | The value is outside its bounds                | Accuracy     | Major            |
| [`fresh`](#fresh)             | A date is older than its validity              | Timeliness   | Major            |
| [`sum`](#sum)                 | A total differs from its parts                 | Consistency  | Major            |
| [`unique`](#unique)           | The value repeats across records               | Uniqueness   | Minor            |
| [`combination`](#combination) | A combination of fields is not allowed         | Consistency  | Major            |
| [`implies`](#implies)         | A condition holds and its consequence does not | Consistency  | Major            |
| [`differs`](#differs)         | Two fields hold the same value                 | Consistency  | Minor            |
| [`expression`](#expression)   | A free condition holds                         | Its own      | Major            |

**Empty values.** What counts as empty, and why the other patterns leave
empty values to `required`, is in [Rule language: what Quality Data decides
for every rule](../rule-language/#what-quality-data-decides-for-every-rule).
Each section below says which fields a pattern skips on when they are
empty, and whether `on_empty: fail` counts them instead.

## required

The field has a value. Fails when it is empty, or holds one of the
dataset's placeholders for its type (the reason then says "placeholder").

- **Parameters**: none.
- **Empty values**: they are what it finds. `on_empty` does not apply.

```yaml
- id: EMP-01
  field: Employer
  check: required
  when: Occupation = 'EMPLOYEE'
  alert: The employer is missing for an employee
```

Lint warns when a field has both `required` and `placeholder` (`QR022`):
`required` already counts the fillers.

## empty

The field has no value where it must not have one. Fails when it is filled.

- **Parameters**: none.
- **Empty values**: an empty value passes. A placeholder counts as filled.
  `on_empty` does not apply.

```yaml
- id: EMP-02
  field: Employer
  check: empty
  when: Occupation = 'STUDENT'
  alert: A student has an employer
```

## placeholder

The value is not a filler, such as `UPDATE` or `1900-01-01`.

- **Parameters**: `values`, the fillers to find; by default the dataset's
  `placeholders` for the field's type. A `*` stands for any text
  (`noemail@*`).
- **Empty values**: skipped; `on_empty: fail` counts them.

```yaml
- id: CITY-03
  field: City
  check: placeholder
  values: [UPDATE, NO CITY]
  alert: The city holds a filler
```

## length

The value's length, without its outer spaces, is allowed.

- **Parameters**: `in`, a list of allowed lengths; `min`, `max`, the bounds
  (both included). At least one of them.
- **Empty values**: skipped; `on_empty: fail` counts them.

```yaml
- id: MOB-02
  field: Mobile
  check: length
  in: [10]
  alert: A mobile number has 10 digits
```

## format

The value, without its outer spaces, has its form.

- **Parameters**: `pattern`, a regular expression, or `named`, a format
  maintained by Quality Data; one of the two, never both. The expression
  must match the **whole** value (it is anchored), and is RE2, Google's dialect: no
  backreferences, no lookaround (`QR010`).
- **Empty values**: skipped; `on_empty: fail` counts them.

| `named`             | Accepts                                                           |
| ------------------- | ----------------------------------------------------------------- |
| `email`             | An e-mail address: a local part, `@`, and a domain with a dot     |
| `person_name`       | Letters (accents included), words joined by one space, `'` or `-` |
| `not_only_symbols`  | At least one letter or digit                                      |
| `capitalized`       | Starts with an upper-case letter                                  |
| `normalized_spaces` | No doubled spaces between words                                   |

Three more named formats, for Colombian data, are in an [optional
module](../sector-colombia-finance/#formats-for-colombian-data).

```yaml
- id: EML-02
  field: Email
  check: format
  named: email
  alert: Not an e-mail address

- id: DOC-02
  field: Document
  check: format
  pattern: \d{5,12}
  alert: The document has 5 to 12 digits
```

A regular expression is written plain, as above: YAML, the format rules are written in, keeps its `\`.
It goes in single quotes only when it starts with a sign YAML reads, such
as `[` (`pattern: '[A-Z]{3}\d{3}'`).

## domain

The value is in (or not in) a set of values.

- **Parameters**: `in`, the allowed values, or `not_in`, the forbidden
  ones; one of the two. Either is a list of values, `{ list: name }` (a
  list the dataset declares) or `{ reference: name.Column }` (a column of a
  reference the dataset declares). Values compare trimmed and
  case-insensitive, unless `case: exact`.
- **Empty values**: skipped; `on_empty: fail` counts them.

```yaml
- id: OCC-01
  field: Occupation
  check: domain
  in: { list: income_occupations }
  when: HasIncome = 'YES'
  alert: The occupation does not generate income

- id: ADV-01
  field: AdvisorCode
  check: domain
  in: { reference: active_advisors.AdvisorCode }
  alert: The advisor is not an active one
```

A list of more than 50 values gets a warning (`QR103`): make it a
catalog table.

## range

The value is within its bounds.

- **Parameters**: `min`, `max`, at least one; each a number, a date
  (`"2000-01-01"`), another field, `":cut"` or an expression. Bounds are
  included; `min_exclusive: true` or `max_exclusive: true` leaves them out.
  A bound on another field makes the rule cross-field.
- **Empty values**: skipped; `on_empty: fail` counts them.

```yaml
- id: AGE-01
  field: age
  check: range
  min: 0
  max: 110
  alert: The age is not plausible

- id: ISS-01
  field: IssueDate
  check: range
  min: BirthDate + INTERVAL 18 YEAR
  max: ":cut"
  alert: The document was issued before 18 or after the cut

- id: EXP-01
  field: Expenses
  check: range
  max: 1.5 * TotalIncome
  max_exclusive: true
  alert: Expenses far above income: confirm with the client
```

## fresh

A date is recent enough, against the cut.

- **Parameters**: `max_age`, how old the date may be: a whole number and
  `days`, `months` or `years` (`13 months`, `1 year`). Fails when the date
  is before the cut minus `max_age`.
- **Empty values**: skipped; `on_empty: fail` counts them.

```yaml
- id: UPD-01
  field: LastUpdate
  check: fresh
  max_age: 13 months
  alert: The contact data was not updated in the last year
```

## sum

A total equals its parts.

- **Parameters**: `parts`, a list of fields or expressions, each with its
  sign (`"- Liabilities"`, in quotes because it starts with `-`);
  `tolerance`, the difference allowed (by default 0). Fails when the
  field minus the sum of its parts is, in absolute value, over the
  tolerance.
- **Empty values**: skipped when the total is empty; `on_empty: fail`
  counts it. A part with no value leaves the record out (it does not
  apply).

```yaml
- id: EQ-01
  field: Equity
  check: sum
  parts: [Assets, "- Liabilities"]
  tolerance: 1
  alert: Equity is not assets minus liabilities
```

## unique

The value does not repeat across records.

- **Parameters**: `key`, the field or fields that must not repeat together
  (by default the rule's field); `normalize: true`, compare letters and
  digits only, in upper case; `ignore`, values that may repeat. Values
  compare trimmed and case-insensitive.
- **Empty values**: skipped when the rule's field is empty;
  `on_empty: fail` counts it. Placeholders are not skipped: list them in
  `ignore` if they may repeat.

```yaml
- id: MAIL-02
  field: Email
  check: unique
  normalize: true
  ignore: [UPDATE]
  alert: The e-mail is shared with another client
```

## combination

Two fields form an allowed combination, from a table the dataset declares.

- **Parameters**: `table`, the name of a table under `tables:`. `field` is
  not needed: it is the table's `then`.
- **The table**: `when`, the field each row starts from; `then`, the field
  whose values the rows allow or forbid; `rows`, each with `when` (a
  value, a list, or `"*"` for every value no other row names) and
  `allowed` or `forbidden`. One `when` field for now; a table on several
  is not compiled yet (`QR008`).
- **Empty values**: skipped when either field is empty. `on_empty` does
  not apply.

```yaml
tables:
  occupation_activity:
    when: Occupation
    then: ActivityCode
    rows:
      - { when: RETIRED, allowed: ["1000"] }
      - { when: [HOMEMAKER, STUDENT], allowed: ["2000"] }
      - { when: "*", forbidden: ["1000", "2000"] }

rules:
  - id: OCC-02
    check: combination
    table: occupation_activity
    alert: The activity code does not fit the occupation
```

The last row is the other direction of each pair, in the same table. A
record fails once, whichever row it breaks, and the finding says the row.

## implies

When one condition holds, another holds too.

- **Parameters**: `if` and `then`, two conditions; `both_ways: true` makes
  it an equivalence (the `then` also implies the `if`). `field` is
  optional.
- **Empty values**: nothing is skipped; the conditions say what an empty
  value means. `on_empty` does not apply.

```yaml
- id: END-01
  field: ClosedOn
  check: implies
  if: Status = 'CLOSED'
  then: not is_empty(ClosedOn)
  both_ways: true
  alert: A closed account needs a closing date, and only closed ones have one
```

## differs

Two fields do not hold the same value.

- **Parameters**: `from`, the other field; `normalize: true`, compare
  letters and digits only, in upper case. Values compare trimmed and
  case-insensitive, unless `case: exact`.
- **Empty values**: skipped when either field is empty; `on_empty: fail`
  counts it.

```yaml
- id: REL-01
  field: RelativeDocument
  check: differs
  from: Document
  normalize: true
  alert: The relative's document is the client's own
```

## expression

A free condition, for the rare case no pattern covers. Each one is reviewed.

- **Parameters**: `fails`, the condition under which the rule fails (an
  [expression](../rule-language/#expressions)); `dimension`, required,
  since there is no pattern to take it from: `completeness`,
  `consistency`, `accuracy`, `validity`, `timeliness` or `uniqueness`.
  `field` is optional.
- **Empty values**: nothing is skipped. Say what an empty value means in
  the condition, or in a population that leaves it out. `on_empty` does
  not apply.

```yaml
- id: EQ-02
  field: Equity
  check: expression
  fails: Equity < 0
  dimension: accuracy
  severity: minor
  alert: Negative equity
```

---
title: Assumptions and limits
description: What the method assumes, which parameters are fixed, and what the indicators do not measure.
sidebar:
  order: 11
---

Every figure Quality Data shows rests on a few assumptions. Knowing them
tells you how far a figure can be trusted and what it cannot say.

## What the method assumes

- **The rules are the requirements.** An indicator is only as good as the
  rules behind it. A rule that is too strict makes good data look bad; a
  missing rule leaves an error unseen. The rules proposed when a table is
  mapped (`required`, `unique`, `format` from a sample) are a first
  version for the people who know the data to review, not a verdict.
- **The cut is the moment measured.** Every date is compared with the
  cut's date, never with today. A figure says how the data was on that
  date: to see a fix, evaluate a new cut.
- **What a rule does not apply to is left out.** A rule that applies to few
  records gives a conformity that swings a lot from one cut to the next:
  read its count before reading its rate.
- **The mapping says what matters.** Field priorities, the entity key, the
  update date and the fields that go out of date are set when the table is
  mapped, mostly from the columns' names. They weight every indicator, and
  today they cannot be changed from a screen: if one is wrong, ask
  whoever supports your installation. See [Map a table into a
  dataset](../map-a-table/).

## Fixed parameters

These values are the same for every dataset, and no setting changes them
today:

| Parameter                                             | Value                                              |
| ----------------------------------------------------- | -------------------------------------------------- |
| Severity weights                                      | Blocking 1.0, major 0.6, minor 0.3                 |
| Component weights of the data reliability index (ICD) | Conformity 0.40, consistency 0.15, timeliness 0.15 |
| Field priority weights                                | Critical 4, high 3, medium 2, low 1                |
| Timeliness                                            | Loses half its value per year without an update    |
| Band limits                                           | Good from 0.90, poor below 0.75                    |
| Outlier limit                                         | A robust z beyond 3.5 either way                   |
| Population stability index (PSI) readings             | Stable below 0.10, significant drift above 0.25    |

What can be set is each remediation queue's service level agreement
(SLA), the days allowed to fix its findings: 30 days unless whoever may edit the dataset sets another.

## What the indicators do not measure

- **Whether a value is true.** Without an external source to compare with,
  accuracy is approximated by plausibility (`range`, `placeholder`): a
  believable wrong value passes.
- **The age of data without an update date.** Timeliness needs a field
  holding the update date and applies only to fields marked as going out
  of date. Without them, an old value counts as a current one.
- **Why a record fails.** A rule may declare a `cause` (capture or
  systemic), but no indicator or queue uses it yet: queues are split by
  group, not by cause.
- **An entity across datasets.** The ICD of a customer is computed within
  one dataset. The same customer in two datasets has two separate scores.
- **Whether an outlier is an error.** The outliers chart finds amounts
  unusual for their group; telling a probable error from a legitimate
  value is left to the person who reviews it.
- **How long a finding has been open.** Findings are not yet carried from
  one cut to the next: every open finding counts from the cut shown, so
  **Overdue** and **Resolved at this cut** read 0.
- **Trends on the first cut.** Band movements, groups that changed, and the
  PSI compare with the previous evaluated cut, so on the first cut they
  have nothing to show.

How each figure is calculated is in [Formulas](../formulas/); how to read
it, in [From results to indicators](../indicators/).

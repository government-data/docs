---
title: Quality Data
description: What Quality Data, the data quality application of Government Data, is, why it exists, who uses it, its parts, and where each reader goes next.
sidebar:
  label: Introduction
  order: 1
---

**Quality Data measures the quality of an organisation's data.** It reads
the tables of the databases the organisation already runs, checks every
record against rules written by the people who know the data, and turns the
results into indicators people can follow and into queues of data to fix.
It only reads: the data is fixed where it lives, and the next cut
shows the fix. It is one of the applications of the [Government
Data](../platform/) platform.

## Why it exists

Most organisations know their data has errors, but not how many, where, or
whether it is getting better. Quality Data changes that:

| Without it                                                               | With Quality Data                                                                                                |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Checks are scattered across capture screens, reports and spreadsheets    | Every check is a rule in one catalog, a few lines of text that whoever knows the data can write, read and review |
| A check alerts on some records, and nobody sees the whole picture        | Every rule runs on every record of a table, and the results add up to indicators                                 |
| Quality is measured by hand, now and then, in a way nobody can repeat    | Cuts run on a schedule; dates are compared with the cut's date, so measuring a cut again gives the same result   |
| What a check does drifts away from what its description says             | Each rule is explained in words from the same definition that runs it                                            |
| A rule changes and nobody knows who changed it, or why the figures moved | A rule counts only once it is approved, and its history keeps who changed what and when                          |
| Errors are fixed in the order someone happens to notice them             | Failures are grouped into remediation queues per office, region or channel, each with an SLA in days             |

## Who it is for

Each person gets what they need through the policies an administrator gives
them. The product ships with ready-made policies for the usual roles:

| Role                                         | What they do in Quality Data                                                                                                              | Policy                                                                      |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Data steward: writes rules, reads indicators | Connects sources, maps tables into datasets, writes, tests and approves rules, runs and schedules cuts, sets the queues' SLAs             | `quality-steward`                                                           |
| Analyst: works a remediation queue           | Reads which groups have the most open findings and their priority, and gets the failing records fixed in the source system                | `quality-analyst`                                                           |
| Manager or compliance reader                 | Reads the dashboards and indicators, never a record's values                                                                              | `quality-viewer`, or `auditor`, which also reads the audit trail in Grafana |
| Administrator                                | Installs the product and keeps it running: user accounts, groups and policies, sign-in, mail and updates, under **Settings** | The **Administrator** role                                                  |

Values read from a source come masked. Whoever's policies let them see
personal data may show them whole, saying why, and every view of them is
recorded in the audit trail with its reason.

## The parts

- **Explorer**, in the side bar: the sources and their tables, the datasets
  made from them with their **Cuts**, **Schedules** and **Dashboard**, and
  the **Lake**, where the product keeps its copies of the data.
- **Sources**: the databases Quality Data reads, with their credentials
  stored sealed.
- **Rules** and the rule editor: write a rule, see it said in words (**As
  read**), **Test** it on real data, and take it to the approved version
  directly or through a draft that someone approves.
- **Cuts** and **Schedules**: take a dataset's data at a date and measure
  it, now or on a schedule.
- **Dashboard**: one per dataset, with its indicators, its charts and its
  **Remediation queues**.
- **Lake SQL console**: read-only queries over the product's copies of the
  data, in Structured Query Language (SQL), for stewards.
- **Settings**: accounts, groups, policies, sign-in through a company
  directory or an external provider, mail and updates.

Indicators that only make sense in one regulated sector are an optional
part of the product; this part of the guide describes Quality Data as it
applies to any organisation, and an [optional module](../sector-colombia-finance/) at its
end covers regulated financial entities in Colombia.

## Where to go next

- **Everyone:** read [Concepts](../concepts/) first. It walks the chain from
  a source to a remediation queue with one example, and defines the words
  the rest of the guide uses.
- **Administrators:** [Getting started: administrator](../start-admin/)
  installs the product and gives a colleague an account and a policy.
- **Data stewards:** [Getting started: data steward](../start-steward/)
  connects a source, maps a table and measures a first rule; then the
  [tutorial](../rule-tutorial/), [Rule language](../rule-language/),
  [Rule patterns](../rule-patterns/) and [Lint findings](../rule-files/).
- **Analysts working a queue:** [Getting started: analyst](../start-analyst/)
  finds a group's queue and says what to do with it today.
- **Managers and compliance readers:**
  [Getting started: indicators](../start-reader/) opens a dashboard and
  reads its first indicators; then [Reading the dashboard](../charts/),
  [From results to indicators](../indicators/) and [Formulas](../formulas/), with
  an example of each chart drawn with made-up data.
- **Looking something up:** the Tasks pages say how each thing is done and
  who does it; the Reference pages, every key, pattern, finding, formula,
  chart and permission. Every underlined term shows its meaning when you
  point at it, tap it or reach it with the keyboard.
- **On paper:** [Download PDF](../../print/) gathers the whole guide on one
  page, to print it or save it as a PDF.

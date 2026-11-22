---
title: How the charts are built
description: The same charts for any dataset, from one results model and the roles of its fields.
sidebar:
  order: 0
---

The charts in this section use customers as their example, but none of them
belongs to customers. Each is a query over a **results model** that every
evaluation writes the same way, for any dataset: customers, orders,
products, suppliers. Under each chart, **Query** says which part of that
model feeds it, and **Needs** what a dataset must have for the chart to
appear.

## The results model

| Part                | One row per                                            | What it holds                                                                |
| ------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------- |
| Cut summary         | Dataset and cut                                        | Overall data quality index (IGCD), records, entities, bands                  |
| Rule results        | Dataset, cut and rule                                  | Applies, failures, conformity                                                |
| Field quality       | Dataset, cut and field                                 | Mean data reliability index (ICD), empties, distinct values, commonest shape |
| Entity ICD          | Dataset, cut and entity                                | ICD, band, segment                                                           |
| Group figures       | Dataset, cut, grouping field and group                 | Records, records with a serious failure, mean ICD                            |
| Distribution checks | Dataset, cut and variable                              | Population stability index (PSI) by deciles, outliers by group               |
| Queue findings      | Dataset, cut, queue and the cut its findings opened at | Open and resolved findings, their priority                                   |
| Evaluation log      | Dataset, cut and stage                                 | The stage's time                                                             |

They hold aggregates only; individual records stay behind the permission to
see personal data.

## The roles that switch charts on

When a dataset is mapped, some of its fields take a role. Each role turns on
the charts that need it:

| Role           | Example in customers | Example in orders       | Turns on                                                                        |
| -------------- | -------------------- | ----------------------- | ------------------------------------------------------------------------------- |
| Entity key     | Document             | The customer's document | Distribution of the ICD by entity, How entities moved between bands             |
| Grouping field | Office, advisor      | Store, product, channel | p′ chart by group, Largest groups, Groups that changed most, Remediation queues |
| Segment        | Customer type        | Order type              | Data condition by segment                                                       |
| Update date    | Last update          | Last change date        | Update recency                                                                  |
| Outlier amount | Total income         | Order amount            | Outliers by group                                                               |
| Drift variable | Income, age          | Price, delivery days    | PSI by deciles                                                                  |

Charts that need nothing (conformity and IGCD by cut, conformity by rule,
fields with the lowest ICD, profiling, time per stage) appear for every
dataset. One more chart belongs to an optional sector indicator: see the
[module for regulated financial entities in
Colombia](../../guide/sector-colombia-finance/).

## One definition, every place

The dashboard of each dataset assembles itself with the charts whose needs it
meets.

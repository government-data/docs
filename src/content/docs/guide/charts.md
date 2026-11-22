---
title: Reading the dashboard
description: What each chart on a dataset's dashboard answers, how to read it and what to do about it.
sidebar:
  order: 5.5
---

Every dataset has a dashboard: the **Dashboard** under the dataset in the
**Explorer**, and the **Quality** tab of each table the dataset reads. This page
goes through every chart on it, in the order it shows them, for the people
who act on it: data stewards, analysts and managers. How each figure
is calculated is in [Formulas](../formulas/); examples drawn with made-up
data are in the [Charts](../../charts/evolution/) section.

## Before you read a chart

- **The cut.** The **Cut** selector at the top lists the dataset's evaluated
  cuts, the latest first. Every chart shows the cut chosen. Charts that
  compare (band transitions, groups that changed most, the population stability index (PSI), the time per
  stage beside the previous one) compare it with the **evaluated cut before
  it**, not with last month or with today.
- **Ages are counted at the cut, never today.** "Up to 30 days", "overdue"
  and the oldest open finding are measured from the cut's date. An old cut
  keeps saying what it said on its day.
- **Not every chart appears.** A chart shows only when the dataset has what
  it needs: an entity key, a segment, a grouping field (office, advisor,
  product), an update date, an outlier amount or a drift variable. Mapping
  a table proposes those roles from its fields and publishes them with the
  mapping; the application has no mapping editor yet to change them.
  Charts that need nothing appear for every dataset.
- **"no data for this cut".** The chart exists for the dataset but the cut
  gave it no rows: for example the first cut has nothing to compare with, or
  no entity has a band. It is not a zero. If the dashboard says that no cut
  has been evaluated yet, run one from **Cuts**.
- **Values and tables.** Point at (or tab to) any bar, dot or column to see
  its value and what it is. The drawing shows at most the fifteen worst;
  the table under each figure has every row. A long label is cut in the
  drawing and whole in the table. A missing value is a gap or "—", never a
  zero.
- **One figure per grouping field.** Charts by group are drawn once per
  grouping field (or per drift variable), named after it: "p′ chart by group ·
  Office", "p′ chart by group · Channel".

## Conformity and IGCD by cut

**Question:** is quality getting better? **What you see:** a line per
measure over the last twelve cuts up to the one chosen: **Conformity**
(blue), the share of rule checks that passed, and the **IGCD** (orange), the
overall data quality index: the mean data reliability index (ICD) of every entity ([Formulas §1](../formulas/#1-conformity-of-a-rule)
and [§3](../formulas/#3-icd-and-igcd)). The table
adds records and failures per cut.

**How to read it.** Rising is good. The vertical axis does not start at
zero, so a small step looks large: check the table before calling it a
change. A jump with a jump in records usually means a different population
(a new source, a migration), not better capture. Before a cut with ICD, the
IGCD line is a gap.

## Failures by dimension and severity

**Question:** what kind of problem dominates? **What you see:** bars of
failures by quality dimension (completeness, validity, consistency…) and
severity (blocking, major, minor), the most first; grey bars have none. A
failure is a record failing a rule, so a record failing three rules counts
three.

**How to read it.** Blocking and major failures come first. Many
completeness failures point at the capture form or the source; many
timeliness failures at an update campaign, not at the offices.

## Fields with the most failures

**Question:** where are the failures? **What you see:** bars of failures per
field, summed over the rules that read it; the table adds how many rules
read it and how many checks they made.

**How to read it.** A field with many failures and many rules may simply be
the most checked: compare with _Rules with the lowest conformity_ before
deciding where to start.

## Fields with the lowest ICD

**Question:** which data elements are least reliable? **What you see:**
bars of each field's mean ICD, from 0 to 1, the lowest first
([Formulas §2–3](../formulas/#3-icd-and-igcd)).

**How to read it.** Unlike failure counts, the ICD weighs severity and,
for fields that expire, how old the data is. A field low here but with few
failures is usually **old** rather than wrong: it needs an update, not a
fix.

## Distribution of the ICD by entity

**Question:** how are the customers (or whatever the entity is) spread across
quality? **What you see:** columns counting entities in bins of 0.05 from 0
to 1, with lines at **0.75** and **0.90**, the band limits
([Formulas §3](../formulas/#3-icd-and-igcd)).

**How to read it.** Right of 0.90 is the good band, between the lines the
fair one, left of 0.75 the poor one. A tall pile just left of a line is
cheap to move: a few fixes per entity change its band. A second hump far to
the left usually has one cause (a segment, a source).

## Data condition by segment

**Question:** is one kind of entity worse than another? **What you see:** a
bar per segment (for example individual and company), split into **Good
(ICD ≥ 0.90)** in green, **Fair (0.75–0.90)** in amber and **Poor (< 0.75)**
in red, as shares; the table has the counts.

**How to read it.** A segment much redder than the rest often fails on
fields its records do not carry: a process problem, fixed at the source
rather than case by case. A small segment can look extreme with few
entities: read its count in the table.

## How entities moved between bands

**Question:** where did entities go since the previous cut? **What you
see:** a grid with the previous cut's band in rows and this cut's in
columns; each square counts the entities that went from one to the other,
matched by an anonymous key.

**How to read it.** The diagonal stayed. Squares above it (towards Good)
improved; below it worsened. A large flow from Good to Fair with no new
errors is usually data **expiring** (timeliness). It needs two evaluated
cuts; entities only in one of them do not count.

## SFC indicator

This chart appears only for a dataset that takes part in the indicator of
the Superintendencia Financiera de Colombia (SFC), the country's financial supervisor. It is described in the optional [module
for regulated financial entities in
Colombia](../sector-colombia-finance/#reading-the-sfc-indicator-chart).

## p′ chart by group

**Question:** does this office (advisor, channel) fail more than normal, or
is it noise? **What you see:** a dot per group: across, its number of
records; up, its share of records with a **serious failure** (a blocking or
major rule failing on a critical or high field). The horizontal line is the
grouping field's average (p̄); the two curves are the control limits, wide for
small groups and narrow for large ones
([Formulas §5](../formulas/#5-p-chart-by-group)). Grey dots are in
control, red ✕ above the upper limit, green ✓ below the lower one. Records
with the grouping field empty are left out.

**How to read it.** Only dots outside the curves are signals. Above: look
for the cause at the point of capture (process, form, training). Below:
something done better, worth copying. Between the curves: normal variation,
no action, however the ranking looks. Do not rank groups by height: a small
group high up may still be inside its wide limits. Serious failures still
include systemic ones (expired updates, catalogs), which the office cannot
fix; every group of a field shifted up together points at the source.

## Largest groups

**Question:** where are most records? **What you see:** bars of records for
the fifteen largest groups of each grouping field, the empty group included as
"(empty)"; the table adds each one's share with a serious failure and its
mean ICD.

**How to read it.** Read it with the p′ chart: a large group with a slightly
worse share moves more records than a small one with a much worse share. A
large "(empty)" group is a capture problem in itself.

## Groups that changed most

**Question:** which groups moved since the previous cut? **What you see:**
bars to the right (worse) or left (better) of zero, in percentage points of
their share with a serious failure, for the fifteen that moved most; the
table has both cuts' shares. "No change since the previous cut." means
none moved.

**How to read it.** It points at where to look, not at whom to blame: a
group may drop because it received records from another. Small groups move
a lot by chance; check the p′ chart before acting.

## Outliers by group

**Question:** are there amounts unusual for their group? **What you see:**
for the outlier amount (income, loan amount) and each grouping field, bars of
the groups with outliers: low ones in orange, high ones in blue. An amount
is an outlier when its robust z within its group is beyond 3.5 either way
([Formulas §6](../formulas/#6-outliers-robust-z-and-mad)). Only positive
amounts count. "no outliers in any group" means none.

**How to read it.** An outlier is not an error by itself: the chart does not
yet tell a probable error from a legitimate value. Review the groups with
the highest share, fix the errors (extra digits, wrong unit) and keep the
legitimate ones. In a group with few amounts the median is unstable: read
the count in the table.

## PSI by deciles

**Question:** did this cut's population change from the previous one?
**What you see:** for each drift variable, ten pairs of columns: the
previous cut split into ten bins of the same size (grey, about 10 % each)
and this cut's share in the same bins (blue). The note gives the PSI and
its reading: **stable** below 0.10, **moderate drift** from 0.10 to 0.25,
**significant drift** above
([Formulas §7](../formulas/#7-drift-population-stability-index-psi)).

**How to read it.** Blue columns close to the grey ones are good. Blue
piling up at one end means the population moved: every record may be valid
and the batch still be suspicious. With moderate drift, review the batch
before using it; with significant drift, find the cause (a new source, a
change of unit, a load error). The shares are read to the nearest 1 %, so
a PSI near 0 is approximate. It needs a previous evaluated cut.

## Remediation queues

**Question:** how much is waiting in each group's queue, and how much is
late? **What you see:** for each grouping field, columns for the fifteen groups
with the most **open** findings (blue) and those **overdue** (red). A finding
is a record failing a rule; it is overdue when the days from the cut where it
first failed to the cut shown exceed the queue's service level agreement (SLA). The table adds the
findings **resolved at this cut**, the **oldest open** finding's age in days,
the **SLA** and the open findings' summed **priority**
([Formulas §4](../formulas/#4-priority)).

**How to read it.** Red is what to chase first; a high summed priority with
few findings means a few costly ones. A finding is resolved only when a
later cut no longer fails it: fixes show at the next evaluated cut, not
before. With monthly cuts, an SLA under a month reads as overdue at the
first cut that still fails.

**The SLA.** Each queue's SLA is a number of days, set per grouping field with an
optional override per group; without one it is 30 days. It is set by people
who may edit the dataset's pipeline, and every change is audited. Changing it
needs no new evaluation: the chart applies it when it is read. Whoever may
edit the pipeline sets it in the **Remediation SLAs** form below the dashboard: a
default per grouping field (blank keeps 30 days) and the groups that differ, from
1 to 365 days; saving redraws the queues' chart.

While findings are not yet carried from one cut to the next, every open
finding counts from the cut shown, so **Overdue** and **Resolved at this cut** read 0.

## Update recency

**Question:** how old is the data? **What you see:** bars of records by how
long before the cut the update date was: after the cut, up to 30 days,
31–90 days, 91–180 days, 181 days – 1 year, 1–2 years, over 2 years, and no
date; shown as shares.

**How to read it.** Data can be right and still old: everything over a year
weighs down the timeliness of the ICD. A big share over a year calls for an
update campaign. Dates **after the cut** are suspicious (wrong format, a
default date): check how they are captured.

## Emptiest fields

**Question:** which fields are missing most? **What you see:** bars of each
field's empty share, the emptiest first; the table adds distinct values and
the commonest shape (each digit a `9`, each letter an `A`) with its share of
the filled values.

**How to read it.** An empty field may be optional: compare with the rules.
A commonest shape well under 100 % suggests mixed formats; a code that lost
its leading zero shows here as a shorter shape. This is profiling: it shows
no values, only shapes.

## Rules with the lowest conformity

**Question:** which rules are met least? **What you see:** bars of each
rule's conformity, from 0 to 100 %, the lowest first; rules that applied to
no record are left out of the drawing and show "—" in the table, which also
has the field, dimension, severity, records it applies to and failures
([Formulas §1](../formulas/#1-conformity-of-a-rule)).

**How to read it.** Low conformity means the data is wrong or the rule is
badly posed. Review the lowest with the rule's owner before fixing thousands
of records. A rule that applies to few records swings a lot between cuts.

## Time per stage

**Question:** is the evaluation getting slower for the volume it handles?
**What you see:** a bar per stage of the evaluation (load the cut, run the
rules, profile, ICD and groups, remediation queues, update recency,
distributions) in milliseconds per million values (records × mapped
fields; the chart calls them record-attributes); the table adds the plain time and the previous cut's
([Formulas §8](../formulas/#8-time-per-stage)). Without a volume, the
bars are plain milliseconds.

**How to read it.** Compare a stage with its previous value per million,
not in plain time: a larger base takes longer without being slower. Running
the rules usually dominates.

## Common pitfalls

- **Small groups.** A group with few records swings by chance. Trust the p′
  chart's limits, not the ranking, and read counts in the tables.
- **The first cut.** Band transitions, groups that changed most and the PSI
  need a previous evaluated cut: on the first one they say "no data for this
  cut".
- **Cut versus today.** Everything is measured at the cut's date. To see the
  effect of fixes, evaluate a new cut.
- **Failures versus records.** Failure counts add up rule checks; the shares
  of the p′ chart and the queues are of records or findings.
- **No personal data.** The dashboard shows aggregates only.

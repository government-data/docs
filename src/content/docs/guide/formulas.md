---
title: Formulas
description: How conformity, the ICD, the IGCD, the bands, priority and the statistical tests are calculated.
sidebar:
  order: 5
---

Notation: $i$ = record, $e$ = entity, $a$ = field, $r$ = rule, $k$ = component
of the ICD (data reliability index), $\mathbf{1}[\cdot]$ = 1 when the condition holds and 0
otherwise. The weights, severities and thresholds below are fixed in the
product today. What each figure means is in [From results to
indicators](../indicators/); how it shows on a dataset's dashboard, in
[Reading the dashboard](../charts/).

## 1. Conformity of a rule

$$
\text{conformity}_r = 1 - \frac{\text{failures}_r}{\text{applies}_r}
$$

$\text{applies}_r$ counts only the records the rule applies to; for
example, a rule on the legal representative applies only to companies.
Overall conformity, on the trend by cut, sums failures and applies over
every rule.

## 2. ICD components per field

$$
\begin{aligned}
s_r &= \begin{cases} 1.0 & \text{Blocking}\\ 0.6 & \text{Major}\\ 0.3 & \text{Minor} \end{cases}\\[6pt]
C_{a,i} &= 1 - \frac{\sum_{r \in \text{field}(a)} s_r\,\mathbf{1}[\text{fails}_{r,i}]}{\sum_{r \in \text{field}(a),\ \text{applies}} s_r}
  && \text{conformity of the field's own rules}\\[4pt]
S_{a,i} &= 1 - \frac{\sum_{r \in \text{cross}(a)} s_r\,\mathbf{1}[\text{fails}_{r,i}]}{\sum_{r \in \text{cross}(a),\ \text{applies}} s_r}
  && \text{consistency with other fields}\\[4pt]
A_{a,i} &= \begin{cases} 0.5^{\,d_i/365} & a \text{ goes out of date}\\ \text{n/a} & \text{otherwise} \end{cases}
\end{aligned}
$$

$\text{field}(a)$ are the rules that read only field $a$; $\text{cross}(a)$
those that read $a$ and other fields, which count in the $S$ of each field
they read. $d_i$ is the number of days from the record's update date to the
cut, never below 0. $A$ loses half its value for each year without an
update, and applies only to fields marked as going out of date (contact
data, income, an employer…), and only when the dataset has an update date;
an identity document or a birth date does not lose validity over time.

## 3. ICD and IGCD

$$
\begin{aligned}
\text{ICD}_{a,i} &= \frac{\sum_{k} w_k\, x_{k,a,i}}{\sum_{k} w_k},
  \qquad (w_C, w_S, w_A) = (0.40,\ 0.15,\ 0.15)\\[6pt]
\text{ICD}_i &= \frac{\sum_a c_a\, \text{ICD}_{a,i}}{\sum_a c_a},
  \qquad c_a = 4\ (\text{critical}),\ 3\ (\text{high}),\ 2\ (\text{medium}),\ 1\ (\text{low})\\[6pt]
\text{ICD}_{a,e} &= \begin{cases} \min_{i \in e} \text{ICD}_{a,i} & a \text{ critical}\\ \operatorname{mean}_{i \in e} \text{ICD}_{a,i} & \text{otherwise} \end{cases},
  \qquad \text{ICD}_e = \frac{\sum_a c_a\, \text{ICD}_{a,e}}{\sum_a c_a}\\[6pt]
\text{IGCD} &= \frac{1}{N} \sum_{e=1}^{N} \text{ICD}_e\\[6pt]
\text{Band}_e &= \begin{cases}
  \text{Good} & \text{ICD}_e \ge 0.90\\
  \text{Fair} & 0.75 \le \text{ICD}_e < 0.90\\
  \text{Poor} & \text{ICD}_e < 0.75
\end{cases}
\end{aligned}
$$

A component without data for a record (no rule applies, or the field does
not go out of date) leaves the sum, and the remaining weights are
renormalised; a field with no component has no ICD for that record and
leaves the record's sum. An entity $e$ is the set of records sharing the
entity key; $N$ is the number of entities with an ICD. The IGCD (overall data
quality index) is their mean. Without an entity key, the IGCD is the mean of the records' ICD, and there are no bands.

## 4. Priority

$$
\text{Priority}_{i,r} = \max_{a \in \text{reads}(r)}\ \underbrace{\frac{c_a}{4}\,\left(1 - \text{ICD}_{a,i}\right)}_{\text{business impact}} \times \text{closeness}_a
$$

Each finding, a record $i$ failing a rule $r$, takes the highest term over
the fields the rule reads. $\text{closeness}_a$ is 0.2 for every field,
unless the dataset takes part in a sector indicator that weights fields by
how close they are to its threshold (see the optional [module for
regulated financial entities in
Colombia](../sector-colombia-finance/#closeness-to-the-threshold-and-priority)).
A queue's priority is the sum over its open findings.

## 5. p′ chart by group

$$
\begin{aligned}
p_g &= \frac{\text{serious}_g}{n_g}, \qquad \bar{p} = \frac{\sum_g \text{serious}_g}{\sum_g n_g}, \qquad
  \sigma_g = \sqrt{\frac{\bar{p}\,(1 - \bar{p})}{n_g}}, \qquad z_g = \frac{p_g - \bar{p}}{\sigma_g}\\[6pt]
\sigma_z &= \frac{\overline{MR}(z)}{1.128}, \qquad
  \text{UCL}_g,\ \text{LCL}_g = \bar{p} \pm 3\,\sigma_g\,\sigma_z \qquad (\text{Laney } p' \text{ chart})
\end{aligned}
$$

$p_g$ is the share of the records of group $g$ with a **serious failure**:
a blocking or major rule failing on a critical or high field. With groups of
thousands of records, the plain binomial limits almost vanish and every
group looks out of control; $\sigma_z$, the real spread between groups
measured with the moving range of $z$ over the groups ordered by size,
widens them. The lower limit is never below 0. There is a signal when $p_g$
falls outside its limits. Records with the grouping field empty are left
out.

## 6. Outliers: robust z and MAD

**In words:** for each group of a grouping field, take the typical amount
(the **median**) and how far amounts usually stray from it (the **MAD**,
median absolute deviation). The **robust z** says how many of those typical
distances each amount is away: 0 is normal, and beyond 3.5 up or down is an
outlier. Median and MAD are used instead of mean and standard deviation
because a few huge amounts would move the mean and hide precisely the
unusual cases. The logarithm makes doubling weigh the same at any level.
Only positive amounts count.

$$
\begin{aligned}
x_i &= \log_{10}\left(\text{amount}_i\right), \qquad
\text{MAD}_g = \operatorname{median}_{i \in g} \left| x_i - \tilde{x}_g \right|\\[6pt]
z_i &= \frac{0.6745\,\left(x_i - \tilde{x}_g\right)}{\max\left(\text{MAD}_g,\ 0.10\right)},
  \qquad \text{outlier} \iff |z_i| > 3.5
\end{aligned}
$$

**Example.** With amounts of 1, 1.1, 1.2, 1.3 and 50 thousand, the median is
1.2 thousand. The distances to it are 0.2, 0.1, 0, 0.1 and 48.8; their
median, the MAD, is 0.1 thousand. The extreme value does not inflate it,
which is why it serves to find outliers: a mean of 10.9 thousand would
describe none of them. Taken as logarithms, as above, the MAD falls below
0.10 and the floor is used: 50 thousand gets a robust z of about 10.9, an
outlier, and the other four stay within 0.6 of zero.

## 7. Drift: population stability index (PSI)

**In words:** the PSI compares how a number is spread in two cuts, this
one and the previous evaluated one. The previous cut is split into 10 bins
with the same number of records; if this cut is alike, it also falls near
10 % in each bin and the PSI is almost 0. The more this cut concentrates in
some bins, the higher it gets. $e_k$ is the previous cut's share in bin $k$
and $a_k$ this cut's.

$$
\text{PSI} = \sum_{k=1}^{10} \left(a_k - e_k\right) \ln\frac{a_k}{e_k}
\qquad \begin{cases}
  < 0.10 & \text{stable}\\
  0.10 \text{ to } 0.25 & \text{moderate drift}\\
  > 0.25 & \text{significant drift}
\end{cases}
$$

## 8. Time per stage

$$
\text{time per million}_{\text{stage}} = \frac{t_{\text{stage}}}{V / 10^{6}}
$$

$t$ is the stage's time in milliseconds and $V$ the volume evaluated in
values: records × mapped fields. Expressed per million values, a larger
dataset does not look like a slower evaluation.

import { concept } from "../types";

// Concepts of statistics and of storing data, from the old glossary
// (guide/glossary.md), shortened to a sentence or two.
export const statistics = [
  concept(
    "cardinality",
    "How many distinct values a column has. A document number should have as many values as customers; a yes/no field, only two.",
  ),
  concept("decile", "Deciles split the data into 10 groups with the same number of records.", [
    "deciles",
  ]),
  concept(
    "drift",
    "A change in how a data element is distributed between periods or batches. It may be a real market change or a load error; it is measured with the PSI.",
  ),
  concept(
    "error outlier",
    "A value outside the distribution that is also wrong (extra digits, impossible date). It is fixed or quarantined.",
    ["error outliers"],
  ),
  concept(
    "legitimate outlier",
    "An infrequent but correct value (high net worth, unusual activity). It is kept in the base and excluded from the estimators.",
    ["legitimate outliers"],
  ),
  concept(
    "logarithm",
    'A transformation that counts "how many zeros" a number has: log10 of 1,000,000 is 6. Used with income so that going from 1 to 2 million weighs the same as from 10 to 20.',
    ["logarithms"],
  ),
  concept(
    "median",
    "The middle value once the data is sorted. Unlike the mean, a few extreme values do not drag it.",
  ),
  concept(
    "moving range",
    "In the p′ chart, the difference between each office's score and the previous one's; its mean divided by 1.128 gives σz, how much more the offices vary among themselves than chance would explain.",
  ),
  concept(
    "open table format",
    "A way of storing large tables in common files (Parquet) with a layer that records every change, so they behave like a database: see the base as it was at a past date, undo a wrong load, and read only the needed part.",
    ["open table formats", "open tables"],
  ),
  concept(
    "p chart",
    "A control chart for proportions: it compares each group's failure rate with limits p̄ ± 3σ that depend on its size.",
    ["p charts"],
  ),
  concept(
    "p′ chart",
    "Laney's p chart for very large groups: it multiplies the limits by σz, the real spread between groups, so only differences that normal variation does not explain stand out.",
    ["p′ charts"],
  ),
  concept("Parquet", "A compressed, fast-to-read file format for large tables."),
  concept("percentile", "Percentile 99 (P99) is the value below which 99 % of the data falls.", [
    "percentiles",
  ]),
  concept(
    "profiling",
    "A descriptive analysis of each column: nulls, cardinality, patterns and distribution.",
  ),
  concept(
    "robust z",
    "How many typical distances a value is from its group's normal value: 0.6745 × (value − median) / MAD, robust because it uses the median and the MAD. Above 3.5 the value is flagged as an outlier.",
  ),
  concept(
    "time travel",
    "The ability of open tables to query the data as it was at an earlier date, for audit.",
  ),
  concept(
    "Western Electric rules",
    "Rules to detect a lack of control in control charts (points beyond 3σ, runs on one side, trends).",
    ["Western Electric"],
  ),
];

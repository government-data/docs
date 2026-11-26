// The guide's example charts, by name: each drawn with made-up figures, to
// show how a chart of the product reads, never any organisation's data.
// One example per chart of the product's catalogue (CATALOG below), each in
// the section of the formulas page that defines it. The product draws these
// charts in the quality dashboard in Superset, from gold.

import type { Figure, Lang } from "../chart-kit/index";
import { DISTRIBUTION_CHARTS } from "./distributions";
import { FIELD_CHARTS } from "./fields";
import { GROUP_CHARTS } from "./groups";
import { ICD_CHARTS } from "./icd";
import { RULE_CHARTS } from "./rules";
import { pick, type Example } from "./shared";

const EXAMPLES: Record<string, Example> = {
  ...RULE_CHARTS,
  ...ICD_CHARTS,
  ...GROUP_CHARTS,
  ...DISTRIBUTION_CHARTS,
  ...FIELD_CHARTS,
};

/** The product's chart catalogue, in the order a dashboard shows it, each
 * with the example that draws it. */
export const CATALOG: Record<string, string> = {
  trend_by_cut: "igcd-trend",
  failures_by_dimension: "failures-by-dimension",
  failures_by_field: "failures-by-field",
  lowest_icd: "fields-lowest-icd",
  icd_distribution: "icd-distribution",
  bands_by_segment: "bands-by-segment",
  band_transitions: "band-transitions",
  sfc_view: "sfc-cells",
  groups_p_chart: "p-chart",
  largest_groups: "largest-groups",
  groups_changed: "groups-changed",
  outliers_by_group: "outliers",
  psi_by_decile: "psi",
  remediation_queues: "queues",
  update_recency: "recency",
  profiling: "profiling",
  conformity_by_rule: "rule-conformity",
};

/** Every example's name. */
export const EXAMPLE_IDS = Object.keys(EXAMPLES);

export function chart(id: string, lang: Lang): Figure {
  const example = EXAMPLES[id];
  if (!example) throw new Error(`No chart named "${id}"`);
  return {
    ...example.make(lang),
    source: { query: pick(lang, example.query), needs: pick(lang, example.needs) },
  };
}

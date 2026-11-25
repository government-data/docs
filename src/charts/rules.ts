// The example charts of the rules' results: conformity by cut and by rule,
// failures by dimension and severity and by field. One set of made-up rules
// feeds them all, so their figures agree with each other.

import { bars, lines, num, pct, type Lang } from "../chart-kit/index";
import { DIMENSIONS, field, NOTHING, pick, SEVERITIES, type Example, type Text } from "./shared";

/** The example dataset's records in the cut. */
export const RECORDS = 54_600;

interface Rule {
  id: string;
  text: Text;
  field: string;
  dimension: string;
  severity: string;
  /** The share of the records it applies to. */
  applies: number;
  conformity: number;
}

const rule = (
  id: string,
  text: Text,
  fieldKey: string,
  dimension: string,
  severity: string,
  applies: number,
  conformity: number,
): Rule => ({ id, text, field: fieldKey, dimension, severity, applies, conformity });

// prettier-ignore
const RULES: Rule[] = [
  rule("R-12", ["Actualizado hace más de un año", "Updated over a year ago"], "updated", "timeliness", "major", 0.964, 0.58),
  rule("R-08", ["Dirección sin nomenclatura", "Address without street format"], "address", "validity", "major", 0.978, 0.66),
  rule("R-04", ["Código de actividad incoherente con la ocupación", "Activity code inconsistent with occupation"], "ciiu", "consistency", "major", 0.95, 0.71),
  rule("R-31", ["Representante legal vacío (empresas)", "Legal representative empty (companies)"], "legalrep", "completeness", "blocking", 0.08, 0.74),
  rule("R-09", ["Correo de relleno", "Placeholder e-mail"], "email", "accuracy", "major", 0.916, 0.78),
  rule("R-14", ["Celular con formato inválido", "Invalid mobile phone format"], "mobile", "validity", "major", 0.969, 0.81),
  rule("R-15", ["Patrimonio ≠ activo − pasivo", "Net worth ≠ assets − liabilities"], "networth", "consistency", "major", 0.86, 0.83),
  rule("R-02", ["Ocupación vacía", "Occupation empty"], "occupation", "completeness", "blocking", 1, 0.85),
  rule("R-21", ["Categoría de cliente vacía", "Customer category empty"], "stratum", "completeness", "blocking", 1, 0.86),
  rule("R-11", ["Empresa vacía en empleados", "Employer empty for employees"], "employer", "completeness", "blocking", 0.52, 0.88),
  rule("R-17", ["Ciudad fuera del catálogo", "City not in the catalog"], "city", "validity", "major", 0.998, 0.89),
  rule("R-05", ["Ingresos vacíos", "Income empty"], "income", "completeness", "blocking", 1, 0.91),
  rule("R-18", ["Celular repetido", "Repeated mobile phone"], "mobile", "uniqueness", "minor", 0.969, 0.93),
  rule("R-01", ["Fecha de nacimiento vacía", "Date of birth empty"], "birth", "completeness", "blocking", 1, 0.95),
  rule("R-06", ["Nombre con caracteres inválidos", "Name with invalid characters"], "name", "validity", "major", 1, 0.97),
];

const appliesOf = (r: Rule) => Math.round(RECORDS * r.applies);
const failuresOf = (r: Rule) => Math.round(appliesOf(r) * (1 - r.conformity));

/** Rules, applies and failures summed by a key, the most failures first. */
function sumBy(key: (r: Rule) => string) {
  const out = new Map<string, { rules: number; applies: number; failures: number }>();
  for (const r of RULES) {
    const k = key(r);
    const s = out.get(k) ?? { rules: 0, applies: 0, failures: 0 };
    out.set(k, {
      rules: s.rules + 1,
      applies: s.applies + appliesOf(r),
      failures: s.failures + failuresOf(r),
    });
  }
  return [...out.entries()].sort((a, b) => b[1].failures - a[1].failures);
}

const trend: Example = {
  query: ["Resumen del corte y resultados por regla", "Cut summary and rule results"],
  needs: NOTHING,
  make: (lang) => {
    const xs = ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"];
    const records = [52_900, 53_300, 53_600, 54_000, 54_300, RECORDS];
    // The last cut is the rules below: its checks and failures are theirs.
    const applies = RULES.reduce((s, r) => s + appliesOf(r), 0);
    const failures = RULES.reduce((s, r) => s + failuresOf(r), 0);
    const conformity = [0.797, 0.803, 0.81, 0.816, 0.822, 1 - failures / applies];
    const igcd = [0.781, 0.792, 0.806, 0.818, 0.833, 0.846];
    const checks = (i: number) => (records[i] / RECORDS) * applies;
    const f = (v: number) => num(lang, v, 3);
    const s1 = pick(lang, ["Conformidad", "Conformity"]);
    const s2 = "IGCD";
    return {
      title: pick(lang, ["Conformidad e IGCD por corte", "Conformity and IGCD by cut"]),
      note: pick(lang, [
        "La conformidad es la parte de las revisiones de reglas que pasaron; el IGCD, el ICD medio de las entidades. El eje vertical no empieza en cero.",
        "Conformity is the share of rule checks that passed; the IGCD, the entities' mean ICD. The vertical axis does not start at zero.",
      ]),
      plot: {
        svg: lines({
          xs,
          series: [
            { label: s1, color: "var(--viz-s1)", values: conformity },
            { label: s2, color: "var(--viz-s2)", values: igcd },
          ],
          yMin: 0.7,
          yMax: 1,
          yFmt: f,
        }),
        legend: [
          { label: s1, color: "var(--viz-s1)", kind: "line" },
          { label: s2, color: "var(--viz-s2)", kind: "line" },
        ],
        table: {
          head: [
            pick(lang, ["Corte", "Cut"]),
            pick(lang, ["Registros", "Records"]),
            pick(lang, ["Fallos", "Failures"]),
            s1,
            s2,
          ],
          rows: xs.map((x, i) => [
            x,
            num(lang, records[i]),
            num(lang, Math.round(checks(i) * (1 - conformity[i]))),
            f(conformity[i]),
            f(igcd[i]),
          ]),
        },
      },
    };
  },
};

const ruleConformity: Example = {
  query: ["Resultados por regla", "Rule results"],
  needs: NOTHING,
  make: (lang) => {
    const rows = RULES.map((r) => ({ label: `${r.id} · ${pick(lang, r.text)}`, value: r.conformity }));
    const f = (v: number) => pct(lang, v);
    return {
      title: pick(lang, [
        "Las 15 reglas con menor conformidad",
        "The 15 rules with the lowest conformity",
      ]),
      note: pick(lang, [
        "Conformidad = 1 − fallos ÷ registros a los que aplica la regla. R-31 aplica solo a empresas.",
        "Conformity = 1 − failures ÷ records the rule applies to. R-31 applies to companies only.",
      ]),
      plot: {
        svg: bars({ rows, max: 1, fmt: f, labelWidth: 290 }),
        table: {
          head: [
            pick(lang, ["Regla", "Rule"]),
            pick(lang, ["Campo", "Field"]),
            pick(lang, ["Dimensión", "Dimension"]),
            pick(lang, ["Severidad", "Severity"]),
            pick(lang, ["Aplica", "Applies"]),
            pick(lang, ["Fallos", "Failures"]),
            pick(lang, ["Conformidad", "Conformity"]),
          ],
          rows: RULES.map((r, i) => [
            rows[i].label,
            field(lang, r.field),
            pick(lang, DIMENSIONS[r.dimension]),
            pick(lang, SEVERITIES[r.severity]),
            num(lang, appliesOf(r)),
            num(lang, failuresOf(r)),
            f(r.conformity),
          ]),
        },
      },
    };
  },
};

const failuresByDimension: Example = {
  query: ["Resultados por regla", "Rule results"],
  needs: NOTHING,
  make: (lang) => {
    const groups = sumBy((r) => `${r.dimension}|${r.severity}`);
    const label = (k: string) => {
      const [d, s] = k.split("|");
      return `${pick(lang, DIMENSIONS[d])} · ${pick(lang, SEVERITIES[s])}`;
    };
    const rows = groups.map(([k, s]) => ({ label: label(k), value: s.failures }));
    const f = (v: number) => num(lang, v);
    return {
      title: pick(lang, [
        "Fallos por dimensión y severidad",
        "Failures by dimension and severity",
      ]),
      note: pick(lang, [
        "Cada fallo es un registro que falla una regla: un registro que falla tres reglas cuenta tres.",
        "Each failure is a record failing a rule: a record failing three rules counts three.",
      ]),
      plot: {
        svg: bars({ rows, max: Math.max(...rows.map((r) => r.value)) * 1.1, fmt: f, labelWidth: 200 }),
        table: {
          head: [
            pick(lang, ["Dimensión · severidad", "Dimension · severity"]),
            pick(lang, ["Reglas", "Rules"]),
            pick(lang, ["Aplica", "Applies"]),
            pick(lang, ["Fallos", "Failures"]),
          ],
          rows: groups.map(([k, s]) => [label(k), f(s.rules), f(s.applies), f(s.failures)]),
        },
      },
    };
  },
};

const failuresByField: Example = {
  query: ["Resultados por regla", "Rule results"],
  needs: NOTHING,
  make: (lang) => {
    const groups = sumBy((r) => r.field);
    const rows = groups.map(([k, s]) => ({ label: field(lang, k), value: s.failures }));
    const f = (v: number) => num(lang, v);
    return {
      title: pick(lang, ["Campos con más fallos", "Fields with the most failures"]),
      note: pick(lang, [
        "Los fallos de cada regla, sumados bajo el campo que la regla revisa.",
        "Each rule's failures, summed under the field the rule checks.",
      ]),
      plot: {
        svg: bars({ rows, max: Math.max(...rows.map((r) => r.value)) * 1.1, fmt: f, labelWidth: 190 }),
        table: {
          head: [
            pick(lang, ["Campo", "Field"]),
            pick(lang, ["Reglas", "Rules"]),
            pick(lang, ["Aplica", "Applies"]),
            pick(lang, ["Fallos", "Failures"]),
          ],
          rows: groups.map(([k, s]) => [field(lang, k), f(s.rules), f(s.applies), f(s.failures)]),
        },
      },
    };
  },
};

export const RULE_CHARTS: Record<string, Example> = {
  "igcd-trend": trend,
  "rule-conformity": ruleConformity,
  "failures-by-dimension": failuresByDimension,
  "failures-by-field": failuresByField,
};

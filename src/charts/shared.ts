// What the guide's example charts share: their texts in both languages, the
// fields and groups they name, the bands' series. Made-up data only: generic
// names («Office 01»), round invented numbers, no organisation's data.

import { num, pct, type Figure, type Lang, type StackSeries } from "../chart-kit/index";

export type Text = [es: string, en: string];
export const pick = (lang: Lang, t: Text) => (lang === "es" ? t[0] : t[1]);

/** An example chart: how it is drawn, and where its data comes from (the
 * part of the results model it queries and what a dataset needs). */
export interface Example {
  make: (lang: Lang) => Figure;
  query: Text;
  needs: Text;
}

export const NOTHING: Text = [
  "nada: aplica a todos los datasets",
  "nothing: it applies to every dataset",
];
export const A_DIMENSION: Text = [
  "un campo de agrupación (aquí, oficina)",
  "a grouping field (here, office)",
];

const FIELDS: Record<string, Text> = {
  updated: ["Fecha de actualización", "Last update date"],
  mobile: ["Celular", "Mobile phone"],
  address: ["Dirección", "Home address"],
  email: ["Correo", "Email"],
  ciiu: ["Código de actividad", "Activity code"],
  income: ["Ingresos", "Total income"],
  occupation: ["Ocupación", "Occupation"],
  stratum: ["Categoría de cliente", "Customer category"],
  employer: ["Empresa", "Employer"],
  city: ["Ciudad", "City code"],
  networth: ["Patrimonio", "Net worth"],
  landline: ["Teléfono fijo", "Landline"],
  marital: ["Estado civil", "Marital status"],
  document: ["Documento", "Document number"],
  name: ["Nombre", "Name"],
  birth: ["Fecha de nacimiento", "Date of birth"],
  legalrep: ["Representante legal", "Legal representative"],
};
export const field = (lang: Lang, key: string) => pick(lang, FIELDS[key]);

export const office = (lang: Lang, i: number) =>
  `${pick(lang, ["Oficina", "Office"])} ${String(i).padStart(2, "0")}`;
/** The group of records whose grouping field is empty. */
export const emptyGroup = (lang: Lang) => pick(lang, ["(vacío)", "(empty)"]);

export const DIMENSIONS: Record<string, Text> = {
  completeness: ["Completitud", "Completeness"],
  consistency: ["Consistencia", "Consistency"],
  accuracy: ["Exactitud", "Accuracy"],
  validity: ["Validez", "Validity"],
  timeliness: ["Actualidad", "Timeliness"],
  uniqueness: ["Unicidad", "Uniqueness"],
};
export const SEVERITIES: Record<string, Text> = {
  blocking: ["Bloqueante", "Blocking"],
  major: ["Mayor", "Major"],
  minor: ["Menor", "Minor"],
};

export function bands(lang: Lang): StackSeries[] {
  return [
    {
      label: pick(lang, ["Buen estado (ICD ≥ 0,90)", "Good (ICD ≥ 0.90)"]),
      color: "var(--viz-good)",
      ink: "#ffffff",
    },
    {
      label: pick(lang, ["Regular (0,75–0,90)", "Fair (0.75–0.90)"]),
      color: "var(--viz-warn)",
      ink: "#0b0b0b",
    },
    {
      label: pick(lang, ["Malo (< 0,75)", "Poor (< 0.75)"]),
      color: "var(--viz-crit)",
      ink: "#ffffff",
    },
  ];
}
export const BAND_ICONS = ["✓", "!", "✕"];

/** A count and its share of a total: «1.200 (12 %)». */
export const countShare = (lang: Lang, v: number, total: number) =>
  `${num(lang, v)} (${pct(lang, v / total)})`;

/** A change in percentage points, signed: «+2,1 pp». */
export const pp = (lang: Lang, v: number) =>
  `${v > 0 ? "+" : v < 0 ? "−" : ""}${num(lang, Math.abs(v) * 100, 1)} pp`;

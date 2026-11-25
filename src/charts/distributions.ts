// The example charts of the distributions: outliers of an amount within its
// groups, and the drift of a variable from the previous cut (PSI).

import { columns, num, pct, stacked } from "../chart-kit/index";
import { emptyGroup, pick, type Example, type Text } from "./shared";

const outliers: Example = {
  query: ["Pruebas de distribución", "Distribution checks"],
  needs: [
    "un importe de atípicos y un campo de agrupación (aquí, ingresos por actividad)",
    "an outlier amount and a grouping field (here, income by occupation)",
  ],
  make: (lang) => {
    // Group, positive amounts, outliers below and above.
    const data: [Text | null, number, number, number][] = [
      [["Independiente", "Self-employed"], 11_300, 9, 63],
      [["Empleado", "Employee"], 24_800, 12, 41],
      [["Pensionado", "Retiree"], 7_900, 21, 8],
      [["Hogar", "Homemaker"], 2_100, 14, 3],
      [["Estudiante", "Student"], 1_600, 2, 11],
      [null, 900, 0, 5],
    ];
    const names = data.map(([t]) => (t ? pick(lang, t) : emptyGroup(lang)));
    const series = [
      { label: pick(lang, ["Bajos (z < −3,5)", "Low (z < −3.5)"]), color: "var(--viz-s2)", ink: "#ffffff" },
      { label: pick(lang, ["Altos (z > 3,5)", "High (z > 3.5)"]), color: "var(--viz-s1)", ink: "#ffffff" },
    ];
    const f = (v: number) => num(lang, v);
    return {
      title: pick(lang, ["Atípicos de ingresos por grupo · Actividad", "Income outliers by group · Occupation"]),
      note: pick(lang, [
        "Ingresos con un z robusto de más de 3,5 hacia abajo o hacia arriba dentro de su actividad. Solo cuentan los ingresos positivos.",
        "Incomes with a robust z beyond 3.5 below or above within their occupation. Only positive incomes count.",
      ]),
      plot: {
        svg: stacked({
          rows: data.map(([, , low, high], i) => ({ label: names[i], parts: [low, high] })),
          series,
          percent: false,
          max: 80,
          fmt: (v) => f(v),
          totalFmt: f,
          labelWidth: 130,
        }),
        legend: series.map((s) => ({ label: s.label, color: s.color })),
        table: {
          head: [
            pick(lang, ["Actividad", "Occupation"]),
            pick(lang, ["Ingresos positivos", "Positive incomes"]),
            series[0].label,
            series[1].label,
            pick(lang, ["Proporción atípica", "Outlier share"]),
          ],
          rows: data.map(([, n, low, high], i) => [
            names[i],
            f(n),
            f(low),
            f(high),
            pct(lang, (low + high) / n, 2),
          ]),
        },
      },
    };
  },
};

const psi: Example = {
  query: ["Pruebas de distribución, 2 cortes", "Distribution checks, 2 cuts"],
  needs: [
    "una variable de deriva (aquí, ingresos) y un corte anterior",
    "a drift variable (here, income) and a previous cut",
  ],
  make: (lang) => {
    const base = Array(10).fill(0.1);
    const now = [0.04, 0.05, 0.07, 0.08, 0.1, 0.11, 0.12, 0.13, 0.15, 0.15];
    const value = now.reduce((s, a, k) => s + (a - base[k]) * Math.log(a / base[k]), 0);
    const reading =
      value < 0.1
        ? pick(lang, ["estable", "stable"])
        : value <= 0.25
          ? pick(lang, ["deriva moderada", "moderate drift"])
          : pick(lang, ["deriva significativa", "significant drift"]);
    const cats = now.map((_, i) => `D${i + 1}`);
    const s1 = pick(lang, ["Corte anterior", "Previous cut"]);
    const s2 = pick(lang, ["Este corte", "This cut"]);
    const f = (v: number) => pct(lang, v);
    return {
      title: `PSI = ${num(lang, value, 2)} · ${reading}`,
      note: pick(lang, [
        "Ingresos de este corte en los deciles del corte anterior (D1, el 10 % con menos ingresos). Si se parecieran, cada decil tendría cerca del 10 %. Menos de 0,10 es estable; de 0,10 a 0,25, deriva moderada; más de 0,25, deriva significativa.",
        "This cut's income in the previous cut's deciles (D1, the lowest-income 10%). If alike, each decile would hold about 10%. Under 0.10 is stable; 0.10 to 0.25, moderate drift; over 0.25, significant drift.",
      ]),
      plot: {
        svg: columns({
          cats,
          series: [
            { label: s1, color: "var(--viz-muted-fill)", values: base },
            { label: s2, color: "var(--viz-s1)", values: now },
          ],
          yMax: 0.16,
          yFmt: f,
          valFmt: f,
        }),
        legend: [
          { label: s1, color: "var(--viz-muted-fill)" },
          { label: s2, color: "var(--viz-s1)" },
        ],
        table: {
          head: [pick(lang, ["Decil", "Decile"]), s1, s2],
          rows: cats.map((c, i) => [c, f(base[i]), f(now[i])]),
        },
      },
    };
  },
};

export const DISTRIBUTION_CHARTS: Record<string, Example> = { outliers, psi };

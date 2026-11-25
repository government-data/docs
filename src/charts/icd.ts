// The example charts of the ICD: the fields' mean ICD, the entities' ICD and
// bands, how the entities moved between bands, and the optional SFC view.

import { bars, columns, dots, heatmap, num, pct, stacked, type Lang } from "../chart-kit/index";
import {
  BAND_ICONS,
  bands,
  countShare,
  field,
  NOTHING,
  pick,
  type Example,
} from "./shared";

const AN_ENTITY: [string, string] = ["una llave de entidad", "an entity key"];

const lowestIcd: Example = {
  query: ["Calidad por campo", "Field quality"],
  needs: NOTHING,
  make: (lang) => {
    const data: [string, number][] = [
      ["updated", 0.64],
      ["address", 0.71],
      ["ciiu", 0.74],
      ["email", 0.77],
      ["mobile", 0.79],
      ["occupation", 0.81],
      ["stratum", 0.83],
      ["employer", 0.85],
      ["income", 0.86],
      ["city", 0.88],
      ["networth", 0.89],
      ["birth", 0.95],
    ];
    const rows = data.map(([k, v]) => ({ label: field(lang, k), value: v }));
    const f = (v: number) => num(lang, v, 2);
    return {
      title: pick(lang, [
        "Los 12 campos con menor ICD medio",
        "The 12 fields with the lowest mean ICD",
      ]),
      note: pick(lang, [
        "El ICD medio de cada campo, sobre los registros en los que el campo tiene ICD.",
        "Each field's mean ICD, over the records where the field has one.",
      ]),
      plot: {
        svg: bars({ rows, max: 1, fmt: f, labelWidth: 180 }),
        table: {
          head: [pick(lang, ["Campo", "Field"]), pick(lang, ["ICD medio", "Mean ICD"])],
          rows: rows.map((r) => [r.label, f(r.value)]),
        },
      },
    };
  },
};

const icdDistribution: Example = {
  query: ["ICD por entidad", "Entity ICD"],
  needs: AN_ENTITY,
  make: (lang) => {
    // Bins from 0.40: the lower ones have no entities and are not drawn.
    const counts = [90, 150, 220, 350, 520, 760, 1040, 1380, 1900, 2750, 3960, 5480];
    const total = counts.reduce((a, b) => a + b, 0);
    const cats = counts.map((_, i) => num(lang, 0.4 + i * 0.05, 2));
    const f = (v: number) => num(lang, v);
    return {
      title: pick(lang, ["Distribución del ICD por entidad", "Distribution of the entities' ICD"]),
      note: pick(lang, [
        "Entidades por tramo de 0,05, nombrado por su inicio; un ICD de 1,00 cuenta en el último. Las líneas marcan las bandas: 0,75 y 0,90.",
        "Entities per 0.05 bin, named by where it starts; an ICD of 1.00 counts in the last. The lines mark the bands: 0.75 and 0.90.",
      ]),
      plot: {
        svg: columns({
          cats,
          series: [
            { label: pick(lang, ["Entidades", "Entities"]), color: "var(--viz-s1)", values: counts },
          ],
          yMax: 6000,
          yFmt: f,
          valFmt: f,
          labelEvery: 2,
          edgeLabels: true,
          vrefs: [
            { at: 7, label: num(lang, 0.75, 2) },
            { at: 10, label: num(lang, 0.9, 2) },
          ],
        }),
        table: {
          head: [pick(lang, ["Tramo de ICD", "ICD bin"]), pick(lang, ["Entidades", "Entities"])],
          rows: counts.map((v, i) => [
            `${cats[i]} – ${num(lang, 0.45 + i * 0.05, 2)}`,
            countShare(lang, v, total),
          ]),
        },
      },
    };
  },
};

const bandsBySegment: Example = {
  query: ["ICD por entidad", "Entity ICD"],
  needs: [
    "una llave de entidad y un segmento (aquí, tipo de cliente)",
    "an entity key and a segment (here, customer type)",
  ],
  make: (lang) => {
    const series = bands(lang);
    const rows = [
      { label: pick(lang, ["Persona natural", "Individual"]), parts: [9950, 5050, 2150] },
      { label: pick(lang, ["Persona jurídica", "Company"]), parts: [520, 480, 450] },
    ];
    const share = (v: number, t: number) => pct(lang, v / t);
    return {
      title: pick(lang, ["Estado de los datos por segmento", "Data condition by segment"]),
      note: pick(lang, [
        "Las entidades de cada segmento por banda. El segmento de una entidad es el valor más común entre sus registros.",
        "Each segment's entities by band. An entity's segment is the commonest value among its records.",
      ]),
      plot: {
        svg: stacked({ rows, series, percent: true, fmt: share, labelWidth: 130 }),
        legend: series.map((s, i) => ({ label: s.label, color: s.color, icon: BAND_ICONS[i] })),
        table: {
          head: [pick(lang, ["Segmento", "Segment"]), ...series.map((s) => s.label)],
          rows: rows.map((r) => {
            const t = r.parts.reduce((a, b) => a + b, 0);
            return [r.label, ...r.parts.map((p) => countShare(lang, p, t))];
          }),
        },
      },
    };
  },
};

const bandTransitions: Example = {
  query: ["ICD por entidad, 2 cortes", "Entity ICD, 2 cuts"],
  needs: ["una llave de entidad y dos cortes", "an entity key and two cuts"],
  make: (lang) => {
    const names = bands(lang).map((b, i) => `${BAND_ICONS[i]} ${b.label.split(" (")[0]}`);
    const values = [
      [9240, 610, 150],
      [880, 4120, 470],
      [90, 640, 1800],
    ];
    const f = (v: number) => num(lang, v);
    return {
      title: pick(lang, [
        "Cómo se movieron las entidades entre bandas",
        "How the entities moved between bands",
      ]),
      note: pick(lang, [
        "Filas: banda en el corte anterior. Columnas: banda en este corte. La diagonal se quedó igual. Solo cuentan las entidades con banda en los dos cortes.",
        "Rows: band at the previous cut. Columns: band at this cut. The diagonal stayed the same. Only entities with a band in both cuts count.",
      ]),
      plot: {
        svg: heatmap({
          rows: names,
          cols: names,
          values,
          rowTitle: pick(lang, ["Corte anterior", "Previous cut"]),
          colTitle: pick(lang, ["Este corte", "This cut"]),
          fmt: f,
        }),
        table: {
          head: [
            pick(lang, ["Corte anterior ↓ / este corte →", "Previous cut ↓ / this cut →"]),
            ...names,
          ],
          rows: names.map((n, i) => [n, ...values[i].map(f)]),
        },
      },
    };
  },
};

const sfcCells: Example = {
  query: ["Celdas SFC", "SFC cells"],
  needs: [
    "que el dataset participe en el indicador SFC",
    "the dataset takes part in the SFC indicator",
  ],
  make: (lang: Lang) => {
    const data: [string, number][] = [
      ["document", 0.99],
      ["name", 0.98],
      ["birth", 0.96],
      ["city", 0.93],
      ["income", 0.92],
      ["occupation", 0.91],
      ["mobile", 0.87],
      ["address", 0.84],
      ["email", 0.81],
      ["ciiu", 0.76],
    ];
    const rows = data.map(([k, v]) => ({ label: field(lang, k), value: v, ok: v >= 0.9 }));
    const f = (v: number) => pct(lang, v);
    const okLabel = pick(lang, ["celda en 1", "cell = 1"]);
    const failLabel = pick(lang, ["celda en 0", "cell = 0"]);
    const passed = rows.filter((r) => r.ok).length;
    return {
      title: pick(lang, [
        `Indicador SFC: ${passed} de 10 celdas cumplen`,
        `SFC indicator: ${passed} of 10 cells pass`,
      ]),
      note: pick(lang, [
        "Cada fila es una celda: vale 1 si al menos el 90 % de los registros activos tiene el campo correcto. La franja (80–90 %) es donde menos correcciones cambian la celda de 0 a 1.",
        "Each row is a cell: it is 1 when at least 90% of active records have the field right. The band (80–90%) is where the fewest fixes turn a cell from 0 to 1.",
      ]),
      plot: {
        svg: dots({
          rows,
          min: 0.7,
          max: 1,
          zone: [0.8, 0.9],
          zoneLabel: pick(lang, ["Máxima prioridad", "Top priority"]),
          ref: { value: 0.9, label: pct(lang, 0.9) },
          fmt: f,
          okLabel,
          failLabel,
          labelWidth: 200,
        }),
        legend: [
          {
            label: pick(lang, ["Cumple (celda en 1)", "Passes (cell = 1)"]),
            color: "var(--viz-good)",
            kind: "dot",
            icon: "✓",
          },
          {
            label: pick(lang, ["No cumple (celda en 0)", "Fails (cell = 0)"]),
            color: "var(--viz-crit)",
            kind: "dot",
            icon: "✕",
          },
        ],
        table: {
          head: [
            pick(lang, ["Campo", "Field"]),
            pick(lang, ["Correctos", "Correct"]),
            pick(lang, ["Celda", "Cell"]),
          ],
          rows: rows.map((r) => [r.label, f(r.value), r.ok ? "1" : "0"]),
        },
      },
    };
  },
};

export const ICD_CHARTS: Record<string, Example> = {
  "fields-lowest-icd": lowestIcd,
  "icd-distribution": icdDistribution,
  "bands-by-segment": bandsBySegment,
  "band-transitions": bandTransitions,
  "sfc-cells": sfcCells,
};

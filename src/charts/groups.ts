// The example charts of a grouping field (here, the office): the p′ chart,
// the largest groups, the groups that changed most and the remediation
// queues. One set of made-up offices feeds them all.

import { columns, diverging, num, pct, scatter, bars, type Lang } from "../chart-kit/index";
import { A_DIMENSION, emptyGroup, office, pick, pp, type Example } from "./shared";

interface Group {
  /** The office's number; 0 for the empty group. */
  id: number;
  records: number;
  /** Share of its records with a serious failure, this cut and the previous. */
  p: number;
  before: number;
  icd: number;
}

// Records and serious share of offices 01 to 20, by size; the previous
// cut's share; and the empty group, with no office written.
// prettier-ignore
const SIZES = [320, 450, 600, 780, 900, 1100, 1300, 1500, 1700, 2000, 2300, 2600, 3000, 3400, 3800, 4300, 4800, 5300, 5800, 6200];
// prettier-ignore
const SHARES = [0.21, 0.15, 0.24, 0.19, 0.12, 0.2, 0.17, 0.26, 0.16, 0.19, 0.14, 0.21, 0.18, 0.22, 0.17, 0.13, 0.2, 0.24, 0.16, 0.19];
// prettier-ignore
const BEFORE = [0.25, 0.14, 0.18, 0.2, 0.15, 0.19, 0.18, 0.21, 0.16, 0.2, 0.16, 0.2, 0.18, 0.19, 0.18, 0.15, 0.2, 0.2, 0.17, 0.19];

const OFFICES: Group[] = SIZES.map((records, i) => ({
  id: i + 1,
  records,
  p: SHARES[i],
  before: BEFORE[i],
  icd: Math.round((0.955 - 0.55 * SHARES[i]) * 1000) / 1000,
}));
const EMPTY: Group = { id: 0, records: 2450, p: 0.31, before: 0.27, icd: 0.742 };

const name = (lang: Lang, g: Group) => (g.id === 0 ? emptyGroup(lang) : office(lang, g.id));

const P_BAR = OFFICES.reduce((s, g) => s + g.p * g.records, 0) / OFFICES.reduce((s, g) => s + g.records, 0);
/** σ_z, the spread between offices: fixed here, from their moving range in the product. */
const SIGMA_Z = 2.5;
const limit = (n: number, sign: number) =>
  Math.min(1, Math.max(0, P_BAR + sign * 3 * Math.sqrt((P_BAR * (1 - P_BAR)) / n) * SIGMA_Z));

const pChart: Example = {
  query: ["Cifras por grupo", "Group figures"],
  needs: A_DIMENSION,
  make: (lang) => {
    const ns = Array.from({ length: 59 }, (_, i) => 250 + i * 107);
    const label = {
      in: pick(lang, ["En control", "In control"]),
      above: pick(lang, ["Señal: por encima del límite", "Signal: above the limit"]),
      below: pick(lang, ["Señal: por debajo del límite", "Signal: below the limit"]),
    };
    const points = OFFICES.map((g) => {
      const cls = g.p > limit(g.records, 1) ? "above" : g.p < limit(g.records, -1) ? "below" : "in";
      const icon = cls === "above" ? "✕ " : cls === "below" ? "✓ " : "";
      return {
        x: g.records,
        y: g.p,
        cls,
        label: `${icon}${name(lang, g)} · ${num(lang, g.records)} ${pick(lang, ["registros", "records"])} · ${label[cls as keyof typeof label]}`,
        value: pct(lang, g.p),
      };
    });
    return {
      title: pick(lang, ["Carta p′ por grupo · Oficina", "p′ chart by group · Office"]),
      note: pick(lang, [
        "Proporción de registros con al menos una falla grave, según el tamaño de la oficina. Las curvas son los límites de control: se estrechan con oficinas más grandes. El grupo vacío queda fuera.",
        "Share of records with at least one serious failure, by office size. The curves are the control limits: they narrow for larger offices. The empty group is left out.",
      ]),
      plot: {
        svg: scatter({
          points,
          classes: {
            in: { color: "var(--viz-muted)" },
            above: { color: "var(--viz-crit)" },
            below: { color: "var(--viz-good)" },
          },
          order: ["in", "below", "above"],
          xMin: 0,
          xMax: 6500,
          yMin: 0,
          yMax: 0.4,
          xFmt: (v) => num(lang, v),
          yFmt: (v) => pct(lang, v),
          xTitle: pick(lang, ["Registros de la oficina", "Records in the office"]),
          yTitle: pick(lang, ["Con falla grave", "With a serious failure"]),
          curves: [
            { pts: ns.map((n) => [n, limit(n, 1)]) },
            { pts: ns.map((n) => [n, limit(n, -1)]) },
          ],
          hlines: [{ value: P_BAR, label: `p̄ = ${pct(lang, P_BAR)}`, left: true }],
        }),
        legend: [
          { label: label.in, color: "var(--viz-muted)", kind: "dot" },
          { label: label.above, color: "var(--viz-crit)", kind: "dot", icon: "✕" },
          { label: label.below, color: "var(--viz-good)", kind: "dot", icon: "✓" },
          {
            label: pick(lang, ["Límites de control", "Control limits"]),
            color: "var(--viz-ink2)",
            kind: "line",
          },
        ],
        table: {
          head: [
            pick(lang, ["Oficina", "Office"]),
            pick(lang, ["Registros", "Records"]),
            pick(lang, ["Con falla grave", "With a serious failure"]),
            pick(lang, ["Límites", "Limits"]),
            pick(lang, ["Lectura", "Reading"]),
          ],
          rows: points.map((p, i) => [
            name(lang, OFFICES[i]),
            num(lang, p.x),
            p.value,
            `${pct(lang, limit(p.x, -1), 1)} – ${pct(lang, limit(p.x, 1), 1)}`,
            label[p.cls as keyof typeof label],
          ]),
        },
      },
    };
  },
};

const largestGroups: Example = {
  query: ["Cifras por grupo", "Group figures"],
  needs: A_DIMENSION,
  make: (lang) => {
    const top = [...OFFICES, EMPTY].sort((a, b) => b.records - a.records).slice(0, 15);
    const rows = top.map((g) => ({ label: name(lang, g), value: g.records }));
    const f = (v: number) => num(lang, v);
    return {
      title: pick(lang, ["Grupos más grandes · Oficina", "Largest groups · Office"]),
      note: pick(lang, [
        "Los 15 grupos con más registros, incluido el de la oficina vacía.",
        "The 15 groups with the most records, the empty office included.",
      ]),
      plot: {
        svg: bars({ rows, max: 6500, fmt: f, labelWidth: 110 }),
        table: {
          head: [
            pick(lang, ["Oficina", "Office"]),
            pick(lang, ["Registros", "Records"]),
            pick(lang, ["Con falla grave", "With a serious failure"]),
            pick(lang, ["ICD medio", "Mean ICD"]),
          ],
          rows: top.map((g) => [name(lang, g), f(g.records), pct(lang, g.p), num(lang, g.icd, 2)]),
        },
      },
    };
  },
};

const groupsChanged: Example = {
  query: ["Cifras por grupo, 2 cortes", "Group figures, 2 cuts"],
  needs: [
    "un campo de agrupación (aquí, oficina) y un corte anterior",
    "a grouping field (here, office) and a previous cut",
  ],
  make: (lang) => {
    const top = [...OFFICES, EMPTY]
      .map((g) => ({ g, change: Math.round((g.p - g.before) * 1e4) / 1e4 }))
      .filter((c) => c.change !== 0)
      .sort((a, b) => Math.abs(b.change) - Math.abs(a.change) || a.g.id - b.g.id)
      .slice(0, 15);
    const rows = top.map((c) => ({ label: name(lang, c.g), value: c.change }));
    const f = (v: number) => pp(lang, v);
    return {
      title: pick(lang, ["Grupos que más cambiaron · Oficina", "Groups that changed most · Office"]),
      note: pick(lang, [
        "Cambio de la proporción con falla grave frente al corte anterior, en puntos porcentuales: a la derecha empeoró, a la izquierda mejoró.",
        "Change in the share with a serious failure since the previous cut, in percentage points: right worsened, left improved.",
      ]),
      plot: {
        svg: diverging({ rows, max: 0.07, fmt: f, riseIsBad: true }),
        legend: [
          { label: pick(lang, ["Empeoró", "Worsened"]), color: "var(--viz-neg)" },
          { label: pick(lang, ["Mejoró", "Improved"]), color: "var(--viz-pos)" },
        ],
        table: {
          head: [
            pick(lang, ["Oficina", "Office"]),
            pick(lang, ["Corte anterior", "Previous cut"]),
            pick(lang, ["Este corte", "This cut"]),
            pick(lang, ["Cambio", "Change"]),
          ],
          rows: top.map((c) => [
            name(lang, c.g),
            pct(lang, c.g.before),
            pct(lang, c.g.p),
            f(c.change),
          ]),
        },
      },
    };
  },
};

const queues: Example = {
  query: ["Hallazgos por cola", "Queue findings"],
  needs: [
    "un campo de agrupación (aquí, oficina) y una llave de registro",
    "a grouping field (here, office) and a record key",
  ],
  make: (lang) => {
    // The 8 largest queues: open findings, overdue, resolved at this cut,
    // the oldest open one's age in days, the SLA and the summed priority.
    // prettier-ignore
    const data: [number, number, number, number, number, number, number][] = [
      [20, 2_180, 310, 640, 92, 30, 171],
      [18, 2_050, 520, 410, 123, 15, 186],
      [19, 1_620, 140, 590, 61, 30, 118],
      [17, 1_530, 380, 350, 92, 30, 129],
      [0, 1_180, 260, 90, 153, 30, 112],
      [16, 1_090, 90, 420, 61, 30, 77],
      [15, 1_060, 150, 300, 92, 30, 84],
      [14, 1_020, 210, 280, 92, 30, 88],
    ];
    const group = (id: number) => (id === 0 ? EMPTY : OFFICES[id - 1]);
    const names = data.map(([id]) => name(lang, group(id)));
    const series = [
      {
        label: pick(lang, ["Abiertos", "Open"]),
        color: "var(--viz-s1)",
        values: data.map((d) => d[1]),
      },
      {
        label: pick(lang, ["Vencidos", "Overdue"]),
        color: "var(--viz-crit)",
        values: data.map((d) => d[2]),
      },
    ];
    const f = (v: number) => num(lang, v);
    return {
      title: pick(lang, ["Colas de remediación · Oficina", "Remediation queues · Office"]),
      note: pick(lang, [
        "Hallazgos abiertos en la cola de cada oficina y, de ellos, los vencidos: abiertos desde un corte más de su ANS antes de este.",
        "Open findings in each office's queue and, of them, the overdue: open since a cut more than their SLA before this one.",
      ]),
      plot: {
        svg: columns({ cats: names, series, yMax: 2400, yFmt: f, valFmt: f, showValues: true }),
        legend: series.map((s) => ({ label: s.label, color: s.color })),
        table: {
          head: [
            pick(lang, ["Oficina", "Office"]),
            ...series.map((s) => s.label),
            pick(lang, ["Resueltos en este corte", "Resolved at this cut"]),
            pick(lang, ["Abierto más antiguo (días)", "Oldest open (days)"]),
            pick(lang, ["ANS (días)", "SLA (days)"]),
            pick(lang, ["Prioridad", "Priority"]),
          ],
          rows: data.map(([, open, overdue, resolved, oldest, sla, priority], i) => [
            names[i],
            f(open),
            f(overdue),
            f(resolved),
            f(oldest),
            f(sla),
            f(priority),
          ]),
        },
      },
    };
  },
};

export const GROUP_CHARTS: Record<string, Example> = {
  "p-chart": pChart,
  "largest-groups": largestGroups,
  "groups-changed": groupsChanged,
  queues,
};

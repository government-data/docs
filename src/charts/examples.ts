/* eslint-disable max-lines, max-lines-per-function -- the examples are data */
// The guide's charts, each with made-up figures: they show how a quality
// report reads, not any organisation's data. Round, invented numbers on
// purpose; names are generic («Office 01»).

import {
  bars,
  columns,
  diverging,
  dots,
  heatmap,
  lines,
  num,
  pct,
  scatter,
  stacked,
  type Figure,
  type Lang,
  type StackSeries,
} from "../chart-kit/index";

type Text = [es: string, en: string];
const pick = (lang: Lang, t: Text) => (lang === "es" ? t[0] : t[1]);

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
};
const field = (lang: Lang, key: string) => pick(lang, FIELDS[key]);
const office = (lang: Lang, i: number) =>
  `${pick(lang, ["Oficina", "Office"])} ${String(i).padStart(2, "0")}`;

function bands(lang: Lang): StackSeries[] {
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
const BAND_ICONS = ["✓", "!", "✕"];

const CHARTS: Record<string, (lang: Lang) => Figure> = {
  "igcd-trend": (lang) => {
    const xs = ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"];
    const conformity = [0.912, 0.918, 0.925, 0.931, 0.938, 0.944];
    const igcd = [0.781, 0.792, 0.806, 0.818, 0.833, 0.846];
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
          head: [pick(lang, ["Corte", "Cut"]), s1, s2],
          rows: xs.map((x, i) => [x, f(conformity[i]), f(igcd[i])]),
        },
      },
    };
  },

  "band-transitions": (lang) => {
    const names = bands(lang).map((b, i) => `${BAND_ICONS[i]} ${b.label.split(" (")[0]}`);
    const values = [
      [9240, 610, 150],
      [880, 4120, 470],
      [90, 640, 1800],
    ];
    const f = (v: number) => num(lang, v);
    return {
      title: pick(lang, [
        "Cómo se movieron los clientes entre bandas",
        "How customers moved between bands",
      ]),
      note: pick(lang, [
        "Filas: banda en el corte anterior. Columnas: banda en este corte. La diagonal son los que se quedaron igual.",
        "Rows: band at the previous cut. Columns: band at this cut. The diagonal stayed the same.",
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

  "office-change": (lang) => {
    const deltas = [0.061, 0.044, 0.031, 0.018, -0.012, -0.024, -0.038, -0.052];
    const ids = [7, 3, 12, 1, 9, 5, 14, 10];
    const f = (v: number) => (v > 0 ? "+" : v < 0 ? "−" : "") + num(lang, Math.abs(v), 3);
    const rows = ids.map((id, i) => ({ label: office(lang, id), value: deltas[i] }));
    return {
      title: pick(lang, [
        "Oficinas que más cambiaron (ICD promedio)",
        "Offices that changed most (mean ICD)",
      ]),
      note: pick(lang, [
        "Cambio del ICD promedio de sus clientes frente al corte anterior: a la derecha mejoraron, a la izquierda empeoraron.",
        "Change in their customers' mean ICD since the previous cut: right improved, left worsened.",
      ]),
      plot: {
        svg: diverging({ rows, max: 0.07, fmt: f }),
        legend: [
          { label: pick(lang, ["Mejoró", "Improved"]), color: "var(--viz-pos)" },
          { label: pick(lang, ["Empeoró", "Worsened"]), color: "var(--viz-neg)" },
        ],
        table: {
          head: [pick(lang, ["Oficina", "Office"]), pick(lang, ["Cambio del ICD", "ICD change"])],
          rows: rows.map((r) => [r.label, f(r.value)]),
        },
      },
    };
  },

  "bands-by-type": (lang) => {
    const series = bands(lang);
    const rows = [
      { label: pick(lang, ["Persona natural", "Individual"]), parts: [6210, 2730, 1060] },
      { label: pick(lang, ["Persona jurídica", "Company"]), parts: [380, 340, 280] },
    ];
    const share = (v: number, t: number) => pct(lang, v / t);
    return {
      title: pick(lang, [
        "Estado de los datos por tipo de cliente",
        "Data condition by customer type",
      ]),
      note: pick(lang, [
        "La banda define el trato: en buen estado, vinculación y actualización simplificadas; en malo, debida diligencia intensificada.",
        "The band sets the treatment: good means simplified onboarding and updates; poor means enhanced due diligence.",
      ]),
      plot: {
        svg: stacked({ rows, series, percent: true, fmt: share, labelWidth: 130 }),
        legend: series.map((s, i) => ({ label: s.label, color: s.color, icon: BAND_ICONS[i] })),
        table: {
          head: [pick(lang, ["Tipo", "Type"]), ...series.map((s) => s.label)],
          rows: rows.map((r) => {
            const t = r.parts.reduce((a, b) => a + b, 0);
            return [r.label, ...r.parts.map((p) => `${num(lang, p)} (${share(p, t)})`)];
          }),
        },
      },
    };
  },

  recency: (lang) => {
    const cats: Text[] = [
      ["< 1 año", "< 1 year"],
      ["1–2 años", "1–2 years"],
      ["2–3 años", "2–3 years"],
      ["3–5 años", "3–5 years"],
      ["> 5 años", "> 5 years"],
    ];
    const values = [0.41, 0.22, 0.14, 0.12, 0.11];
    const names = cats.map((c) => pick(lang, c));
    const f = (v: number) => pct(lang, v);
    return {
      title: pick(lang, [
        "Hace cuánto actualizaron sus datos los clientes activos",
        "How long ago active customers updated their data",
      ]),
      note: pick(lang, [
        "La regulación pide actualizar al menos una vez al año: todo lo que está a la derecha de la primera columna está vencido.",
        "Regulation asks for an update at least once a year: everything right of the first column is overdue.",
      ]),
      plot: {
        svg: columns({
          cats: names,
          series: [
            { label: pick(lang, ["Clientes", "Customers"]), color: "var(--viz-s1)", values },
          ],
          yMax: 0.5,
          yFmt: f,
          valFmt: f,
          showValues: true,
          height: 230,
        }),
        table: {
          head: [
            pick(lang, ["Última actualización", "Last update"]),
            pick(lang, ["Clientes activos", "Active customers"]),
          ],
          rows: names.map((n, i) => [n, f(values[i])]),
        },
      },
    };
  },

  "problems-by-type": (lang) => {
    const rows = [
      { label: pick(lang, ["Persona natural", "Individual"]), value: 0.34 },
      { label: pick(lang, ["Persona jurídica", "Company"]), value: 0.58 },
      { label: pick(lang, ["Todos", "All"]), value: 0.36 },
    ];
    const f = (v: number) => pct(lang, v);
    return {
      title: pick(lang, [
        "Clientes con al menos un problema, por tipo",
        "Customers with at least one problem, by type",
      ]),
      plot: {
        svg: bars({ rows, max: 1, fmt: f, labelWidth: 130 }),
        table: {
          head: [
            pick(lang, ["Tipo", "Type"]),
            pick(lang, ["Con algún problema", "With a problem"]),
          ],
          rows: rows.map((r) => [r.label, f(r.value)]),
        },
      },
    };
  },

  "top-fields": (lang) => {
    const data: [string, number][] = [
      ["updated", 3120],
      ["mobile", 1700],
      ["address", 1590],
      ["email", 1100],
      ["ciiu", 1060],
      ["income", 880],
      ["occupation", 750],
      ["stratum", 670],
      ["employer", 600],
      ["city", 560],
    ];
    const rows = data.map(([k, value]) => ({ label: field(lang, k), value }));
    const f = (v: number) => num(lang, v);
    return {
      title: pick(lang, [
        "Los 10 campos con más clientes afectados",
        "The 10 fields with the most customers affected",
      ]),
      plot: {
        svg: bars({ rows, max: 3200, fmt: f, labelWidth: 170 }),
        table: {
          head: [
            pick(lang, ["Campo", "Field"]),
            pick(lang, ["Clientes afectados", "Customers affected"]),
          ],
          rows: rows.map((r) => [r.label, f(r.value)]),
        },
      },
    };
  },

  "largest-offices": (lang) => {
    const data = [1030, 920, 880, 760, 750, 680, 650, 580, 550, 490, 470, 410, 390, 340, 290];
    const rows = data.map((value, i) => ({ label: office(lang, i + 1), value }));
    const f = (v: number) => num(lang, v);
    return {
      title: pick(lang, [
        "Clientes con problemas en las 15 oficinas más grandes",
        "Customers with problems in the 15 largest offices",
      ]),
      plot: {
        svg: bars({ rows, max: 1050, fmt: f, labelWidth: 110 }),
        table: {
          head: [
            pick(lang, ["Oficina", "Office"]),
            pick(lang, ["Clientes con problemas", "Customers with problems"]),
          ],
          rows: rows.map((r) => [r.label, f(r.value)]),
        },
      },
    };
  },

  "rule-conformity": (lang) => {
    const data: [string, Text, number][] = [
      ["R-12", ["Actualización de hace más de un año", "Updated over a year ago"], 0.58],
      ["R-08", ["Dirección sin nomenclatura", "Address without street format"], 0.66],
      [
        "R-04",
        [
          "Código de actividad incoherente con la ocupación",
          "Activity code inconsistent with occupation",
        ],
        0.71,
      ],
      ["R-31", ["Representante legal vacío", "Legal representative empty"], 0.74],
      ["R-09", ["Correo genérico", "Generic e-mail"], 0.78],
      ["R-14", ["Celular inválido", "Invalid mobile phone"], 0.81],
      ["R-15", ["Patrimonio ≠ activo − pasivo", "Net worth ≠ assets − liabilities"], 0.83],
      ["R-02", ["Ocupación vacía", "Occupation empty"], 0.85],
      ["R-21", ["Categoría de cliente vacía", "Customer category empty"], 0.86],
      ["R-11", ["Empresa vacía en empleados", "Employer empty for employees"], 0.88],
      ["R-17", ["Ciudad fuera del catálogo", "City not in the catalog"], 0.89],
      ["R-05", ["Ingresos vacíos", "Income empty"], 0.91],
      ["R-18", ["Celular compartido", "Shared mobile phone"], 0.93],
      ["R-01", ["Fecha de nacimiento vacía", "Date of birth empty"], 0.95],
      ["R-06", ["Nombre con caracteres inválidos", "Name with invalid characters"], 0.97],
    ];
    const rows = data.map(([id, t, v]) => ({
      label: `${id} · ${pick(lang, t)}`,
      value: v,
    }));
    const f = (v: number) => pct(lang, v);
    return {
      title: pick(lang, [
        "Las 15 reglas con menor conformidad",
        "The 15 rules with the lowest conformity",
      ]),
      note: pick(lang, ["La línea punteada marca el 90 %.", "The dashed line marks 90%."]),
      plot: {
        svg: bars({
          rows,
          max: 1,
          fmt: f,
          labelWidth: 270,
          ref: { value: 0.9, label: pct(lang, 0.9) },
        }),
        table: {
          head: [pick(lang, ["Regla", "Rule"]), pick(lang, ["Conformidad", "Conformity"])],
          rows: rows.map((r) => [r.label, f(r.value)]),
        },
      },
    };
  },

  "icd-distribution": (lang) => {
    const shares = [
      0.005, 0.008, 0.012, 0.019, 0.028, 0.041, 0.056, 0.074, 0.102, 0.148, 0.213, 0.294,
    ];
    const cats = shares.map((_, i) => num(lang, 0.4 + i * 0.05, 2));
    const f = (v: number) => pct(lang, v, 1);
    return {
      title: pick(lang, ["Distribución del ICD por cliente", "Distribution of the client ICD"]),
      note: pick(lang, [
        "Cada columna es un tramo de 0,05 (desde el valor que la nombra). Las líneas marcan las bandas: 0,75 y 0,90.",
        "Each column is a 0.05 bin (from the value that names it). The lines mark the bands: 0.75 and 0.90.",
      ]),
      plot: {
        svg: columns({
          cats,
          series: [
            {
              label: pick(lang, ["Clientes", "Customers"]),
              color: "var(--viz-s1)",
              values: shares,
            },
          ],
          yMax: 0.3,
          yFmt: (v) => pct(lang, v),
          valFmt: f,
          labelEvery: 2,
          edgeLabels: true,
          vrefs: [
            { at: 7, label: num(lang, 0.75, 2) },
            { at: 10, label: num(lang, 0.9, 2) },
          ],
        }),
        table: {
          head: [pick(lang, ["Tramo de ICD", "ICD bin"]), pick(lang, ["Clientes", "Customers"])],
          rows: shares.map((v, i) => [`${cats[i]} – ${num(lang, 0.45 + i * 0.05, 2)}`, f(v)]),
        },
      },
    };
  },

  "fields-lowest-icd": (lang) => {
    const data: [string, number][] = [
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
      ["landline", 0.91],
      ["marital", 0.93],
    ];
    const rows = data.map(([k, v]) => ({ label: field(lang, k), value: v }));
    const f = (v: number) => num(lang, v, 2);
    return {
      title: pick(lang, [
        "Los 12 campos con menor ICD medio",
        "The 12 fields with the lowest mean ICD",
      ]),
      plot: {
        svg: bars({
          rows,
          max: 1,
          fmt: f,
          labelWidth: 180,
          ref: { value: 0.9, label: pick(lang, ["Buen estado 0,90", "High band 0.90"]) },
        }),
        table: {
          head: [pick(lang, ["Campo", "Field"]), pick(lang, ["ICD medio", "Mean ICD"])],
          rows: rows.map((r) => [r.label, f(r.value)]),
        },
      },
    };
  },

  "sfc-cells": (lang) => {
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
        "Cada fila es una celda: vale 1 si al menos el 90 % de los clientes activos tiene el campo correcto. La franja (80–90 %) es donde menos correcciones cambian la celda de 0 a 1.",
        "Each row is a cell: it is 1 when at least 90% of active customers have the field right. The band (80–90%) is where the fewest fixes turn a cell from 0 to 1.",
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

  "p-chart": (lang) => {
    const offices: [number, number][] = [
      [320, 0.21],
      [450, 0.15],
      [600, 0.24],
      [780, 0.19],
      [900, 0.12],
      [1100, 0.2],
      [1300, 0.17],
      [1500, 0.26],
      [1700, 0.16],
      [2000, 0.19],
      [2300, 0.14],
      [2600, 0.21],
      [3000, 0.18],
      [3400, 0.22],
      [3800, 0.17],
      [4300, 0.13],
      [4800, 0.2],
      [5300, 0.24],
      [5800, 0.16],
      [6200, 0.19],
    ];
    const pBar = 0.18;
    const sigmaZ = 2.5;
    const limit = (n: number, sign: number) =>
      pBar + sign * 3 * Math.sqrt((pBar * (1 - pBar)) / n) * sigmaZ;
    const ns = Array.from({ length: 59 }, (_, i) => 250 + i * 107);
    const label = {
      in: pick(lang, ["En control", "In control"]),
      above: pick(lang, ["Señal: por encima del límite", "Signal: above the limit"]),
      below: pick(lang, ["Señal: por debajo del límite", "Signal: below the limit"]),
    };
    const points = offices.map(([n, p], i) => {
      const cls = p > limit(n, 1) ? "above" : p < limit(n, -1) ? "below" : "in";
      const icon = cls === "above" ? "✕ " : cls === "below" ? "✓ " : "";
      return {
        x: n,
        y: p,
        cls,
        label: `${icon}${office(lang, i + 1)} · ${num(lang, n)} ${pick(lang, ["clientes", "customers"])} · ${label[cls as keyof typeof label]}`,
        value: pct(lang, p),
      };
    });
    return {
      title: pick(lang, ["Carta p′ por oficina", "p′ chart by office"]),
      note: pick(lang, [
        "Proporción de clientes con al menos una falla de captura grave, según el tamaño de la oficina. Las curvas son los límites de control: se estrechan con oficinas más grandes.",
        "Share of customers with at least one serious capture failure, by office size. The curves are the control limits: they narrow for larger offices.",
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
          xTitle: pick(lang, ["Clientes de la oficina", "Customers in the office"]),
          yTitle: pick(lang, ["Con falla grave", "With a serious failure"]),
          curves: [
            { pts: ns.map((n) => [n, limit(n, 1)]) },
            { pts: ns.map((n) => [n, Math.max(0, limit(n, -1))]) },
          ],
          hlines: [{ value: pBar, label: `p̄ = ${pct(lang, pBar)}`, left: true }],
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
            pick(lang, ["Clientes", "Customers"]),
            pick(lang, ["Con falla grave", "With a serious failure"]),
            pick(lang, ["Límites", "Limits"]),
            pick(lang, ["Lectura", "Reading"]),
          ],
          rows: points.map((p, i) => [
            office(lang, i + 1),
            num(lang, p.x),
            p.value,
            `${pct(lang, Math.max(0, limit(p.x, -1)), 1)} – ${pct(lang, limit(p.x, 1), 1)}`,
            label[p.cls as keyof typeof label],
          ]),
        },
      },
    };
  },

  outliers: (lang) => {
    const groups: Text[] = [
      ["Empleado", "Employee"],
      ["Independiente", "Self-employed"],
      ["Pensionado", "Retiree"],
      ["Hogar", "Homemaker"],
      ["Estudiante", "Student"],
    ];
    // A fixed pseudo-random sequence: the same drawing in every build.
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    const normal = () => (rand() + rand() + rand() - 1.5) * 1.6;
    const special: [number, number, "outlier"][] = [
      [0, 3.8, "outlier"],
      [1, 4.4, "outlier"],
      [2, -3.9, "outlier"],
      [0, 6.1, "outlier"],
      [3, -5.2, "outlier"],
      [4, 7.4, "outlier"],
    ];
    const names = {
      normal: pick(lang, ["Normal", "Normal"]),
      outlier: pick(lang, ["Atípico", "Outlier"]),
    };
    const points = [
      ...groups.flatMap((g, gi) =>
        Array.from({ length: 36 }, () => {
          const z = normal();
          return {
            x: gi + (rand() - 0.5) * 0.5,
            y: z,
            cls: "normal",
            label: `${pick(lang, g)} · ${names.normal}`,
            value: `z = ${num(lang, z, 1)}`,
          };
        }),
      ),
      ...special.map(([gi, z, cls]) => ({
        x: gi + (rand() - 0.5) * 0.3,
        y: z,
        cls,
        label: `${pick(lang, groups[gi])} · ${names[cls]}`,
        value: `z = ${num(lang, z, 1)}`,
      })),
    ];
    return {
      title: pick(lang, ["Atípicos de ingresos por actividad", "Income outliers by activity"]),
      note: pick(lang, [
        "z robusto del ingreso frente al típico de su actividad. Más allá de ±3,5 es atípico.",
        "Robust z of the income against its activity's typical one. Beyond ±3.5 it is an outlier.",
      ]),
      plot: {
        svg: scatter({
          points,
          classes: {
            normal: { color: "var(--viz-muted)" },
            outlier: { color: "var(--viz-s1)" },
          },
          order: ["normal", "outlier"],
          xMin: -0.6,
          xMax: 4.6,
          yMin: -8,
          yMax: 8,
          xFmt: (v) => num(lang, v),
          yFmt: (v) => num(lang, v),
          xCats: groups.map((g, i) => ({ at: i, label: pick(lang, g) })),
          xTitle: pick(lang, ["Actividad laboral", "Occupation group"]),
          yTitle: pick(lang, ["z robusto", "Robust z"]),
          hlines: [
            { value: 3.5, label: `+${num(lang, 3.5, 1)}` },
            { value: -3.5, label: `−${num(lang, 3.5, 1)}` },
          ],
        }),
        legend: [
          { label: names.normal, color: "var(--viz-muted)", kind: "dot" },
          { label: names.outlier, color: "var(--viz-s1)", kind: "dot" },
        ],
        table: {
          head: [pick(lang, ["Actividad", "Activity"]), names.normal, names.outlier],
          rows: groups.map((g, gi) => [
            pick(lang, g),
            num(lang, 36),
            num(lang, special.filter(([i]) => i === gi).length),
          ]),
        },
      },
    };
  },

  psi: (lang) => {
    const base = Array(10).fill(0.1);
    const lot = [0.04, 0.05, 0.07, 0.08, 0.1, 0.11, 0.12, 0.13, 0.15, 0.15];
    const value = lot.reduce((s, a, k) => s + (a - base[k]) * Math.log(a / base[k]), 0);
    const reading =
      value < 0.1
        ? pick(lang, ["estable", "stable"])
        : value <= 0.25
          ? pick(lang, ["deriva moderada", "moderate change"])
          : pick(lang, ["deriva significativa", "large change"]);
    const cats = lot.map((_, i) => `D${i + 1}`);
    const s1 = pick(lang, ["Base", "Base"]);
    const s2 = pick(lang, ["Lote nuevo", "New batch"]);
    const f = (v: number) => pct(lang, v);
    return {
      title: `PSI = ${num(lang, value, 2)} · ${reading}`,
      note: pick(lang, [
        "Ingresos de un lote nuevo frente a la base, por deciles de la base (D1, el 10 % con menos ingresos). Si se parecieran, cada decil tendría cerca del 10 %. Menos de 0,10 es estable; de 0,10 a 0,25, deriva moderada; más de 0,25, deriva significativa.",
        "Income of a new batch against the base, by the base's deciles (D1, the lowest-income 10%). If alike, each decile would hold about 10%. Under 0.10 is stable; 0.10 to 0.25, moderate; over 0.25, large.",
      ]),
      plot: {
        svg: columns({
          cats,
          series: [
            { label: s1, color: "var(--viz-s1)", values: base },
            { label: s2, color: "var(--viz-s2)", values: lot },
          ],
          yMax: 0.16,
          yFmt: f,
          valFmt: f,
        }),
        legend: [
          { label: s1, color: "var(--viz-s1)" },
          { label: s2, color: "var(--viz-s2)" },
        ],
        table: {
          head: [pick(lang, ["Decil", "Decile"]), s1, s2],
          rows: cats.map((c, i) => [c, f(base[i]), f(lot[i])]),
        },
      },
    };
  },

  queues: (lang) => {
    const open = [1240, 1080, 960, 870, 720, 650];
    const overdue = [310, 520, 140, 380, 90, 260];
    const names = open.map((_, i) => office(lang, i + 1));
    const series = [
      { label: pick(lang, ["Abiertos", "Open"]), color: "var(--viz-s1)", values: open },
      { label: pick(lang, ["Vencidos", "Overdue"]), color: "var(--viz-crit)", values: overdue },
    ];
    const f = (v: number) => num(lang, v);
    return {
      title: pick(lang, ["Colas de remediación por oficina", "Remediation queues by office"]),
      note: pick(lang, [
        "Hallazgos abiertos en la cola de cada oficina y, de ellos, los que pasaron su ANS.",
        "Open findings in each office's queue and, of them, those past their SLA.",
      ]),
      plot: {
        svg: columns({
          cats: names,
          series,
          yMax: 1300,
          yFmt: f,
          valFmt: f,
          showValues: true,
        }),
        legend: series.map((s) => ({ label: s.label, color: s.color })),
        table: {
          head: [pick(lang, ["Oficina", "Office"]), ...series.map((s) => s.label)],
          rows: names.map((n, i) => [n, f(open[i]), f(overdue[i])]),
        },
      },
    };
  },

  performance: (lang) => {
    const stages: [Text, number][] = [
      [["Lectura del corte", "Reading the cut"], 8.4],
      [["Evaluación de reglas", "Evaluating rules"], 41.2],
      [["ICD e IGCD", "ICD and IGCD"], 6.1],
      [["Estadística", "Statistics"], 9.8],
      [["Colas", "Queues"], 3.2],
      [["Reporte", "Report"], 4.6],
    ];
    const clients = 400_000;
    const fieldsPerClient = 60;
    const total = stages.reduce((s, [, v]) => s + v, 0);
    const perMillion = total / 60 / ((clients * fieldsPerClient) / 1e6);
    const rows = stages.map(([t, v]) => ({ label: pick(lang, t), value: v }));
    const f = (v: number) => `${num(lang, v, 1)} s`;
    return {
      title: pick(lang, ["Tiempo por etapa de una ejecución", "Time per stage of a run"]),
      note: pick(lang, [
        `Total ${num(lang, total, 0)} s para ${num(lang, clients)} clientes y ${fieldsPerClient} campos: ${num(lang, perMillion, 3)} min por millón de valores (registros × campos), la unidad para comparar cortes.`,
        `Total ${num(lang, total, 0)} s for ${num(lang, clients)} customers and ${fieldsPerClient} fields: ${num(lang, perMillion, 3)} min per million values (records × fields), the unit to compare cuts with.`,
      ]),
      plot: {
        svg: bars({ rows, max: 45, fmt: f, labelWidth: 170 }),
        table: {
          head: [pick(lang, ["Etapa", "Stage"]), pick(lang, ["Tiempo", "Time"])],
          rows: rows.map((r) => [r.label, f(r.value)]),
        },
      },
    };
  },
};

// Where each chart's data comes from: the part of the results
// model it queries, in plain words, and what a dataset needs for the chart to apply. The
// examples are about clients; the queries work for any dataset.
const NOTHING: Text = ["nada: aplica a todos los datasets", "nothing: it applies to every dataset"];
const SOURCES: Record<string, { query: Text; needs: Text }> = {
  "igcd-trend": {
    query: ["Resumen del corte y resultados por regla", "Cut summary and rule results"],
    needs: NOTHING,
  },
  "band-transitions": {
    query: ["ICD por entidad, 2 cortes", "Entity ICD, 2 cuts"],
    needs: ["una llave de entidad y dos cortes", "an entity key and two cuts"],
  },
  "office-change": {
    query: ["Cifras por grupo, 2 cortes", "Group figures, 2 cuts"],
    needs: ["un campo de agrupación (aquí, oficina)", "a grouping field (here, office)"],
  },
  "bands-by-type": {
    query: ["ICD por entidad", "Entity ICD"],
    needs: [
      "una llave de entidad y un segmento (aquí, tipo de cliente)",
      "an entity key and a segment (here, customer type)",
    ],
  },
  recency: {
    query: ["Calidad por campo", "Field quality"],
    needs: ["un campo con rol «fecha de actualización»", "a field with the «update date» role"],
  },
  "problems-by-type": {
    query: ["ICD por entidad", "Entity ICD"],
    needs: [
      "una llave de entidad y un segmento (aquí, tipo de cliente)",
      "an entity key and a segment (here, customer type)",
    ],
  },
  "top-fields": { query: ["Resultados por regla", "Rule results"], needs: NOTHING },
  "largest-offices": {
    query: ["Cifras por grupo", "Group figures"],
    needs: ["un campo de agrupación (aquí, oficina)", "a grouping field (here, office)"],
  },
  "rule-conformity": { query: ["Resultados por regla", "Rule results"], needs: NOTHING },
  "icd-distribution": {
    query: ["ICD por entidad", "Entity ICD"],
    needs: ["una llave de entidad", "an entity key"],
  },
  "fields-lowest-icd": { query: ["Calidad por campo", "Field quality"], needs: NOTHING },
  "sfc-cells": {
    query: ["Celdas SFC", "SFC cells"],
    needs: [
      "que el dataset participe en el indicador SFC",
      "the dataset takes part in the SFC indicator",
    ],
  },
  "p-chart": {
    query: ["Cifras por grupo", "Group figures"],
    needs: ["un campo de agrupación (aquí, oficina)", "a grouping field (here, office)"],
  },
  outliers: {
    query: ["Pruebas de distribución", "Distribution checks"],
    needs: [
      "un importe de atípicos y un campo de agrupación (aquí, ingresos por actividad)",
      "an outlier amount and a dimension to compare within (here, income by occupation)",
    ],
  },
  psi: {
    query: ["Pruebas de distribución", "Distribution checks"],
    needs: ["una variable de deriva (aquí, ingresos)", "a drift variable (here, income)"],
  },
  queues: {
    query: ["Hallazgos por cola", "Queue findings"],
    needs: [
      "un campo de agrupación (aquí, oficina) y una llave de registro",
      "a grouping field (here, office) and a record key",
    ],
  },
  performance: { query: ["Registro de la evaluación", "Evaluation log"], needs: NOTHING },
};

export function chart(id: string, lang: Lang): Figure {
  const make = CHARTS[id];
  if (!make) throw new Error(`No chart named "${id}"`);
  const source = SOURCES[id];
  return {
    ...make(lang),
    source: source && { query: pick(lang, source.query), needs: pick(lang, source.needs) },
  };
}

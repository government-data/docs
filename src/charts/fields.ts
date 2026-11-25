// The example charts of the fields and of the run: how long ago the records
// were updated, the fields' profile, and the time per stage.

import { bars, columns, num, pct } from "../chart-kit/index";
import { RECORDS } from "./rules";
import { field, NOTHING, pick, type Example, type Text } from "./shared";

const recency: Example = {
  query: ["Calidad por campo", "Field quality"],
  needs: ["un campo con rol «fecha de actualización»", "a field with the «update date» role"],
  make: (lang) => {
    // Each band's share of the records, and the A it gives at its ends
    // (0.5 to the power of days / 365); no date, no A.
    const data: [Text, number, string][] = [
      [["Posterior al corte", "After the cut"], 0.004, "1,00"],
      [["Hasta 30 días", "Up to 30 days"], 0.09, "1,00–0,94"],
      [["31–90 días", "31–90 days"], 0.14, "0,94–0,84"],
      [["91–180 días", "91–180 days"], 0.15, "0,84–0,71"],
      [["181–365 días", "181–365 days"], 0.19, "0,71–0,50"],
      [["366–730 días", "366–730 days"], 0.18, "0,50–0,25"],
      [["Más de 730 días", "Over 730 days"], 0.21, "< 0,25"],
      [["Sin fecha", "No date"], 0.036, "—"],
    ];
    const names = data.map(([t]) => pick(lang, t));
    const values = data.map(([, v]) => v);
    const a = (s: string) => (lang === "es" ? s : s.replace(/,/g, "."));
    const f = (v: number) => pct(lang, v, v < 0.01 ? 1 : 0);
    return {
      title: pick(lang, ["Antigüedad de la actualización", "Update recency"]),
      note: pick(lang, [
        "Los registros según los días entre su fecha de actualización y el corte. El A de un campo que caduca baja desde el primer día y vale 0,50 al año.",
        "The records by the days from their update date to the cut. The A of a field that expires falls from the first day and is 0.50 at a year.",
      ]),
      plot: {
        svg: columns({
          cats: names.map((n) => n.replace(" días", "").replace(" days", "")),
          series: [
            { label: pick(lang, ["Registros", "Records"]), color: "var(--viz-s1)", values },
          ],
          yMax: 0.25,
          yFmt: (v) => pct(lang, v),
          valFmt: f,
          showValues: true,
          height: 230,
        }),
        table: {
          head: [
            pick(lang, ["Última actualización", "Last update"]),
            pick(lang, ["Registros", "Records"]),
            pick(lang, ["A de un campo que caduca", "A of a field that expires"]),
          ],
          rows: data.map(([, v, range], i) => [
            names[i],
            `${num(lang, Math.round(v * RECORDS))} (${f(v)})`,
            a(range),
          ]),
        },
      },
    };
  },
};

const profiling: Example = {
  query: ["Calidad por campo", "Field quality"],
  needs: NOTHING,
  make: (lang) => {
    // Field, empty share, distinct values, commonest shape, its share of the filled.
    const data: [string, number, number, string, number][] = [
      ["landline", 0.412, 28_400, "9999999", 0.92],
      ["email", 0.084, 45_100, "AAAAAAAA@AAAAA.AAA", 0.061],
      ["mobile", 0.031, 51_300, "9999999999", 0.992],
      ["address", 0.022, 49_800, "AAAAA 99 # 99 - 99", 0.12],
      ["ciiu", 0.016, 286, "9999", 0.813],
      ["birth", 0.004, 17_950, "9999-99-99", 0.996],
      ["city", 0.002, 412, "99999", 0.975],
      ["name", 0, 50_900, "AAAA AAAAAAA", 0.032],
    ];
    const rows = data.map(([k, e]) => ({ label: field(lang, k), value: e }));
    const f = (v: number) => pct(lang, v, 1);
    return {
      title: pick(lang, ["Perfilado: campos más vacíos", "Profiling: the emptiest fields"]),
      note: pick(lang, [
        "Vacío es nulo o solo espacios. La forma cambia cada dígito por 9 y cada letra de la A a la Z por A, y se corta a 40 caracteres.",
        "Empty is null or only spaces. The shape turns each digit into 9 and each letter A to Z into A, cut at 40 characters.",
      ]),
      plot: {
        svg: bars({ rows, max: 0.5, fmt: f, labelWidth: 170 }),
        table: {
          head: [
            pick(lang, ["Campo", "Field"]),
            pick(lang, ["Vacíos", "Empty"]),
            pick(lang, ["Distintos", "Distinct"]),
            pick(lang, ["Forma más común", "Commonest shape"]),
            pick(lang, ["De los llenos", "Of the filled"]),
          ],
          rows: data.map(([k, e, d, shape, share]) => [
            field(lang, k),
            f(e),
            num(lang, d),
            shape,
            f(share),
          ]),
        },
      },
    };
  },
};

const performance: Example = {
  query: ["Registro de la evaluación", "Evaluation log"],
  needs: NOTHING,
  make: (lang) => {
    const fields = 40;
    const previousRecords = 54_300;
    // Each stage's milliseconds in this cut and in the previous one.
    const stages: [Text, number, number][] = [
      [["Cargar el corte", "Load the cut"], 4_150, 4_090],
      [["Ejecutar las reglas", "Run the rules"], 16_200, 15_300],
      [["Perfilar", "Profile"], 2_400, 2_380],
      [["ICD y grupos", "ICD and groups"], 2_850, 2_790],
      [["Colas de remediación", "Remediation queues"], 1_310, 1_280],
      [["Recencia de actualización", "Update recency"], 200, 190],
      [["Distribuciones", "Distributions"], 920, 900],
    ];
    const millions = (RECORDS * fields) / 1e6;
    const previousMillions = (previousRecords * fields) / 1e6;
    const rows = stages.map(([t, ms]) => ({ label: pick(lang, t), value: ms / millions }));
    const f = (v: number) => `${num(lang, v)} ms`;
    return {
      title: pick(lang, ["Tiempo por etapa", "Time per stage"]),
      note: pick(lang, [
        `Milisegundos por millón de valores: ${num(lang, RECORDS)} registros × ${fields} campos mapeados = ${num(lang, millions, 3)} millones.`,
        `Milliseconds per million values: ${num(lang, RECORDS)} records × ${fields} mapped fields = ${num(lang, millions, 3)} million.`,
      ]),
      plot: {
        svg: bars({ rows, max: 8000, fmt: f, labelWidth: 190 }),
        table: {
          head: [
            pick(lang, ["Etapa", "Stage"]),
            pick(lang, ["Tiempo", "Time"]),
            pick(lang, ["Por millón", "Per million"]),
            pick(lang, ["Por millón, corte anterior", "Per million, previous cut"]),
          ],
          rows: stages.map(([t, ms, prev]) => [
            pick(lang, t),
            f(ms),
            f(ms / millions),
            f(prev / previousMillions),
          ]),
        },
      },
    };
  },
};

export const FIELD_CHARTS: Record<string, Example> = {
  recency,
  profiling,
  performance,
};

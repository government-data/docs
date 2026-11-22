// The data a FlowDiagram draws, and the flows more than one page draws: today
// the chain on Concepts, from a source to a remediation queue, in English and
// Spanish with the labels the page and the app use.

/** A colour from Starlight's theme, for one group of steps. */
export type Tone = "accent" | "green" | "orange" | "purple" | "blue" | "red" | "gray";

export interface Step {
  label: string;
  /** A few words: what the step is, or what it hands to the next. */
  caption?: string;
  /** Where the step is explained, such as its section of the page. */
  href?: string;
  /** The id of its group; consecutive steps of one group are framed together. */
  group?: string;
}

export interface Group {
  id: string;
  /** Who acts at these steps, shown above them. */
  label: string;
  tone?: Tone;
}

export interface Flow {
  steps: Step[];
  groups?: Group[];
  /** The flow told in one sentence, under the diagram. */
  caption: string;
  /** What brings the flow back to its start, if anything. */
  loop?: string;
  /** Steps per row on a wide screen (4 by default). */
  perRow?: number;
}

export type Lang = "en" | "es";

const CHAIN = {
  en: {
    groups: ["Data steward", "Automatic", "Manager or compliance reader", "Analyst"],
    steps: [
      ["Source", "A database the organisation already runs, only read", "source"],
      [
        "Dataset and mapping",
        "One table: its fields, record key and grouping field",
        "dataset-and-mapping",
      ],
      ["Rules", "Checks on the fields; those on main count", "rules"],
      ["Cut", "The data as it was on one date, copied to the lake", "cut"],
      ["Evaluation", "Every rule on every record: fails, passes or does not apply", "evaluation"],
      [
        "Results and indicators",
        "Counts per rule; conformity, ICD, IGCD",
        "results-and-indicators",
      ],
      ["Dashboard", "The charts of the cut you choose", "dashboard"],
      ["Remediation queue", "The findings of one group, with its SLA", "remediation-queue"],
    ],
    loop: "The data is fixed in the source; the next cut shows the fix, and the chain starts again.",
    caption:
      "The chain, in order: the data steward connects a source, maps a table into a dataset, writes the rules and takes a cut; Quality Data evaluates it on its own; managers and compliance readers read the results, indicators and dashboard; an analyst works a remediation queue. Each step links to its section.",
  },
  es: {
    groups: ["Responsable de datos", "Automático", "Gerencia o cumplimiento", "Analista"],
    steps: [
      ["Fuente", "Una base de datos que la organización ya tiene, solo leída", "fuente"],
      [
        "Dataset y mapeo",
        "Una tabla: sus campos, llave del registro y campo de agrupación",
        "dataset-y-mapeo",
      ],
      ["Reglas", "Revisiones de los campos; cuentan las de main", "reglas"],
      ["Corte", "Los datos tal como estaban en una fecha, copiados al lago", "corte"],
      ["Evaluación", "Cada regla sobre cada registro: falla, pasa o no aplica", "evaluación"],
      [
        "Resultados e indicadores",
        "Conteos por regla; conformidad, ICD, IGCD",
        "resultados-e-indicadores",
      ],
      ["Dashboard", "Las gráficas del corte que se elija", "dashboard"],
      ["Cola de remediación", "Los hallazgos de un grupo, con su ANS", "cola-de-remediación"],
    ],
    loop: "El dato se corrige en la fuente; el siguiente corte muestra la corrección, y la cadena vuelve a empezar.",
    caption:
      "La cadena, en orden: el responsable de datos conecta una fuente, mapea una tabla en un dataset, escribe las reglas y toma un corte; Quality Data lo evalúa sin que nadie intervenga; la gerencia lee los resultados, los indicadores y el dashboard; un analista atiende una cola de remediación. Cada paso enlaza a su sección.",
  },
} as const;

const GROUPS = ["steward", "product", "reader", "analyst"] as const;
const TONES: Tone[] = ["accent", "gray", "purple", "orange"];
// Which group acts at each of the eight steps.
const STEP_GROUP = [0, 0, 0, 0, 1, 2, 2, 3];

/** The chain on Concepts in a language; `page` is the path to Concepts from
 * the page that draws it ("" on Concepts itself, "../concepts/" beside it). */
export function chain(lang: Lang, page = ""): Flow {
  const t = CHAIN[lang];
  return {
    groups: GROUPS.map((id, k) => ({ id, label: t.groups[k], tone: TONES[k] })),
    steps: t.steps.map(([label, caption, anchor], k) => ({
      label,
      caption,
      href: `${page}#${anchor}`,
      group: GROUPS[STEP_GROUP[k]],
    })),
    loop: t.loop,
    caption: t.caption,
  };
}

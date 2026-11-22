// The flows the Method pages draw, in English and Spanish: the quality cycle
// the product follows (Method: how quality is measured) and the chain from a
// rule's result to an indicator and a decision (Method: from results to
// indicators). Each step links to where it is explained.
import type { Flow, Lang, Tone } from "./flows";

export type MethodFlow = "cycle" | "indicator";

interface Path {
  /** Who acts, or at what level, by group: the label above its steps. */
  groups: string[];
  /** Label, caption, link (an anchor of the page, or another page), group index. */
  steps: [string, string, string, number][];
  caption: string;
  /** What brings the flow back to its start, if anything. */
  loop?: string;
}

const TONES: Record<MethodFlow, Tone[]> = {
  cycle: ["accent", "gray", "purple", "orange"],
  indicator: ["accent", "green", "purple", "blue", "orange"],
};

const PER_ROW: Record<MethodFlow, number> = { cycle: 5, indicator: 4 };

const FLOWS: Record<MethodFlow, Record<Lang, Path>> = {
  cycle: {
    en: {
      groups: ["Data steward", "Automatic", "Managers and stewards", "Analyst"],
      steps: [
        ["Define", "Each requirement written as a rule, approved on main", "#define", 0],
        ["Measure", "A cut, and every rule on every record", "#measure", 1],
        ["Analyse", "Indicators and charts of the cut", "#analyse", 2],
        ["Improve", "Queues of findings, fixed in the source", "#improve", 3],
        ["Control", "The next cut shows whether it held", "#control", 1],
      ],
      caption:
        "The quality cycle as Quality Data follows it: requirements are defined as rules, measured on a cut, analysed on the dashboard, improved where the data lives, and controlled by the next cut. Each step links to its section.",
      loop: "Control feeds the next definition: rules are tuned, and the cycle starts again.",
    },
    es: {
      groups: ["Responsable de datos", "Automático", "Gerencia y responsables", "Analista"],
      steps: [
        ["Definir", "Cada requisito escrito como regla, aprobada en main", "#definir", 0],
        ["Medir", "Un corte, y cada regla sobre cada registro", "#medir", 1],
        ["Analizar", "Indicadores y gráficas del corte", "#analizar", 2],
        ["Mejorar", "Colas de hallazgos, corregidos en el origen", "#mejorar", 3],
        ["Controlar", "El siguiente corte muestra si se sostuvo", "#controlar", 1],
      ],
      caption:
        "El ciclo de calidad tal como lo sigue Quality Data: los requisitos se definen como reglas, se miden sobre un corte, se analizan en el dashboard, se mejoran donde viven los datos y se controlan con el siguiente corte. Cada paso enlaza a su sección.",
      loop: "El control alimenta la siguiente definición: se ajustan las reglas y el ciclo vuelve a empezar.",
    },
  },
  indicator: {
    en: {
      groups: ["Per rule", "Per record", "Per entity", "Per dataset", "People"],
      steps: [
        ["Rule results", "Each record fails, passes or does not apply", "#rule-results", 0],
        ["Conformity", "The share of the records a rule applies to that pass", "#conformity", 0],
        ["Field ICD", "Its own rules, rules across fields, its age", "#the-icd-of-a-field", 1],
        [
          "Record ICD",
          "Its fields, weighted by priority",
          "#the-icd-of-a-record-and-of-an-entity",
          1,
        ],
        [
          "Entity ICD",
          "The records of one customer or company",
          "#the-icd-of-a-record-and-of-an-entity",
          2,
        ],
        ["Band", "Good, fair or poor", "#bands", 2],
        ["IGCD", "The mean, the one figure to follow", "#the-igcd", 3],
        ["Decision", "Where to fix, update or look for a cause", "#reading-an-indicator", 4],
      ],
      caption:
        "From a rule's result to a decision: results per record give each rule's conformity and each field's ICD; fields add up to a record's ICD, records to an entity's, with its band; entities to the dataset's IGCD; people read them to decide. Each step links to its section.",
    },
    es: {
      groups: ["Por regla", "Por registro", "Por entidad", "Por dataset", "Personas"],
      steps: [
        ["Resultados", "Cada registro falla, pasa o no aplica", "#resultados-de-las-reglas", 0],
        ["Conformidad", "La parte de los registros a los que aplica que pasan", "#conformidad", 0],
        [
          "ICD del campo",
          "Sus reglas, las reglas entre campos, su antigüedad",
          "#el-icd-de-un-campo",
          1,
        ],
        [
          "ICD del registro",
          "Sus campos, pesados por prioridad",
          "#el-icd-de-un-registro-y-de-una-entidad",
          1,
        ],
        [
          "ICD de la entidad",
          "Los registros de un cliente o empresa",
          "#el-icd-de-un-registro-y-de-una-entidad",
          2,
        ],
        ["Banda", "Buen estado, regular o malo", "#bandas", 2],
        ["IGCD", "La media, la cifra que se sigue", "#el-igcd", 3],
        ["Decisión", "Dónde corregir, actualizar o buscar una causa", "#cómo-leer-un-indicador", 4],
      ],
      caption:
        "Del resultado de una regla a una decisión: los resultados por registro dan la conformidad de cada regla y el ICD de cada campo; los campos suman el ICD del registro, los registros el de la entidad, con su banda; las entidades, el IGCD del dataset; las personas los leen para decidir. Cada paso enlaza a su sección.",
    },
  },
};

/** A Method page's flow in a language, for the page that draws it. */
export function methodFlow(flow: MethodFlow, lang: Lang): Flow {
  const p = FLOWS[flow][lang];
  const ids = p.groups.map((_, k) => `g${k}`);
  return {
    groups: p.groups.map((label, k) => ({ id: ids[k], label, tone: TONES[flow][k] })),
    steps: p.steps.map(([label, caption, href, g]) => ({ label, caption, href, group: ids[g] })),
    caption: p.caption,
    loop: p.loop,
    perRow: PER_ROW[flow],
  };
}

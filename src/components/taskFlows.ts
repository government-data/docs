// The flows the Tasks pages draw, in English and Spanish with the labels the
// pages and the app use: what mapping a table sets going, the life of a cut
// through its stages, a rules change from a draft to main, the questions the
// dashboard answers in turn, and the remediation cycle. Each step links to
// where the page explains it.
import type { Flow, Lang, Tone } from "./flows";

export type TaskFlow = "map" | "cut" | "draft" | "dashboard" | "queue";

interface Path {
  /** Who acts, by group: the label above its steps. */
  groups: string[];
  /** Label, caption, link (an anchor of the page, or another page), group index. */
  steps: [string, string, string, number][];
  caption: string;
  /** What brings the flow back to its start, if anything. */
  loop?: string;
}

const TONES: Tone[] = ["accent", "gray"];
// A flow whose groups are not "who acts, then automatic".
const FLOW_TONES: Partial<Record<TaskFlow, Tone[]>> = {
  draft: ["accent", "green", "gray"],
  dashboard: ["accent"],
  queue: ["accent", "green", "gray"],
};

const FLOWS: Record<TaskFlow, Record<Lang, Path>> = {
  map: {
    en: {
      groups: ["Data steward", "Automatic"],
      steps: [
        ["Map and collect", "You pick the table and name the dataset", "#to-map-a-table", 0],
        ["Sample", "10,000 records profiled, counts only", "#what-the-proposal-does", 1],
        ["Publish", "The mapping and proposed rules, on main", "#what-the-proposal-does", 1],
        ["First cut", "Today's data copied into the lake", "../run-cuts/#what-a-cut-is", 1],
        ["Evaluate", "A notice says the dataset is ready", "#to-see-what-was-proposed", 1],
      ],
      caption:
        "Mapping a table: you choose the table and the dataset's name; Quality Data samples the table, publishes the mapping and the rules it proposes, takes the first cut and evaluates it. Each step links to where it is explained.",
    },
    es: {
      groups: ["Responsable de datos", "Automático"],
      steps: [
        [
          "Mapear y recolectar",
          "Eliges la tabla y nombras el dataset",
          "#para-mapear-una-tabla",
          0,
        ],
        ["Muestra", "10.000 registros perfilados, solo conteos", "#qué-hace-la-propuesta", 1],
        ["Publicación", "El mapeo y las reglas propuestas, en main", "#qué-hace-la-propuesta", 1],
        ["Primer corte", "Los datos de hoy, copiados al lago", "../run-cuts/#qué-es-un-corte", 1],
        ["Evaluación", "Un aviso dice que el dataset está listo", "#para-ver-qué-se-propuso", 1],
      ],
      caption:
        "Mapear una tabla: eliges la tabla y el nombre del dataset; Quality Data toma una muestra de la tabla, publica el mapeo y las reglas que propone, toma el primer corte y lo evalúa. Cada paso enlaza a donde se explica.",
    },
  },
  cut: {
    en: {
      groups: ["You or a schedule", "Automatic"],
      steps: [
        ["Start", "Run now, or a schedule fires", "#to-run-a-cut-now", 0],
        [
          "Extracting",
          "Waits for a worker, then copies the source's table into the lake",
          "#to-follow-a-run",
          1,
        ],
        ["Evaluating", "Every rule on main, on every record", "#to-follow-a-run", 1],
        ["Evaluated", "The results, on the dashboard", "#where-the-history-is", 1],
      ],
      caption:
        "The life of a cut: Run now or a schedule starts it; a worker copies the table into the lake (Extracting), then runs the rules on it (Evaluating); the cut is Evaluated and its results reach the dashboard. If either stage fails, the cut is Failed: see When a run fails.",
    },
    es: {
      groups: ["Tú o una programación", "Automático"],
      steps: [
        [
          "Inicio",
          "Ejecutar ahora, o una programación se dispara",
          "#para-ejecutar-un-corte-ahora",
          0,
        ],
        [
          "Extrayendo",
          "Espera un worker y copia la tabla de la fuente al lago",
          "#para-seguir-una-ejecución",
          1,
        ],
        ["Evaluando", "Cada regla de main, sobre cada registro", "#para-seguir-una-ejecución", 1],
        ["Evaluado", "Los resultados, en el dashboard", "#dónde-está-el-historial", 1],
      ],
      caption:
        "La vida de un corte: Ejecutar ahora o una programación lo inicia; un worker copia la tabla al lago (Extrayendo) y luego le corre las reglas (Evaluando); el corte queda Evaluado y sus resultados llegan al dashboard. Si una de las dos etapas falla, el corte queda en Falló: ver Si una ejecución falla.",
    },
  },
  draft: {
    en: {
      groups: ["Rule author", "Approver", "Automatic"],
      steps: [
        [
          "Save as a draft",
          "The change is kept apart; main does not move",
          "#to-save-a-change-as-a-draft",
          0,
        ],
        [
          "Review",
          "History, Open drafts, Review: the changes and any errors",
          "#to-review-a-draft",
          1,
        ],
        ["Approve", "The draft goes into main; or Discard it", "#to-approve-or-discard-a-draft", 1],
        ["Next cut", "Evaluated with the rules on main", "../run-cuts/#what-a-cut-is", 2],
      ],
      caption:
        "From a draft to main: the author saves the change as a draft, an approver reviews it from the field's history and approves or discards it, and the next cut is measured with what is on main. Whoever may approve goes straight to main with Deploy, after the same check.",
    },
    es: {
      groups: ["Autor de la regla", "Aprobador", "Automático"],
      steps: [
        [
          "Guardar como borrador",
          "El cambio queda aparte; main no se mueve",
          "#para-guardar-un-cambio-como-borrador",
          0,
        ],
        [
          "Revisar",
          "Historial, Borradores abiertos, Revisar: los cambios y sus errores",
          "#para-revisar-un-borrador",
          1,
        ],
        [
          "Aprobar",
          "El borrador entra en main; o Descartarlo",
          "#para-aprobar-o-descartar-un-borrador",
          1,
        ],
        ["Siguiente corte", "Se evalúa con las reglas de main", "../run-cuts/#qué-es-un-corte", 2],
      ],
      caption:
        "De un borrador a main: el autor guarda el cambio como borrador, un aprobador lo revisa desde el historial del campo y lo aprueba o lo descarta, y el siguiente corte se mide con lo que hay en main. Quien puede aprobar va directo a main con Desplegar, tras la misma revisión.",
    },
  },
  dashboard: {
    en: {
      groups: ["The dashboard, at the cut you choose"],
      steps: [
        [
          "Better or worse?",
          "Conformity and IGCD by cut",
          "#is-quality-getting-better-or-worse",
          0,
        ],
        ["What kind?", "Failures by dimension and severity", "#what-kind-of-problem-dominates", 0],
        ["Where?", "Fields with the most failures", "#where-does-it-fail", 0],
        ["Which rule?", "Rules with the lowest conformity", "#which-rule-fails-and-on-what", 0],
        ["Which group?", "The groups' charts and the queues", "#which-group-fails", 0],
      ],
      caption:
        "A question followed down the dashboard: first whether quality is getting better, then what kind of problem dominates, in which fields, which rules produce it, and which groups. Each step links to its section.",
    },
    es: {
      groups: ["El dashboard, en el corte que elijas"],
      steps: [
        ["¿Mejora o empeora?", "Conformidad e IGCD por corte", "#la-calidad-mejora-o-empeora", 0],
        ["¿De qué tipo?", "Fallos por dimensión y severidad", "#qué-tipo-de-problema-domina", 0],
        ["¿Dónde?", "Campos con más fallos", "#dónde-falla", 0],
        ["¿Qué regla?", "Reglas con menor conformidad", "#qué-regla-falla-y-sobre-qué", 0],
        ["¿Qué grupo?", "Las gráficas de grupos y las colas", "#qué-grupo-falla", 0],
      ],
      caption:
        "Una pregunta seguida por el dashboard: primero si la calidad mejora, luego qué tipo de problema domina, en qué campos, qué reglas lo producen y en qué grupos. Cada paso enlaza a su sección.",
    },
  },
  queue: {
    en: {
      groups: ["Analyst", "Source system", "Automatic"],
      steps: [
        [
          "Find",
          "Your group's queue, and the fields and rules behind it",
          "#to-read-your-queue",
          0,
        ],
        ["See examples", "Test on a rule: a few records of each outcome", "#to-find-what-fails", 0],
        [
          "Fix at the source",
          "Whoever owns the records corrects them there",
          "#to-get-it-fixed-in-the-source",
          1,
        ],
        ["Next cut", "A schedule, or Run now", "#to-confirm-at-the-next-cut", 2],
        ["Confirm", "Open drops at the new cut", "#to-confirm-at-the-next-cut", 0],
      ],
      caption:
        "The remediation cycle: you find your group's queue and what makes it up, look at examples, have the records fixed in the source system, and the next cut confirms it. Quality Data only reads: nothing is fixed inside it.",
      loop: "What still fails at the new cut stays open: start again from what remains.",
    },
    es: {
      groups: ["Analista", "Sistema de origen", "Automático"],
      steps: [
        [
          "Encontrar",
          "La cola de tu grupo, y los campos y reglas detrás",
          "#para-leer-la-cola-de-un-grupo",
          0,
        ],
        [
          "Ver ejemplos",
          "Probar sobre una regla: unos registros de cada resultado",
          "#para-encontrar-qué-falla",
          0,
        ],
        [
          "Corregir en el origen",
          "Quien es dueño de los registros los corrige allí",
          "#para-que-se-corrija-en-el-origen",
          1,
        ],
        [
          "Siguiente corte",
          "Una programación, o Ejecutar ahora",
          "#para-confirmar-en-el-siguiente-corte",
          2,
        ],
        [
          "Confirmar",
          "Los Abiertos bajan en el corte nuevo",
          "#para-confirmar-en-el-siguiente-corte",
          0,
        ],
      ],
      caption:
        "El ciclo de remediación: encuentras la cola de tu grupo y lo que la forma, miras ejemplos, haces que se corrijan los registros en el sistema de origen, y el siguiente corte lo confirma. Quality Data solo lee: dentro de él no se corrige nada.",
      loop: "Lo que sigue fallando en el corte nuevo queda abierto: vuelve a empezar con lo que quede.",
    },
  },
};

/** A Tasks page's flow in a language, for the page that draws it. */
export function taskFlow(flow: TaskFlow, lang: Lang): Flow {
  const p = FLOWS[flow][lang];
  const ids = p.groups.map((_, k) => `g${k}`);
  const tones = FLOW_TONES[flow] ?? TONES;
  return {
    groups: p.groups.map((label, k) => ({ id: ids[k], label, tone: tones[k] })),
    steps: p.steps.map(([label, caption, href, g]) => ({ label, caption, href, group: ids[g] })),
    caption: p.caption,
    loop: p.loop,
    perRow: p.steps.length,
  };
}

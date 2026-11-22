// The paths the Getting started pages draw, one per role, in English and
// Spanish with the labels the pages and the app use. Each step links to its
// section of the page that draws it.
import type { Flow, Lang, Tone } from "./flows";

export type Role = "admin" | "steward" | "analyst" | "reader";

interface Path {
  /** Who acts, by group: the label above its steps. */
  groups: string[];
  /** Label, caption, anchor of its section, and the index of its group. */
  steps: [string, string, string, number][];
  caption: string;
  loop?: string;
}

const TONES: Tone[] = ["accent", "orange", "gray"];

const PATHS: Record<Role, Record<Lang, Path>> = {
  admin: {
    en: {
      groups: ["Administrator", "Colleague"],
      steps: [
        ["Install", "The installer, on a Linux server", "1-install", 0],
        [
          "First sign-in",
          "Your password, from the installer's link",
          "2-sign-in-for-the-first-time",
          0,
        ],
        ["Outgoing mail", "So that activation links reach people", "3-set-up-outgoing-mail", 0],
        ["Account", "E-mail, name and the role User", "4-create-a-colleagues-account", 0],
        ["Policy", "A ready-made one, by what they do", "5-give-them-a-policy", 0],
        ["Sign-in", "From the e-mail, with their own password", "6-your-colleague-signs-in", 1],
      ],
      caption:
        "The administrator's path: install, sign in, set up mail, create an account and give it a policy; then the colleague activates the account and signs in. Each step links to its section.",
    },
    es: {
      groups: ["Administrador", "Colaborador"],
      steps: [
        ["Instalación", "El instalador, en un servidor Linux", "1-instalar", 0],
        [
          "Primera entrada",
          "La contraseña, con el enlace del instalador",
          "2-entrar-por-primera-vez",
          0,
        ],
        [
          "Correo saliente",
          "Para que los enlaces de activación lleguen",
          "3-configurar-el-correo-saliente",
          0,
        ],
        ["Cuenta", "Correo, nombre y el rol Usuario", "4-crear-la-cuenta-de-un-colaborador", 0],
        ["Política", "Una de las listas, según lo que hace", "5-asignar-una-política", 0],
        ["Entrada", "Desde el correo, con su propia contraseña", "6-entrada-del-colaborador", 1],
      ],
      caption:
        "El camino del administrador: instalar, entrar, configurar el correo, crear una cuenta y asignarle una política; luego el colaborador activa su cuenta y entra. Cada paso enlaza a su sección.",
    },
  },
  steward: {
    en: {
      groups: ["Data steward", "Automatic"],
      steps: [
        ["Source", "Its server and credentials", "1-add-the-source", 0],
        ["Map a table", "The dataset, its mapping and first rules", "2-map-a-table", 0],
        ["First cut", "Copied and evaluated on its own", "3-look-at-the-first-cut", 1],
        ["First rule", "Written, tested and deployed", "4-write-a-first-rule", 0],
        ["Result", "A new cut, then the dashboard", "5-measure-again-and-see-the-result", 0],
      ],
      caption:
        "The data steward's path: add a source and map one of its tables; Quality Data takes and evaluates the first cut by itself; write a rule with the tutorial, measure again and read its result. Each step links to its section.",
    },
    es: {
      groups: ["Responsable de datos", "Automático"],
      steps: [
        ["Fuente", "Su servidor y sus credenciales", "1-agregar-la-fuente", 0],
        [
          "Mapear una tabla",
          "El dataset, su mapeo y unas primeras reglas",
          "2-mapear-una-tabla",
          0,
        ],
        ["Primer corte", "Copiado y evaluado sin intervenir", "3-revisar-el-primer-corte", 1],
        ["Primera regla", "Escrita, probada y desplegada", "4-escribir-una-primera-regla", 0],
        [
          "Resultado",
          "Un corte nuevo y luego el dashboard",
          "5-medir-otra-vez-y-ver-el-resultado",
          0,
        ],
      ],
      caption:
        "El camino del responsable de datos: agregar una fuente y mapear una de sus tablas; Quality Data toma y evalúa el primer corte por su cuenta; escribir una regla con el tutorial, medir otra vez y leer su resultado. Cada paso enlaza a su sección.",
    },
  },
  analyst: {
    en: {
      groups: ["Analyst", "Source system"],
      steps: [
        ["Dashboard", "The dataset's, at the latest cut", "1-open-the-dashboard", 0],
        ["Your queue", "Open findings of your group, its SLA", "2-find-your-queue", 0],
        ["What fails", "The fields and rules behind them", "3-see-what-fails", 0],
        ["Fix", "Made where the data lives", "4-get-it-fixed-at-the-source", 1],
        ["Check", "The next cut shows the fix", "5-check-the-fix", 0],
      ],
      loop: "Each new cut counts the queue again: what was fixed leaves it.",
      caption:
        "The analyst's path: open the dashboard, find the group's queue, see which fields and rules fail, get the records fixed in the source system, and check the fix at the next cut. Each step links to its section.",
    },
    es: {
      groups: ["Analista", "Sistema de origen"],
      steps: [
        ["Dashboard", "El del dataset, en el último corte", "1-abrir-el-dashboard", 0],
        [
          "Cola del grupo",
          "Hallazgos abiertos del grupo, su ANS",
          "2-encontrar-la-cola-del-grupo",
          0,
        ],
        ["Qué falla", "Los campos y las reglas detrás", "3-ver-qué-falla", 0],
        ["Corrección", "Hecha donde vive el dato", "4-hacer-que-se-corrija-en-el-origen", 1],
        [
          "Comprobación",
          "El siguiente corte muestra la corrección",
          "5-comprobar-la-corrección",
          0,
        ],
      ],
      loop: "Cada corte nuevo vuelve a contar la cola: lo corregido sale de ella.",
      caption:
        "El camino del analista: abrir el dashboard, encontrar la cola de su grupo, ver qué campos y reglas fallan, hacer que los registros se corrijan en el sistema de origen y comprobar la corrección en el siguiente corte. Cada paso enlaza a su sección.",
    },
  },
  reader: {
    en: {
      groups: ["Manager or compliance reader"],
      steps: [
        ["Dashboard", "One per dataset, in the Explorer", "1-open-the-dashboard", 0],
        ["Cut", "The date the figures are about", "2-pick-a-cut", 0],
        ["Trend", "Conformity and IGCD by cut", "3-read-the-trend", 0],
        ["Where it fails", "By dimension, field and rule", "4-see-where-it-fails", 0],
      ],
      caption:
        "The reader's path: open a dataset's dashboard, pick a cut, read the trend of conformity and IGCD, then see where the failures are. Each step links to its section.",
    },
    es: {
      groups: ["Gerencia o cumplimiento"],
      steps: [
        ["Dashboard", "Uno por dataset, en el Explorador", "1-abrir-el-dashboard", 0],
        ["Corte", "La fecha de la que hablan las cifras", "2-elegir-un-corte", 0],
        ["Tendencia", "Conformidad e IGCD por corte", "3-leer-la-tendencia", 0],
        ["Dónde falla", "Por dimensión, campo y regla", "4-ver-dónde-falla", 0],
      ],
      caption:
        "El camino de quien lee indicadores: abrir el dashboard de un dataset, elegir un corte, leer la tendencia de la conformidad y el IGCD, y ver dónde están los fallos. Cada paso enlaza a su sección.",
    },
  },
};

/** A role's Getting started path in a language, for the page that draws it. */
export function startPath(role: Role, lang: Lang): Flow {
  const p = PATHS[role][lang];
  const ids = p.groups.map((_, k) => `g${k}`);
  return {
    groups: p.groups.map((label, k) => ({ id: ids[k], label, tone: TONES[k] })),
    steps: p.steps.map(([label, caption, anchor, g]) => ({
      label,
      caption,
      href: `#${anchor}`,
      group: ids[g],
    })),
    loop: p.loop,
    caption: p.caption,
  };
}

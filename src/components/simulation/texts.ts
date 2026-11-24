// The words of the simulation's frame (PlatformSimulation.astro): its card,
// legend and caption, in English and Spanish. The machines' words are in
// scene.ts; each scenario keeps its own story.
import type { Lang, Traffic, Words } from "./scene";

export const FRAME = {
  fig: { en: "Simulation", es: "Simulación" },
  title: { en: "One installation, played out", es: "Una instalación, en marcha" },
  hint: { en: "Pick a scenario", es: "Elige un escenario" },
  ready: { en: "ready", es: "lista" },
  installation: { en: "One installation, one organisation", es: "Una instalación, una organización" },
  aria: {
    en: "Simulation of a Government Data installation: its machines grouped by module, the traffic between them, and scenarios played step by step.",
    es: "Simulación de una instalación de Government Data: sus máquinas agrupadas por módulo, el tráfico entre ellas y escenarios que se reproducen paso a paso.",
  },
} satisfies Record<string, Words>;

/** The legend of the traffic, by the kind of link it travels on. */
export const TRAFFIC: [Traffic, Words][] = [
  ["web", { en: "People and routes (HTTPS)", es: "Personas y rutas (HTTPS)" }],
  ["mtls", { en: "Between services (mutual TLS)", es: "Entre servicios (TLS mutuo)" }],
  ["data", { en: "Data: sources and the lake", es: "Datos: fuentes y lago" }],
  ["pull", { en: "Updates pulled from AWS", es: "Actualizaciones traídas de AWS" }],
];

/** The legend of the states, as a node's border and badge show them. */
export const STATES: [string, string, Words][] = [
  ["busy", "⟳", { en: "working", es: "trabajando" }],
  ["down", "✕", { en: "down", es: "caído" }],
  ["maint", "⚙", { en: "being updated", es: "actualizándose" }],
  ["standby", "", { en: "can be added", es: "por añadir" }],
  ["added", "+", { en: "just added", es: "recién añadido" }],
];

/** The words of `lang` from a pair. */
export const say = (lang: Lang, words: Words) => words[lang];

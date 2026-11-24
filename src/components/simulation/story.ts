// What a scenario of the simulation may do, as a port: the player in the
// browser (player.ts) moves packets and changes the drawing; the tests run
// every scenario against a recording fake. A scenario only names machines
// and links of the scene (scene.ts) and tells its story in both languages.
import type { Lang, State, Words } from "./scene";

/** A log entry's tone: plain, good news, a warning or a failure. */
export type Tone = "" | "good" | "warn" | "bad";

/** A stage of a flow: being worked on, passed, passed with a warning, failed. */
export type Stage = "active" | "ok" | "warn" | "fail";

export interface PacketOptions {
  /** It stops halfway and fails: the other end does not answer. */
  fail?: boolean;
  /** How long it travels, in ms at 1×. */
  ms?: number;
  /** A health check, not the link's own traffic. */
  health?: boolean;
}

export interface Sim {
  lang: Lang;
  /** The text in the page's language. */
  T(en: string, es: string): string;
  /** A line of the narrated log, at the story's clock time. */
  log(time: string, text: string, tone?: Tone): void;
  /** A machine's state, and optionally its first line. */
  state(id: string, state: State, sub?: string): void;
  /** One of a machine's lines, by its key. */
  line(id: string, key: string, text: string): void;
  /** A packet from one machine to another, along their link. */
  packet(from: string, to: string, label: string, opts?: PacketOptions): Promise<void>;
  wait(ms: number): Promise<void>;
  /** The stages of a flow, shown above the log. */
  track(title: string, steps: string[]): void;
  stage(index: number, state: Stage, note?: string): void;
}

export type Section = "data" | "operation" | "failure";

export interface Scenario {
  id: string;
  section: Section;
  label: Words;
  play(sim: Sim): Promise<void>;
}

/** Packets one after another along a chain of links. */
export async function along(sim: Sim, path: string[], label: string, opts?: PacketOptions) {
  for (let k = 1; k < path.length; k++) await sim.packet(path[k - 1], path[k], label, opts);
}

/** Several things at once; done when all are. */
export async function together(...work: Promise<unknown>[]) {
  await Promise.all(work);
}

/** The sections' names, in the order the buttons show them. */
export const SECTIONS: [Section, Words][] = [
  ["data", { en: "Data", es: "Datos" }],
  ["operation", { en: "Operation", es: "Operación" }],
  ["failure", { en: "Failures", es: "Fallas" }],
];

import { describe, expect, it } from "vitest";
import { NODES, linkOf, type Lang } from "../scene";
import type { Sim } from "../story";
import { SCENARIOS } from ".";

/** What a scenario did, as a recording fake of the player sees it. */
interface Record {
  packets: [string, string, string][];
  logs: [string, string][];
  texts: string[];
  problems: string[];
}

const ids = new Set(NODES.map((n) => n.id));

function fake(lang: Lang): { sim: Sim; record: Record } {
  const record: Record = { packets: [], logs: [], texts: [], problems: [] };
  let steps = 0;
  const known = (id: string) => ids.has(id) || record.problems.push(`no node ${id}`);
  const sim: Sim = {
    lang,
    T(en, es) {
      if (!en.trim() || !es.trim()) record.problems.push(`an empty text: "${en}" / "${es}"`);
      return lang === "es" ? es : en;
    },
    log(time, text) {
      if (!/^\d\d:\d\d:\d\d$/.test(time)) record.problems.push(`a time "${time}"`);
      record.logs.push([time, text]);
      record.texts.push(text);
    },
    state(id, _state, sub) {
      known(id);
      if (sub) record.texts.push(sub);
    },
    line(id, _key, text) {
      known(id);
      record.texts.push(text);
    },
    async packet(from, to, label) {
      known(from);
      known(to);
      if (!linkOf(from, to)) record.problems.push(`no link ${from} → ${to}`);
      record.packets.push([from, to, label]);
      record.texts.push(label);
    },
    async wait() {},
    track(title, names) {
      steps = names.length;
      record.texts.push(title, ...names);
    },
    stage(index, _state, note) {
      if (index < 0 || index >= steps) record.problems.push(`stage ${index} of ${steps}`);
      if (note) record.texts.push(note);
    },
  };
  return { sim, record };
}

// Nothing of the retired design: its engine, its machines, a vendor or a
// regulator's name.
const RETIRED = /duckdb|teams|balanc|witness|testigo|\bwal\b|\bsfc\b|jdbc|notify|replica de postgres/i;

describe("the scenarios", () => {
  it("would see a retired name", () => {
    expect("evaluated by DuckDB").toMatch(RETIRED);
    expect("behind the load balancer").toMatch(RETIRED);
  });

  it("have one id each and a label in both languages", () => {
    const all = SCENARIOS.map((s) => s.id);
    expect(new Set(all).size).toBe(all.length);
    for (const s of SCENARIOS) {
      expect(s.label.en.trim(), s.id).not.toBe("");
      expect(s.label.es.trim(), s.id).not.toBe("");
    }
  });

  for (const scenario of SCENARIOS) {
    for (const lang of ["en", "es"] as const) {
      it(`${scenario.id} (${lang}) sends packets only along links, to known machines`, async () => {
        const { sim, record } = fake(lang);
        await scenario.play(sim);
        expect(record.problems).toEqual([]);
        expect(record.logs.length).toBeGreaterThan(2);
        expect(record.packets.length).toBeGreaterThan(0);
        const times = record.logs.map(([t]) => t);
        expect([...times].sort(), "the clock goes forward").toEqual(times);
        for (const text of record.texts) expect(text, scenario.id).not.toMatch(RETIRED);
      });
    }
  }
});

import { describe, expect, it } from "vitest";
import { figure } from "../chart-kit/index";
import { CATALOG, chart, EXAMPLE_IDS } from "./examples";

describe("the example charts", () => {
  it("draw one example for each of the product's 17 catalogue charts, and no other", () => {
    expect(Object.keys(CATALOG)).toHaveLength(17);
    expect([...Object.values(CATALOG)].sort()).toEqual([...EXAMPLE_IDS].sort());
  });

  it("draw in both languages, with a table and where their data comes from", () => {
    for (const id of EXAMPLE_IDS) {
      for (const lang of ["es", "en"] as const) {
        const f = chart(id, lang);
        expect(f.plot.svg, id).toContain("<svg");
        expect(f.plot.table.rows.length, id).toBeGreaterThan(0);
        for (const row of f.plot.table.rows) expect(row, id).toHaveLength(f.plot.table.head.length);
        expect(f.source?.query, id).toBeTruthy();
        expect(figure(lang, f), id).not.toMatch(/NaN|undefined|Infinity/);
      }
    }
  });

  it("name an unknown chart", () => {
    expect(() => chart("problems-by-type", "es")).toThrow('No chart named "problems-by-type"');
  });
});

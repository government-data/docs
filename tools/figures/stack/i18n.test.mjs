// The figure's language layer: a count and the words that agree with it.
import { afterEach, describe, expect, it } from "vitest";
import { browserSource, fillTemplate, setLang, tf } from "./i18n.mjs";
import { ES } from "./es.mjs";

const READOUT = "{parts} roles in {places} places · {optional} optional";
const SAY =
  "{parts} roles in {places} places; {optional} of the roles optional. {plan} {plan|place|places} only on an optional machine.";

afterEach(() => setLang("en"));

describe("fillTemplate", () => {
  it("puts each value in its place", () => {
    expect(fillTemplate("{a} of {b}", { a: 2, b: 5 })).toBe("2 of 5");
  });

  it("picks the word that agrees with the count", () => {
    const t = "{n} {n|opcional|opcionales}";
    expect(fillTemplate(t, { n: 0 })).toBe("0 opcionales");
    expect(fillTemplate(t, { n: 1 })).toBe("1 opcional");
    expect(fillTemplate(t, { n: 2 })).toBe("2 opcionales");
  });
});

describe("the readout in Spanish", () => {
  it("agrees in number", () => {
    setLang("es");
    expect(tf(READOUT, { parts: 3, places: 5, optional: 1 })).toBe(
      "3 roles en 5 lugares · 1 opcional",
    );
    expect(tf(READOUT, { parts: 3, places: 5, optional: 2 })).toBe(
      "3 roles en 5 lugares · 2 opcionales",
    );
    expect(tf(READOUT, { parts: 1, places: 1, optional: 0 })).toBe(
      "1 rol en 1 lugar · 0 opcionales",
    );
  });

  it("agrees in the sentence read aloud", () => {
    setLang("es");
    expect(tf(SAY, { parts: 3, places: 8, optional: 1, plan: 1 })).toBe(
      "3 roles en 8 lugares; 1 de los roles es opcional. 1 lugar solo en una máquina opcional.",
    );
  });

  it("is the same in the page's script", () => {
    const page = new Function(`${browserSource(ES)}\nreturn tf;`)();
    expect(page(READOUT, { parts: 3, places: 5, optional: 1 })).toBe(
      "3 roles en 5 lugares · 1 opcional",
    );
    expect(page(READOUT, { parts: 3, places: 5, optional: 2 })).toBe(
      "3 roles en 5 lugares · 2 opcionales",
    );
  });
});

describe("the readout in English", () => {
  it("keeps its words, and agrees where they change", () => {
    expect(tf(READOUT, { parts: 3, places: 5, optional: 1 })).toBe(
      "3 roles in 5 places · 1 optional",
    );
    expect(tf(SAY, { parts: 3, places: 8, optional: 1, plan: 1 })).toContain(
      "1 place only on",
    );
  });
});

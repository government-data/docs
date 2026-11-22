import { describe, expect, it } from "vitest";
import { matcher } from "./match";
import rehypeTerms, { localeOf } from "./rehype";
import { abbr, concept, type Term } from "./types";
import { en } from "./en";
import { es } from "./es";

const terms = [
  abbr("ICD", "", ""),
  abbr("IGCD", "", ""),
  abbr("DAMA", "", ""),
  abbr("DAMA-DMBOK", "", ""),
  concept("cut", "", ["cuts"]),
  concept("remediation queue", "", ["remediation queues"]),
  concept("IGCD without timeliness", ""),
  concept("cola de remediación", "", ["colas de remediación"]),
  concept("p′ chart", ""),
];
const names = (text: string, list: readonly Term[] = terms) =>
  matcher(list)(text).map((p) => (typeof p === "string" ? p : `[${p.text}]`));

describe("abbreviations", () => {
  it("match whole words only, case-sensitively, with a plural", () => {
    expect(names("The ICD and the IGCDs.")).toEqual(["The ", "[ICD]", " and the ", "[IGCDs]", "."]);
    expect(names("ICDX xICD icd ICD_1 ICD9 ÉICD")).toEqual(["ICDX xICD icd ICD_1 ICD9 ÉICD"]);
  });

  it("take the longest term", () => {
    expect(names("DAMA-DMBOK, from DAMA")).toEqual(["[DAMA-DMBOK]", ", from ", "[DAMA]"]);
  });
});

describe("concepts", () => {
  it("match their forms, with a capital only at the start", () => {
    expect(names("Cut 1 and two cuts; a CUT, a cUt")).toEqual([
      "[Cut]",
      " 1 and two ",
      "[cuts]",
      "; a CUT, a cUt",
    ]);
    expect(names("a shortcut, cutting")).toEqual(["a shortcut, cutting"]);
  });

  it("match phrases across a line break, and their inflections", () => {
    expect(names("the remediation\n  queues")).toEqual(["the ", "[remediation\n  queues]"]);
    expect(names("las colas de remediación")).toEqual(["las ", "[colas de remediación]"]);
    expect(names("the p′ chart")).toEqual(["the ", "[p′ chart]"]);
  });

  it("lose to a longer term that contains an abbreviation", () => {
    expect(names("IGCD without timeliness")).toEqual(["[IGCD without timeliness]"]);
  });
});

type Node = { type: string; tagName?: string; value?: string; children?: Node[] };
const text = (value: string): Node => ({ type: "text", value });
const el = (tagName: string, ...children: Node[]): Node => ({
  type: "element",
  tagName,
  children,
});
const marked = (tree: Node): string[] =>
  tree.type === "element" &&
  (tree as { properties?: { className?: string[] } }).properties?.className?.includes(
    "qd-term-word",
  )
    ? [tree.children?.[0]?.value ?? ""]
    : (tree.children ?? []).flatMap(marked);

describe("the plugin", () => {
  const run = (tree: Node) => {
    rehypeTerms({ root: terms })(tree, { path: "/x/src/content/docs/guide/a.md" });
    return marked(tree);
  };

  it("marks a concept once per section and abbreviations always", () => {
    const tree = el(
      "root",
      el("p", text("A cut, the ICD; the cut and the ICD.")),
      el("h2", text("Next")),
      el("p", text("Another cut.")),
    );
    expect(run(tree)).toEqual(["cut", "ICD", "ICD", "cut"]);
  });

  it("takes bold that is the term alone as its first occurrence, but not a bold lead-in", () => {
    const tree = el(
      "root",
      el("p", el("strong", text("The cut.")), text(" A cut.")),
      el("h2", text("Next")),
      el("p", text("A "), el("strong", text("cut")), text(" is a cut.")),
    );
    expect(run(tree)).toEqual(["cut"]);
  });

  it("skips a concept its section's heading names, or in bold, but not the abbreviation", () => {
    const tree = el(
      "root",
      el("h2", text("Cut")),
      el("p", text("A cut. "), el("strong", text("IGCD without timeliness"))),
      el("p", el("code", text("ICD")), text(" "), el("a", text("ICD"))),
    );
    expect(run(tree)).toEqual(["IGCD"]);
  });
});

describe("terminology", () => {
  it("has each term once, each with its meaning", () => {
    for (const list of [en, es]) {
      const forms = list.flatMap((t) => [t.term, ...(t.forms ?? [])].map((f) => f.toLowerCase()));
      expect(new Set(forms).size).toBe(forms.length);
      for (const t of list) expect(t.meaning).toBeTruthy();
      for (const t of list.filter((t) => t.kind === "abbreviation")) {
        expect(t.expansion).toBeTruthy();
      }
    }
  });

  it("uses each language's own form", () => {
    const names = (list: readonly Term[]) =>
      list.filter((t) => t.kind === "abbreviation").map((t) => t.term);
    const onlyEn = names(en).filter((t) => !names(es).includes(t));
    const onlyEs = names(es).filter((t) => !names(en).includes(t));
    expect([onlyEn, onlyEs]).toEqual([["AML", "SLA"], ["ANS"]]);
  });

  it("finds a page's locale from its path", () => {
    const all = { root: en, es };
    expect(localeOf("/x/src/content/docs/es/guide/formulas.md", all)).toBe("es");
    expect(localeOf("/x/src/content/docs/guide/formulas.md", all)).toBe("root");
    expect(localeOf(undefined, all)).toBe("root");
  });
});

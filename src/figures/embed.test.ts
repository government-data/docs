import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { embedOf } from "./embed";
import { scopeCss, scopeScript } from "./scope";

const read = (file: string) => readFileSync(new URL(file, import.meta.url), "utf8");

// Each figure's rules, one selector a line: what is left after scoping.
const ruleSelectors = (css: string) =>
  [...css.matchAll(/(?:^|[}])\s*([^{}@]+)\{/g)].flatMap((m) =>
    m[1].split(",").map((s) => s.trim()),
  );

describe.each([["stack", "./stack.html"]])("the %s figure (%s) in a docs page", (name, file) => {
  const { css, markup, script } = embedOf(read(file), name);
  const root = `[data-qd-fig="${name}"]`;

  it("keeps the figure's styles and none of its page's", () => {
    expect(css).toContain(".iso-svg{");
    expect(css).toContain(".qd-stage{");
    expect(css).not.toContain(".iso-page{");
    expect(css).not.toMatch(/(^|[},])\s*(html|body|\*)\s*[{[,]/);
  });

  it("puts every rule under its own root", () => {
    const sels = ruleSelectors(css).filter((s) => !/^(from|to|\d+%)$/.test(s));
    expect(sels.length).toBeGreaterThan(50);
    for (const s of sels)
      expect(s.startsWith(root) || s.startsWith(`:root[data-theme="light"] ${root}`)).toBe(true);
  });

  it("draws light when the site is light, and only then", () => {
    expect(css).not.toContain('.iso[data-theme="light"]');
    expect(css).toContain(`:root[data-theme="light"] ${root} .iso{`);
  });

  it("keeps the drawing and the technologies", () => {
    expect(markup).toContain('class="iso-stage qd-stage"');
    expect(markup.match(/ data-name="/g)?.length ?? 0).toBeGreaterThan(250);
    expect(markup).toContain("<svg");
    expect(markup).not.toContain("<style>");
    expect(markup).toContain('class="qd-techs"');
  });

  it("keeps the script whole and looking under its root", () => {
    expect(
      script.startsWith(`const QD_ROOT = document.querySelector(${JSON.stringify(root)});`),
    ).toBe(true);
    // The root's own lookup is the only one left on the whole document.
    expect(script.match(/\bdocument\.querySelector(All)?\(/g)).toHaveLength(1);
    expect(script).toContain("const DATA = ");
    expect(script).toContain("function frame(");
    expect(script).not.toMatch(/^(export|import) /m);
  });
});

describe("two figures on one page", () => {
  it("never share a root", () => {
    const page = read("./stack.html");
    const one = embedOf(page, "one");
    const two = embedOf(page, "two");
    expect(one.css).not.toContain('[data-qd-fig="two"]');
    expect(two.css).not.toContain('[data-qd-fig="one"]');
    expect(one.script).toContain(
      `document.querySelector(${JSON.stringify('[data-qd-fig="one"]')})`,
    );
  });
});

describe("scoping", () => {
  it("scopes rules, at-rule blocks and the theme switch, and keeps keyframes", () => {
    const css =
      '.a,.b c{x:1}:root[data-theme="light"] .iso{y:2}@media (max-width:9px){.d{z:3}}@keyframes k{from{o:0}to{o:1}}';
    expect(scopeCss(css, "[r]")).toBe(
      '[r] .a,[r] .b c{x:1}:root[data-theme="light"] [r] .iso{y:2}@media (max-width:9px){[r] .d{z:3}}@keyframes k{from{o:0}to{o:1}}',
    );
  });

  it("makes the script look under the root", () => {
    expect(scopeScript('document.querySelector(".a");document.querySelectorAll("b")', "[r]")).toBe(
      'const QD_ROOT = document.querySelector("[r]");\nQD_ROOT.querySelector(".a");QD_ROOT.querySelectorAll("b")',
    );
  });

  it("fails loudly when the page is not one the kit wrote, or the name is not one", () => {
    expect(() => embedOf("<html></html>", "stack")).toThrow(/figure:/);
    expect(() => embedOf(read("./stack.html"), "Bad name")).toThrow(/figure:/);
  });
});

import { describe, expect, it } from "vitest";
import { isExcluded, orgUrlOf, publicUrlOf, sidebarWithout, targetOf, type SidebarItem } from "./index";
import rehypeUnlink, { pagePathOf, targetIdOf } from "./unlink";

describe("targetOf", () => {
  it("is the installation's unless public is asked", () => {
    expect(targetOf(undefined)).toBe("installation");
    expect(targetOf("")).toBe("installation");
    expect(targetOf("installation")).toBe("installation");
    expect(targetOf("public")).toBe("public");
    expect(() => targetOf("Public")).toThrow();
  });
});

describe("publicUrlOf", () => {
  it("takes an https origin only", () => {
    expect(publicUrlOf("https://guide.example.org")).toBe("https://guide.example.org");
    expect(publicUrlOf("https://guide.example.org/")).toBe("https://guide.example.org");
    expect(() => publicUrlOf(undefined)).toThrow();
    expect(() => publicUrlOf("http://guide.example.org")).toThrow();
    expect(() => publicUrlOf("https://example.org/docs/")).toThrow();
  });
});

describe("orgUrlOf", () => {
  it("takes a GitHub organisation's URL only", () => {
    expect(orgUrlOf("https://github.com/example-org")).toBe("https://github.com/example-org");
    expect(orgUrlOf("https://github.com/example-org/")).toBe("https://github.com/example-org");
    expect(() => orgUrlOf(undefined)).toThrow();
    expect(() => orgUrlOf("")).toThrow();
    expect(() => orgUrlOf("http://github.com/example-org")).toThrow();
    expect(() => orgUrlOf("https://github.com/")).toThrow();
    expect(() => orgUrlOf("https://github.com/example-org/docs")).toThrow();
    expect(() => orgUrlOf("https://gitlab.com/example-org")).toThrow();
    expect(() => orgUrlOf("https://github.com/-org")).toThrow();
  });
});

describe("isExcluded", () => {
  it("matches a page in either language", () => {
    expect(isExcluded("guide/x", ["guide/x"])).toBe(true);
    expect(isExcluded("es/guide/x", ["guide/x"])).toBe(true);
    expect(isExcluded("guide/xy", ["guide/x"])).toBe(false);
  });
});

describe("sidebarWithout", () => {
  it("drops the pages and the groups left empty", () => {
    const sidebar: SidebarItem[] = [
      "guide/a",
      { label: "Kept", items: ["guide/b", "guide/x"] },
      { label: "Empty", items: ["guide/x"] },
      { label: "PDF", link: "/print/" },
    ];
    expect(sidebarWithout(sidebar, ["guide/x"])).toEqual([
      "guide/a",
      { label: "Kept", items: ["guide/b"] },
      { label: "PDF", link: "/print/" },
    ]);
  });
});

describe("unlink", () => {
  it("knows a page's path from its file", () => {
    expect(pagePathOf("/r/src/content/docs/guide/a.md")).toBe("/guide/a/");
    expect(pagePathOf("/r/src/content/docs/es/guide/a.mdx")).toBe("/es/guide/a/");
    expect(pagePathOf("/r/src/content/docs/index.mdx")).toBe("/");
    expect(pagePathOf("/elsewhere/a.md")).toBeUndefined();
  });

  it("resolves a link to the page it leads to", () => {
    expect(targetIdOf("../x/#part", "/guide/a/")).toBe("guide/x");
    expect(targetIdOf("../../guide/x/", "/es/charts/b/")).toBe("es/guide/x");
    expect(targetIdOf("https://example.org/guide/x/", "/guide/a/")).toBeUndefined();
  });

  it("keeps a link's text, drops the link to an excluded page", () => {
    const a = (href: string, text: string) => ({
      type: "element",
      tagName: "a",
      properties: { href },
      children: [{ type: "text", value: text }],
    });
    const p = { type: "element", tagName: "p", children: [a("../x/", "gone"), a("../b/", "kept")] };
    const tree = { type: "root", children: [p] };
    rehypeUnlink(["guide/x"])(tree, { path: "/r/src/content/docs/guide/a.md" });
    expect(tree.children[0].children).toEqual([
      { type: "text", value: "gone" },
      a("../b/", "kept"),
    ]);
  });
});

import { describe, expect, it } from "vitest";
import { headingId, rebase, retarget } from "./links";

const page = "/docs/guide/overview/";
const anchors = new Map([
  ["/docs/guide/overview/", "page-guide-overview"],
  ["/docs/guide/concepts/", "page-guide-concepts"],
  ["/docs/guide/start-admin/", "page-guide-start-admin"],
  ["/docs/charts/evolution/", "page-charts-evolution"],
]);

describe("a printed page's links", () => {
  it("resolve against the page's own path, then go to the page in the book", () => {
    expect(retarget("../concepts/", page, anchors)).toBe("#page-guide-concepts");
    expect(retarget("../start-admin/", page, anchors)).toBe("#page-guide-start-admin");
    expect(retarget("./", page, anchors)).toBe("#page-guide-overview");
    expect(retarget("../../charts/evolution/", page, anchors)).toBe("#page-charts-evolution");
    expect(retarget("/docs/guide/concepts", page, anchors)).toBe("#page-guide-concepts");
    expect(retarget("concepts/", "/docs/guide/", anchors)).toBe("#page-guide-concepts");
  });

  it("keep a heading, made unique in the book", () => {
    expect(retarget("../concepts/#the-chain", page, anchors)).toBe(
      "#page-guide-concepts--the-chain",
    );
    expect(retarget("./#why", page, anchors)).toBe("#page-guide-overview--why");
    expect(retarget("#why", page, anchors)).toBe("#page-guide-overview--why");
    expect(retarget("../concepts/#qu%C3%A9-es", page, anchors)).toBe(
      "#page-guide-concepts--qué-es",
    );
    expect(headingId("page-guide-concepts", "the-chain")).toBe("page-guide-concepts--the-chain");
  });

  it("become a path from the site's root when the page is not in the book", () => {
    expect(retarget("../../other/page/#now", page, anchors)).toBe(
      "/docs/other/page/#now",
    );
    expect(retarget("../../print/", page, anchors)).toBe("/docs/print/");
  });

  it("leave other sites, mail and an empty fragment alone", () => {
    expect(retarget("https://example.org/a", page, anchors)).toBe("https://example.org/a");
    expect(retarget("mailto:someone@example.org", page, anchors)).toBe(
      "mailto:someone@example.org",
    );
    expect(retarget("#", page, anchors)).toBe("#");
  });
});

describe("a printed page's HTML", () => {
  const html = [
    '<h2 id="why">Why</h2><a class="sl-anchor-link" href="#why">#</a>',
    '<p><a href="../concepts/#the-chain">chain</a> <a href="#fn-1" id="ref-1">1</a></p>',
    '<li id="fn-1">Note <a href="#ref-1">back</a></li>',
    '<svg><use href="#shape"/><path id="shape"/></svg>',
  ].join("");
  const out = rebase(html, page, "page-guide-overview", anchors);

  it("prefixes the headings' ids and the ids its links aim at", () => {
    expect(out).toContain('<h2 id="page-guide-overview--why">');
    expect(out).toContain('<li id="page-guide-overview--fn-1">');
    expect(out).toContain('id="page-guide-overview--ref-1"');
  });

  it("points every link at its place in the book", () => {
    expect(out).toContain('href="#page-guide-overview--why"');
    expect(out).toContain('href="#page-guide-concepts--the-chain"');
    expect(out).toContain('href="#page-guide-overview--fn-1"');
    expect(out).toContain('href="#page-guide-overview--ref-1"');
  });

  it("leaves what is not a link alone (a drawing's own ids)", () => {
    expect(out).toContain('<use href="#shape"/><path id="shape"/>');
  });
});

describe("a printed page's names for readers", () => {
  it("prefix the ids an aria attribute names, and the attribute", () => {
    const html = '<a aria-describedby="qd-term-1" href="#x">t</a><span id="qd-term-1">m</span>';
    const out = rebase(html, page, "page-guide-overview", anchors);
    expect(out).toContain('aria-describedby="page-guide-overview--qd-term-1"');
    expect(out).toContain('<span id="page-guide-overview--qd-term-1">');
  });
});

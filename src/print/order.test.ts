import { describe, expect, it } from "vitest";
import { anchorOf, bookOf, idOf, pagesOf, type SidebarEntry } from "./order";

const link = (label: string, href: string): SidebarEntry => ({ type: "link", label, href });
const group = (label: string, entries: SidebarEntry[]): SidebarEntry => ({
  type: "group",
  label,
  entries,
});

// A sidebar shaped like the site's, in Spanish.
const sidebar: SidebarEntry[] = [
  link("Introducción", "/docs/es/guide/overview/"),
  group("Primeros pasos", [
    link("Administrador", "/docs/es/guide/start-admin/"),
    link("Tutorial", "/docs/es/guide/rule-tutorial/"),
  ]),
  group("Referencia", [
    link("Gráficas", "/docs/es/guide/charts/"),
    group("Gráficas de ejemplo", [link("Evolución", "/docs/es/charts/evolution/")]),
  ]),
  link("Descargar PDF", "/docs/es/print/"),
];
const isPage = (id: string) => id !== "es/print";

describe("the print book", () => {
  it("follows the sidebar's order, parts included", () => {
    const ids = pagesOf(bookOf(sidebar, "/docs/", isPage)).map((p) => p.id);
    expect(ids).toEqual([
      "es/guide/overview",
      "es/guide/start-admin",
      "es/guide/rule-tutorial",
      "es/guide/charts",
      "es/charts/evolution",
    ]);
  });

  it("leaves out the print link", () => {
    const book = bookOf(sidebar, "/docs/", isPage);
    expect(book.map((n) => n.label)).not.toContain("Descargar PDF");
    expect(pagesOf(book)).toHaveLength(5);
  });

  it("drops a part left empty and links that are not pages", () => {
    const book = bookOf(
      [group("Vacío", [link("Fuera", "https://example.org/")]), link("Inicio", "/docs/")],
      "/docs/",
      () => true,
    );
    expect(book).toEqual([]);
  });

  it("gives each page the parts it sits in", () => {
    const pages = pagesOf(bookOf(sidebar, "/docs/", isPage));
    const chart = pages.find((p) => p.id === "es/charts/evolution");
    expect(chart?.trail).toEqual(["Referencia", "Gráficas de ejemplo"]);
    expect(pages[0].trail).toEqual([]);
  });
});

describe("ids and anchors", () => {
  it("reads an entry id from a path under the base", () => {
    expect(idOf("/docs/guide/overview/", "/docs/")).toBe("guide/overview");
    expect(idOf("/docs/es/guide/overview/", "/docs")).toBe("es/guide/overview");
    expect(idOf("/other/guide/", "/docs/")).toBeNull();
    expect(idOf("/docs/", "/docs/")).toBeNull();
  });

  it("makes an anchor from an id", () => {
    expect(anchorOf("es/charts/evolution")).toBe("page-es-charts-evolution");
  });
});

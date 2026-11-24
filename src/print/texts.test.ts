import { describe, expect, it } from "vitest";
import { langOf, pathIn } from "./texts";

describe("langOf", () => {
  it("is Spanish under the base's es/, in either target", () => {
    expect(langOf("/docs/es/guide/a/", "/docs/")).toBe("es");
    expect(langOf("/docs/es/guide/a/", "/docs")).toBe("es");
    expect(langOf("/docs/guide/a/", "/docs/")).toBe("en");
    expect(langOf("/es/guide/a/", "/")).toBe("es");
    expect(langOf("/guide/es/", "/")).toBe("en");
    expect(langOf("/escape/", "/")).toBe("en");
  });
});

describe("pathIn", () => {
  it("gives the same page in each language", () => {
    expect(pathIn("es", "/docs/guide/a/", "/docs/")).toBe("/docs/es/guide/a/");
    expect(pathIn("en", "/docs/es/guide/a/", "/docs/")).toBe("/docs/guide/a/");
    expect(pathIn("es", "/docs/es/guide/a/", "/docs/")).toBe("/docs/es/guide/a/");
    expect(pathIn("es", "/guide/a/", "/")).toBe("/es/guide/a/");
    expect(pathIn("en", "/es/guide/a/", "/")).toBe("/guide/a/");
  });
});

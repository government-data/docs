import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { GUIDE_VERSION } from "./guide";
import { footerLine, versionOf } from "./index";

const manifest = readFileSync(new URL("../../module.yaml", import.meta.url), "utf8");

describe("versionOf", () => {
  it("reads a manifest's version", () => {
    expect(versionOf("name: docs\nversion: 1.2.3\n")).toBe("1.2.3");
    expect(versionOf('version: "0.4.2"\n')).toBe("0.4.2");
    expect(() => versionOf("name: docs\n")).toThrow();
    expect(() => versionOf("version: latest\n")).toThrow();
  });
});

describe("the footer's version", () => {
  it("is module.yaml's", () => {
    const version = versionOf(manifest);
    expect(GUIDE_VERSION).toBe(version);
    expect(footerLine("en", GUIDE_VERSION)).toBe(`Government Data · Guide v${version}`);
    expect(footerLine("es", GUIDE_VERSION)).toBe(`Government Data · Guía v${version}`);
  });
});

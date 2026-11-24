// The guide's version, read from module.yaml (the module's one version
// source, which a release tag must match), and the footer line that shows
// it. Pure: no I/O, so the footer, the printed book and the tests share it.

export type Lang = "en" | "es";

/** The `version` of a module manifest's text; throws if it has none. */
export function versionOf(manifest: string): string {
  const match = /^version:\s*["']?(\d+\.\d+\.\d+)["']?\s*$/m.exec(manifest);
  if (!match) throw new Error("module.yaml has no version x.y.z");
  return match[1];
}

/** The footer's line: the platform, the guide and its version. */
export function footerLine(lang: Lang, version: string): string {
  return `Government Data · ${lang === "es" ? "Guía" : "Guide"} v${version}`;
}

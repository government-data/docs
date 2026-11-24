// The print page's texts, in the docs' two languages (as the other
// components keep theirs: AppMenu.astro). The sidebar's link to it is
// translated in astro.config.mjs; its title, in the entries print.mdx.

export const TEXTS = {
  en: {
    cover: "Documentation",
    coverNote: "The guide, its reference and its method.",
    built: "Built on",
    contents: "Contents",
    howTo:
      "This page holds the whole guide, ready to print. To download it, print it and choose Save as PDF as the printer.",
    print: "Print or save as PDF",
  },
  es: {
    cover: "Documentación",
    coverNote: "La guía, su referencia y su método.",
    built: "Generada el",
    contents: "Contenido",
    howTo:
      "Esta página tiene toda la guía, lista para imprimir. Para descargarla, imprímela y elige Guardar como PDF como impresora.",
    print: "Imprimir o guardar como PDF",
  },
} as const;

export type Lang = keyof typeof TEXTS;

/** The site's base with its trailing slash (`/docs/` or `/`). */
const rootOf = (base: string) => (base.endsWith("/") ? base : `${base}/`);

/** The language of a page's address: Spanish under `<base>es/`. */
export function langOf(pathname: string, base: string): Lang {
  const root = rootOf(base);
  return pathname === `${root}es` || pathname.startsWith(`${root}es/`) ? "es" : "en";
}

/** The same page's address in `lang`: English at `<base>…`, Spanish at
 * `<base>es/…`. */
export function pathIn(lang: Lang, pathname: string, base: string): string {
  const root = rootOf(base);
  const english =
    langOf(pathname, base) === "es" ? root + pathname.slice(root.length + 3) : pathname;
  return lang === "es" && english.startsWith(root)
    ? `${root}es/${english.slice(root.length)}`
    : english;
}

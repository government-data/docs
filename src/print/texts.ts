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

/** The language of a page's address: Spanish under /docs/es/. */
export function langOf(pathname: string): Lang {
  return /^\/docs\/es(\/|$)/.test(pathname) ? "es" : "en";
}

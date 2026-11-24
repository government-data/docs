import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { unified } from "@astrojs/markdown-remark";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeTerms from "./src/terms/rehype.ts";
import { terminology } from "./src/terms/index.ts";
import rehypeUnlink from "./src/target/unlink.ts";
import {
  EXCLUDED_FROM_PUBLIC,
  orgUrlOf,
  PUBLIC_CSP,
  publicUrlOf,
  sidebarWithout,
  targetOf,
} from "./src/target/index.ts";

// The terms plugin's sources and data (src/terms/, without its tests and
// tooltip.ts, which runs in the browser). Astro caches the rendered pages
// (node_modules/.astro/data-store.json) and renders them again only when the
// config's options change, not when the plugin's code does; nor does its dev
// server restart when a file the config imports changes. So the digest of
// these files goes with the plugin's options, and the dev server restarts
// when one of them changes.
const termsDir = new URL("./src/terms/", import.meta.url);
const termsSources = readdirSync(termsDir, { recursive: true })
  .filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts") && f !== "tooltip.ts")
  .sort()
  .map((f) => new URL(f, termsDir));
const termsDigest = termsSources
  .reduce((hash, url) => hash.update(readFileSync(url)), createHash("sha256"))
  .digest("hex");

// Two outputs of the same pages (src/target/index.ts), by DOCS_TARGET:
// - installation (the default): the user guide inside every installation,
//   at /docs/, seen only by signed-in users: the installation's edge asks
//   the core before it forwards a request (the module's `auth: forward`).
//   The image in Dockerfile serves the built site.
// - public: the public site at the root of DOCS_PUBLIC_URL (pages.yml),
//   with Starlight's own selectors, a CSP in a <meta> tag (GitHub Pages sends
//   no headers of ours), a sitemap and canonical links (from `site`), and
//   without the pages EXCLUDED_FROM_PUBLIC.
const target = targetOf(process.env.DOCS_TARGET);
const isPublic = target === "public";
const root = isPublic ? "/" : "/docs/";
const excluded = isPublic ? EXCLUDED_FROM_PUBLIC : [];
// As the terms plugin's digest below: the unlink plugin's source goes with
// its options, so a change to it renders the pages again.
const unlinkDigest = createHash("sha256")
  .update(readFileSync(new URL("./src/target/unlink.ts", import.meta.url)))
  .digest("hex");

export default defineConfig({
  base: isPublic ? "/" : "/docs",
  site: isPublic ? publicUrlOf(process.env.DOCS_PUBLIC_URL) : undefined,
  trailingSlash: "always",
  build: { format: "directory" },
  // No telemetry nor anything external: the installation may have no internet.
  // The formulas are drawn at build time (KaTeX), its fonts bundled.
  telemetry: false,
  // Every known term in the prose shows its meaning on hover (src/terms/):
  // after KaTeX, so the formulas are already drawn and left alone. The terms
  // go as the plugin's options, with its sources' digest (which the plugin
  // ignores), so a change to either renders the pages again.
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [
        rehypeKatex,
        [rehypeTerms, terminology, termsDigest],
        ...(excluded.length ? [[rehypeUnlink, excluded, unlinkDigest]] : []),
      ],
    }),
  },

  // There is no home page: the documentation starts at the platform's page.
  // A static build writes each as a page with a meta refresh and a canonical
  // link (no server-side redirects on GitHub Pages).
  redirects: {
    "/": `${root}guide/platform/`,
    "/es/": `${root}es/guide/platform/`,
  },
  integrations: [
    {
      name: "terms-watch",
      hooks: {
        "astro:config:setup": ({ addWatchFile }) =>
          termsSources.forEach((url) => addWatchFile(url)),
      },
    },
    starlight({
      // The platform's name, beside its icon in the header and in the tab.
      title: "Government Data",
      logo: { src: "./src/assets/logo.svg" },
      favicon: "/favicon.ico",
      // English at the root (/docs/, or / in public) and Spanish at es/: the
      // app's menu (or, in public, Starlight's selector) links to the
      // language chosen there.
      defaultLocale: "root",
      locales: {
        root: { label: "English", lang: "en" },
        es: { label: "Español", lang: "es" },
      },
      customCss: [
        "katex/dist/katex.min.css",
        "./src/chart-kit/charts.css",
        "./src/styles.css",
      ],
      // In the installation's header, the app's avatar with its menu (go
      // back, where else to go with the account, the theme, the language,
      // sign out) in place of Starlight's theme and language selectors: the
      // documentation is not apart. The public site has no app nor session:
      // Starlight's own selectors.
      components: {
        ...(isPublic
          ? {}
          : {
              ThemeSelect: "./src/components/AppMenu.astro",
              LanguageSelect: "./src/components/Nothing.astro",
            }),
        MarkdownContent: "./src/components/MarkdownContent.astro",
      },
      // The public site's header links to the GitHub organisation, from the
      // repository variable DOCS_ORG_URL (pages.yml): its name is in no file.
      // The installation's header keeps the app's menu alone.
      social: isPublic
        ? [{ icon: "github", label: "GitHub", href: orgUrlOf(process.env.DOCS_ORG_URL) }]
        : [],
      head: isPublic
        ? [{ tag: "meta", attrs: { "http-equiv": "Content-Security-Policy", content: PUBLIC_CSP } }]
        : [],
      // The guide in the sections its readers look for: listed here, not
      // by folders, so every page keeps its URL. A page left out of this
      // list does not show in the sidebar. The public site drops the pages
      // it leaves out.
      sidebar: sidebarWithout([
        "guide/platform",
        {
          // Quality Data, the data quality application: its own guide.
          label: "Quality Data",
          items: [
            "guide/overview",
            "guide/concepts",
            {
              label: "Getting started",
              translations: { es: "Primeros pasos" },
              items: [
                "guide/start-admin",
                "guide/start-steward",
                "guide/start-analyst",
                "guide/start-reader",
                "guide/rule-tutorial",
              ],
            },
            {
              label: "Tasks",
              translations: { es: "Tareas" },
              items: [
                {
                  label: "Data",
                  translations: { es: "Datos" },
                  items: ["guide/connect-a-source", "guide/map-a-table", "guide/run-cuts"],
                },
                {
                  label: "Rules",
                  translations: { es: "Reglas" },
                  items: [
                    "guide/write-a-rule",
                    "guide/share-rules",
                    "guide/rules-to-main",
                    "guide/rule-history",
                    "guide/export-import-rules",
                  ],
                },
                {
                  label: "Results",
                  translations: { es: "Resultados" },
                  items: ["guide/read-the-dashboard", "guide/work-a-queue"],
                },
                {
                  label: "Administration",
                  translations: { es: "Administración" },
                  items: [
                    "guide/manage-access",
                    "guide/personal-data-and-audit",
                    "guide/administer-the-installation",
                  ],
                },
              ],
            },
            {
              label: "Reference",
              translations: { es: "Referencia" },
              items: [
                "guide/rule-language",
                "guide/rule-patterns",
                "guide/rule-files",
                "guide/formulas",
                "guide/charts",
                {
                  // Each dashboard chart drawn with made-up data, beside the
                  // page that defines them.
                  label: "Chart examples",
                  translations: { es: "Gráficas de ejemplo" },
                  collapsed: true,
                  items: [{ autogenerate: { directory: "charts" } }],
                },
                "guide/permissions",
              ],
            },
            {
              label: "Method",
              translations: { es: "Método" },
              items: ["guide/methodology", "guide/indicators", "guide/assumptions"],
            },
            {
              // A sector's own material, apart from the rest of the guide, which
              // applies to any organisation.
              label: "Optional module",
              translations: { es: "Módulo opcional" },
              items: ["guide/sector-colombia-finance"],
            },
          ],
        },
        {
          // What an installation runs, one technology per page, for its
          // administrators and technical reviewers.
          label: "Technology stack",
          translations: { es: "Stack tecnológico" },
          items: [
            "guide/stack/overview",
            {
              label: "Platform",
              translations: { es: "Plataforma" },
              items: ["guide/stack/core", "guide/stack/docker-compose"],
            },
            {
              label: "Edge and identity",
              translations: { es: "Entrada e identidad" },
              items: ["guide/stack/traefik", "guide/stack/identity", "guide/stack/mtls"],
            },
            {
              label: "Data",
              translations: { es: "Datos" },
              items: [
                "guide/stack/postgresql",
                "guide/stack/dolt",
                "guide/stack/rustfs",
                "guide/stack/iceberg",
              ],
            },
            {
              label: "Processing",
              translations: { es: "Procesamiento" },
              items: ["guide/stack/trino", "guide/stack/orchestrator"],
            },
            {
              label: "Indicators",
              translations: { es: "Indicadores" },
              items: ["guide/stack/superset", "guide/stack/valkey"],
            },
            {
              label: "Operations",
              translations: { es: "Operación" },
              items: [
                "guide/stack/grafana",
                "guide/stack/loki",
                "guide/stack/mimir",
                "guide/stack/alloy",
              ],
            },
            {
              label: "Updates",
              translations: { es: "Actualizaciones" },
              items: ["guide/stack/agent", "guide/stack/aws"],
            },
          ],
        },
        // The whole documentation on one page, to print or save as a PDF
        // (print.mdx, src/components/PrintBook.astro): the pages above in this
        // order.
        {
          label: "Download PDF",
          translations: { es: "Descargar PDF" },
          link: "/print/",
        },
      ], excluded),
      lastUpdated: false,
      pagination: true,
    }),
  ],
});

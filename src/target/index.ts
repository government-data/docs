// The two outputs of the guide, from the same source (quality-sdk decision
// 0010), chosen by DOCS_TARGET at build time:
//
// - `installation` (the default): the guide inside every installation, at
//   /docs/, behind its sign-in, with the app's menu; served by the image.
// - `public`: the public site, at the root of DOCS_PUBLIC_URL, with
//   Starlight's own theme and language selectors; served by GitHub Pages.
//
// Pure: no I/O, so the config, the content collection and the tests share it.

export type Target = "installation" | "public";

/** The target named by DOCS_TARGET; unset is the installation's. */
export function targetOf(value: string | undefined): Target {
  if (value === undefined || value === "" || value === "installation") return "installation";
  if (value === "public") return "public";
  throw new Error(`DOCS_TARGET must be "installation" or "public", not "${value}"`);
}

/** The public site's URL (Astro's `site`), from DOCS_PUBLIC_URL: required. */
export function publicUrlOf(value: string | undefined): string {
  if (!value) throw new Error("DOCS_TARGET=public needs DOCS_PUBLIC_URL (https://…)");
  const url = new URL(value);
  if (url.protocol !== "https:" || url.pathname !== "/" || url.search || url.hash)
    throw new Error(`DOCS_PUBLIC_URL must be an https origin, not "${value}"`);
  return url.origin;
}

/**
 * The pages the public site leaves out, by id in the default locale; their
 * translations go with them. The installation keeps every page. A page
 * listed here leaves the sidebar, the printed book and the sitemap, and
 * links to it from other pages become plain text (src/target/unlink.ts).
 */
export const EXCLUDED_FROM_PUBLIC: readonly string[] = [
  // Not yet ruled for the public site.
  "guide/sector-colombia-finance",
];

/** Whether an entry id (`guide/x` or `es/guide/x`) is one of `excluded`. */
export function isExcluded(id: string, excluded: readonly string[]): boolean {
  const bare = id.replace(/^es\//, "");
  return excluded.includes(bare);
}

/** The guide's CSP for the public site's `<meta>` tag: the one nginx sends
 * in the installation (infra/headers.inc) without `frame-ancestors`, which
 * a `<meta>` cannot set. */
export const PUBLIC_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "base-uri 'none'",
  "form-action 'self'",
].join("; ");

/** A sidebar entry as written in astro.config.mjs. */
export type SidebarItem = string | { items?: SidebarItem[]; [key: string]: unknown };

/** The sidebar without the excluded pages, and without a group left empty. */
export function sidebarWithout(
  sidebar: readonly SidebarItem[],
  excluded: readonly string[],
): SidebarItem[] {
  return sidebar.flatMap((item): SidebarItem[] => {
    if (typeof item === "string") return isExcluded(item, excluded) ? [] : [item];
    if (!item.items) return [item];
    const items = sidebarWithout(item.items, excluded);
    return items.length ? [{ ...item, items }] : [];
  });
}

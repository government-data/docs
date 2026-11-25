// A figure built by tools/figures (a standalone page) placed inside a docs
// page. Not in a frame: the guide is served with `frame-ancestors 'none'`
// (infra/headers.inc), which forbids framing it even from itself. The page is cut into its styles, its
// markup and its script; the parts of its styles that dress the whole page
// (html, body, the page's width) are left out.
//
// Its theme follows the site's: the figure draws dark unless an ancestor
// says light, and its light rules (`.iso[data-theme="light"]`) are made to
// read Starlight's attribute on <html> instead, so a switch of theme applies
// at once, with no script.
//
// Each figure is kept to its own root (`data-qd-fig`, scope.ts), so two
// figures may share a page without their styles or scripts meeting.

import { scopeCss, scopeScript } from "./scope";

export interface Embed {
  /** The attribute value of the element the figure lives in. */
  name: string;
  css: string;
  markup: string;
  script: string;
}

const LIGHT = '.iso[data-theme="light"]';
const SITE_LIGHT = ':root[data-theme="light"] .iso';

/** The text between `start` and the first `end` after it, or an error. */
function cut(page: string, start: string, end: string, from = 0): [string, number] {
  const i = page.indexOf(start, from);
  const j = i < 0 ? -1 : page.indexOf(end, i + start.length);
  if (i < 0 || j < 0) throw new Error(`figure: "${start}" … "${end}" not found`);
  return [page.slice(i + start.length, j), j + end.length];
}

/** The figure's light rules made to follow the site's theme. */
function themed(css: string): string {
  if (!css.includes(LIGHT)) throw new Error(`figure: no ${LIGHT} rule in its styles`);
  return css.split(LIGHT).join(SITE_LIGHT);
}

/** Cuts a page written by the kit's `pageHtml` into what a docs page embeds. */
export function embedOf(page: string, name: string): Embed {
  if (!/^[a-z-]+$/.test(name)) throw new Error(`figure: "${name}" is not a name`);
  const root = `[data-qd-fig="${name}"]`;
  const [head, afterHead] = cut(page, "<style>", "</style></head>");
  // The kit's own styles end where the page's begin (`*{box-sizing…}`,
  // html, body, `.iso-page`): Starlight already dresses the page.
  const pageRules = head.indexOf("\n*{box-sizing:border-box}");
  if (pageRules < 0) throw new Error("figure: the page's own rules not found");
  const [main, afterMain] = cut(
    page,
    '<main class="iso-page">',
    '</main><script type="module">',
    afterHead,
  );
  const [figureCss, afterCss] = cut(main, "<style>", "</style>");
  const [script] = cut(page, "", "</script></body></html>", afterMain);
  return {
    name,
    css: scopeCss(themed(head.slice(0, pageRules)) + themed(figureCss), root),
    markup: main.slice(afterCss),
    script: scopeScript(script, root),
  };
}

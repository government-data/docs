// The links of a page once it is printed in the book, rewritten at build
// time in the page's HTML (PrintPage.astro), so the book's links work with
// no script and in the PDF. Every link is first resolved against the page's
// own address, since it was written for it, not for the book's. Then a link
// to a page in the book goes to that page's place in it; any other link of
// the site becomes a path from the root. Heading ids, and any id a link of
// the page aims at, get the page's anchor in front, so they are unique in
// the book; so do the ids its elements name for readers (aria-describedby).
// Pure.

/** An origin no link has: it only lets URL resolve paths. */
const ORIGIN = "http://book.invalid";

/** The id an element of a printed page gets in the book. */
export function headingId(anchor: string, id: string): string {
  return `${anchor}--${id}`;
}

const decode = (s: string) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

/** Where a link of a printed page goes.
 *
 * - `href`: the link as written in the page (relative or not, or `#x`);
 * - `page`: the page's own path (`/docs/guide/x/`);
 * - `anchors`: the book's pages, by path (`/docs/guide/x/`) → anchor. */
export function retarget(href: string, page: string, anchors: ReadonlyMap<string, string>): string {
  if (href === "" || href === "#") return href;
  let url: URL;
  try {
    url = new URL(href, ORIGIN + page);
  } catch {
    return href;
  }
  if (url.origin !== ORIGIN) return href;
  const path = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
  const anchor = anchors.get(path);
  if (anchor === undefined) return url.pathname + url.search + url.hash;
  const fragment = decode(url.hash.slice(1));
  return fragment ? `#${headingId(anchor, fragment)}` : `#${anchor}`;
}

const A_HREF = /(<a\b[^>]*?\shref=")([^"]*)(")/gi;
const ID = /(<([a-z][a-z0-9-]*)\b[^>]*?\sid=")([^"]*)(")/gi;
const ARIA = /(\saria-(?:describedby|labelledby|controls)=")([^"]*)(")/gi;

/** A printed page's HTML with its links and the ids they aim at rewritten
 * for the book (`anchor` is the page's own). */
export function rebase(
  html: string,
  page: string,
  anchor: string,
  anchors: ReadonlyMap<string, string>,
): string {
  // The ids this page's own links aim at, besides its headings'.
  const aimed = new Set<string>();
  for (const [, , href] of html.matchAll(A_HREF)) {
    const to = retarget(href.replace(/&amp;/g, "&"), page, anchors);
    const own = `#${anchor}--`;
    if (to.startsWith(own)) aimed.add(to.slice(own.length));
  }
  // And the ids its elements name for readers (a term's meaning).
  for (const [, , names] of html.matchAll(ARIA)) names.split(/\s+/).forEach((n) => aimed.add(n));
  const ids = html.replace(ID, (all, start: string, tag: string, id: string, end: string) => {
    const wanted = /^h[1-6]$/i.test(tag) || aimed.has(decode(id));
    return wanted ? `${start}${headingId(anchor, id)}${end}` : all;
  });
  const named = ids.replace(
    ARIA,
    (_, start: string, names: string, end: string) =>
      `${start}${names
        .split(/\s+/)
        .map((n) => headingId(anchor, n))
        .join(" ")}${end}`,
  );
  return named.replace(
    A_HREF,
    (_, start: string, href: string, end: string) =>
      `${start}${retarget(href.replace(/&amp;/g, "&"), page, anchors).replace(/&/g, "&amp;")}${end}`,
  );
}

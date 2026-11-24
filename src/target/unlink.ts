// A rehype plugin for the public site only: a link to a page the public
// site leaves out (EXCLUDED_FROM_PUBLIC, src/target/index.ts) becomes its
// text, so no page links to a page that is not there. Links are relative
// (`../sector/`), so each is resolved against the page's own path, which
// comes from its file under src/content/docs/.
import { isExcluded } from "./index";

/** The part of a hast (or MDX hast) node this plugin reads or writes. */
interface Node {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: Node[];
}

interface File {
  path?: string;
}

/** A page's path on the site from its file (`guide/a.md` → `/guide/a/`). */
export function pagePathOf(file: string | undefined): string | undefined {
  const relative = file?.replace(/\\/g, "/").split("/src/content/docs/")[1];
  if (!relative) return undefined;
  const id = relative.replace(/\.(md|mdx)$/, "").replace(/(^|\/)index$/, "");
  return id ? `/${id}/` : "/";
}

/** The entry id a link leads to from `page`, or undefined if not a page. */
export function targetIdOf(href: string, page: string): string | undefined {
  const origin = "http://guide.invalid";
  const url = new URL(href, origin + page);
  if (url.origin !== origin) return undefined;
  return url.pathname.replace(/^\/|\/$/g, "");
}

export default function rehypeUnlink(excluded: readonly string[]) {
  const unlink = (node: Node, page: string): Node[] => {
    const children = (node.children ?? []).flatMap((c) => unlink(c, page));
    const href = node.properties?.href;
    if (node.type === "element" && node.tagName === "a" && typeof href === "string") {
      const id = targetIdOf(href, page);
      if (id !== undefined && isExcluded(id, excluded)) return children;
    }
    return node.children ? [{ ...node, children }] : [node];
  };
  return (tree: Node, file: File) => {
    const page = pagePathOf(file.path);
    if (!page || !excluded.length) return;
    tree.children = (tree.children ?? []).flatMap((c) => unlink(c, page));
  };
}

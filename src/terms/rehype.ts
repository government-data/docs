// A rehype plugin that marks the known terms in a page's prose with their
// meaning, in the page's language, so authors never mark them by hand:
//
//   <span class="qd-term qd-term--abbreviation"><abbr class="qd-term-word" tabindex="0"
//     aria-describedby="qd-term-1">ICD</abbr><span class="qd-term-tip" role="tooltip"
//     id="qd-term-1">…expansion… …meaning…</span></span>
//
// An abbreviation is marked wherever it appears; a concept once per section
// (from one h2 to the next), not in a section whose heading names it, and
// not in bold (bold that is the term alone counts as its first occurrence).
// It runs on HTML (after remark-math and rehype-katex), so it covers .md and
// .mdx alike and sees the formulas already drawn; it leaves alone code,
// formulas, links and headings. styles.css draws the highlight and the
// tooltip; tooltip.ts places it.
import { matcher, type Matcher, type Piece } from "./match";
import type { Term, Terminology } from "./types";

/** The part of a hast (or MDX hast) node this plugin reads or writes. */
interface Node {
  type: string;
  value?: string;
  tagName?: string;
  name?: string | null;
  properties?: Record<string, unknown>;
  children?: Node[];
}

interface File {
  path?: string;
}

const HEADINGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);
const SKIP_TAGS = new Set([
  ...["a", "abbr", "code", "pre", "kbd", "samp", "var", "script", "style", "svg", "math"],
  ...["button", "select", "textarea", "title", ...HEADINGS],
]);
const SKIP_CLASSES = ["katex", "katex-display", "expressive-code"];

function classes(node: Node): string[] {
  const value = node.properties?.className;
  if (Array.isArray(value)) return value.map(String);
  return typeof value === "string" ? value.split(/\s+/) : [];
}

const tagOf = (node: Node) => node.tagName ?? node.name ?? "";

const skipped = (node: Node) =>
  SKIP_TAGS.has(tagOf(node)) || classes(node).some((c) => SKIP_CLASSES.includes(c));

/** The heading a node is, or wraps (Starlight's `sl-heading-wrapper`). */
function headingOf(node: Node): Node | undefined {
  if (HEADINGS.has(tagOf(node))) return node;
  if (!classes(node).includes("sl-heading-wrapper")) return undefined;
  return node.children?.find((c) => HEADINGS.has(tagOf(c)));
}

/** The locale of a page from its path under `src/content/docs/`. */
export function localeOf(path: string | undefined, terminology: Terminology): string {
  const relative = path?.replace(/\\/g, "/").split("/src/content/docs/")[1];
  const first = relative?.split("/")[0];
  return first && first in terminology && first !== "root" ? first : "root";
}

const textOf = (node: Node): string =>
  node.type === "text" ? (node.value ?? "") : (node.children ?? []).map(textOf).join("");

const spaced = (s: string) => s.replace(/\s+/g, " ").trim();

const capital = (s: string) => s[0].toUpperCase() + s.slice(1);

function wrap(text: string, term: Term, id: string): Node {
  const el = (tagName: string, properties: Record<string, unknown>, children: Node[]): Node => ({
    type: "element",
    tagName,
    properties,
    children,
  });
  const txt = (value: string): Node => ({ type: "text", value });
  const word = el(
    term.kind === "abbreviation" ? "abbr" : "span",
    { className: ["qd-term-word"], tabIndex: 0, ariaDescribedBy: [id] },
    [txt(text)],
  );
  const title = term.expansion ?? capital(term.term);
  const tip = el(
    "span",
    { className: ["qd-term-tip"], role: "tooltip", id, dataPagefindIgnore: "" },
    [
      el("span", { className: ["qd-term-title"] }, [txt(title)]),
      txt(" "),
      el("span", { className: ["qd-term-meaning"] }, [txt(term.meaning)]),
    ],
  );
  return el("span", { className: ["qd-term", `qd-term--${term.kind}`] }, [word, tip]);
}

/** The plugin (a unified attacher), given the terms of every locale: passed
 * as the plugin's options, they are part of Astro's config, so a change to
 * them renders the pages again. */
export default function rehypeTerms(terminology: Terminology) {
  const all = new Map<string, Matcher>();
  const abbreviations = new Map<string, Matcher>();
  for (const [locale, terms] of Object.entries(terminology)) {
    all.set(locale, matcher(terms));
    abbreviations.set(locale, matcher(terms.filter((t) => t.kind === "abbreviation")));
  }

  return (tree: Node, file: File) => {
    const locale = localeOf(file.path, terminology);
    const match = all.get(locale);
    const onlyAbbreviations = abbreviations.get(locale);
    if (!match || !onlyAbbreviations) return;
    let count = 0;
    let shown = new Set<Term>();

    // A concept already shown in this section is left plain, and so is one in
    // bold. Bold that is the term alone (`A **cut** is…`, a button's name)
    // counts as shown; a bold lead-in (`**The cut.**`) does not. The
    // abbreviations inside are still marked.
    type Bold = string | undefined;
    const mark = (piece: Piece, bold: Bold): Node[] => {
      if (typeof piece === "string") return [{ type: "text", value: piece }];
      const { term, text } = piece;
      if (term.kind === "abbreviation") return [wrap(text, term, `qd-term-${++count}`)];
      const first = !shown.has(term);
      if (bold === undefined || bold === spaced(text)) shown.add(term);
      if (first && bold === undefined) return [wrap(text, term, `qd-term-${++count}`)];
      return onlyAbbreviations(text).flatMap((p) => mark(p, bold));
    };

    const heading = (node: Node) => {
      if (["h1", "h2"].includes(tagOf(node))) shown = new Set();
      for (const piece of match(textOf(node))) {
        if (typeof piece !== "string" && piece.term.kind === "concept") shown.add(piece.term);
      }
    };

    const visit = (node: Node, bold: Bold) => {
      if (!node.children) return;
      node.children = node.children.flatMap((child) => {
        if (child.type === "text" && child.value) {
          return match(child.value).flatMap((piece) => mark(piece, bold));
        }
        const title = headingOf(child);
        if (title) heading(title);
        else if (!skipped(child)) {
          const strong = ["strong", "b"].includes(tagOf(child));
          visit(child, bold ?? (strong ? spaced(textOf(child)) : undefined));
        }
        return [child];
      });
    };
    visit(tree, undefined);
  };
}

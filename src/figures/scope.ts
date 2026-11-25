// Keeps a figure to itself, so two figures on one page cannot clash: every
// rule of its styles is put under the figure's own root, and its script looks
// for its elements under that root instead of the whole document.

/** Index of the brace that closes the block opened at `open`. */
function closing(css: string, open: number): number {
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}" && --depth === 0) return i;
  }
  throw new Error("figure: unbalanced braces in its styles");
}

/** A selector list, split at its top-level commas. */
function selectors(list: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < list.length; i++) {
    if (list[i] === "(" || list[i] === "[") depth++;
    else if (list[i] === ")" || list[i] === "]") depth--;
    else if (list[i] === "," && depth === 0) {
      out.push(list.slice(start, i));
      start = i + 1;
    }
  }
  out.push(list.slice(start));
  return out.map((s) => s.trim()).filter(Boolean);
}

/** One selector under the root; the site's theme switch stays in front. */
function under(selector: string, root: string): string {
  const theme = selector.match(/^:root\[data-theme="[a-z]+"\]/);
  if (theme) return `${theme[0]} ${root} ${selector.slice(theme[0].length).trim()}`;
  return `${root} ${selector}`;
}

/** Every rule of `css` put under `root`; @media, @container and @supports
 * blocks are scoped inside, @keyframes and @font-face kept as they are. */
export function scopeCss(source: string, root: string): string {
  // Comments go first: one in front of a selector would read as part of it.
  const css = source.replace(/\/\*[\s\S]*?\*\//g, "");
  let out = "";
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf("{", i);
    if (open < 0) {
      out += css.slice(i);
      break;
    }
    const head = css.slice(i, open);
    const end = closing(css, open);
    const body = css.slice(open + 1, end);
    const at = head.trim();
    if (/^@(media|container|supports)\b/.test(at)) out += `${head}{${scopeCss(body, root)}}`;
    else if (at.startsWith("@")) out += `${head}{${body}}`;
    else {
      const lead = head.match(/^\s*/)?.[0] ?? "";
      out += `${lead}${selectors(head)
        .map((s) => under(s, root))
        .join(",")}{${body}}`;
    }
    i = end + 1;
  }
  return out;
}

/** The script looking for its elements under its root. */
export function scopeScript(script: string, root: string): string {
  const found = `document.querySelector(${JSON.stringify(root)})`;
  return (
    `const QD_ROOT = ${found};\n` +
    script.replace(/\bdocument\.querySelector(All)?\(/g, "QD_ROOT.querySelector$1(")
  );
}

import type { Term } from "./types";

/** A piece of a text: plain, or one known term. */
export type Piece = string | { text: string; term: Term };

/** Splits a text into plain pieces and the terms it names. */
export type Matcher = (text: string) => Piece[];

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const WORD = "[\\p{L}\\p{N}_]";

/** The regular expression of one written form. Words are matched whole and
 * case-sensitively, except a concept's first letter, which may be a capital
 * (it starts a sentence); the spaces of a phrase match any line break. An
 * abbreviation also matches its plural in `s` (`ICDs`). */
function formPattern(form: string, term: Term): string {
  const words = form.split(/\s+/).map(escape).join("\\s+");
  if (term.kind === "abbreviation") return `${words}s?`;
  const first = form[0];
  const upper = first.toUpperCase();
  const lower = first.toLowerCase();
  return upper === lower ? words : `[${upper}${lower}]${words.slice(escape(first).length)}`;
}

/** The key a written form, or a text it matched, is looked up by. */
function key(text: string, term?: Term): string {
  const spaced = text.replace(/\s+/g, " ");
  if (term?.kind === "abbreviation") return spaced;
  return spaced[0].toLowerCase() + spaced.slice(1);
}

/** A matcher for every written form of the terms. The longest form wins
 * (`IGCD without timeliness` before `IGCD`, `DAMA-DMBOK` before `DAMA`). */
export function matcher(terms: readonly Term[]): Matcher {
  const byKey = new Map<string, Term>();
  const forms: [string, Term][] = [];
  for (const term of terms) {
    for (const form of [term.term, ...(term.forms ?? [])]) {
      forms.push([form, term]);
      byKey.set(key(form, term), term);
    }
  }
  if (forms.length === 0) return (text) => [text];
  const alternatives = forms
    .sort(([a], [b]) => b.length - a.length)
    .map(([form, term]) => formPattern(form, term))
    .join("|");
  const pattern = new RegExp(`(?<!${WORD})(?:${alternatives})(?!${WORD})`, "gu");
  const lookup = (found: string): Term | undefined => {
    const spaced = found.replace(/\s+/g, " ");
    return (
      byKey.get(spaced) ??
      byKey.get(key(spaced)) ??
      (spaced.endsWith("s") ? byKey.get(spaced.slice(0, -1)) : undefined)
    );
  };

  return (text) => {
    const pieces: Piece[] = [];
    let last = 0;
    for (const found of text.matchAll(pattern)) {
      const term = lookup(found[0]);
      if (!term || found.index === undefined) continue;
      if (found.index > last) pieces.push(text.slice(last, found.index));
      pieces.push({ text: found[0], term });
      last = found.index + found[0].length;
    }
    if (last < text.length) pieces.push(text.slice(last));
    return pieces;
  };
}

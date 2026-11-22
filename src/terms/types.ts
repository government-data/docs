// The terminology of the documentation, one set of lists per language
// (en/, es/, gathered in index.ts): the abbreviations, and the concepts of
// data quality and of the product. Pages never mark them: the rehype plugin
// (rehype.ts) finds them in the prose and adds the tooltip. The lists are
// plain data, so a page that lists every term of a language can be generated
// from them.

/** An abbreviation, marked wherever it appears, or a concept, an ordinary
 * word or phrase, marked once per section. */
export type Kind = "abbreviation" | "concept";

/** One term and what it means, in one language. */
export interface Term {
  kind: Kind;
  /** The term as a list would show it: the abbreviation (`ICD`), or the
   * concept in its base form, in lower case unless a name (`cut`). */
  term: string;
  /** What an abbreviation's letters stand for. */
  expansion?: string;
  /** What it means, in a sentence or two. */
  meaning: string;
  /** Other written forms that are the same term: plurals and inflections
   * (`cuts`; `cortes`). An abbreviation's plural in `s` needs none. */
  forms?: readonly string[];
}

/** The terms of each locale, by the first folder of the page under
 * `src/content/docs/` (`es`), or `root` for the default locale. */
export type Terminology = Record<string, readonly Term[]>;

/** An abbreviation, in a list. */
export const abbr = (term: string, expansion: string, meaning: string): Term => ({
  kind: "abbreviation",
  term,
  expansion,
  meaning,
});

/** A concept and its other forms, in a list. */
export const concept = (term: string, meaning: string, forms: readonly string[] = []): Term => ({
  kind: "concept",
  term,
  meaning,
  forms,
});

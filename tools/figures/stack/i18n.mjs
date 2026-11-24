// The figure's language. English is written in the code; Spanish comes from
// the dictionary (es.json, through es.mjs), keyed by the English text, so the structure has
// one source. The build sets the language before it draws; a text with no
// Spanish entry is recorded, and the build fails on it.
import { ES } from "./es.mjs";

// Texts already in Spanish: data translated before they are drawn come back.
const DONE = new Set(Object.values(ES));
let lang = "en";
export const missing = new Set();
export const setLang = (value) => {
  lang = value;
};
export const langOf = () => lang;

/** A text in the figure's language. */
export function tr(text) {
  if (lang === "en" || !looksLikeText(text)) return text;
  if (text in ES) return ES[text];
  if (DONE.has(text)) return text;
  missing.add(text);
  return text;
}

/** A template with {placeholders}, translated, then filled. */
export const tf = (template, values) =>
  tr(template).replace(/\{(\w+)\}/g, (_, key) => String(values[key]));

// Keys whose values are identifiers or sources, never words for a reader.
const KEEP = new Set([
  "id",
  "at",
  "from",
  "to",
  "state",
  "kind",
  "group",
  "res",
  "refs",
  "unitId",
  "cls",
  "face",
  "lcd",
]);

/** Words for a reader: a letter, and not an identifier (a.b, a-b, lower_case). */
export function looksLikeText(text) {
  if (typeof text !== "string" || !/[A-Za-z]/.test(text)) return false;
  if (/^[a-z0-9]+([._:-][a-z0-9]+)*$/.test(text)) return /^[a-z]{3,}$/.test(text);
  return true;
}

/** Every reader's text inside `value`, translated in place. */
export function trDeep(value, key = "") {
  if (Array.isArray(value)) {
    value.forEach((item, i) => {
      if (typeof item === "string") value[i] = tr(item);
      else trDeep(item, key);
    });
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      if (KEEP.has(k)) continue;
      if (typeof v === "string") value[k] = tr(v);
      else trDeep(v, k);
    }
  }
  return value;
}

// The same, as source for the page's script: its data come from the model's
// source, so the browser translates them once, before the first frame.
export const browserSource = (dict) =>
  `const ES = ${JSON.stringify(dict)};
const tr = (text) => (typeof text === "string" && text in ES ? ES[text] : text);
const tf = (template, values) => tr(template).replace(/\\{(\\w+)\\}/g, (_, key) => String(values[key]));
const KEEP = new Set(${JSON.stringify([...KEEP])});
function trDeep(value) {
  if (Array.isArray(value)) value.forEach((item, i) => (typeof item === "string" ? (value[i] = tr(item)) : trDeep(item)));
  else if (value && typeof value === "object")
    for (const [k, v] of Object.entries(value)) if (!KEEP.has(k)) typeof v === "string" ? (value[k] = tr(v)) : trDeep(v);
  return value;
}
`;

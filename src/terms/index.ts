import { en } from "./en";
import { es } from "./es";
import type { Terminology } from "./types";

/** Every language's terms, by locale as in astro.config.mjs (`root` is
 * English): what the rehype plugin marks, and what a page listing all the
 * terms of a language would show. */
export const terminology: Terminology = { root: en, es };

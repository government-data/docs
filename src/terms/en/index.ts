import { abbreviations } from "./abbreviations";
import { product } from "./product";
import { quality } from "./quality";
import { statistics } from "./statistics";

/** Every term of the English pages. */
export const en = [...abbreviations, ...product, ...quality, ...statistics];

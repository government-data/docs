// Charts drawn as static SVG: no library and nothing loaded from
// outside (the installation may have no internet). Each mark carries its value
// for the tooltip (Chart.astro) and every figure has its table, so nothing
// depends on hovering or on telling colors apart.

export type Lang = "es" | "en";

export interface LegendItem {
  label: string;
  color: string;
  kind?: "rect" | "line" | "dash" | "dot";
  icon?: string;
}

export interface Table {
  head: string[];
  rows: string[][];
}

export interface Plot {
  svg: string;
  legend?: LegendItem[];
  table: Table;
}

export interface Figure {
  title: string;
  note?: string;
  plot: Plot;
  /** Where the chart's data comes from: the results model's
   * table it queries, and what a dataset needs for the chart to apply. */
  source?: { query: string; needs: string };
  /** Real results, not the guide's example data: no example mark. */
  live?: boolean;
}

/** The drawing's width; the height depends on the chart. It scales to the page. */
export const W = 640;

export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const r1 = (v: number) => Math.round(v * 10) / 10;

export function num(lang: Lang, v: number, digits = 0): string {
  return new Intl.NumberFormat(lang === "es" ? "es-CO" : "en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(v);
}

export function pct(lang: Lang, v: number, digits = 0): string {
  return num(lang, v * 100, digits) + (lang === "es" ? " %" : "%");
}

/** A mark's tooltip: the value leads, the label follows. */
export function hit(label: string, value: string): string {
  return ` class="viz-hit" tabindex="0" data-l="${esc(label)}" data-v="${esc(value)}"`;
}

export function svg(height: number, body: string): string {
  return `<svg class="viz-svg" viewBox="0 0 ${W} ${r1(height)}" preserveAspectRatio="xMidYMid meet">${body}</svg>`;
}

export function text(
  cls: string,
  x: number,
  y: number,
  s: string,
  anchor = "start",
  extra = "",
): string {
  return `<text class="${cls}" x="${r1(x)}" y="${r1(y)}" text-anchor="${anchor}" dominant-baseline="central"${extra}>${esc(s)}</text>`;
}

/** A horizontal bar from x0 to x1 (either way), rounded at its data end only. */
export function hbar(x0: number, x1: number, y: number, h: number, r = 4): string {
  const w = Math.abs(x1 - x0);
  if (w < 0.5) return "";
  const s = x1 > x0 ? 1 : -1;
  const rr = Math.min(r, w, h / 2);
  return `M${r1(x0)},${r1(y)}H${r1(x1 - s * rr)}Q${r1(x1)},${r1(y)} ${r1(x1)},${r1(y + rr)}V${r1(y + h - rr)}Q${r1(x1)},${r1(y + h)} ${r1(x1 - s * rr)},${r1(y + h)}H${r1(x0)}Z`;
}

/** A column from the baseline y0 up to y1, rounded at its top only. */
export function vbar(x: number, w: number, y0: number, y1: number, r = 4): string {
  const h = y0 - y1;
  if (h < 0.5) return "";
  const rr = Math.min(r, h, w / 2);
  return `M${r1(x)},${r1(y0)}V${r1(y1 + rr)}Q${r1(x)},${r1(y1)} ${r1(x + rr)},${r1(y1)}H${r1(x + w - rr)}Q${r1(x + w)},${r1(y1)} ${r1(x + w)},${r1(y1 + rr)}V${r1(y0)}Z`;
}

/** Clean steps between min and max, about n of them. */
export function ticks(min: number, max: number, n = 5): number[] {
  const raw = (max - min) / n;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const err = raw / mag;
  const step = (err >= 7.5 ? 10 : err >= 3.5 ? 5 : err >= 1.5 ? 2 : 1) * mag;
  const out: number[] = [];
  for (let v = Math.ceil(min / step - 1e-9) * step; v <= max + step * 1e-9; v += step) {
    out.push(Number(v.toFixed(10)));
  }
  return out;
}

/** About how wide a label is at the charts' 12px. */
export const textWidth = (s: string) => s.length * 6.6;

/** A label cut with an ellipsis to fit `width`; the mark's tooltip and the
 * figure's table keep it whole. */
export function fit(s: string, width: number): string {
  if (textWidth(s) <= width) return s;
  const keep = Math.max(1, Math.floor(width / 6.6) - 1);
  return `${s.slice(0, keep)}…`;
}

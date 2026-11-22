// Horizontal bars: one series, stacked, and around zero.

import { W, r1, fit, hit, svg, text, hbar, textWidth } from "./base";

// ---------------------------------------------------------------------------
// Horizontal bars, one series.

export interface BarsOptions {
  rows: { label: string; value: number; muted?: boolean }[];
  max: number;
  fmt: (v: number) => string;
  ref?: { value: number; label: string };
  labelWidth?: number;
  color?: string;
}

export function bars(o: BarsOptions): string {
  const x0 = o.labelWidth ?? 190;
  const x1 = W - 60;
  const step = 26;
  const h = 16;
  const top = o.ref ? 24 : 6;
  const height = top + o.rows.length * step + 6;
  const sx = (v: number) => x0 + (v / o.max) * (x1 - x0);
  let s = "";
  o.rows.forEach((r, i) => {
    const y = top + i * step + (step - h) / 2;
    const fill = r.muted ? "var(--viz-muted-fill)" : (o.color ?? "var(--viz-s1)");
    s +=
      `<g${hit(r.label, o.fmt(r.value))}>` +
      `<rect class="viz-hitbox" x="0" y="${top + i * step}" width="${W}" height="${step}"/>` +
      text("viz-lbl", x0 - 8, y + h / 2, fit(r.label, x0 - 12), "end") +
      `<path class="viz-mark" fill="${fill}" d="${hbar(x0, sx(r.value), y, h)}"/>` +
      text("viz-val", sx(r.value) + 6, y + h / 2, o.fmt(r.value)) +
      `</g>`;
  });
  s += `<line class="viz-base" x1="${x0}" x2="${x0}" y1="${top - 2}" y2="${height - 4}"/>`;
  if (o.ref) {
    const x = r1(sx(o.ref.value));
    s += `<line class="viz-ref" x1="${x}" x2="${x}" y1="${top - 4}" y2="${height - 4}"/>`;
    s += text("viz-ax", x, top - 13, o.ref.label, "middle");
  }
  return svg(height, s);
}

// ---------------------------------------------------------------------------
// Horizontal stacked bars: in parts of 100 % or in counts.

export interface StackSeries {
  label: string;
  color: string;
  /** The label's ink inside the fill: white, or near-black on light fills. */
  ink: string;
}

export interface StackedOptions {
  rows: { label: string; parts: number[] }[];
  series: StackSeries[];
  percent: boolean;
  /** For counts: the scale's top. */
  max?: number;
  fmt: (v: number, total: number) => string;
  totalFmt?: (total: number) => string;
  labelWidth?: number;
}

export function stacked(o: StackedOptions): string {
  const x0 = o.labelWidth ?? 170;
  const x1 = W - (o.percent ? 8 : 60);
  const step = o.percent ? 36 : 26;
  const h = o.percent ? 22 : 16;
  const top = 6;
  const height = top + o.rows.length * step + 6;
  let s = "";
  o.rows.forEach((r, i) => {
    const total = r.parts.reduce((a, b) => a + b, 0);
    const scale = o.percent ? total : (o.max ?? total);
    const y = top + i * step + (step - h) / 2;
    const last = r.parts.reduce((k, p, j) => (p > 0 ? j : k), -1);
    s += text("viz-lbl", x0 - 8, y + h / 2, fit(r.label, x0 - 12), "end");
    let x = x0;
    r.parts.forEach((p, k) => {
      if (p <= 0) return;
      const w = (p / scale) * (x1 - x0);
      const series = o.series[k];
      const d =
        k === last
          ? hbar(x, x + w, y, h)
          : `M${r1(x)},${r1(y)}h${r1(Math.max(w - 2, 0.5))}v${h}h${r1(-Math.max(w - 2, 0.5))}Z`;
      const value = o.fmt(p, total);
      s +=
        `<g${hit(`${r.label} · ${series.label}`, value)}>` +
        `<rect class="viz-hitbox" x="${r1(x)}" y="${top + i * step}" width="${r1(w)}" height="${step}"/>` +
        `<path class="viz-mark" fill="${series.color}" d="${d}"/>` +
        (w - 2 > textWidth(value) + 10
          ? text("viz-in", x + (w - 2) / 2, y + h / 2, value, "middle", ` fill="${series.ink}"`)
          : "") +
        `</g>`;
      x += w;
    });
    if (!o.percent && o.totalFmt) s += text("viz-val", x + 6, y + h / 2, o.totalFmt(total));
  });
  s += `<line class="viz-base" x1="${x0}" x2="${x0}" y1="${top - 2}" y2="${height - 4}"/>`;
  return svg(height, s);
}

// ---------------------------------------------------------------------------
// Horizontal bars around zero: gains to the right, losses to the left.

export interface DivergingOptions {
  rows: { label: string; value: number }[];
  max: number;
  fmt: (v: number) => string;
  labelWidth?: number;
}

export function diverging(o: DivergingOptions): string {
  const x0 = o.labelWidth ?? 130;
  const x1 = W - 10;
  const mid = (x0 + x1) / 2;
  const half = (x1 - x0) / 2 - 56;
  const step = 26;
  const h = 16;
  const top = 6;
  const height = top + o.rows.length * step + 6;
  let s = "";
  o.rows.forEach((r, i) => {
    const y = top + i * step + (step - h) / 2;
    const xe = mid + (r.value / o.max) * half;
    const up = r.value >= 0;
    s +=
      `<g${hit(r.label, o.fmt(r.value))}>` +
      `<rect class="viz-hitbox" x="0" y="${top + i * step}" width="${W}" height="${step}"/>` +
      text("viz-lbl", x0 - 8, y + h / 2, fit(r.label, x0 - 12), "end") +
      `<path class="viz-mark" fill="var(${up ? "--viz-pos" : "--viz-neg"})" d="${hbar(mid, xe, y, h)}"/>` +
      text("viz-val", up ? xe + 6 : xe - 6, y + h / 2, o.fmt(r.value), up ? "start" : "end") +
      `</g>`;
  });
  s += `<line class="viz-base" x1="${mid}" x2="${mid}" y1="${top - 2}" y2="${height - 4}"/>`;
  return svg(height, s);
}

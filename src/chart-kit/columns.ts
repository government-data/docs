// Columns, one series or grouped.

import { W, r1, hit, svg, text, vbar, ticks } from "./base";

// ---------------------------------------------------------------------------
// Columns, one series or grouped.

export interface ColumnSeries {
  label: string;
  color: string;
  values: number[];
}

export interface ColumnsOptions {
  cats: string[];
  series: ColumnSeries[];
  yMax: number;
  yFmt: (v: number) => string;
  valFmt: (v: number) => string;
  /** Horizontal reference lines (a target, a threshold). */
  refs?: { value: number; label: string }[];
  /** Vertical reference lines between columns: `at` counts columns from the left. */
  vrefs?: { at: number; label: string }[];
  /** Show only every n-th category's name. */
  labelEvery?: number;
  /** Names at each column's left edge, for bins named by where they start. */
  edgeLabels?: boolean;
  /** The value on each column's cap (only with few columns). */
  showValues?: boolean;
  height?: number;
}

export function columns(o: ColumnsOptions): string {
  const height = o.height ?? 250;
  const x0 = 48;
  const x1 = W - 12;
  const top = o.vrefs ? 26 : 16;
  const y0 = height - 30;
  const sy = (v: number) => y0 - (v / o.yMax) * (y0 - top);
  const slot = (x1 - x0) / o.cats.length;
  const n = o.series.length;
  const gw = Math.min(slot * 0.72, 24 * n + 2 * (n - 1));
  const bw = (gw - 2 * (n - 1)) / n;
  let s = "";
  for (const t of ticks(0, o.yMax)) {
    s += `<line class="viz-grid" x1="${x0}" x2="${x1}" y1="${r1(sy(t))}" y2="${r1(sy(t))}"/>`;
    s += text("viz-ax", x0 - 6, sy(t), o.yFmt(t), "end");
  }
  o.cats.forEach((c, i) => {
    const gx = x0 + i * slot + (slot - gw) / 2;
    const tip =
      n === 1
        ? o.valFmt(o.series[0].values[i])
        : o.series.map((ser) => `${ser.label}: ${o.valFmt(ser.values[i])}`).join("\n");
    s += `<g${hit(c, tip)}><rect class="viz-hitbox" x="${r1(x0 + i * slot)}" y="${top}" width="${r1(slot)}" height="${y0 - top}"/>`;
    o.series.forEach((ser, k) => {
      const x = gx + k * (bw + 2);
      s += `<path class="viz-mark" fill="${ser.color}" d="${vbar(x, bw, y0, sy(ser.values[i]))}"/>`;
      if (o.showValues)
        s += text("viz-val", x + bw / 2, sy(ser.values[i]) - 9, o.valFmt(ser.values[i]), "middle");
    });
    s += `</g>`;
    if (!o.labelEvery || i % o.labelEvery === 0) {
      s += text("viz-ax", x0 + i * slot + (o.edgeLabels ? 0 : slot / 2), y0 + 14, c, "middle");
    }
  });
  s += `<line class="viz-base" x1="${x0}" x2="${x1}" y1="${y0}" y2="${y0}"/>`;
  for (const r of o.refs ?? []) {
    const y = r1(sy(r.value));
    s += `<line class="viz-ref" x1="${x0}" x2="${x1}" y1="${y}" y2="${y}"/>`;
    s += text("viz-ax", x1, y - 9, r.label, "end");
  }
  for (const r of o.vrefs ?? []) {
    const x = r1(x0 + r.at * slot);
    s += `<line class="viz-ref" x1="${x}" x2="${x}" y1="${top - 6}" y2="${y0}"/>`;
    s += text("viz-ax", x, top - 14, r.label, "middle");
  }
  return svg(height, s);
}

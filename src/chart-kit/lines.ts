// Lines over time: static SVG, a gap where a point
// has no value, and the figure's table with every point of every series, so
// nothing depends on hovering or on telling the lines apart.

import type { Plot } from "./base";
import { W, r1, hit, svg, text, textWidth, ticks } from "./base";

// ---------------------------------------------------------------------------
// Lines over time; the hover shows every series at that point.

export interface LineSeries {
  label: string;
  color: string;
  /** A point without a value (`null`) leaves a gap in the line. */
  values: (number | null)[];
}

export interface LinesOptions {
  xs: string[];
  series: LineSeries[];
  yMin: number;
  yMax: number;
  yFmt: (v: number) => string;
  refs?: { value: number; label: string }[];
}

export function lines(o: LinesOptions): string {
  const height = 260;
  const x0 = 48;
  const x1 = W - 70;
  const top = 14;
  const y0 = height - 30;
  const sy = (v: number) => y0 - ((v - o.yMin) / (o.yMax - o.yMin)) * (y0 - top);
  const sx = (i: number) =>
    o.xs.length === 1 ? (x0 + x1) / 2 : x0 + (i / (o.xs.length - 1)) * (x1 - x0);
  // Every k-th label under the axis, so they do not overlap; the last always.
  const room = (x1 - x0) / Math.max(o.xs.length - 1, 1);
  const every = Math.max(1, Math.ceil((Math.max(...o.xs.map(textWidth), 0) + 12) / room));
  const fmt = (v: number | null) => (v === null ? "—" : o.yFmt(v));
  let s = "";
  for (const t of ticks(o.yMin, o.yMax)) {
    s += `<line class="viz-grid" x1="${x0}" x2="${x1}" y1="${r1(sy(t))}" y2="${r1(sy(t))}"/>`;
    s += text("viz-ax", x0 - 6, sy(t), o.yFmt(t), "end");
  }
  o.xs.forEach((x, i) => {
    const last = i === o.xs.length - 1;
    if (last || (i % every === 0 && o.xs.length - 1 - i >= every)) {
      s += text("viz-ax", sx(i), y0 + 14, x, "middle");
    }
  });
  for (const r of o.refs ?? []) {
    const y = r1(sy(r.value));
    s += `<line class="viz-ref" x1="${x0}" x2="${x1}" y1="${y}" y2="${y}"/>`;
    s += text("viz-ax", x1 + 6, y, r.label);
  }
  s += `<line class="viz-base" x1="${x0}" x2="${x1}" y1="${y0}" y2="${y0}"/>`;
  for (const ser of o.series) {
    // One polyline per run of values; a lone value gets its dot.
    let run: string[] = [];
    const flush = () => {
      if (run.length > 1)
        s += `<polyline class="viz-line" stroke="${ser.color}" points="${run.join(" ")}"/>`;
      run = [];
    };
    ser.values.forEach((v, i) => {
      if (v === null) flush();
      else run.push(`${r1(sx(i))},${r1(sy(v))}`);
    });
    flush();
    let i = ser.values.length - 1;
    while (i >= 0 && ser.values[i] === null) i--;
    const v = ser.values[i];
    if (v === null || v === undefined) continue;
    s += `<circle class="viz-dot" fill="${ser.color}" cx="${r1(sx(i))}" cy="${r1(sy(v))}" r="4"/>`;
    s += text("viz-val", sx(i) + 8, sy(v), o.yFmt(v));
  }
  // The crosshair: one band per point in time, as wide as the gap between them.
  const half = (x1 - x0) / Math.max(o.xs.length - 1, 1) / 2;
  o.xs.forEach((x, i) => {
    const tip = o.series.map((ser) => `${ser.label}: ${fmt(ser.values[i])}`).join("\n");
    s +=
      `<g${hit(x, tip)}><rect class="viz-hitbox" x="${r1(sx(i) - half)}" y="${top}" width="${r1(half * 2)}" height="${y0 - top}"/>` +
      `<line class="viz-cross" x1="${r1(sx(i))}" x2="${r1(sx(i))}" y1="${top}" y2="${y0}"/></g>`;
  });
  return svg(height, s);
}

export interface LinePlotOptions extends LinesOptions {
  /** The table's first column's heading: what the points are (a time). */
  xHead: string;
}

/** The lines with their legend and their table: a row per point, a column
 * per series, "—" where a series has no value. */
export function linePlot(o: LinePlotOptions): Plot {
  const fmt = (v: number | null | undefined) => (v === null || v === undefined ? "—" : o.yFmt(v));
  return {
    svg: lines(o),
    legend: o.series.map((s) => ({ label: s.label, color: s.color, kind: "line" as const })),
    table: {
      head: [o.xHead, ...o.series.map((s) => s.label)],
      rows: o.xs.map((x, i) => [x, ...o.series.map((s) => fmt(s.values[i]))]),
    },
  };
}

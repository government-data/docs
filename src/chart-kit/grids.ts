// Matrices, dots and points on two scales.

import { W, r1, hit, svg, text, ticks } from "./base";

// ---------------------------------------------------------------------------
// A matrix of counts, shaded light to dark.

const RAMP = [
  "#cde2fb",
  "#b7d3f6",
  "#9ec5f4",
  "#86b6ef",
  "#6da7ec",
  "#5598e7",
  "#3987e5",
  "#2a78d6",
  "#256abf",
  "#1c5cab",
  "#184f95",
  "#104281",
];

export interface HeatmapOptions {
  rows: string[];
  cols: string[];
  values: number[][];
  rowTitle: string;
  colTitle: string;
  fmt: (v: number) => string;
}

export function heatmap(o: HeatmapOptions): string {
  const x0 = 150;
  const top = 46;
  const cw = (W - x0 - 4) / o.cols.length;
  const ch = 46;
  const height = top + o.rows.length * ch + 4;
  const max = Math.max(...o.values.flat());
  let s = text("viz-ax", x0 + (W - x0) / 2, 10, o.colTitle, "middle");
  s += text("viz-ax", 4, top - 16, o.rowTitle);
  o.cols.forEach((c, j) => (s += text("viz-lbl", x0 + j * cw + cw / 2, top - 16, c, "middle")));
  o.rows.forEach((r, i) => {
    s += text("viz-lbl", x0 - 10, top + i * ch + ch / 2, r, "end");
    o.cols.forEach((c, j) => {
      const v = o.values[i][j];
      const k = Math.round(Math.sqrt(v / max) * (RAMP.length - 1));
      const ink = k >= 6 ? "#ffffff" : "#0b0b0b";
      s +=
        `<g${hit(`${r} → ${c}`, o.fmt(v))}>` +
        `<rect class="viz-mark" fill="${RAMP[k]}" rx="4" x="${r1(x0 + j * cw + 1)}" y="${r1(top + i * ch + 1)}" width="${r1(cw - 2)}" height="${ch - 2}"/>` +
        text(
          "viz-in",
          x0 + j * cw + cw / 2,
          top + i * ch + ch / 2,
          o.fmt(v),
          "middle",
          ` fill="${ink}"`,
        ) +
        `</g>`;
    });
  });
  return svg(height, s);
}

// ---------------------------------------------------------------------------
// One dot per row on a common scale, with a shaded zone and a threshold.

export interface DotsOptions {
  rows: { label: string; value: number; ok: boolean }[];
  min: number;
  max: number;
  zone: [number, number];
  zoneLabel: string;
  ref: { value: number; label: string };
  fmt: (v: number) => string;
  okLabel: string;
  failLabel: string;
  labelWidth?: number;
}

export function dots(o: DotsOptions): string {
  const x0 = o.labelWidth ?? 190;
  const x1 = W - 20;
  const step = 26;
  const top = 24;
  const bottom = top + o.rows.length * step;
  const height = bottom + 26;
  const sx = (v: number) => x0 + ((v - o.min) / (o.max - o.min)) * (x1 - x0);
  let s = `<rect class="viz-zone" x="${r1(sx(o.zone[0]))}" y="${top}" width="${r1(sx(o.zone[1]) - sx(o.zone[0]))}" height="${bottom - top}"/>`;
  s += text("viz-ax", (sx(o.zone[0]) + sx(o.zone[1])) / 2, top - 13, o.zoneLabel, "middle");
  for (const t of ticks(o.min, o.max)) {
    s += `<line class="viz-grid" x1="${r1(sx(t))}" x2="${r1(sx(t))}" y1="${top}" y2="${bottom}"/>`;
    s += text("viz-ax", sx(t), bottom + 14, o.fmt(t), "middle");
  }
  const xr = r1(sx(o.ref.value));
  s += `<line class="viz-ref" x1="${xr}" x2="${xr}" y1="${top}" y2="${bottom}"/>`;
  s += text("viz-ax", xr + 4, top - 13, o.ref.label);
  o.rows.forEach((r, i) => {
    const y = top + i * step + step / 2;
    s +=
      `<g${hit(`${r.ok ? "✓" : "✕"} ${r.label} · ${r.ok ? o.okLabel : o.failLabel}`, o.fmt(r.value))}>` +
      `<rect class="viz-hitbox" x="0" y="${top + i * step}" width="${W}" height="${step}"/>` +
      text("viz-lbl", x0 - 8, y, `${r.ok ? "✓" : "✕"} ${r.label}`, "end") +
      `<circle class="viz-dot" fill="var(${r.ok ? "--viz-good" : "--viz-crit"})" cx="${r1(sx(r.value))}" cy="${y}" r="5"/>` +
      `</g>`;
  });
  return svg(height, s);
}

// ---------------------------------------------------------------------------
// Points on two scales, with limit curves and reference lines.

export interface ScatterOptions {
  points: { x: number; y: number; cls: string; label: string; value: string }[];
  classes: Record<string, { color: string }>;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  xFmt: (v: number) => string;
  yFmt: (v: number) => string;
  xTitle: string;
  yTitle: string;
  /** Category names under the x axis in place of numbers: `at` is the x value. */
  xCats?: { at: number; label: string }[];
  curves?: { pts: [number, number][] }[];
  hlines?: { value: number; label: string; left?: boolean }[];
  /** Draw the classes in this order, the important ones last (on top). */
  order?: string[];
}

export function scatter(o: ScatterOptions): string {
  const height = 300;
  const x0 = 52;
  const x1 = W - 16;
  const top = 14;
  const y0 = height - 44;
  const sx = (v: number) => x0 + ((v - o.xMin) / (o.xMax - o.xMin)) * (x1 - x0);
  const sy = (v: number) => y0 - ((v - o.yMin) / (o.yMax - o.yMin)) * (y0 - top);
  let s = "";
  for (const t of ticks(o.yMin, o.yMax)) {
    s += `<line class="viz-grid" x1="${x0}" x2="${x1}" y1="${r1(sy(t))}" y2="${r1(sy(t))}"/>`;
    s += text("viz-ax", x0 - 6, sy(t), o.yFmt(t), "end");
  }
  if (o.xCats) {
    for (const c of o.xCats) s += text("viz-ax", sx(c.at), y0 + 14, c.label, "middle");
  } else {
    for (const t of ticks(o.xMin, o.xMax)) s += text("viz-ax", sx(t), y0 + 14, o.xFmt(t), "middle");
  }
  s += text("viz-ax", (x0 + x1) / 2, y0 + 34, o.xTitle, "middle");
  s += text(
    "viz-ax",
    12,
    top + (y0 - top) / 2,
    o.yTitle,
    "middle",
    ` transform="rotate(-90 12 ${r1(top + (y0 - top) / 2)})"`,
  );
  s += `<line class="viz-base" x1="${x0}" x2="${x1}" y1="${y0}" y2="${y0}"/>`;
  for (const c of o.curves ?? []) {
    s += `<polyline class="viz-limit" points="${c.pts.map(([x, y]) => `${r1(sx(x))},${r1(sy(y))}`).join(" ")}"/>`;
  }
  for (const h of o.hlines ?? []) {
    const y = r1(sy(h.value));
    s += `<line class="viz-ref" x1="${x0}" x2="${x1}" y1="${y}" y2="${y}"/>`;
    s += h.left
      ? text("viz-ax", x0 + 4, y - 9, h.label)
      : text("viz-ax", x1 - 2, y - 9, h.label, "end");
  }
  const order = o.order ?? Object.keys(o.classes);
  for (const cls of order) {
    for (const p of o.points.filter((q) => q.cls === cls)) {
      s +=
        `<g${hit(p.label, p.value)}>` +
        `<circle class="viz-hitbox" cx="${r1(sx(p.x))}" cy="${r1(sy(p.y))}" r="12"/>` +
        `<circle class="viz-dot" fill="${o.classes[cls].color}" cx="${r1(sx(p.x))}" cy="${r1(sy(p.y))}" r="4"/>` +
        `</g>`;
    }
  }
  return svg(height, s);
}

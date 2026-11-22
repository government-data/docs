import { describe, expect, it } from "vitest";

import { linePlot } from "./lines";

const plot = () =>
  linePlot({
    xHead: "Time",
    xs: ["10:00", "10:10", "10:20", "10:30"],
    series: [
      { label: "In", color: "var(--viz-s1)", values: [1, 2, null, 4] },
      { label: "Out", color: "var(--viz-s2)", values: [null, null, null, null] },
    ],
    yMin: 0,
    yMax: 5,
    yFmt: (v) => `${v} B/s`,
  });

describe("the line chart", () => {
  it("has a table with a row per point and a column per series, a dash for no value", () => {
    expect(plot().table).toEqual({
      head: ["Time", "In", "Out"],
      rows: [
        ["10:00", "1 B/s", "—"],
        ["10:10", "2 B/s", "—"],
        ["10:20", "—", "—"],
        ["10:30", "4 B/s", "—"],
      ],
    });
  });

  it("breaks the line where a point has no value and draws nothing for an empty series", () => {
    const { svg, legend } = plot();
    // "In": one run of two points, then a gap, then a lone last point with its dot.
    expect(svg.match(/<polyline /g)).toHaveLength(1);
    expect(svg.match(/<circle /g)).toHaveLength(1);
    expect(svg).toContain("4 B/s");
    expect(svg).not.toContain('stroke="var(--viz-s2)"');
    // A crosshair per point, each with every series' value.
    expect(svg.match(/class="viz-cross"/g)).toHaveLength(4);
    expect(svg).toContain('data-v="In: —\nOut: —"');
    expect(legend).toEqual([
      { label: "In", color: "var(--viz-s1)", kind: "line" },
      { label: "Out", color: "var(--viz-s2)", kind: "line" },
    ]);
  });

  it("escapes what it is given", () => {
    const { svg, table } = linePlot({
      xHead: "<t>",
      xs: ["<a>"],
      series: [{ label: "<b>", color: "red", values: [1] }],
      yMin: 0,
      yMax: 1,
      yFmt: String,
    });
    expect(svg).not.toContain("<a>");
    expect(svg).not.toContain("<b>");
    expect(table.head).toEqual(["<t>", "<b>"]);
  });
});

import type { Figure, Lang, LegendItem, Table } from "./base";
import { esc } from "./base";

// ---------------------------------------------------------------------------
// The figure around a chart: title, the example-data mark, legend, drawing and
// its table.

const LABELS = {
  es: {
    demo: "Datos de ejemplo",
    table: "Ver los datos en una tabla",
    query: "Consulta",
    needs: "Requiere",
  },
  en: { demo: "Example data", table: "Show the data as a table", query: "Query", needs: "Needs" },
};

function legend(items: LegendItem[]): string {
  const li = items
    .map(
      (it) =>
        `<li><span class="viz-key viz-key--${it.kind ?? "rect"}" style="--key:${it.color}"></span>` +
        (it.icon ? `<span class="viz-icon" aria-hidden="true">${esc(it.icon)}</span>` : "") +
        `${esc(it.label)}</li>`,
    )
    .join("");
  return `<ul class="viz-legend">${li}</ul>`;
}

function table(t: Table): string {
  const head = t.head.map((h) => `<th scope="col">${esc(h)}</th>`).join("");
  const rows = t.rows
    .map(
      (r) =>
        `<tr>${r.map((c, i) => (i === 0 ? `<th scope="row">${esc(c)}</th>` : `<td>${esc(c)}</td>`)).join("")}</tr>`,
    )
    .join("");
  return `<table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table>`;
}

export function figure(lang: Lang, f: Figure): string {
  const l = LABELS[lang];
  return (
    `<figure class="viz not-content">` +
    `<figcaption><span class="viz-title">${esc(f.title)}</span>` +
    (f.live ? "" : `<span class="viz-demo">${l.demo}</span>`) +
    (f.note ? `<span class="viz-note">${esc(f.note)}</span>` : "") +
    `</figcaption>` +
    (f.plot.legend ? legend(f.plot.legend) : "") +
    f.plot.svg +
    (f.source
      ? `<p class="viz-source"><span><b>${l.query}</b> <code>${esc(f.source.query)}</code></span>` +
        `<span><b>${l.needs}</b> ${esc(f.source.needs)}</span></p>`
      : "") +
    `<details class="viz-table"><summary>${l.table}</summary>${table(f.plot.table)}</details>` +
    `</figure>`
  );
}

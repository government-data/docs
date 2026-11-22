// The charts' drawing primitives, shared by the guide and the
// application: static SVG with no library and nothing loaded from outside.
// Each mark carries its value for the tooltip and every figure has its table,
// so nothing depends on hovering or on telling colors apart.

export type { Figure, Lang, LegendItem, Plot, Table } from "./base";
export { esc, num, pct } from "./base";
export * from "./bars";
export * from "./columns";
export * from "./grids";
export * from "./lines";
export { figure } from "./figure";

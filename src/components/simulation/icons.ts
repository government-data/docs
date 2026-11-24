// The icons of the simulation's nodes, one per kind (scene.ts), drawn on a
// 24 × 24 grid with round caps; `.fill` marks the few solid dots. Each is
// the inside of an SVG <symbol>, written once per figure.
import type { Kind } from "./scene";

export const ICONS: Record<Kind, string> = {
  users: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
  cloud: '<path d="M7 18h10a4 4 0 0 0 .6-8A6 6 0 0 0 6.2 9.5 4.3 4.3 0 0 0 7 18z"/>',
  agent: '<path d="M12 3v11M7.5 9.5 12 14l4.5-4.5"/><path d="M4 16v3h16v-3"/>',
  edge: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3 12h18M12 5v14"/>',
  app: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9h18"/><circle cx="6.5" cy="6.5" r=".9" class="fill"/><circle cx="9.2" cy="6.5" r=".9" class="fill"/>',
  key: '<circle cx="8" cy="12" r="4"/><path d="M12 12h9M18 12v3M21 12v2"/>',
  db: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  branch: '<circle cx="6" cy="5" r="2.2"/><circle cx="6" cy="19" r="2.2"/><circle cx="18" cy="8" r="2.2"/><path d="M6 7.2v9.6M18 10.2c0 4-6 3.5-11 6.8"/>',
  chart: '<path d="M4 20V4M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
  cache: '<path d="M13 3 6 13h5l-1 8 7-10h-5z"/>',
  gauge: '<path d="M4 17a8 8 0 1 1 16 0"/><path d="M12 17l4-5"/><circle cx="12" cy="17" r="1.2" class="fill"/>',
  log: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  probe: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
  server: '<rect x="3" y="3.5" width="18" height="7" rx="1.8"/><rect x="3" y="13.5" width="18" height="7" rx="1.8"/><circle cx="7" cy="7" r="1.1" class="fill"/><circle cx="7" cy="17" r="1.1" class="fill"/><path d="M11 7h6M11 17h6"/>',
  engine: '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
  catalog: '<path d="M5 4h11l3 3v13H5z"/><path d="M8 10h8M8 14h8"/>',
  table: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9.5h18M3 15h18M10 9.5V20"/>',
  bucket: '<ellipse cx="12" cy="6" rx="8" ry="2.5"/><path d="M4 6l2 13c.3 1.5 2.9 2.5 6 2.5s5.7-1 6-2.5l2-13"/>',
  provider: '<path d="M3 21h18M5 21V8l7-4 7 4v13"/><path d="M9 21v-5h6v5"/>',
};

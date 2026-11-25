// The parts of the page under the drawing, each as HTML (page.mjs puts them
// together), and the names they use for places.
import * as M from "./model.mjs";
import { LINKS, CABINETS, SPECS, GROUPS } from "./world.mjs";
import { tr, tf } from "./i18n.mjs";

export const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// The stop the page opens on, before the tour moves.
export const FIRST = 0;

// Readable names of the places, made when first asked for: after the build
// has put the data in the figure's language.
let NAMES = null;
function names() {
  if (NAMES) return NAMES;
  const unit = {};
  for (const c of CABINETS)
    for (const bay of c.bays)
      for (const u of bay) unit[u.id] = `${c.title.replace(/ ·.*/, "")} · ${u.name}`;
  unit.screen = tr("people's browser");
  unit.provider = tr("the provider's desk");
  const cable = Object.fromEntries(
    LINKS.map((l) => [l.id, tf("cable {label}", { label: l.label })]),
  );
  const plate = Object.fromEntries(
    CABINETS.map((c) => [c.id, tf("{title}'s stack", { title: c.title.replace(/ ·.*/, "") })]),
  );
  NAMES = { unit, cable, plate };
  return NAMES;
}
const placeName = (at) => {
  const [kind, id] = at.includes(":") ? at.split(":") : ["unit", at];
  const { unit, cable, plate } = names();
  return kind === "cable" ? cable[id] : kind === "plate" ? plate[id] : unit[id];
};

const SW = {
  on: `<rect x="1.5" y="2" width="19" height="9" rx="1.2" class="on"/>`,
  plan: `<rect x="1.5" y="2" width="19" height="9" rx="1.2" class="plan"/>`,
  dim: `<rect x="1.5" y="2" width="19" height="9" rx="1.2" class="dim"/>`,
  hot: `<rect x="0" y="4.5" width="22" height="4" rx="2" class="hot"/>`,
  limit: `<circle cx="5" cy="6.5" r="2.4" class="limit"/><rect x="10" y="4.5" width="11" height="4" rx="1" class="limit"/>`,
  ring: `<ellipse cx="11" cy="6.5" rx="6" ry="3.4" class="ring"/>`,
};
const swatch = (k) => `<svg class="qd-sw" viewBox="0 0 22 13" aria-hidden="true">${SW[k]}</svg>`;
const KEYS = [
  ["on", "a unit where the technology runs, in every installation"],
  ["plan", "a unit where it runs only if the installation adds it: outlined and marked optional"],
  ["dim", "a unit where it takes no part"],
  [
    "limit",
    "red, bold, with a dot: the resource this machine uses most, the one that limits it first",
  ],
  [
    "dim",
    "on each machine's top: Disk, CPU and RAM, each a proposed starting point, marked *; the table below says what each comes from",
  ],
  [
    "hot",
    "a cable it speaks on, and its plugs, in the strong ink; an optional one outlined in amber. A cable stands for every connection between its two machines",
  ],
  ["ring", "a connection opened, from the side that opens it to the one that listens"],
];

// Connections that are not drawn as cables: both ends on one machine.
const NOT_DRAWN = [
  [
    "Superset → Trino coordinator",
    "both on the main server; the coordinator hands the work to the worker",
  ],
  [
    "orchestrator's job runners → the core, and → the Trino coordinator",
    "all on the main server, through Traefik's internal entry point",
  ],
  [
    "Alloy and the agent on each machine → the main server",
    "over the machine's own cable to it",
  ],
];

// The technologies, one per line.
export function techsHtml() {
  return M.TECHS.map((t, i) => {
    const count = tf("{parts} roles · {places} places", M.countOf(t));
    return `<li data-tech="${i}" tabindex="0"><b><span class="n">${i + 1}</span>${esc(t.short)}</b><span class="c">${esc(count)}</span></li>`;
  }).join("");
}

// Each technology's panel: what it is, why here, what it needs, and its participations.
export function panelsHtml() {
  return M.TECHS.map((t, i) => {
    const rows = t.parts
      .map((p) => {
        const where = p.at.map(placeName).join("; ");
        return `<li class="p" tabindex="-1"><span class="st" data-state="${p.state}">${esc(M.STATES[p.state])}</span><span class="w">${esc(p.what)}</span><span class="wh">${esc(where)}</span></li>`;
      })
      .join("");
    const about = M.ABOUT[t.id]
      .map(
        (a) =>
          `<div class="ab"><b>${esc(a.name)}</b><p>${esc(a.text)}</p><p class="why"><span>${tr("Why here")}</span> ${esc(a.why)}</p></div>`,
      )
      .join("");
    const res = (M.RESOURCES[t.id] ?? [])
      .map(([kk, v]) => `<div><span>${esc(kk)}</span> ${esc(v)}</div>`)
      .join("");
    return `<ol class="qd-parts" data-tech="${i}"${i === FIRST ? "" : " hidden"}><li class="about">${about}<div class="ab res"><b>${tr("To run it")}</b>${res}</div></li><li class="head"><b>${tr("In this platform")}</b> · ${esc(t.note)}</li>${rows}</ol>`;
  }).join("");
}

// What the room shows.
export function keysHtml() {
  return KEYS.map(([kk, text]) => `<li>${swatch(kk)}<span>${esc(tr(text))}</span></li>`).join("");
}

// The groups of lines.
export function groupKeysHtml() {
  const GROUP_TEXT = {
    People: "every line at people's desk or the provider's",
    Updates: "the agent's line to AWS, opened from the installation only",
    Lake: "every other line at a lake machine: Trino's workers and the main server to the lake's gate, the lake to its replica",
    Trino: "the rest: the coordinator on the main server and Trino's workers",
  };
  return GROUPS.map(
    (g) =>
      `<li><svg class="qd-sw g-${g.toLowerCase()}" viewBox="0 0 22 13" aria-hidden="true"><rect x="0" y="4" width="22" height="5" rx="2.5" class="grp"/></svg><span><b>${tr(g)}</b> · ${esc(tr(GROUP_TEXT[g]))}</span></li>`,
  ).join("");
}

// The cables, by group, with the technologies that speak on each.
export function linksHtml() {
  const speaks = (l, state) =>
    M.TECHS.filter((t) =>
      t.parts.some((p) => p.at.includes(`cable:${l.id}`) && p.state === state),
    ).map((t) => t.short);
  const linkRow = (l) => {
    const by = speaks(l, "built");
    const opt = speaks(l, "optional").filter((s) => !by.includes(s));
    const tail = opt.length
      ? `${by.length ? " · " : ""}${tf("optional: {list}", { list: opt.join(", ") })}`
      : "";
    return `<tr><td>${esc(l.label)}</td><td>${esc(by.join(", ") + tail)}</td></tr>`;
  };
  return GROUPS.map(
    (g) =>
      `<tr class="grp-row"><td colspan="2"><svg class="qd-sw g-${g.toLowerCase()}" viewBox="0 0 22 13" aria-hidden="true"><rect x="0" y="4" width="22" height="5" rx="2.5" class="grp"/></svg> ${tr(g)}</td></tr>` +
      LINKS.filter((l) => l.group === g)
        .map(linkRow)
        .join(""),
  ).join("");
}

// The machines' roles and what each needs.
export function rolesHtml() {
  const spec = (r, kk, h) => {
    const x = SPECS[r.id][kk];
    return `<td data-h="${h}"><b class="pv">${esc(x.v)}</b><span class="basis">${esc(x.basis)}</span></td>`;
  };
  const RES = { disk: "Disk", cpu: "CPU", ram: "RAM" };
  return M.ROLES.map((r) => {
    const lim = SPECS[r.id].limits;
    return `<tr><td>${esc(r.role)}</td><td data-h="${tr("machines")}">${esc(r.count)}</td>${spec(r, "disk", tr("disk"))}${spec(r, "cpu", "CPU")}${spec(r, "ram", "RAM")}<td data-h="${tr("limits first")}"><b class="lim">${esc(tr(RES[lim.res]))}</b><span class="basis">${esc(lim.why)}</span></td><td data-h="${tr("size driven by")}">${esc(r.drives)}</td><td data-h="${tr("ports")}">${esc(r.ports)}</td></tr>`;
  }).join("");
}

// What an administrator provides.
export function needsHtml() {
  return M.NEEDS.map(([a, b]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td></tr>`).join("");
}

// The connections not drawn as cables.
export function notDrawnHtml() {
  return NOT_DRAWN.map(
    ([a, b]) =>
      `<tr><td>${esc(tr(a))}</td><td>${esc(tf("{text} · not drawn as a cable", { text: tr(b) }))}</td></tr>`,
  ).join("");
}

// The card around the drawing, its hint corner carrying the tour's button.
export function plateOf(k, stage) {
  const first = M.TECHS[FIRST];
  const c0 = M.countOf(first);
  const hint = tr("Touring · click, → or Space to stop");
  // The hint corner carries the tour's play/pause button, so the corners are
  // no longer hidden as a whole: each text corner is hidden on its own.
  return k
    .plateHtml({
      fig: "Fig 1",
      title: tr("The stack · where each technology takes part"),
      hint,
      readout: `${FIRST + 1}/${M.TECHS.length} · ${first.short} · ${tf("{parts} roles in {places} places · {optional} optional", c0)}`,
      body: stage,
    })
    .replace(
      '<div class="iso-plate-corners" aria-hidden="true">',
      '<div class="iso-plate-corners">',
    )
    .replace(
      /<span class="iso-plate-corner" data-corner="(fig|title|readout)"/g,
      '$& aria-hidden="true"',
    )
    .replace(
      `data-corner="hint">${hint}</span>`,
      `data-corner="hint"><button type="button" class="qd-play" aria-label="${tr("Pause the tour")}">❚❚</button><span data-hint aria-hidden="true">${hint}</span></span>`,
    );
}

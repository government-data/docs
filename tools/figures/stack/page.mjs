// The page around the drawing: the card, the technologies under it (the
// current one lit), its participations in words, the legend, the machines,
// what each cable carries, and the caption.
import { CSS } from "./page-css.mjs";
import { tr } from "./i18n.mjs";
import {
  esc,
  techsHtml,
  panelsHtml,
  keysHtml,
  groupKeysHtml,
  linksHtml,
  rolesHtml,
  needsHtml,
  notDrawnHtml,
  plateOf,
} from "./sections.mjs";

const CAPTION =
  "Three machines run an installation: the main server, with the core, the orchestrator and the Trino coordinator it manages, Superset with Valkey and the operations stack; a Trino worker, which holds the memory; and the lake server, which holds the data. Every machine runs Alloy and the qd agent. For big data, the installation adds Trino workers: the second one is drawn faint and marked optional, and so is the lake replica at another site. Every size on a machine's top is a proposed starting point, marked *, not a measurement: size a real installation from its data. A technology lights every unit where it runs and every cable it speaks on; where it runs only on an optional machine the unit is outlined in amber and marked optional. The room's sizes are not to scale.";

export function pageOf({ k, theme, svg, script }) {
  const stage = `<div class="iso-stage qd-stage" tabindex="0" role="group" aria-roledescription="figure" aria-label="${tr("The stack of Government Data and where each technology takes part. Right arrow or click: next technology. Left arrow: previous. Space: pause or resume the tour.")}"><div class="qd-scroll">${svg}</div><p class="qd-live" aria-live="polite"></p></div>`;
  const under = `<section class="qd-under">
<div><h3>${tr("The stack · the current technology is lit · click one")}</h3><ol class="qd-techs">${techsHtml()}</ol></div>
<div><h3>${tr("What it is, and where it takes part · point at a row to light only its places")}</h3>${panelsHtml()}</div>
<div><h3>${tr("In the room")}</h3><ul class="qd-keys">${keysHtml()}</ul></div>
<div><h3>${tr("Lines by group")}</h3><ul class="qd-keys">${groupKeysHtml()}</ul></div>
<div><h3>${tr("Machines · what each needs to run · * proposed starting points, not measurements")}</h3><div class="qd-wide"><table class="qd-roles"><thead><tr><th>${tr("Role")}</th><th>${tr("Machines")}</th><th>${tr("Disk")}</th><th>CPU</th><th>RAM</th><th>${tr("Limits first")}</th><th>${tr("Size driven by")}</th><th>${tr("Ports")}</th></tr></thead><tbody>${rolesHtml()}</tbody></table></div></div>
<div><h3>${tr("What an administrator provides")}</h3><table class="qd-links"><tbody>${needsHtml()}</tbody></table></div>
<div><h3>${tr("Cables · the technologies that speak on each")}</h3><table class="qd-links"><tbody>${linksHtml()}${notDrawnHtml()}</tbody></table></div>
<p class="qd-caption">${esc(tr(CAPTION))}</p>
</section>`;
  return k.pageHtml({
    title: tr("The stack · Government Data"),
    theme,
    body: `<style>${CSS}</style>${plateOf(k, stage)}${under}`,
    script,
    width: 1360,
  });
}

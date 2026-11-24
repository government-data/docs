// The figure's own styles, inside the page (page.mjs).
export const CSS = `
.iso{--q-on:#26354d;--q-on-s:#1f2b3e;--q-hot:#7aa2ff;--q-hot-e:#4d6fc4;--q-lcd:#0d1410;--q-lcd-ink:#9be7b4;--q-screen:#0e1117;--q-screen-ink:#cfd8e6;--q-led:#6be0a0;--q-plan:#e6b422;--q-mesh:#4fd1c5;--q-mesh-e:#2c9c92;--q-limit:#ff6b6b;--g-updates:#cc79a7;--g-people:#3d8fe0;--g-lake:#56b4e9;--g-trino:#009e73;--q-dim:#7a7a7a}
.iso[data-theme="light"]{--q-on:#dce7fb;--q-on-s:#c9d8f3;--q-hot:#5b83f0;--q-hot-e:#3554b8;--q-lcd:#1d2620;--q-lcd-ink:#a6f0bf;--q-screen:#f4f6fa;--q-screen-ink:#26303f;--q-led:#30a46c;--q-plan:#a86f00;--q-mesh:#1fa597;--q-mesh-e:#11746a;--q-limit:#d42a2a;--g-updates:#b0538a;--g-people:#0b62a8;--g-lake:#3a9fd6;--g-trino:#008a63;--q-dim:#8e8e93}
.qd-stage{touch-action:pan-y;cursor:pointer;outline:none;position:relative}
.qd-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:6px}
.qd-live{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
@media (max-width:760px){.qd-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}.qd-scroll .iso-svg{width:780px;max-width:none}.iso-plate{padding-left:4px;padding-right:4px}}
.qd-min{font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;letter-spacing:0}.qd-min-v{font-weight:650}.iso-face-text.qd-limit{fill:var(--q-limit);font-weight:750}.qd-limit-dot{fill:var(--q-limit)}
.qd-name,.qd-title,.qd-host,.qd-floor,.qd-tag{font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;letter-spacing:0}
.qd-title{font-weight:650}
.qd-host{fill:var(--anatomy-text)}
.qd-floor{letter-spacing:.06em}
.qd-lcd,.qd-screen{stroke:var(--anatomy-lo);stroke-width:.5px;vector-effect:non-scaling-stroke}
.qd-lcd{fill:var(--q-lcd)}.qd-screen{fill:var(--q-screen);transition:fill .3s var(--anatomy-ease)}
.qd-lcd-text{fill:var(--q-lcd-ink);font-family:var(--anatomy-mono);letter-spacing:0}
.qd-screen-text{fill:var(--q-screen-ink);font-family:ui-sans-serif,system-ui,sans-serif}
.qd-screen-text[data-screen="0"]{font-weight:650}
/* Units: dim by default while a technology is shown; lit (built or in part); planned (outlined, marked). */
.qd-name{transition:fill .3s var(--anatomy-ease)}
.qd-unit .qd-name{fill:var(--q-dim)}
.qd-led{fill:var(--anatomy-lo);transition:fill .3s var(--anatomy-ease)}
.qd-unit .qd-tag{display:none;fill:var(--q-plan);font-weight:650;letter-spacing:.04em}
.qd-unit[data-on] .qd-led{fill:var(--q-led)}
.qd-unit[data-on] .iso-shade,.qd-unit[data-on] .iso-top{fill:var(--q-on-s)}
.qd-unit[data-on] .iso-shade[data-shade="3"],.qd-unit[data-on] .iso-shade[data-shade="2"]{fill:var(--q-on)}
.qd-unit[data-on] .iso-edge{stroke:var(--anatomy-lit)}
.qd-unit[data-on] .qd-name{fill:var(--anatomy-lit);font-weight:650}
.qd-unit[data-plan] .iso-edge{stroke:var(--q-plan);stroke-width:1.1px}
.qd-unit[data-plan] .qd-name{fill:var(--anatomy-strong)}
.qd-unit[data-plan] .qd-tag{display:inline}
.qd-unit[data-plan] .qd-led{fill:var(--q-plan)}
.qd-browser[data-on] .qd-screen{fill:var(--q-on)}
.qd-browser[data-plan] .qd-screen{stroke:var(--q-plan);stroke-width:1.2px}
.qd-plate .qd-title{transition:fill .3s var(--anatomy-ease)}
.qd-plate[data-on] .iso-top,.qd-plate[data-on] .iso-shade{fill:var(--q-on)}
.qd-plate[data-on] .iso-edge{stroke:var(--anatomy-lit)}
.qd-plate[data-plan] .iso-edge{stroke:var(--q-plan);stroke-width:1.1px}
.qd-arrow[data-on] .iso-top,.qd-arrow[data-on] .iso-shade{fill:var(--anatomy-strong)}
.qd-arrow[data-plan] .iso-edge{stroke:var(--q-plan);stroke-width:1.1px}
.qd-chunk[data-group="Updates"],.qd-arrow[data-group="Updates"],.qd-sw.g-updates{--g:var(--g-updates)}.qd-chunk[data-group="People"],.qd-arrow[data-group="People"],.qd-sw.g-people{--g:var(--g-people)}.qd-chunk[data-group="Lake"],.qd-arrow[data-group="Lake"],.qd-sw.g-lake{--g:var(--g-lake)}.qd-chunk[data-group="Trino"],.qd-arrow[data-group="Trino"],.qd-sw.g-trino{--g:var(--g-trino)}
.qd-chunk,.qd-arrow,.qd-sw{--gm:50%}.qd-chunk[data-group="People"],.qd-arrow[data-group="People"],.qd-sw.g-people{--gm:100%}
.qd-chunk .tb-body,.qd-chunk .tb-shine,.qd-chunk .tb-shade{fill:color-mix(in srgb,var(--g) var(--gm),var(--anatomy-card))}.qd-chunk .iso-edge{stroke:color-mix(in srgb,var(--g) 80%,var(--anatomy-strong))}
.qd-arrow .iso-top,.qd-arrow .iso-shade{fill:color-mix(in srgb,var(--g) var(--gm),var(--anatomy-card))}.qd-arrow .iso-edge{stroke:color-mix(in srgb,var(--g) 80%,var(--anatomy-strong))}
.qd-chunk[data-planned] .tb-body,.qd-chunk[data-planned] .tb-shine,.qd-chunk[data-planned] .tb-shade,.qd-chunk[data-plan] .tb-body,.qd-chunk[data-plan] .tb-shine,.qd-chunk[data-plan] .tb-shade,[data-faint] .qd-chunk .tb-body,[data-faint] .qd-chunk .tb-shine,[data-faint] .qd-chunk .tb-shade{fill:color-mix(in srgb,var(--g) 22%,var(--anatomy-card))}
.qd-chunk[data-hot] .tb-body,.qd-chunk[data-hot] .tb-shine,.qd-chunk[data-hot] .tb-shade{fill:var(--anatomy-strong)}
.qd-chunk[data-hot] .iso-edge{stroke:var(--anatomy-strong)}
.qd-plug[data-on] .iso-top,.qd-plug[data-on] .iso-shade{fill:var(--anatomy-strong)}
.qd-plug[data-plan] .iso-edge{stroke:var(--q-plan);stroke-width:1.1px}
[data-faint] .iso-edge,[data-faint] .iso-crease,[data-faint] .iso-bevel{stroke:var(--q-plan)}
[data-faint] .iso-shade,[data-faint] .iso-top,[data-faint] .iso-fill{fill:var(--anatomy-card)}
[data-faint] .qd-unit[data-on] .iso-shade,[data-faint] .qd-unit[data-on] .iso-top{fill:var(--anatomy-card)}
.qd-chunk[data-planned] .iso-edge{stroke:color-mix(in srgb,var(--g) 60%,var(--anatomy-card))}
.qd-chunk[data-plan] .iso-edge{stroke:var(--q-plan);stroke-width:1.1px}
.qd-tok .iso-line[data-tone="lit"]{stroke-width:1.2px}
.qd-under{display:grid;gap:22px;margin-top:22px;color:var(--anatomy-text);font-size:13px;line-height:1.5}
.qd-under>*{min-width:0}
.qd-under h3{margin:0 0 8px;font:600 10.5px/1 var(--anatomy-mono);letter-spacing:.1em;text-transform:uppercase;color:var(--anatomy-muted)}
.qd-techs{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:6px}
.qd-techs li{padding:6px 10px 7px;border-left:2px solid var(--anatomy-lo);background:var(--anatomy-card);cursor:pointer;transition:border-color .3s var(--anatomy-ease),background .3s var(--anatomy-ease)}
.qd-techs li:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:2px}
.qd-techs li[data-on]{border-left-color:var(--anatomy-strong);background:color-mix(in srgb,var(--anatomy-card) 70%,var(--q-on))}
.qd-techs b{display:block;color:var(--anatomy-strong);font-weight:600}
.qd-techs .n{font:600 10.5px var(--anatomy-mono);color:var(--anatomy-muted);margin-right:6px}
.qd-techs .c{display:block;font:11px var(--anatomy-mono);color:var(--anatomy-muted)}
.qd-parts{list-style:none;margin:0;padding:0}
.qd-parts .about{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px 22px;padding:0 0 14px}
.qd-parts .ab b{display:block;color:var(--anatomy-strong);font-weight:650;margin-bottom:2px}
.qd-parts .ab p{margin:0 0 4px;color:var(--anatomy-text);max-width:72ch}
.qd-parts .ab .why span{font:600 10.5px var(--anatomy-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--anatomy-muted);margin-right:4px}
.qd-parts .res div{margin:0 0 3px}.qd-parts .res div>span:first-child{font:600 10.5px var(--anatomy-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--anatomy-muted);margin-right:4px}
.qd-roles{width:100%;border-collapse:collapse;font-size:12.5px}
.qd-roles th{text-align:left;font:600 10.5px var(--anatomy-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--anatomy-muted);padding:4px 8px 4px 0}
.qd-roles td{padding:4px 10px 4px 0;border-top:1px solid color-mix(in srgb,var(--anatomy-muted) 30%,transparent);vertical-align:top}
.qd-roles td:first-child{color:var(--anatomy-strong);font-weight:600;white-space:nowrap}
.qd-roles .ns,.qd-parts .ns{color:var(--q-plan);font-weight:600}
.qd-roles .basis{display:block;font-size:11.5px;line-height:1.4;color:var(--anatomy-muted);margin-top:2px}.qd-roles .pv{color:var(--anatomy-strong);font-weight:600}
.qd-roles .lim{color:var(--q-limit)}
.qd-wide{overflow-x:auto}
@media (max-width:760px){.qd-roles,.qd-roles tbody,.qd-roles tr,.qd-roles td{display:block}.qd-roles thead{display:none}.qd-roles tr{padding:6px 0;border-top:1px solid color-mix(in srgb,var(--anatomy-muted) 30%,transparent)}.qd-roles td{border:0;padding:1px 0}.qd-roles td[data-h]::before{content:attr(data-h) " · ";font:600 10px var(--anatomy-mono);text-transform:uppercase;color:var(--anatomy-muted)}}
.qd-parts .head{padding:0 0 8px;color:var(--anatomy-strong)}
.qd-parts .head b{font-weight:650}
.qd-parts li.p{display:grid;grid-template-columns:118px 1fr;gap:2px 12px;padding:5px 8px;border-top:1px solid color-mix(in srgb,var(--anatomy-muted) 30%,transparent);outline:none}
.qd-parts li.p[data-focus]{background:color-mix(in srgb,var(--anatomy-card) 70%,var(--q-on))}
.qd-parts .st{font:600 10.5px/1.9 var(--anatomy-mono);letter-spacing:.04em;text-transform:uppercase}
.qd-parts .st[data-state="built"]{color:var(--q-hot)}
.qd-parts .st[data-state="optional"]{color:var(--q-plan)}
.qd-parts .w{color:var(--anatomy-strong)}
.qd-parts .wh{grid-column:2;font:11px/1.45 var(--anatomy-mono);color:var(--anatomy-text)}
.qd-parts .rf{color:var(--anatomy-muted)}
.qd-keys{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:5px 18px}
.qd-keys li{display:flex;gap:8px;align-items:center}
.qd-sw{width:22px;height:13px;flex:none}
.qd-sw .on{fill:var(--q-on);stroke:var(--anatomy-lit)}.qd-sw .plan{fill:var(--anatomy-card);stroke:var(--q-plan);stroke-width:1.4}.qd-sw .dim{fill:var(--anatomy-card);stroke:var(--anatomy-lo)}
.qd-sw .hot{fill:var(--anatomy-strong)}.qd-sw .limit{fill:var(--q-limit)}.qd-sw .grp{fill:color-mix(in srgb,var(--g) var(--gm),var(--anatomy-card));stroke:color-mix(in srgb,var(--g) 80%,var(--anatomy-strong))}.qd-sw .ring{fill:none;stroke:var(--anatomy-strong);stroke-width:1.3}
.qd-links{width:100%;border-collapse:collapse;font-size:12.5px}
.qd-links td{padding:4px 8px 4px 0;border-top:1px solid color-mix(in srgb,var(--anatomy-muted) 30%,transparent);vertical-align:top}
.qd-links td:first-child{font-family:var(--anatomy-mono);font-size:11.5px;color:var(--anatomy-strong);white-space:nowrap}
.qd-links .grp-row td{font:600 10.5px var(--anatomy-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--anatomy-muted);padding-top:12px}
.qd-caption{margin:0;color:var(--anatomy-muted)}
@media (max-width:560px){.iso-plate-corner[data-corner="title"]{top:16px;white-space:normal;max-width:calc(100% - 64px);text-align:right;line-height:1.35}}
@media (max-width:760px){.qd-parts li.p{grid-template-columns:1fr}.qd-parts .wh{grid-column:1}.qd-links td:first-child{white-space:normal}}
.qd-play{pointer-events:auto;font:10px/1 var(--anatomy-mono);color:var(--anatomy-strong);background:var(--anatomy-card);border:1px solid var(--anatomy-lo);border-radius:3px;padding:3px 6px;margin:-4px 8px 0 0;cursor:pointer;vertical-align:middle}
.qd-play:hover{border-color:var(--anatomy-muted)}.qd-play:focus-visible{outline:1px solid var(--anatomy-strong);outline-offset:2px}.qd-play[hidden]{display:none}
@media (prefers-reduced-motion:reduce){.qd-led,.qd-name,.qd-screen,.qd-techs li,.qd-plate .qd-title{transition:none}}
`;

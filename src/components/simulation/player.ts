// The simulation's player, in the browser: it plays a scenario (story.ts)
// on the drawing of PlatformSimulation.astro, moving packets along the
// scene's links, changing the machines' states and writing the log. Every
// wait goes through one clock, so pause, speed, step by step and being out
// of view apply to all of it. Under reduced motion packets jump and waits
// are short; nothing loops by itself.
import { linkOf, routeOf, type Lang, type State } from "./scene";
import type { PacketOptions, Scenario, Sim, Stage, Tone } from "./story";

const SVG = "http://www.w3.org/2000/svg";
const BADGE: Partial<Record<State, string>> = { busy: "⟳", down: "✕", maint: "⚙", added: "+", fail: "!" };
const STAGE_MARK: Record<Stage, string> = { active: "", ok: "✓", warn: "!", fail: "✕" };

class Cancelled extends Error {}

type Point = [number, number];

/** The point at a fraction of a polyline's length, and the points before it. */
function along(points: Point[], f: number): { at: Point; done: Point[] } {
  const lengths = points.slice(1).map((p, k) => Math.hypot(p[0] - points[k][0], p[1] - points[k][1]));
  let left = f * lengths.reduce((a, b) => a + b, 0);
  for (let k = 0; k < lengths.length; k++) {
    if (left <= lengths[k] || k === lengths.length - 1) {
      const u = lengths[k] ? Math.min(1, left / lengths[k]) : 1;
      const [a, b] = [points[k], points[k + 1]];
      const at: Point = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
      return { at, done: [...points.slice(0, k + 1), at] };
    }
    left -= lengths[k];
  }
  return { at: points[points.length - 1], done: points };
}

const ease = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);
const dOf = (points: Point[]) => points.map(([x, y], k) => `${k ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");

export function mount(root: HTMLElement, scenarios: Scenario[]) {
  const lang = (root.dataset.lang === "es" ? "es" : "en") as Lang;
  const T = (en: string, es: string) => (lang === "es" ? es : en);
  const $ = <E extends Element>(sel: string) => root.querySelector<E>(sel)!;
  const packets = $<SVGGElement>("[data-packets]");
  const trails = $<SVGGElement>("[data-trails]");
  const logList = $<HTMLOListElement>("[data-log]");
  const readout = $<HTMLElement>("[data-readout]");
  const hint = $<HTMLElement>("[data-hint]");
  const pauseBtn = $<HTMLButtonElement>('[data-action="pause"]');
  const resetBtn = $<HTMLButtonElement>('[data-action="reset"]');
  const speedSel = $<HTMLSelectElement>('[data-action="speed"]');
  const stepBox = $<HTMLInputElement>('[data-action="step"]');
  const nextBtn = $<HTMLButtonElement>('[data-action="next"]');
  const trackBox = $<HTMLElement>("[data-track-box]");
  const trackTitle = $<HTMLElement>("[data-track-title]");
  const trackList = $<HTMLOListElement>("[data-track]");
  const buttons = root.querySelectorAll<HTMLButtonElement>("[data-scenario]");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const words = { hint: hint.textContent ?? "", ready: readout.textContent ?? "" };

  // The machines as drawn, to put them back when a scenario starts again.
  const node = (id: string) => {
    const g = root.querySelector<SVGGElement>(`[data-node="${id}"]`);
    if (!g) throw new Error(`no node ${id}`);
    return g;
  };
  const initial = new Map<string, { state: string; lines: Map<string, string> }>();
  root.querySelectorAll<SVGGElement>("[data-node]").forEach((g) => {
    const lines = new Map<string, string>();
    g.querySelectorAll<SVGTextElement>("[data-line]").forEach((t) => lines.set(t.dataset.line!, t.textContent ?? ""));
    initial.set(g.dataset.node!, { state: g.dataset.state!, lines });
  });

  // The clock. `paused` is the reader's; `hidden` is the figure's being out
  // of view. A frame's step is capped, so a background tab does not jump.
  let paused = false;
  let hidden = false;
  let speed = 1;
  let run = 0;
  let current: Scenario | undefined;
  let clock = "";

  function animate(ms: number, frame: (p: number) => void): Promise<void> {
    const mine = run;
    return new Promise((resolve, reject) => {
      let done = 0;
      let last = performance.now();
      const step = (now: number) => {
        if (mine !== run) return reject(new Cancelled());
        const dt = Math.min(now - last, 1000 / 30);
        last = now;
        if (!paused && !hidden) done += dt * speed;
        const p = ms <= 0 ? 1 : Math.min(1, done / ms);
        frame(p);
        if (p >= 1) resolve();
        else requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  const el = <K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>) => {
    const e = document.createElementNS(SVG, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
    return e;
  };

  async function packet(from: string, to: string, label: string, opts: PacketOptions = {}) {
    const route = routeOf(from, to) as Point[];
    const kind = opts.health ? "health" : linkOf(from, to)!.kind;
    const trail = el("path", { class: `sim__trail sim__trail--${kind}`, d: dOf([route[0], route[0]]) });
    const g = el("g", { class: `sim__packet sim__packet--${kind}` });
    const width = label.length * 6 + 16;
    const pill = el("rect", { class: "sim__pill", x: -width / 2, y: -28, width, height: 17, rx: 8.5 });
    const text = el("text", { y: -16, "text-anchor": "middle" });
    text.textContent = label;
    g.append(el("circle", { class: "sim__glow", r: 11 }), el("circle", { class: "sim__dot", r: 5 }), pill, text);
    trails.append(trail);
    packets.append(g);
    const end = opts.fail ? 0.55 : 1;
    const move = (p: number) => {
      const { at, done } = along(route, ease(p) * end);
      g.setAttribute("transform", `translate(${at[0].toFixed(1)} ${at[1].toFixed(1)})`);
      trail.setAttribute("d", dOf(done));
    };
    move(0);
    try {
      await animate(reduced ? 1 : (opts.ms ?? 1300), move);
      if (opts.fail) {
        g.classList.add("sim__packet--failed");
        text.textContent = `✕ ${label}`;
        pill.setAttribute("width", String(width + 12));
        pill.setAttribute("x", String(-(width + 12) / 2));
        await animate(reduced ? 150 : 600, () => {});
      }
    } finally {
      g.remove();
      trail.remove();
    }
  }

  function state(id: string, s: State, sub?: string) {
    const g = node(id);
    g.dataset.state = s;
    g.querySelector("[data-badge]")!.textContent = BADGE[s] ?? "";
    if (sub !== undefined) line(id, "sub", sub);
    show();
  }

  function line(id: string, key: string, text: string) {
    const e = node(id).querySelector(`[data-line="${key}"]`);
    if (e) e.textContent = text;
  }

  // The readout says where the story is, from the same state the drawing
  // shows: the scenario, its clock, and how many machines work or are down.
  function show() {
    if (!current) return;
    const count = (s: string) => root.querySelectorAll(`[data-node][data-state="${s}"]`).length;
    const [busy, down] = [count("busy"), count("down")];
    const parts = [current.label[lang], clock, T(`${busy} working`, `${busy} trabajando`)];
    if (down) parts.push(T(`${down} down`, `${down} caído${down > 1 ? "s" : ""}`));
    readout.textContent = parts.filter(Boolean).join(" · ");
  }

  function log(time: string, text: string, tone: Tone = "") {
    const li = document.createElement("li");
    if (tone) li.dataset.tone = tone;
    const t = document.createElement("time");
    t.textContent = time;
    const span = document.createElement("span");
    span.textContent = text;
    li.append(t, span);
    logList.append(li);
    logList.scrollTop = logList.scrollHeight;
    clock = time;
    show();
    // Step by step: every event waits for "Next" before the story goes on.
    if (stepBox.checked) setPaused(true);
  }

  function track(title: string, steps: string[]) {
    trackTitle.textContent = title;
    trackList.replaceChildren(
      ...steps.map((name, k) => {
        const li = document.createElement("li");
        li.dataset.state = "pending";
        li.innerHTML = '<span class="sim__track-n"></span><span class="sim__track-name"></span><span class="sim__track-note"></span>';
        li.children[0].textContent = String(k + 1);
        li.children[1].textContent = name;
        return li;
      }),
    );
    trackBox.hidden = false;
  }

  function stage(k: number, s: Stage, note = "") {
    const li = trackList.children[k] as HTMLElement | undefined;
    if (!li) return;
    li.dataset.state = s;
    li.children[0].textContent = STAGE_MARK[s] || String(k + 1);
    li.children[2].textContent = note;
  }

  const sim: Sim = {
    lang,
    T,
    log,
    state,
    line,
    packet,
    wait: (ms) => animate(reduced ? ms / 4 : ms, () => {}),
    track,
    stage,
  };

  function setPaused(value: boolean) {
    paused = value;
    pauseBtn.textContent = paused ? T("Play", "Reproducir") : T("Pause", "Pausa");
    nextBtn.disabled = !(paused && stepBox.checked && !pauseBtn.disabled);
  }

  function reset() {
    run++;
    current = undefined;
    clock = "";
    packets.replaceChildren();
    trails.replaceChildren();
    trackBox.hidden = true;
    trackList.replaceChildren();
    initial.forEach((v, id) => {
      state(id, v.state as State);
      v.lines.forEach((text, key) => line(id, key, text));
    });
    logList.replaceChildren();
    setPaused(false);
  }

  function idle() {
    buttons.forEach((x) => x.classList.remove("is-on"));
    for (const b of [pauseBtn, resetBtn, nextBtn]) b.disabled = true;
    hint.textContent = words.hint;
    readout.textContent = words.ready;
    const li = document.createElement("li");
    li.className = "sim__hint";
    li.textContent = T("Pick a scenario to start.", "Elige un escenario para empezar.");
    logList.append(li);
  }

  async function play(scenario: Scenario, button: HTMLButtonElement) {
    reset();
    current = scenario;
    buttons.forEach((x) => x.classList.toggle("is-on", x === button));
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
    hint.textContent = T("Space pauses · → next step", "Espacio pausa · → siguiente paso");
    show();
    try {
      await scenario.play(sim);
      pauseBtn.disabled = true;
      nextBtn.disabled = true;
      readout.textContent = `${scenario.label[lang]} · ${T("done", "terminado")}`;
      hint.textContent = words.hint;
    } catch (e) {
      if (!(e instanceof Cancelled)) throw e;
    }
  }

  const byId = new Map(scenarios.map((s) => [s.id, s]));
  buttons.forEach((b) => b.addEventListener("click", () => play(byId.get(b.dataset.scenario!)!, b)));
  pauseBtn.addEventListener("click", () => setPaused(!paused));
  nextBtn.addEventListener("click", () => setPaused(false));
  stepBox.addEventListener("change", () => setPaused(stepBox.checked ? paused : false));
  resetBtn.addEventListener("click", () => {
    reset();
    idle();
  });
  speedSel.addEventListener("change", () => (speed = Number(speedSel.value)));
  root.addEventListener("keydown", (e) => {
    if (e.target instanceof HTMLElement && e.target.closest("button, select, input")) return;
    if (e.key === " " && !pauseBtn.disabled) {
      e.preventDefault();
      setPaused(!paused);
    } else if (e.key === "ArrowRight" && !nextBtn.disabled) {
      e.preventDefault();
      setPaused(false);
    }
  });
  // Out of view, the story waits where it is.
  new IntersectionObserver(
    (entries) => {
      hidden = !entries[entries.length - 1].isIntersecting;
    },
    { rootMargin: "120px 0px" },
  ).observe(root);
}

// What happens, step by step, when a part fails: a worker of the
// orchestrator, a source, a worker of Trino, a server of the lake. In each
// one nothing half-done is ever read, and the work resumes by itself.
import { along, together, type Scenario, type Sim } from "../story";

const idle = (sim: Sim) => sim.T("idle", "libre");

/** A worker takes a cut of «customers» and starts its job on Trino. */
async function start(sim: Sim, worker: string, readers: string[]) {
  const { T, state, packet } = sim;
  await packet(worker, "operator", T("lease", "préstamo"));
  state(worker, "busy", T("«customers»", "«clientes»"));
  await along(sim, ["core", "traefik", worker], T("bundle + token", "paquete + token"));
  await packet(worker, "coordinator", T("SQL · token", "SQL · token"));
  state("coordinator", "busy", T("planning", "planeando"));
  await together(...readers.map((t) => packet("coordinator", t, T("task", "tarea"))));
  readers.forEach((t) => state(t, "busy", T("reading", "leyendo")));
}

/** Trino and the worker finish the job and report. */
async function finish(sim: Sim, worker: string, readers: string[]) {
  const { T, state, packet } = sim;
  await together(...readers.map((t) => packet(t, "bronze", T("write", "escribe"))));
  await packet(readers[0], "catalog", "commit");
  await packet("coordinator", worker, T("done", "terminado"));
  readers.forEach((t) => state(t, "up", idle(sim)));
  state("coordinator", "up", T("plans, splits", "planea, reparte"));
  await along(sim, [worker, "traefik", "core"], T("counts", "conteos"));
  state(worker, "up", idle(sim));
}

export const workerDies: Scenario = {
  id: "worker",
  section: "failure",
  label: { en: "A worker dies", es: "Cae un worker" },
  async play(sim) {
    const { T, log, state, packet, wait } = sim;
    log(
      "10:00:00",
      T(
        "Worker 1 takes a cut and sends its first statement to Trino.",
        "El worker 1 toma un corte y envía su primera sentencia a Trino.",
      ),
    );
    await start(sim, "w1", ["t1", "t2"]);
    await together(packet("t1", "customers", "SELECT"), packet("t2", "customers", "SELECT"));
    log(
      "10:00:20",
      T(
        "Worker 1 dies in the middle of the job.",
        "El worker 1 se cae a mitad del trabajo.",
      ),
      "bad",
    );
    state("w1", "down", T("down", "caído"));
    await wait(700);
    log(
      "10:00:20",
      T(
        "It no longer renews its lease. Nobody has to notice: the lease runs out by itself.",
        "Ya no renueva su préstamo. Nadie tiene que darse cuenta: el préstamo vence solo.",
      ),
    );
    await wait(1400);
    log(
      "10:01:20",
      T(
        "The lease ran out. Before anyone retries, the old attempt's query is cancelled, so two attempts never write the same cut.",
        "El préstamo venció. Antes de reintentar, se cancela la consulta del intento anterior, así dos intentos nunca escriben el mismo corte.",
      ),
      "warn",
    );
    await packet("w2", "operator", T("lease · attempt 2", "préstamo · intento 2"));
    state("w2", "busy", T("attempt 2", "intento 2"));
    await packet("w2", "coordinator", T("cancel attempt 1", "cancelar intento 1"));
    ["t1", "t2"].forEach((t) => state(t, "up", idle(sim)));
    log(
      "10:01:22",
      T(
        "Worker 2 fetches the same signed bundle and resumes where the job's progress was recorded.",
        "El worker 2 trae el mismo paquete firmado y sigue desde donde quedó registrado el avance del trabajo.",
      ),
    );
    await along(sim, ["core", "traefik", "w2"], T("bundle + token", "paquete + token"));
    await packet("w2", "coordinator", T("SQL · token", "SQL · token"));
    await together(
      packet("coordinator", "t1", T("task", "tarea")),
      packet("coordinator", "t2", T("task", "tarea")),
    );
    ["t1", "t2"].forEach((t) => state(t, "busy", T("reading", "leyendo")));
    await together(packet("t1", "customers", "SELECT"), packet("t2", "customers", "SELECT"));
    await together(
      packet("customers", "t1", T("rows", "filas")),
      packet("customers", "t2", T("rows", "filas")),
    );
    await finish(sim, "w2", ["t1", "t2"]);
    log(
      "10:03:00",
      T(
        "The load is accepted once, complete. What attempt 1 left behind was never accepted, and maintenance removes it.",
        "La carga se acepta una vez, completa. Lo que dejó el intento 1 nunca se aceptó, y el mantenimiento lo quita.",
      ),
      "good",
    );
    await wait(900);
    state("w1", "up", idle(sim));
    log(
      "10:05:00",
      T(
        "Worker 1 comes back and waits for work. It kept nothing, so there is nothing to repair.",
        "El worker 1 vuelve y espera trabajo. No guardaba nada, así que no hay nada que reparar.",
      ),
      "good",
    );
  },
};

export const sourceDown: Scenario = {
  id: "source",
  section: "failure",
  label: { en: "A source is down", es: "Fuente caída" },
  async play(sim) {
    const { T, log, state, packet, wait } = sim;
    log(
      "10:00:00",
      T(
        "Trino reads «customers» in five key ranges; three are done.",
        "Trino lee «clientes» en cinco rangos de llaves; van tres.",
      ),
    );
    await start(sim, "w1", ["t1"]);
    await packet("t1", "customers", T("range 3", "rango 3"));
    await packet("customers", "t1", T("rows", "filas"));
    log(
      "10:00:10",
      T(
        "The customers database stops answering: maintenance at the organisation.",
        "La base de clientes deja de responder: mantenimiento en la organización.",
      ),
      "bad",
    );
    state("customers", "down", T("not answering", "no responde"));
    await packet("t1", "customers", T("range 4", "rango 4"), { fail: true });
    await packet("coordinator", "w1", T("failed", "falló"));
    state("t1", "up", idle(sim));
    log(
      "10:00:12",
      T(
        "The statement fails. The operator retries the job with backoff, waiting longer each time.",
        "La sentencia falla. El operador reintenta el trabajo con espera creciente.",
      ),
      "warn",
    );
    for (const [time, after] of [["10:01:12", "1"], ["10:03:12", "2"], ["10:07:12", "4"]]) {
      log(time, T(`Retry after ${after} min…`, `Reintento tras ${after} min…`), "warn");
      await packet("w1", "coordinator", "SQL");
      await packet("coordinator", "t1", T("task", "tarea"));
      await packet("t1", "customers", T("range 4", "rango 4"), { fail: true });
    }
    log(
      "10:07:15",
      T(
        "Nobody sees half a cut: the half load is never accepted, and the previous cut stays the current one.",
        "Nadie ve medio corte: la carga a medias nunca se acepta, y el corte anterior sigue siendo el vigente.",
      ),
      "good",
    );
    log(
      "10:07:16",
      T(
        "The core tells the dataset's people; in Grafana the errors of every server show in one search.",
        "El núcleo avisa a las personas del dataset; en Grafana los errores de todos los servidores salen en una búsqueda.",
      ),
    );
    await along(
      sim,
      ["core", "traefik", "people"],
      T("notice · source down", "aviso · fuente caída"),
    );
    await packet("alloy", "lokimimir", T("error logs", "logs de error"));
    await wait(1200);
    log(
      "10:30:00",
      T(
        "The database is back. The retry resumes where it stopped: only ranges 4 and 5 are read.",
        "La base vuelve. El reintento sigue donde paró: solo se leen los rangos 4 y 5.",
      ),
      "good",
    );
    state("customers", "up", T("read only", "solo lectura"));
    await packet("w1", "coordinator", "SQL");
    await packet("coordinator", "t1", T("task", "tarea"));
    state("t1", "busy", T("reading", "leyendo"));
    for (const r of [4, 5]) {
      await packet("t1", "customers", T(`range ${r}`, `rango ${r}`), { ms: 700 });
      await packet("customers", "t1", T("rows", "filas"), { ms: 700 });
    }
    await finish(sim, "w1", ["t1"]);
    log(
      "10:31:00",
      T(
        "The cut is complete and accepted.",
        "El corte está completo y aceptado.",
      ),
      "good",
    );
  },
};

export const trinoWorkerLost: Scenario = {
  id: "trino-worker",
  section: "failure",
  label: { en: "A Trino worker is lost", es: "Se pierde un worker de Trino" },
  async play(sim) {
    const { T, log, state, packet, wait } = sim;
    const readers = ["t1", "t2", "t3"];
    log(
      "02:00:00",
      T(
        "A large job runs on three of Trino's workers.",
        "Un trabajo grande corre en tres workers de Trino.",
      ),
    );
    await start(sim, "w2", readers);
    await together(...readers.map((t) => packet(t, "transactions", "SELECT")));
    log("02:05:00", T("Trino's worker 2 is lost.", "Se pierde el worker 2 de Trino."), "bad");
    state("t2", "down", T("down", "caído"));
    await packet("coordinator", "t2", T("alive?", "¿vivo?"), { health: true, fail: true });
    log(
      "02:05:01",
      T(
        "Its tasks are lost with it, so the query fails. Nothing was half-written: the lake's commit is all or nothing.",
        "Sus tareas se pierden con él, así que la consulta falla. Nada quedó escrito a medias: el commit del lago es todo o nada.",
      ),
      "warn",
    );
    await packet("coordinator", "w2", T("failed", "falló"));
    ["t1", "t3"].forEach((t) => state(t, "up", idle(sim)));
    log(
      "02:05:30",
      T(
        "The job retries the same statement; the coordinator plans it on the workers that remain.",
        "El trabajo reintenta la misma sentencia; el coordinador la planea en los workers que quedan.",
      ),
    );
    await packet("w2", "coordinator", T("SQL · attempt 2", "SQL · intento 2"));
    const left = ["t1", "t3"];
    await together(...left.map((t) => packet("coordinator", t, T("more ranges", "más rangos"))));
    left.forEach((t) => state(t, "busy", T("reading", "leyendo")));
    for (let k = 0; k < 2; k++) {
      await together(...left.map((t) => packet(t, "transactions", "SELECT", { ms: 800 })));
      await together(
        ...left.map((t) => packet("transactions", t, T("rows", "filas"), { ms: 800 })),
      );
    }
    await finish(sim, "w2", left);
    log(
      "02:40:00",
      T(
        "It finished slower, but complete. Nothing half-done in the lake.",
        "Terminó más lento, pero completo. Nada a medias en el lago.",
      ),
      "good",
    );
    await wait(900);
    state("t2", "up", idle(sim));
    log(
      "02:50:00",
      T(
        "Trino's worker 2 rejoins the cluster and takes tasks again.",
        "El worker 2 de Trino vuelve al clúster y toma tareas de nuevo.",
      ),
    );
  },
};

export const lakeServer: Scenario = {
  id: "lake",
  section: "failure",
  label: { en: "A lake server dies", es: "Cae un servidor del lago" },
  async play(sim) {
    const { T, log, state, packet, wait } = sim;
    const pool = (up: number) => T(
      `S3 · pool of 4 servers · ${up} of 4 up`,
      `S3 · pool de 4 servidores · ${up} de 4 activos`,
    );
    log("10:00:00", T("Trino writes a cut to the lake.", "Trino escribe un corte en el lago."));
    await start(sim, "w2", ["t2"]);
    await packet("t2", "bronze", T("write", "escribe"));
    log(
      "10:00:05",
      T(
        "One of RustFS's four servers dies.",
        "Se cae uno de los cuatro servidores de RustFS.",
      ),
      "bad",
    );
    state("rustfs", "fail", pool(3));
    await packet("bronze", "rustfs", T("files", "archivos"));
    log(
      "10:00:06",
      T(
        "The pool keeps working: its drives share the data, so it survives a drive or a whole server down.",
        "El pool sigue funcionando: sus discos comparten los datos, así resiste un disco o un servidor entero caído.",
      ),
      "good",
    );
    await packet("t2", "bronze", T("write", "escribe"));
    await packet("bronze", "rustfs", T("files", "archivos"));
    await packet("rustfs", "replica", T("copy", "copia"));
    await finish(sim, "w2", ["t2"]);
    log(
      "10:00:30",
      T(
        "Alloy reports the server's absence; Grafana raises an alert for the administrator.",
        "Alloy reporta la ausencia del servidor; Grafana levanta una alerta para el administrador.",
      ),
      "warn",
    );
    await packet("alloy", "lokimimir", T("metrics", "métricas"));
    await packet("grafana", "lokimimir", T("alert rule", "regla de alerta"));
    await wait(1200);
    log(
      "10:45:00",
      T(
        "The server is back, and RustFS rebuilds its share of the data from the others.",
        "El servidor vuelve, y RustFS reconstruye su parte de los datos desde los demás.",
      ),
      "good",
    );
    state("rustfs", "busy", T("rebuilding · 4 of 4 up", "reconstruyendo · 4 de 4 activos"));
    await wait(900);
    state("rustfs", "up", pool(4));
    await packet("rustfs", "replica", T("in sync", "al día"));
    log(
      "10:46:00",
      T(
        "The replica on its own server is in sync. An update of the lake waits for exactly this: every server healthy and the replica in sync.",
        "La réplica en su propio servidor está al día. Una actualización del lago espera justo esto: todos los servidores sanos y la réplica al día.",
      ),
      "good",
    );
  },
};

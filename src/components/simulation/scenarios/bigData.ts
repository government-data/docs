// A big-data job: a very large dataset read in key ranges by Trino's
// workers in parallel, a worker added to take part of the load, the results
// in gold, and the dashboards answering meanwhile from their own share.
import { along, together, type Scenario } from "../story";

export const bigData: Scenario = {
  id: "big-data",
  section: "operation",
  label: { en: "Big-data job", es: "Trabajo de big data" },
  async play(sim) {
    const { T, log, state, packet, wait } = sim;
    const readers = ["t1", "t2", "t3"];

    log(
      "01:00:00",
      T(
        "The cut of «transactions» is due: years of movements, far more than one machine holds in memory.",
        "Toca el corte de «transacciones»: años de movimientos, mucho más de lo que una máquina tiene en memoria.",
      ),
    );
    state("operator", "busy", T("fires a cut", "dispara un corte"));
    await along(sim, ["operator", "traefik", "core"], T("cut due", "corte pendiente"));
    state("operator", "up", T("waiting", "en espera"));
    await packet("w2", "operator", T("lease", "préstamo"));
    state("w2", "busy", T("«transactions»", "«transacciones»"));
    await along(sim, ["core", "traefik", "w2"], T("bundle + token", "paquete + token"));

    log(
      "01:00:02",
      T(
        "Trino is a distributed SQL engine: the coordinator plans the query and splits it into tasks, and its workers run them in parallel, each on its own part of the data.",
        "Trino es un motor SQL distribuido: el coordinador planea la consulta y la parte en tareas, y sus workers las corren en paralelo, cada uno sobre su parte de los datos.",
      ),
    );
    await packet("w2", "coordinator", T("SQL · token", "SQL · token"));
    state("coordinator", "busy", T("splits by key", "parte por llave"));
    await together(
      ...readers.map((t, k) => packet("coordinator", t, T(`ranges ${k * 4 + 1}–${k * 4 + 4}`, `rangos ${k * 4 + 1}–${k * 4 + 4}`))),
    );
    readers.forEach((t) => state(t, "busy", T("reading", "leyendo")));
    log(
      "01:00:03",
      T(
        "The source is read in key ranges, in parallel and read only; each worker streams its ranges to bronze, so no machine ever holds the whole table.",
        "La fuente se lee por rangos de llaves, en paralelo y solo lectura; cada worker pasa sus rangos a bronze, así ninguna máquina tiene nunca la tabla entera.",
      ),
    );
    for (let k = 0; k < 2; k++) {
      await together(...readers.map((t) => packet(t, "transactions", "SELECT", { ms: 800 })));
      await together(
        ...readers.map((t) => packet("transactions", t, T("rows", "filas"), { ms: 800 })),
      );
      await together(
        ...readers.map((t) => packet(t, "bronze", T("files", "archivos"), { ms: 800 })),
      );
    }

    log(
      "01:40:00",
      T(
        "Tasks are waiting for a free worker and the cut would run past its window. The administrator adds a fourth worker on a new server.",
        "Hay tareas esperando un worker libre y el corte pasaría de su ventana. El administrador añade un cuarto worker en un servidor nuevo.",
      ),
      "warn",
    );
    await wait(700);
    state("t4", "added", T("joined", "se unió"));
    log(
      "01:42:00",
      T(
        "It joins the cluster, and the coordinator gives it the ranges still waiting. Trino grows by adding workers, not by a bigger machine.",
        "Se une al clúster, y el coordinador le da los rangos que esperaban. Trino crece añadiendo workers, no con una máquina más grande.",
      ),
      "good",
    );
    await packet("coordinator", "t4", T("ranges 13–16", "rangos 13–16"));
    const all = [...readers, "t4"];
    await together(...all.map((t) => packet(t, "transactions", "SELECT", { ms: 800 })));
    await together(...all.map((t) => packet("transactions", t, T("rows", "filas"), { ms: 800 })));

    log(
      "02:30:00",
      T(
        "Meanwhile someone opens a dashboard. Trino's memory is divided between quality jobs and dashboard queries, so the big job does not starve it: it answers in seconds.",
        "Mientras tanto alguien abre un dashboard. La memoria de Trino está repartida entre los trabajos de calidad y las consultas de dashboards, así el trabajo grande no la acapara: responde en segundos.",
      ),
      "good",
    );
    await together(
      ...all.map((t) => packet(t, "bronze", T("files", "archivos"), { ms: 900 })),
      (async () => {
        await along(sim, ["people", "traefik", "superset"], "HTTPS");
        await packet("superset", "coordinator", T("SQL as the person", "SQL como la persona"));
        await packet("coordinator", "superset", T("indicators", "indicadores"));
      })(),
    );
    await packet("t1", "catalog", "commit");
    log(
      "02:31:00",
      T(
        "Each worker wrote its own files; one Iceberg commit makes them visible together.",
        "Cada worker escribió sus propios archivos; un commit de Iceberg los hace visibles juntos.",
      ),
    );

    log(
      "02:31:10",
      T(
        "The rules that group by customer, such as uniqueness, are spread too: each worker takes a share of the customers. What does not fit in memory spills to disk.",
        "Las reglas que agrupan por cliente, como la unicidad, también se reparten: cada worker toma una parte de los clientes. Lo que no cabe en memoria se vuelca a disco.",
      ),
    );
    all.forEach((t) => state(t, "busy", T("rules", "reglas")));
    await packet("w2", "coordinator", T("rules SQL", "SQL de reglas"));
    await together(...all.map((t) => packet(t, "silver", T("read", "lee"))));
    await together(...all.map((t) => packet(t, "gold", T("results", "resultados"))));
    await packet("coordinator", "w2", T("done", "terminado"));
    all.forEach((t) => state(t, "up", T("idle", "libre")));
    state("coordinator", "up", T("plans, splits", "planea, reparte"));
    await along(sim, ["w2", "traefik", "core"], T("counts", "conteos"));
    state("w2", "up", T("idle", "libre"));
    log(
      "03:05:00",
      T(
        "Done in its window. The rules were the same as for a small dataset: the core compiles them to Trino's SQL either way, and Trino spreads the work.",
        "Terminado en su ventana. Las reglas fueron las mismas que para un dataset pequeño: el núcleo las compila al SQL de Trino igual, y Trino reparte el trabajo.",
      ),
      "good",
    );
  },
};

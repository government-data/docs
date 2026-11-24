// A normal run: one scheduled cut of a dataset from the operator's schedule
// to the dashboard, with every part doing only its own job.
import { along, together, type Scenario } from "../story";

export const normal: Scenario = {
  id: "normal",
  section: "operation",
  label: { en: "Normal run", es: "Corrida normal" },
  async play(sim) {
    const { T, log, state, packet, wait } = sim;

    log(
      "10:00:00",
      T(
        "The operator fires the scheduled cut of «customers» and tells the core.",
        "El operador dispara el corte programado de «clientes» y le avisa al núcleo.",
      ),
    );
    state("operator", "busy", T("fires a cut", "dispara un corte"));
    await along(sim, ["operator", "traefik", "core"], T("cut due", "corte pendiente"));
    state("operator", "up", T("waiting", "en espera"));

    log(
      "10:00:01",
      T(
        "The core compiles the cut's SQL from the rules on the catalog's main line, signs it and records the bundle.",
        "El núcleo compila el SQL del corte con las reglas de la línea main del catálogo, lo firma y registra el paquete.",
      ),
    );
    state("core", "busy", T("compiling", "compilando"));
    await packet("core", "dolt", T("read main", "leer main"));
    await packet("dolt", "core", T("rules @ a1b2c3d", "reglas @ a1b2c3d"));
    await packet("core", "pg", T("signed bundle", "paquete firmado"));
    state("core", "up", T("compiles SQL", "compila SQL"));

    log(
      "10:00:02",
      T(
        "Worker 1 takes the job from the operator, with a lease it renews while it works.",
        "El worker 1 toma el trabajo del operador, con un préstamo que renueva mientras trabaja.",
      ),
    );
    await packet("w1", "operator", T("lease", "préstamo"));
    state("w1", "busy", T("«customers»", "«clientes»"));
    log(
      "10:00:02",
      T(
        "It fetches the signed bundle and a token for this job only, and checks the signature.",
        "Trae el paquete firmado y un token solo para este trabajo, y revisa la firma.",
      ),
    );
    await along(sim, ["w1", "traefik", "core"], T("bundle?", "¿paquete?"));
    await along(sim, ["core", "traefik", "w1"], T("bundle + token", "paquete + token"));

    log(
      "10:00:03",
      T(
        "It sends the first statement to Trino. The coordinator splits the read of the source between two workers.",
        "Envía la primera sentencia a Trino. El coordinador reparte la lectura de la fuente entre dos workers.",
      ),
    );
    await packet("w1", "coordinator", T("SQL · job token", "SQL · token"));
    state("coordinator", "busy", T("planning", "planeando"));
    await together(
      packet("coordinator", "t1", T("split", "parte")),
      packet("coordinator", "t2", T("split", "parte")),
    );
    state("t1", "busy", T("reading", "leyendo"));
    state("t2", "busy", T("reading", "leyendo"));
    await together(
      packet("t1", "customers", T("range 1", "rango 1")),
      packet("t2", "customers", T("range 2", "rango 2")),
    );
    await together(
      packet("customers", "t1", T("rows", "filas")),
      packet("customers", "t2", T("rows", "filas")),
    );

    log(
      "10:00:40",
      T(
        "The copy goes to bronze, and silver is derived from it with the dataset's mapping: Iceberg commits, all or nothing.",
        "La copia va a bronze, y de ella se deriva silver con el mapeo del dataset: commits de Iceberg, todo o nada.",
      ),
    );
    await together(
      packet("t1", "bronze", T("write", "escribe")),
      packet("t2", "bronze", T("write", "escribe")),
    );
    await packet("t1", "silver", T("derive", "deriva"));
    await packet("t1", "catalog", "commit");

    log(
      "10:00:52",
      T(
        "The rules run as SQL on silver, and their results are written to gold.",
        "Las reglas corren como SQL sobre silver, y sus resultados se escriben en gold.",
      ),
    );
    state("t1", "busy", T("rules", "reglas"));
    state("t2", "busy", T("rules", "reglas"));
    await together(
      packet("t1", "gold", T("results", "resultados")),
      packet("t2", "gold", T("results", "resultados")),
    );
    await together(
      packet("gold", "rustfs", T("files", "archivos")),
      packet("alloy", "lokimimir", T("logs · metrics", "logs · métricas")),
    );
    await packet("rustfs", "replica", T("copy", "copia"));
    state("t1", "up", T("idle", "libre"));
    state("t2", "up", T("idle", "libre"));
    state("coordinator", "up", T("plans, splits", "planea, reparte"));

    log(
      "10:00:55",
      T(
        "Worker 1 reports names, counts and snapshot ids, never a value. The core records the cut.",
        "El worker 1 reporta nombres, conteos e ids de snapshot, nunca un valor. El núcleo registra el corte.",
      ),
    );
    await along(sim, ["w1", "traefik", "core"], T("counts", "conteos"));
    state("w1", "up", T("idle", "libre"));
    await packet("core", "pg", T("cut recorded", "corte registrado"));
    await along(sim, ["core", "traefik", "people"], T("notice", "aviso"));

    log(
      "10:01:30",
      T(
        "Someone opens the dataset's dashboard. Superset asks Trino for gold, as that person, with their row filters.",
        "Alguien abre el dashboard del dataset. Superset le pide gold a Trino, como esa persona, con sus filtros de filas.",
      ),
      "good",
    );
    await along(sim, ["people", "traefik", "superset"], "HTTPS");
    await packet("superset", "valkey", T("cached?", "¿en caché?"));
    await packet("superset", "coordinator", T("SQL as the person", "SQL como la persona"));
    await packet("coordinator", "t3", T("task", "tarea"));
    await packet("t3", "gold", T("read gold", "lee gold"));
    await packet("t3", "coordinator", T("indicators", "indicadores"));
    await packet("coordinator", "superset", T("indicators", "indicadores"));
    await packet("superset", "valkey", T("keep a few minutes", "guarda unos minutos"));
    await wait(300);
    log(
      "10:01:31",
      T(
        "The dashboard shows the new cut. The next person who opens it is served from the cache.",
        "El dashboard muestra el corte nuevo. A la siguiente persona que lo abra le responde la caché.",
      ),
      "good",
    );
  },
};

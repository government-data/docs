// The quality flow of one dataset's monthly cut, stage by stage: the core
// compiles and signs the SQL from the catalog's main line, the operator and
// a worker run it as three jobs on Trino, and the results land in gold.
// The figures are the guide's chart examples (IGCD 0.85, 6 of 10 cells).
import { along, together, type Scenario } from "../story";

export const quality: Scenario = {
  id: "quality",
  section: "data",
  label: { en: "Quality flow", es: "Flujo de calidad" },
  async play(sim) {
    const { T, log, state, packet, wait, track, stage } = sim;
    track(T("Quality flow · «customers», cut 2026-06", "Flujo de calidad · «clientes», corte 2026-06"), [
      T("Extraction", "Extracción"),
      T("Bronze", "Bronze"),
      T("Silver", "Silver"),
      T("Schema", "Esquema"),
      T("Rules", "Reglas"),
      T("ICD and IGCD", "ICD e IGCD"),
      T("Sector view", "Vista sectorial"),
      T("Statistics", "Estadística"),
      T("Queues", "Colas"),
      T("Publish", "Publicar"),
    ]);

    log(
      "02:00:00",
      T(
        "The operator fires the monthly cut of «customers».",
        "El operador dispara el corte mensual de «clientes».",
      ),
    );
    state("operator", "busy", T("fires a cut", "dispara un corte"));
    await along(sim, ["operator", "traefik", "core"], T("cut due", "corte pendiente"));
    state("operator", "up", T("waiting", "en espera"));
    log(
      "02:00:01",
      T(
        "The core compiles the cut from the approved rules on main, commit a1b2c3d: 180 rules as Trino SQL, in three jobs. It signs the bundle.",
        "El núcleo compila el corte con las reglas aprobadas de main, commit a1b2c3d: 180 reglas como SQL de Trino, en tres trabajos. Firma el paquete.",
      ),
    );
    state("core", "busy", T("compiling", "compilando"));
    await packet("core", "dolt", T("read main", "leer main"));
    await packet("dolt", "core", "a1b2c3d");
    await packet("core", "pg", T("signed bundle", "paquete firmado"));
    state("core", "up", T("compiles SQL", "compila SQL"));
    await packet("w1", "operator", T("lease", "préstamo"));
    state("w1", "busy", T("job 1 of 3", "trabajo 1 de 3"));
    await along(sim, ["core", "traefik", "w1"], T("bundle + token", "paquete + token"));

    stage(0, "active");
    log(
      "02:00:03",
      T(
        "Extraction: Trino's coordinator splits the source into key ranges, and three workers read them in parallel, read only.",
        "Extracción: el coordinador de Trino parte la fuente en rangos de llaves, y tres workers los leen en paralelo, solo lectura.",
      ),
    );
    await packet("w1", "coordinator", T("SQL · token", "SQL · token"));
    state("coordinator", "busy", T("planning", "planeando"));
    const readers = ["t1", "t2", "t3"];
    await together(
      ...readers.map((t, k) => packet("coordinator", t, T(`range ${k + 1}`, `rango ${k + 1}`))),
    );
    readers.forEach((t) => state(t, "busy", T("reading", "leyendo")));
    await together(...readers.map((t) => packet(t, "customers", "SELECT", { ms: 900 })));
    await together(...readers.map((t) => packet("customers", t, T("rows", "filas"), { ms: 900 })));
    stage(0, "ok", T("412,380 rows", "412.380 filas"));

    stage(1, "active");
    log(
      "02:03:10",
      T(
        "Bronze: the cut as received, written as a new load. Bronze only grows.",
        "Bronze: el corte tal como llegó, escrito como una carga nueva. Bronze solo crece.",
      ),
    );
    await together(...readers.map((t) => packet(t, "bronze", T("write", "escribe"))));
    await packet("t1", "catalog", "commit");
    stage(1, "ok", "snapshot 2026-06");

    stage(2, "active");
    state("w1", "busy", T("job 2 of 3", "trabajo 2 de 3"));
    log(
      "02:03:30",
      T(
        "Silver: the dataset's mapping applied: types, dates, codes as text, and the customer's key normalized.",
        "Silver: el mapeo del dataset aplicado: tipos, fechas, códigos como texto, y la llave del cliente normalizada.",
      ),
    );
    await packet("w1", "coordinator", T("derive", "derivar"));
    await packet("t1", "silver", T("write", "escribe"));
    stage(2, "warn", T("37 keys not normalized", "37 llaves sin normalizar"));
    log(
      "02:03:31",
      T(
        "37 documents could not be normalized: they become a finding of their own.",
        "37 documentos no se pudieron normalizar: quedan como hallazgo propio.",
      ),
      "warn",
    );

    stage(3, "active");
    log(
      "02:03:32",
      T(
        "The columns read are compared with the previous cut's: none new, none changed.",
        "Las columnas leídas se comparan con las del corte anterior: ninguna nueva, ninguna cambiada.",
      ),
    );
    await wait(600);
    stage(3, "ok", T("no drift", "sin cambios"));

    stage(4, "active");
    state("w1", "busy", T("job 3 of 3", "trabajo 3 de 3"));
    readers.forEach((t) => state(t, "busy", T("rules", "reglas")));
    log(
      "02:03:33",
      T(
        "Rules: the core's SQL for the 180 rules runs on silver in one pass, the rule × record matrix, and its results go to gold.",
        "Reglas: el SQL del núcleo para las 180 reglas corre sobre silver en una pasada, la matriz regla × registro, y sus resultados van a gold.",
      ),
    );
    await packet("w1", "coordinator", T("rules SQL", "SQL de reglas"));
    await together(...readers.map((t) => packet(t, "silver", T("read", "lee"))));
    await together(...readers.map((t) => packet(t, "gold", T("results", "resultados"))));
    stage(4, "ok", T("180 rules · 1 pass", "180 reglas · 1 pasada"));

    stage(5, "active");
    log(
      "02:05:10",
      T(
        "The ICD per field and record, and the IGCD: 0.85 against a target of 0.90.",
        "El ICD por campo y registro, y el IGCD: 0,85 frente a una meta de 0,90.",
      ),
    );
    await packet("t1", "gold", "ICD · IGCD");
    stage(5, "ok", T("IGCD 0.85", "IGCD 0,85"));

    stage(6, "active");
    log(
      "02:05:20",
      T(
        "Sector view: 6 of 10 cells pass. Mobile phone fell to 87%: it lost its cell.",
        "Vista sectorial: 6 de 10 celdas cumplen. Celular cayó a 87 %: perdió su celda.",
      ),
      "warn",
    );
    await packet("t2", "gold", T("cells", "celdas"));
    stage(6, "warn", T("6/10 · mobile 87%", "6/10 · celular 87 %"));

    stage(7, "active");
    log(
      "02:05:30",
      T(
        "Statistics: a p′ chart with 2 offices above the limit, income outliers, PSI 0.06 against the previous cut.",
        "Estadística: una carta p′ con 2 oficinas sobre el límite, atípicos de ingresos, PSI 0,06 frente al corte anterior.",
      ),
    );
    await packet("t3", "gold", "p′ · PSI");
    stage(7, "warn", T("2 offices signal", "2 oficinas con señal"));

    stage(8, "active");
    await packet("coordinator", "w1", T("done", "terminado"));
    readers.forEach((t) => state(t, "up", T("idle", "libre")));
    state("coordinator", "up", T("plans, splits", "planea, reparte"));
    log(
      "02:05:40",
      T(
        "The worker reports counts, never values. The core opens the queues: 5,770 capture failures for the offices, 6,200 systemic ones to fix at the source.",
        "El worker reporta conteos, nunca valores. El núcleo abre las colas: 5.770 fallas de captura para las oficinas, 6.200 sistémicas para corregir en el origen.",
      ),
    );
    await along(sim, ["w1", "traefik", "core"], T("counts", "conteos"));
    state("w1", "up", T("idle", "libre"));
    await packet("core", "pg", T("queues", "colas"));
    stage(8, "ok", T("capture 5,770 · systemic 6,200", "captura 5.770 · sistémica 6.200"));

    stage(9, "active");
    log(
      "02:05:41",
      T(
        "Publish: gold switches to the new run in one commit; the core records the accepted load, the rules' commit and the bundle, and the audit log keeps it.",
        "Publicar: gold pasa a la corrida nueva en un commit; el núcleo registra la carga aceptada, el commit de las reglas y el paquete, y el log de auditoría lo guarda.",
      ),
    );
    await packet("core", "pg", T("cut · audit", "corte · auditoría"));
    await packet("gold", "rustfs", T("files", "archivos"));
    await packet("rustfs", "replica", T("copy", "copia"));
    await along(sim, ["core", "traefik", "people"], T("notice", "aviso"));
    stage(9, "ok", T("published", "publicado"));
    log(
      "02:05:43",
      T(
        "Cut complete. Tomorrow the offices see their queue, the owner of «mobile» sees what to recover, and the dashboards read the new run from gold.",
        "Corte completo. Mañana las oficinas ven su cola, el dueño de «celular» ve qué recuperar y los dashboards leen la corrida nueva desde gold.",
      ),
      "good",
    );
  },
};

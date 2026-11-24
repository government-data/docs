// Updates pulled from AWS by the installation's agent: a signed version
// applied in steps after a checked backup, and one that goes back by
// itself when it does not come up. Nothing reaches into the installation.
import { along, type Scenario, type Sim } from "../story";

/** Read the signed index, fetch the version, wait for the work, back up. */
async function prepare(sim: Sim) {
  const { T, log, state, packet, wait } = sim;
  log(
    "22:00:00",
    T(
      "The agent reads the signed version index from AWS, going out over HTTPS with credentials from its certificate that last one hour.",
      "El agente lee el índice firmado de versiones en AWS, saliendo por HTTPS con credenciales de su certificado que duran una hora.",
    ),
  );
  state("agent", "busy", T("checking", "revisando"));
  await packet("agent", "aws", T("index?", "¿índice?"));
  await packet("aws", "agent", T("signed index", "índice firmado"));
  log(
    "22:00:01",
    T(
      "The signature matches the public key the agent carries: a new version of the core is due for this installation.",
      "La firma coincide con la llave pública que trae el agente: hay una versión nueva del núcleo para esta instalación.",
    ),
    "good",
  );
  await packet("aws", "agent", T("package · images", "paquete · imágenes"));
  log(
    "22:00:40",
    T(
      "The package's fingerprint and each image's digest match the index.",
      "La huella del paquete y el digest de cada imagen coinciden con el índice.",
    ),
  );
  log(
    "22:00:41",
    T(
      "It asks the core how much work is running or due. One job is running: it waits for it.",
      "Le pregunta al núcleo cuánto trabajo corre o está por empezar. Corre un trabajo: lo espera.",
    ),
  );
  await along(sim, ["agent", "traefik", "core"], T("work?", "¿trabajo?"));
  await along(sim, ["core", "traefik", "operator"], T("work?", "¿trabajo?"));
  await along(sim, ["operator", "traefik", "core"], T("1 running", "1 corriendo"));
  await wait(900);
  log(
    "22:06:00",
    T(
      "Backup: PostgreSQL, Dolt, the volumes and the keys, and then the backup is checked. Without it, there is no update.",
      "Respaldo: PostgreSQL, Dolt, los volúmenes y las llaves, y luego se revisa el respaldo. Sin él, no hay actualización.",
    ),
  );
  state("pg", "maint", T("backup", "respaldo"));
  state("dolt", "maint", T("backup", "respaldo"));
  await wait(1000);
  state("pg", "up", T("backup checked", "respaldo revisado"));
  state("dolt", "up", T("backup checked", "respaldo revisado"));
  log(
    "22:08:00",
    T(
      "It applies the version in steps, writing down where it is before each one. Meanwhile the core's route shows a maintenance page.",
      "Aplica la versión por pasos, anotando dónde va antes de cada uno. Mientras tanto la ruta del núcleo muestra una página de mantenimiento.",
    ),
  );
  state("agent", "busy", T("step 1 of 3", "paso 1 de 3"));
  state("core", "maint", T("updating", "actualizando"));
  state(
    "traefik",
    "maint",
    T("the core's route: a maintenance page", "la ruta del núcleo: una página de mantenimiento"),
  );
  await along(sim, ["people", "traefik"], "HTTPS");
  await wait(900);
}

export const update: Scenario = {
  id: "update",
  section: "operation",
  label: { en: "Update from AWS", es: "Actualización desde AWS" },
  async play(sim) {
    const { T, log, state, packet } = sim;
    await prepare(sim);
    state("agent", "busy", T("step 3 of 3", "paso 3 de 3"));
    state("core", "up", T("new version", "versión nueva"));
    state(
      "traefik",
      "up",
      T("web entry (HTTPS) · internal entry (mutual TLS)", "entrada web (HTTPS) · entrada interna (TLS mutuo)"),
    );
    log(
      "22:10:00",
      T(
        "The core comes up healthy on the new version, and its route is back.",
        "El núcleo arranca sano en la versión nueva, y su ruta vuelve.",
      ),
      "good",
    );
    await along(sim, ["agent", "traefik", "core"], T("health?", "¿salud?"), { health: true });
    await along(sim, ["core", "traefik", "agent"], "ok", { health: true });
    log(
      "22:10:05",
      T(
        "A short report goes to AWS: versions, steps, durations. Never the organisation's data.",
        "Un reporte corto va a AWS: versiones, pasos, duraciones. Nunca datos de la organización.",
      ),
    );
    await packet("agent", "aws", T("report", "reporte"));
    state("agent", "up", T("on the core's server", "en el servidor del núcleo"));
    log(
      "22:10:06",
      T(
        "Every connection went out from the installation. Nothing reached into it.",
        "Cada conexión salió de la instalación. Nada entró en ella.",
      ),
      "good",
    );
  },
};

export const updateFails: Scenario = {
  id: "update-fails",
  section: "failure",
  label: { en: "An update fails", es: "Falla una actualización" },
  async play(sim) {
    const { T, log, state, packet, wait } = sim;
    await prepare(sim);
    await packet("agent", "traefik", T("health?", "¿salud?"), { health: true });
    await packet("traefik", "core", T("health?", "¿salud?"), { health: true, fail: true });
    state("core", "fail", T("not healthy", "no está sano"));
    log(
      "22:12:00",
      T(
        "The new version of the core does not come up healthy.",
        "La versión nueva del núcleo no arranca sana.",
      ),
      "bad",
    );
    await wait(700);
    log(
      "22:12:01",
      T(
        "The agent goes back to the previous version by itself, from where it wrote it was. No data is lost: the backup was checked first.",
        "El agente vuelve solo a la versión anterior, desde donde anotó que iba. No se pierden datos: el respaldo se revisó antes.",
      ),
      "warn",
    );
    state("agent", "busy", T("going back", "volviendo"));
    state("core", "maint", T("going back", "volviendo"));
    await wait(1000);
    state("core", "up", T("previous version", "versión anterior"));
    state(
      "traefik",
      "up",
      T("web entry (HTTPS) · internal entry (mutual TLS)", "entrada web (HTTPS) · entrada interna (TLS mutuo)"),
    );
    await along(sim, ["agent", "traefik", "core"], T("health?", "¿salud?"), { health: true });
    await along(sim, ["core", "traefik", "agent"], "ok", { health: true });
    log(
      "22:15:00",
      T(
        "The previous version runs as before. The report says which step failed, so whoever publishes versions can fix it.",
        "La versión anterior corre como antes. El reporte dice qué paso falló, así quien publica versiones puede corregirlo.",
      ),
      "good",
    );
    await packet("agent", "aws", T("report · error", "reporte · error"));
    state("agent", "up", T("on the core's server", "en el servidor del núcleo"));
    await along(sim, ["people", "traefik", "core"], "HTTPS");
  },
};

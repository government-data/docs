// A third-party batch through its five gates: read into quarantine, checked
// by the same compiled rules, compared and reconciled on Trino, approved by
// the data's owner, and applied as a new load that can be undone.
import { along, together, type Scenario } from "../story";

export const thirdParty: Scenario = {
  id: "third-party",
  section: "data",
  label: { en: "Third-party batch", es: "Lote de un tercero" },
  async play(sim) {
    const { T, log, state, packet, wait, track, stage } = sim;
    track(T("Third-party batch · the five gates", "Lote de un tercero · las cinco compuertas"), [
      T("Reception and quarantine", "Recepción y cuarentena"),
      T("Technical validation", "Validación técnica"),
      T("Statistical validation", "Validación estadística"),
      T("Reconciliation and precedence", "Conciliación y precedencia"),
      T("Acceptance and traceability", "Aceptación y trazabilidad"),
    ]);

    stage(0, "active");
    state("provider", "busy", T("delivers the batch", "entrega el lote"));
    log(
      "08:00:00",
      T(
        "The third-party provider delivers the month's batch where agreed: 250,000 records declared.",
        "El proveedor tercero entrega el lote del mes donde se acordó: 250.000 registros declarados.",
      ),
    );
    await wait(700);
    state("provider", "up", T("delivers batches", "entrega lotes"));
    log(
      "08:00:05",
      T(
        "A data steward registers it in the application: provider, date and the file's fingerprint. It goes in the audit log.",
        "Un responsable de datos lo registra en la aplicación: proveedor, fecha y huella del archivo. Queda en el log de auditoría.",
      ),
    );
    await along(sim, ["people", "traefik", "core"], T("register batch", "registrar lote"));
    await packet("core", "pg", T("batch · audit", "lote · auditoría"));
    await along(sim, ["core", "traefik", "operator"], T("intake job", "trabajo de ingreso"));
    await packet("w2", "operator", T("lease", "préstamo"));
    state("w2", "busy", T("batch intake", "ingreso del lote"));
    await along(sim, ["core", "traefik", "w2"], T("bundle + token", "paquete + token"));
    log(
      "08:00:20",
      T(
        "Trino reads the batch, read only, into a quarantine table in bronze, apart from the data in use.",
        "Trino lee el lote, solo lectura, a una tabla de cuarentena en bronze, aparte de los datos en uso.",
      ),
    );
    await packet("w2", "coordinator", T("SQL · token", "SQL · token"));
    state("coordinator", "busy", T("planning", "planeando"));
    await packet("coordinator", "t1", T("task", "tarea"));
    state("t1", "busy", T("intake", "ingreso"));
    await packet("t1", "provider", "SELECT");
    await packet("provider", "t1", T("rows", "filas"));
    await packet("t1", "bronze", T("quarantine", "cuarentena"));
    stage(0, "ok", T("250,000 = declared", "250.000 = declarado"));

    stage(1, "active");
    log(
      "08:01:00",
      T(
        "Gate 2: schema, key (document type and number), formats and domains, with the same rule patterns, compiled by the core.",
        "Compuerta 2: esquema, llave (tipo y número de documento), formatos y dominios, con los mismos patrones de reglas, compilados por el núcleo.",
      ),
    );
    await packet("t1", "bronze", T("checks", "revisa"));
    log(
      "08:02:00",
      T(
        "Complete key 99.6% (minimum 99%); format errors 2.1% (maximum 5%).",
        "Llave completa 99,6 % (mínimo 99 %); errores de formato 2,1 % (máximo 5 %).",
      ),
      "good",
    );
    stage(1, "ok", T("key 99.6% · format 2.1%", "llave 99,6 % · formato 2,1 %"));

    stage(2, "active");
    log(
      "08:02:10",
      T(
        "Gate 3: does it look like the customers in silver and the earlier batches? PSI per variable.",
        "Compuerta 3: ¿se parece a los clientes de silver y a los lotes anteriores? PSI por variable.",
      ),
    );
    await packet("coordinator", "t2", T("task", "tarea"));
    state("t2", "busy", T("comparing", "comparando"));
    await together(
      packet("t1", "bronze", T("deciles", "deciles")),
      packet("t2", "silver", T("deciles", "deciles")),
    );
    log(
      "08:03:00",
      T(
        "Ages PSI 0.04, stable; income PSI 0.16, a moderate change: a notice to the quality desk.",
        "Edades PSI 0,04, estable; ingresos PSI 0,16, un cambio moderado: un aviso a la mesa de calidad.",
      ),
      "warn",
    );
    await packet("t2", "coordinator", "PSI");
    await packet("coordinator", "w2", T("counts", "conteos"));
    await along(sim, ["w2", "traefik", "core"], T("counts", "conteos"));
    await along(sim, ["core", "traefik", "people"], T("notice · PSI 0.16", "aviso · PSI 0,16"));
    stage(2, "warn", T("income PSI 0.16", "ingresos PSI 0,16"));

    stage(3, "active");
    log(
      "08:03:10",
      T(
        "Gate 4: matched with silver by the normalized key, on Trino. Coverage 92%.",
        "Compuerta 4: cruzado con silver por la llave normalizada, en Trino. Cobertura 92 %.",
      ),
    );
    await packet("w2", "coordinator", T("match SQL", "SQL de cruce"));
    await together(
      packet("t1", "bronze", T("batch", "lote")),
      packet("t2", "silver", T("customers", "clientes")),
    );
    log(
      "08:05:00",
      T(
        "Mobile: 71% agree, 18% disagree, 11% fill gaps. The most recent wins when the internal one was not verified.",
        "Celular: 71 % coincide, 18 % discrepa, 11 % llena vacíos. Gana el más reciente cuando el interno no fue verificado.",
      ),
    );
    log(
      "08:05:01",
      T(
        "Document and name: 0.3% disagree (maximum 15%); the internal value is never overwritten.",
        "Documento y nombre: discrepa 0,3 % (máximo 15 %); el valor interno nunca se sobrescribe.",
      ),
      "good",
    );
    log(
      "08:05:02",
      T(
        "Worked out without touching the data in use: the IGCD would go from 0.85 to 0.86; the mobile cell, from 87% to 91%.",
        "Calculado sin tocar los datos en uso: el IGCD pasaría de 0,85 a 0,86; la celda de celular, de 87 % a 91 %.",
      ),
      "good",
    );
    await packet("coordinator", "w2", T("counts", "conteos"));
    await along(sim, ["w2", "traefik", "core"], T("counts", "conteos"));
    stage(3, "ok", T("coverage 92% · IGCD 0.85 → 0.86", "cobertura 92 % · IGCD 0,85 → 0,86"));
    ["t1", "t2"].forEach((t) => state(t, "up", T("idle", "libre")));
    state("coordinator", "up", T("plans, splits", "planea, reparte"));
    state("w2", "up", T("idle", "libre"));

    stage(4, "active");
    log(
      "08:05:10",
      T(
        "Gate 5: it waits for the approval of the contact data's owner.",
        "Compuerta 5: espera la aprobación del dueño de los datos de contacto.",
      ),
    );
    await along(sim, ["core", "traefik", "people"], T("approve batch?", "¿aprobar lote?"));
    await wait(900);
    log(
      "10:12:00",
      T(
        "The owner approves with the evidence in view. The approval goes in the audit log.",
        "El dueño aprueba con la evidencia a la vista. La aprobación queda en el log de auditoría.",
      ),
      "good",
    );
    await along(sim, ["people", "traefik", "core"], T("approved", "aprobado"));
    await packet("core", "pg", T("approval · audit", "aprobación · auditoría"));
    await packet("w2", "operator", T("lease", "préstamo"));
    state("w2", "busy", T("applying", "aplicando"));
    log(
      "10:12:05",
      T(
        "Each value goes to silver with its origin, date and confidence, as a new load; the rules run again into gold.",
        "Cada valor va a silver con su origen, fecha y confianza, como una carga nueva; las reglas corren de nuevo hacia gold.",
      ),
    );
    await packet("w2", "coordinator", T("apply SQL", "SQL de aplicar"));
    await packet("coordinator", "t1", T("task", "tarea"));
    await packet("t1", "silver", T("silver + origin", "silver + origen"));
    await packet("t1", "gold", T("results", "resultados"));
    await packet("rustfs", "replica", T("copy", "copia"));
    log(
      "10:12:06",
      T(
        "With an external source to compare with, the mobile phone's accuracy can now be checked: IGCD 0.86.",
        "Con una fuente externa con qué comparar, ya se puede revisar la exactitud del celular: IGCD 0,86.",
      ),
      "good",
    );
    await along(sim, ["w2", "traefik", "core"], T("counts", "conteos"));
    state("w2", "up", T("idle", "libre"));
    stage(4, "ok", T("approved · can be undone", "aprobado · reversible"));
    log(
      "10:12:07",
      T(
        "If anything went wrong, the core goes back to the previous accepted load: the batch's rows stay in the lake, unread.",
        "Si algo saliera mal, el núcleo vuelve a la carga aceptada anterior: las filas del lote quedan en el lago, sin leerse.",
      ),
      "good",
    );
  },
};

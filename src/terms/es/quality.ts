import { concept } from "../types";

// Concepts of data quality and its indicators, from the old glossary
// (es/guide/glossary.md), shortened to a sentence or two.
export const quality = [
  concept(
    "exactitud",
    "Dimensión de calidad: el valor representa correctamente la realidad. Sin fuente externa se aproxima con plausibilidad.",
  ),
  concept(
    "cliente activo",
    "Cliente con una relación vigente con la organización. El indicador SFC opcional se mide solo sobre los registros activos.",
    ["clientes activos"],
  ),
  concept(
    "banda",
    "La banda del ICD de una entidad: buen estado (≥ 0,90), regular (0,75–0,90) o malo (< 0,75).",
    ["bandas"],
  ),
  concept(
    "línea base",
    "Una primera medición que se toma como referencia para comparar las siguientes.",
    ["líneas base"],
  ),
  concept(
    "causa sistémica",
    "Causa de errores que viene de una carga, un maestro, un catálogo o el paso del tiempo, y se corrige una vez en el origen o con una campaña. Una causa de captura depende de quien registró el dato y se corrige caso a caso en la oficina.",
    ["causas sistémicas", "causa de captura", "causas de captura"],
  ),
  concept(
    "celda",
    "Cada campo que evalúa el indicador SFC opcional: vale 1 si al menos el 90 % de los registros activos lo tiene correcto y 0 si no.",
    ["celdas"],
  ),
  concept("completitud", "Dimensión de calidad: el dato está presente cuando debe estarlo."),
  concept(
    "componentes del ICD",
    "Las partes que suman el ICD de un campo: C (conformidad con las reglas del propio campo), S (consistencia con otros campos) y A (actualidad).",
  ),
  concept(
    "conformidad",
    "Proporción de los registros a los que aplica una regla que la cumplen: 1 − fallos / aplica.",
  ),
  concept(
    "consistencia",
    "Dimensión de calidad: los datos no se contradicen entre campos o fuentes (por ejemplo, patrimonio = activo − pasivo).",
  ),
  concept(
    "cobertura",
    "Para un lote de datos de terceros, la proporción de sus registros que coincide con registros que ya se tienen.",
  ),
  concept("dueño del dato", "Responsable de negocio del significado y las reglas de un dato.", [
    "dueños del dato",
    "dueños de los datos",
  ]),
  concept(
    "mesa de calidad de datos",
    "Equipo que revisa los casos que no se pueden corregir automáticamente (lotes sospechosos, atípicos, discrepancias) y decide qué hacer con ellos.",
    ["mesa de calidad"],
  ),
  concept(
    "debida diligencia intensificada",
    "Verificación reforzada de un cliente por mayor riesgo, exigida a las entidades financieras reguladas.",
  ),
  concept(
    "campo que caduca",
    "Campo cuyo valor pierde validez con el tiempo (contacto, ingresos, ocupación…). Solo en estos se aplica el componente de actualidad A.",
    ["campos que caducan"],
  ),
  concept(
    "regla de campo",
    "Regla (C) para un dato que está mal por sí solo: vacío, mal escrito, largo imposible. Una regla entre campos (S) es para un dato que contradice a otro campo, por ejemplo un pensionado con empleador.",
    ["reglas de campo", "regla entre campos", "reglas entre campos"],
  ),
  concept(
    "prioridad del campo",
    "Crítica, alta, media o baja: pondera cada campo en el ICD de un registro y en la prioridad de un hallazgo (pesos 4, 3, 2, 1).",
  ),
  concept(
    "dependencia funcional",
    "Relación en la que un atributo determina a otro (ocupación → códigos de actividad admisibles; región → prefijo del código postal).",
    ["dependencias funcionales"],
  ),
  concept(
    "ISO 8000",
    "Norma de calidad de datos maestros: la calidad se declara frente a requisitos explícitos, con procedencia y trazabilidad.",
  ),
  concept(
    "ISO/IEC 25012",
    "Modelo de calidad de datos: dimensiones inherentes (exactitud, completitud, consistencia, credibilidad, actualidad) y dependientes del sistema.",
  ),
  concept(
    "margen",
    "Para una celda que cumple del indicador SFC opcional, cuántos registros podrían dañarse antes de bajar del 90 %.",
  ),
  concept(
    "vinculación",
    "Proceso en el que una persona o empresa se vuelve cliente; ahí se captura la mayor parte de sus datos.",
  ),
  concept(
    "plausibilidad",
    "Que un dato sea creíble. Un patrimonio negativo o gastos muy superiores a los ingresos son posibles, pero poco probables: no se dan por errores, se confirman con el cliente.",
  ),
  concept(
    "precedencia de fuentes",
    "Regla que define, por atributo, qué fuente gana ante un conflicto (interna o externa) según su confiabilidad y antigüedad.",
    ["precedencia"],
  ),
  concept(
    "proximidad al umbral",
    "En el indicador SFC opcional, peso que privilegia los campos con entre 80 % y 90 % correctos, donde menos correcciones cambian una celda de 0 a 1.",
  ),
  concept(
    "cuarentena",
    "Zona aislada donde queda un dato o un lote sospechoso hasta que se valida; nada se escribe en producción antes.",
  ),
  concept(
    "conciliación",
    "Comparación, campo por campo, de un dato externo con el interno del mismo cliente: coincide, discrepa o el externo completa un vacío.",
  ),
  concept(
    "integridad referencial",
    "Dimensión de calidad: un código apunta a algo que existe en su maestro (por ejemplo, el código del asesor está en el maestro de asesores).",
  ),
  concept(
    "segmento",
    "Grupo comercial al que pertenece el cliente; define la oferta y la atención.",
    ["segmentos"],
  ),
  concept(
    "indicador SFC",
    "Indicador de calidad de datos del supervisor financiero de Colombia, para las entidades que vigila: la proporción de sus celdas que cumplen el umbral del 90 %. Quality Data lo calcula con los mismos resultados de reglas que el ICD cuando un dataset participa en él.",
  ),
  concept(
    "estrato",
    "En Colombia, el estrato socioeconómico de una vivienda (1 a 6). Aplica a personas naturales, no a empresas.",
    ["estratos"],
  ),
  concept(
    "actualidad",
    "Dimensión de calidad: el dato está al día. Un celular correcto hace cinco años puede no serlo hoy.",
  ),
  concept(
    "unicidad",
    "Dimensión de calidad: una entidad aparece una sola vez (documento único; celular o correo no compartido).",
  ),
  concept(
    "campaña de actualización",
    "Acción masiva para que los clientes confirmen o corrijan sus datos (canales digitales, llamadas o en la oficina). Es la forma de atender la desactualización, que no se resuelve caso a caso.",
    ["campañas de actualización"],
  ),
  concept(
    "validez",
    "Dimensión de calidad: el dato tiene la forma correcta y un valor permitido (un correo con @ y dominio; una región de su lista).",
  ),
];

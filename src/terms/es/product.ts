import { concept } from "../types";

// The product's concepts, from es/guide/concepts.md (and the old glossary
// where it defined them too), shortened to a sentence or two.
export const product = [
  concept(
    "fuente",
    "Una base de datos que la organización ya tiene. Quality Data la lee y nunca escribe en ella.",
    ["fuentes"],
  ),
  concept(
    "dataset",
    "Una tabla de una fuente tal como Quality Data la lee: un nombre, sus campos y las reglas que los revisan.",
    ["datasets"],
  ),
  concept(
    "mapeo",
    "Cómo se lee la tabla de un dataset: qué columna lee cada campo y con qué tipo, la llave del registro, la prioridad de cada campo y el rol de algunos campos.",
    ["mapeos"],
  ),
  concept(
    "llave del registro",
    "El campo o los campos del mapeo de un dataset que distinguen un registro de otro.",
    ["llaves del registro"],
  ),
  concept(
    "llave de entidad",
    "El campo que dice de quién es un registro, como el documento de identidad de una persona o una empresa; las gráficas por entidad la necesitan.",
    ["llaves de entidad"],
  ),
  concept(
    "rol del campo",
    "Para qué sirve un campo en el mapeo de un dataset, como un campo de agrupación.",
    ["roles de los campos"],
  ),
  concept(
    "campo de agrupación",
    "Un campo (una oficina, una región, un canal) por el que el dashboard y las colas de remediación reparten los resultados.",
    ["campos de agrupación", "dimensión de agrupación", "dimensiones de agrupación"],
  ),
  concept(
    "regla",
    "Aplica un patrón a un campo; el patrón le da su dimensión y una severidad por defecto. Las reglas que cuentan son las de main, la versión aprobada.",
    ["reglas"],
  ),
  concept(
    "patrón",
    "Forma reutilizable de validar (required, format, fresh y once más). Cada regla es un patrón aplicado a un campo con su condición.",
    ["patrones", "patrón de regla", "patrones de reglas"],
  ),
  concept(
    "dimensión",
    "El tipo de calidad que mide una regla (completitud, validez, actualidad…), que le da su patrón.",
    ["dimensiones"],
  ),
  concept(
    "severidad",
    "Peso de una regla en el ICD: bloqueante 1,0, mayor 0,6 y menor 0,3. El patrón le da a la regla su severidad por defecto.",
  ),
  concept(
    "borrador",
    "Un cambio a las reglas de un dataset que queda aparte de main, por lo general guardado por un autor que puede editar reglas pero no aprobarlas, hasta que alguien que puede aprobar lo revisa y lo aprueba o lo descarta.",
    ["borradores"],
  ),
  concept(
    "reglas globales",
    "El archivo reglas_globales.yaml de un dataset: lo que comparten varios campos, como listas, poblaciones y reglas con nombre, declarado una vez para todos sus archivos de reglas.",
  ),
  concept(
    "regla con nombre",
    "Una revisión escrita una vez en las reglas globales de un dataset, con todo menos su id y su campo; la regla de un campo parte de ella con extends.",
    ["reglas con nombre"],
  ),
  concept(
    "linter",
    "El revisor que lee un archivo de reglas mientras se escribe, sin datos, y marca sus errores, que impiden guardar y desplegar, y sus avisos.",
  ),
  concept(
    "corte",
    "Los datos del dataset tal como estaban en una fecha, copiados al lago para poder medirlos otra vez sin tocar la fuente. Todas las cifras de un reporte se refieren a ese momento.",
    ["cortes"],
  ),
  concept(
    "lago",
    "El almacenamiento propio de Quality Data, donde guarda los cortes que copia de las fuentes.",
  ),
  concept(
    "programación",
    "Lo que inicia los cortes de un dataset por sí solo: diaria, semanal, mensual…",
    ["programaciones"],
  ),
  concept(
    "evaluación",
    "Corre cada regla de main sobre cada registro de un corte. Una regla falla, pasa o no aplica a cada registro; uno al que no aplica queda por fuera de sus cifras.",
    ["evaluaciones"],
  ),
  concept(
    "dashboard",
    "Las gráficas de cada dataset con los resultados del corte que se elija: la conformidad y el IGCD por corte, los fallos por dimensión y más.",
    ["dashboards"],
  ),
  concept(
    "hallazgo",
    "Un registro que falla una regla en un corte. Queda resuelto cuando un corte posterior ya no lo falla.",
    ["hallazgos"],
  ),
  concept(
    "cola de remediación",
    "Los hallazgos de un valor de un campo de agrupación, como una oficina, una región o un canal, con un ANS en días. El dashboard lista primero los grupos con más hallazgos abiertos, cada uno con su prioridad sumada.",
    ["colas de remediación"],
  ),
  concept(
    "worker",
    "Un programa que corre por su cuenta junto a la aplicación y hace el trabajo pesado: listar las tablas de una fuente, mapear una tabla, copiar un corte y evaluarlo. Mapear y tomar cortes necesitan al menos uno.",
    ["workers"],
  ),
  concept(
    "catálogo de reglas",
    "Donde Quality Data guarda el mapeo y las reglas de cada dataset, con su historial y la versión aprobada, main.",
  ),
  concept(
    "política",
    "Un conjunto de permisos que un administrador le da a una cuenta o a un grupo. El producto trae unas listas para los roles habituales, como quality-steward y quality-viewer.",
    ["políticas"],
  ),
  concept(
    "rastro de auditoría",
    "El registro de quién hizo qué y cuándo: cambios, ejecuciones y cada vista de los valores de una fuente. Se lee con la política auditor.",
    ["registro de auditoría"],
  ),
  concept(
    "datos personales",
    "Valores de una fuente sobre una persona. Se muestran completos solo a las políticas que permiten Ver datos personales, como quality-analyst; los demás los ven enmascarados, y cada vista completa queda en el rastro de auditoría.",
  ),
  concept(
    "cuenta de servicio",
    "Un token para que un script u otro sistema use Quality Data a nombre de su dueño; puede a lo sumo lo que puede su dueño.",
    ["cuentas de servicio"],
  ),
];

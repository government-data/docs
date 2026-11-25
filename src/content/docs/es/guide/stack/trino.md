---
title: Trino
description: El único motor SQL de la plataforma. Lee las bases de datos de la organización, escribe bronze, silver y gold en el lago, ejecuta las reglas de calidad y atiende las consultas de los dashboards.
sidebar:
  label: Trino
---

**Módulo:** `query-trino`. Ofrece la capacidad "consulta SQL" y necesita
la capacidad "lago".

## Qué hace

Trino es un motor de consultas SQL distribuido. En Government Data es **el
único motor** que toca los datos:

- **lee las fuentes**, las bases de datos de la organización, solo para
  lectura, y escribe cada corte en la capa **bronze** del lago;
- deriva **silver** aplicando el mapeo del dataset;
- **evalúa las reglas de calidad** sobre silver y escribe los resultados en
  **gold**;
- responde a los **dashboards**: [Superset](../superset/) lee gold a través
  de él, como la persona que está mirando.

Ser distribuido es lo que hace a Trino apto para grandes volúmenes. Un
coordinador planea cada consulta y la parte en tareas, y sus workers las
ejecutan en paralelo, cada uno sobre su parte de los datos; así una fuente
o una tabla grande del lago la leen varias máquinas a la vez y no una
sola. Una instalación que necesita más capacidad añade workers. La
[simulación](../simulation/) muestra dónde corre cada parte.

Trino nunca decide qué ejecutar. El [núcleo](../core/) escribe cada
sentencia, compilada a partir de las reglas, y la firma; los
[workers](../orchestrator/) envían esas sentencias a Trino. Mientras se
escribe una regla, sus ejemplos se revisan en el momento en el editor de
reglas, antes de que lleguen a Trino.

## Aislamiento

- **Un token por trabajo.** Cada trabajo llega a Trino con un token que el
  núcleo emite solo para ese trabajo, que dice qué dataset y qué tipo de
  trabajo es. Las reglas de acceso de Trino, que sirve el núcleo, le
  permiten a ese trabajo solo lo que necesita: las tablas de su propio
  dataset, su propia fuente.
- **Las contraseñas de las fuentes** viajan con el trabajo que las
  necesita y Trino nunca las guarda.
- **Solo salen conteos.** Un trabajo de calidad reporta nombres, conteos y
  duraciones, nunca los valores de un registro. Las muestras que se ven al
  probar una regla pasan por la aplicación, que revisa el permiso de la
  persona y escribe la vista en el log de auditoría.
- **Las personas solo leen gold.** Para los dashboards, Trino ofrece gold
  de solo lectura, con los filtros de filas de cada persona aplicados;
  bronze y silver son para los trabajos.
- Nunca se escribe a disco un volcado de memoria, porque podría contener
  registros.

## Cómo se comunica con el resto

| Con                                  | Cómo                                                                        |
| ------------------------------------ | --------------------------------------------------------------------------- |
| Workers, Superset                    | El protocolo de cliente de Trino por HTTPS, con un token por trabajo o por persona |
| Las bases de datos de la organización | El protocolo propio de cada motor (como SQL Server, Oracle, PostgreSQL o MySQL), solo lectura |
| El lago                              | S3 e Iceberg REST, a través de la puerta del lago, con TLS mutuo            |
| El núcleo                            | Lee del núcleo sus reglas de acceso                                         |

## Dimensionamiento

El **coordinador** corre en el servidor principal, dentro del
[orquestador](../orchestrator/), que lo corre y lo administra. Los
**workers** corren en máquinas propias: una instalación empieza con uno y
añade más para big data, sin mover datos, porque los workers no guardan
nada entre consultas. Un worker es el que más memoria necesita; como punto
de partida, unos 13 GB para Trino en cada worker, a dimensionar según los
datos de la instalación. La memoria se reparte entre los trabajos de calidad y las
consultas de los dashboards, para que unos no ahoguen a otros, y una
consulta demasiado grande para la memoria se apoya en un disco propio.
Antes de que Trino se reinicie por una actualización, el orquestador deja
terminar los trabajos en curso y retiene los nuevos.

## Dónde quedan sus datos

En ningún lugar propio: Trino no guarda datos entre consultas. Lo que
escribe va al lago; su disco de apoyo solo tiene archivos temporales
mientras corre una consulta.

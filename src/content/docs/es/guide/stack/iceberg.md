---
title: Apache Iceberg
description: El formato abierto de tablas del lago de datos, con su catálogo REST, y las tres capas bronze, silver y gold, donde gold guarda el registro de los resultados de calidad.
sidebar:
  label: Apache Iceberg
---

**Módulo:** `lake-rustfs` sirve el catálogo y guarda los archivos;
[Trino](../trino/) lee y escribe las tablas.

## Qué hace

Apache Iceberg es un formato abierto para tablas analíticas grandes
guardadas como archivos en un almacenamiento de objetos. Una tabla es un
conjunto de archivos de datos Parquet más metadatos que dicen qué archivos
forman cada versión de la tabla. Cada escritura crea una nueva
**instantánea** (snapshot), confirmada de una sola vez: quien lee ve la
tabla antes de la escritura o después, nunca a medias, y puede leer a
propósito una instantánea anterior.

El **catálogo REST de Iceberg** es el servicio que lista las tablas y
apunta a sus metadatos actuales. En Government Data lo sirve el propio
[RustFS](../rustfs/), por HTTPS detrás de la puerta del lago.

## Las tres capas

Cada instalación tiene un almacén en el lago, con tres capas:

| Capa       | Guarda                                                                    | La escriben                      |
| ---------- | ------------------------------------------------------------------------- | -------------------------------- |
| **Bronze** | Los datos de cada corte tal como se copiaron de la fuente                 | Los trabajos de extracción       |
| **Silver** | Los mismos datos con el mapeo del dataset aplicado                        | Los trabajos de derivación, desde bronze |
| **Gold**   | Los resultados de calidad: por regla, por campo, por grupo, los hallazgos y los datos que dibuja cada gráfica | Los trabajos de reglas, desde silver |

- **Bronze y silver solo crecen.** Una carga añade filas con su propio
  identificador; solo cuando todas las sentencias terminaron bien y los
  conteos cuadran, el núcleo la registra como la carga aceptada del corte.
  Desde entonces se lee exactamente esa carga, en esa instantánea, así que
  un corte siempre da los mismos resultados.
- **Gold es el registro oficial** de los resultados de calidad. Cada tabla
  lleva el dataset, el corte y la ejecución. Una nueva ejecución de un
  corte escribe sus filas, luego pasa a ellas en un solo commit, y luego
  borra las filas de la ejecución anterior; los dashboards leen vistas que
  siempre muestran una ejecución completa.
- **Sin valores de registros en gold**, salvo los valores de los campos de
  agrupación por los que se desglosan los indicadores, como una oficina o
  una región. Los hallazgos llevan hashes con llave de las llaves de los
  registros, no las llaves.

Bronze y silver guardan copias de los datos de las fuentes, que pueden
incluir datos personales. Nadie los lee directamente: solo los trabajos, a
través de Trino, con el acceso que les da su token.

## Cómo se comunica con el resto

| Con              | Cómo                                                             |
| ---------------- | ---------------------------------------------------------------- |
| Trino            | El protocolo REST de Iceberg para el catálogo; S3 para los archivos |
| Superset         | Nunca directamente: lee las vistas de gold a través de Trino     |
| El núcleo        | Nunca directamente: registra lo que reporta cada trabajo         |

## Dónde quedan sus datos

En el lago, sobre RustFS: los archivos de datos, los metadatos y el
catálogo. Los trabajos de mantenimiento compactan archivos pequeños y
quitan las cargas reemplazadas; las instantáneas viejas se conservan, así
que un corte pasado siempre se puede leer como era. La réplica del lago
guarda una copia de todo.

---
title: Apache Superset
description: La aplicación de analítica de la plataforma, que dibuja los indicadores de calidad a partir de las tablas gold del lago a través de Trino, como la persona que está mirando.
sidebar:
  label: Apache Superset
---

**Módulo:** `bi-superset`. Necesita la capacidad "consulta SQL", que
ofrece [Trino](../trino/).

## Qué hace

Apache Superset es una aplicación de código abierto para dashboards y
exploración de datos. En Government Data dibuja los **indicadores de
calidad**: el dashboard de cada dataset, sus gráficas y su evolución de un
corte a otro.

- El dashboard del dataset aparece **dentro de la propia página de la
  aplicación**, incrustado, así que las personas no salen de Quality Data
  para leerlo.
- Quien tenga una política que lo permita también puede abrir Superset
  directamente, desde el menú de aplicaciones, para explorar las tablas de
  gold en solo lectura.
- Los dashboards que trae la plataforma se reemplazan en cada
  actualización; un dashboard que alguien construye es suyo y se queda.

## De dónde salen los números

Superset **nunca lee los archivos del lago, su catálogo ni PostgreSQL**.
Lee las vistas de gold a través de Trino, **como la persona que está
mirando**: Trino aplica los filtros de filas de esa persona, así que cada
quien ve solo los datasets y grupos que su política permite. En el
dashboard incrustado, el núcleo emite un token de invitado de corta
duración para esa persona y ese dashboard.

Gold no guarda valores de registros, solo conteos, indicadores y los
valores de los campos de agrupación (ver [Apache Iceberg](../iceberg/)).

## Cómo se comunica con el resto

| Con                           | Cómo                                                                    |
| ----------------------------- | ----------------------------------------------------------------------- |
| Las personas                  | Sus pantallas a través de [Traefik](../traefik/); inicio de sesión en el núcleo por OpenID Connect |
| Las páginas de la aplicación  | Incrustado, con un token de invitado que emite el núcleo                |
| Trino                         | El protocolo de cliente de Trino por HTTPS, en nombre de la persona     |
| [Valkey](../valkey/)          | Su caché, en la red propia del módulo                                   |

Los roles de Superset salen de los permisos de la persona en el núcleo,
calculados en cada inicio de sesión, así que un cambio de política llega a
Superset en el siguiente.

## Dónde quedan sus datos

Superset guarda sus propios metadatos en una base de datos propia en
[PostgreSQL](../postgresql/): sus usuarios, roles, gráficas, dashboards,
consultas guardadas y su registro de acciones. **Ningún indicador se
guarda allí**: los números se quedan en gold. Los resultados de las
consultas se guardan en caché en Valkey por unos minutos. Quitar el módulo
conserva su base; solo una purga la borra, después de un respaldo.

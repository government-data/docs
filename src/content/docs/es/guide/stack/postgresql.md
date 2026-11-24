---
title: PostgreSQL
description: La base de datos relacional de la plataforma, donde el núcleo guarda cuentas, políticas, configuración, el log de auditoría y sus objetos de negocio, y donde los módulos reciben bases propias.
sidebar:
  label: PostgreSQL
---

**Módulo:** `quality-data` (el núcleo). Otros módulos reciben en él una
base de datos propia.

## Qué hace

PostgreSQL es la base de datos de la plataforma. El núcleo guarda en ella:

- cuentas, grupos, políticas y los proveedores de identidad;
- la configuración, y los secretos de la configuración, cifrados con una
  llave guardada aparte;
- fuentes, datasets, programaciones, cortes y colas de remediación;
- un **índice** de los resultados de calidad: los cortes, su estado y sus
  totales, que leen las pantallas y las colas de la aplicación. El
  registro de los resultados en sí está en las tablas gold del lago; si
  alguna vez difieren, gold manda y el índice se reconstruye a partir de
  él;
- el **log de auditoría**.

Los módulos que necesitan una base de datos relacional, como Grafana o
Superset, reciben **una base de datos y un usuario
propios** cuando se añaden. Un módulo no puede leer la base de otro.

## El log de auditoría

El log de auditoría registra quién hizo qué, cuándo y sobre qué: inicios
de sesión, cambios de accesos y de configuración, aprobaciones de reglas,
cada vista de datos personales con su motivo, exportaciones y ejecuciones
lanzadas a mano. Es **solo de adición**: la aplicación no puede cambiar ni
borrar una entrada, y cada entrada lleva un hash de la anterior, así que un
hueco o una edición se nota. Se puede consultar durante cinco años; los
meses más viejos se archivan en el lago. Los auditores lo leen en
[Grafana](../grafana/).

## Cómo se comunica con el resto

| Con                | Cómo                                                                   |
| ------------------ | ---------------------------------------------------------------------- |
| El núcleo          | SQL sobre TLS; el núcleo revisa el certificado y el nombre del servidor |
| Otros módulos      | Cada uno con su propio usuario, en su propia base                      |
| Grafana            | Un usuario de solo lectura, para los dashboards de auditoría           |

PostgreSQL no es alcanzable desde fuera del servidor del núcleo: no publica
ningún puerto, y solo los servicios que lo usan comparten su red.

## Dónde quedan sus datos

En un volumen en el servidor del núcleo. Sus bases son críticas: antes de
cada actualización se vuelcan y se verifica el volcado, y si eso no se
puede hacer, la actualización no sigue. Quitar un módulo conserva su base;
solo una purga la borra, después de un respaldo.

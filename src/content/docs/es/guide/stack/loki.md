---
title: Loki
description: El almacén de los logs técnicos de cada servicio de la instalación, guardados en el lago 90 días, sin datos personales.
sidebar:
  label: Loki
---

**Módulo:** `observability`.

## Qué hace

Grafana Loki es un almacén de logs de código abierto. En Government Data
guarda los **logs técnicos** de cada servicio en cada servidor de la
instalación, que recoge [Alloy](../alloy/) y muestra
[Grafana](../grafana/).

Los logs técnicos dicen qué pasó dentro de un proceso, para quien opera la
instalación. Cada servicio los escribe como JSON con los mismos campos:
hora, nivel, servicio, servidor, petición, ejecución y trabajo. Así una
sola búsqueda muestra cada línea de una ejecución, en todos los
servidores.

**Los logs técnicos no llevan datos personales.** Los valores leídos de
las fuentes, de las pruebas de reglas o de los hallazgos nunca se
registran: los errores nombran ids y nombres de campos, no valores, y una
segunda capa quita los campos sensibles conocidos. Quién vio qué datos
personales no es un log técnico: es el log de auditoría, en
[PostgreSQL](../postgresql/).

## Cómo se comunica con el resto

| Con         | Cómo                                                          |
| ----------- | ------------------------------------------------------------- |
| Alloy       | Alloy le envía a Loki los logs de cada servidor               |
| Grafana     | Grafana consulta a Loki, dentro del módulo de observabilidad  |
| El lago     | Loki guarda sus datos en un bucket propio, por S3             |

## Dónde quedan sus datos

En el lago ([RustFS](../rustfs/)), en un bucket propio, durante **90
días**. Como todo lo del lago, la réplica guarda una copia. Una
organización que tenga su propio sistema de logs también puede hacer que
Alloy le reenvíe los logs.

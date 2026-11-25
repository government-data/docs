---
title: Mimir
description: El almacén de las métricas de cada servidor y servicio de la instalación, guardadas en el lago y leídas por Grafana.
sidebar:
  label: Mimir
---

**Módulo:** `observability`.

## Qué hace

Grafana Mimir es un almacén de métricas de código abierto, compatible con
Prometheus. En Government Data guarda las **métricas** que
[Alloy](../alloy/) recoge en cada servidor, que [Grafana](../grafana/)
dibuja y sobre las que alerta:

- la CPU, la memoria, la carga, los discos, la red y el reloj de cada
  servidor;
- las métricas propias de cada servicio, como las peticiones de Traefik,
  la cola de trabajos y los ejecutores de jobs vivos.

Las métricas son números con unas pocas etiquetas, como el servidor, su
rol y el servicio. No llevan datos de las fuentes ni datos personales.

## Cómo se comunica con el resto

| Con       | Cómo                                                                                     |
| --------- | ---------------------------------------------------------------------------------------- |
| Alloy     | El Alloy de cada servidor le envía sus métricas, presentando el certificado del servidor (ver [TLS mutuo](../mtls/)) |
| Grafana   | Grafana las lee; solo el servidor del núcleo puede leer                                  |
| El lago   | Mimir guarda sus datos en un bucket propio, por S3                                       |

## Dónde quedan sus datos

En el lago ([RustFS](../rustfs/)), en un bucket propio; la réplica del
lago guarda una copia.

---
title: Alloy
description: El recolector en cada servidor de la instalación, que envía los logs de los servicios a Loki y las métricas del servidor y de los servicios a Mimir, con el menor acceso que funciona.
sidebar:
  label: Alloy
---

**Módulo:** `observability`. Corre uno en cada servidor de la instalación.

## Qué hace

Grafana Alloy es un recolector de logs y métricas de código abierto. En
Government Data, cada servidor corre su propio Alloy, que:

- lee los logs de cada servicio de ese servidor y los envía a
  [Loki](../loki/);
- lee las métricas del propio servidor, CPU, memoria, carga, discos, red,
  reloj y hora de arranque, y las envía a [Mimir](../mimir/);
- recoge las métricas que publican los servicios, como las de Traefik, y
  también las envía a Mimir.

El comando que añade un servidor a la instalación también configura su
Alloy, así que un servidor nuevo aparece en [Grafana](../grafana/) en
cuanto se une.

## El menor acceso que funciona

Alloy corre en un contenedor sin más acceso del que necesita: lee solo los
discos que vigila (el de Docker, el de la base de datos, los discos del
lago…), en solo lectura, y los contadores de red del servidor, no el resto
del servidor. Guarda una lista corta de métricas y descarta las demás, y
ninguna etiqueta lleva una ruta o un nombre que haya elegido una persona.

## Cómo se comunica con el resto

| Con                                    | Cómo                                                                  |
| -------------------------------------- | --------------------------------------------------------------------- |
| Loki, Mimir                            | Les envía por HTTPS con el certificado del servidor (ver [TLS mutuo](../mtls/)) |
| Las métricas de los servicios          | Las lee con el certificado del servidor                               |
| El sistema de logs propio de la organización | Opcionalmente, también puede reenviarle los logs, por syslog u OpenTelemetry |

## Dónde quedan sus datos

En ningún lugar propio, salvo un pequeño búfer: lo que recoge va a Loki y
a Mimir, en el lago.

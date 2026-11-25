---
title: Grafana
description: La aplicación de operación de la plataforma, con los logs técnicos, las métricas y alertas de los servidores, y los dashboards de auditoría.
sidebar:
  label: Grafana
---

**Módulo:** `observability`, con [Loki](../loki/), [Mimir](../mimir/) y
[Alloy](../alloy/). Necesita la capacidad "lago".

## Qué hace

Grafana es una aplicación de código abierto para dashboards y alertas. En
Government Data es para la **operación y la auditoría**, no para los
indicadores de calidad, que dibuja [Superset](../superset/):

- los **logs técnicos** de cada servicio, leídos de Loki, incluida cada
  línea de una ejecución en todos los servidores;
- las **métricas** de cada servidor y servicio, leídas de Mimir: CPU,
  memoria, discos, red, el reloj, la cola y los ejecutores de jobs;
- **alertas** cuando un servidor o un servicio necesita atención, enviadas
  por correo;
- los **dashboards de auditoría**: quién hizo qué, cada vista de datos
  personales con su motivo, y las ejecuciones. Ver [Datos personales y el
  rastro de auditoría](../../personal-data-and-audit/).

Los dashboards vienen con la instalación y se actualizan con ella.

## Quién entra

Grafana es cliente del inicio de sesión del núcleo: las personas lo abren
desde el menú de la aplicación y entran con su propia cuenta. Su rol en
Grafana sale de su política: `auditor` lee los dashboards de auditoría, y
`quality-admin` y los Administradores administran Grafana. A nadie más se
le deja entrar.

## Cómo se comunica con el resto

| Con                          | Cómo                                                                    |
| ---------------------------- | ----------------------------------------------------------------------- |
| Las personas                 | Sus pantallas a través de [Traefik](../traefik/); inicio de sesión en el núcleo por OpenID Connect |
| Loki, Mimir                  | Sus API de consulta, dentro del módulo de observabilidad                |
| [PostgreSQL](../postgresql/) | Un usuario de solo lectura, para el log de auditoría; nunca lo escribe  |
| El correo                    | El servidor de correo de la organización, para las alertas              |

## Dónde quedan sus datos

Grafana guarda su propia configuración, usuarios y estado de alertas en
una base de datos propia en PostgreSQL. Los logs y las métricas que
muestra son los de Loki y Mimir, en el lago; el log de auditoría es del
núcleo.

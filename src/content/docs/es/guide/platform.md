---
title: Government Data
description: La plataforma Government Data, sus aplicaciones y módulos, cómo se arma y se mantiene al día una instalación, y a dónde ir después según quién lee.
sidebar:
  label: Government Data
---

**Government Data es una plataforma para los datos de una organización**,
instalada en servidores que la organización controla. Reúne las
aplicaciones que miden, procesan y muestran esos datos, con un solo inicio
de sesión, un solo conjunto de permisos, un solo rastro de auditoría y un
solo lago de datos. Esta guía cubre la plataforma y cada una de sus
aplicaciones.

## Sus aplicaciones y módulos

| Aplicación o módulo  | Para qué sirve                                                                                                 | Guía                                          |
| -------------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| **Quality Data**     | Calidad de datos: reglas que escribe quien conoce los datos, cortes que la miden, indicadores y colas de remediación | [Introducción a Quality Data](../overview/)   |
| **El orquestador**   | Programa y sigue los trabajos de la plataforma; sus workers los ejecutan                                       | [Orquestador y workers](../stack/orchestrator/) |
| **Analítica**        | Dashboards de los indicadores, con Apache Superset                                                             | [Apache Superset](../stack/superset/)         |
| **El lago de datos** | Donde la plataforma guarda sus copias de los datos y sus resultados, como tablas abiertas                      | [RustFS](../stack/rustfs/), [Apache Iceberg](../stack/iceberg/) |
| **La guía de usuario** | Estas páginas, servidas dentro de cada instalación y publicadas también abiertamente                         | Esta guía                                     |

Debajo de ellas está el **núcleo** de la plataforma: el inicio de sesión
de cada aplicación, los permisos, el rastro de auditoría, la
configuración, las máquinas de la instalación y sus certificados. Su
paquete se llama Quality Data, por la aplicación que lleva.

## Una instalación, una organización

Una instalación es el conjunto de servidores donde una organización corre
Government Data. Sirve solo a esa organización, y ningún dato sale de ella
salvo lo que la propia organización exporte. Cada aplicación es un
**módulo**: se puede añadir, y quitar sin perder sus datos.

Las instalaciones **traen** sus actualizaciones: el agente de cada
instalación busca versiones firmadas, verifica la firma, respalda y las
aplica. Nada entra a una instalación desde fuera.

## Cómo encaja todo

Las personas entran a cada aplicación por una sola puerta e inician sesión
una vez, en el núcleo. El orquestador programa los trabajos; Trino, el
único motor SQL, lee las bases de datos de la organización y escribe el
lago; los dashboards leen los resultados del lago a través de Trino. El
[diagrama de arquitectura](../stack/overview/#arquitectura) lo dibuja
completo, la [simulación](../stack/simulation/) lo muestra en marcha paso
a paso, y cada parte tiene su propia página en el [Stack
tecnológico](../stack/overview/).

## A dónde ir después

- **Para usar Quality Data:** empieza por la [Introducción a Quality
  Data](../overview/) y sus [Conceptos](../concepts/).
- **Para operar una instalación:** [Primeros pasos:
  administrador](../start-admin/), y luego [Correo, inicio de sesión y
  actualizaciones](../administer-the-installation/).
- **Para revisar la arquitectura:** el [Stack
  tecnológico](../stack/overview/), una página por tecnología.
- **En papel:** [Descargar PDF](../../print/) reúne toda la guía en una
  sola página.

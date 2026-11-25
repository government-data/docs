---
title: El núcleo de la plataforma (Quality Data)
description: El núcleo de Government Data, cuyo paquete es Quality Data, escrita en Rust con una aplicación web en SolidJS, dueña de los objetos de calidad, que compila cada trabajo y lleva el inicio de sesión, los permisos y la auditoría.
sidebar:
  label: Núcleo de la plataforma
---

**Módulo:** `quality-data`. Toda instalación lo tiene; todos los demás
módulos lo necesitan.

## Qué hace

El núcleo es la base de la plataforma Government Data. Su paquete se llama
Quality Data, por la aplicación de calidad de datos que lleva, que es
dueña de los objetos de negocio de la calidad de datos: fuentes, datasets y sus mapeos, las
reglas y su historial, programaciones, cortes y las colas de remediación.
Alrededor de ellos lleva lo que comparte toda la plataforma:

- el **inicio de sesión** de cada módulo (ver [Identidad](../identity/));
- los **permisos**: un solo conjunto de políticas para toda la plataforma,
  que cada módulo consulta antes de actuar;
- la **auditoría**: quién hizo qué, cuándo y sobre qué, incluida cada vista
  de datos personales;
- la **configuración** que comparten todos los módulos, como el dominio, el
  correo y la zona horaria;
- las **máquinas**: qué servidores pertenecen a la instalación, y sus
  certificados (ver [TLS mutuo](../mtls/)).

El núcleo **escribe cada sentencia SQL** que ejecuta un trabajo de
calidad. Cuando toca un corte, compila las reglas de la línea principal del
catálogo en sentencias para [Trino](../trino/), firma el paquete y lo
registra. Nunca ejecuta un trabajo por sí mismo: el
[orquestador](../orchestrator/) programa los trabajos, y sus ejecutores de
jobs envían las sentencias firmadas a Trino.

## Cómo está hecho

- El **servidor** está escrito en Rust. Sirve la API HTTP de la aplicación
  y la API interna que llaman los otros módulos y las máquinas.
- La **aplicación web** es una aplicación de una sola página escrita en
  SolidJS y construida con Vite, servida como archivos estáticos por nginx.
- Un **agente de nodo**, de la misma imagen, mantiene renovado el
  certificado de máquina del servidor.

## Cómo se comunica con el resto

| Con                          | Cómo                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------------------- |
| Las personas                 | HTTPS a través de [Traefik](../traefik/), con una sesión después de entrar                  |
| Otros módulos, máquinas      | HTTPS en la entrada interna de Traefik, cada lado con un certificado de la instalación      |
| [PostgreSQL](../postgresql/) | SQL sobre TLS, verificando el certificado del servidor                                      |
| [Dolt](../dolt/)             | El protocolo de Dolt, compatible con MySQL, sobre TLS, con certificado de cliente           |
| El lago                      | A través del servicio de administración del módulo del lago, para crear el almacén de la instalación |

## Dónde quedan sus datos

- **PostgreSQL**: cuentas, políticas, configuración, el log de auditoría,
  el índice de trabajos y todos los objetos de negocio menos las reglas.
- **Dolt**: las reglas y los mapeos, con su historial.
- **Archivos junto al módulo**: la autoridad certificadora de la
  instalación y los secretos que leen los contenedores, nunca en la base de
  datos ni en una variable de entorno.

Las tres cosas se respaldan, y se verifica el respaldo, antes de cada
actualización.

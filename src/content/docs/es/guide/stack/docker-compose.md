---
title: Docker Compose
description: Cómo corre cada módulo de una instalación, como contenedores descritos por un archivo Compose por módulo, que el agente de la instalación arranca y actualiza.
sidebar:
  label: Docker Compose
---

**Módulo:** todos. Cada módulo es un proyecto de Compose propio.

## Qué hace

Cada parte de Quality Data corre como un contenedor. Cada módulo trae un
archivo Compose que dice qué contenedores corre, de qué imágenes, en qué
redes y con qué volúmenes. El agente de la instalación, [`qd`](../agent/),
ejecuta Docker Compose con ese archivo para arrancar, actualizar o detener
el módulo. Nadie edita estos archivos a mano: vienen dentro del paquete del
módulo, que el índice de versiones firmado fija.

## Cómo se usa

- **Imágenes por digest.** El archivo Compose de un módulo no nombra
  ninguna imagen por sí mismo: el agente le pasa cada imagen por su digest,
  tal como la lista el índice firmado, así que los contenedores corren
  exactamente los bytes que se publicaron.
- **Una red por módulo.** Los contenedores de cada módulo comparten una red
  propia. Solo [Traefik](../traefik/) se une a la red de cada módulo, así
  que un módulo llega a otro solo a través de Traefik, nunca directamente.
- **Contenedores restringidos.** Donde el software lo permite, los
  contenedores corren con un usuario sin privilegios, con el sistema de
  archivos de solo lectura, sin capacidades de Linux y sin forma de ganar
  privilegios.
- **Secretos como archivos.** Las contraseñas y llaves se montan como
  archivos que solo puede leer el usuario del contenedor; nunca están en una
  imagen, en el archivo Compose ni en su archivo de entorno.
- **Salud.** Cada módulo declara cuáles de sus contenedores deben estar
  corriendo y sanos, y los comandos que lo prueban. Una actualización los
  espera; si no arrancan, vuelve a la versión anterior.

## Dónde quedan sus datos

En volúmenes de Docker en cada servidor, uno por cada dato, cada uno
nombrado en el manifiesto del módulo. Un volumen marcado como crítico se
respalda, y se verifica el respaldo, antes de cada actualización. Quitar un
módulo detiene sus contenedores y conserva sus volúmenes; solo una purga
explícita los borra, después de un respaldo.

## Para el administrador

Cada servidor necesita Docker Engine con el complemento de Compose. Todo lo
demás viene con los módulos: no instales tú mismo en el servidor los
componentes de la plataforma.

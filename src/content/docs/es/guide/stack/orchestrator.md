---
title: El orquestador y sus workers
description: El operador que dispara las programaciones y sigue cada trabajo, y los workers, aparte de él, que envían a Trino el SQL firmado por el núcleo y reportan conteos.
sidebar:
  label: Orquestador y workers
---

**Módulo:** `orchestrator`. Necesita la capacidad "consulta SQL", que
ofrece [Trino](../trino/).

## Quién hace qué

Ejecutar un corte de calidad se reparte en tres papeles, cada uno con una
sola tarea:

| Parte             | Hace                                                                                       | Nunca hace                                  |
| ----------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------- |
| **El núcleo**     | Es dueño de las reglas y las programaciones, compila y firma cada sentencia, entrega los secretos de cada trabajo, registra los resultados | Ejecutar un trabajo o hablar con Trino |
| **El operador**   | Dispara las programaciones, lleva el estado de cada trabajo, reintenta con espera creciente, cuida que un solo trabajo escriba una tabla a la vez | Leer o cambiar una sentencia, ver un secreto |
| **Los workers**   | Toman un trabajo, traen sus sentencias firmadas, verifican la firma, envían cada sentencia a Trino, reportan conteos | Escribir SQL, guardar estado, leer valores |

El **operador** es el servicio del orquestador. Los **workers** son una
pieza desplegable aparte: no guardan estado, así que una instalación añade
o quita workers, en uno o varios servidores, sin tocar el resto.

## Un corte, paso a paso

1. El operador dispara el corte según su programación, o cuando alguien lo
   lanza.
2. El núcleo compila las sentencias a partir de las reglas de la línea
   principal del catálogo, las firma y registra el paquete.
3. Un worker toma el trabajo y trae del núcleo el paquete y los secretos
   del trabajo. **Una sentencia que no esté en un paquete verificado nunca
   se ejecuta.**
4. El worker envía cada sentencia a Trino con el token del trabajo, revisa
   que cada respuesta tenga la forma esperada y registra su avance, así que
   un reintento sigue donde se detuvo.
5. El worker le reporta al núcleo nombres, conteos, duraciones y los
   identificadores de las instantáneas del lago. El corte corre como tres
   trabajos en cadena: extracción a bronze, derivación a silver,
   evaluación hacia gold.

Si un worker se detiene, el préstamo de su trabajo vence y otro worker lo
toma; antes se cancela la consulta del intento anterior, así que dos
intentos nunca escriben el mismo corte.

## Cómo se comunica con el resto

| Con             | Cómo                                                                          |
| --------------- | ----------------------------------------------------------------------------- |
| El núcleo       | HTTPS en la entrada interna de Traefik, con TLS mutuo                         |
| Trino           | El protocolo de cliente de Trino, con un token que vale para un trabajo       |

Antes de una actualización, el núcleo le pregunta al orquestador cuánto
trabajo está corriendo y cuánto está por empezar, y la actualización lo
espera. Mientras Trino se reinicia, el operador retiene los trabajos que lo
necesitan y deja terminar los que corren.

## Dónde quedan sus datos

El operador guarda el estado, los préstamos y los intentos de los
trabajos. Los workers no guardan nada.

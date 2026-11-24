---
title: El agente de la instalación (qd)
description: El programa en el servidor de la instalación que instala y actualiza cada módulo a partir de versiones firmadas, respaldando primero y volviendo atrás por sí solo si una actualización falla.
sidebar:
  label: El agente (qd)
---

**Dónde corre:** en el servidor del núcleo, como un servicio del sistema,
fuera de los contenedores que maneja.

## Qué hace

`qd` es el agente de la instalación. Instala, configura y actualiza la
plataforma y sus módulos, y nada más puede cambiarlos:

- **enrolar**: cuando se monta la instalación, crea la llave privada
  propia de la instalación, que nunca sale del servidor, y una solicitud de
  certificado. Una vez firmada esa solicitud, el certificado es la
  identidad de la instalación ante las versiones publicadas en AWS (ver
  [Actualizaciones desde AWS](../aws/)).
- **instalar** la plataforma por primera vez.
- **revisar** y **actualizar**: lee el índice de versiones firmado y,
  cuando a esta instalación le toca una versión nueva, la aplica.
- **añadir** y **quitar** módulos, a partir de sus manifiestos.

## Cómo va una actualización

1. El agente lee el **índice firmado** y verifica su firma con la llave
   pública que lleva. Un índice que no pasa la verificación se ignora.
2. Descarga el paquete de cada módulo y verifica su huella contra el
   índice, y trae las imágenes por su digest.
3. Le pregunta al núcleo cuánto trabajo está corriendo o por empezar, y lo
   espera, dentro del límite fijado en **Configuración**,
   **Actualizaciones**.
4. **Respalda** cada dato crítico, bases de datos, volúmenes y llaves, y
   **verifica el respaldo**. Si un dato crítico no se puede respaldar, no
   hay actualización.
5. Aplica la nueva versión **por pasos**. Antes de cada paso anota dónde
   va, así que tras un corte de luz sigue donde quedó, y cada paso puede
   correr dos veces.
6. Revisa la salud de cada módulo. Si la nueva versión no arranca, **vuelve**
   a la anterior por sí solo.
7. Escribe un **informe** corto: versiones, pasos, duraciones y errores,
   nunca datos de la organización.

Cuándo se instalan las actualizaciones, con aprobación, automáticamente
dentro de una ventana o a mano en el servidor, se elige en la aplicación,
como se describe en [Correo, inicio de sesión y
actualizaciones](../../administer-the-installation/#para-instalar-actualizaciones).

## Cómo se comunica con el resto

| Con           | Cómo                                                                                      |
| ------------- | ----------------------------------------------------------------------------------------- |
| AWS           | Solo HTTPS de salida, con credenciales de corta duración obtenidas con su certificado; nada entra |
| El núcleo     | La entrada interna de Traefik, con TLS mutuo                                              |
| Los módulos   | Docker Compose, en el mismo servidor                                                      |

## `qsdk`, la herramienta de quien publica

`qsdk` es una línea de comandos aparte, para quien publica versiones y
maneja los enrolamientos: firma la solicitud de enrolamiento de una
instalación, revoca una instalación y publica un módulo. **Nunca corre en
el servidor de una instalación.**

## Dónde quedan sus datos

En su propio directorio en el servidor: la llave y el certificado de la
instalación, el estado de la actualización en curso, los paquetes y los
respaldos tomados antes de cada actualización.

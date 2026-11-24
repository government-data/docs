---
title: Traefik
description: La única puerta de entrada de una instalación, para personas y para máquinas, que enruta cada petición a su módulo y antes revisa la sesión o el certificado.
sidebar:
  label: Traefik
---

**Módulo:** `quality-data` (el núcleo).

## Qué hace

Traefik es la única puerta de la instalación. Cada petición, desde el
navegador de una persona o desde otro servidor de la instalación, pasa por
él, y él la envía al módulo que la atiende. Ningún otro contenedor es
alcanzable desde fuera de su propio servidor.

Tiene dos entradas:

- **La entrada web**, por HTTPS, para las personas. Sirve la aplicación, la
  guía y las pantallas de cada módulo, cada una bajo su propia ruta.
- **La entrada interna**, para los servidores y módulos de la propia
  instalación. Solo acepta conexiones que presenten un certificado firmado
  por la autoridad certificadora de la instalación (ver [TLS
  mutuo](../mtls/)).

## Las rutas vienen de los módulos

El manifiesto de cada módulo declara su ruta: su camino, el servicio y cómo
entran las personas. Cuando se añade un módulo, el agente escribe esa ruta
para Traefik; cuando se quita, la ruta se va. Durante una actualización, la
ruta de un módulo muestra una página de mantenimiento.

Traefik **autentica; nunca autoriza**. Para un módulo que no tiene inicio
de sesión propio, como esta guía, Traefik primero le pregunta al núcleo si
la petición trae una sesión válida (autenticación delegada) y, si no, envía
a la persona a iniciar sesión. Lo que una persona puede hacer dentro de un
módulo lo decide ese módulo, según las políticas de la plataforma.

## Cómo se comunica con el resto

| Con                              | Cómo                                                                       |
| -------------------------------- | -------------------------------------------------------------------------- |
| Las personas                     | HTTPS en la entrada web; HTTP plano solo redirige a HTTPS                  |
| Cada módulo                      | Por la red propia de ese módulo; Traefik es el único contenedor en todas   |
| El núcleo                        | Le pide revisar las sesiones, y le pasa los certificados de las máquinas   |
| Los servidores de la instalación | TLS mutuo en la entrada interna                                            |

## Certificados

El certificado de la entrada web es el de tu organización, instalado como
archivo, o uno que Traefik obtiene y renueva por sí mismo de Let's Encrypt.
La entrada interna usa un certificado de la autoridad propia de la
instalación, que se renueva solo.

## Dónde quedan sus datos

Su configuración viene con el paquete del núcleo y de las rutas que escribe
el agente. Un certificado obtenido de Let's Encrypt se guarda en un volumen
que no es crítico: si se pierde, se obtiene de nuevo.

## Para el administrador

- Las personas necesitan llegar al **puerto 443** (HTTPS) del servidor
  donde corre el núcleo. El **puerto 80** solo hace falta para redirigir a
  HTTPS y, si usas Let's Encrypt, para su verificación.
- La entrada interna debe ser alcanzable **solo desde los servidores de la
  propia instalación**, nunca desde internet ni desde el resto de la red.
  Quien da soporte a tu instalación te dice su puerto cuando se añade un
  segundo servidor.

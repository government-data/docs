---
title: TLS mutuo y la autoridad certificadora de la instalación
description: Cada servidor y servicio de una instalación prueba quién es con un certificado de corta duración de la autoridad propia de la instalación, renovado sin intervención.
sidebar:
  label: TLS mutuo
---

**Módulo:** `quality-data` (el núcleo), y cada servidor que se une a la
instalación.

## Qué hace

Dentro de una instalación, los servicios no confían unos en otros por el
lugar de donde viene una conexión. Confían en un **certificado**. Cada
instalación tiene su propia **autoridad certificadora** (CA), creada al
instalarla, y cada servidor y servicio que habla con otro presenta un
certificado firmado por ella. Los dos extremos revisan el certificado del
otro: esto es **TLS mutuo** (mTLS).

- La CA es solo de la instalación. No se comparte con ninguna otra
  instalación, y nada fuera de la instalación necesita confiar en ella.
- **Los certificados de máquina duran poco**: cada uno dura alrededor de un
  día. Un pequeño agente de nodo en cada servidor renueva su certificado
  varias veces al día, y los servicios toman el nuevo sin reiniciarse.
- Un certificado nombra el servidor y su **rol** (el servidor del núcleo,
  un worker, un nodo del lago, la réplica…). Un servicio solo acepta los
  roles que deben llegar a él.

## Cómo se une un servidor

1. Un administrador pide un comando para el rol del nuevo servidor, en
   **Configuración**, **Ejecución**, **Añadir una máquina** (ver [Correo,
   inicio de sesión y
   actualizaciones](../../administer-the-installation/#para-añadir-una-máquina)).
   El comando lleva un token de unión que sirve **una vez, dentro de una
   hora**.
2. Quien da soporte a la instalación lo ejecuta en el nuevo servidor. El
   servidor crea su propia llave privada, que nunca sale de él, y pide un
   certificado con el token.
3. El servidor aparece como **Pendiente de aprobación** y no recibe trabajo
   hasta que un administrador lo aprueba. Desde entonces su agente de nodo
   renueva su certificado por sí solo.

**Retirar** saca a un servidor: no recibe un certificado nuevo, así que ya
no puede llegar al resto.

## Dónde se usa

| Conexión                                                         | Qué se revisa                                         |
| ---------------------------------------------------------------- | ----------------------------------------------------- |
| Un servidor o módulo a la entrada interna de Traefik             | Su certificado, con la CA de la instalación           |
| El núcleo a [PostgreSQL](../postgresql/) y a [Dolt](../dolt/)    | El certificado de cada lado                           |
| Cualquiera al lago ([RustFS](../rustfs/))                        | El certificado de quien llama, en la puerta del lago  |
| El coordinador de Trino al lago y a sus reglas                   | Su certificado, desde un proxy local que lo renueva sin reiniciar Trino |

## Dónde quedan sus datos

La llave y el certificado de la CA son archivos junto al módulo del
núcleo, en el servidor del núcleo, legibles solo por los servicios que
firman y revisan certificados. Son críticos: se respaldan, y se verifica el
respaldo, antes de cada actualización. Cada servidor guarda su propia llave
y su certificado en el directorio de su agente de nodo.

Esta autoridad certificadora es propia de la instalación. El certificado
con el que una instalación trae sus actualizaciones es otro, descrito en
[Actualizaciones desde AWS](../aws/).

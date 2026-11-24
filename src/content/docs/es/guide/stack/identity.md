---
title: Identidad e inicio de sesión (OpenID Connect)
description: El núcleo es el proveedor de identidad de la instalación, por OpenID Connect, para las personas y para cada módulo; puede delegar en el directorio de la empresa o en un proveedor externo.
sidebar:
  label: Identidad (OpenID Connect)
---

**Módulo:** `quality-data` (el núcleo).

## Qué hace

Las personas inician sesión **una vez, en el núcleo**, y entran a cada
módulo con esa sesión. El núcleo es un proveedor de identidad que habla
**OpenID Connect** (OIDC), el protocolo estándar de inicio de sesión
construido sobre OAuth 2.0. Cada módulo con pantallas propias, como Grafana
o Superset, es un cliente suyo: envía a la persona al núcleo para iniciar
sesión y recibe quién es y qué roles tiene allí.

Las cuentas son del núcleo. Una persona puede entrar con:

- una **cuenta local** y su contraseña;
- el **directorio** de la organización, por LDAP, como Active Directory;
- un **proveedor externo** que hable OIDC, como Microsoft Entra ID o
  Google, vinculado a una cuenta existente.

Cómo configurarlos está en [Correo, inicio de sesión y
actualizaciones](../../administer-the-installation/).

## Los permisos viajan con la persona

- Un módulo con inicio de sesión propio recibe los roles de la persona en
  sus tokens, calculados a partir de las políticas de la plataforma, por
  ejemplo si una persona es lectora o administradora en Grafana.
- Cuando un módulo llama a otro **en nombre de una persona**, la llamada
  lleva a esa persona: solo se permite si tanto la persona como el módulo
  que llama pueden hacerlo.
- Las máquinas y servicios que llaman al núcleo por su cuenta reciben
  tokens propios de corta duración, limitados a lo que su módulo declara
  que usa.
- Un trabajo de calidad recibe un token que vale **solo para ese
  trabajo**, que [Trino](../trino/) revisa antes de ejecutar sus
  sentencias.

## Cómo se comunica con el resto

| Con                | Cómo                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------ |
| Las personas       | Las páginas de inicio de sesión, a través de [Traefik](../traefik/), por HTTPS             |
| Los módulos        | OpenID Connect y OAuth 2.0: inicio de sesión, tokens e intercambio de tokens en nombre de una persona |
| El directorio      | LDAP, con una cuenta de servicio que pueda leerlo                                          |
| Proveedor externo  | OpenID Connect, con el cliente registrado en el proveedor                                  |

## Dónde quedan sus datos

Las cuentas, grupos, políticas, proveedores vinculados y clientes de los
módulos están en la base de datos del núcleo, [PostgreSQL](../postgresql/).
Las contraseñas se guardan solo como hashes con sal. Cada inicio y cierre
de sesión, y cada cambio de accesos, se escribe en el log de auditoría.

---
title: Dolt
description: La base de datos versionada que guarda el catálogo de reglas, con borradores, aprobaciones a main y el historial completo de cada regla y cada mapeo.
sidebar:
  label: Dolt
---

**Módulo:** `quality-data` (el núcleo).

## Qué hace

Dolt es una base de datos SQL con control de versiones incorporado:
ramas, commits, merges y diferencias, como en Git, pero sobre tablas.
Quality Data guarda en ella su **catálogo de reglas**: cada regla y el
mapeo de cada dataset.

Lo que las personas ven en la aplicación es el versionado de Dolt:

- un **borrador** es una rama propia, donde una regla se escribe y se
  prueba sin contar;
- **main** es la línea aprobada: solo se evalúan las reglas de main;
- **aprobar** un borrador lo une a main, como un commit más;
- el **historial** de una regla es la lista de commits que la tocaron, con
  quién hizo cada uno y cuándo; volver atrás o deshacer es un commit nuevo
  encima, así que nada de main se borra nunca.

Cada ejecución de calidad registra el commit del catálogo con que se
compiló, así que un corte siempre se puede rastrear hasta las reglas
exactas que lo produjeron. Ver [Llevar un cambio a
main](../../rules-to-main/) y [Ver el historial de una regla y deshacer un
cambio](../../rule-history/).

## Cómo se comunica con el resto

Solo el servidor del núcleo habla con Dolt, por el protocolo de Dolt
compatible con MySQL, en una red que los dos no comparten con nadie más. La
conexión usa TLS con un certificado de cliente de la instalación (ver [TLS
mutuo](../mtls/)) y una contraseña. Dolt no publica ningún puerto.

Las demás partes de la plataforma nunca leen el catálogo: el núcleo
compila las reglas en SQL y entrega eso.

## Dónde quedan sus datos

En un volumen en el servidor del núcleo, con sus bases, usuarios y
permisos. Es crítico: se respalda, y se verifica el respaldo, antes de cada
actualización. Además, los respaldos propios de Dolt se copian al lago
según una programación. Sus dos contraseñas se generan al instalar y se
guardan como archivos, nunca en el repositorio ni en el entorno.

Dolt tiene una versión compatible con PostgreSQL, Doltgres. Podría
considerarse en el futuro; nada del catálogo depende de esa elección.

---
title: Valkey
description: El almacén en memoria que guarda en caché los resultados de las consultas de Superset por unos minutos; es solo de Superset y nunca lleva los eventos de la plataforma.
sidebar:
  label: Valkey
---

**Módulo:** `bi-superset`, junto a [Apache Superset](../superset/).

## Qué hace

Valkey es un almacén de llave y valor en memoria, de código abierto, bajo
la licencia BSD, que habla el mismo protocolo que Redis. En Government
Data es **la caché de Superset**:

- guarda por unos minutos los resultados de las consultas de los
  dashboards, así que un dashboard que muchas personas abren a la vez le
  pregunta a Trino una sola vez;
- lleva los límites de frecuencia de Superset.

Valkey no es un intermediario de mensajes para la plataforma. Los módulos
de la plataforma se cuentan lo que pasó a través del núcleo, nunca a
través de Valkey.

## Cómo se comunica con el resto

Solo Superset habla con Valkey, en la red propia del módulo, con una
contraseña que se genera al instalar y se guarda como archivo. Valkey no
publica ningún puerto y nada más puede llegar a él.

## Dónde quedan sus datos

En memoria, y en un volumen del módulo. Lo que guarda se puede perder sin
daño: es una caché, que se vuelve a llenar desde Trino. Quitar el módulo
conserva el volumen; solo una purga lo borra.

---
title: "Tareas: conectar una fuente"
description: Qué bases de datos lee Quality Data, qué pedirle al administrador de la base y cómo agregar, comprobar, editar y quitar una fuente.
sidebar:
  label: Conectar una fuente
  order: 2.1
---

**Quién lo hace:** un responsable de datos, con la política
`quality-steward`. Quien tiene `quality-analyst` o `auditor` ve las fuentes y
sus tablas, pero no puede cambiarlas. La primera vez está en
[Primeros pasos: responsable de datos](../start-steward/#1-agregar-la-fuente);
esta página lo cuenta completo.

## Qué bases de datos se pueden conectar

Hoy una fuente puede ser una base **PostgreSQL**, **MySQL** o **SQL
Server**. Quality Data lee tablas; las hojas de cálculo y los archivos
todavía no pueden ser fuente.

La lista **Motor** del formulario también muestra `oracle` y `openedge`.
Aún no están listos: hoy no se puede leer una fuente de ninguno de los dos.

## Qué pedirle al administrador de la base de datos

- El nombre o la dirección del **servidor**, y su **puerto** si no es el de
  siempre (5432 en PostgreSQL, 3306 en MySQL, 1433 en SQL Server).
- El nombre de la **base de datos**.
- Un **usuario y una contraseña** que puedan leer las tablas que quieres
  medir. Pide un usuario de solo lectura: Quality Data nunca escribe, pero
  un usuario que no puede escribir lo garantiza.
- Que la base acepte conexiones desde los servidores donde corre Quality
  Data, incluidos sus workers, que son los que se conectan.
- En SQL Server, los ajustes de conexión adicionales que pida el servidor,
  como la forma de cifrar la conexión; van en **Opciones**.

Cada corte lee completa la tabla que mide, así que una tabla grande pesa
más: acuerda con el administrador una hora tranquila para los cortes
programados.

## Qué hace Quality Data con una fuente

**Lee**, y solo cuando se le pide:

- la lista de esquemas, tablas y columnas, con sus tipos, al guardar la
  fuente y cada vez que alguien la vuelve a listar;
- una muestra de una tabla al mapearla, de la que guarda conteos, nunca
  valores;
- la tabla completa en cada corte, copiada a su propio almacenamiento, el
  lago;
- una página de registros cuando alguien abre los **Registros** de una
  tabla.

**Nunca** escribe, cambia ni borra nada en la fuente. Quitar una fuente o un
dataset en Quality Data deja la base como estaba.

## Cómo se guardan las credenciales

El usuario y la contraseña se guardan sellados (cifrados) en la base de
datos propia de Quality Data. Nadie los vuelve a ver, ni siquiera un
administrador: al editar la fuente aparecen vacíos. Nunca salen en registros
técnicos ni en avisos. Un worker los recibe solo para el trabajo que los
necesita.

Cuando cambias la contraseña, la anterior también se conserva: si la fuente
todavía rechaza la nueva, un corte prueba con la anterior. Así el
administrador de la base puede cambiar la contraseña sin detener las
mediciones ni un momento. Cada cambio de credenciales queda en el rastro
de auditoría, nunca su valor.

## Para agregar una fuente

1. En el **Explorador**, en la barra lateral, elige **+** junto a
   **Fuentes** (**Nueva fuente**).
2. Escribe un **Nombre**: minúsculas, números y `_`, empezando por una
   letra, como `customers_db`. Después no se puede cambiar.
3. En **Motor**, elige la opción que empieza por `postgres`, `mysql` o
   `sqlserver`.
4. Llena **Servidor**, **Base de datos**, **Usuario** y **Contraseña**, y
   **Puerto** si no es el de siempre. Los campos con `*` son obligatorios;
   el formulario dice cuáles faltan.
5. Elige **Guardar**.

**Deberías ver** la fuente en el Explorador, bajo **Fuentes**. Ábrela:
Quality Data se conecta de una vez y lista sus tablas. La fuente muestra su
base de datos, luego sus esquemas y tablas, y una línea que dice cuántas
tablas leyó y cuándo.

## Para comprobar la conexión

No hay un botón aparte para probar: listar las tablas es la prueba. Abre la
fuente en el Explorador y elige **Volver a listar**. La línea bajo la fuente
pasa por **Conectando con la fuente…**, **Revisando los esquemas…**,
**Leyendo las columnas…** y **Cargando las tablas…**, y luego dice cuántas
tablas leyó y cuándo.

Si el listado no logra conectarse, lo vuelve a intentar solo, tres veces en
total, y lo dice (_Reintentando, intento 2 de 3…_). Tras el último intento
muestra el motivo: ver [Problemas](#problemas).

Abre una tabla para ver sus columnas y sus tipos. Una tabla que todavía no
lee ningún dataset aparece marcada **sin leer**, y una que desapareció de la
fuente, **ya no está**. Para encontrar una tabla entre muchas, escribe parte
de su nombre en **Filtrar por esquema, tabla o columna**.

## Para ver los registros de una tabla

Elige **Registros** junto a una tabla. Escoge qué **Leer** (los primeros o
los últimos 1000, o todos de a 1000) y, si quieres, una columna para
**Ordenar por**, y elige **Leer**. Los registros vienen directo de la
fuente, tal como están ahora, todos los valores enmascarados. Con permiso
para ver datos personales, **Mostrar valores** los muestra completos con un
propósito y, si quieres, una referencia, y cada página mostrada queda en el
rastro de auditoría ([Para mostrar los valores
completos](../personal-data-and-audit/#para-mostrar-los-valores-completos)).

## Para editar una fuente

1. Abre la fuente en el Explorador y elige **Editar**.
2. Cambia lo que necesites. El usuario y la contraseña aparecen vacíos con
   **Guardada: déjala en blanco para conservarla.**: déjalos vacíos para
   conservarlos, o escribe los nuevos.
3. Elige **Guardar**.

Quality Data vuelve a listar las tablas con los datos nuevos. Los
siguientes cortes de cada dataset que lee la fuente los usan.

## Para quitar una fuente

1. Abre la fuente en el Explorador y elige **Eliminar**.
2. En **Eliminar la fuente …**, lee la advertencia y elige **Eliminar**.

La fuente y sus credenciales, también la versión anterior, desaparecen. Una
fuente no se puede quitar mientras algún dataset la lea: quita antes esos
datasets, como explica
[Mapear una tabla en un dataset](../map-a-table/#para-quitar-un-dataset), o
conserva la fuente.

## Problemas

| Lo que ves                                                                            | Qué significa y qué hacer                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No hay **+** junto a **Fuentes**, ni **Editar** ni **Eliminar**                       | Tus políticas no te dejan gestionar fuentes. Pídele `quality-steward` a tu administrador.                                                                                                                     |
| **La fuente no aceptó la conexión: revise su servidor, puerto y credenciales.**       | No se llegó al servidor, o este rechazó el usuario. Revisa los campos con **Editar**. Si están bien, pregúntale al administrador de la base si los workers alcanzan el servidor y si el usuario puede entrar. |
| **No se pudieron leer las tablas. Revise la conexión de la fuente y actualice.**      | El listado se rindió tras tres intentos. Corrige lo que dice el mensaje anterior y elige **Volver a listar**.                                                                                                 |
| **No se pudo leer el catálogo de la fuente.** o **El listado no pudo terminar.**      | No se pudo leer la lista de tablas. Confirma con el administrador de la base que el usuario ve los esquemas y elige **Volver a listar**. Si sigue, avísale a quien da soporte a tu instalación.               |
| **Aún no se han leído sus tablas.**                                                   | Nadie ha listado la fuente. Elige **Volver a listar**.                                                                                                                                                        |
| **Solo se muestran las primeras: busque la que necesita.**                            | La fuente tiene más tablas de las que muestra el Explorador. Escribe parte del nombre en el filtro.                                                                                                           |
| **El nombre no es válido.**, **El puerto no es válido.**, **Falta …**                 | El formulario rechazó un campo. Corrígelo y guarda otra vez.                                                                                                                                                  |
| Una fuente SQL Server quedó guardada, pero un mensaje dice que no se creó su catálogo | Quality Data no pudo preparar la conexión. Elige **Guardar** otra vez para reintentarlo.                                                                                                                      |
| **No se puede eliminar: la leen estos datasets: …**                                   | Quita los datasets que nombra, o conserva la fuente.                                                                                                                                                          |
| Al eliminar, un mensaje dice que no se borró el catálogo de la fuente                 | No se eliminó nada. Inténtalo otra vez.                                                                                                                                                                       |
| **No se pudo cargar. Intenta de nuevo.**, y el Explorador queda vacío                 | La instalación todavía no puede medir datos. Avísale a tu administrador.                                                                                                                                      |

## A dónde ir después

[Mapear una tabla en un dataset](../map-a-table/) y luego
[Ejecutar y programar cortes](../run-cuts/).

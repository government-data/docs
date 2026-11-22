---
title: "Tareas: ver el historial de una regla y deshacer un cambio"
description: Leer cada cambio que tuvieron en main las reglas de un campo, ver qué cambió cada uno, volver a una versión anterior, deshacer el último cambio o recuperar una regla borrada.
sidebar:
  label: Ver el historial de una regla y deshacer un cambio
  order: 2.7
---

**Quién lo hace:** cualquiera que pueda ver las reglas lee su historial.
Volver atrás requiere permiso para desplegar, que da la política
`quality-steward`: restaurar y deshacer son despliegues en sí mismos
([Llevar un cambio a main](../rules-to-main/)).

## Qué guarda el historial

Se guarda cada cambio que llega a `main`, por archivo: los despliegues, los
borradores aprobados, las reglas borradas, las restauraciones y los
deshacer, y las reglas que propuso el mapeo de la tabla. Nada de lo que
pasó por `main` se borra; volver atrás es un cambio más encima.

El historial de una regla no cambia los cortes pasados: cada corte conserva
los resultados de las reglas con que se evaluó. Una versión que restauras
hoy cuenta desde el siguiente corte.

## Para ver el historial de un campo

1. Abre el archivo del campo en el editor (desde el Explorador, o desde el
   **Id** de una regla en la página de **Reglas**).
2. Elige **Historial**.

**Deberías ver** **Historial de Email.yaml**, primero con **Borradores
abiertos** y luego **Cambios aprobados en main**, del más reciente hacia
atrás. Cada cambio muestra un código corto, la cuenta que lo hizo, su fecha
y hora, y una línea que dice qué fue, como
`catalog: edit customers/Email.yaml`. Ábrelo para ver el archivo antes y
después, **Lado a lado** o **Unificado**.

Las reglas globales tienen su propio historial, desde **◆ Reglas
globales**. El **⎇** junto al dataset en el Explorador abre el del
dataset: los cambios de su mapeo y los borradores de todo el dataset.

## Para volver a una versión anterior

1. En el historial del campo, abre el cambio cuya versión quieres
   recuperar.
2. Elige **Restaurar esta versión**. Aparece en todos los cambios menos el
   más reciente, que ya es la versión que está en `main`.
3. Lee el diálogo como en un despliegue: errores, avisos, qué reglas cambian
   y el cambio línea por línea. Elige **Desplegar**.

**Deberías ver** _Versión desplegada en main._, y la restauración arriba en
el historial.

Una versión anterior se revisa contra el dataset tal como está hoy. Si
nombra un campo que el mapeo ya no tiene, o una regla con nombre que las
reglas globales ya no declaran, el diálogo muestra el error y no se puede
desplegar: abre el archivo, recupera el resto a mano y despliega.

## Para deshacer el último cambio

1. En el historial del campo, abre el cambio más reciente.
2. Elige **Deshacer este cambio** y confirma con **Desplegar**.

El archivo vuelve a como estaba antes de ese cambio. Deshacer el primer
cambio del archivo lo deja sin reglas. Solo el cambio más reciente tiene
**Deshacer este cambio**: para ir más atrás, usa **Restaurar esta versión**
en el cambio anterior al que quieres quitar.

## Para recuperar una regla borrada

**Borrar regla** despliega el archivo sin la regla, así que queda en el
historial del campo como cualquier cambio. Si es el más reciente,
**Deshacer este cambio** trae la regla de vuelta; si no, **Restaurar esta
versión** en el cambio justo anterior. Los cambios hechos después se
pierden con la restauración, así que revisa la vista línea por línea antes
de desplegar.

## Lo que todavía no existe

- Ninguna vista dice quién cambió por última vez cada línea de un archivo:
  abre los cambios uno por uno.
- El historial es por archivo: no hay historial de una regla a través de
  archivos, ni de todos los campos a la vez.
- Quién desplegó, aprobó, descartó o restauró también queda en el rastro
  de auditoría, que la política `auditor` lee en Grafana ([Datos personales
  y el rastro de auditoría](../personal-data-and-audit/#para-saber-quién-vio-qué)).

## Problemas

| Lo que ves                                                            | Qué significa y qué hacer                                                                                      |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| No aparece **Restaurar esta versión** ni **Deshacer este cambio**     | Tu política te deja leer el historial, no desplegar. O el cambio es el más reciente (solo tiene **Deshacer**). |
| **Sin cambios en main.**                                              | El archivo nunca ha estado en `main`: es nuevo, o solo lo tiene un borrador.                                   |
| **2 errores: no se puede desplegar**, en el diálogo                   | La versión no encaja con el dataset de hoy; mira arriba.                                                       |
| **El archivo cambió en main desde que lo abriste: vuelve a abrirlo.** | Alguien desplegó este archivo mientras tanto: cierra el historial, recarga la página y vuelve a mirar.         |

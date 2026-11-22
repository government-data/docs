---
title: "Tareas: escribir, cambiar y probar una regla"
description: Encontrar las reglas de un dataset, agregar una a un campo, cambiar o quitar una, leer lo que el editor dice de ella y probarla en el último corte antes de que cuente.
sidebar:
  label: Escribir, cambiar y probar una regla
  order: 2.4
---

**Quién lo hace:** un responsable de datos, con la política
`quality-steward`, escribe las reglas y las lleva a `main`. Quien tenga una
política que le deje ver las reglas (`quality-analyst`, `quality-viewer`,
`auditor`) puede abrirlas, leerlas y probarlas, pero no guardarlas. La
primera vez, sigue el [tutorial](../rule-tutorial/); cómo se escribe una
regla está en [Lenguaje de reglas](../rule-language/) y en [Patrones de
reglas](../rule-patterns/). El ejemplo es el dataset `customers` de
[Conceptos](../concepts/).

## Dónde están las reglas de un dataset

Cada campo tiene su propio archivo de reglas, con el nombre del campo: las
reglas de `Email` están en `Email.yaml`. Lo que comparten varios campos,
como una lista de valores o una revisión escrita una sola vez, está en las
**Reglas globales** del dataset
([Compartir reglas entre campos](../share-rules/)). Solo se evalúan las
reglas que están en `main`, la versión aprobada.

En el **Explorador**, en **Lago**, abre el dataset (**◆ customers**): cada
campo muestra sus reglas por id, y el que no tiene ninguna aparece **sin
reglas**. El **▤** junto al dataset abre su página de **Reglas**: todas las
reglas de `main` dichas en palabras, con su patrón, dimensión, severidad,
cuándo fallan y su archivo.

## Para encontrar una regla

1. Elige **▤** junto al dataset.
2. Escribe en **Buscar** un id, un campo o palabras de lo que falla, como
   `correo`, o acota la lista con **Patrón**, **Dimensión** o
   **Severidad**.
3. Elige el **Id** de la regla.

**Deberías ver** el archivo del campo en el editor, en esa regla, con el
nombre del archivo en una pestaña arriba. Si un archivo tiene reglas que no
se pueden leer, la página de **Reglas** lo nombra arriba, con sus errores.

## Para agregar una regla a un campo

1. En el Explorador, abre el dataset y elige **+** junto al campo
   (**Agregar una regla a Email**).
2. Se abre el archivo del campo (nuevo si no tenía) con una regla agregada
   al final, lista para cambiar:

   ```yaml
   - id: Email-01
     field: Email
     check: required
   ```

3. Cambia el patrón en `check`, agrega lo que pida y escribe un `alert`: la
   frase que lee quien corrige el registro. Por ejemplo:

   ```yaml
   - id: EML-02
     field: Email
     check: format
     named: email
     alert: El correo no es válido
   ```

4. Lee la regla en **Así se lee** (sección siguiente) y pruébala.

Todavía no se guarda nada: la pestaña muestra **●** y arriba dice **Cambios
sin guardar**; **Restaurar** deja el archivo como estaba.

## Para cambiar una regla

Ábrela desde el Explorador o desde la página de **Reglas**, cámbiala y
pruébala. Conserva su `id`: los resultados se guardan con él de un corte a
otro, y un id nuevo empieza de cero la historia de la regla. Una regla que
cambias hoy cuenta desde el siguiente corte; los cortes anteriores quedan
como se evaluaron.

## Lo que el editor indica mientras se escribe

El archivo se revisa mientras escribes, sin datos. Una marca en la línea
muestra dónde hay algo mal; junto al editor hay cuatro pestañas:

- **Problemas:** los errores y avisos, cada uno con su mensaje, su código
  (como `QR003`) y su línea; elige uno para ir a él.
- **Estilo:** cómo está escrito el archivo. **Ordenar** arregla casi todo
  de una vez, sin tocar comentarios ni valores; **Ctrl+Z** lo deshace.
- **Así se lee:** cada regla en palabras: a qué aplica, cuándo falla,
  cuándo no aplica. Léela siempre: es la forma más rápida de detectar una
  regla que no dice lo que querías.
- **Resultado:** la última prueba (abajo).

Un error impide guardar y desplegar; un aviso no.

## Para probar una regla

1. Pon el cursor en la regla, o fuera de toda regla para probar el archivo
   entero.
2. Elige **Probar**.

Corre el texto tal como está, sin guardar, sobre el último corte del
dataset, y nada de lo que encuentre cuenta en ningún lado. Primero espera
un worker; luego muestra en **Resultado**, por regla: **Aplica**,
**Falla**, **Pasa**, **No aplica** y **Conformidad**, hasta 10 registros de
cada resultado y los fallos agrupados por la forma del valor (un dígito
como 9, una letra como A). Los valores salen enmascarados; si tu política
te deja ver datos personales (`quality-analyst` sí, `quality-steward` no),
**Mostrar valores** los muestra completos con un propósito, y cada vista de
valores completos queda en el rastro de auditoría ([Para mostrar los
valores
completos](../personal-data-and-audit/#para-mostrar-los-valores-completos)). En el Explorador, la regla muestra luego **✓** si
pasó, o cuántos registros fallan.

El resultado de una prueba se conserva un día: pasado ese tiempo,
**Resultado** dice _El resultado de esta prueba ya no se conserva (los
resultados se conservan un día). Prueba de nuevo._, y **Probar** la corre
otra vez.

Si una regla falla en casi todos los registros, reléela antes de que
cuente.

## Para llevarla a main

Con `quality-steward` el botón es **Desplegar**: muestra lo que encuentra
el linter (el revisor), qué reglas agrega, quita o cambia el archivo y el
cambio línea por línea; elige **Desplegar** otra vez para confirmar.
**Deberías ver** _Desplegado en main: las reglas ya están bajo su campo._
Sin permiso para aprobar, el botón es **Guardar como borrador**. Los dos
caminos están en [Llevar un cambio a main](../rules-to-main/). La regla
cuenta desde el siguiente corte: puedes correr uno ya con [Ejecutar y
programar cortes](../run-cuts/#para-ejecutar-un-corte-ahora).

## Para quitar una regla

1. En el Explorador, haz clic derecho en la regla, bajo su campo, y elige
   **Borrar regla**.
2. Lee el diálogo (**Borrar la regla EML-02**): muestra el archivo sin la
   regla. Elige **Desplegar**.

**Deberías ver** _Se borró la regla EML-02; se deshace desde el historial
del campo._ Es un despliegue como cualquier otro, así que solo ve **Borrar
regla** quien puede desplegar, y [el historial del
campo](../rule-history/) la puede traer de vuelta. Una regla que una lista
de campos convierte en varias no se puede borrar desde el árbol: abre su
archivo y quítala ahí.

## Hallazgos del linter que pueden aparecer

| Lo que dice el editor                                                               | Qué hacer                                                                                                                                             |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **El campo … no está en el dataset**, a veces con **¿Quisiste decir …?** (`QR003`)  | Escribe el nombre del campo tal como lo muestra el Explorador.                                                                                        |
| **Otra regla ya usa el id …** (`QR009`)                                             | Un id es único en todo el dataset: elige otro.                                                                                                        |
| **Falta el parámetro …** (`QR006`), **El patrón … no usa el parámetro …** (`QR005`) | Busca el patrón en [Patrones de reglas](../rule-patterns/).                                                                                           |
| **No hay una población llamada …** (`QR004`), o lista, tabla, referencia            | Declárala en las [reglas globales](../share-rules/), o corrige el nombre.                                                                             |
| **No se puede leer el YAML: …** (`QR001`)                                           | La forma del archivo (YAML, el formato en que se escriben las reglas) se rompe donde dice: una sangría, unas comillas sin cerrar, un `#` en un valor. |
| **La regla no tiene alerta: …** (`QR021`), un aviso                                 | Agrega un `alert`. Una regla agregada con **+** no lo trae hasta que lo escribas.                                                                     |
| **Hace la misma verificación que …: cada fallo contaría dos veces** (`QR020`)       | Quita una de las dos.                                                                                                                                 |
| **La condición nunca se cumple: …** (`QR023`)                                       | Su `when` o su `population` deja por fuera todos los registros: revísala.                                                                             |
| **Esta regla es de …: va en su archivo, …** (`QR210`)                               | Pásala al archivo que nombra.                                                                                                                         |
| **El archivo tiene … reglas y … líneas: …** (`QR100`)                               | Más de 30 reglas o 300 líneas: pasa algunas a los archivos de sus campos.                                                                             |

Todos los códigos están en [Hallazgos del linter](../rule-files/).

## Problemas

| Lo que ves                                                                         | Qué significa y qué hacer                                                                                                                           |
| ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| No hay **+** junto a los campos, ni **Desplegar** ni **Guardar como borrador**     | Tu política te deja leer las reglas, no cambiarlas.                                                                                                 |
| **Desplegar** en gris, **Corrige los errores para guardar.**                       | Hay un error en **Problemas**: corrígelo.                                                                                                           |
| **Corrige los errores para probar.**                                               | Lo mismo, antes de una prueba.                                                                                                                      |
| **Este dataset aún no tiene un corte extraído: extrae uno en Cortes para probar.** | Corre un corte primero ([Ejecutar y programar cortes](../run-cuts/#para-ejecutar-un-corte-ahora)).                                                  |
| La prueba se queda en **…en cola, esperando que un worker la tome…**               | No hay un worker libre. Si dura, avísale a tu administrador.                                                                                        |
| **El archivo cambió en main desde que lo abriste: vuelve a abrirlo.**              | Alguien desplegó este archivo mientras tanto. Guarda una copia de tu cambio, recarga la página y vuelve a hacerlo sobre el archivo como está ahora. |
| **No se puede borrar EML-02 desde aquí: …**, tras **Borrar regla**                 | La regla no está escrita sola en su archivo: ábrela en el editor.                                                                                   |

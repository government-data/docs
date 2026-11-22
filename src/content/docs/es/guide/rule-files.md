---
title: Hallazgos del linter
description: "Referencia de cada hallazgo del revisor del editor de reglas: su código, su mensaje tal como lo muestra el editor, qué significa y cómo corregirlo."
sidebar:
  order: 7.2
---

El editor de reglas revisa un archivo de reglas mientras escribes, sin
datos: esa revisión es el linter, y lo que encuentra, un **hallazgo**. Cada
hallazgo tiene un código (como `QR003`), su línea y un mensaje en el idioma
en que usas Quality Data. En los mensajes de abajo, **…** es lo que el
editor completa: un campo, un valor, una cuenta.

- Un **error** impide guardar y desplegar; un **aviso** no, pero
  **Desplegar** los lista para que los leas antes.
- La pestaña **Estilo** del editor muestra los avisos de estilo (`QR200` a
  `QR205`) y `QR210`; **Problemas** muestra todo lo demás.
- **Ordenar**, en la pestaña **Estilo**, corrige de una vez los hallazgos
  marcados con _Ordenar_ abajo, sin tocar comentarios, orden ni valores;
  **Ctrl+Z** lo deshace. Un archivo nunca se ordena al guardarlo.

Cómo los muestra el editor mientras escribes está en [Escribir, cambiar y
probar una regla](../write-a-rule/#lo-que-el-editor-indica-mientras-se-escribe);
las claves y los patrones que nombran, en [Lenguaje de
reglas](../rule-language/) y [Patrones de reglas](../rule-patterns/).

## Errores

| Código  | Lo que dice el editor                                                                                    | Qué significa y cómo corregirlo                                                                                                                                                                                                                                                                                           |
| ------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `QR001` | **No se puede leer el YAML: …**                                                                          | La forma del archivo se rompe donde dice, y nada de lo que sigue se puede leer. Casi siempre es un `#` que corta un valor, unas comillas sin cerrar, una línea que sigue el valor de arriba con la sangría de su clave, o un `>-` sobre una lista de nombres; el resto del mensaje dice cuál, y si **Ordenar** lo corrige |
| `QR002` | **Expresión fuera de la gramática (columna …): …**                                                       | Una condición usa algo que el lenguaje no tiene: una función fuera de su lista, un parámetro distinto de `:cut`, un intervalo que no es `YEAR`, `MONTH` ni `DAY`, un tipo que `CAST` no admite, o texto que sobra después de la expresión. Reescríbela con las [expresiones](../rule-language/#expresiones) del lenguaje  |
| `QR003` | **El campo … no está en el dataset**, a veces con **¿Quisiste decir …?**                                 | Escribe el nombre del campo exactamente como lo muestran el mapeo del dataset y el Explorador                                                                                                                                                                                                                             |
| `QR004` | **No hay una población llamada …**, o lista, tabla, referencia, campo derivado                           | El nombre no está declarado en ningún lugar que el archivo vea. Declárala en las [reglas globales](../share-rules/), y despliégalas primero, o corrige el nombre                                                                                                                                                          |
| `QR005` | **El patrón … no usa el parámetro …**                                                                    | Quita el parámetro, o usa el patrón que lo usa: los parámetros de cada patrón están en [Patrones de reglas](../rule-patterns/). También `on_empty` en `required`, que ya encuentra los vacíos                                                                                                                             |
| `QR006` | **Falta el parámetro …**                                                                                 | El patrón lo necesita: agrégalo. Por ejemplo `max_age` en `fresh`, o `dimension` en `expression`                                                                                                                                                                                                                          |
| `QR007` | **El valor … de … no corresponde al tipo del campo**                                                     | Un valor que no se puede leer con el tipo del campo, como un límite de texto en un campo de fecha, o un `max_age` que no es un número entero y `days`, `months` o `years`. Corrige el valor, o el tipo del campo en el mapeo                                                                                              |
| `QR008` | **Todavía no se compila: una tabla sobre varios campos**                                                 | Una tabla de combinaciones cuyo `when` nombra varios campos. Usa un solo campo en `when`                                                                                                                                                                                                                                  |
| `QR009` | **Otra regla ya usa el id …**                                                                            | Un id es único en todo el dataset, no solo en su archivo: elige otro                                                                                                                                                                                                                                                      |
| `QR010` | **La expresión regular usa …, que RE2 no tiene: …**                                                      | Las expresiones regulares no tienen referencias hacia atrás ni lookaround. Reescríbela sin ellas, o revisa parte del valor con otra regla                                                                                                                                                                                 |
| `QR011` | **El ejemplo … debía fallar, pero al probarlo da: pasar** (o pasar, no aplicar)                          | Uno de los `examples` de la regla no da lo que declara. El editor todavía no corre los ejemplos, así que en el producto no verás este hallazgo                                                                                                                                                                            |
| `QR012` | **… no es una regla con nombre de las reglas globales de la tabla**                                      | Un `extends` nombra una regla que las reglas globales no tienen. Corrige el nombre, o despliega primero las reglas globales que la declaran                                                                                                                                                                               |
| `QR013` | **Las reglas globales de la tabla ya declaran … (…): quita la declaración de aquí o cámbiale el nombre** | Un nombre significa una sola cosa en todo el dataset. Quita la declaración del archivo del campo, o dale otro nombre                                                                                                                                                                                                      |
| `QR014` | **Las reglas globales no tienen reglas propias: cada regla va en el archivo de su campo**                | Pasa cada regla de `rules:` al archivo de su campo                                                                                                                                                                                                                                                                        |

## Avisos

| Código  | Lo que dice el editor                                                                                                         | Qué significa y cómo corregirlo                                                                                                                                                          | Ordenar |
| ------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `QR020` | **Hace la misma verificación que …: cada fallo contaría dos veces**                                                           | Dos reglas verifican lo mismo en los mismos registros. Quita una de las dos                                                                                                              | No      |
| `QR021` | **La regla no tiene alerta: quien corrige el registro no sabrá qué hacer**                                                    | Agrega un `alert`: la frase que lee quien corrige el registro. Una regla agregada con **+** no lo trae hasta que lo escribas                                                             | No      |
| `QR022` | **… ya tiene required, que cuenta los rellenos como vacíos**                                                                  | El campo tiene `required` y `placeholder`; `required` ya falla con los rellenos. Quita la regla `placeholder`                                                                            | No      |
| `QR023` | **La condición nunca se cumple: la regla no aplicaría a ningún registro**                                                     | Su `when` o su población dejan por fuera todos los registros, como un campo igual a dos valores a la vez, o `FALSE`. Revisa la condición                                                 | No      |
| `QR024` | **… está mapeado como número: un patrón de texto leería 1234.0; mapea el código como texto**                                  | Un patrón de texto (`format`, `length`…) sobre un campo mapeado como número lo lee con decimales y sin ceros a la izquierda. Mapea el campo como texto                                   | No      |
| `QR100` | **El archivo tiene … reglas y … líneas: divídelo por grupo de campos (hasta 30 reglas o 300 líneas)**                         | Pasa reglas a los archivos propios de sus campos                                                                                                                                         | No      |
| `QR101` | **El borrador cambia … reglas: divídelo (hasta 25)**                                                                          | Un borrador debería cambiar como mucho 25 reglas, para que una persona lo pueda revisar. Hoy el producto no muestra este hallazgo                                                        | No      |
| `QR103` | **La lista … tiene … valores: conviértela en una tabla del catálogo**                                                         | Una lista de más de 50 valores es difícil de revisar en un archivo de reglas. Guarda los valores como un dataset propio y verifica contra él con una referencia (`in: { reference: … }`) | No      |
| `QR206` | **El # empieza un comentario y el valor se pierde: ponlo entre comillas ("…")**                                               | YAML lee un `#` después de un espacio como el comienzo de un comentario, y el resto del valor se pierde. Pon el valor entre comillas                                                     | Sí      |
| `QR207` | **Estas comillas no se cierran en la línea: lo que sigue, hasta la próxima comilla, queda dentro del valor**                  | Cierra las comillas en la misma línea                                                                                                                                                    | No      |
| `QR208` | **Esta línea sigue el valor de arriba con la sangría de su clave, y se lee como una clave nueva: ponle más sangría o usa >-** | Un valor largo partido en varias líneas debe darle más sangría a las líneas que siguen, o empezar con `>-`                                                                               | Sí      |
| `QR209` | **… vuelve … un solo texto, pero … es una lista de nombres con su valor: quita … de aquí y ponlo en cada nombre**             | Un `>-` o `\|` en una clave como `derived` o `populations` vuelve un solo texto lo que es una lista. Ponlo en el valor de cada nombre                                                    | Sí      |
| `QR211` | **… repite lo que ya dice …: sobra**                                                                                          | Una regla que extiende una regla con nombre escribe una clave con el mismo valor que ya le da la regla con nombre. Quita la clave                                                        | No      |

## Estilo

También se revisa cómo está escrito un archivo, para que los borradores
muestren solo lo que cambió de sentido. Son avisos.

| Código  | Lo que dice el editor                                                             | Cómo corregirlo                                                                                      | Ordenar |
| ------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------- |
| `QR200` | **La sangría no es de dos espacios por nivel**                                    | Dale a cada nivel dos espacios más que al de arriba                                                  | No      |
| `QR201` | **Hay una tabulación: usa espacios**                                              | Cambia la tabulación por espacios                                                                    | Sí      |
| `QR202` | **Sobran espacios al final de la línea**                                          | Quítalos                                                                                             | Sí      |
| `QR203` | **Estas comillas no hacen falta: el valor se lee igual sin ellas**                | Escribe el valor sin comillas (ver abajo)                                                            | Sí      |
| `QR204` | **La línea tiene … caracteres (más de 120): si es una expresión, pártela con >-** | Parte una expresión larga con `>-`, una cláusula por línea                                           | Sí      |
| `QR205` | **Deja exactamente una línea en blanco antes de cada regla**                      | Separa las reglas con una línea en blanco                                                            | Sí      |
| `QR210` | **Esta regla es de …: va en su archivo, …**                                       | Pasa la regla al archivo que nombra ([Un archivo por campo](../rule-language/#un-archivo-por-campo)) | No      |

### Comillas solo donde hacen falta

Un valor va sin comillas (`check: required`, `alert: Sin empresa`) salvo
que, sin ellas, se lea como otra cosa: un número o una fecha escritos como
texto (`"0123"`, `"1900-01-01"`), `yes`, `no`, `true`, `false`, `null`; un
valor que empieza con un signo que YAML lee (`- : [ { # & * ! | > ' " % @`,
así que `":cut"` y `"- Liabilities"` los conservan); uno que tiene `: ` o
` #`; y dentro de `[…]` o `{…}`, uno que tiene `,` o un corchete.

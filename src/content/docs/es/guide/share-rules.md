---
title: "Tareas: compartir reglas entre campos"
description: Declarar una vez lo que usan varios campos, escribir una revisión una vez y reutilizarla con extends, cambiar una revisión compartida sin sorpresas y pasar archivos antiguos a un archivo por campo.
sidebar:
  label: Compartir reglas entre campos
  order: 2.5
---

**Quién lo hace:** un responsable de datos, con la política
`quality-steward`. Las reglas globales son un archivo de reglas como
cualquier otro: se escriben, se revisan y se llevan a `main` como en
[Escribir, cambiar y probar una regla](../write-a-rule/). Qué significa
cada sección está en [Lenguaje de reglas: lo que el dataset declara una
vez](../rule-language/#lo-que-el-dataset-declara-una-vez).

## Para qué sirven las reglas globales

Cada dataset tiene un archivo de **Reglas globales**,
`reglas_globales.yaml`, junto a los archivos de sus campos. Declara una
sola vez lo que usan varios campos, y cada archivo del dataset lo ve como
si lo declarara él mismo:

- **poblaciones** (`populations`), **listas** (`lists`), **rellenos**
  (`placeholders`), campos **derivados** (`derived`), **referencias** a
  otros datasets (`references`) y **tablas** de combinaciones (`tables`);
- **reglas con nombre** (`named`): una revisión escrita una vez, que la
  regla de un campo toma con `extends`.

No tiene reglas propias: cada regla sigue en el archivo de su campo. Un
nombre significa una sola cosa en todo el dataset, así que una lista o una
población declarada en las reglas globales no se vuelve a declarar en el
archivo de un campo.

## Para abrir las reglas globales

En el **Explorador**, abre el dataset (**◆ customers**) y elige
**◆ Reglas globales**, su primera línea. Si el dataset todavía no las
tiene, el editor abre unas vacías, `dataset: customers`, y al guardar o
desplegar se crean.

## Para declarar una lista una vez y usarla

1. En las reglas globales, agrega la lista:

   ```yaml
   dataset: customers

   lists:
     regions: [NORTH, SOUTH, EAST, WEST]
   ```

2. Despliégalas (**Desplegar**, y **Desplegar** otra vez para confirmar).
3. En `Region.yaml`, úsala:

   ```yaml
   - id: REG-01
     field: Region
     check: domain
     in: { list: regions }
     alert: La región no es una de las de la organización
   ```

Despliega primero las reglas globales: el archivo de un campo se revisa con
las reglas globales que hay en `main`, así que hasta entonces el editor
dice **No hay una lista llamada regions** (`QR004`). Lo mismo pasa con una
prueba.

## Para escribir una revisión una vez y reutilizarla

Supón que `customers` tiene dos campos de correo, `Email` y `WorkEmail`,
que se revisan igual.

1. En las reglas globales, bajo `named`, escribe la revisión con todo menos
   `id` y `field`:

   ```yaml
   named:
     valid_email:
       check: format
       named: email
       severity: major
       alert: El correo no es válido
   ```

2. Despliega las reglas globales.
3. En el archivo de cada campo, parte de ella con `extends` y cambia solo
   lo que difiere:

   ```yaml
   - id: WEM-01
     field: WorkEmail
     extends: valid_email
     severity: minor
   ```

En la línea de `extends`, el editor dice cómo queda la regla, por ejemplo
_Según valid_email: aplica a …; falla cuando …_, y **Así se lee** la
muestra completa. Una regla con nombre necesita un patrón (`check`) y no
puede extender otra.

## Para cambiar o quitar una revisión compartida

Cambiar una regla con nombre cambia todas las reglas que la extienden, desde
el siguiente corte, sin tocar sus archivos. Dos cosas que conviene saber
antes de desplegar:

- La confirmación de las reglas globales no muestra reglas: dice **Ninguna
  regla cambia lo que comprueba: solo cambia cómo está escrito el
  archivo.** aunque haya cambiado una regla con nombre, porque las reglas
  que cambian están en otros archivos. Todavía nada lista las reglas que
  extienden una regla con nombre: busca en la página de **Reglas** del
  dataset (**▤**) palabras de lo que hace fallar.
- Las reglas globales se revisan solas. Si quitas una regla con nombre que
  un campo todavía extiende, el archivo de ese campo deja de leerse: la
  página de **Reglas** lo nombra arriba con **… no es una regla con nombre
  de las reglas globales de la tabla**. Por eso, primero cambia o quita las
  reglas que la extienden, un archivo de campo a la vez, y luego quita la
  regla con nombre.

**Probar** en el archivo de un campo usa las reglas globales de `main`:
prueba una regla que extienda la regla con nombre justo después de
desplegar, y si quedó mal, deshaz el cambio desde el historial de las
reglas globales ([Ver el historial de una regla y deshacer un
cambio](../rule-history/)).

## Para pasar archivos antiguos a un archivo por campo

Un dataset cuyas reglas se escribieron antes de que los archivos fueran por
campo puede tener archivos con reglas de varios campos. **Repartir por
campo**, junto a **Reglas globales** en el Explorador, los reescribe en un
borrador: cada regla en el archivo de su campo, las declaraciones y las
revisiones que comparten varios campos en las reglas globales, y los
campos con el nombre de sus columnas.

1. Elige **Repartir por campo**.
2. **Deberías ver** _Borrador creado: revísalo con ⎇ junto al dataset._
3. Revísalo y apruébalo como en [Llevar un cambio a
   main](../rules-to-main/#para-revisar-un-borrador), desde el **⎇** junto
   al dataset.

`main` no cambia hasta que se aprueba el borrador, y el reparto se rechaza
si no quedan exactamente las mismas reglas. Renombrar campos cambia el
mapeo, así que hace falta poder administrar el dataset, cosa que da
`quality-steward`.

## Hallazgos y rechazos que pueden aparecer

| Lo que ves                                                                             | Qué significa y qué hacer                                                                                          |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **… no es una regla con nombre de las reglas globales de la tabla** (`QR012`)          | El nombre después de `extends` está mal, o la regla con nombre aún no se ha desplegado.                            |
| **Las reglas globales de la tabla ya declaran … (…): …** (`QR013`)                     | El archivo de un campo declara un nombre que ya declaran las reglas globales: quítalo de ahí o cámbiale el nombre. |
| **Las reglas globales no tienen reglas propias: …** (`QR014`)                          | Pasa la regla al archivo de su campo.                                                                              |
| **… repite lo que ya dice …: sobra** (`QR211`), un aviso                               | La regla repite una clave de su regla con nombre con el mismo valor: quita la clave.                               |
| **No hay una población llamada …** (`QR004`), o lista, tabla, referencia               | Declárala en las reglas globales y despliégalas antes del archivo que la usa.                                      |
| **Las reglas ya están repartidas por campo.**                                          | No hay nada que hacer.                                                                                             |
| **… tiene errores: corrígelos antes de repartir**                                      | Corrige el archivo nombrado, despliégalo y vuelve a repartir.                                                      |
| **Al repartir no quedarían las mismas reglas: no se repartió**                         | El reparto cambiaría lo que se revisa, así que no se hizo. Mueve esas reglas a mano.                               |
| **Dos campos tomarían el nombre …: …**, **No se sabe de qué campo es la regla … de …** | Corrige lo que dice el mensaje, o mueve esas reglas a mano.                                                        |

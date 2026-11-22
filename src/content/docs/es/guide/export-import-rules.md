---
title: "Tareas: exportar e importar reglas"
description: Descargar las reglas de un dataset como archivos, y volver a subir archivos de reglas, cada uno revisado y confirmado antes de llegar a main.
sidebar:
  label: Exportar e importar reglas
  order: 2.8
---

**Quién lo hace:** cualquiera que pueda ver las reglas las exporta.
Importar despliega, así que requiere permiso para desplegar, que da la
política `quality-steward`
([Llevar un cambio a main](../rules-to-main/#quién-puede-hacer-qué)).

Sirve para guardar una copia de las reglas de un dataset fuera de Quality
Data, para llevarlas de una instalación a otra (de una de pruebas a la que
está en uso) o para editar muchos archivos a la vez en tu propio editor.

## Para exportar las reglas de un dataset

1. En el **Explorador**, elige **▤** junto al dataset para abrir su página
   de **Reglas**.
2. Elige **⤓ Exportar .zip**.

**Deberías ver** una descarga con un nombre como
`customers-reglas-2026-11-12.zip`: cada archivo de reglas del dataset tal
como está en `main`, uno por campo, y las reglas globales,
`reglas_globales.yaml`, si las tiene. No trae el mapeo ni ningún borrador.

## Para importar reglas

1. En la página de **Reglas** del dataset, elige **⤒ Importar**.
2. Elige uno o varios archivos `.yaml`, o un `.zip` como el de una
   exportación.
3. Por cada archivo que cambiaría `main`, uno tras otro, un diálogo
   **Importar Email.yaml (1 de 3)** muestra lo mismo que un despliegue:
   errores, avisos, qué reglas agrega, quita o cambia y el cambio línea por
   línea. Elige **Desplegar** para tomarlo, o **Cancelar** para dejarlo por
   fuera.

**Deberías ver** al final _Importación terminada: 2 de 3 archivos
desplegados en main._ Cada archivo desplegado es un cambio en el historial
de su campo, que se puede deshacer como cualquier otro ([Ver el historial
de una regla y deshacer un cambio](../rule-history/)). Las reglas cuentan
desde el siguiente corte.

Lo que toma una importación:

- **Los archivos se toman por su nombre.** Un archivo reemplaza el archivo
  del dataset que se llama igual, también dentro de un `.zip`, esté en la
  carpeta que esté. Un nombre lleva letras, dígitos, `_` y `-`, y termina en
  `.yaml`; lo demás, `.yml` incluido, se deja de lado y un aviso lo nombra.
- **Un archivo nuevo tiene que ser el de un campo o las reglas globales.**
  `WorkEmail.yaml` se puede agregar si el dataset tiene un campo
  `WorkEmail`; un archivo que no se llama como ningún campo se rechaza.
- **Los archivos iguales a `main` se saltan**, y un archivo que está en
  `main` pero no en lo que subiste queda como está: importar agrega y
  reemplaza, nunca quita. Para quitar reglas, bórralas, o despliega su
  archivo sin ellas.
- **Cada archivo se revisa contra este dataset.** Las reglas que vienen de
  otro dataset u otra instalación fallan donde nombran un campo que este no
  tiene: corrige el archivo e impórtalo otra vez.

Una importación siempre despliega: no puede guardar un borrador.

## Problemas

| Lo que ves                                                                        | Qué significa y qué hacer                                                                                                        |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| No aparece **⤒ Importar** junto a **⤓ Exportar .zip**                             | Tu política no te deja desplegar.                                                                                                |
| **Nada que importar: los archivos son iguales a main.**                           | Todos los archivos que subiste ya están así en `main`.                                                                           |
| **Se dejaron de lado (no son archivos de reglas): …**                             | Esos archivos no se tomaron: cámbiales el nombre a `<campo>.yaml`.                                                               |
| **No se pudo leer el archivo subido: ¿es un .zip o un .yaml?**                    | El `.zip` está dañado, o no es un `.zip`.                                                                                        |
| **2 errores: no se puede desplegar**, en el diálogo de un archivo                 | **Cancelar**: corrige el archivo e impórtalo otra vez.                                                                           |
| **Email.yaml: El archivo cambió en main desde que lo abriste: vuelve a abrirlo.** | Alguien desplegó ese archivo durante la importación: impórtalo otra vez.                                                         |
| **extra.yaml: No se pudo guardar. Intenta de nuevo.**                             | Casi siempre, un archivo nuevo que no se llama como ningún campo del dataset. Compara el nombre con los campos en el Explorador. |

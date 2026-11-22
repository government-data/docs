---
title: "Tareas: datos personales y el rastro de auditoría"
description: Dónde aparecen los valores de las fuentes, quién puede verlos completos, cómo mostrarlos con un motivo, qué queda registrado cuando alguien lo hace, cómo saber quién vio qué y por qué, y qué cubre hoy el rastro de auditoría.
sidebar:
  label: Datos personales y el rastro de auditoría
  order: 2.94
---

**Quién lo hace:** un administrador decide quién ve los valores de las
fuentes, con las políticas de [Administrar usuarios y
accesos](../manage-access/). Control interno, con la política `auditor`,
lee quién los vio.

## Dónde aparecen los valores de las fuentes

Casi todo Quality Data muestra conteos, nunca los valores de un registro:
el dashboard, las colas, la muestra del mapeo. Los valores de las fuentes
aparecen solo en tres lugares:

- **Registros**, junto a una tabla de una fuente en el Explorador: una
  página de la tabla tal como está ahora en la fuente.
- **Probar**, en el editor de reglas: hasta 10 registros de cada resultado,
  en la pestaña **Resultado**.
- La **Consola SQL del lago**, para los responsables de datos: las filas que
  devuelve una consulta sobre el lago, escrita en SQL (lenguaje de consulta
  estructurado).

## Quién puede verlos completos

Los valores llegan siempre primero **enmascarados**, para todos: cada valor
como `••••` seguido de sus últimos cuatro caracteres, o solo `••••` si
tiene cuatro caracteres o menos. Solo quien tiene políticas que permiten
**Ver datos personales** puede mostrarlos completos, y solo diciendo por
qué. Entre las políticas listas solo lo permite `quality-analyst` (y
`quality-admin`); una cuenta con el rol Administrador también puede. Así
que `quality-steward`, `quality-viewer` y `auditor` trabajan con valores
enmascarados.

| Dónde         | Mostrar los valores completos requiere **Ver datos personales** en…            |
| ------------- | ------------------------------------------------------------------------------ |
| **Probar**    | el dataset cuya regla se prueba                                                |
| **Registros** | cada dataset que lee la tabla; en todos los datasets si todavía ninguno la lee |
| La consola    | todos los datasets                                                             |

Sin el permiso la pantalla dice _valores enmascarados: verlos completos
requiere el permiso de datos personales._ Con él dice _Valores
enmascarados._ y ofrece **Mostrar valores**.

## Para mostrar los valores completos

1. Encima de los valores enmascarados, elige **Mostrar valores**.
2. En **Mostrar datos personales**, elige el **Propósito**:
   - **Revisión de la calidad de datos**
   - **Escritura o prueba de reglas**
   - **Corrección de datos**
   - **Solicitud de un cliente**
   - **Auditoría o control interno**
   - **Otro**
3. En **Referencia (opcional)**, escribe el ticket o el caso para el que es
   la vista, como `INC-2041` o `CASO/2026/118`: hasta 32 caracteres,
   letras, dígitos y `- _ / # .`, sin espacios, con al menos una letra. Un
   ticket que es solo dígitos va con el prefijo de su sistema (`T-48213`).
   Nunca escribas un nombre ni un número de documento. Con **Otro** es
   obligatoria: **Referencia (obligatoria con Otro)**.
4. Elige **Mostrar valores**.

Los valores se muestran completos y, encima, una línea dice por qué:
_Mostrando valores para: Revisión de la calidad de datos, INC-2041_, con
**Cambiar** y **Enmascarar de nuevo**.

El motivo se recuerda para ese **ámbito** en esta pestaña del navegador:
una fuente (cada página de sus tablas), un dataset (sus pruebas de reglas)
o el lago (la consola). La siguiente página, prueba o consulta del mismo
ámbito se muestra completa sin volver a preguntar, y cada una queda
registrada igual, con el motivo.

- **Cambiar** pide otro motivo; aplica desde la siguiente página, prueba o
  consulta.
- **Enmascarar de nuevo** olvida el motivo y enmascara lo que se ve.
- Cerrar la sesión, que la sesión expire o cerrar la pestaña también lo
  olvidan.

Si los valores no se pueden mostrar (no tienes el permiso, la lectura no
ha terminado, o la auditoría o el servicio no están disponibles), siguen
enmascarados: la pantalla dice _Valores enmascarados._ y por qué, nunca
_Mostrando valores para_. Con un motivo recordado, **Cambiar** lo abre
para volver a intentarlo o dar otro, y **Olvidar el motivo** lo olvida.

## Para dejar que alguien vea valores, o dejar de hacerlo

- **Para dejarlo:** asigna `quality-analyst` a su cuenta o a uno de sus
  grupos ([Para dar o cambiar
  políticas](../manage-access/#para-dar-o-cambiar-políticas)).
- **Para un solo dataset:** una política propia que permita **Ver datos
  personales** con el recurso `pipeline/customers`. **Probar** sobre el
  dataset `customers` le deja entonces mostrar sus valores; **Registros**, solo
  si ningún otro dataset lee la misma tabla.
- **Para dejar de hacerlo:** quita esa política. Aplica de inmediato, a más
  tardar en un minuto.

## Qué queda registrado cuando alguien ve valores

Cada vez que alguien muestra valores completos, Quality Data registra
quién, cuándo, desde qué dirección y qué navegador, y qué abrió: una página
de la tabla de una fuente, una prueba de las reglas de un dataset o una
consulta de la consola. Con eso van el **propósito**, la **referencia** si
se dio, el trabajo de la lectura, cuántas **filas** mostró y los **nombres
de los campos** que mostró. Una columna de la consola cuyo nombre no es un
nombre simple (un alias con un espacio, una comilla o una tilde) se
registra por su posición, como `#2`. Si no se puede escribir el registro,
los valores no se muestran.

Nunca registra un valor, ni qué registros o clientes mostró una vista. Las
lecturas enmascaradas no quedan como vistas. Cada vez que se muestran
queda su propio registro: una prueba abierta de nuevo después de recargar
la página queda registrada otra vez. Las vistas de antes de que se pidiera
un motivo no tienen propósito: Grafana las muestra como **No registrado**.
No hay forma de exportar datos personales desde el producto.

## Para saber quién vio qué

Quality Data no tiene una pantalla propia para el rastro de auditoría. Se
lee en **Grafana**, la aplicación de monitoreo de la instalación, donde la
hay; una instalación hecha con el instalador todavía no la trae, así que
pregúntale a quien da soporte a tu instalación.

1. En el menú de arriba a la derecha, en **Aplicaciones**, elige
   **Grafana**. Se abre con tu sesión si tu cuenta tiene `auditor` (para
   leer), o `quality-admin` o el rol Administrador; a cualquier otra cuenta
   la rechaza.
2. Abre la carpeta **Quality Data · Auditoría y operación**.
3. Elige **Acceso a datos personales**: quién vio valores, como vistas en
   el tiempo, **Por persona**, **Por propósito**, **Por recurso (los 20
   primeros)** y cada vista, de la más nueva a la más vieja, con su
   **Propósito**, **Referencia**, **Filas mostradas** y **Campos
   mostrados**. Acótalo con **Quién** y
   **Recurso contiene**, por ejemplo el nombre de una fuente, y con el
   rango de tiempo de arriba.

**Rastro de auditoría**, en la misma carpeta, tiene todos los eventos, con
**Tipo de evento**, **Quién** y **Recurso contiene**, y las gráficas **Por
persona**, **Por acción** y **Por dataset**.

## Qué cubre hoy el rastro de auditoría

| Queda registrado                                                                                     | Todavía no queda registrado                                             |
| ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Inicios de sesión logrados o fallidos, bloqueos y cierres de sesión                                  | Cambios a grupos, políticas y cuentas de servicio                       |
| Recuperaciones de contraseña, y cuentas externas vinculadas o desvinculadas                          | Cambios al correo saliente, al directorio y al inicio de sesión externo |
| Cuentas creadas, editadas y eliminadas, y enlaces de activación enviados                             | Qué registros mostró una vista                                          |
| Fuentes agregadas, cambiadas (una credencial como cambiada, nunca su valor) y quitadas               |                                                                         |
| Reglas desplegadas, borradores aprobados y descartados, mapeos iniciados, datasets quitados          |                                                                         |
| Cortes ejecutados a mano, programaciones creadas, cambiadas y quitadas, ANS de remediación guardados |                                                                         |
| Cada vista de valores completos, con su propósito, referencia, filas y campos                        |                                                                         |
| Cada consulta que corre en la consola                                                                |                                                                         |

El rastro todavía no se puede exportar desde el producto.

## Problemas

| Lo que ves                                                                                            | Qué significa y qué hacer                                                  |
| ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **valores enmascarados: verlos completos requiere el permiso de datos personales.**, en **Resultado** | Tu política no permite **Ver datos personales** en este dataset.           |
| **Los valores están enmascarados: …** en **Registros**                                                | Falta en al menos un dataset que lee la tabla.                             |
| **La referencia no es un número de ticket o de caso: …**                                              | Escribe un número de ticket o de caso como `INC-2041`, sin espacios.       |
| **Con Otro, escribe la referencia del ticket o del caso.**                                            | **Otro** requiere una referencia; o elige el propósito que corresponde.    |
| **La auditoría no está disponible, así que los valores no se pueden mostrar: …**                      | No se mostró ni se registró nada. Inténtalo más tarde.                     |
| **Estos valores ya no se guardan: vuelve a leerlos.**                                                 | Una lectura se guarda una hora (una prueba, un día). Vuelve a leerla.      |
| **No puedes ver los registros de esta fuente.**                                                       | Tu política no te deja ver esta fuente.                                    |
| No hay **Registros** junto a una tabla                                                                | La tabla ya no está en la fuente, o tu política no te deja ver fuentes.    |
| No hay **Grafana** en **Aplicaciones**                                                                | La instalación no la trae. Pregúntale a quien da soporte a tu instalación. |
| Grafana no te deja entrar                                                                             | Tu cuenta no tiene `auditor` ni `quality-admin`, ni es Administrador.      |

## A dónde ir después

- [Administrar usuarios y accesos](../manage-access/): las políticas y cómo
  darlas.
- [Conectar una fuente](../connect-a-source/#para-ver-los-registros-de-una-tabla)
  y [Escribir, cambiar y probar una regla](../write-a-rule/#para-probar-una-regla):
  las pantallas donde aparecen valores.

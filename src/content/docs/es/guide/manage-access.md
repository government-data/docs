---
title: "Tareas: administrar usuarios y accesos"
description: Cómo funciona el acceso, las políticas listas y cuál dar para cada trabajo, cómo crear y quitar cuentas, los grupos, las políticas propias y las cuentas de servicio.
sidebar:
  label: Administrar usuarios y accesos
  order: 2.93
---

**Quién lo hace:** un administrador: una cuenta con el rol
**Administrador**, o una cuyas políticas permitan **Administrar usuarios**
(las cuentas) y **Administrar grupos y políticas** (grupos, políticas y
asignarlas); entre las políticas listas, `quality-admin` permite las dos.
Todo esto está en **Configuración** (el menú de arriba a la derecha),
**Usuarios y acceso**. La primera cuenta que creas está en [Primeros pasos:
administrador](../start-admin/); esta página es el recorrido completo.

## Cómo funciona el acceso

- **El rol.** Una cuenta es **Administrador**, que puede todo sin
  políticas, o **Usuario**, que puede lo que le permitan sus políticas.
  Solo un Administrador puede volver Administrador a otra cuenta, o cambiar
  o eliminar una que lo sea.
- **Las políticas.** Una política es un conjunto de acciones permitidas. Un
  usuario recibe las políticas asignadas a su cuenta y las de sus grupos, y
  se suman. Una política propia también puede negar una acción; una
  negación siempre gana.
- **Cuándo aplica.** Un cambio de políticas o de grupos aplica de
  inmediato, a más tardar en un minuto; la persona no tiene que volver a
  iniciar sesión.

## Las políticas listas

Vienen con el producto, llevan la marca **incluida** y no se pueden cambiar
ni eliminar.

| Política          | Para                                      | Permite                                                                                                                                         | No permite                                                          |
| ----------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `quality-steward` | Quien es dueño de las reglas y los cortes | Todas las acciones de calidad de datos: fuentes, mapeo, escribir y aprobar reglas, ejecutar y programar cortes, plazos de las colas, la consola | Ver datos personales: los valores de las fuentes salen enmascarados |
| `quality-analyst` | Quien atiende las colas                   | Ver todo, datos personales incluidos, y ejecutar cortes                                                                                         | Cambiar fuentes, reglas, programaciones o plazos                    |
| `quality-viewer`  | Gerencia, dashboards                      | Leer dashboards, cortes y reglas                                                                                                                | Las fuentes y sus registros, datos personales, cambiar nada         |
| `auditor`         | Control interno                           | Ver todo sin datos personales, y el rastro de auditoría en Grafana                                                                              | Cambiar nada                                                        |
| `quality-admin`   | Quien administra la instalación           | Todo, también la Configuración                                                                                                                  | Cambiar o eliminar una cuenta Administrador, sin tener ese rol      |

Cada permiso, qué deja hacer y cuál de estas políticas lo tiene está en
[Permisos](../permissions/).

## Qué política dar

| Para que un colaborador pueda…                                    | Dale                                                                                    |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Leer dashboards e indicadores                                     | `quality-viewer`                                                                        |
| Leer todo, con los valores enmascarados, y el rastro de auditoría | `auditor`                                                                               |
| Atender una cola de remediación y ver los valores de lo que falla | `quality-analyst`                                                                       |
| Conectar fuentes, mapear tablas, ejecutar y programar cortes      | `quality-steward`                                                                       |
| Aprobar reglas y mapeos, y fijar los plazos de las colas          | `quality-steward`                                                                       |
| Escribir reglas que aprueba otra persona                          | Una política propia: [Llevar un cambio a main](../rules-to-main/#quién-puede-hacer-qué) |
| Hacer el trabajo de un responsable de datos y además ver valores  | `quality-steward` y `quality-analyst` juntas                                            |
| Administrar cuentas, grupos y configuración sin ser Administrador | `quality-admin`                                                                         |

Ver valores de las fuentes se explica en [Datos personales y el rastro de
auditoría](../personal-data-and-audit/).

## Para crear una cuenta

Crear cuentas requiere el correo saliente: la cuenta se activa con un enlace
que llega por correo ([Correo, inicio de sesión y
actualizaciones](../administer-the-installation/#para-configurar-el-correo-saliente)).

1. En **Usuarios y acceso**, pestaña **Usuarios**, elige **Registrar
   usuario**.
2. En **Nuevo usuario**, escribe el **Correo**, si quieres el **Nombre
   (opcional)**, y elige el **Rol**: **Usuario**, salvo que vaya a
   administrar la instalación.
3. Elige **Crear y enviar el enlace**.

**Deberías ver** _Listo: le enviamos a … el enlace para activar su cuenta
(sirve 72 horas)._ y la cuenta en la lista como **Pendiente de activar**.
Cuando la persona elige su contraseña pasa a **Activo**. Si el enlace se
perdió o venció, elige **Reenviar enlace**: el anterior deja de servir.

## Para dar o cambiar políticas

1. En la fila de la cuenta, elige **Editar**.
2. En **Políticas asignadas directamente**, marca o desmarca políticas.
   Cada una dice para qué es.
3. Elige **Guardar cambios**.

**Deberías ver** _Listo: se guardaron los cambios de …._ y en **Acceso**
las políticas, y los grupos a los que pertenece la cuenta. Un
Administrador muestra **Todo**; una cuenta sin nada, **Nada**. El mismo
diálogo cambia el **Nombre (opcional)** y el **Rol**; nadie puede cambiar
su propio rol.

## Para quitarle el acceso a alguien

No hay forma de apagar una cuenta y volver a encenderla. Puedes:

- **Quitarle el acceso** y conservar la cuenta: **Editar**, desmarca todas
  las políticas, sácala de sus grupos y **Guardar cambios**. Todavía puede
  iniciar sesión, pero no ve nada más que su propia cuenta.
- **Eliminarla**: **Eliminar** en su fila y confirma en **Eliminar el
  usuario**. La cuenta se va con sus sesiones y sus cuentas vinculadas, y no
  se puede recuperar; el correo se puede registrar de nuevo más adelante.

## Para dar políticas a varias personas: grupos

1. En la pestaña **Grupos**, elige **Nuevo grupo**.
2. Escribe un **Nombre** (minúsculas, números y `-`) y una
   **Descripción**.
3. Marca a las personas en **Personas agregadas a mano** y las
   **Políticas** que da el grupo.
4. Si tu organización entra con su directorio, escribe en **Grupos del
   directorio** los grupos del directorio cuyos miembros entran al grupo al
   iniciar sesión, uno por línea ([inicio de sesión con el
   directorio](../administer-the-installation/#para-que-se-entre-con-el-directorio-de-la-empresa)).
5. Elige **Guardar**.

**Deberías ver** _Grupo … guardado._ Eliminar un grupo les quita a sus
personas lo que les daban sus políticas.

## Para escribir una política propia

1. En la pestaña **Políticas**, elige **Nueva política**.
2. Escribe un **Nombre** y una **Descripción**.
3. En **Regla 1**, deja **Efecto** en **Permitir** y **Recursos** en `*`
   (todo), y marca las acciones de **Calidad de datos** y
   **Administración**, o **Todas las acciones**.
4. Para restringirla, elige **Agregar regla** con **Efecto** en **Negar**:
   una negación siempre gana. Un recurso como `pipeline/customers` limita
   las acciones de un dataset, como **Ver resultados** o **Ver datos
   personales**, al dataset `customers`.
5. Elige **Guardar** y asígnala a personas o grupos.

En esta pantalla, "regla" es una línea de la política, no una regla de
calidad. **Deberías ver** _Política … guardada._ y en **Asignada a**
cuántos la tienen. Un nombre o una regla que no sirve se rechaza con un
motivo corto, en inglés, que nombra el campo.

## Tokens para integraciones: cuentas de servicio

Cualquiera puede crear un token para un script u otro sistema en la pestaña
**Cuentas de servicio**: **Nueva cuenta de servicio**, un **Nombre**, si quieres
**Políticas propias** y **Vence el**, y **Crear**. El token se
muestra una sola vez: cópialo en ese momento. Puede a lo sumo lo que puede
su dueño, y deja de servir cuando se elimina.

## Mensajes que pueden aparecer

| Lo que ves                                                                  | Qué significa y qué hacer                                                              |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Para crear usuarios hace falta el correo saliente: …**, **Crear** en gris | Configura antes el correo saliente (**Configurar el correo**).                         |
| **Se creó la cuenta de …, pero el correo no salió.**                        | Revisa el correo saliente y luego **Reenviar enlace**.                                 |
| **Ya hay una cuenta con ese correo.**                                       | Esa persona ya tiene cuenta: búscala en la lista.                                      |
| **Esa cuenta ya está activa.**                                              | No hace falta enlace: entra con su contraseña.                                         |
| **No puedes cambiar tu propio rol.**                                        | Tiene que hacerlo otro Administrador.                                                  |
| **Es el único administrador: no se puede eliminar.**                        | Vuelve antes Administrador a otra cuenta.                                              |
| **No puedes eliminar tu propia cuenta.**                                    | Tiene que hacerlo otro Administrador.                                                  |
| **Solo un administrador puede hacer eso con un administrador.**             | Solo un Administrador cambia o elimina una cuenta Administrador.                       |
| **El nombre y el rol de esta cuenta los pone el directorio (LDAP).**        | Una cuenta del directorio: cámbiala en el directorio.                                  |
| **Solo un administrador puede cambiar la configuración.**                   | Tus políticas no lo permiten.                                                          |
| **Revisa los campos marcados.**                                             | Un campo de **Nuevo usuario** no sirve, como **Escribe un correo válido.**: corrígelo. |

## A dónde ir después

- [Datos personales y el rastro de auditoría](../personal-data-and-audit/):
  quién ve valores y quién los vio.
- [Correo, inicio de sesión y
  actualizaciones](../administer-the-installation/): el resto de
  **Configuración**.

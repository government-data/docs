---
title: Permisos
description: "Referencia de cada permiso que una política puede permitir: qué deja hacer, a qué se puede limitar y qué política lista lo tiene."
sidebar:
  order: 7.5
---

Una política es un conjunto de acciones permitidas, que aquí llamamos
permisos; el editor de políticas los lista por nombre bajo **Calidad de
datos** y **Administración**. Una cuenta con el rol **Administrador** puede
hacer todo sin ninguna política. Cómo se dan las políticas, y cuál dar para
cada trabajo, está en [Administrar usuarios y accesos](../manage-access/).

Las cinco políticas listas, con la marca **incluida** en el producto:
**Responsable** es `quality-steward`, **Analista** `quality-analyst`,
**Lector** `quality-viewer`, **Auditor** `auditor` y **Admin**
`quality-admin`.

## Calidad de datos

Un permiso con un recurso se puede limitar, en una política propia, a una
fuente o a un dataset: `source/` seguido del nombre de la fuente, o
`catalog/`, `dataset/` o `pipeline/` seguido del nombre del dataset, como
`pipeline/customers`.

| Permiso                        | Qué deja hacer                                                                                                                                    | Recurso    | Responsable | Analista | Lector | Auditor | Admin |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | :---------: | :------: | :----: | :-----: | :---: |
| **Ver fuentes**                | Ver las fuentes y sus tablas, y los **Registros** de una tabla (con los valores enmascarados sin **Ver datos personales**)                        | `source`   |      ✓      |    ✓     |        |    ✓    |   ✓   |
| **Administrar fuentes**        | Agregar, cambiar y quitar fuentes, y volver a listar las tablas del lago                                                                          | `source`   |      ✓      |          |        |         |   ✓   |
| **Ver ETL**                    | Nada en el producto lo usa todavía                                                                                                                | `etl`      |      ✓      |    ✓     |        |    ✓    |   ✓   |
| **Editar ETL**                 | Nada en el producto lo usa todavía                                                                                                                | `etl`      |      ✓      |          |        |         |   ✓   |
| **Ver datasets**               | Nada en el producto lo usa todavía                                                                                                                | `dataset`  |      ✓      |    ✓     |        |    ✓    |   ✓   |
| **Administrar datasets**       | Mapear una tabla, cambiar los campos de un mapeo, descartar un borrador y quitar un dataset; con **Aprobar reglas y mapeos**, desplegar y aprobar | `dataset`  |      ✓      |          |        |         |   ✓   |
| **Ver reglas**                 | Abrir, leer y probar las reglas de un dataset, sus borradores y su historial                                                                      | `catalog`  |      ✓      |    ✓     |   ✓    |    ✓    |   ✓   |
| **Editar reglas**              | Guardar un cambio de reglas como borrador                                                                                                         | `catalog`  |      ✓      |          |        |         |   ✓   |
| **Aprobar reglas y mapeos**    | Con **Administrar datasets**: desplegar, aprobar un borrador, borrar una regla, restaurar, deshacer e importar reglas                             | `catalog`  |      ✓      |          |        |         |   ✓   |
| **Ver pipelines**              | Ver los datasets y sus cortes en el Explorador, y las programaciones                                                                              | `pipeline` |      ✓      |    ✓     |   ✓    |    ✓    |   ✓   |
| **Editar pipelines**           | Fijar los ANS de remediación de un dataset                                                                                                        | `pipeline` |      ✓      |          |        |         |   ✓   |
| **Ejecutar pipelines**         | Ejecutar un corte ya                                                                                                                              | `pipeline` |      ✓      |    ✓     |        |         |   ✓   |
| **Programar pipelines**        | Crear, cambiar y quitar programaciones                                                                                                            | `pipeline` |      ✓      |          |        |         |   ✓   |
| **Ver resultados**             | Abrir el dashboard de un dataset y sus colas de remediación                                                                                       | `pipeline` |      ✓      |    ✓     |   ✓    |    ✓    |   ✓   |
| **Exportar resultados**        | Nada en el producto lo usa todavía                                                                                                                | `pipeline` |      ✓      |    ✓     |        |         |   ✓   |
| **Ver datos personales**       | Ver completos los valores de las fuentes, en **Probar**, **Registros** y la consola ([Datos personales](../personal-data-and-audit/))             | `pipeline` |             |    ✓     |        |         |   ✓   |
| **Consultar el lago con SQL**  | Abrir la **Consola SQL del lago**                                                                                                                 |            |      ✓      |          |        |         |   ✓   |
| **Administrar notificaciones** | Nada en el producto lo usa todavía                                                                                                                | `pipeline` |      ✓      |          |        |         |   ✓   |

## Administración

Estos permisos actúan sobre toda la instalación, así que no llevan recurso,
salvo **Administrar secretos**, que se puede limitar a un secreto con
`secret/` seguido de su nombre. Entre las políticas listas solo
`quality-admin` los tiene, y `auditor` tiene **Ver auditoría**.

| Permiso                              | Qué deja hacer                                                                                                                                                                                          | Auditor | Admin |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-----: | :---: |
| **Configurar (correo, LDAP, OAuth)** | Configurar el correo saliente, el inicio de sesión con el directorio de la empresa y con un proveedor externo ([Correo, inicio de sesión y actualizaciones](../administer-the-installation/)) |         |   ✓   |
| **Administrar usuarios**             | Registrar, editar y eliminar cuentas, y reenviar enlaces de activación                                                                                                                                  |         |   ✓   |
| **Administrar grupos y políticas**   | Crear grupos y políticas, y asignar políticas a personas y grupos                                                                                                                                       |         |   ✓   |
| **Administrar secretos**             | Registrar las conexiones y claves que se guardan cifradas en **Configuración**, **Secretos**                                                                                                            |         |   ✓   |
| **Ver auditoría**                    | Entrar a Grafana y leer el rastro de auditoría ([Datos personales y el rastro de auditoría](../personal-data-and-audit/#para-saber-quién-vio-qué))                                                      |    ✓    |   ✓   |
| **Administrar actualizaciones**      | Instalar actualizaciones y elegir cuándo se instalan                                                                                                                                                    |         |   ✓   |
| **Administrar máquinas**             | Aprobar, vaciar y retirar las máquinas que hacen el trabajo pesado, en **Configuración**, **Ejecución**                                                                                                 |         |   ✓   |

Algunas cosas no necesitan permiso: cualquiera que haya iniciado sesión
puede cambiar su propio perfil y sus cuentas vinculadas, y crear cuentas de
servicio para sus propias integraciones, que pueden hacer como mucho lo que
puede su dueño.

## Dos cosas para recordar

- **Desplegar necesita dos permisos.** **Aprobar reglas y mapeos** y
  **Administrar datasets** juntos; una política con solo **Editar reglas**
  guarda borradores que aprueba otra persona ([Llevar un cambio a
  main](../rules-to-main/#quién-puede-hacer-qué)).
- **Los valores necesitan su propio permiso.** Ninguna política lista,
  salvo `quality-analyst` y `quality-admin`, muestra los valores de las
  fuentes; a un responsable de datos que deba verlos, dale
  `quality-steward` y `quality-analyst` juntas.

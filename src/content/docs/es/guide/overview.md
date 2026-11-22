---
title: Introducción
description: Qué es Quality Data, por qué existe, quién lo usa, sus partes y a dónde ir después según quién lee.
sidebar:
  order: 1
---

**Quality Data mide la calidad de los datos de una organización.** Lee las
tablas de las bases de datos que la organización ya tiene, revisa cada
registro con reglas que escriben quienes conocen los datos y convierte los
resultados en indicadores que se pueden seguir y en colas de datos por
corregir. Solo lee: el dato se corrige donde vive, y la medición siguiente
muestra la corrección.

## Por qué existe

Casi toda organización sabe que sus datos tienen errores, pero no cuántos,
dónde ni si van mejorando. Quality Data cambia eso:

| Sin Quality Data                                                                          | Con Quality Data                                                                                                                     |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Las validaciones están repartidas entre pantallas de captura, reportes y hojas de cálculo | Cada validación es una regla en un solo catálogo: unas pocas líneas de texto que quien conoce el dato puede escribir, leer y revisar |
| Una validación alerta sobre algunos registros y nadie ve el panorama completo             | Cada regla corre sobre todos los registros de una tabla, y los resultados se suman en indicadores                                    |
| La calidad se mide a mano, de vez en cuando, y nadie puede repetir la medición            | Las mediciones corren según una programación; las fechas se comparan con la fecha de la medición, así que medir otra vez da lo mismo |
| Lo que hace una validación se va alejando de lo que dice su descripción                   | Cada regla se explica en palabras a partir de la misma definición que la ejecuta                                                     |
| Una regla cambia y nadie sabe quién la cambió ni por qué se movieron las cifras           | Una regla cuenta solo cuando se aprueba, y su historial guarda quién cambió qué y cuándo                                             |
| Los errores se corrigen en el orden en que alguien los nota                               | Los fallos se agrupan en colas de remediación por oficina, región o canal, cada una con un plazo                                     |

## Para quién es

Cada persona obtiene lo que necesita por las políticas que le asigna un
administrador. El producto trae políticas listas para los roles habituales:

| Rol                                                    | Qué hace en Quality Data                                                                                                                                     | Política                                                                        |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| Responsable de datos: escribe reglas y lee indicadores | Conecta fuentes, mapea tablas en datasets, escribe, prueba y aprueba reglas, ejecuta y programa mediciones y fija los plazos de las colas                    | `quality-steward`                                                               |
| Analista: atiende una cola de remediación              | Ve qué grupos tienen más hallazgos abiertos y su prioridad, y gestiona que los registros que fallan se corrijan en el sistema de origen                      | `quality-analyst`                                                               |
| Gerencia o cumplimiento                                | Lee los dashboards y los indicadores, nunca los valores de un registro                                                                                       | `quality-viewer`, o `auditor`, que además lee el rastro de auditoría en Grafana |
| Administrador                                          | Instala el producto y lo mantiene: cuentas de usuario, grupos y políticas, inicio de sesión, correo y las actualizaciones, en **Configuración**              | El rol `admin` de la instalación                                                |

Los valores leídos de una fuente llegan enmascarados. Quien tiene en sus
políticas el permiso de ver datos personales puede mostrarlos completos,
diciendo por qué, y cada vez que alguien los ve queda en el rastro de
auditoría con su motivo.

## Las partes

- **Explorador**, en la barra lateral: las fuentes y sus tablas, los
  datasets hechos a partir de ellas con sus **Cortes**, **Programaciones** y
  **Dashboard**, y el **Lago**, donde el producto guarda sus copias de los
  datos.
- **Fuentes**: las bases de datos que Quality Data lee, con sus credenciales
  guardadas selladas.
- **Reglas** y el editor de reglas: escribir una regla, verla dicha en
  palabras (**Así se lee**), probarla con datos reales (**Probar**) y llevarla a la
  versión aprobada directamente o con un borrador que alguien aprueba.
- **Cortes** y **Programaciones**: tomar los datos de un dataset en una
  fecha y medirlos, ya o según una programación.
- **Dashboard**: uno por dataset, con sus indicadores, sus gráficas y sus
  **Colas de remediación**.
- **Consola SQL del lago**: consultas de solo lectura sobre las copias de
  los datos que guarda el producto, en lenguaje de consulta estructurado
  (SQL), para los responsables de datos.
- **Configuración**: cuentas, grupos, políticas, inicio de sesión con el
  directorio de la empresa o un proveedor externo, correo y las
  actualizaciones.

Los indicadores que solo tienen sentido en un sector regulado son una parte
opcional del producto; esta guía describe el núcleo, que sirve a cualquier
organización, y un [módulo opcional](../sector-colombia-finance/) al final
cubre las entidades financieras vigiladas en Colombia.

## A dónde ir después

- **Todos:** lean primero [Conceptos](../concepts/). Recorre con un ejemplo
  la cadena que va de una fuente a una cola de remediación y define las
  palabras que usa el resto de la guía.
- **Administradores:** [Primeros pasos: administrador](../start-admin/)
  instala el producto y le da a un colaborador una cuenta y una política.
- **Responsables de datos:**
  [Primeros pasos: responsable de datos](../start-steward/) conecta una
  fuente, mapea una tabla y mide una primera regla; después, el
  [tutorial](../rule-tutorial/), [Lenguaje de reglas](../rule-language/),
  [Patrones de reglas](../rule-patterns/) y
  [Hallazgos del linter](../rule-files/).
- **Analistas que atienden una cola:**
  [Primeros pasos: analista](../start-analyst/) encuentra la cola de un
  grupo y dice qué hacer con ella hoy.
- **Gerencia y cumplimiento:**
  [Primeros pasos: indicadores](../start-reader/) abre un dashboard y lee
  sus primeros indicadores; después, [Cómo leer el dashboard](../charts/),
  [De los resultados a los indicadores](../indicators/) y los reportes de ejemplo de
  [Gráficas](../../charts/evolution/), hechos con datos inventados.
- **Para consultar algo:** las páginas de Tareas dicen cómo se hace cada
  cosa y quién la hace; las de Referencia, cada clave, patrón, hallazgo,
  fórmula, gráfica y permiso. Cada término subrayado muestra su significado
  al pasar el puntero, tocarlo o llegar a él con el teclado.
- **En papel:** [Descargar PDF](../../print/) reúne toda la guía en una
  página, para imprimirla o guardarla como PDF.

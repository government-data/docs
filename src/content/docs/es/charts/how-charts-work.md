---
title: Cómo se arman las gráficas
description: Las mismas gráficas para cualquier dataset, desde un modelo de resultados y los roles de sus campos.
sidebar:
  order: 0
---

Las gráficas de esta sección usan clientes como ejemplo, pero ninguna es
propia de clientes. Cada una es una consulta sobre un **modelo de
resultados** que toda evaluación escribe igual, para cualquier dataset:
clientes, pedidos, productos, proveedores. Debajo de cada gráfica,
**Consulta** dice qué parte de ese modelo la alimenta, y **Requiere**, qué
debe tener un dataset para que la gráfica aparezca.

## El modelo de resultados

| Parte                     | Una fila por                                                     | Qué guarda                                                                       |
| ------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Resumen del corte         | Dataset y corte                                                  | Índice global de calidad de datos (IGCD), registros, entidades, bandas           |
| Resultados por regla      | Dataset, corte y regla                                           | Aplica, fallos, conformidad                                                      |
| Calidad por campo         | Dataset, corte y campo                                           | Índice de confiabilidad del dato (ICD) medio, vacíos, distintos, forma más común |
| ICD por entidad           | Dataset, corte y entidad                                         | ICD, banda, segmento                                                             |
| Cifras por grupo          | Dataset, corte, campo de agrupación y grupo                      | Registros, registros con falla grave, ICD medio                                  |
| Pruebas de distribución   | Dataset, corte y variable                                        | Índice de estabilidad poblacional (PSI) por deciles, atípicos por grupo          |
| Hallazgos por cola        | Dataset, corte, cola y el corte en que se abrieron sus hallazgos | Hallazgos abiertos y resueltos, su prioridad                                     |
| Registro de la evaluación | Dataset, corte y etapa                                           | El tiempo de la etapa                                                            |

Solo guardan agregados; los registros individuales siguen detrás del permiso
de ver datos personales.

## Los roles que activan gráficas

Al mapear un dataset, algunos de sus campos toman un rol. Cada rol activa
las gráficas que lo necesitan:

| Rol                    | Ejemplo en clientes  | Ejemplo en pedidos       | Activa                                                                       |
| ---------------------- | -------------------- | ------------------------ | ---------------------------------------------------------------------------- |
| Llave de entidad       | Documento            | El documento del cliente | Distribución del ICD, transición entre bandas                                |
| Campo de agrupación    | Oficina, asesor      | Tienda, producto, canal  | Carta p′, grupos más grandes, grupos que más cambiaron, colas de remediación |
| Segmento               | Tipo de cliente      | Tipo de pedido           | Estado y problemas por segmento                                              |
| Fecha de actualización | Última actualización | Fecha del último cambio  | Antigüedad de la actualización                                               |
| Importe de atípicos    | Ingresos totales     | Monto del pedido         | Atípicos                                                                     |
| Variable de deriva     | Ingresos, edad       | Precio, días de entrega  | PSI por deciles                                                              |

Las gráficas que no necesitan nada (conformidad e IGCD por corte,
conformidad por regla, campos con menor ICD, perfilado, tiempo por etapa)
aparecen en todos los datasets. Una gráfica más pertenece a un indicador
sectorial opcional: ver el [módulo para entidades financieras vigiladas en
Colombia](../../guide/sector-colombia-finance/).

## Una definición, todos los lugares

El dashboard de cada dataset se arma solo con las gráficas cuyos requisitos
cumple.

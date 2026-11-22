---
title: Supuestos y límites
description: Qué supone el método, qué parámetros son fijos y qué no miden los indicadores.
sidebar:
  order: 11
---

Toda cifra que muestra Quality Data descansa en unos pocos supuestos.
Conocerlos dice hasta dónde se puede confiar en una cifra y qué no puede
decir.

## Qué supone el método

- **Las reglas son los requisitos.** Un indicador es tan bueno como las
  reglas que lo producen. Una regla demasiado estricta hace ver mal un dato
  bueno; una regla que falta deja un error sin ver. Las reglas que se
  proponen al mapear una tabla (`required`, `unique`, `format` a partir de
  una muestra) son una primera versión para que la revise quien conoce los
  datos, no un veredicto.
- **El corte es el momento medido.** Toda fecha se compara con la fecha del
  corte, nunca con hoy. Una cifra dice cómo estaban los datos en esa fecha:
  para ver una corrección, evalúa un corte nuevo.
- **Lo que una regla no aplica queda fuera.** Una regla que aplica a pocos
  registros da una conformidad que se mueve mucho de un corte a otro: lee
  su conteo antes que su tasa.
- **El mapeo dice qué importa.** Las prioridades de los campos, la llave de
  entidad, la fecha de actualización y los campos que caducan se fijan al
  mapear la tabla, sobre todo a partir de los nombres de las columnas.
  Pesan en todos los indicadores, y hoy no se pueden cambiar desde una
  pantalla: si alguno está mal, pídeselo a quien da soporte a tu
  instalación. Ver [Mapear una tabla en un dataset](../map-a-table/).

## Parámetros fijos

Estos valores son los mismos para todo dataset, y hoy ningún ajuste los
cambia:

| Parámetro                                                           | Valor                                                               |
| ------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Pesos de severidad                                                  | Bloqueante 1,0; mayor 0,6; menor 0,3                                |
| Pesos de los componentes del índice de confiabilidad del dato (ICD) | Conformidad 0,40; consistencia 0,15; actualidad 0,15                |
| Pesos de prioridad del campo                                        | Crítica 4, alta 3, media 2, baja 1                                  |
| Actualidad                                                          | Pierde la mitad de su valor por año sin actualizar                  |
| Límites de las bandas                                               | Buen estado desde 0,90; malo por debajo de 0,75                     |
| Límite de atípico                                                   | Un z robusto de más de 3,5 hacia cualquier lado                     |
| Lectura del índice de estabilidad poblacional (PSI)                 | Estable por debajo de 0,10; deriva significativa por encima de 0,25 |

Lo que sí se puede fijar es el plazo de cada cola de remediación, su
acuerdo de nivel de servicio (ANS): 30 días salvo que quien puede editar el
dataset fije otro.

## Lo que los indicadores no miden

- **Si un valor es cierto.** Sin una fuente externa con qué comparar, la
  exactitud se aproxima con plausibilidad (`range`, `placeholder`): un
  valor falso pero creíble pasa.
- **La antigüedad de datos sin fecha de actualización.** La actualidad
  necesita un campo con la fecha de actualización y solo se aplica a los
  campos marcados como que caducan. Sin ellos, un valor viejo cuenta como
  uno actual.
- **Por qué falla un registro.** Una regla puede declarar una `cause`
  (captura o sistémica), pero ningún indicador ni cola la usa todavía: las
  colas se separan por grupo, no por causa.
- **Una entidad entre datasets.** El ICD de un cliente se calcula dentro de
  un dataset. El mismo cliente en dos datasets tiene dos puntajes
  separados.
- **Si un atípico es un error.** La gráfica de atípicos encuentra importes
  raros para su grupo; distinguir un error probable de un valor legítimo
  queda en manos de quien lo revisa.
- **Cuánto lleva abierto un hallazgo.** Los hallazgos todavía no pasan de
  un corte al siguiente: todo hallazgo abierto cuenta desde el corte
  mostrado, así que **Vencidos** y **Resueltos en este corte** dan 0.
- **Tendencias en el primer corte.** Los movimientos entre bandas, los
  grupos que cambiaron y el PSI comparan con el corte evaluado anterior,
  así que en el primer corte no tienen qué mostrar.

Cómo se calcula cada cifra está en [Formulaciones](../formulas/); cómo
leerla, en [De los resultados a los indicadores](../indicators/).

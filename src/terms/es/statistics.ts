import { concept } from "../types";

// Concepts of statistics and of storing data, from the old glossary
// (es/guide/glossary.md), shortened to a sentence or two.
export const statistics = [
  concept(
    "cardinalidad",
    "Cuántos valores distintos tiene una columna. Un número de documento debería tener tantos valores como clientes; un campo «sí/no», solo dos.",
  ),
  concept(
    "decil",
    "Los deciles parten los datos en 10 grupos con la misma cantidad de registros.",
    ["deciles"],
  ),
  concept(
    "deriva",
    "Cambio en cómo se distribuye un dato entre periodos o lotes. Puede ser un cambio real del mercado o un error en la carga; se mide con el PSI.",
  ),
  concept(
    "atípico de error",
    "Valor fuera de la distribución que además es incorrecto (dígitos de más, fecha imposible). Se corrige o se pone en cuarentena.",
    ["atípicos de error"],
  ),
  concept(
    "atípico legítimo",
    "Valor infrecuente pero correcto (patrimonio alto, actividad poco común). Se preserva en la base y se excluye de los estimadores.",
    ["atípicos legítimos"],
  ),
  concept(
    "logaritmo",
    "Transformación que cuenta «cuántos ceros» tiene un número: log10 de 1.000.000 es 6. Se usa con los ingresos para que pasar de 1 a 2 millones pese lo mismo que pasar de 10 a 20.",
    ["logaritmos"],
  ),
  concept(
    "mediana",
    "El valor del medio cuando se ordenan los datos. A diferencia del promedio, no se deja arrastrar por unos pocos valores extremos.",
  ),
  concept(
    "rango móvil",
    "En la carta p′, la diferencia entre el puntaje de cada oficina y el de la anterior; su promedio dividido entre 1,128 da σz, cuánto más varían las oficinas entre sí de lo que explicaría el azar.",
  ),
  concept(
    "formato de tabla abierta",
    "Forma de guardar tablas grandes en archivos comunes (Parquet) con una capa que registra cada cambio, de modo que se comportan como una base de datos: ver la base como estaba en una fecha pasada, deshacer una carga equivocada y leer solo la parte necesaria.",
    ["formatos de tabla abierta", "tablas abiertas"],
  ),
  concept(
    "carta p",
    "Gráfico de control para proporciones: compara la tasa de fallos de cada grupo con límites p̄ ± 3σ que dependen de su tamaño.",
    ["cartas p"],
  ),
  concept(
    "carta p′",
    "Variante de Laney de la carta p para grupos muy grandes: multiplica los límites por σz, la dispersión real entre grupos, para que solo destaquen las diferencias que no explica la variación normal.",
    ["cartas p′"],
  ),
  concept("Parquet", "Formato de archivo para tablas grandes, comprimido y rápido de leer."),
  concept(
    "percentil",
    "El percentil 99 (P99) es el valor bajo el cual queda el 99 % de los datos.",
    ["percentiles"],
  ),
  concept(
    "perfilado",
    "Análisis descriptivo de cada columna: nulos, cardinalidad, patrones y distribución.",
  ),
  concept(
    "z robusto",
    "A cuántas distancias típicas está un dato del valor normal de su grupo: 0,6745 × (dato − mediana) / MAD; robusto porque usa la mediana y la MAD. Por encima de 3,5 el dato se marca como atípico.",
  ),
  concept(
    "time travel",
    "Capacidad de las tablas abiertas de consultar el estado de los datos en una fecha anterior, para auditoría.",
  ),
  concept(
    "reglas Western Electric",
    "Reglas para detectar descontrol en cartas de control (puntos fuera de 3σ, rachas de un mismo lado, tendencias).",
    ["Western Electric"],
  ),
];

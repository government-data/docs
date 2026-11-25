---
title: Cómo leer el dashboard
description: Qué responde cada gráfica del dashboard de un dataset, cómo leerla y qué hacer con ella.
sidebar:
  order: 5.5
---

Cada dataset tiene un dashboard: el **Dashboard** bajo el dataset en el
**Explorador** y la pestaña **Calidad** de cada tabla que el dataset lee. Esta
página recorre cada gráfica, en el orden en que aparecen, para quienes actúan
sobre ellas: responsables de datos, la mesa de calidad y la gerencia. Cómo
se calcula cada cifra, con un ejemplo de cada gráfica hecho con datos
inventados, está en [Formulaciones](../formulas/).

## Antes de leer una gráfica

- **El corte.** El selector **Corte**, arriba, lista los cortes evaluados del
  dataset, el más reciente primero. Todas las gráficas muestran el corte
  elegido. Las que comparan (transiciones de banda, grupos que más
  cambiaron, el índice de estabilidad poblacional (PSI), el tiempo por etapa frente al anterior) lo comparan con el
  **corte evaluado anterior**, no con el mes pasado ni con hoy.
- **Las antigüedades se cuentan al corte, nunca a hoy.** "Hasta 30 días",
  "vencidos" y el hallazgo abierto más antiguo se miden desde la fecha del
  corte. Un corte viejo sigue diciendo lo que dijo en su día.
- **No todas las gráficas aparecen.** Una gráfica sale solo si el dataset
  tiene lo que necesita: una llave de entidad, un segmento, un campo de
  agrupación (oficina, asesor, producto), una fecha de actualización, un
  importe de atípicos o una variable de deriva. Mapear una tabla propone
  esos roles a partir de sus campos y los publica con el mapeo; la
  aplicación aún no tiene un editor de mapeo para cambiarlos. Las gráficas
  que no necesitan nada salen en todo dataset.
- **"sin datos en este corte".** La gráfica existe para el dataset, pero el
  corte no le dio filas: por ejemplo, el primer corte no tiene con qué
  compararse, o ninguna entidad tiene banda. No es un cero. Si el dashboard
  dice que aún no se ha evaluado ningún corte, ejecuta uno desde **Cortes**.
- **Valores y tablas.** Pasa el puntero (o el tabulador) por una barra,
  punto o columna para ver su valor y qué es. El dibujo muestra como mucho
  los quince peores; la tabla bajo cada figura tiene todas las filas. Una
  etiqueta larga se corta en el dibujo y sale completa en la tabla. Un valor
  que falta es un hueco o "—", nunca un cero.
- **Una figura por campo de agrupación.** Las gráficas por grupo se dibujan
  una vez por campo de agrupación (o por variable de deriva), con su nombre: "Carta
  p′ por grupo · Oficina", "Carta p′ por grupo · Canal".

## Conformidad e IGCD por corte

**Pregunta:** ¿la calidad mejora? **Qué se ve:** una línea por medida en los
últimos doce cortes hasta el elegido: **Conformidad** (azul), la proporción
de revisiones de reglas que pasaron, e **IGCD** (naranja), el
índice global de calidad de datos: el índice de confiabilidad del dato (ICD)
promedio de todas las entidades
([Formulaciones §4](../formulas/#4-conformidad-e-igcd-por-corte) y
[§8](../formulas/#8-icd-del-registro-y-de-la-entidad-e-igcd)). La tabla agrega
registros y fallos por corte.

**Cómo leerla.** Subir es bueno. El eje vertical no empieza en cero, así que
un paso pequeño se ve grande: mira la tabla antes de hablar de un cambio. Un
salto acompañado de un salto en registros suele ser otra población (una
fuente nueva, una migración), no mejor captura. Antes de un corte con ICD, la
línea del IGCD es un hueco.

## Fallos por dimensión y severidad

**Pregunta:** ¿qué tipo de problema domina? **Qué se ve:** barras de fallos
por dimensión de calidad (completitud, validez, consistencia…) y severidad
(bloqueante, mayor, menor), la mayor primero; las grises no tienen fallos. Un
fallo es un registro que falla una regla: un registro que falla tres reglas
cuenta tres.

**Cómo leerla.** Primero los bloqueantes y mayores. Muchos fallos de
completitud apuntan al formulario de captura o a la fuente; muchos de
actualidad, a una campaña de actualización, no a las oficinas.

## Campos con más fallos

**Pregunta:** ¿dónde están los fallos? **Qué se ve:** barras de fallos por
campo: los de cada regla cuentan bajo el campo que la regla revisa; la tabla
agrega cuántas reglas lo revisan y cuántas revisiones hicieron.

**Cómo leerla.** Un campo con muchos fallos y muchas reglas puede ser
simplemente el más verificado: compáralo con _Reglas con menor conformidad_
antes de decidir por dónde empezar.

## Campos con menor ICD

**Pregunta:** ¿qué datos son menos confiables? **Qué se ve:** barras con el
ICD promedio de cada campo, de 0 a 1, el menor primero
([Formulaciones §7](../formulas/#7-icd-de-un-campo)).

**Cómo leerla.** A diferencia del conteo de fallos, el ICD pondera la
severidad y, en los campos que vencen, la antigüedad del dato. Un campo bajo
aquí pero con pocos fallos suele estar **viejo** más que mal: necesita
actualización, no corrección.

## Distribución del ICD por entidad

**Pregunta:** ¿cómo se reparten los clientes (o la entidad que sea) según su
calidad? **Qué se ve:** columnas que cuentan entidades en tramos de 0,05 de 0
a 1, con líneas en **0,75** y **0,90**, los límites de las bandas
([Formulaciones §8](../formulas/#8-icd-del-registro-y-de-la-entidad-e-igcd)).

**Cómo leerla.** A la derecha de 0,90 está la banda buena, entre las líneas
la regular, a la izquierda de 0,75 la mala. Una pila alta justo a la
izquierda de una línea es barata de mover: pocas correcciones por entidad le
cambian la banda. Un segundo montículo muy a la izquierda suele tener una
sola causa (un segmento, una fuente).

## Estado de los datos por segmento

**Pregunta:** ¿un tipo de entidad está peor que otro? **Qué se ve:** una
barra por segmento (por ejemplo, persona natural y empresa), partida en
**Buen estado (ICD ≥ 0,90)** en verde, **Regular (0,75–0,90)** en ámbar y
**Malo (< 0,75)** en rojo, como proporciones; la tabla tiene los conteos.

**Cómo leerla.** Un segmento mucho más rojo que los demás suele fallar en
campos que sus registros no traen: un problema del proceso, que se corrige en
la fuente y no caso por caso. Un segmento pequeño puede verse extremo con
pocas entidades: lee su conteo en la tabla.

## Cómo se movieron las entidades entre bandas

**Pregunta:** ¿a dónde fueron las entidades desde el corte anterior? **Qué
se ve:** una cuadrícula con la banda del corte anterior en las filas y la de
este corte en las columnas; cada casilla cuenta las entidades que pasaron de
una a otra, emparejadas por una llave anónima.

**Cómo leerla.** La diagonal se quedó igual. Las casillas por encima (hacia
Buen estado) mejoraron; las de abajo empeoraron. Un flujo grande de Buen
estado a Regular sin errores nuevos suele ser dato que **vence**
(actualidad). Necesita dos cortes evaluados; las entidades que están solo en
uno no cuentan.

## Indicador SFC

Esta gráfica sale solo para un dataset que participa en el indicador de
la Superintendencia Financiera de Colombia (SFC), el supervisor financiero del país. Se describe en el [módulo opcional para
entidades financieras vigiladas en
Colombia](../sector-colombia-finance/#cómo-leer-la-gráfica-del-indicador-sfc).

## Carta p′ por grupo

**Pregunta:** ¿esta oficina (asesor, canal) falla más de lo normal o es
ruido? **Qué se ve:** un punto por grupo: a lo ancho, su número de
registros; a lo alto, su proporción de registros con una **falla grave**
(una regla bloqueante o mayor que falla en un campo crítico o alto). La
línea horizontal es el promedio del campo de agrupación (p̄); las dos curvas son los
límites de control, anchos para grupos pequeños y estrechos para los grandes
([Formulaciones §12](../formulas/#12-carta-p-por-grupo)). Los puntos grises
están en control, los rojos ✕ por encima del límite superior, los verdes ✓
por debajo del inferior. Los registros con el campo de agrupación vacío quedan fuera.

**Cómo leerla.** Solo los puntos fuera de las curvas son señales. Por
encima: busca la causa en ese grupo (proceso, formulario,
capacitación). Por debajo: algo se hace mejor y vale la pena copiarlo. Entre
las curvas: variación normal, sin acción, por más que el ranking diga otra
cosa. No ordenes los grupos por altura: un grupo pequeño muy arriba puede
seguir dentro de sus límites anchos. Las fallas graves aún incluyen las
sistémicas (actualizaciones vencidas, catálogos), que la oficina no puede
corregir; todos los grupos de un campo desplazados hacia arriba a la vez
apuntan a la fuente.

## Grupos más grandes

**Pregunta:** ¿dónde están la mayoría de los registros? **Qué se ve:**
barras de registros de los quince grupos más grandes de cada campo de agrupación,
incluido el grupo vacío como "(vacío)"; la tabla agrega la proporción con
falla grave y el ICD promedio de cada uno.

**Cómo leerla.** Léela con la carta p′: un grupo grande con una proporción
algo peor mueve más registros que uno pequeño con una mucho peor. Un
"(vacío)" grande es en sí mismo un problema de captura.

## Grupos que más cambiaron

**Pregunta:** ¿qué grupos se movieron desde el corte anterior? **Qué se
ve:** barras a la derecha (peor) o a la izquierda (mejor) del cero, en
puntos porcentuales de su proporción con falla grave, de los quince que más
se movieron; la tabla tiene la proporción en ambos cortes. "Sin cambios
desde el corte anterior." significa que ninguno se movió.

**Cómo leerla.** Señala dónde mirar, no a quién culpar: un grupo puede caer
porque recibió registros de otro. Los grupos pequeños se mueven mucho por
azar; revisa la carta p′ antes de actuar.

## Atípicos por grupo

**Pregunta:** ¿hay importes raros para su grupo? **Qué se ve:** para el
importe de atípicos (ingresos, monto del crédito) y cada campo de agrupación, barras de
los grupos con atípicos: los bajos en naranja, los altos en azul. Un importe
es atípico cuando su z robusto dentro de su grupo pasa de 3,5 hacia arriba o
hacia abajo ([Formulaciones §16](../formulas/#16-atípicos-z-robusto-y-mad)).
Solo cuentan los importes positivos. "ningún grupo tiene atípicos" significa
que no hay.

**Cómo leerla.** Un atípico no es por sí mismo un error: la gráfica aún no
distingue un error probable de un valor legítimo. Revisa los grupos con la
mayor proporción, corrige los errores (dígitos de más, otra unidad) y
conserva los legítimos. En un grupo con pocos importes la mediana es
inestable: lee el conteo en la tabla.

## PSI por deciles

**Pregunta:** ¿cambió la población de este corte frente al anterior? **Qué
se ve:** para cada variable de deriva, diez pares de columnas: el corte
anterior partido en diez tramos del mismo tamaño (gris, cerca de 10 % cada
uno) y la proporción de este corte en esos mismos tramos (azul). La nota da
el PSI y su lectura: **estable** por debajo de 0,10, **deriva moderada** de
0,10 a 0,25, **deriva significativa** por encima
([Formulaciones §17](../formulas/#17-deriva-índice-de-estabilidad-poblacional-psi)).

**Cómo leerla.** Columnas azules parecidas a las grises es lo bueno. Si el
azul se amontona en un extremo, la población se movió: cada registro puede
ser válido y el lote, aun así, sospechoso. Con deriva moderada, revisa el
lote antes de usarlo; con deriva significativa, busca la causa (una fuente
nueva, un cambio de unidad, un error de carga). Las proporciones se leen al
1 % más cercano, así que un PSI cercano a 0 es aproximado. Necesita un corte
evaluado anterior.

## Colas de remediación

**Pregunta:** ¿cuánto espera en la cola de cada grupo y cuánto va tarde?
**Qué se ve:** para cada campo de agrupación, columnas de los quince grupos con más
hallazgos **abiertos** (azul) y los **vencidos** (rojo). Un hallazgo es un
registro que falla una regla; está vencido cuando los días desde el corte en
que falló por primera vez hasta el corte mostrado superan el acuerdo de nivel de servicio (ANS) de su cola.
La tabla agrega los hallazgos **resueltos en este corte**, la antigüedad en
días del **abierto más antiguo**, el **ANS** y la **prioridad** sumada de
los abiertos
([Formulaciones §15](../formulas/#15-prioridad-y-colas-de-remediación)).

**Cómo leerla.** Lo rojo es lo primero que se persigue; una prioridad sumada
alta con pocos hallazgos significa unos pocos costosos. Un hallazgo se
resuelve solo cuando un corte posterior deja de fallarlo: las correcciones se
ven en el siguiente corte evaluado, no antes. Con cortes mensuales, un ANS
menor a un mes se lee como vencido en el primer corte que siga fallando.

**El ANS.** El ANS de cada cola es un número de días, fijado por campo de
agrupación con una excepción opcional por grupo; sin ninguno son 30 días. Lo fija quien
puede editar el pipeline del dataset, y cada cambio queda auditado.
Cambiarlo no requiere una nueva evaluación: la gráfica lo aplica al leerse.
Quien puede editar el pipeline lo fija en el formulario **ANS de remediación** bajo el
dashboard: un valor por campo de agrupación (en blanco quedan 30 días) y los grupos que
difieren, de 1 a 365 días; al guardar se vuelve a dibujar la gráfica de colas.

Mientras los hallazgos aún no pasan de un corte al siguiente, cada hallazgo
abierto cuenta desde el corte mostrado, así que **Vencidos** y **Resueltos**
marcan 0.

## Antigüedad de la actualización

**Pregunta:** ¿qué tan viejos son los datos? **Qué se ve:** barras de
registros según cuánto antes del corte fue su fecha de actualización:
posterior al corte, hasta 30 días, 31–90, 91–180, 181–365, 366–730, más de
730 días y sin fecha; como proporciones
([Formulaciones §11](../formulas/#11-antigüedad-de-la-actualización)).

**Cómo leerla.** Un dato puede ser correcto y aun así viejo: en los campos
que caducan, la actualidad (A) del ICD baja desde el primer día y vale la
mitad al año. Una proporción grande de más de un año pide una campaña de actualización. Las fechas **posteriores al corte**
son sospechosas (formato equivocado, una fecha por defecto): revisa cómo se
capturan.

## Campos más vacíos

**Pregunta:** ¿qué campos faltan más? **Qué se ve:** barras con el
porcentaje vacío de cada campo, el más vacío primero; la tabla agrega los
valores distintos y la forma más común (cada dígito un `9`, cada letra de la
A a la Z una `A`) con su porcentaje de los llenos.

**Cómo leerla.** Un campo vacío puede ser opcional: compáralo con las reglas.
Una forma más común muy por debajo del 100 % sugiere formatos mezclados; un
código que perdió su cero a la izquierda aparece aquí como una forma más
corta. Es perfilado: no muestra valores, solo formas.

## Reglas con menor conformidad

**Pregunta:** ¿qué reglas se cumplen menos? **Qué se ve:** barras con la
conformidad de cada regla, de 0 a 100 %, la menor primero; las reglas que
no aplicaron a ningún registro quedan fuera del dibujo y salen con "—" en la
tabla, que además tiene el campo, la dimensión, la severidad, a cuántos
registros aplica y los fallos
([Formulaciones §3](../formulas/#3-conformidad-de-una-regla)).

**Cómo leerla.** Una conformidad baja significa que el dato está mal o que
la regla está mal planteada. Revisa las más bajas con el dueño de la regla
antes de corregir miles de registros. Una regla que aplica a pocos registros
oscila mucho entre cortes.

## Tiempo por etapa

**Pregunta:** ¿la evaluación se vuelve más lenta para el volumen que
procesa? **Qué se ve:** una barra por etapa de la evaluación (cargar el
corte, ejecutar las reglas, perfilar, ICD y grupos, colas de remediación,
recencia de actualización, distribuciones) en milisegundos por millón de
registro-atributos (registros × campos mapeados); la tabla agrega el tiempo
simple y el del corte anterior
([Formulaciones §19](../formulas/#19-tiempo-por-etapa)). Sin
volumen, las barras son milisegundos simples.

**Cómo leerla.** Compara una etapa con su valor anterior por millón, no en
tiempo simple: una base más grande tarda más sin ser más lenta. Ejecutar las
reglas suele dominar.

## Errores comunes

- **Grupos pequeños.** Un grupo con pocos registros oscila por azar. Confía
  en los límites de la carta p′, no en el ranking, y lee los conteos en las
  tablas.
- **El primer corte.** Las transiciones de banda, los grupos que más
  cambiaron y el PSI necesitan un corte evaluado anterior: en el primero
  dicen "sin datos en este corte".
- **Corte frente a hoy.** Todo se mide a la fecha del corte. Para ver el
  efecto de las correcciones, evalúa un corte nuevo.
- **Fallos frente a registros.** Los conteos de fallos suman revisiones
  de reglas; las proporciones de la carta p′ y de las colas son de registros
  o de hallazgos.
- **Sin datos personales.** El dashboard muestra solo agregados.

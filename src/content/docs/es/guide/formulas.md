---
title: Formulaciones
description: Cómo se calculan la conformidad, el ICD, el IGCD, las bandas, la prioridad y las pruebas estadísticas.
sidebar:
  order: 5
---

Notación: $i$ = registro, $e$ = entidad, $a$ = campo, $r$ = regla, $k$ =
componente del ICD (índice de confiabilidad del dato), $\mathbf{1}[\cdot]$ = 1 si la condición se cumple y 0
si no. Los pesos, severidades y umbrales de abajo son fijos en el producto
hoy. Qué significa cada cifra está en [De los resultados a los
indicadores](../indicators/); cómo se ve en el dashboard de un dataset, en
[Cómo leer el dashboard](../charts/).

## 1. Conformidad de una regla

$$
\text{conformidad}_r = 1 - \frac{\text{fallos}_r}{\text{aplica}_r}
$$

$\text{aplica}_r$ cuenta solo los registros a los que aplica la regla; por
ejemplo, una regla sobre el representante legal aplica solo a personas
jurídicas. La conformidad general, en la tendencia por corte, suma fallos y
aplicaciones de todas las reglas.

## 2. Componentes del ICD por campo

$$
\begin{aligned}
s_r &= \begin{cases} 1{,}0 & \text{Bloqueante}\\ 0{,}6 & \text{Mayor}\\ 0{,}3 & \text{Menor} \end{cases}\\[6pt]
C_{a,i} &= 1 - \frac{\sum_{r \in \text{campo}(a)} s_r\,\mathbf{1}[\text{falla}_{r,i}]}{\sum_{r \in \text{campo}(a),\ \text{aplica}} s_r}
  && \text{conformidad de las reglas del propio campo}\\[4pt]
S_{a,i} &= 1 - \frac{\sum_{r \in \text{cruce}(a)} s_r\,\mathbf{1}[\text{falla}_{r,i}]}{\sum_{r \in \text{cruce}(a),\ \text{aplica}} s_r}
  && \text{consistencia con otros campos}\\[4pt]
A_{a,i} &= \begin{cases} 0{,}5^{\,d_i/365} & a \text{ caduca}\\ \text{no aplica} & \text{en los demás} \end{cases}
\end{aligned}
$$

$\text{campo}(a)$ son las reglas que leen solo el campo $a$;
$\text{cruce}(a)$, las que leen $a$ y otros campos, que cuentan en el $S$
de cada campo que leen. $d_i$ son los días desde la fecha de actualización
del registro hasta el corte, nunca menos de 0. $A$ pierde la mitad de su
valor por cada año sin actualizar, y solo se aplica a los campos marcados
como que caducan (datos de contacto, ingresos, un empleador…) y solo si el
dataset tiene fecha de actualización; un documento de identidad o una fecha
de nacimiento no pierden validez con el tiempo.

## 3. ICD e IGCD

$$
\begin{aligned}
\text{ICD}_{a,i} &= \frac{\sum_{k} w_k\, x_{k,a,i}}{\sum_{k} w_k},
  \qquad (w_C, w_S, w_A) = (0{,}40,\ 0{,}15,\ 0{,}15)\\[6pt]
\text{ICD}_i &= \frac{\sum_a c_a\, \text{ICD}_{a,i}}{\sum_a c_a},
  \qquad c_a = 4\ (\text{crítico}),\ 3\ (\text{alto}),\ 2\ (\text{medio}),\ 1\ (\text{bajo})\\[6pt]
\text{ICD}_{a,e} &= \begin{cases} \min_{i \in e} \text{ICD}_{a,i} & a \text{ crítico}\\ \operatorname{media}_{i \in e} \text{ICD}_{a,i} & \text{en los demás} \end{cases},
  \qquad \text{ICD}_e = \frac{\sum_a c_a\, \text{ICD}_{a,e}}{\sum_a c_a}\\[6pt]
\text{IGCD} &= \frac{1}{N} \sum_{e=1}^{N} \text{ICD}_e\\[6pt]
\text{Banda}_e &= \begin{cases}
  \text{Buen estado} & \text{ICD}_e \ge 0{,}90\\
  \text{Regular} & 0{,}75 \le \text{ICD}_e < 0{,}90\\
  \text{Malo} & \text{ICD}_e < 0{,}75
\end{cases}
\end{aligned}
$$

Un componente sin datos para un registro (ninguna regla aplica, o el campo
no caduca) sale de la suma y los demás pesos se renormalizan; un campo sin
ningún componente no tiene ICD en ese registro y sale de la suma del
registro. Una entidad $e$ es el conjunto de registros que comparten la
llave de entidad; $N$ es el número de entidades con ICD. El IGCD (índice
global de calidad de datos) es su media. Sin llave de entidad, el IGCD es la media del ICD de los registros, y no hay bandas.

## 4. Prioridad

$$
\text{Prioridad}_{i,r} = \max_{a \in \text{lee}(r)}\ \underbrace{\frac{c_a}{4}\,\left(1 - \text{ICD}_{a,i}\right)}_{\text{impacto de negocio}} \times \text{cercanía}_a
$$

Cada hallazgo, un registro $i$ que falla una regla $r$, toma el término
más alto entre los campos que lee la regla. $\text{cercanía}_a$ vale 0,2
para todo campo, salvo que el dataset participe en un indicador sectorial
que pondere los campos por su cercanía a un umbral (ver el [módulo
opcional para entidades financieras vigiladas en
Colombia](../sector-colombia-finance/#cercanía-al-umbral-y-prioridad)). La
prioridad de una cola es la suma de la de sus hallazgos abiertos.

## 5. Carta p′ por grupo

$$
\begin{aligned}
p_g &= \frac{\text{graves}_g}{n_g}, \qquad \bar{p} = \frac{\sum_g \text{graves}_g}{\sum_g n_g}, \qquad
  \sigma_g = \sqrt{\frac{\bar{p}\,(1 - \bar{p})}{n_g}}, \qquad z_g = \frac{p_g - \bar{p}}{\sigma_g}\\[6pt]
\sigma_z &= \frac{\overline{MR}(z)}{1{,}128}, \qquad
  \text{LCS}_g,\ \text{LCI}_g = \bar{p} \pm 3\,\sigma_g\,\sigma_z \qquad (\text{carta } p' \text{ de Laney})
\end{aligned}
$$

$p_g$ es la proporción de los registros del grupo $g$ con una **falla
grave**: una regla bloqueante o mayor que falla sobre un campo crítico o
alto. Con grupos de miles de registros, los límites binomiales simples casi
desaparecen y todo grupo sale fuera de control; $\sigma_z$, la dispersión
real entre grupos medida con el rango móvil de $z$ sobre los grupos
ordenados por tamaño, los ensancha. El límite inferior nunca baja de 0. Hay
señal si $p_g$ sale de sus límites. Los registros con el campo de
agrupación vacío quedan fuera.

## 6. Atípicos: z robusto y MAD

**En palabras:** para cada grupo de un campo de agrupación se toma el
importe típico (la **mediana**) y qué tanto se apartan normalmente de él
(la **MAD**, desviación absoluta mediana). El **z robusto** dice a cuántas
de esas distancias típicas está cada importe: 0 es normal, y más de 3,5
hacia arriba o hacia abajo es atípico. Se usan mediana y MAD, y no promedio
y desviación estándar, porque unos pocos importes enormes moverían el
promedio y esconderían justamente los casos raros. El logaritmo hace que el
doble pese lo mismo en cualquier nivel. Solo cuentan los importes
positivos.

$$
\begin{aligned}
x_i &= \log_{10}\left(\text{importe}_i\right), \qquad
\text{MAD}_g = \operatorname{mediana}_{i \in g} \left| x_i - \tilde{x}_g \right|\\[6pt]
z_i &= \frac{0{,}6745\,\left(x_i - \tilde{x}_g\right)}{\max\left(\text{MAD}_g,\ 0{,}10\right)},
  \qquad \text{atípico} \iff |z_i| > 3{,}5
\end{aligned}
$$

**Ejemplo.** Con importes de 1; 1,1; 1,2; 1,3 y 50 mil, la mediana es 1,2
mil. Las distancias a ella son 0,2; 0,1; 0; 0,1 y 48,8, y su mediana, la
MAD, es 0,1 mil. El valor extremo no la infla, y por eso sirve para
encontrar atípicos: un promedio de 10,9 mil no describiría a ninguno.
Tomados en logaritmo, como arriba, la MAD queda por debajo de 0,10 y se usa
el piso: 50 mil da un z robusto de cerca de 10,9, atípico, y los otros
cuatro quedan a menos de 0,6 de cero.

## 7. Deriva: índice de estabilidad poblacional (PSI)

**En palabras:** el PSI (en inglés, _Population Stability Index_) compara
cómo se reparte un número en dos cortes, este y el anterior evaluado. El
corte anterior se divide en 10 tramos con la misma cantidad de registros;
si este corte se parece, también cae cerca del 10 % en cada tramo y el PSI
da casi 0. Cuanto más se concentra este corte en algunos tramos, más sube.
$e_k$ es la proporción del corte anterior en el tramo $k$ y $a_k$ la de
este.

$$
\text{PSI} = \sum_{k=1}^{10} \left(a_k - e_k\right) \ln\frac{a_k}{e_k}
\qquad \begin{cases}
  < 0{,}10 & \text{estable}\\
  0{,}10 \text{ a } 0{,}25 & \text{deriva moderada}\\
  > 0{,}25 & \text{deriva significativa}
\end{cases}
$$

## 8. Tiempo por etapa

$$
\text{tiempo por millón}_{\text{etapa}} = \frac{t_{\text{etapa}}}{V / 10^{6}}
$$

$t$ es el tiempo de la etapa en milisegundos y $V$ el volumen evaluado en
valores: registros × campos mapeados. Expresado por millón de valores, un
dataset más grande no parece una evaluación más lenta.

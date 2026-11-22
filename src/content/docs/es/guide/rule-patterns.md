---
title: Patrones de reglas
description: "Referencia de los catorce patrones del lenguaje de reglas: qué verifica cada uno, sus parámetros, su dimensión y severidad por defecto, cómo trata los vacíos y un ejemplo."
sidebar:
  order: 7.1
---

Un patrón es una forma de validar. La lista es cerrada: catorce patrones,
cada uno con sus parámetros. Lo que ninguno cubre se escribe como
`expression` y se revisa; si se repite, se vuelve un patrón o un formato
con nombre de Quality Data.

Todo patrón admite además las claves de toda regla (`when`, `population`,
`severity`, `cause`, `alert`, `examples`…), descritas en
[Lenguaje de reglas](../rule-language/#las-claves-de-toda-regla). Un
parámetro que el patrón no usa es un error del linter (`QR005`); uno que
necesita y le falta, otro (`QR006`).

| Patrón                        | Falla cuando                                 | Dimensión    | Severidad por defecto |
| ----------------------------- | -------------------------------------------- | ------------ | --------------------- |
| [`required`](#required)       | El valor está vacío o es un relleno          | Completitud  | Bloqueante            |
| [`empty`](#empty)             | El valor está diligenciado cuando no debe    | Consistencia | Mayor                 |
| [`placeholder`](#placeholder) | El valor es un relleno                       | Exactitud    | Mayor                 |
| [`length`](#length)           | El largo no está permitido                   | Validez      | Mayor                 |
| [`format`](#format)           | El valor no tiene su forma                   | Validez      | Mayor                 |
| [`domain`](#domain)           | El valor no está en su lista o su referencia | Validez      | Mayor                 |
| [`range`](#range)             | El valor está fuera de sus límites           | Exactitud    | Mayor                 |
| [`fresh`](#fresh)             | Una fecha es más vieja que su vigencia       | Actualidad   | Mayor                 |
| [`sum`](#sum)                 | Un total no coincide con sus partes          | Consistencia | Mayor                 |
| [`unique`](#unique)           | El valor se repite entre registros           | Unicidad     | Menor                 |
| [`combination`](#combination) | Una combinación de campos no está permitida  | Consistencia | Mayor                 |
| [`implies`](#implies)         | Se cumple una condición y no su consecuencia | Consistencia | Mayor                 |
| [`differs`](#differs)         | Dos campos tienen el mismo valor             | Consistencia | Menor                 |
| [`expression`](#expression)   | Se cumple una condición libre                | La suya      | Mayor                 |

**Los vacíos.** Qué cuenta como vacío, y por qué los demás patrones le
dejan los vacíos a `required`, está en [Lenguaje de reglas: lo que Quality
Data decide para toda
regla](../rule-language/#lo-que-quality-data-decide-para-toda-regla). Cada
sección dice con qué campos vacíos salta el patrón, y si `on_empty: fail`
los cuenta en su lugar.

## required

El campo tiene valor. Falla cuando está vacío o tiene uno de los rellenos
del dataset para su tipo (el motivo dice entonces "relleno").

- **Parámetros**: ninguno.
- **Vacíos**: son lo que busca. `on_empty` no aplica.

```yaml
- id: EMP-01
  field: Employer
  check: required
  when: Occupation = 'EMPLOYEE'
  alert: Falta la empresa de un empleado
```

El linter advierte cuando un campo tiene `required` y `placeholder`
(`QR022`): `required` ya cuenta los rellenos.

## empty

El campo no tiene valor donde no debe tenerlo. Falla cuando está
diligenciado.

- **Parámetros**: ninguno.
- **Vacíos**: un vacío pasa. Un relleno cuenta como diligenciado.
  `on_empty` no aplica.

```yaml
- id: EMP-02
  field: Employer
  check: empty
  when: Occupation = 'STUDENT'
  alert: Un estudiante tiene empresa
```

## placeholder

El valor no es un relleno, como `UPDATE` o `1900-01-01`.

- **Parámetros**: `values`, los rellenos a buscar; por defecto los
  `placeholders` del dataset para el tipo del campo. Un `*` reemplaza
  cualquier texto (`noemail@*`).
- **Vacíos**: se saltan; `on_empty: fail` los cuenta.

```yaml
- id: CITY-03
  field: City
  check: placeholder
  values: [UPDATE, NO CITY]
  alert: La ciudad tiene un relleno
```

## length

El largo del valor, sin los espacios de los extremos, está permitido.

- **Parámetros**: `in`, una lista de largos permitidos; `min`, `max`, los
  límites (ambos incluidos). Al menos uno de ellos.
- **Vacíos**: se saltan; `on_empty: fail` los cuenta.

```yaml
- id: MOB-02
  field: Mobile
  check: length
  in: [10]
  alert: Un celular tiene 10 dígitos
```

## format

El valor, sin los espacios de los extremos, tiene su forma.

- **Parámetros**: `pattern`, una expresión regular, o `named`, un formato
  mantenido por Quality Data; uno de los dos, nunca ambos. La expresión
  debe cumplirse en **todo** el valor (está anclada) y es RE2, el dialecto de Google: sin
  referencias hacia atrás ni lookaround (`QR010`).
- **Vacíos**: se saltan; `on_empty: fail` los cuenta.

| `named`             | Acepta                                                         |
| ------------------- | -------------------------------------------------------------- |
| `email`             | Un correo: una parte local, `@` y un dominio con punto         |
| `person_name`       | Letras (con tildes), palabras unidas por un espacio, `'` o `-` |
| `not_only_symbols`  | Al menos una letra o un dígito                                 |
| `capitalized`       | Empieza con mayúscula                                          |
| `normalized_spaces` | Sin espacios dobles entre palabras                             |

Tres formatos con nombre más, para datos colombianos, están en un [módulo
opcional](../sector-colombia-finance/#formatos-para-datos-colombianos).

```yaml
- id: EML-02
  field: Email
  check: format
  named: email
  alert: No es un correo

- id: DOC-02
  field: Document
  check: format
  pattern: \d{5,12}
  alert: El documento tiene de 5 a 12 dígitos
```

Una expresión regular se escribe sin comillas, como arriba: YAML, el formato en que se escriben las reglas, conserva
su `\`. Lleva comillas simples solo cuando empieza con un signo que YAML
lee, como `[` (`pattern: '[A-Z]{3}\d{3}'`).

## domain

El valor está (o no está) en un conjunto de valores.

- **Parámetros**: `in`, los valores permitidos, o `not_in`, los
  prohibidos; uno de los dos. Cualquiera es una lista de valores,
  `{ list: nombre }` (una lista que declara el dataset) o
  `{ reference: nombre.Columna }` (la columna de una referencia que declara
  el dataset). Los valores se comparan sin espacios de los extremos y sin
  distinguir mayúsculas, salvo `case: exact`.
- **Vacíos**: se saltan; `on_empty: fail` los cuenta.

```yaml
- id: OCC-01
  field: Occupation
  check: domain
  in: { list: income_occupations }
  when: HasIncome = 'YES'
  alert: La ocupación no genera ingresos

- id: ADV-01
  field: AdvisorCode
  check: domain
  in: { reference: active_advisors.AdvisorCode }
  alert: El asesor no está activo
```

Una lista de más de 50 valores recibe un aviso (`QR103`):
conviértela en una tabla del catálogo.

## range

El valor está dentro de sus límites.

- **Parámetros**: `min`, `max`, al menos uno; cada uno un número, una fecha
  (`"2000-01-01"`), otro campo, `":cut"` o una expresión. Los límites se
  incluyen; `min_exclusive: true` o `max_exclusive: true` los excluye. Un
  límite sobre otro campo vuelve la regla una regla entre campos.
- **Vacíos**: se saltan; `on_empty: fail` los cuenta.

```yaml
- id: AGE-01
  field: age
  check: range
  min: 0
  max: 110
  alert: La edad no es plausible

- id: ISS-01
  field: IssueDate
  check: range
  min: BirthDate + INTERVAL 18 YEAR
  max: ":cut"
  alert: El documento se expidió antes de los 18 o después del corte

- id: EXP-01
  field: Expenses
  check: range
  max: 1.5 * TotalIncome
  max_exclusive: true
  alert: Egresos muy por encima de los ingresos; confirmar con el cliente
```

## fresh

Una fecha es suficientemente reciente, contra el corte.

- **Parámetros**: `max_age`, cuán vieja puede ser la fecha: un número entero
  y `days`, `months` o `years` (`13 months`, `1 year`). Falla cuando la
  fecha es anterior al corte menos `max_age`.
- **Vacíos**: se saltan; `on_empty: fail` los cuenta.

```yaml
- id: UPD-01
  field: LastUpdate
  check: fresh
  max_age: 13 months
  alert: Los datos de contacto no se actualizaron en el último año
```

## sum

Un total es igual a sus partes.

- **Parámetros**: `parts`, una lista de campos o expresiones, cada uno con
  su signo (`"- Liabilities"`, entre comillas porque empieza con `-`);
  `tolerance`, la diferencia permitida (por defecto 0). Falla cuando el
  campo menos la suma de sus partes supera, en valor absoluto, la
  tolerancia.
- **Vacíos**: se salta cuando el total está vacío; `on_empty: fail` lo
  cuenta. Una parte sin valor deja el registro fuera (no aplica).

```yaml
- id: EQ-01
  field: Equity
  check: sum
  parts: [Assets, "- Liabilities"]
  tolerance: 1
  alert: El patrimonio no es activo menos pasivo
```

## unique

El valor no se repite entre registros.

- **Parámetros**: `key`, el campo o los campos que no deben repetirse
  juntos (por defecto el campo de la regla); `normalize: true`, comparar
  solo letras y dígitos, en mayúsculas; `ignore`, valores que sí pueden
  repetirse. Los valores se comparan sin espacios de los extremos y sin
  distinguir mayúsculas.
- **Vacíos**: se salta cuando el campo de la regla está vacío;
  `on_empty: fail` lo cuenta. Los rellenos no se saltan: ponlos en
  `ignore` si pueden repetirse.

```yaml
- id: MAIL-02
  field: Email
  check: unique
  normalize: true
  ignore: [UPDATE]
  alert: El correo lo comparte otro cliente
```

## combination

Dos campos forman una combinación permitida, según una tabla que declara
el dataset.

- **Parámetros**: `table`, el nombre de una tabla bajo `tables:`. `field`
  no hace falta: es el `then` de la tabla.
- **La tabla**: `when`, el campo del que parte cada fila; `then`, el campo
  cuyos valores permiten o prohíben las filas; `rows`, cada una con `when`
  (un valor, una lista, o `"*"` para todo valor que ninguna otra fila
  nombra) y `allowed` o `forbidden`. Por ahora un solo campo en `when`; una
  tabla sobre varios todavía no se compila (`QR008`).
- **Vacíos**: se salta cuando cualquiera de los dos campos está vacío.
  `on_empty` no aplica.

```yaml
tables:
  occupation_activity:
    when: Occupation
    then: ActivityCode
    rows:
      - { when: RETIRED, allowed: ["1000"] }
      - { when: [HOMEMAKER, STUDENT], allowed: ["2000"] }
      - { when: "*", forbidden: ["1000", "2000"] }

rules:
  - id: OCC-02
    check: combination
    table: occupation_activity
    alert: El código de actividad no corresponde a la ocupación
```

La última fila es la otra dirección de cada par, en la misma tabla. Un
registro falla una vez, rompa la fila que rompa, y el hallazgo dice cuál.

## implies

Cuando se cumple una condición, se cumple otra.

- **Parámetros**: `if` y `then`, dos condiciones; `both_ways: true` la
  vuelve una equivalencia (el `then` también implica el `if`). `field` es
  opcional.
- **Vacíos**: no se salta nada; las condiciones dicen qué significa un
  vacío. `on_empty` no aplica.

```yaml
- id: END-01
  field: ClosedOn
  check: implies
  if: Status = 'CLOSED'
  then: not is_empty(ClosedOn)
  both_ways: true
  alert: Una cuenta cerrada necesita fecha de cierre, y solo las cerradas la tienen
```

## differs

Dos campos no tienen el mismo valor.

- **Parámetros**: `from`, el otro campo; `normalize: true`, comparar solo
  letras y dígitos, en mayúsculas. Los valores se comparan sin espacios de
  los extremos y sin distinguir mayúsculas, salvo `case: exact`.
- **Vacíos**: se salta cuando cualquiera de los dos campos está vacío;
  `on_empty: fail` lo cuenta.

```yaml
- id: REL-01
  field: RelativeDocument
  check: differs
  from: Document
  normalize: true
  alert: El documento del familiar es el del cliente
```

## expression

Una condición libre, para el caso raro que ningún patrón cubre. Cada una se
revisa.

- **Parámetros**: `fails`, la condición en la que la regla falla (una
  [expresión](../rule-language/#expresiones)); `dimension`, obligatoria
  porque no hay patrón del que tomarla: `completeness`, `consistency`,
  `accuracy`, `validity`, `timeliness` o `uniqueness`. `field` es opcional.
- **Vacíos**: no se salta nada. Di qué significa un vacío en la condición,
  o en una población que lo deje fuera. `on_empty` no aplica.

```yaml
- id: EQ-02
  field: Equity
  check: expression
  fails: Equity < 0
  dimension: accuracy
  severity: minor
  alert: Patrimonio negativo
```

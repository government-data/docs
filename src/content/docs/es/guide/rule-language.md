---
title: Lenguaje de reglas
description: "Referencia de cómo se escribe una regla: sus claves, dónde viven los archivos de reglas, lo que un dataset declara una vez, las expresiones y lo que Quality Data decide para toda regla."
sidebar:
  order: 7
---

Una regla aplica un **patrón** a un campo. La mayoría no necesita lógica:
el patrón y sus parámetros lo dicen todo. Las reglas se escriben en YAML,
un formato de texto plano, con claves en inglés, en el editor de reglas o en cualquier editor de
texto; el editor completa claves y valores y dice para qué sirve cada uno.

Esta página es el lenguaje en sí. Los catorce patrones, uno por uno, están
en [Patrones de reglas](../rule-patterns/); cada mensaje del revisor del
editor, en [Hallazgos del linter](../rule-files/). Cómo se escribe, se
prueba y se despliega una regla en el producto está en [Escribir, cambiar y
probar una regla](../write-a-rule/).

Si es tu primera vez, empieza por el
[tutorial](../rule-tutorial/): escribe unas reglas paso a paso.

Todos los ejemplos usan campos y valores sintéticos.

## Para qué es el lenguaje

Las reglas de calidad de datos suelen vivir en código: las escriben unos
pocos desarrolladores, y el texto que explica cada una puede alejarse de lo
que hace. El lenguaje de reglas existe para que:

- **quien conoce los datos escriba las reglas.** Un responsable de datos,
  no un desarrollador: la mayoría de las reglas son un patrón y dos o tres
  parámetros, sin lógica que equivocar;
- **una regla diga qué revisa, no cómo.** `check: required` con
  `when: Occupation = 'EMPLOYEE'` es la regla entera; Quality Data escribe
  la consulta y la explicación en palabras;
- **toda regla se pueda revisar.** Una regla son unas líneas de texto en un
  catálogo versionado: un cambio es un borrador, alguien lo aprueba, y el
  historial guarda quién cambió qué;
- **una regla signifique una sola cosa.** La consulta que la evalúa y su
  explicación en palabras salen de la misma lectura de la regla, así que lo
  que dice **Así se lee** es lo que corre;
- **los resultados se comparen en el tiempo.** Las reglas comparan fechas
  con el corte, nunca con hoy, y conservan su `id`: medir de nuevo un corte
  da el mismo resultado, y la historia de una regla la sigue;
- **una regla no pueda hacer daño.** El lenguaje solo lee el registro del
  propio dataset y las referencias que declara: ninguna otra tabla, ninguna
  escritura, ninguna función fuera de una lista cerrada.

## Su parecido con SQL

Si conoces SQL (lenguaje de consulta estructurado), ya conoces la mayor parte. Las condiciones (`when`, `if`,
`then`, `fails`, una población, un campo derivado) se escriben como la
condición de un `WHERE` de SQL, con los mismos operadores: `=`, `<>`,
`AND`, `OR`, `NOT`, `IN (…)`, `BETWEEN`, `LIKE`, `IS NULL`, `CASE WHEN`,
aritmética y `CAST`.

En qué se diferencia:

| En SQL…                                                 | En una regla                                                                                                                              |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Escribirías una consulta: `SELECT … FROM … WHERE …`     | Escribes solo la condición. Una regla mira **un registro** de su dataset; Quality Data corre todas las reglas de un dataset en una pasada |
| Escribirías la revisión misma                           | Nombras un **patrón** (`required`, `format`, `range`…) y sus parámetros; `expression` queda para lo que ningún patrón cubre               |
| Harías `JOIN` con otra tabla                            | Declaras una **referencia** una vez y usas `in: { reference: … }` o `in_reference(x, 'ref.Column')`                                       |
| Usarías `CURRENT_DATE`                                  | Usas `:cut`, la fecha en que se tomaron los datos                                                                                         |
| Obtendrías `NULL` como "desconocido"                    | Obtienes tres resultados: **falla**, **pasa**, **no aplica** (`NULL` significa que la regla no aplica al registro)                        |
| Tratarías `''` y `'  '` como valores                    | Son **vacíos**, como `NULL`; también un valor de solo espacios, incluido el espacio de no separación                                      |
| Compararías `'abc' = 'ABC '` como distintos             | Son iguales: los textos se comparan sin espacios a los lados y sin distinguir mayúsculas (`case: exact` lo cambia por regla)              |
| Una expresión regular coincidiría en cualquier parte    | Coincide con el valor **completo**, y es RE2, el dialecto de Google (sin referencias hacia atrás ni lookaround)                           |
| Escribirías la función como la escribe tu base de datos | Usas la función del lenguaje (`is_empty`, `regexp_like`, `days_since`…), que Quality Data escribe en el SQL que corre                     |
| Escribirías subconsultas, otras funciones, otras tablas | No es posible: la gramática es cerrada, y el linter dice dónde se sale una expresión (`QR002`)                                            |

Así que una regla no es SQL que tú corres: es una descripción que Quality
Data convierte en SQL. **Así se lee**, junto al editor, muestra cada regla
en palabras y, plegado bajo **SQL por motor**, el SQL en que se convierte;
nunca lo escribes a mano.

## Una primera regla

```yaml
dataset: clients

rules:
  - id: EMP-01
    field: Employer
    check: required
    when: Occupation = 'EMPLOYEE'
    population: individuals
    severity: major
    cause: capture
    alert: Falta la empresa de un empleado
    examples:
      fails: { Occupation: EMPLOYEE, Employer: "" }
      passes: { Occupation: EMPLOYEE, Employer: ACME LTD }
      skips: { Occupation: STUDENT, Employer: "" }
```

Un archivo de reglas nombra su `dataset` (como lo llama su mapeo) y lista
sus `rules`. Cada regla es una verificación, sobre un campo.

## Las claves de toda regla

| Clave        | Qué dice                                                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `id`         | Único en el dataset. Así se conservan los resultados en el tiempo: mantenlo cuando la regla cambie. Obligatorio          |
| `field`      | El campo que verifica, o una lista de campos (una regla por campo). Opcional en `combination`, `implies` y `expression`  |
| `check`      | El patrón: uno de los catorce de [Patrones de reglas](../rule-patterns/). Obligatorio, salvo que la regla `extends` otra |
| `when`       | La regla aplica solo donde se cumple esta condición                                                                      |
| `population` | La regla aplica solo a esta población, declarada por el dataset                                                          |
| `severity`   | `blocking`, `major` o `minor`. Por defecto, la del patrón                                                                |
| `cause`      | `capture` (lo corrige quien registra el dato) o `systemic` (se corrige una vez, en la fuente)                            |
| `alert`      | Lo que lee quien corrige el registro. El linter advierte si falta                                                        |
| `on_empty`   | `fail` cuenta un valor vacío como fallo; por defecto se salta (ver abajo)                                                |
| `case`       | `exact` compara los textos tal como están; por defecto no cuentan mayúsculas ni espacios de los extremos                 |
| `examples`   | Registros con los que la regla debe fallar (`fails`), pasar (`passes`) y no aplicar (`skips`), guardados con la regla    |
| `for_each`   | Repite la regla por cada valor: `{ n: ["1", "2"] }` con `Phone{n}`                                                       |
| `extends`    | Una regla con nombre de las reglas globales de la tabla de la que parte esta ([Compartir reglas](../share-rules/))       |
| `origin`     | De dónde viene una regla importada: `{ process: OLD-FLOW, node: "#12" }`                                                 |
| `note`       | Texto libre para quien mantiene la regla; nadie más lo ve                                                                |

Cada patrón agrega sus propios parámetros (`min`, `pattern`, `in`…). Un
parámetro que el patrón no usa es un error con su lugar (`QR005`), así nada
de lo escrito se ignora en silencio.

Si se dan `when` y `population`, deben cumplirse las dos.

### Severidad, dimensión y peso

La **dimensión** sale del patrón (completitud para `required`, validez para
`format`…; la tabla está en [Patrones de reglas](../rule-patterns/)); solo
`expression` declara la suya. La **severidad** tiene un valor por defecto
por patrón y se puede cambiar por regla; pesa el fallo en el índice de confiabilidad del dato (ICD)
([Formulaciones](../formulas/)):

| Severidad  | Significa             | Peso |
| ---------- | --------------------- | ---: |
| `blocking` | El dato no sirve      |  1.0 |
| `major`    | Sirve con reservas    |  0.6 |
| `minor`    | Una cuestión de forma |  0.3 |

Una regla que lee un solo campo cuenta en la conformidad propia de ese
campo, el componente **C** del ICD. Una regla que lee más de un campo,
contando los de su `when` y su población, cuenta en la consistencia entre
campos, **S**, de cada campo que lee.

### Una regla para varios campos

```yaml
# Un resultado por campo: ids REP-01.RepName, REP-01.RepDocument…
- id: REP-01
  field: [RepName, RepDocument, RepPhone]
  check: required
  population: companies
  alert: Los datos del representante legal están incompletos

# Un resultado por valor: ids REF-01.1 y REF-01.2.
- id: REF-01
  field: RefEmail{n}
  for_each: { n: ["1", "2"] }
  check: format
  named: email
  alert: El correo de referencia {n} no es un correo
```

`{n}` se reemplaza en toda la regla, también en la alerta.

### Ejemplos

`examples` tiene registros con los que la regla debe fallar, pasar y no
aplicar. Cada uno es un mapa de campo a valor, o una lista de ellos; `null`
es sin valor. Escribirlos te obliga a decir qué debe hacer la regla, y se
lo dice igual a quien la revisa. El editor del producto revisa que estén
bien escritos, pero todavía no los corre: para ver cómo se comporta una
regla con datos, usa **Probar** ([Escribir, cambiar y probar una
regla](../write-a-rule/#para-probar-una-regla)).

```yaml
examples:
  fails: [{ Mobile: "12345" }, { Mobile: "4001234567" }]
  passes: { Mobile: "3001234567" }
  skips: { Mobile: null }
```

## Dónde se escriben las reglas

### Un archivo por campo

Las reglas de un dataset están en su catálogo, un archivo por campo, junto
a las reglas globales de la tabla:

```text
clients/
  reglas_globales.yaml   las reglas globales de la tabla
  Employer.yaml          las reglas del campo Employer
  Mobile.yaml            las reglas del campo Mobile
  age.yaml               las reglas del campo derivado age
```

- El archivo de un campo se llama exactamente como el campo en el mapeo del
  dataset, `<campo>.yaml`, y guarda las reglas de ese campo.
- Una regla pertenece al campo de su `field:`. Una regla de varios campos
  pertenece al primero; una sin campo, al primer campo que lee.
- Lo que varios campos calculan juntos queda mejor como un campo derivado
  en las reglas globales, con sus reglas en el archivo propio del campo
  derivado.
- Una regla en el archivo de otro campo recibe un aviso que nombra
  el archivo al que pertenece (`QR210`).
- Un archivo tiene hasta 30 reglas o 300 líneas (`QR100`), y una lista
  hasta 50 valores (`QR103`); las reglas de un campo rara vez se acercan.

Los datasets más antiguos pueden tener todavía varios campos en un mismo
archivo: **Repartir por campo** los pasa a esta forma ([Compartir reglas
entre
campos](../share-rules/#para-pasar-archivos-antiguos-a-un-archivo-por-campo)).

### Las reglas globales de la tabla

`reglas_globales.yaml` declara una vez lo que comparten los archivos del
dataset: las secciones de la parte siguiente, y las **reglas con nombre**
(`named`), de las que parte la regla de un campo con `extends`. No tiene
`rules:` propias (`QR014`), ningún campo puede llamarse `reglas_globales`,
y un nombre que declara no se vuelve a declarar en el archivo de un campo
(`QR013`). Cómo usarlas, y qué revisar antes de cambiar una regla con
nombre: [Compartir reglas entre campos](../share-rules/).

## Lo que el dataset declara una vez

Estas secciones van junto a `rules:`. En un dataset repartido por campo
viven en las reglas globales de la tabla, `reglas_globales.yaml`, y todos
los archivos del dataset las ven ([Las reglas globales de la
tabla](#las-reglas-globales-de-la-tabla)).

```yaml
dataset: clients

populations:
  individuals: ClientType = 'PERSON'
  companies: ClientType = 'COMPANY'

lists:
  income_occupations: [EMPLOYEE, SELF-EMPLOYED, RETIRED]

placeholders:
  text: [UPDATE, NO DATA]
  number: ["-1"]
  date: ["1900-01-01"]
  email: ["noemail@*", "none@*"]

derived:
  age: years_between(BirthDate, :cut)
  days_since_update: days_between(LastUpdate, :cut)

references:
  advisors: { dataset: advisors, key: AdvisorCode }
  active_advisors:
    dataset: advisors
    key: AdvisorCode
    where: Status = 'ACTIVE'

tables:
  occupation_activity:
    when: Occupation
    then: ActivityCode
    rows:
      - { when: RETIRED, allowed: ["1000"] }
      - { when: "*", forbidden: ["1000"] }
```

| Sección        | Qué guarda                                                                                                                                                  |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `populations`  | Condiciones con nombre a las que una regla aplica con `population:`                                                                                         |
| `lists`        | Listas de valores con nombre, para `domain` (`in: { list: nombre }`) e `in_list(x, 'nombre')`. Con más de 50 valores, el linter pide una tabla del catálogo |
| `placeholders` | Rellenos que significan "sin valor", por tipo: `text`, `number`, `date` y `email` (con `*` para cualquier texto). Se declaran una vez, nunca por regla      |
| `derived`      | Campos calculados con una expresión, contra el corte; una regla los verifica como a cualquier campo                                                         |
| `references`   | Otro dataset consultado por su `key`, en el corte de la misma fecha; `where` deja solo algunos de sus registros (sus campos, tal como están)                |
| `tables`       | Tablas de combinaciones permitidas o prohibidas, para `combination` ([Patrones de reglas](../rule-patterns/#combination))                                   |
| `named`        | Reglas con todo menos `id` y `field`, que la regla de un campo extiende con `extends`. Solo en las reglas globales                                          |

Los rellenos de `email` aplican a los campos que el mapeo tipa como correo,
junto con los de `text`.

## Expresiones

`when`, `if`, `then`, `fails`, los límites de `range`, las partes de `sum`,
`populations`, `derived` y el `where` de una referencia son expresiones en
SQL estándar, de una gramática cerrada:

- comparación y lógica: `=`, `<>`, `<`, `<=`, `>`, `>=`, `AND`, `OR`,
  `NOT`, `IN (…)`, `BETWEEN`, `LIKE`, `IS NULL`, `CASE WHEN … THEN … END`,
  aritmética, `CAST`;
- intervalos: `INTERVAL 18 YEAR`, `MONTH` o `DAY`;
- el corte: `:cut`, el único parámetro;
- funciones:

| Función                          | Da                                                                                                   |
| -------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `is_empty(x)`                    | `x` no tiene valor, está vacío o solo tiene espacios                                                 |
| `regexp_like(x, 'patrón')`       | `x` cumple la expresión regular, anclada a todo el valor                                             |
| `in_list(x, 'nombre')`           | `x` está en una lista que declara el dataset                                                         |
| `in_reference(x, 'ref.Columna')` | `x` está en la columna de una referencia                                                             |
| `days_since(x)`                  | Los días de la fecha `x` al corte                                                                    |
| `days_between(a, b)`             | Los días entre dos fechas                                                                            |
| `years_between(a, b)`            | Los años cumplidos entre dos fechas                                                                  |
| `upper`, `lower`, `trim`         | El texto en mayúsculas o minúsculas, o sin los espacios de los extremos                              |
| `length`, `abs`, `round(x, n)`   | El largo de un texto; el valor absoluto de un número; `x` redondeado a `n` decimales (0 si se omite) |
| `coalesce(a, b, …)`              | El primero de sus argumentos que tiene valor                                                         |

Nada más: sin subconsultas, sin otras funciones, nada fuera del dataset.
Una expresión fuera de la gramática es un error del linter (`QR002`) que
dice dónde y por qué.

Una expresión larga se parte con `>-`, una cláusula por línea:

```yaml
derived:
  total_income: >-
    CASE
    WHEN ClientType = 'PERSON'
    THEN Salary + OtherIncome
    ELSE SalesIncome
    END
```

## Lo que Quality Data decide para toda regla

Esto es fijo: ninguna regla lo cambia, salvo donde se dice.

- **Vacío** es sin valor (`NULL`), un texto vacío o solo espacios, contando
  como espacio el espacio invisible de no separación (U+00A0).
- **Los vacíos son trabajo de `required`.** `required` falla con ellos;
  `empty` falla con los valores diligenciados; los demás patrones saltan un
  registro cuyo campo verificado está vacío ("no aplica"), así un valor
  faltante no se cuenta dos veces. La sección de cada patrón en
  [Patrones de reglas](../rule-patterns/) dice con qué campos salta y si
  `on_empty: fail` lo cambia. `implies` y `expression` no saltan nada: ven
  los vacíos como lo digan sus condiciones, así que escribe `is_empty(x)`
  donde importe.
- **Los rellenos cuentan como vacíos para `required`**, que lo dice como
  motivo; `placeholder` los encuentra.
- **El texto** se compara sin los espacios de los extremos y sin distinguir
  mayúsculas de minúsculas; las tildes cuentan. `case: exact` compara tal
  como está.
- **Las expresiones regulares** se cumplen en todo el valor, nunca en una
  parte: `3\d{9}` no se cumple dentro de un número más largo. Se escriben
  en la sintaxis común conocida como RE2: sin referencias hacia atrás ni
  lookaround (`QR010`).
- **Las fechas** se comparan con el corte (`:cut`), nunca con el día en que
  corre la regla: un corte da el mismo resultado al medirse otra vez.
- **Los códigos** conservan sus ceros a la izquierda cuando el mapeo los
  tipa como texto; el linter advierte de un patrón de texto sobre un campo
  mapeado como número.
- **El resultado** de una regla para un registro tiene tres valores:
  **falla**, **pasa** o **no aplica** (fuera de su población o condición,
  un vacío que salta, o cualquier otro valor faltante, como un campo
  derivado que no se puede calcular).

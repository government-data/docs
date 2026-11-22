---
title: "Tutorial: tus primeras reglas"
description: "Escribe paso a paso las primeras reglas de un dataset: un campo obligatorio, un formato, una condición, una lista, fechas contra el corte, una regla entre campos, reutilizar y llevarlas a main."
sidebar:
  order: 6.9
---

Este tutorial escribe las reglas de un campo, y luego algunas más,
explicando cada decisión a medida que aparece. Toma una media hora. Al
final sabrás cómo se lee una regla, por qué falla, pasa o no aplica, y cómo
llega a `main`.

Cada clave que se usa aquí está descrita en
[Lenguaje de reglas](../rule-language/), y cada patrón en
[Patrones de reglas](../rule-patterns/). El dataset, sus campos y sus
valores son sintéticos. Las claves del lenguaje van en inglés.

## El dataset

Un dataset de clientes, `clients`, cuyo mapeo tiene estos campos:

| Campo         | Contiene                                           |
| ------------- | -------------------------------------------------- |
| `ClientType`  | `PERSON` o `COMPANY`                               |
| `Mobile`      | Un número de celular                               |
| `Occupation`  | `EMPLOYEE`, `STUDENT`, `RETIRED`…                  |
| `Employer`    | El nombre del empleador, para empleados            |
| `BirthDate`   | La fecha de nacimiento                             |
| `LastUpdate`  | Cuándo se actualizaron por última vez sus datos    |
| `HasIncome`   | `YES` o `NO`                                       |
| `Status`      | `ACTIVE` o `CLOSED`                                |
| `ClosedOn`    | Cuándo se cerró la cuenta del cliente              |
| `RepDocument` | El documento del representante legal de la empresa |

Las reglas revisan el dataset en un **corte**: la fecha en que se tomaron
sus datos. Tenlo presente; vuelve en el paso 6.

## Antes de empezar

- El dataset está **mapeado**: sus campos están en el **Explorador**, bajo
  _Lago_. Mapear una tabla se hace una vez, lo hace quien gestiona los
  datasets, y toma por sí solo el primer corte del dataset, así que _Probar_
  ya tiene datos sobre los que correr: ver
  [Mapear una tabla en un dataset](../map-a-table/).
- Si no se pudieron recolectar los datos de ese primer corte, _Probar_ dice
  que el dataset aún no tiene un corte extraído: toma uno con
  _Ejecutar ahora_, en los _Cortes_ del dataset, como explica
  [Ejecutar y programar cortes](../run-cuts/#para-ejecutar-un-corte-ahora).
- Tus **permisos**: `quality:EditRules` sobre el dataset para escribir
  reglas (sin él, el _+_ junto a un campo no aparece);
  `quality:ApproveRules` **y** `quality:ManageDatasets` para desplegar a
  `main`. Con solo el primero, guardas borradores que otra persona aprueba.

## 1. Abrir el archivo del campo

Cada campo tiene su propio archivo de reglas, con el nombre del campo:
`Mobile.yaml`. En el **Explorador**, _+_ junto a `Mobile` lo abre (nuevo si no
existe) con una regla lista para llenar. Un archivo siempre empieza
nombrando su dataset:

```yaml
dataset: clients

rules:
```

## 2. Una primera regla: el celular es obligatorio

```yaml
dataset: clients

rules:
  - id: MOB-01
    field: Mobile
    check: required
    alert: El cliente no tiene celular
```

Cuatro claves, y cada una dice una cosa:

- `id` nombra la regla para siempre. Los resultados se guardan por él en el
  tiempo, así que consérvalo cuando la regla cambie.
- `field` es el campo que revisa.
- `check` es el **patrón**: aquí `required`, el campo tiene valor.
- `alert` es lo que lee quien corrige el registro. Escríbelo para esa
  persona.

No hace falta nada más: `required` ya trae una dimensión (completitud) y
una severidad (bloqueante). Vacío es sin valor, un texto vacío o solo
espacios; un relleno que el dataset declara, como `UPDATE`, también cuenta
como vacío.

Mira _Así se lee_ junto al editor: dice la regla en palabras. Léela cada
vez que escribas una; es la forma más rápida de atrapar una regla que no
dice lo que querías.

## 3. Una segunda regla: el celular tiene su forma

```yaml
- id: MOB-02
  field: Mobile
  check: format
  pattern: \d{10}
  alert: El número no tiene diez dígitos
```

`format` toma tu propio `pattern`, una expresión regular que debe
coincidir con el valor **completo** (aquí, diez dígitos), o un formato con
nombre (`named`) que mantiene Quality Data, como `email`.

Fíjate qué pasa con un celular vacío: `MOB-01` falla y `MOB-02` **no
aplica**. Toda regla da uno de tres resultados para un registro: falla,
pasa o no aplica. Los patrones distintos de `required` saltan un valor
vacío, así que un celular faltante se cuenta una sola vez, por la regla que
existe para eso.

## 4. Decir lo que la regla debe hacer: ejemplos

```yaml
- id: MOB-02
  field: Mobile
  check: format
  pattern: \d{10}
  alert: El número no tiene diez dígitos
  examples:
    fails: [{ Mobile: "12345" }, { Mobile: "555010123A" }]
    passes: { Mobile: "5550101234" }
    skips: { Mobile: null }
```

`examples` son registros con los que la regla debe fallar, pasar y no
aplicar. Escribirlos te obliga a decir qué debe hacer la regla, y se lo
dice igual a quien la revisa; el editor todavía no los corre, así que
comprueba cómo se comporta la regla con **Probar** (paso 10). Escribe al
menos uno de cada tipo en toda regla con condición.

## 5. Una regla con condición: el empleador de un empleado

Solo los empleados tienen empleador. Una regla para `Employer`, en
`Employer.yaml`:

```yaml
dataset: clients

rules:
  - id: EMP-01
    field: Employer
    check: required
    when: Occupation = 'EMPLOYEE'
    severity: major
    alert: Falta el empleador de un empleado
    examples:
      fails: { Occupation: EMPLOYEE, Employer: "" }
      passes: { Occupation: EMPLOYEE, Employer: ACME LTD }
      skips: { Occupation: STUDENT, Employer: "" }
```

- `when` es una condición simple en SQL (lenguaje de consulta estructurado). Donde no se cumple, la regla no
  aplica: un estudiante sin empleador no es un fallo.
- `severity: major` cambia la severidad del patrón (bloqueante): el
  registro sirve, con reservas. La severidad pesa un fallo en los
  indicadores.
- Los textos se comparan sin espacios a los lados y sin distinguir
  mayúsculas de minúsculas, así que `'employee '` también coincide.

Si muchas reglas comparten una condición, como "solo personas", decláralas
una vez como **población** en las reglas globales de la tabla,
`reglas_globales.yaml`:

```yaml
dataset: clients

populations:
  individuals: ClientType = 'PERSON'
```

Luego cualquier regla dice `population: individuals`. Con `when` y
`population` a la vez, deben cumplirse las dos.

## 6. Las fechas se comparan con el corte

Los datos del cliente deben haberse actualizado en los últimos 13 meses, en
`LastUpdate.yaml`:

```yaml
dataset: clients

rules:
  - id: UPD-01
    field: LastUpdate
    check: fresh
    max_age: 13 months
    alert: Los datos de contacto no se actualizaron en el último año
```

"En los últimos 13 meses" significa **antes del corte**, nunca antes de
hoy. Un corte medido de nuevo el año próximo da el mismo resultado. Cuando
necesites el corte en una expresión, escribe `:cut`; como límite solo,
entre comillas:

```yaml
- id: BIR-01
  field: BirthDate
  check: range
  min: "1900-01-01"
  max: ":cut"
  alert: La fecha de nacimiento no es plausible
```

## 7. Valores permitidos: una lista

Las ocupaciones que traen ingresos, declaradas una vez en las reglas
globales:

```yaml
lists:
  income_occupations: [EMPLOYEE, SELF-EMPLOYED, RETIRED]
```

y revisadas en `Occupation.yaml`:

```yaml
- id: OCC-01
  field: Occupation
  check: domain
  in: { list: income_occupations }
  when: HasIncome = 'YES'
  alert: La ocupación no genera ingresos
```

Una lista corta puede ir en línea (`in: [EMPLOYEE, RETIRED]`). Con más de 50
valores, el linter pide convertirla en una tabla de catálogo (`QR103`).

## 8. Una regla entre campos

Algunas revisiones son sobre dos campos juntos. `implies` dice: cuando se
cumple una condición, se cumple también otra.

```yaml
- id: END-01
  field: ClosedOn
  check: implies
  if: Status = 'CLOSED'
  then: not is_empty(ClosedOn)
  alert: Una cuenta cerrada necesita la fecha en que se cerró
```

`implies` no salta nada: sus condiciones deciden qué significa un valor
vacío, así que dilo con `is_empty(x)`. _Así se lee_ marca la regla como
entre campos, porque lee más que su propio campo.

## 9. Escribir una revisión una vez y usarla en muchos campos

Varios campos tienen documentos con la misma forma. Escribe la revisión una
vez como **regla con nombre** en las reglas globales:

```yaml
named:
  valid_document:
    check: format
    pattern: \d{5,12}
    severity: major
    alert: El documento tiene de 5 a 12 dígitos
```

y parte de ella en la regla de cada campo con `extends`, cambiando solo lo
que difiere:

```yaml
- id: REPDOC-01
  field: RepDocument
  extends: valid_document
  when: ClientType = 'COMPANY'
```

Un cambio a `valid_document` cambia todas las reglas que la extienden,
desde el siguiente corte. Antes de cambiar o quitar una, lee [Compartir
reglas entre campos](../share-rules/#para-cambiar-o-quitar-una-revisión-compartida).

## 10. Probar, y luego llevarla a main

Corrige lo que marca el linter, elige **Probar** para correr el archivo
sobre el último corte y lee los conteos: si una regla falla en medio
dataset, reléela. Luego elige **Desplegar**, o **Guardar como borrador** si
no puedes aprobar. Cómo va cada paso, y qué puede rechazar, está en
[Escribir, cambiar y probar una regla](../write-a-rule/#para-probar-una-regla)
y en [Llevar un cambio a main](../rules-to-main/). Las reglas que están en
`main` son con las que se evalúa el siguiente corte.

## Errores comunes

| Escribiste                            | Qué pasa                     | Escribe en cambio                        |
| ------------------------------------- | ---------------------------- | ---------------------------------------- |
| `required` con `on_empty: fail`       | Error del linter: no aplica  | `required` solo                          |
| Una fecha comparada con hoy           | No es posible                | `:cut`                                   |
| `max: :cut` sin comillas              | YAML lo lee como otra cosa   | `max: ":cut"`                            |
| Un `id` nuevo al cambiar una regla    | Su historia empieza de nuevo | Conserva el `id`                         |
| Una regla en el archivo de otro campo | Aviso del linter `QR210`     | Muévela al archivo de su campo           |
| Sin `alert`                           | Aviso del linter             | Una frase para quien corrige el registro |

## Siguiente

- [Lenguaje de reglas](../rule-language/): cada clave, las expresiones y
  sus funciones, y lo que Quality Data decide para toda regla.
- [Patrones de reglas](../rule-patterns/): los catorce patrones, uno por
  uno.
- [Hallazgos del linter](../rule-files/): cada mensaje del revisor del
  editor.
- Las páginas de Tareas, de [Escribir, cambiar y probar una
  regla](../write-a-rule/) a [Exportar e importar
  reglas](../export-import-rules/): compartir reglas, borradores,
  historial.

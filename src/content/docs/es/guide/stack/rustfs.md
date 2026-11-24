---
title: RustFS
description: El almacenamiento de objetos del lago de datos, compatible con S3, detrás de una puerta que exige el certificado de la instalación, con una réplica que guarda cada objeto 30 días.
sidebar:
  label: RustFS
---

**Módulo:** `lake-rustfs`. Ofrece la capacidad "lago" a los módulos que la
necesitan: el núcleo, Trino y la observabilidad.

## Qué hace

RustFS es un almacenamiento de objetos de código abierto, escrito en Rust,
que habla el protocolo **S3**. Es el almacenamiento del lago de datos de la
instalación:

- las tablas del lago, en formato [Apache Iceberg](../iceberg/): los datos
  copiados de las fuentes (bronze), los datos ya mapeados (silver) y los
  resultados de calidad (gold), con el **catálogo REST de Iceberg** que las
  lista;
- los logs técnicos y las métricas que guardan [Loki](../loki/) y
  [Mimir](../mimir/);
- el archivo del log de auditoría y los respaldos del catálogo de reglas.

## Cómo se organiza

- **El lago principal** es un servidor, o un **pool** de al menos cuatro
  servidores cuyos discos comparten los datos, así que sigue funcionando
  cuando falla un disco o un servidor.
- **La réplica** es un servidor aparte. El lago principal copia en ella el
  almacén de la instalación, donde cada objeto se guarda 30 días y nadie, ni
  siquiera un administrador, puede borrarlo ni acortar ese plazo. El lago
  principal guarda las versiones viejas de los objetos 7 días.
- **La puerta** es un pequeño proxy delante de RustFS que solo deja pasar
  conexiones con un certificado de la instalación (ver [TLS
  mutuo](../mtls/)).
- **El servicio de administración del lago** del módulo solo le responde
  al núcleo: la salud del lago, sus almacenes y su replicación. El núcleo
  no tiene código propio de RustFS; otro módulo de lago podría servir el
  mismo protocolo.

Los pasos para configurarlo están en [Correo, inicio de sesión y
actualizaciones](../../administer-the-installation/#para-guardar-las-claves-del-administrador-del-lago-principal).

## Cómo se comunica con el resto

| Con                          | Cómo                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| [Trino](../trino/)           | S3 para los archivos e Iceberg REST para las tablas, a través de la puerta           |
| Loki y Mimir                 | S3, cada uno en su propio bucket                                                     |
| El núcleo                    | El protocolo de administración del lago, con TLS mutuo en ambos sentidos             |
| Credenciales de corta duración | El servicio de tokens de seguridad de S3: credenciales que duran minutos, limitadas a lo que necesita una tarea |
| Las personas                 | La consola de RustFS, abierta desde el menú de la aplicación, para quien su política lo permita |

## Dónde quedan sus datos

En los discos de los servidores del lago. Los datos son críticos, y su
respaldo es la réplica: una actualización del lago solo sigue cuando la
réplica está al día y cada servidor está sano. Quitar el módulo conserva
sus datos; solo una purga los borra, después de un respaldo.

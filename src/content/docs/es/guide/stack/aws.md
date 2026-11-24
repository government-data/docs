---
title: Actualizaciones desde AWS
description: Cómo se publican las versiones y por qué se confía en ellas, con un índice firmado en S3, imágenes en ECR, una llave de firma en KMS, e instalaciones que prueban quiénes son con IAM Roles Anywhere.
sidebar:
  label: Actualizaciones desde AWS
---

**Dónde corre:** en Amazon Web Services, fuera de toda instalación. Una
instalación solo lee de allí.

## Qué hace

Cada versión de Government Data y de sus módulos se publica en AWS. Las
instalaciones **traen** de allí lo que necesitan; AWS nunca se conecta a
una instalación, y una instalación no abre ningún puerto para eso. Se usan
cuatro servicios:

| Servicio               | Qué guarda o hace                                                                                         |
| ---------------------- | --------------------------------------------------------------------------------------------------------- |
| **Amazon S3**          | El **índice de versiones firmado**, el paquete de cada módulo, y los informes que escriben las instalaciones tras una actualización |
| **Amazon ECR**         | Las imágenes de contenedor de cada módulo, por digest, incluidas copias de las imágenes de terceros que corre un módulo |
| **AWS KMS**            | La llave que **firma el índice**; la llave nunca sale de KMS                                              |
| **IAM Roles Anywhere** | Cambia el certificado de una instalación por credenciales que duran una hora                              |

## Por qué se confía en una versión

- **El índice está firmado.** Lista cada versión y, para cada módulo, la
  huella de su paquete y el digest de cada imagen. El agente confía en él
  solo si su firma coincide con la llave pública que lleva el agente, nunca
  por el lugar de donde vino el archivo.
- **Todo lo demás lo fija el índice.** Un paquete cuya huella, o una imagen
  cuyo digest, no coincida se rechaza.
- **La publicación está repartida.** El repositorio de cada módulo solo
  puede publicar sus propias imágenes y su paquete; solo la versión de la
  plataforma puede firmar el índice. Tomar el control de la publicación de
  un módulo no alcanza a ninguna instalación.
- **Las imágenes de terceros se copian.** Una imagen que un módulo corre
  pero no construye, como PostgreSQL o Trino, se copia a ECR y se fija por
  digest: las instalaciones nunca traen nada del registro de un tercero.

## Cómo prueba una instalación quién es

Cuando se monta una instalación, su agente crea una llave privada que
nunca sale del servidor, y la solicitud se firma como un **certificado de
enrolamiento**. Con él, el agente obtiene credenciales de AWS que duran
una hora y solo permiten leer versiones, traer imágenes y escribir su
propio informe. No hay ninguna contraseña ni llave de acceso de larga
duración.

**Revocar** el certificado de una instalación detiene sus
actualizaciones. La instalación sigue funcionando.

## Para el administrador

- El servidor del núcleo necesita **HTTPS de salida** hacia los puntos de
  servicio públicos de AWS para S3, ECR e IAM Roles Anywhere. Quien da
  soporte a tu instalación te da la lista para tu firewall. No hace falta
  ninguna regla de entrada.
- Los informes llevan versiones, pasos, duraciones y errores, nunca los
  datos de la organización.

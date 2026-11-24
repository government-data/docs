---
title: Updates from AWS
description: How versions are published and trusted, with a signed index in S3, images in ECR, a signing key in KMS, and installations proving who they are with IAM Roles Anywhere.
sidebar:
  label: Updates from AWS
---

**Where it runs:** in Amazon Web Services, outside every installation. An
installation only reads from it.

## What it does

Each version of Government Data and of its modules is published in AWS.
Installations **pull** what they need from there; AWS never connects to an
installation, and an installation opens no port for it. Four services are
used:

| Service                 | What it holds or does                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------------ |
| **Amazon S3**           | The **signed version index**, each module's package, and the reports installations write after an update |
| **Amazon ECR**          | The container images of every module, by digest, including copies of the third-party images a module runs |
| **AWS KMS**             | The key that **signs the index**; the key itself never leaves KMS                                      |
| **IAM Roles Anywhere**  | Exchanges an installation's certificate for credentials that last one hour                              |

## Why a version is trusted

- **The index is signed.** It lists every version and, for each module, the
  fingerprint of its package and the digest of each image. The agent
  trusts it only if its signature matches the public key the agent
  carries, never because of where the file came from.
- **Everything else is pinned by the index.** A package whose fingerprint
  or an image whose digest does not match is refused.
- **Publishing is split.** Each module's repository may publish only its
  own images and package; only the platform's release may sign the index.
  Taking over one module's publishing cannot reach an installation.
- **Third-party images are copied.** An image a module runs but does not
  build, such as PostgreSQL or Trino, is copied into ECR and pinned by
  digest: installations never pull from a third party's registry.

## How an installation proves who it is

When an installation is set up, its agent makes a private key that never
leaves the server, and the request is signed into an **enrolment
certificate**. With it, the agent gets AWS credentials that last one hour
and allow only reading versions, pulling images and writing its own
report. There is no long-lived password or access key.

**Revoking** an installation's certificate stops its updates. The
installation itself keeps working.

## For the administrator

- The core's server needs **outbound HTTPS** to AWS's public service
  endpoints for S3, ECR and IAM Roles Anywhere. Whoever supports your
  installation gives you the list for your firewall. No inbound rule is
  needed.
- Reports carry versions, steps, durations and errors, never the
  organisation's data.

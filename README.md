# docs

The Quality Data user guide, as the `docs` module: a static site built with
[Astro Starlight](https://starlight.astro.build/) and served by every
installation at `/docs/`, behind the installation's sign-in.

The guide is written in English (`src/content/docs/guide`,
`src/content/docs/charts`) and Spanish (`src/content/docs/es/`). The
Spanish content is the only Spanish in this repository: code, configuration,
comments and this README are in English.

## Layout

- `src/content/docs/`: the guide's pages, the chart examples and the
  printable book (`print.mdx`), in each language.
- `src/components/`, `src/charts/`, `src/chart-kit/`, `src/print/`,
  `src/terms/`: the site's components, the chart drawing primitives and
  examples (made-up data), the printable book and the glossary tooltips.
- `astro.config.mjs`: the site and its sidebar (the order of the guide).

## Build

Requires Node.js 22.12 or newer and pnpm 9.

```sh
pnpm install --frozen-lockfile
pnpm test     # unit tests (vitest)
pnpm build    # the site, in dist/, for the base path /docs
pnpm dev      # a local server at http://localhost:4321/docs/
```

## The image and the module

- `Dockerfile`: builds the site and serves it with an unprivileged nginx
  (`infra/nginx.conf`) under `/docs/` on port 8080; both bases are pinned
  by digest. `/docs/healthz` answers `ok`, for the image's healthcheck.
- `module.yaml`: the module's manifest for quality-sdk: its name (`docs`),
  its version and its health. It has no data and requires nothing.
- CI (`.github/workflows/ci.yml`) tests and builds the site, builds the
  image, checks that it serves the guide, and keeps it as the workflow
  artifact `image-docs` for a week:

  ```sh
  gh run download <run-id> -n image-docs
  docker load -i qd-docs.tar
  ```

- Release (`.github/workflows/release.yml`): a `v*` tag that is `v` +
  `module.yaml`'s `version` builds the image and pushes it to ECR as
  `quality-data/docs/web:<version>`, through the module's AWS role
  (repository variables `AWS_PUBLISH_ROLE` and `AWS_REGION`), and prints
  its digest. A version already in ECR is not built again; its digest is
  printed.

```sh
docker build -t quality-data-docs .
docker run --rm -p 8080:8080 quality-data-docs   # http://localhost:8080/docs/
```

## License

MIT, see [LICENSE](LICENSE).

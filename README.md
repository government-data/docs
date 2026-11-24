# docs

The Government Data user guide, as the `docs` module: the platform, its
technology stack, and Quality Data, its data quality application. A static
site built with
[Astro Starlight](https://starlight.astro.build/) and served by every
installation at `/docs/`, behind the installation's sign-in. The same pages
are also published as a public site on GitHub Pages (see "Two outputs").

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
- `src/target/`: the two outputs (`DOCS_TARGET`), the pages the public site
  leaves out (`EXCLUDED_FROM_PUBLIC`) and its CSP.

## Build

Requires Node.js 22.12 or newer and pnpm 9.

```sh
pnpm install --frozen-lockfile
pnpm test     # unit tests (vitest)
pnpm build    # the site, in dist/, for the base path /docs
pnpm dev      # a local server at http://localhost:4321/docs/
```

## Two outputs

One build of the same pages, chosen by `DOCS_TARGET`:

- `installation` (the default): what the image serves inside every
  installation, at `/docs/`, with the application's menu in the header and
  nginx's headers.
- `public`: the public site, at the root of `DOCS_PUBLIC_URL` (an https
  origin), with Starlight's theme and language selectors, its CSP in a
  `<meta>` tag, a sitemap and canonical links, and without the pages in
  `EXCLUDED_FROM_PUBLIC`; links to those pages become plain text.

```sh
DOCS_TARGET=public DOCS_PUBLIC_URL=https://guide.example.org pnpm build
scripts/check-public.sh dist https://guide.example.org
```

The site's address lives only in the repository variable `DOCS_PUBLIC_URL`:
no file names it, and `scripts/check-public.sh` fails if one does.

## The image and the module

- `Dockerfile`: builds the site and serves it with an unprivileged nginx
  (`infra/nginx.conf`, its headers and CSP in `infra/headers.inc`) under
  `/docs/` on port 8080; both bases are pinned by digest. `/docs/healthz`
  answers `ok`, for the image's healthcheck.
- `module.yaml`: the module's manifest for quality-sdk: its name (`docs`),
  its version, its health, its route (`/docs`, service `web`, port 8080)
  behind the installation's sign-in (`auth: forward`) and its entry in the
  apps menu. It has no data and requires nothing.
- `compose.yml`: how an installation runs it (the project `docs`, the image
  from `IMAGE_WEB`), on the core's `data-quality-edge` network as
  `docs-web`, read-only, with no port of its own. `qd module add docs`
  starts it and writes its route; `qd module remove docs` takes both away.
- CI (`.github/workflows/ci.yml`) tests the site, builds both outputs
  (checking the public one with `scripts/check-public.sh`), builds the
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
- Pages (`.github/workflows/pages.yml`): the same tag builds the public
  output at `DOCS_PUBLIC_URL`, checks it, and deploys it to GitHub Pages in
  the `github-pages` environment, once its required reviewer approves. No
  secret: the deploy uses GitHub's OIDC token for Pages.

```sh
docker build -t quality-data-docs .
docker run --rm -p 8080:8080 quality-data-docs   # http://localhost:8080/docs/
```

## License

MIT, see [LICENSE](LICENSE).

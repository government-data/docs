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

## License

MIT, see [LICENSE](LICENSE).

# The docs module's image: the guide built with Astro, served by an
# unprivileged nginx under /docs/ on port 8080.
#
#   docker build -t quality-data-docs .
#   docker run --rm -p 8080:8080 quality-data-docs   # http://localhost:8080/docs/
#
# Both bases are pinned by digest; the tag beside each is for people.

FROM node:22-slim@sha256:e9f565d32859f0cbfb52125eafe8be39390f24dac302dc3cdf566e8ba3ab21ee AS build
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
WORKDIR /site
# Dependencies first, so a change to the pages reuses this layer.
COPY package.json pnpm-lock.yaml .npmrc ./
RUN pnpm install --frozen-lockfile
COPY astro.config.mjs tsconfig.json ./
COPY public ./public
COPY src ./src
RUN pnpm run build

FROM nginxinc/nginx-unprivileged:1.28-alpine@sha256:7377697a821c131a924a7105fafbe7414db4e9fcc77a6f08f776f33f141ec3f8 AS runtime
# Owned by the image's non-root user (uid 101), which reads them.
COPY --chown=nginx:nginx infra/nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx --from=build /site/dist /usr/share/nginx/html/docs
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD ["wget", "-q", "-O", "/dev/null", "http://127.0.0.1:8080/docs/healthz"]

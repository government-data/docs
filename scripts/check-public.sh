#!/usr/bin/env bash
# Checks of the public site (quality-sdk decision 0010 step 2), run by
# ci.yml and pages.yml after `DOCS_TARGET=public pnpm run build`:
#
#   scripts/check-public.sh <dist> <site>     # site: DOCS_PUBLIC_URL
#
# - the source names no public domain: the URL lives only in the repository
#   variable DOCS_PUBLIC_URL, so a move of the site changes no file;
# - <dist> has index.html, 404.html and sitemap-index.xml at its root;
# - no page or script links or fetches /docs/ or /api/ (the installation's
#   base and the application's API);
# - every page has a canonical link under <site>;
# - no page of EXCLUDED_FROM_PUBLIC (src/target/index.ts) is built;
# - the header links to a GitHub organisation (DOCS_ORG_URL);
# - the footer shows module.yaml's version.
set -euo pipefail

dist=${1:?usage: $0 <dist> <site>}
site=${2:?usage: $0 <dist> <site>}
site=${site%/}
failed=0
fail() {
  echo "::error::$*" >&2
  failed=1
}

# The pattern is not the domain itself, so this file does not match it.
if git grep -n 'orquestador[.]app' -- . ':!dist'; then
  fail "the source names the public domain; it belongs in DOCS_PUBLIC_URL only"
fi

for f in index.html 404.html sitemap-index.xml; do
  [ -f "$dist/$f" ] || fail "$dist/$f is missing"
done

if grep -rnoE --include='*.html' --include='*.js' \
  '(href|src|action)="/(docs|api)/[^"]*"|fetch\(["'"'"'`]/(docs|api)/' "$dist"; then
  fail "a page links or fetches /docs/ or /api/"
fi

while IFS= read -r page; do
  grep -q "<link rel=\"canonical\" href=\"$site/" "$page" ||
    fail "$page has no canonical link under $site"
done < <(find "$dist" -name '*.html')

# The excluded ids, read from the one list.
excluded=$(sed -n '/^export const EXCLUDED_FROM_PUBLIC/,/^];/p' src/target/index.ts |
  grep -oE '^\s*"[^"]+"' | tr -d ' "')
for id in $excluded; do
  for path in "$id" "es/$id"; do
    [ ! -e "$dist/$path" ] || fail "$dist/$path is built but excluded from the public site"
  done
  if grep -rlE --include='*.html' --include='*.xml' "href=\"[^\"]*/$id/|<loc>[^<]*/$id/" "$dist"; then
    fail "a page or the sitemap links $id, which the public site leaves out"
  fi
done

grep -qE 'href="https://github\.com/[A-Za-z0-9-]+"' "$dist/404.html" ||
  fail "the header does not link to the GitHub organisation (DOCS_ORG_URL)"

version=$(sed -nE 's/^version:[[:space:]]*"?([0-9.]+)"?[[:space:]]*$/\1/p' module.yaml)
grep -q "data-qd-version=\"$version\"" "$dist/404.html" ||
  fail "the footer does not show module.yaml's version ($version)"

[ "$failed" = 0 ] && echo "public site checks passed ($dist, $site)"
exit "$failed"

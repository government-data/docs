import { defineCollection } from "astro:content";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";
import { EXCLUDED_FROM_PUBLIC, isExcluded, targetOf } from "./target";

// Starlight's loader, less the pages the public site leaves out
// (src/target/index.ts); the installation keeps every page.
const starlightDocs = docsLoader();
const excluded = targetOf(process.env.DOCS_TARGET) === "public" ? EXCLUDED_FROM_PUBLIC : [];
const loader: typeof starlightDocs = {
  ...starlightDocs,
  load: async (context) => {
    await starlightDocs.load(context);
    for (const id of context.store.keys()) if (isExcluded(id, excluded)) context.store.delete(id);
  },
};

export const collections = {
  docs: defineCollection({ loader, schema: docsSchema() }),
};

/**
 * Rebuild src/content/poems/index.ts imports/registry from poems/*.ts exports.
 * Run: node scripts/register-poem-modules.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const poemsDir = join(root, "src/content/poems/poems");
const indexPath = join(root, "src/content/poems/index.ts");

const files = readdirSync(poemsDir)
  .filter((f) => f.endsWith(".ts"))
  .sort();

const modules = [];
for (const file of files) {
  const src = readFileSync(join(poemsDir, file), "utf8");
  const match = /export const (\w+Poem)\s*:/.exec(src);
  if (!match) {
    console.warn(`Skipping ${file}: no export const *Poem`);
    continue;
  }
  modules.push({
    file: file.replace(/\.ts$/, ""),
    exportName: match[1],
  });
}

const imports = modules
  .map(
    (m) =>
      `import { ${m.exportName} } from "./poems/${m.file}";`,
  )
  .join("\n");

const arrayEntries = modules.map((m) => `  ${m.exportName},`).join("\n");

const content = `import { listSkippedCatalog, POEM_CATALOG } from "./catalog";
${imports}
import type { ComposedPoemPage, PoemAnalysisContent } from "./types";
import { composePoemPage } from "./types";

/**
 * Registered poem analysis modules. Agents write \`poems/{slug}.ts\`;
 * regenerate this file with: node scripts/register-poem-modules.mjs
 */
const POEM_CONTENTS: PoemAnalysisContent[] = [
${arrayEntries}
];

const BY_SLUG = new Map(
  POEM_CONTENTS.map((poem) => [poem.slug, poem] as const),
);

export function listPoemContents(): PoemAnalysisContent[] {
  return POEM_CONTENTS;
}

export function getPoemBySlug(slug: string): PoemAnalysisContent | undefined {
  return BY_SLUG.get(slug);
}

export function isPoemSlug(slug: string): boolean {
  return BY_SLUG.has(slug);
}

export function listPoemPages(): ComposedPoemPage[] {
  return POEM_CONTENTS.map(composePoemPage);
}

export function getPoemPageBySlug(slug: string): ComposedPoemPage | undefined {
  const poem = getPoemBySlug(slug);
  return poem ? composePoemPage(poem) : undefined;
}

/** Index page SEO chrome. */
export const POEMS_INDEX_TITLE = "Poem Analyses for Students — lyriic";
export const POEMS_INDEX_DESCRIPTION =
  "Cited analyses of classic poems students study — meaning, themes, form, and critical views — with each poem in a live annotated editor.";
export const POEMS_INDEX_H1 = "Poem analyses";
export const POEMS_INDEX_INTRO =
  "Close readings of poems students often meet in class. Each page embeds the poem in lyriic’s editor and gathers well-cited views on meaning, themes, form, and context — with links to the sources.";

/**
 * Assert no copyrighted-skip poems are registered, every registered slug is in
 * the catalog as public-domain (or verify resolved to PD), and slugs are unique.
 */
export function assertPoemRegistryInvariants(): void {
  const skipped = new Set(listSkippedCatalog().map((e) => e.slug));
  const catalogSlugs = new Set(POEM_CATALOG.map((e) => e.slug));
  const seen = new Set<string>();

  for (const poem of POEM_CONTENTS) {
    if (seen.has(poem.slug)) {
      throw new Error(\`Duplicate poem content for slug: \${poem.slug}\`);
    }
    seen.add(poem.slug);
    if (skipped.has(poem.slug)) {
      throw new Error(
        \`Copyrighted poem must not be registered: \${poem.slug}\`,
      );
    }
    if (!catalogSlugs.has(poem.slug)) {
      throw new Error(\`Poem slug not in catalog: \${poem.slug}\`);
    }
    const entry = POEM_CATALOG.find((e) => e.slug === poem.slug);
    if (entry?.copyrightStatus === "copyrighted-skip") {
      throw new Error(\`Registered poem is copyrighted-skip: \${poem.slug}\`);
    }
  }
}

export type { ComposedPoemPage, PoemAnalysisContent } from "./types";
export { poemPath, composePoemPage } from "./types";
export {
  POEM_CATALOG,
  getCatalogEntry,
  listPublicDomainCatalog,
  listSkippedCatalog,
  listVerifyCatalog,
} from "./catalog";
`;

writeFileSync(indexPath, content);
console.log(`Registered ${modules.length} poem modules in index.ts`);

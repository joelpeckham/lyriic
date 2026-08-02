/**
 * Generates public agent/SEO markdown mirrors from src/content modules.
 * Run: node --experimental-strip-types scripts/build-seo-content.mjs
 *
 * Utility tools (faq/privacy/tools.ts) load via strip-types.
 * Form checkers load via Vite SSR so `@/` aliases resolve.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

import { FAQ_ENTRIES, FAQ_INTRO } from "../src/content/faq.ts";
import { PRIVACY_EFFECTIVE, PRIVACY_INTRO, PRIVACY_SECTIONS } from "../src/content/privacy.ts";
import { TOOL_PAGES } from "../src/content/tools.ts";
import { TOOLS_INDEX_INTRO } from "../src/content/toolsIndex.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const toolsDir = join(publicDir, "tools");
const SITE = "https://lyriic.com";
const LASTMOD = new Date().toISOString().slice(0, 10);

mkdirSync(toolsDir, { recursive: true });

const vite = await createServer({
  root,
  server: { middlewareMode: true },
  appType: "custom",
  logLevel: "error",
});

/** @type {{ listComposedFormToolPages: () => Array<Record<string, any>>, ZEN_EDITOR_PITCH: { cta: string } }} */
const formCheckers = await vite.ssrLoadModule("/src/content/formCheckers/index.ts");
const formPages = formCheckers.listComposedFormToolPages();
const zenCta = formCheckers.ZEN_EDITOR_PITCH.cta;

await vite.close();

function formToolMarkdown(page) {
  const sections = [];
  sections.push(`# ${page.h1}\n`);
  sections.push(`${page.intro}\n`);

  if (page.history?.length) {
    sections.push(`## A short history\n`);
    for (const p of page.history) sections.push(`${p}\n`);
  }
  if (page.famousPoems?.length) {
    sections.push(`## Famous poems\n`);
    for (const poem of page.famousPoems) {
      const by = poem.author ? ` — ${poem.author}` : "";
      sections.push(`### ${poem.title}${by}\n`);
      if (poem.excerpt) sections.push(`${poem.excerpt}\n`);
      if (poem.note) sections.push(`${poem.note}\n`);
    }
  }
  for (const explainer of [
    page.meterExplainer,
    page.footExplainer,
    page.stressExplainer,
  ]) {
    if (!explainer) continue;
    sections.push(`## ${explainer.title}\n`);
    for (const p of explainer.body) sections.push(`${p}\n`);
  }
  if (page.formNotes?.length) {
    sections.push(`## Notes on this form\n`);
    for (const p of page.formNotes) sections.push(`${p}\n`);
  }
  sections.push(`## Common questions\n`);
  for (const item of page.faqs) {
    sections.push(`### ${item.q}\n\n${item.plain}\n`);
  }
  sections.push(`## Open the editor\n`);
  sections.push(`${zenCta}: ${SITE}/\n`);
  sections.push(`Open with ${page.label} meter: ${SITE}${page.writePath}\n`);
  return sections.join("\n");
}

const formToolLinks = formPages
  .map(
    (page) =>
      `- [${page.h1}](${SITE}${page.path}) — [${SITE}/tools/${page.slug}.md](${SITE}/tools/${page.slug}.md)`,
  )
  .join("\n");

const aboutMd = `# lyriic

> A free, local-first zen editor for writing poetry and lyrics in meter.

lyriic runs entirely in the browser at ${SITE}. It is a quiet writing canvas with per-line syllable counts, optional meter rulers, and dictionary-based rhyme and synonym helpers. It is **not** a generative AI lyric writer.

## Who it is for

Poets, songwriters, and anyone practicing meter or syllable-aware lines who wants tools that stay out of the way.

## Core features

- Per-line syllable counts from a fused US pronunciation dictionary (Misaki, CMUdict, WikiPron)
- Optional meter rulers (Haiku 5/7/5, iambic pentameter, common meter, or custom)
- Hover or tap a word for synonyms and rhymes, sorted by syllable count
- Per-draft syllable overrides for ambiguous words
- Local-first drafts — no account, no cloud sync
- Offline use after assets load

## How syllable counting works

Counts follow the primary IPA pronunciation from a fused US dictionary (Misaki, CMU Pronouncing Dictionary, WikiPron). Hyphenated compounds are split and summed. Out-of-vocabulary words use a spelling heuristic. Users can override counts per draft in Settings.

## Privacy

Drafts and preferences stay in browser local storage. Poem text is not sent to a server for editing. See [Privacy](${SITE}/privacy) and [privacy.md](${SITE}/privacy.md).

## Tools

${TOOLS_INDEX_INTRO}

- [All tools](${SITE}/tools): Index of utilities and form checkers
- [Syllable counter](${SITE}/tools/syllable-counter) — [${SITE}/tools/syllable-counter.md](${SITE}/tools/syllable-counter.md)
- [Rhyme finder](${SITE}/tools/rhyme-finder) — [${SITE}/tools/rhyme-finder.md](${SITE}/tools/rhyme-finder.md)

### Form checkers

${formToolLinks}

## Pricing

Free. No account required.
`;

writeFileSync(join(publicDir, "about.md"), aboutMd);

const faqMd = `# FAQ — lyriic

${FAQ_INTRO}

${FAQ_ENTRIES.map((item) => `## ${item.q}\n\n${item.plain}\n`).join("\n")}
`;

writeFileSync(join(publicDir, "faq.md"), faqMd);

const privacyMd = `# Privacy — lyriic

${PRIVACY_EFFECTIVE}

${PRIVACY_INTRO}

${PRIVACY_SECTIONS.map((section) => `## ${section.h2}\n\n${section.body}\n`).join("\n")}
`;

writeFileSync(join(publicDir, "privacy.md"), privacyMd);

for (const tool of TOOL_PAGES) {
  const md = `# ${tool.h1}

${tool.intro}

${tool.body.map((p) => `${p}\n`).join("\n")}
## Common questions

${tool.faqs.map((item) => `### ${item.q}\n\n${item.plain}\n`).join("\n")}
## Open the editor

${tool.cta}: ${SITE}/
`;
  writeFileSync(join(toolsDir, `${tool.slug}.md`), md);
}

for (const page of formPages) {
  writeFileSync(join(toolsDir, `${page.slug}.md`), formToolMarkdown(page));
}

const formLlmsLinks = formPages
  .map(
    (page) =>
      `- [${page.h1}](${SITE}${page.path}): ${page.pattern.join("-")} checker — [${page.slug}.md](${SITE}/tools/${page.slug}.md)`,
  )
  .join("\n");

const llmsTxt = `# lyriic

> lyriic is a local-first web editor for writing poetry and lyrics in meter, with per-line syllable counts, optional meter rulers, and quiet rhyme/synonym helpers.

lyriic runs entirely in the browser at ${SITE}. Drafts stay on-device; there is no account or cloud sync. Syllable counts default to a fused US pronunciation dictionary; users can override ambiguous words per draft. lyriic is not a generative AI lyric writer.

## Product

- [lyriic home](${SITE}/): Zen poem canvas with syllable counts and meter tools
- [About](${SITE}/about): Product page — also [about.md](${SITE}/about.md) for features, audience, privacy model, how counting works
- [FAQ](${SITE}/faq): Common questions — also [faq.md](${SITE}/faq.md)

## Tools

- [All tools](${SITE}/tools): Index of utilities and form checkers
- [Syllable counter](${SITE}/tools/syllable-counter): Per-line syllable counts — [syllable-counter.md](${SITE}/tools/syllable-counter.md)
- [Rhyme finder](${SITE}/tools/rhyme-finder): Local rhyming dictionary — [rhyme-finder.md](${SITE}/tools/rhyme-finder.md)

### Form checkers

${formLlmsLinks}

## How it works

- [Syllable counting](${SITE}/about.md#how-syllable-counting-works): Fused pronunciation dictionary; hyphen splits; OOV heuristic; per-draft overrides
- [Meter rulers](${SITE}/faq.md): Haiku, iambic pentameter, common meter, or custom targets
- [Rhymes and synonyms](${SITE}/faq.md): Local dictionary helpers (not generative rewrite)

## Policies

- [Privacy](${SITE}/privacy): Local-first; what is and is not collected — [privacy.md](${SITE}/privacy.md)

## Optional

- [Sitemap](${SITE}/sitemap.xml): Full URL list for crawlers
- [robots.txt](${SITE}/robots.txt): Crawl permissions
- [llms-full.txt](${SITE}/llms-full.txt): Concatenated product brief, FAQ, tools, and privacy
`;

writeFileSync(join(publicDir, "llms.txt"), llmsTxt);

const toolSections = TOOL_PAGES.map(
  (tool) => `# ${tool.h1}

${tool.intro}

${tool.body.join("\n\n")}

${tool.faqs.map((item) => `## ${item.q}\n\n${item.plain}`).join("\n\n")}
`,
).join("\n---\n\n");

const formSections = formPages.map((page) => formToolMarkdown(page)).join("\n---\n\n");

const llmsFull = `${aboutMd}

---

# FAQ

${FAQ_ENTRIES.map((item) => `## ${item.q}\n\n${item.plain}`).join("\n\n")}

---

# Tools

${toolSections}
---

# Form checkers

${formSections}
---

# Privacy

${PRIVACY_EFFECTIVE}

${PRIVACY_INTRO}

${PRIVACY_SECTIONS.map((section) => `## ${section.h2}\n\n${section.body}`).join("\n\n")}
`;

writeFileSync(join(publicDir, "llms-full.txt"), llmsFull);

const writerSlugs = formPages.map((page) => page.meterId);

const urls = [
  { loc: `${SITE}/`, priority: "1.0", changefreq: "weekly" },
  { loc: `${SITE}/about`, priority: "0.7", changefreq: "monthly" },
  { loc: `${SITE}/faq`, priority: "0.6", changefreq: "monthly" },
  { loc: `${SITE}/privacy`, priority: "0.4", changefreq: "yearly" },
  { loc: `${SITE}/tools`, priority: "0.8", changefreq: "monthly" },
  ...TOOL_PAGES.map((tool) => ({
    loc: `${SITE}${tool.path}`,
    priority: "0.8",
    changefreq: "monthly",
  })),
  ...formPages.map((page) => ({
    loc: `${SITE}${page.path}`,
    priority: "0.8",
    changefreq: "monthly",
  })),
  ...writerSlugs.map((slug) => ({
    loc: `${SITE}/write/${slug}`,
    priority: "0.7",
    changefreq: "monthly",
  })),
  { loc: `${SITE}/about.md`, priority: "0.5", changefreq: "monthly" },
  { loc: `${SITE}/faq.md`, priority: "0.4", changefreq: "monthly" },
  { loc: `${SITE}/privacy.md`, priority: "0.3", changefreq: "yearly" },
  ...TOOL_PAGES.map((tool) => ({
    loc: `${SITE}/tools/${tool.slug}.md`,
    priority: "0.4",
    changefreq: "monthly",
  })),
  ...formPages.map((page) => ({
    loc: `${SITE}/tools/${page.slug}.md`,
    priority: "0.4",
    changefreq: "monthly",
  })),
  { loc: `${SITE}/llms.txt`, priority: "0.3", changefreq: "monthly" },
  { loc: `${SITE}/llms-full.txt`, priority: "0.2", changefreq: "monthly" },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

writeFileSync(join(publicDir, "sitemap.xml"), sitemap);

console.log(
  `Wrote about.md, faq.md, privacy.md, tools/*.md (${TOOL_PAGES.length} utility + ${formPages.length} form checkers), llms.txt, llms-full.txt, sitemap.xml`,
);

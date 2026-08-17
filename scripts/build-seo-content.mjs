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
import { alsoByJoelMarkdown } from "../src/lib/product-graph.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const toolsDir = join(publicDir, "tools");
const poemsDir = join(publicDir, "poems");
const SITE = "https://lyriic.com";
const LASTMOD = new Date().toISOString().slice(0, 10);

mkdirSync(toolsDir, { recursive: true });
mkdirSync(poemsDir, { recursive: true });

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

/** @type {{ listPoemPages: () => Array<Record<string, any>>, POEMS_INDEX_H1: string, POEMS_INDEX_INTRO: string }} */
const poemsModule = await vite.ssrLoadModule("/src/content/poems/index.ts");
const poemPages = poemsModule.listPoemPages();
const poemsIndexH1 = poemsModule.POEMS_INDEX_H1;
const poemsIndexIntro = poemsModule.POEMS_INDEX_INTRO;

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
    sections.push(`## ${page.famousPoemsHeading ?? "Famous poems"}\n`);
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

function citeNums(page, cites) {
  if (!cites?.length) return "";
  return cites
    .map((id) => {
      const n = page.citations.findIndex((c) => c.id === id) + 1;
      return n > 0 ? `[${n}]` : "";
    })
    .filter(Boolean)
    .join("");
}

function emitPoemBlocks(sections, blocks, page) {
  for (const block of blocks ?? []) {
    if (block.type === "excerpt") {
      sections.push("```\n" + block.lines + "\n```\n");
    } else if (block.type === "p") {
      sections.push(`${block.text}${citeNums(page, block.cites)}\n`);
    }
  }
}

function poemMarkdown(page) {
  const sections = [];
  const citeById = new Map((page.citations ?? []).map((c) => [c.id, c]));
  sections.push(`# ${page.h1}\n`);
  sections.push(
    `${page.poemTitle} — ${page.author}${page.yearPublished ? ` (${page.yearPublished})` : ""}\n`,
  );
  sections.push(`${page.intro}\n`);
  sections.push(
    `Full text from [${page.fullTextSource.label}](${page.fullTextSource.url}). Public domain in the US (${page.publicDomainBasis}).\n`,
  );
  if (page.summary?.length) {
    sections.push(`## Summary\n`);
    emitPoemBlocks(sections, page.summary, page);
  }
  if (page.meaning?.length) {
    sections.push(`## Meaning and interpretation\n`);
    emitPoemBlocks(sections, page.meaning, page);
  }
  if (page.themes?.length) {
    sections.push(`## Themes\n`);
    for (const theme of page.themes) {
      sections.push(`### ${theme.theme}\n`);
      emitPoemBlocks(sections, theme.blocks, page);
    }
  }
  if (page.formAndMeter?.length) {
    sections.push(`## Form and meter\n`);
    emitPoemBlocks(sections, page.formAndMeter, page);
  }
  if (page.literaryDevices?.length) {
    sections.push(`## Literary devices\n`);
    for (const device of page.literaryDevices) {
      sections.push(`### ${device.device}\n`);
      emitPoemBlocks(sections, device.blocks, page);
    }
  }
  if (page.historicalContext?.length) {
    sections.push(`## Historical context\n`);
    emitPoemBlocks(sections, page.historicalContext, page);
  }
  if (page.criticalViews?.length) {
    sections.push(`## What critics say\n`);
    for (const view of page.criticalViews) {
      const cite = citeById.get(view.citeId);
      if (!cite?.quote) continue;
      const by = cite.author ? `${cite.author}, ` : "";
      sections.push(
        `> “${cite.quote}”\n>\n> — ${by}[${cite.source}](${cite.url})\n`,
      );
    }
  }
  if (page.faqs?.length) {
    sections.push(`## Common questions\n`);
    for (const item of page.faqs) {
      sections.push(`### ${item.q}\n\n${item.plain}\n`);
    }
  }
  if (page.citations?.length) {
    sections.push(`## References\n`);
    for (const cite of page.citations) {
      const by = cite.author ? `${cite.author}, ` : "";
      sections.push(`- [${by}${cite.source}](${cite.url})\n`);
    }
  }
  sections.push(`## Open the editor\n`);
  sections.push(`${page.cta}: ${SITE}${page.writePath ?? "/write"}\n`);
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
${TOOL_PAGES.map(
  (tool) =>
    `- [${tool.h1}](${SITE}${tool.path}) — [${SITE}/tools/${tool.slug}.md](${SITE}/tools/${tool.slug}.md)`,
).join("\n")}

### Form checkers

${formToolLinks}

## Poem analyses

${poemsIndexIntro}

- [All poem analyses](${SITE}/poems)
${poemPages
  .map(
    (page) =>
      `- [${page.poemTitle}](${SITE}${page.path}) — ${page.author} — [${SITE}/poems/${page.slug}.md](${SITE}/poems/${page.slug}.md)`,
  )
  .join("\n")}

## Pricing

Free. No account required.

${alsoByJoelMarkdown("lyriic")}
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

const poemsIndexMd = `# ${poemsIndexH1}

${poemsIndexIntro}

${poemPages
  .map(
    (page) =>
      `- [${page.poemTitle}](${SITE}${page.path}) — ${page.author} — [${page.slug}.md](${SITE}/poems/${page.slug}.md)`,
  )
  .join("\n")}
`;
writeFileSync(join(publicDir, "poems.md"), poemsIndexMd);

for (const page of poemPages) {
  writeFileSync(join(poemsDir, `${page.slug}.md`), poemMarkdown(page));
}

const formLlmsLinks = formPages
  .map(
    (page) =>
      `- [${page.h1}](${SITE}${page.path}): ${page.pattern.join("-")} checker — [${page.slug}.md](${SITE}/tools/${page.slug}.md)`,
  )
  .join("\n");

const poemLlmsLinks = poemPages
  .map(
    (page) =>
      `- [${page.poemTitle}](${SITE}${page.path}): ${page.author} analysis — [${page.slug}.md](${SITE}/poems/${page.slug}.md)`,
  )
  .join("\n");

const llmsTxt = `# lyriic

> lyriic is a local-first web editor for writing poetry and lyrics in meter, with per-line syllable counts, optional meter rulers, and quiet rhyme/synonym helpers.

lyriic runs entirely in the browser at ${SITE}. Drafts stay on-device; there is no account or cloud sync. Syllable counts default to a fused US pronunciation dictionary; users can override ambiguous words per draft. lyriic is not a generative AI lyric writer.

## Product

- [lyriic home](${SITE}/): Product landing — zen poem canvas pitch with live samples; open the editor at ${SITE}/write
- [Editor](${SITE}/write): Free local-first zen editor for poetry and lyrics — syllable counts, meter rulers, rhyme and synonym helpers
- [About](${SITE}/about): Same landing (always, even after a draft exists) — also [about.md](${SITE}/about.md)
- [FAQ](${SITE}/faq): Common questions — also [faq.md](${SITE}/faq.md)

## Tools

- [All tools](${SITE}/tools): Index of utilities and form checkers
${TOOL_PAGES.map((tool) => {
  const blurb = tool.intro.split(/(?<=\.)\s/)[0] ?? tool.h1;
  return `- [${tool.h1}](${SITE}${tool.path}): ${blurb} — [${tool.slug}.md](${SITE}/tools/${tool.slug}.md)`;
}).join("\n")}

### Form checkers

${formLlmsLinks}

## Poem analyses

- [All poem analyses](${SITE}/poems): ${poemsIndexIntro} — also [poems.md](${SITE}/poems.md)
${poemLlmsLinks}

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

${alsoByJoelMarkdown("lyriic")}
`

writeFileSync(join(publicDir, "llms.txt"), llmsTxt);

const toolSections = TOOL_PAGES.map(
  (tool) => `# ${tool.h1}

${tool.intro}

${tool.body.join("\n\n")}

${tool.faqs.map((item) => `## ${item.q}\n\n${item.plain}`).join("\n\n")}
`,
).join("\n---\n\n");

const formSections = formPages.map((page) => formToolMarkdown(page)).join("\n---\n\n");
const poemSections = poemPages.map((page) => poemMarkdown(page)).join("\n---\n\n");

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

# Poem analyses

${poemsIndexMd}
---

${poemSections}
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
  { loc: `${SITE}/write`, priority: "0.9", changefreq: "weekly" },
  { loc: `${SITE}/faq`, priority: "0.6", changefreq: "monthly" },
  { loc: `${SITE}/privacy`, priority: "0.4", changefreq: "yearly" },
  { loc: `${SITE}/tools`, priority: "0.8", changefreq: "monthly" },
  { loc: `${SITE}/poems`, priority: "0.8", changefreq: "weekly" },
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
  ...poemPages.map((page) => ({
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
  { loc: `${SITE}/poems.md`, priority: "0.5", changefreq: "weekly" },
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
  ...poemPages.map((page) => ({
    loc: `${SITE}/poems/${page.slug}.md`,
    priority: "0.5",
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
  `Wrote about.md, faq.md, privacy.md, poems.md, tools/*.md (${TOOL_PAGES.length} utility + ${formPages.length} form checkers), poems/*.md (${poemPages.length}), llms.txt, llms-full.txt, sitemap.xml`,
);

/**
 * Generates public agent/SEO markdown mirrors from src/content modules.
 * Run: node --experimental-strip-types scripts/build-seo-content.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { FAQ_ENTRIES, FAQ_INTRO } from "../src/content/faq.ts";
import { PRIVACY_EFFECTIVE, PRIVACY_INTRO, PRIVACY_SECTIONS } from "../src/content/privacy.ts";
import { TOOL_PAGES } from "../src/content/tools.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const toolsDir = join(publicDir, "tools");
const SITE = "https://lyriic.com";
const LASTMOD = new Date().toISOString().slice(0, 10);

mkdirSync(toolsDir, { recursive: true });

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

- [Syllable counter](${SITE}/tools/syllable-counter) — [${SITE}/tools/syllable-counter.md](${SITE}/tools/syllable-counter.md)
- [Haiku checker](${SITE}/tools/haiku-checker) — [${SITE}/tools/haiku-checker.md](${SITE}/tools/haiku-checker.md)
- [Rhyme finder](${SITE}/tools/rhyme-finder) — [${SITE}/tools/rhyme-finder.md](${SITE}/tools/rhyme-finder.md)

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

const llmsTxt = `# lyriic

> lyriic is a local-first web editor for writing poetry and lyrics in meter, with per-line syllable counts, optional meter rulers, and quiet rhyme/synonym helpers.

lyriic runs entirely in the browser at ${SITE}. Drafts stay on-device; there is no account or cloud sync. Syllable counts default to a fused US pronunciation dictionary; users can override ambiguous words per draft. lyriic is not a generative AI lyric writer.

## Product

- [lyriic home](${SITE}/): Zen poem canvas with syllable counts and meter tools
- [Product brief (Markdown)](${SITE}/about.md): Features, audience, privacy model, how counting works
- [FAQ](${SITE}/faq): Common questions — also [faq.md](${SITE}/faq.md)

## Tools

- [Syllable counter](${SITE}/tools/syllable-counter): Per-line syllable counts — [syllable-counter.md](${SITE}/tools/syllable-counter.md)
- [Haiku checker](${SITE}/tools/haiku-checker): 5-7-5 validator — [haiku-checker.md](${SITE}/tools/haiku-checker.md)
- [Rhyme finder](${SITE}/tools/rhyme-finder): Local rhyming dictionary — [rhyme-finder.md](${SITE}/tools/rhyme-finder.md)

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

const llmsFull = `${aboutMd}

---

# FAQ

${FAQ_ENTRIES.map((item) => `## ${item.q}\n\n${item.plain}`).join("\n\n")}

---

# Tools

${toolSections}
---

# Privacy

${PRIVACY_EFFECTIVE}

${PRIVACY_INTRO}

${PRIVACY_SECTIONS.map((section) => `## ${section.h2}\n\n${section.body}`).join("\n\n")}
`;

writeFileSync(join(publicDir, "llms-full.txt"), llmsFull);

const WRITER_SLUGS = [
  "haiku",
  "iambic-pentameter",
  "common-meter",
  "tanka",
  "sonnet",
  "limerick",
];

const urls = [
  { loc: `${SITE}/`, priority: "1.0", changefreq: "weekly" },
  { loc: `${SITE}/faq`, priority: "0.6", changefreq: "monthly" },
  { loc: `${SITE}/privacy`, priority: "0.4", changefreq: "yearly" },
  ...TOOL_PAGES.map((tool) => ({
    loc: `${SITE}${tool.path}`,
    priority: "0.8",
    changefreq: "monthly",
  })),
  ...WRITER_SLUGS.map((slug) => ({
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

console.log("Wrote about.md, faq.md, privacy.md, tools/*.md, llms.txt, llms-full.txt, sitemap.xml");

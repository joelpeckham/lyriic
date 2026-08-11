# Poem analysis content agent brief

You are authoring one lyriic poem-analysis page. Work only on the assigned poem slug.

## Files

- Write **only**: `src/content/poems/poems/{slug}.ts`
- Types: `src/content/poems/types.ts` (`PoemAnalysisContent`)
- Helpers: `src/content/poems/blocks.ts` (`p`, `excerpt`)
- Settings: `src/content/poems/settings.ts` (`poemMeterSettings`, `poemOpenSettings`)
- Catalog (copyright screening): `src/content/poems/catalog.ts`
- Do **not** edit `src/content/poems/index.ts` — the coordinator registers imports.

## Goals

1. Confirm the poem is **public domain in the US** (first published ≤ 1930). If copyrighted or only a modern copyrighted translation exists, stop and report — do not write a module.
2. Source verse lines from Wikisource, Project Gutenberg, Poetry Foundation, or poets.org. Preserve spelling/punctuation. Record `fullTextSource` (link to the full poem — do **not** dump the full poem into the page).
3. **No full-poem embed.** Sprinkle **≥3** `excerpt(...)` blocks (each **1–3 non-empty lines**) next to the claims they illustrate.
4. Research real criticism with WebSearch, then **WebFetch every URL you cite**. Quotes must appear on the fetched page. Zero fabricated citations.
5. Use **≥4** `citations` with stable kebab `id`s. Inline them with `p("…", ["cite-id"])` on **≥2 distinct** citation ids across the page.
6. `criticalViews` is `{ citeId }[]` (≥2) pointing at citations that include a verified `quote`.
7. Attribute interpretive claims to cited sources. Neutral synthesis only for transitions.
8. Tone: factual, concise, student-helpful — not promotional AI-slop.
9. Set `status: "ready"` and export a named const (e.g. `theRoadNotTakenPoem`).

## SEO chrome

| Field | Notes |
|-------|--------|
| `title` | `"{Poem Title} Analysis & Meaning — {Author} — lyriic"` |
| `description` | ~150 chars; mention analysis / meaning / themes |
| `h1` | Usually `"{Poem Title} analysis"` |
| `intro` | 1–2 sentences targeting “analysis / meaning / interpretation” |

## Analysis slots (blocks)

Import helpers:

```ts
import { excerpt, p } from "../blocks";
import type { PoemAnalysisContent } from "../types";
import { poemMeterSettings } from "../settings";
```

| Field | Notes |
|-------|--------|
| `summary` / `meaning` / `formAndMeter` / `historicalContext` | `PoemBlock[]` — mix `p(...)` and `excerpt(...)` |
| `themes` | 2–4 `{ theme, blocks }` |
| `literaryDevices` | 2–4 `{ device, blocks }` — put line examples in `excerpt`, not plain italics |
| `citations` | ≥4 `{ id, source, author?, url, quote? }` |
| `criticalViews` | ≥2 `{ citeId }` with quotes on those citations |
| `faqs` | ≥3; include meaning / themes / form; optional `href` to `/tools/...` |
| `cta` | Prefer `"Write with this poem’s meter in the editor"` or `"Open the zen editor"` |

### Excerpt rules

- Max **three** non-empty verse lines per `excerpt`.
- One verse line per line; blank lines **only** between stanzas (rare in short excerpts).
- Place excerpts **beside** the prose they support (after a claim, not dumped at the top).

### Citation rules

- `id`: kebab-case, unique within the module.
- Inline with `p("Claim grounded in the source.", ["my-cite-id"])`.
- Featured quotes: put `quote` on the citation and list `{ citeId: "my-cite-id" }` in `criticalViews`.
- WebFetch every cited URL; do not invent critics or quote text.

## Editor settings

- Prefer a catalog meter via `poemMeterSettings("iambic-pentameter")` etc. when appropriate.
- Free verse / irregular: `poemOpenSettings()`.
- Turn on overlays that help students (counts, stress) without being noisy.
- The page CTA opens `/write/{meter}` automatically from `editorSettings.meter`.

## Out of scope

- Do not register the module in `index.ts`.
- Do not invent critics, journals, or quote text you did not fetch.
- Do not include poems marked `copyrighted-skip` in the catalog.
- Do not paste the entire poem into any field.

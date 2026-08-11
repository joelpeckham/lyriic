# Poem analysis content agent brief

You are authoring one lyriic poem-analysis page. Work only on the assigned poem slug.

## Files

- Write **only**: `src/content/poems/poems/{slug}.ts`
- Types: `src/content/poems/types.ts` (`PoemAnalysisContent`)
- Settings helpers: `src/content/poems/settings.ts` (`poemMeterSettings`, `poemOpenSettings`)
- Catalog (copyright screening): `src/content/poems/catalog.ts`
- Do **not** edit `src/content/poems/index.ts` — the coordinator registers imports.

## Goals

1. Confirm the poem is **public domain in the US** (first published ≤ 1930). If it is copyrighted or the only usable English text is a modern translation still under copyright, stop and report — do not write a module.
2. Source the poem text from Wikisource, Project Gutenberg, Poetry Foundation, or poets.org. Preserve spelling/punctuation. Record `fullTextSource`.
3. Poem `text` formatting: one verse line per line; blank lines **only** between stanzas (never between every line).
4. Long poems (epics, *The Waste Land*, *Song of Myself*, etc.): set `isExcerpt: true`, include a famous excerpt, write `excerptNote`, and link the full text.
5. Research real criticism with WebSearch, then **WebFetch every URL you cite**. Quotes in `criticalViews` must appear on the fetched page. Zero fabricated citations.
6. Attribute interpretive claims to cited sources. Neutral synthesis only for transitions.
7. Tone: factual, concise, student-helpful — not promotional AI-slop. Match lyriic’s voice (see form checkers / about copy).
8. Set `status: "ready"` and export a named const (e.g. `theRoadNotTakenPoem`).

## SEO chrome

| Field | Notes |
|-------|--------|
| `title` | `"{Poem Title} Analysis & Meaning — {Author} — lyriic"` |
| `description` | ~150 chars; mention analysis / meaning / themes |
| `h1` | Usually `"{Poem Title} analysis"` |
| `intro` | 1–2 sentences targeting “analysis / meaning / interpretation” |

## Analysis slots

| Field | Notes |
|-------|--------|
| `summary` | 1–2 short paragraphs |
| `meaning` | Interpretation grounded in sources |
| `themes` | 2–4 `{ theme, discussion }` |
| `formAndMeter` | Form, rhyme, meter; use `poemMeterSettings` when a catalog meter fits |
| `literaryDevices` | 2–4 devices with optional `example` line |
| `historicalContext` | Publication / biographical context |
| `criticalViews` | ≥2 `{ source, author?, quote, url }` — quotes verified via WebFetch |
| `faqs` | ≥3; include meaning / themes / form; optional `href` to `/tools/...` |
| `sources` | ≥2 reference links (https) |
| `cta` | Prefer `"Write with this poem’s meter in the editor"` or `"Open the zen editor"` |

## Editor settings

- Prefer a catalog meter via `poemMeterSettings("iambic-pentameter")` etc. when appropriate.
- Free verse / irregular: `poemOpenSettings()`.
- Turn on overlays that help students (counts, stress) without being noisy.

## Out of scope

- Do not register the module in `index.ts`.
- Do not invent critics, journals, or quote text you did not fetch.
- Do not include poems marked `copyrighted-skip` in the catalog.
- Do not rewrite the poem into modernized spelling unless that is the standard PD text you sourced.

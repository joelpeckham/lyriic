# Scripts

Dictionary rebuilds download large sources into `scripts/sources/` (gitignored)
and write committed binary packs under `src/lib/data/packs/`.

Requires Python `wordfreq` for Zipf ranking:

```bash
pip install wordfreq
```

`pnpm build` does **not** regenerate dictionary artifacts.

## Pronunciation (syllables + rhymes)

Fuses US English sources, preference order Misaki gold → CMUdict → Misaki silver → WikiPron:

| Source | License | Role |
|--------|---------|------|
| [Misaki](https://github.com/hexgrad/misaki) `us_gold` / `us_silver` | Apache 2.0 | Vetted narrow IPA |
| [CMUdict](https://github.com/cmusphinx/cmudict) (`cmudict.dict`) | BSD-style / unrestricted | Long-tail coverage (vendored) |
| [WikiPron](https://github.com/CUNY-CL/wikipron) `eng_latn_us_broad` | CC-BY-SA | Variants + extra coverage |

```bash
pnpm build:pronunciation
# aliases:
pnpm build:cmu
pnpm build:rhyme
```

Writes:

- `src/lib/data/packs/lexicon.bin` — front-coded lemmas + syllable counts
- `src/lib/data/packs/rhyme-perfect.bin` — perfect-rhyme ID index
- `src/lib/data/packs/rhyme-end.bin` — end-rhyme ID index

Perfect-rhyme key = IPA phones from the last primary stress (else secondary, else last non-reduced vowel) through the coda. End-rhyme key = last vowel nucleus through the coda (ignores stress; fun ↔ anyone). See `scripts/lib/ipa.mjs` and `src/lib/rhyme/rhymeKey.ts`. Pack codec: `scripts/lib/dictPack.mjs`.

## Thesaurus

| Source | License | Role |
|--------|---------|------|
| [Open English WordNet 2025](https://github.com/globalwordnet/english-wordnet) | CC-BY 4.0 | Synset members + adjective `similar` |
| [Wiktionary](https://kaikki.org/dictionary/) (kaikki.org / wiktextract) | CC-BY-SA | Additional synonym links |
| [`wordfreq`](https://pypi.org/project/wordfreq/) | MIT | Zipf ranking at build time |

```bash
pnpm build:thesaurus
```

Requires `lexicon.bin` from `build:pronunciation`. Writes `src/lib/data/packs/thesaurus.bin` (IDs into the shared lexicon plus a small overflow string table). Headwords restricted to the lexicon; synonyms grouped by usage (`n` / `v` / `a` / `r`). OEWN candidates ranked first within each usage, then Wiktionary fill (no cap).

## Other

- `convert-json-to-dict-packs.mjs` — one-shot JSON → binary migration (legacy)
- `build-seo-content.mjs` — SEO / agent markdown mirrors
- `prerender.mjs` — static prerender for marketing routes

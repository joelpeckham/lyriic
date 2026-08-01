# Scripts

Dictionary rebuilds download large sources into `scripts/sources/` (gitignored)
and write committed runtime JSON under `src/lib/*/data/`.

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

- `src/lib/syllables/data/cmu-syllables.json` — vowel-nucleus syllable counts
- `src/lib/rhyme/data/rhyme-index.json` — perfect-rhyme index (IPA keys; alt pronunciations; Zipf-ranked buckets, max 80)

Perfect-rhyme key = IPA phones from the last primary stress (else secondary, else last vowel) through the coda. See `scripts/lib/ipa.mjs` and `src/lib/rhyme/rhymeKey.ts`.

## Thesaurus

| Source | License | Role |
|--------|---------|------|
| [Open English WordNet 2025](https://github.com/globalwordnet/english-wordnet) | CC-BY 4.0 | Synset members + adjective `similar` |
| [Wiktionary](https://kaikki.org/dictionary/) (kaikki.org / wiktextract) | CC-BY-SA | Additional synonym links |
| [`wordfreq`](https://pypi.org/project/wordfreq/) | MIT | Zipf ranking at build time |

```bash
pnpm build:thesaurus
```

Writes `src/lib/thesaurus/data/synonyms.json`. Headwords restricted to the syllable map; OEWN candidates ranked first, then Wiktionary fill (max 60 single-word lemmas).

## Other

- `build-seo-content.mjs` — SEO / agent markdown mirrors
- `prerender.mjs` — static prerender for marketing routes

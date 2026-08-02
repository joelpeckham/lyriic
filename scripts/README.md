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
```

Writes:

- `src/lib/data/packs/lexicon.bin` — front-coded lemmas + syllable counts
- `src/lib/data/packs/stress.bin` — packed per-syllable stress (0/1/2) keyed by lexicon word id
- `src/lib/data/packs/variants.bin` — sparse non-primary syllable/stress alts (from merge IPA alts + `scripts/data/poetic-compressions.json`)
- `src/lib/data/packs/rhyme-perfect.bin` — perfect-rhyme ID index
- `src/lib/data/packs/rhyme-end.bin` — end-rhyme ID index
- `src/lib/data/packs/rhyme-slant.bin` — slant-rhyme ID index (family + one-segment coda truncate)

Perfect-rhyme key = IPA phones from the last primary stress (else secondary, else last non-reduced vowel) through the coda. End-rhyme key = last vowel nucleus through the coda (ignores stress; fun ↔ anyone). Slant keys (same stress anchor as perfect): family half-rhyme = vowel family + coda family (night ↔ side); when the coda has two or more segments, also emit the key with the final segment dropped (mind ↔ time, hold ↔ coal). Pure vowel-only assonance is not indexed. Stress patterns come from primary IPA vowel nuclei (unmarked multi-syllable IPA gets primary on the last non-reduced nucleus, matching rhyme). Syllable/stress **alts** are packed sparsely for meter-fit (citation primary stays in lexicon/stress). IPA helpers live in `scripts/lib/ipa.mjs` (build-time only; client uses precomputed packs). Pack codec: `scripts/lib/dictPack.mjs`.

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

- `build-seo-content.mjs` — SEO / agent markdown mirrors
- `prerender.mjs` — static prerender for marketing routes (`react-dom/server` + Vite SSR)

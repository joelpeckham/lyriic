# Scripts

## `cmudict.dict`

Vendored [CMU Pronouncing Dictionary](https://github.com/cmusphinx/cmudict) (cmusphinx format). Unrestricted use; acknowledge CMU on redistribute.

## `build-cmu-syllables.mjs`

Parses `cmudict.dict` and writes primary syllable counts to `src/lib/syllables/data/cmu-syllables.json`.

```bash
pnpm build:cmu
```

## Moby Thesaurus II (`mthesaur.txt`)

[Moby Thesaurus II](https://www.gutenberg.org/ebooks/3202) by Grady Ward — public domain (Project Gutenberg ebook 3202). Acknowledge on redistribute.

The raw file (`scripts/mthesaur.txt`, ~24 MB) is not committed; `build-thesaurus` downloads it from Gutenberg when missing.

## `build-thesaurus.mjs`

Parses Moby Thesaurus II into a compact single-word synonym map at `src/lib/thesaurus/data/synonyms.json`. Headwords are restricted to lemmas present in the CMU syllable map; each head keeps up to 40 short single-word synonyms.

```bash
pnpm build:thesaurus
```

`pnpm build` does not regenerate this file — commit the JSON artifact (lazy-loaded at runtime).

## `build-rhyme-index.mjs`

Parses `cmudict.dict` primary pronunciations into a perfect-rhyme index at `src/lib/rhyme/data/rhyme-index.json` (`byWord` → key, `byKey` → capped lemmas). Rhyme key = ARPAbet from the last primary stress (fallback: last secondary) through the coda. Each bucket keeps up to 40 shorter lemmas.

```bash
pnpm build:rhyme
```

`pnpm build` does not regenerate this file — commit the JSON artifact (lazy-loaded at runtime). Key algorithm is mirrored in `src/lib/rhyme/rhymeKey.ts` for tests.

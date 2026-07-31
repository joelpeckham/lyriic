# Scripts

## `cmudict.dict`

Vendored [CMU Pronouncing Dictionary](https://github.com/cmusphinx/cmudict) (cmusphinx format). Unrestricted use; acknowledge CMU on redistribute.

## `build-cmu-syllables.mjs`

Parses `cmudict.dict` and writes primary syllable counts to `src/lib/syllables/data/cmu-syllables.json`.

```bash
pnpm build:cmu
```

# lyriic

A zen text editor for writing in meter. Large-font canvas, subtle per-line syllable counts, optional meter rulers and stress marks, and quiet per-draft syllable/stress overrides for ambiguous words.

Built for [lyriic.com](https://lyriic.com)
Write-up on my blog: [I meant to write a song but built a local-first lyric editor instead.](https://jpeckham.com/projects/lyriic/)

## Stack

- Vite + React + TypeScript
- CodeMirror 6 (poem canvas)
- Tailwind CSS + [shadcn/ui](https://ui.shadcn.com)
- pnpm

## Develop

```bash
pnpm install
pnpm dev
```

Open the local URL Vite prints (usually [http://localhost:5173](http://localhost:5173)).

```bash
pnpm test
pnpm build
pnpm preview
pnpm lint
```

`pnpm build` regenerates SEO/agent files (`llms.txt`, markdown mirrors, sitemap), builds the app, then prerenders `/faq`, `/privacy`, and `/tools/*` to static HTML via `react-dom/server` (Vite SSR) — no browser required.

Regenerate Open Graph images (Playwright screenshots of `og.html` → `public/og/`):

```bash
pnpm build:og
```

Preview the OG gallery with `pnpm dev:og`.

Rebuild pronunciation packs (shared lexicon + perfect/end/slant rhyme indexes). Downloads Misaki and WikiPron into `scripts/sources/` when missing; requires `pip install wordfreq`:

```bash
pnpm build:pronunciation
```

Rebuild the thesaurus pack (Open English WordNet + Wiktionary; downloads when missing; requires lexicon from `build:pronunciation`):

```bash
pnpm build:thesaurus
```

Rebuild definition digraph packs (OEWN glosses + Wiktionary fill; requires lexicon):

```bash
pnpm build:definitions
```

Runtime dictionaries live under `src/lib/data/packs/` as compact binary assets (not JSON).

## Syllable counting

Defaults follow the fused US pronunciation corpus (Misaki + [CMU Pronouncing Dictionary](http://www.speech.cs.cmu.edu/cgi-bin/cmudict) + WikiPron): vowel nuclei in the primary IPA transcription. Hyphenated compounds are split and summed. Out-of-vocabulary words use a spelling heuristic. Prefer an alternate count for ambiguous words (e.g. poetic `fire` as 1) via hover/tap a word → Syllables; overrides persist with the active draft.

## Data attribution

Offline dictionaries are built from:

- [Misaki](https://github.com/hexgrad/misaki) pronunciation data — Apache 2.0
- [CMUdict](https://github.com/cmusphinx/cmudict) — © Carnegie Mellon University; unrestricted use; acknowledgment requested
- [WikiPron](https://github.com/CUNY-CL/wikipron) (Wiktionary pronunciations) — CC-BY-SA
- [Open English WordNet](https://github.com/globalwordnet/english-wordnet) — CC-BY 4.0
- [Wiktionary](https://www.wiktionary.org/) synonyms via [kaikki.org / wiktextract](https://kaikki.org/dictionary/) — CC-BY-SA
- [`wordfreq`](https://pypi.org/project/wordfreq/) — MIT (build-time ranking only)

See [scripts/README.md](scripts/README.md) for rebuild details.
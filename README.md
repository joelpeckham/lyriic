# lyriic

A zen text editor for writing in meter. Large-font canvas, subtle per-line syllable counts, optional meter rulers, and quiet per-draft syllable overrides for ambiguous words.

Built for [lyriic.com](https://lyriic.com) on Vercel.

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

`pnpm build` regenerates SEO/agent files (`llms.txt`, markdown mirrors, sitemap), builds the app, then prerenders `/faq`, `/privacy`, and `/tools/*`. Prerender installs Playwright Chromium automatically when missing.

Rebuild pronunciation packs (shared lexicon + perfect/end rhyme indexes). Downloads Misaki and WikiPron into `scripts/sources/` when missing; requires `pip install wordfreq`:

```bash
pnpm build:pronunciation
```

Rebuild the thesaurus pack (Open English WordNet + Wiktionary; downloads when missing; requires lexicon from `build:pronunciation`):

```bash
pnpm build:thesaurus
```

Runtime dictionaries live under `src/lib/data/packs/` as compact binary assets (not JSON).
## Syllable counting

Defaults follow the fused US pronunciation corpus (Misaki + [CMU Pronouncing Dictionary](http://www.speech.cs.cmu.edu/cgi-bin/cmudict) + WikiPron): vowel nuclei in the primary IPA transcription. Hyphenated compounds are split and summed. Out-of-vocabulary words use a spelling heuristic. Prefer an alternate count for ambiguous words (e.g. poetic `fire` as 1) via Settings → Syllable overrides; overrides persist with the active draft.

## Data attribution

Offline dictionaries are built from:

- [Misaki](https://github.com/hexgrad/misaki) pronunciation data — Apache 2.0
- [CMUdict](https://github.com/cmusphinx/cmudict) — © Carnegie Mellon University; unrestricted use; acknowledgment requested
- [WikiPron](https://github.com/CUNY-CL/wikipron) (Wiktionary pronunciations) — CC-BY-SA
- [Open English WordNet](https://github.com/globalwordnet/english-wordnet) — CC-BY 4.0
- [Wiktionary](https://www.wiktionary.org/) synonyms via [kaikki.org / wiktextract](https://kaikki.org/dictionary/) — CC-BY-SA
- [`wordfreq`](https://pypi.org/project/wordfreq/) — MIT (build-time ranking only)

See [scripts/README.md](scripts/README.md) for rebuild details.

## Deploy

Vercel detects Vite automatically (`pnpm build` → `dist`). Security headers and CSP live in `vercel.json`. Point the production domain to `lyriic.com` in the Vercel dashboard (DNS). No env vars are required for the client-only editor.


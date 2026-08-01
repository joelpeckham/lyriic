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

`pnpm build` regenerates SEO/agent files (`llms.txt`, markdown mirrors, sitemap), builds the app, then prerenders `/faq`, `/privacy`, and `/tools/*` (requires Playwright Chromium: `pnpm exec playwright install chromium`).

Rebuild dictionary artifacts after updating `scripts/cmudict.dict`:

```bash
pnpm build:cmu
pnpm build:rhyme
```

Rebuild the synonym map after updating Moby source (downloads if missing):

```bash
pnpm build:thesaurus
```



## Syllable counting

Defaults follow the [CMU Pronouncing Dictionary](http://www.speech.cs.cmu.edu/cgi-bin/cmudict) **primary** pronunciation (count phones with stress digits). Hyphenated compounds are split and summed. Out-of-vocabulary words use a spelling heuristic. Prefer an alternate count for ambiguous words (e.g. poetic `fire` as 1) via Settings → Syllable overrides; overrides persist with the active draft.

CMUdict is © Carnegie Mellon University; use is unrestricted for research and commercial purposes. Acknowledgment requested on redistribute.

## Deploy

Vercel detects Vite automatically (`pnpm build` → `dist`). Security headers and CSP live in `vercel.json`. Point the production domain to `lyriic.com` in the Vercel dashboard (DNS). No env vars are required for the client-only editor.


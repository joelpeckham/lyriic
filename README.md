# lyriic

A zen text editor for writing in meter. Large-font canvas and subtle per-line syllable counts; meter rulers are planned for a later phase.

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

Rebuild the CMU syllable map after updating `scripts/cmudict.dict`:

```bash
pnpm build:cmu
```

## Syllable counting

Defaults follow the [CMU Pronouncing Dictionary](http://www.speech.cs.cmu.edu/cgi-bin/cmudict) **primary** pronunciation (count phones with stress digits). Hyphenated compounds are split and summed. Out-of-vocabulary words use a spelling heuristic. Call `setOverride(word, count)` to prefer an alternate count for ambiguous words (e.g. poetic `fire` as 1).

CMUdict is © Carnegie Mellon University; use is unrestricted for research and commercial purposes. Acknowledgment requested on redistribute.

## Deploy

Vercel detects Vite automatically (`pnpm build` → `dist`). Point the production domain to `lyriic.com`. No env vars are required for the client-only editor.

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for phases: syllable engine, editor canvas, meter rulers, and deploy polish.

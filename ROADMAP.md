# lyriic roadmap

English-first meter writing tool. Syllable API stays language-agnostic so other locales can plug in later.

## Architecture

```
TextCanvas → tokenizer → dict lookup / heuristic → memo cache → counts + rulers
Settings Sheet → meter preset → rulers
```

Counting and ruler geometry stay pure, sync, and memoized so typing stays at 60fps. Reach for a Web Worker only if profiling shows main-thread jank on long poems.

## Phase 0 — Foundations

- [x] Vite + React + TypeScript + Tailwind via pnpm
- [x] shadcn/ui (Radix) + Sheet / Button / Select / Switch / Label / Separator
- [x] Zen shell: canvas, gear → Sheet settings stub
- [x] Placeholder syllable API (`countWord` / `countLine`)

## Phase 1 — Syllable engine

Must be accurate enough for creative writing and cheap enough to recompute on every keystroke.

Counting policy: **CMU primary** pronunciation (count ARPAbet stress digits). Hyphenates **split + sum**. Ambiguous poetic words (`fire`, `every`, …) default to CMU; `setOverride` is ready for user preference (UI / `localStorage` later).

API in `src/lib/syllables/`:

- [x] `tokenizeLine(line) → tokens[]` (hyphen compounds as one token)
- [x] `countWord(word) → { count, source: 'dict' | 'heuristic' | 'override' }`
- [x] `countLine(line) → { total, perWord[] }`
- [x] Optional `SyllableProvider` type for future languages

English strategy:

- [x] Embed CMU Pronouncing Dictionary primary counts (`cmu-syllables.json`; rebuild via `pnpm build:cmu`)
- [x] Strip punctuation; handle contractions / possessives
- [x] Heuristic fallback for OOV (Greg Fast–style vowel-group rules)
- [x] User overrides map (in-memory; persisted per project in Phase 2)

Performance budget:

- [x] Invalidate O(changed lines) via `countLinesIncremental`
- [x] Per-word memo cache
- [x] Syllable numbers as overlay siblings (avoid layout thrash on the textarea)
- [x] Smoke-test ~500-line documents (`countLinesIncremental`)

- [x] Tests: dictionary hits, heuristics, edge cases (`the`, `fire`, `poem`, `rhythm`, hyphenates, overrides)

## Phase 2 — Editor canvas + drafts

- [x] Distraction-free large-font multiline editor (one field per hard line; soft-wrap within the line, extra gap between poetic lines)
- [x] Per-line syllable total at line end (subtle)
- [x] Hard newlines = poetic lines (Enter starts a new metered line)
- [x] Overlay scroll sync with textarea (counts stay aligned while scrolling)
- [x] O(changed lines) invalidation + overlay siblings for counts
- [x] Smoke-test ~500-line documents
- [x] **Multiple drafts / projects** persisted in `localStorage`:
  - [x] Create, rename, switch, and delete projects
  - [x] Autosave the active project on edit (debounced)
  - [x] Remember last-opened project across sessions
  - [x] Minimal project switcher UI (quiet; not a dashboard)
  - [x] Store per-project text + settings (meter, count/ruler prefs)
  - [x] Persist per-project syllable overrides (`setOverride` map → `localStorage`)

## Pre–Phase 3 — Accessibility hardening

- [x] App-wide theme (system / light / dark) + higher-contrast setting (`lyriic.prefs.v1`)
- [x] `prefers-contrast` / `prefers-reduced-motion` / `forced-colors` CSS
- [x] Contrast tokens for subtle text; editor keyboard (roving tabindex, focus ring, cross-line keys)
- [x] Landmarks, draft naming, meter SR status, save-error live region

## Phase 3 — Meter presets + rulers (current)

Settings Sheet (gear, top-right): meter type, show/hide counts, show/hide rulers, font size; appearance (theme / contrast) is app-wide.

Presets (v1):

- None (counts only)
- Haiku (5 / 7 / 5)
- Iambic pentameter (10 syllables; stress later)
- Common meter / ballad (8 / 6)
- Custom N syllables per line

Rulers: tick marks at cumulative syllable boundaries that track word positions; understated, not a HUD. Add shadcn pieces only as needed (`slider`, `tooltip`).

Ambiguous-word overrides (quiet UI): let the user set preferred counts for words like `fire` / `every` (defaults stay CMU primary). Wire to the existing override API; store with the active project.

## Phase 4 — Thesaurus popover

Word-level synonym helper that respects meter.

- Select or long-press / shortcut on a word → shadcn `Popover` anchored to the selection
- Fetch synonym candidates (start with a local/embedded thesaurus; remote API only if needed later)
- Show replacement options **sorted by syllable count** (ascending), with each option’s count shown subtly
- Highlight options that keep the current line on its meter target (same syllable delta as the replaced word, or that land on target)
- Clicking a synonym replaces the word in place and closes the popover
- Must stay fast: cache lookups; never block typing on the main path

## Phase 5 — Polish + deploy

- Keyboard shortcuts (toggle settings, focus canvas, thesaurus)
- Quiet first-run microcopy
- SEO/meta for lyriic.com, favicon
- Vercel + custom domain (`dist` static output)
- Lighthouse pass; no layout shift on gear/Sheet
- Shrink CMU payload: today `cmu-syllables.json` is statically imported and lands in the main JS chunk (~1.5 MB raw / ~0.5 MB gzip). Prefer lazy `import()` / separate chunk (or gzipped asset) so first paint isn’t blocked; `pnpm build` still does not run `build:cmu` — commit the generated JSON (or add a Vercel build step if we stop vendoring it)

## Phase 6 — Stretch

- Stress/accent marking for iambs
- Export / copy plain text
- Cloud sync / accounts for projects (optional; local-first remains default)
- Shareable read-only links (needs backend — defer)
- Multi-language providers
- Emit CMU **variant** syllable counts (not just primary) so preference UI can offer “careful vs casual” options where the dict disagrees (`interesting`, `different`, …)

## Out of scope for now

- Auth, accounts, cloud sync (local drafts only until Phase 6)
- Override preference UI (Phase 3; persistence already ships with projects)
- Working meter rulers (Phase 3)
- Thesaurus popover (Phase 4)
- CMU code-splitting / lazy load (Phase 5)

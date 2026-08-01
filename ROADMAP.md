# lyriic roadmap

English-first meter writing tool. Syllable API stays language-agnostic so other locales can plug in later.

## Architecture

```
PoemEditor (CodeMirror) → tokenizer → dict lookup / heuristic → memo cache → counts + rulers
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
- [x] Syllable numbers as overlay siblings (avoid layout thrash on the editor text)
- [x] Smoke-test ~500-line documents (`countLinesIncremental`)

- [x] Tests: dictionary hits, heuristics, edge cases (`the`, `fire`, `poem`, `rhythm`, hyphenates, overrides)

## Phase 2 — Editor canvas + drafts

- [x] Distraction-free large-font multiline editor
- [x] Per-line syllable total at line end (subtle)
- [x] Hard newlines = poetic lines (Enter starts a new metered line)
- [x] Overlay scroll sync (counts stay aligned while scrolling)
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
- [x] Contrast tokens for subtle text; editor keyboard (focus ring, native cross-line keys)
- [x] Landmarks, draft naming, meter SR status, save-error live region

## Pre–Phase 3 — Editor architecture pivot

Multi-textarea (one field per hard line) delivered zen soft-wrap vs poetic-line spacing, but forced custom selection/hit-testing. Migrated before rulers:

- [x] CodeMirror 6 poem canvas (hard line = `.cm-line`; soft-wrap leading vs poetic gap via CSS)
- [x] Native multi-line selection, undo, IME, copy/cut/paste
- [x] Syllable counts as `ViewPlugin` overlays via `coordsAtPos` (non-reflowing)
- [x] Single tab stop into the poem; skip-link + meter `aria-live` preserved
- [x] Removed multi-textarea document emulation (`useLineDocument`, custom `LineRange`, mirror-div caret geometry)

## Phase 3 — Meter presets + rulers

Settings Sheet (gear, top-right): meter type, show/hide counts, show/hide rulers, font size; appearance (theme / contrast) is app-wide.

Presets (v1):

- [x] None (counts only)
- [x] Haiku (5 / 7 / 5)
- [x] Iambic pentameter (10 syllables; stress later)
- [x] Common meter / ballad (8 / 6)
- [x] Custom N syllables per line

- [x] Rulers: tick marks at cumulative syllable boundaries that track word positions; understated, not a HUD
- [x] Ambiguous-word overrides (quiet UI): preferred counts for words like `fire` / `every` (defaults stay CMU primary); wired to project override API + localStorage

## Phase 4 — Thesaurus popover

Word-level synonym helper that respects meter.

- [x] Select or long-press / shortcut (`Mod-'`) on a word → shadcn `Popover` anchored to the selection
- [x] Local/embedded thesaurus (Moby → `synonyms.json` via `pnpm build:thesaurus`; lazy-loaded on first open)
- [x] Show replacement options **sorted by syllable count** (ascending), with each option’s count shown subtly
- [x] Highlight options that keep the current line on its meter target (same syllable delta as the replaced word, or that land on target)
- [x] Clicking a synonym replaces the word in place and closes the popover
- [x] Must stay fast: cache lookups; never block typing on the main path
- [x] Shared word-lookup host / selection bridge for Phase 4.5 (`mode: 'thesaurus' | 'rhyme'`)

## Phase 4.5 — Rhyme popover

Word-level rhyme helper that reuses the Phase 4 popover shell and meter-aware ranking. **Deferred** after Phase 4.

Interaction (same affordances as thesaurus; distinct shortcut / menu action):

- Select or long-press / shortcut on a word → shadcn `Popover` anchored to the selection
- Show rhyme candidates with each option’s syllable count shown subtly
- Sort by syllable count (ascending); highlight options that keep the current line on its meter target
- Clicking a rhyme replaces the word in place and closes the popover
- Must stay fast: cache lookups; never block typing on the main path

Rhyme data (local-first):

- Today’s runtime `cmu-syllables.json` stores **counts only** — phones are discarded at build time. Add a build step (extend `pnpm build:cmu` or a sibling script) that emits a compact rhyme index from `scripts/cmudict.dict` (primary pronunciation): perfect rhymes via shared stressed-vowel+coda key (ARPAbet from the last primary stress)
- Lazy-load the rhyme index (separate chunk) so first paint stays light; heuristic / empty state when the word is OOV
- Cap result lists; prefer common short words when many keys collide
- Slant / near rhyme is stretch (Phase 6), not v1

Shared with Phase 4:

- One popover host / selection bridge in the CodeMirror canvas; thesaurus vs rhyme as modes (or sibling actions), not two divergent selection stacks
- Replacement must be a targeted CM change (not full-doc replace) — see pre–Phase 3 I-33

## Phase 5 — Polish + deploy

- Keyboard shortcuts (toggle settings, focus canvas, thesaurus, rhyme)
- Quiet first-run microcopy
- SEO/meta for lyriic.com, favicon
- Vercel + custom domain (`dist` static output)
- Lighthouse pass; no layout shift on gear/Sheet
- Shrink CMU payload: today `cmu-syllables.json` is statically imported and lands in the main JS chunk (~1.5 MB raw / ~0.5 MB gzip). Prefer lazy `import()` / separate chunk (or gzipped asset) so first paint isn’t blocked; `pnpm build` still does not run `build:cmu` — commit the generated JSON (or add a Vercel build step if we stop vendoring it). Apply the same lazy pattern to the Phase 4.5 rhyme index.

## Phase 6 — Stretch

- Stress/accent marking for iambs
- Slant / near-rhyme matching (extend Phase 4.5 index)
- Export / copy plain text
- Cloud sync / accounts for projects (optional; local-first remains default)
- Shareable read-only links (needs backend — defer)
- Multi-language providers
- Emit CMU **variant** syllable counts (not just primary) so preference UI can offer “careful vs casual” options where the dict disagrees (`interesting`, `different`, …)

## Out of scope for now

- Auth, accounts, cloud sync (local drafts only until Phase 6)
- Rhyme popover (Phase 4.5)
- CMU code-splitting / lazy load (Phase 5)

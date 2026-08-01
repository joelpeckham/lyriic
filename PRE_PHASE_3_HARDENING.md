# Pre–Phase 3 Hardening — Master Remediation Plan

Synthesized from four parallel reviews (2026-07-31):

| Pass | Agent | Score |
|------|-------|-------|
| React best practices | [React BP](818f7497-7310-41b0-ac46-5b4f470b2a29) | 7/10 |
| Code organization | [Structure](c4717c8a-4a7d-499e-bd24-af8e2bfc6e8a) | 8/10 |
| Bug hunt | [Bugbot](2d2e7eee-8cf7-4adc-a630-ce6a0a4b774c) + [Bugs](248dae5d-e687-485f-bc0b-b24fd5127740) | risk 5/10 |
| Security | [Security](7619eebd-6128-46ae-aa24-b9e0b19a238e) (full-app; diff-based security agent had empty branch diff on `main`) | 8/10 |

**Verdict:** The codebase is in good shape for its size — clean layering, strong syllable/meter tests, defensive localStorage, solid CodeMirror integration, React Compiler already on. Do **not** rewrite. Fix a short list of concrete gaps before Phase 3 (rulers + override UI) piles more call sites onto fragile seams.

**Note:** Diff-based Bugbot/Security against `branch changes` failed (clean tree on `main`). Findings below come from natural-language Bugbot + full-codebase general-purpose bug/security agents.

---

## Consensus (multiple reviewers agree)

These showed up across 2+ passes with high confidence. Treat as ground truth.

1. **`showRulers` is a no-op** — Settings toggle + persistence exist; nothing in the editor reads the flag. Phase 3's ruler work; until then the UI lies.
2. **`useSyllableOverrides` mutates a module-level `Map` during render** — Conflicts with React purity / Compiler assumptions; will get worse with override UI and any concurrent features.
3. **Cross-tab last-write-wins on `localStorage`** — No `storage` event / merge; real data-loss risk; worse once Phase 3 adds more persisted override edits.
4. **`useProjects` has zero direct tests** — Most complex stateful module; Phase 3 will add more mutations through it.
5. **CMU dict is eagerly bundled** (~1.5MB raw / ~0.5MB gzip in the main chunk; zero `import()` in `src/`). Roadmap already parks this in Phase 5 — keep it there unless TTI becomes blocking.

---

## Master issue list

Severity key: **P0** ship-blocker / user-visible lie or data loss · **P1** fix before Phase 3 work lands · **P2** fix soon / with Phase 3 · **P3** polish / later.

### P0 — User-visible / data integrity

| ID | Area | Location | Issue | Remediation |
|----|------|----------|-------|-------------|
| I-01 | Bug / Product | `SettingsSheet.tsx` (~237–252), `settings.ts`, editor stack | **"Meter rulers" toggle does nothing.** Persists `showRulers`; never consumed by `PoemEditor` / overlays. | **Before Phase 3 coding:** hide, disable, or label "Coming soon". **As Phase 3:** wire a ruler overlay that reads `settings.showRulers` and `MeteredLine.boundaries` (prefer extending existing overlay system — don't fork `showCounts` vs `showRulers` into two drifting plugins). |
| I-02 | Bug / Security | `useProjects.ts` (~52–76), `projects/storage.ts` | **Multi-tab clobber.** Load-once, blind overwrite on debounce / `beforeunload` / `pagehide`. No `storage` listener. | Add `storage` event (or `BroadcastChannel`) reconciliation: reload or warn when another tab writes `lyriic.projects.v1`. Design Phase 6 sync around versions/ETags, not this LWW model. |

### P1 — Fix before / at the start of Phase 3

| ID | Area | Location | Issue | Remediation |
|----|------|----------|-------|-------------|
| I-03 | React / Bugs | `useSyllableOverrides.ts:21–27`, `syllables/overrides.ts` | **Render-time mutation of global override `Map`.** Safe today by single call site + idempotent match; unsafe under discarded renders / multi-instance. | Prefer threading overrides into `countWord`/`countLine` (or key memo by overrides identity). Minimum: move sync to `useLayoutEffect` and accept one-frame lag, or document a hard single-writer / single-editor contract. |
| I-04 | React | `useProjects.ts` `setText` + `createPoemExtensions` `updateListener` | **Every keystroke commits React state** while persistence is correctly debounced 300ms. Fan-out re-renders `EditorShell` / switcher / settings. | Keep CodeMirror as typing source of truth; buffer text in a ref; flush into React state on the same debounce as persistence (or debounce `setText`). |
| I-05 | React | `useProjects.ts` `patchActive` | **Remaps entire `projects` array on every text patch** → new array ref → ProjectSwitcher re-diffs every keystroke. | Avoid full remap for text-only patches, or isolate live `text` from the structural projects list. Pairs with I-04. |
| I-06 | Structure / Tests | `useProjects.ts` | **No direct tests** for CRUD, debounce, structural flush, delete-active fallback, unload flush. | Add `useProjects.test.ts` with fake timers: create/rename/delete/switch, debounce vs structural flush, delete-active index fallback, `beforeunload` uses latest `stateRef`. |
| I-07 | Structure / Product | `useProjects.ts` `setOverride`/`clearOverride`; `EditorShell` | **Override API implemented but unwired** — Phase 3 line item; easy to reinvent if forgotten. | Wire Phase 3 override UI into these exports only; do not add a parallel mutation path. |
| I-08 | Bugs / UX | `SettingsSheet.tsx` (~161–179) | **Custom syllables input snaps to `1` when cleared** (`Number("")` → 0 → clamp to min). Can't retype multi-digit values cleanly. | Local draft string state; commit/clamp on blur or when parse is a complete valid number. |
| I-09 | Structure | `lib/PrefsProvider.tsx` | **React provider/hook lives in `lib/`**; other hooks live in `hooks/`. | Move to `hooks/usePrefs.tsx`; keep pure `lib/prefs.ts` as-is. |

### P2 — With Phase 3 or immediately after

| ID | Area | Location | Issue | Remediation |
|----|------|----------|-------|-------------|
| I-10 | React | `PoemEditor.tsx` (~72–100) | Syllable cache uses **setState-during-render** → guaranteed second commit per keystroke. | Move cache to `useRef` mutated during render (idempotent). |
| I-11 | Bugs / CM | `syllableOverlay.ts` (~50–55) + Bugbot | **Stale counts for one frame (or more):** plugin redraws on `docChanged` before React effect pushes new meter data. | Accept one-frame flicker, or push counts from CM update path / shared store so overlay data updates in the same turn as the doc change. |
| I-12 | React / CM | `syllableOverlay.ts` (~25–32, 126–129) | **RAF in plugin constructor not cancelled in `destroy()`.** | Store RAF id; `cancelAnimationFrame` in `destroy()`. |
| I-13 | A11y | `index.css` `.lyriic-count--*` + overlay | Meter status conveyed **by color only** (WCAG 1.4.1). SR live region is fine. | Non-color cue for `--over` at minimum (weight / underline). |
| I-14 | React | `main.tsx` / `App.tsx` | **No error boundary** — CM mount failure whitescreens whole app. | Boundary around `PoemEditor` (keep shell/settings alive). |
| I-15 | Tests | `countLine.ts` | **No dedicated tests** for `countLinesIncremental` line-shift caveat; only indirect coverage. | Add `countLine.test.ts`: totals, index shift on insert, override-policy recount. |
| I-16 | Tests | `ProjectSwitcher.tsx`, `SettingsSheet.tsx` | No component tests; Phase 3 will extend both. | Smoke tests: open dialog/select, focus-restore, custom-syllables clamping (after I-08). |
| I-17 | Tooling | `tsconfig.app.json` | `exclude` is `*.test.ts` only — **`.test.tsx` still in app project**. | Exclude `src/**/*.test.{ts,tsx}` (or drop exclude on purpose). |
| I-18 | Security / Hygiene | `package.json` | **`shadcn` in `dependencies`** but unused at runtime. | Move to `devDependencies` or remove / use `pnpm dlx`. |
| I-19 | Security | `index.html` inline theme script; no headers | **No CSP / security headers** yet. Inline boot script forces `'unsafe-inline'` or hash later. | Before any network feature (thesaurus/API): `vercel.json` headers + hash/externalize theme script. Can land in Phase 5 with deploy; draft CSP allowlist now. |
| I-20 | Bugs | `useProjects` save failure path | **No retry after quota/save error** if user stops typing — unload flush fails again. | Retry on `visibilitychange` / interval while `saveStatus === "error"`. |
| I-21 | Structure / Coupling | `syllables/overrides.ts`, `memo.ts`, `meterOverlay.ts` | **Three module-level mutable singletons.** Fine for one editor; brittle for split view / Phase 4. | Document single-instance constraint now; before Phase 4, scope by project/view or explicit `SyllableEngine`. |

### P3 — Polish / defer

| ID | Area | Location | Issue | Remediation |
|----|------|----------|-------|-------------|
| I-22 | Bundle | `syllables/dict.ts` + `cmu-syllables.json` | Eager 1.5MB dict in main chunk. | **Phase 5** (already on ROADMAP): lazy `import()` / asset + heuristic-first paint. Optionally worker later if profiled. |
| I-23 | TS | `SettingsSheet.tsx` (~141) | Redundant `as MeterPresetId` after `isMeterPresetId` guard. | Drop cast. |
| I-24 | TS | `projects/types.ts` | Persisted `overrides` not `Readonly<>`. | Optional hardening. |
| I-25 | Perf | `syllables/overrides.ts` | Override change clears **entire** word memo. | Scoped invalidation or revision-keyed memo. |
| I-26 | Structure | `lib/settings.ts`, `lib/prefs.ts` flat vs domain folders | Inconsistent granularity. | Split `settings/` only when it grows past ~100 lines / second concern. |
| I-27 | Structure | `components/editor/` vs flat components | No rule for when a component gets a folder. | Convention: co-located test or >1 file → folder. Apply going forward. |
| I-28 | Domain | `meters/types.ts` | `boundaries` overlaps `token.syllableEnd`. | Document canonical field when implementing rulers. |
| I-29 | Tooling | `package.json` | No `typecheck` script; no CI workflow. | Add `typecheck` + minimal CI (`lint`, `lint:hooks`, `typecheck`, `test`). |
| I-30 | Security | `tokenize.ts` / heuristics | Unbounded line length → possible self-DoS on paste. | Soft per-line cap before tokenize (esp. if logic ever goes server-side). |
| I-31 | Security | `storage.ts` `createProjectId` | `Math.random` fallback — fine for local IDs. | Never reuse as share-link secrets (Phase 6). |
| I-32 | Security | Google Fonts in `index.html` | Third-party network despite "local-only" story. | Keep + CSP allowlist, or self-host in Phase 5. |
| I-33 | Bugs (latent) | `PoemEditor.tsx` external `value` sync | Full-doc replace if `value` set externally — unused today; bad for thesaurus/AI later. | When external edits arrive: targeted CM changes, not full replace. |
| I-34 | Bundle | `radix-ui` umbrella imports | Unverified tree-shake; likely fine. | Spot-check with bundle analyzer when adding more shadcn. |

---

## Suspected / unconfirmed (do not schedule until verified)

- Punctuation-only lines under a meter may omit `/target` suffix (`buildMeteredLine` status `"none"` + overlay gate).
- Overlay `draw()` walks all lines then filters by viewport — possible jank at 500+ lines; not measured.
- StrictMode double-mount of `EditorView` in dev — should be clean; not asserted by test.

---

## Recommended execution order

### Wave A — Do before writing Phase 3 features (½–1 day)

1. **I-01** — Hide/disable rulers toggle *or* start Phase 3 by implementing rulers (don't leave a lying control).
2. **I-06** — `useProjects` tests (safety net before new mutations).
3. **I-03** — Stop render-time global Map mutation.
4. **I-08** — Custom syllables input draft state.
5. **I-09** + **I-17** — Move `PrefsProvider`; fix tsconfig test exclude.
6. **I-18** — `shadcn` → `devDependencies`.

### Wave B — Performance / resilience before heavier Phase 3 UI (½ day)

7. **I-04** + **I-05** — Debounce React text state; stop projects-array clone on every keystroke.
8. **I-02** — Cross-tab storage reconciliation (minimum viable: reload-or-warn).
9. **I-10**, **I-12** — Overlay cache ref + RAF cancel.
10. **I-14** — Error boundary around editor.

### Wave C — Phase 3 itself (product work; use existing seams)

11. Rulers: consume `showRulers` + `boundaries` (**I-01** complete, **I-28**).
12. Override UI: wire `setOverride`/`clearOverride` only (**I-07**); keep singleton contract documented until I-21.
13. Tests for `countLine` incremental + Settings/ProjectSwitcher smoke (**I-15**, **I-16**).
14. A11y non-color meter cue (**I-13**) while touching overlay CSS.

### Wave D — Defer (roadmap already owns these)

15. **I-22** CMU lazy load → Phase 5.
16. **I-19** CSP/headers → with Vercel deploy (Phase 5); design `connect-src` before Phase 4 network.
17. **I-21** scoped syllable engine → before Phase 4 multi-consumer.
18. **I-29** CI → whenever convenient; cheap insurance.
19. **I-20**, **I-30–I-34** → opportunistic.

---

## What to keep (do not "fix")

- CodeMirror mount-once + Compartment + WeakMap overlay channel + `onChangeRef` pattern in `PoemEditor`.
- React Compiler in Vite — don't sprinkle manual `useMemo`/`useCallback` unless profiling demands it.
- Versioned, validating localStorage (`projects` + `prefs`) with corrupt quarantine.
- `lib/syllables` isolation (no upward imports); curated barrels in `meters`/`syllables`.
- Layering: `components` → `hooks` → `lib`; no cycles.
- A11y baseline: skip link, live regions, reduced-motion / forced-colors / contrast prefs.
- Oxlint + thin typed ESLint split (documented in `eslint.config.js`).

---

## Explicit non-goals for this hardening pass

- No `features/` or domain top-level reorg (~40 files is fine).
- No TipTap migration (stack is CodeMirror 6).
- No cloud sync / auth work (Phase 6).
- No premature Web Worker for counting (profile first; roadmap agrees).
- Do not treat unwired `setOverride` as dead code to delete — it's Phase 3 scaffolding.

---

## Suggested done criteria before calling Phase 3 "unblocked"

- [x] Rulers control either works or is not presented as working (I-01) — toggle hidden; persistence kept for Phase 3
- [x] `useProjects` has direct tests covering save/switch/delete/unload (I-06)
- [x] Override Map is not mutated during render (I-03) — layout-effect sync + overrides threaded into `countWord` / editor counts
- [x] Custom syllables field is retypeable (I-08)
- [x] Cross-tab overwrite has a mitigation or a documented known limitation with a follow-up issue (I-02) — `storage` listener; pending buffer keeps local and re-persists
- [x] Prefs provider lives under `hooks/` (I-09)
- [x] `pnpm test`, `pnpm lint`, `pnpm lint:hooks`, and `tsc -b` still clean

### Wave A + B implementation notes (2026-07-31)

Completed via parallel Grok 4.5 worktree agents, merged on `main`:

| Wave | Issues | Status |
|------|--------|--------|
| A | I-01, I-03, I-06, I-08, I-09, I-17, I-18, I-23 | Done |
| B | I-02, I-04, I-05, I-10, I-12, I-14 | Done |
| Follow-up | I-03 completeness (thread overrides; skip module memo when overrides passed) | Done |

Phase 3 closed: I-01 (rulers), I-07 (override UI), I-11 (skip stale redraw on docChanged + liveText), I-13 (over non-color cue), I-15 (`countLine` tests), I-16 (SettingsSheet smoke), I-28 (boundaries docs).

Phase 5 closed (2026-07-31): I-19 (`vercel.json` CSP/headers + external `theme-boot.js`), I-22 (lazy CMU + recount), I-29 (`typecheck` + GitHub Actions CI), I-32 (self-hosted fonts via fontsource).

Still open for later waves: I-20, I-21, I-24–I-27, I-30–I-34 (see lists above).

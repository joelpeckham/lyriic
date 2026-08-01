# Pre–Phase 3 Hardening — Status

Hardening waves A/B and Phase 3/5 follow-ups are **closed** (2026-07-31). The long consensus/issue tables are historical; see git history on this file for the original remediation plan.

## Closed

| Wave | Issues |
|------|--------|
| A | I-01, I-03, I-06, I-08, I-09, I-17, I-18, I-23 |
| B | I-02, I-04, I-05, I-10, I-12, I-14 |
| Phase 3 | I-01 (rulers), I-07 (override UI), I-11, I-13, I-15, I-16, I-28 |
| Phase 5 | I-19 (CSP/headers), I-22 (lazy CMU), I-29 (typecheck/CI), I-32 (self-hosted fonts) |

Done criteria met: rulers toggle honest, `useProjects` tests, no render-time override Map mutation, retypeable custom syllables, cross-tab `storage` listener, prefs under `hooks/`, lint/typecheck/test clean.

## Still open

| ID | Notes |
|----|-------|
| **I-20** | No retry after quota/save error if the user stops typing (unload flush can fail again). |
| **I-21** | Three module-level mutable syllable singletons — document single-instance now; scope before Phase 4. |
| I-24 | Persisted `overrides` not `Readonly<>`. |
| I-25 | Override change clears entire word memo. |
| I-26 | `settings` / `prefs` flat vs domain folders. |
| I-27 | Convention for when a component gets a folder. |
| I-30 | Soft per-line cap before tokenize (self-DoS on huge paste). |
| I-31 | `Math.random` ID fallback — never reuse as share-link secrets. |
| I-33 | `PoemEditor` external `value` sync does full-doc replace. |
| I-34 | Spot-check `radix-ui` tree-shaking when adding more shadcn. |

Keep: CodeMirror mount-once + compartments, React Compiler, versioned validating localStorage, `lib/syllables` isolation, `components` → `hooks` → `lib` layering.

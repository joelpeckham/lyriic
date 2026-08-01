# Form checker content agent brief

You are authoring SEO content for one lyriic form-checker page. Work only on the assigned meter unless you are in the shared-explainer pre-pass.

## Files

- Per-form slots: `src/content/formCheckers/forms/{meterId}.ts`
- Shared explainers: `src/content/formCheckers/shared.ts` (`FOOT_EXPLAINERS`, `STRESS_EXPLAINERS`, `METER_EXPLAINERS`)
- Types: `src/content/formCheckers/types.ts`
- Catalog rules (source of truth for what the product enforces): `src/lib/meters/presets.ts`

## Goals

1. Web-research the form (history, famous examples, English teaching conventions).
2. Fill all slots in the form file; set `status: "ready"`.
3. Prefer an inline `meterExplainer: { id, title, body, status: "ready" }` on the form file (avoids merge conflicts on `shared.ts`). Reuse `footExplainerId` / `stressExplainerId` / `meterExplainerId` for shared library refs. Only edit `shared.ts` in the dedicated shared-explainer pre-pass.
4. **Verify implementation:** compare catalog `pattern`, `stressPatterns` / `footId`, and `stanzaLines` against sources. Record findings in `verificationNotes` (what we enforce vs rhyme/theme rules we intentionally omit).
5. Supply `sampleLines` that are close to the syllable targets (and plausible stress for stress-aware meters).
6. Tone: factual, concise, matches `forms/haiku.ts` — not promotional AI-slop.

## Slot checklist

| Field | Notes |
|-------|--------|
| `title` / `description` / `h1` / `intro` | SEO chrome; keep lyriic voice |
| `history` | 1–3 short paragraphs |
| `famousPoems` | 2–4 entries with title, author, optional excerpt/note |
| `formNotes` | Caveats (first note shows under the interactive tool) |
| `faqs` | 3 questions; mention local-first privacy |
| `sampleLines` | Length = catalog `stanzaLines` or open-meter default |
| `cta` | Prefer `"Write in the zen editor"` |
| `verificationNotes` | Catalog vs tradition |

When editing a shared explainer, set its `status: "ready"` and replace stub body copy.

## Out of scope

- Do not change syllable/stress algorithms or catalog patterns unless verification finds a clear bug — then note it in `verificationNotes` and stop; do not “fix” the catalog in the content pass without review.
- Do not invent rhyme-scheme enforcement; lyriic does not model rhyme schemes.
- Do not edit other meters’ form files.

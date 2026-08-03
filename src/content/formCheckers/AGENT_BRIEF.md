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
5. Supply `sampleLines` that **pass** the checker with packs loaded (`status === "exact"`). The golden suite in `sampleLines.meter.test.ts` enforces this for every ready form. Prefer dict-friendly wording; do not rely on Middle English, headless anapests, or mid-line substitutions the engine intentionally omits.
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

## Scansion guardrails (do not widen in content passes)

- Do **not** treat ±1 syllable as close enough without a named literary contour (feminine / catalexis / inversion already in `literaryAllowances.ts`).
- Do **not** assume Middle English final *-e*, anapest headless openings, or mid-line substitutions will Match — note them as intentionally omitted in `verificationNotes`.
- Do **not** change citation syllable primaries to poetic short forms; meter-fit uses `variants.bin` / `poetic-compressions.json` instead.
- Famous-poem excerpts may illustrate tradition without Matching; say so in the note when they need historical or loose scansion.

## Out of scope

- Do not change syllable/stress algorithms or catalog patterns unless verification finds a clear bug — then note it in `verificationNotes` and stop; do not “fix” the catalog in the content pass without review.
- Do not add interactive rhyme-scheme UI on form-checker tools pages (they stay syllable/stress SEO tools). Named schemes live on the meter catalog and are checked in the zen editor; CTAs for rhyming forms should point writers there.
- Do not edit other meters’ form files.

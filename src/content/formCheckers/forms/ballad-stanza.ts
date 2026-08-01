import type { FormCheckerContent } from "../types";

export const balladStanzaForm: FormCheckerContent = {
  meterId: "ballad-stanza",
  status: "ready",
  title: "Ballad Stanza Checker (8-6-8-6) — lyriic",
  description:
    "Check a ballad-stanza quatrain against 8 · 6 · 8 · 6 with live syllable and iambic stress feedback. Free, private, and dictionary-based — then keep writing in lyriic’s zen editor.",
  h1: "Ballad stanza checker",
  intro:
    "Shape a four-line draft against 8 · 6 · 8 · 6 rising iambs. Same syllable and stress engine as the lyriic poetry editor — private in your browser.",
  history: [
    "The ballad stanza is a four-line quatrain from English and Scottish folk song: longer lines of four stresses (often taught as iambic tetrameter) alternating with shorter lines of three (iambic trimeter). In syllable teaching terms that is 8 · 6 · 8 · 6 — the same grid as common metre.",
    "Oral ballads favored simple diction, narrative drive, and rhyme on the short lines (usually ABCB). Literary poets later adopted the stanza for storytelling verse; Samuel Taylor Coleridge’s The Rime of the Ancient Mariner is the stock classroom example, though many of its stanzas loosen stress or stretch past four lines.",
    "Critics often distinguish ballad metre from strict common measure: ballads may vary unstressed syllables and keep ABCB rhyme, while hymn CM aims for steadier iambs and often ABAB. lyriic’s Ballad stanza preset models the regular 8.6.8.6 iambic teaching form — a clean practice grid rather than every folk irregularity.",
  ],
  famousPoems: [
    {
      title: "Sir Patrick Spens",
      author: "Traditional (Scottish)",
      note: "Classic Child ballad; often cited for the 4-stress / 3-stress quatrain shape.",
      excerpt:
        "I saw the new moon late yestreen / Wi' the auld moon in her arm;",
    },
    {
      title: "The Rime of the Ancient Mariner",
      author: "Samuel Taylor Coleridge",
      note: "Literary ballad built largely on ballad stanzas; many quatrains are regular 8.6.8.6, others freer.",
      excerpt:
        "All in a hot and copper sky, / The bloody Sun, at noon, / Right up above the mast did stand, / No bigger than the Moon.",
    },
    {
      title: "La Belle Dame sans Merci",
      author: "John Keats",
      note: "Romantic literary ballad in ABCB quatrains; line lengths sit near the ballad-stanza grid.",
      excerpt:
        "O what can ail thee, knight-at-arms, / Alone and palely loitering?",
    },
    {
      title: "The Ballad of Reading Gaol",
      author: "Oscar Wilde",
      note: "Later literary ballad that keeps the narrative quatrain pulse of the folk tradition.",
    },
  ],
  formNotes: [
    "lyriic checks a four-line cycle of 8 · 6 · 8 · 6 with iambic stress: long lines expect strong beats on 2, 4, 6, and 8; short lines on 2, 4, and 6. Folk and literary ballads often admit anapests, headless lines, or looser counts — mismatches are feedback against the teaching grid, not a claim that every published stanza is perfectly regular.",
    "Tradition usually rhymes the second and fourth lines (ABCB); common measure often prefers ABAB. lyriic does not enforce rhyme, refrain, or narrative content.",
  ],
  faqs: [
    {
      q: "What is a ballad stanza?",
      plain:
        "A four-line stanza that alternates longer and shorter lines — typically four stresses then three, taught in English classrooms as 8 · 6 · 8 · 6 iambic (tetrameter / trimeter). Folk ballads often rhyme ABCB; the form is closely related to common metre in hymnody.",
    },
    {
      q: "How is this different from common meter?",
      plain:
        "Both use the same 8.6.8.6 line lengths. Ballad stanza is the folk/literary name and traditionally leans ABCB with freer stress; common meter is the hymn label, usually steadier iambs and often ABAB. In lyriic, Ballad stanza stores the full quatrain as [8,6,8,6]; Common meter stores the [8,6] couplet cycle across four lines — same targets, different catalog packaging.",
    },
    {
      q: "Is my draft uploaded?",
      plain:
        "No. Syllable and stress checks run locally in your browser. lyriic is local-first and does not require an account.",
    },
  ],
  sampleLines: [
    "All in a hot and copper sky",
    "The bloody Sun, at noon",
    "Right up above the mast did stand",
    "No bigger than the Moon",
  ],
  cta: "Write in the zen editor",
  footExplainerId: "iamb",
  stressExplainerId: "iamb-8-6-8-6",
  meterExplainer: {
    id: "ballad-stanza",
    title: "How the ballad stanza works",
    body: [
      "A ballad stanza is a quatrain of alternating iambic tetrameter and iambic trimeter: eight syllables, then six, then eight, then six. Strong beats fall on the even positions — 2, 4, 6, and 8 on long lines; 2, 4, and 6 on short ones (da-DUM × 4 / da-DUM × 3).",
      "lyriic’s catalog stores that full cycle as pattern [8, 6, 8, 6] with footId iamb and stanzaLines 4. The related Common meter entry uses pattern [8, 6] cycled across the same four-line stanza — identical syllable and stress targets.",
      "Folk tradition often rhymes only lines 2 and 4 (ABCB) and may loosen unstressed syllables. lyriic checks the syllable and iambic stress grid only; rhyme, refrain, and story are left to you.",
    ],
    status: "ready",
  },
  verificationNotes: [
    "Catalog: pattern [8,6,8,6], footId iamb, stressPatterns via stressPatternsForCycle(iamb, [8,6,8,6]) → [[0,1,0,1,0,1,0,1], [0,1,0,1,0,1], [0,1,0,1,0,1,0,1], [0,1,0,1,0,1]], stanzaLines 4. Matches English teaching ballad stanza / common-metre quatrain (iambic tetrameter + trimeter). Intentionally omits ABCB/ABAB rhyme, folk ballad-metre stress looseness (variable unstressed syllables), refrains, and multi-line Coleridge variants. Related catalog entry common-meter is the same 8/6 cycle packaged as pattern [8,6]. sampleLines length 4.",
  ],
};

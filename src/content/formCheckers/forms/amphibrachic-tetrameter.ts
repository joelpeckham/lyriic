import type { FormCheckerContent } from "../types";

export const amphibrachicTetrameterForm: FormCheckerContent = {
  meterId: "amphibrachic-tetrameter",
  status: "ready",
  title: "Amphibrachic Tetrameter Checker — lyriic",
  description:
    "Check a draft in amphibrachic tetrameter: twelve syllables per line, light–strong–light. Live syllable and stress feedback — private in your browser, then keep writing in lyriic’s zen editor.",
  h1: "Amphibrachic tetrameter checker",
  intro:
    "Shape a draft against twelve-syllable amphibrachic lines (da-DUM-da × 4). Same syllable and stress engine as the lyriic poetry editor — private in your browser.",
  history: [
    "An amphibrach is a three-syllable foot with the stress in the middle (da-DUM-da). Amphibrachic tetrameter repeats that foot four times: twelve syllables with strong beats on positions 2, 5, 8, and 11. The rocking contour is less common as a named English meter than iambs or anapests, but it turns up in song, comic verse, children’s poetry, and some narrative lyrics.",
    "Victorian and later English poets used it for storytelling lines — Samuel Woodworth’s “The Old Oaken Bucket” is a familiar classroom example — and limericks are often scanned with amphibrachic (or anapestic) feet. In song, Leonard Cohen’s “Famous Blue Raincoat” opens with clear amphibrachic tetrameter; Dr. Seuss also leans on the same rocking twelve-beat line. Polish verse has a stronger amphibrachic tradition (Staff, Mickiewicz, and others), usually with feminine endings.",
  ],
  famousPoems: [
    {
      title: "Famous Blue Raincoat",
      author: "Leonard Cohen",
      note: "Opening lines scan cleanly as amphibrachic tetrameter; later lines loosen for speech and song.",
      excerpt: "It's four in the morning, the end of December",
    },
    {
      title: "The Old Oaken Bucket",
      author: "Samuel Woodworth",
      note: "Early nineteenth-century narrative lyric often cited for English amphibrachic tetrameter.",
      excerpt: "How dear to my heart are the scenes of my childhood",
    },
    {
      title: "If I Ran the Circus",
      author: "Dr. Seuss (Theodor Geisel)",
      note: "Children’s verse that often rides a twelve-syllable amphibrachic swing.",
      excerpt: "All ready to put up the tents for my circus",
    },
    {
      title: "Regeneration",
      author: "John Beaton",
      note: "Contemporary formal poem built on amphibrachic tetrameter with mixed masculine and feminine endings.",
      excerpt: "Hay ripens. I sharpen my tapering scythe blade",
    },
  ],
  formNotes: [
    "lyriic checks a twelve-syllable line with an amphibrachic (weak–strong–weak) stress contour. English poets commonly substitute feet, drop a final weak syllable (masculine ending), or loosen stress for speech — those will show as mismatches against the ideal grid.",
    "Limericks and some comic verse are often scanned as amphibrachic or anapestic; lyriic’s limerick meter is a separate form. This checker does not enforce rhyme schemes, stanza shapes, or song-line phrasing.",
  ],
  faqs: [
    {
      q: "What is amphibrachic tetrameter?",
      plain:
        "In English, a line of four amphibrachs: twelve syllables with a light–strong–light foot repeated four times (da-DUM-da × 4). Expected stresses fall on syllables 2, 5, 8, and 11.",
    },
    {
      q: "Does lyriic check stress as well as syllables?",
      plain:
        "Yes. For Amphibrachic tetrameter, lyriic targets twelve syllables and the amphibrachic weak–strong–weak contour when the stress pack is loaded. Open the zen editor with this meter for live rulers beside each line.",
    },
    {
      q: "Is my draft uploaded?",
      plain:
        "No. Syllable and stress checks run locally in your browser. lyriic is local-first and does not require an account.",
    },
  ],
  sampleLines: [
    "It's four in the morning, the end of December",
    "How dear to my heart are the scenes of my childhood",
    "All ready to put up the tents for my circus",
    "I'm writing you now just to see if you're better",
  ],
  cta: "Continue in the editor",
  footExplainerId: "amphibrach",
  stressExplainerId: "amphibrach-4",
  meterExplainer: {
    id: "amphibrachic-tetrameter",
    title: "How amphibrachic tetrameter works",
    body: [
      "English amphibrachic tetrameter is four amphibrachs per line: twelve syllables with expected stress on positions 2, 5, 8, and 11 (da-DUM-da da-DUM-da da-DUM-da da-DUM-da). lyriic’s catalog uses that single-line cycle with no fixed stanza length.",
      "The amphibrach (light–strong–light) gives a rocking, song-like swing. Poets often mix in anapests, truncate the final weak syllable, or bend stress for natural speech; those variants will diverge from this pure twelve-beat grid.",
      "Related forms include limericks (sometimes scanned amphibrachically) and anapestic tetrameter, which ends each foot on a stress instead of rocking through the middle. Those are separate meters in lyriic; here every line targets twelve amphibrachic syllables.",
    ],
    status: "ready",
  },
  verificationNotes: [
    "Catalog: pattern [12], stressPatterns [[0,1,0,0,1,0,0,1,0,0,1,0]], footId amphibrach, stanzaLines null (open). Matches English accentual-syllabic amphibrachic tetrameter (4 amphibrachs / 12 syllables; stresses on 2, 5, 8, 11). Intentionally omits rhyme, fixed stanza shapes, masculine/feminine ending variants as first-class targets, limerick aabba rules, and Polish amphibrachic conventions. sampleLines use open-meter default of 4; lines adapted from Cohen, Woodworth, and Seuss (each 12 syllables).",
  ],
};

import type { FormCheckerContent } from "../types";

export const dactylicTetrameterForm: FormCheckerContent = {
  meterId: "dactylic-tetrameter",
  status: "ready",
  title: "Dactylic Tetrameter Checker — lyriic",
  description:
    "Check a draft in dactylic tetrameter: twelve syllables per line, stressed–unstressed–unstressed. Live syllable and stress feedback — private in your browser, then keep writing in lyriic’s zen editor.",
  h1: "Dactylic tetrameter checker",
  intro:
    "Shape a draft against twelve-syllable dactylic lines (DUM-da-da × 4). Same syllable and stress engine as the lyriic poetry editor — private in your browser.",
  history: [
    "Dactylic tetrameter is four dactyls per line: a falling foot of stressed then two unstressed syllables (DUM-da-da), repeated four times for twelve syllables in the full English teaching form. The dactyl takes its name from the Greek daktylos (“finger”) — one longer joint and two shorter — and in classical quantitative verse it was a long–short–short foot rather than an English stress pattern.",
    "Sustained pure dactylic tetrameter is uncommon in English; poets often truncate a final weak beat, mix in trochees or spondees, or use the rhythm in song lyrics. Classroom examples frequently cite Browning’s catalectic lines and popular lyrics that open on a clean four-dactyl stretch before the meter loosens.",
  ],
  famousPoems: [
    {
      title: "Lucy in the Sky with Diamonds",
      author: "The Beatles (John Lennon / Paul McCartney)",
      note: "Opening line is a widely cited full twelve-syllable dactylic tetrameter; later lines admit substitutions and elongations.",
      excerpt: "Picture yourself in a boat on a river with",
    },
    {
      title: "The Lost Leader",
      author: "Robert Browning",
      note: "Often scanned as dactylic tetrameter with a catalectic close — eleven syllables ending on a stress, not the full twelve-beat grid.",
      excerpt: "Just for a handful of silver he left us!",
    },
    {
      title: "Famous Blue Raincoat",
      author: "Leonard Cohen",
      note: "Song lines lean on falling dactylic rhythm, frequently truncating before a pure fourth foot.",
      excerpt: "What can I tell you my brother my keeper",
    },
  ],
  formNotes: [
    "lyriic checks a twelve-syllable line with a dactylic (strong–weak–weak) stress contour. Catalectic lines that drop one or two final light syllables — common in Browning and song — count as on-meter when they keep the falling contour; harder disagreements still surface as stress feedback.",
    "Classical Alcmanian / quantitative dactylic tetrameter uses length, not English stress alone. lyriic does not enforce rhyme schemes or fixed stanza shapes.",
  ],
  faqs: [
    {
      q: "What is dactylic tetrameter?",
      plain:
        "In English, a line of four dactyls: twelve syllables with a falling DUM-da-da beat on positions 1, 4, 7, and 10. Poets often omit trailing weak syllables (catalexis), so many famous lines scan shorter than twelve.",
    },
    {
      q: "Does lyriic check stress as well as syllables?",
      plain:
        "Yes. For Dactylic tetrameter, lyriic targets twelve syllables and the dactylic strong–weak–weak contour when the stress pack is loaded. Open the zen editor with this meter for live rulers beside each line.",
    },
    {
      q: "Is my draft uploaded?",
      plain:
        "No. Syllable and stress checks run locally in your browser. lyriic is local-first and does not require an account.",
    },
  ],
  sampleLines: [
    "Picture yourself in a boat on a river with",
    "Carry the lantern along through the corridor",
    "Over the mountain the cavalry thundered on",
    "Open the window and listen to melodies",
  ],
  cta: "Continue in the editor",
  footExplainerId: "dactyl",
  stressExplainerId: "dactyl-4",
  meterExplainer: {
    id: "dactylic-tetrameter",
    title: "How dactylic tetrameter works",
    body: [
      "English dactylic tetrameter is four dactyls per line: twelve syllables with expected stress on positions 1, 4, 7, and 10 (DUM-da-da DUM-da-da DUM-da-da DUM-da-da). lyriic’s catalog uses that single-line cycle with no fixed stanza length.",
      "Catalexis — dropping one or more final unstressed syllables — is common in English practice and song, so many cited lines scan as eleven syllables (or fewer) ending on a strong beat. lyriic’s teaching ticks show the full twelve-syllable grid; catalectic lines that keep the falling contour count as on-meter.",
      "Do not confuse the English accentual-syllabic shape with classical quantitative dactylic tetrameter (Alcmanian verse and related Greek/Latin metres), which counts long and short syllables. Those traditions are outside this checker’s grid.",
    ],
    status: "ready",
  },
  verificationNotes: [
    "Catalog: pattern [12], stressPatterns [[1,0,0,1,0,0,1,0,0,1,0,0]], footId dactyl, stanzaLines null (open). Matches English accentual-syllabic full (acatalectic) dactylic tetrameter (4 dactyls / 12 syllables). Literary scansion accepts catalectic truncations (−1/−2 trailing weaks); intentionally omits rhyme, fixed stanza forms, and classical quantitative / Alcmanian tetrameter. sampleLines use open-meter default of 4; first line from Beatles (full 12-syllable example), others original teaching lines aimed at the 12-slot grid.",
  ],
};

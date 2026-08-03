import type { FormCheckerContent } from "../types";

export const trochaicTetrameterForm: FormCheckerContent = {
  meterId: "trochaic-tetrameter",
  status: "ready",
  title: "Trochaic Tetrameter Checker — lyriic",
  description:
    "Check a draft in trochaic tetrameter: eight syllables per line, stressed–unstressed. Live syllable and stress feedback — private in your browser, then keep writing in lyriic’s zen editor.",
  h1: "Trochaic tetrameter checker",
  intro:
    "Shape a draft against eight-syllable trochaic lines (DUM-da × 4). Same syllable and stress engine as the lyriic poetry editor — private in your browser.",
  history: [
    "Trochaic tetrameter is four trochees per line: a falling foot of stressed then unstressed (DUM-da), repeated four times for eight syllables in the full English teaching form. The name comes from Greek trokhaios (“running”); classical “tetrameter” counted metra differently, so Greek and Latin trochaic tetrameter is a longer quantitative line than the English eight-syllable shape.",
    "In English verse the meter often feels chant-like or song-like. Longfellow’s Song of Hiawatha is the best-known sustained English example in full (acatalectic) trochaic tetrameter. Shakespeare’s fairy and witch speeches, and many lyrics such as Blake’s “The Tyger,” commonly drop the final unstressed beat (catalectic tetrameter), ending on a strong syllable. Related traditions include medieval Latin sequences such as the Dies Irae and the Balto-Finnic Kalevala meter, which uses its own long/short syllable rules rather than English stress alone.",
  ],
  famousPoems: [
    {
      title: "The Song of Hiawatha",
      author: "Henry Wadsworth Longfellow",
      note: "Sustained English epic in full trochaic tetrameter; often the classroom exemplar of the complete eight-syllable line.",
      excerpt: "By the shores of Gitche Gumee, / By the shining Big-Sea-Water,",
    },
    {
      title: "The Tyger",
      author: "William Blake",
      note: "Largely catalectic trochaic tetrameter — seven syllables ending on a stress, not the full eight-beat grid.",
      excerpt: "Tyger Tyger, burning bright, / In the forests of the night;",
    },
    {
      title: "A Midsummer Night's Dream (fairy / Puck speeches)",
      author: "William Shakespeare",
      note: "Fairy dialogue often in catalectic trochaic tetrameter, distinct from the play’s blank-verse stretches. Athenian may need a three-syllable poetic reading to land cleanly on the teaching grid.",
      excerpt: "Through the forest have I gone. / But Athenian found I none,",
    },
    {
      title: "Macbeth (the Weird Sisters)",
      author: "William Shakespeare",
      note: "Witch chants lean on falling trochaic rhythms, frequently catalectic. The rain-line is mixed in speech and may not match a pure trochaic grid.",
      excerpt: "When shall we three meet again / In thunder, lightning, or in rain?",
    },
  ],
  formNotes: [
    "lyriic checks an eight-syllable line with a trochaic (strong–weak) stress contour. Catalectic lines that drop the final unstressed syllable — common in Blake and Shakespeare — count as on-meter when they keep the falling contour; first-foot inversion is also accepted. Harder disagreements still surface as stress feedback.",
    "Classical quantitative trochaic tetrameter and Kalevala meter use different counting rules. lyriic does not enforce rhyme schemes, alliteration, or fixed stanza shapes.",
  ],
  faqs: [
    {
      q: "What is trochaic tetrameter?",
      plain:
        "In English, a line of four trochees: eight syllables alternating stressed and unstressed (DUM-da × 4). Poets often omit the last weak syllable (catalexis), leaving a seven-syllable line that ends on a stress.",
    },
    {
      q: "Does lyriic check stress as well as syllables?",
      plain:
        "Yes. For Trochaic tetrameter, lyriic targets eight syllables and the trochaic strong–weak contour when the stress pack is loaded. Open the zen editor with this meter for live rulers beside each line.",
    },
    {
      q: "Is my draft uploaded?",
      plain:
        "No. Syllable and stress checks run locally in your browser. lyriic is local-first and does not require an account.",
    },
  ],
  sampleLines: [
    "By the shores of Gitche Gumee",
    "Dark behind it rose the forest",
    "Bright before it beat the water",
    "Stood the wigwam of Nokomis",
  ],
  cta: "Continue in the editor",
  footExplainerId: "trochee",
  stressExplainerId: "trochee-4",
  meterExplainer: {
    id: "trochaic-tetrameter",
    title: "How trochaic tetrameter works",
    body: [
      "English trochaic tetrameter is four trochees per line: eight syllables with expected stress on positions 1, 3, 5, and 7 (DUM-da DUM-da DUM-da DUM-da). lyriic’s catalog uses that single-line cycle with no fixed stanza length.",
      "Catalexis — dropping the final unstressed syllable — is common in English practice, so many famous lines scan as seven syllables ending on a strong beat. lyriic’s teaching ticks show the full eight-syllable grid; catalectic lines that keep the falling contour count as on-meter.",
      "Do not confuse the English accentual-syllabic shape with classical quantitative trochaic tetrameter (longer metra) or with Kalevala meter, which follows Finnic length and alliteration rules. Those traditions are outside this checker’s grid.",
    ],
    status: "ready",
  },
  verificationNotes: [
    "Catalog: pattern [8], stressPatterns [[1,0,1,0,1,0,1,0]], footId trochee, stanzaLines null (open). Matches English accentual-syllabic full (acatalectic) trochaic tetrameter (4 trochees / 8 syllables). Literary scansion accepts catalexis (−1 ending strong) and first-foot inversion; intentionally omits rhyme, Kalevala length/alliteration rules, classical quantitative tetrameter, mid-line substitutions, and ±1 syllable without a named literary contour. sampleLines use open-meter default of 4; Hiawatha names (Gitche, Gumee, Nokomis) seeded in the teaching lexicon.",
  ],
};

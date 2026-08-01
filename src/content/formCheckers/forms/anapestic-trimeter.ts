import type { FormCheckerContent } from "../types";

export const anapesticTrimeterForm: FormCheckerContent = {
  meterId: "anapestic-trimeter",
  status: "ready",
  title: "Anapestic Trimeter Checker — lyriic",
  description:
    "Check a draft in anapestic trimeter: nine syllables per line, two light then strong. Live syllable and stress feedback — private in your browser, then keep writing in lyriic’s zen editor.",
  h1: "Anapestic trimeter checker",
  intro:
    "Shape a draft against nine-syllable anapestic lines (da-da-DUM × 3). Same syllable and stress engine as the lyriic poetry editor — private in your browser.",
  history: [
    "An anapest is two unstressed syllables followed by a stressed one (da-da-DUM). In classical Greek, anapestic metres were used in marching songs and in dramatic choral entrances and exits; the name comes from Greek anapaistos, “struck back,” because the foot reverses a dactyl.",
    "In English accentual-syllabic verse, anapestic trimeter means three anapests per line — nine syllables with stress on beats 3, 6, and 9. Pure anapests are rarer in English than iambs; the jog-trot rhythm long suited light and comic verse, and after the eighteenth century it also appeared in more serious lyrics. Classroom and workshop teaching often meets the line as the longer half of a limerick (lines 1, 2, and 5).",
  ],
  famousPoems: [
    {
      title: "Verses Supposed to Be Written by Alexander Selkirk",
      author: "William Cowper",
      note: "Often cited as a sustained English anapestic-trimeter lyric; many lines open with an iamb instead of a full anapest.",
      excerpt: "I am monarch of all I survey; / I must finish my journey alone,",
    },
    {
      title: "There was an Old Man with a Beard",
      author: "Edward Lear",
      note: "Limerick long lines (1, 2, and 5) are commonly taught as anapestic trimeter; Lear’s own scansion is often looser.",
      excerpt: "There was an Old Man with a beard, / Who said, “It is just as I feared!”",
    },
    {
      title: "There was a Young Lady of Norway",
      author: "Edward Lear",
      note: "Another Book of Nonsense limerick; trimeter frames the A-rhyme lines around shorter dimeter middles.",
      excerpt: "There was a Young Lady of Norway, / Who casually sat in a doorway;",
    },
  ],
  formNotes: [
    "lyriic checks a nine-syllable line with an anapestic (weak–weak–strong) stress contour. English poets often open with an iamb, drop an opening weak syllable, or loosen stress for speech — those will show as mismatches against the ideal grid.",
    "Limericks mix this trimeter with shorter anapestic lines and an AABBA rhyme scheme. lyriic’s Limerick meter models that five-line cycle separately; this checker targets pure trimeter only. Rhyme is not enforced.",
  ],
  faqs: [
    {
      q: "What is anapestic trimeter?",
      plain:
        "In English, a line of three anapests: nine syllables with two unstressed beats then a stressed one, repeated three times (da-da-DUM × 3). It is shorter than anapestic tetrameter and often appears as the long lines in a limerick.",
    },
    {
      q: "Does lyriic check stress as well as syllables?",
      plain:
        "Yes. For Anapestic trimeter, lyriic targets nine syllables and the anapestic weak–weak–strong contour when the stress pack is loaded. Open the zen editor with this meter for live rulers beside each line.",
    },
    {
      q: "Is my draft uploaded?",
      plain:
        "No. Syllable and stress checks run locally in your browser. lyriic is local-first and does not require an account.",
    },
  ],
  sampleLines: [
    "And the sound of the rain on the roof",
    "In the dark of the night we will go",
    "With a leap and a bound through the field",
    "As the light of the morning returns",
  ],
  cta: "Write in the zen editor",
  footExplainerId: "anapest",
  stressExplainerId: "anapest-3",
  meterExplainer: {
    id: "anapestic-trimeter",
    title: "How anapestic trimeter works",
    body: [
      "English anapestic trimeter is three anapests per line: nine syllables with expected stress on positions 3, 6, and 9 (da-da-DUM da-da-DUM da-da-DUM). lyriic’s catalog uses that single-line cycle with no fixed stanza length.",
      "Anapests create a rolling, forward drive that English writers have used for comic limericks, light verse, and occasional serious lyrics. Substitutions — especially an opening iamb — are common in practice and will not match lyriic’s ideal grid.",
      "Limericks pair these longer trimeter lines with shorter anapestic dimeter lines. That five-line alternating cycle is a separate meter in lyriic; here every line targets nine anapestic syllables.",
    ],
    status: "ready",
  },
  verificationNotes: [
    "Catalog: pattern [9], stressPatterns [[0,0,1,0,0,1,0,0,1]], footId anapest, stanzaLines null (open). Matches English accentual-syllabic trimeter (3 anapests / 9 syllables). Intentionally omits rhyme, limerick stanza shape, iambic openings / headless lines, and classical quantitative anapestic systems. sampleLines use open-meter default of 4.",
  ],
};

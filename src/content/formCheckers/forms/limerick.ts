import type { FormCheckerContent } from "../types";

export const limerickForm: FormCheckerContent = {
  meterId: "limerick",
  status: "ready",
  title: "Limerick Checker (8-8-5-5-8) — lyriic",
  description:
    "Check a five-line limerick against 8 · 8 · 5 · 5 · 8 with live syllable deltas. Free, private, and dictionary-based — then keep writing with lyriic’s Limerick meter ruler.",
  h1: "Limerick checker",
  intro:
    "Shape a five-line draft against 8 · 8 · 5 · 5 · 8. Same syllable engine as the lyriic poetry editor — private in your browser.",
  history: [
    "The limerick is a five-line comic form that appeared in English in the early eighteenth century. It is usually linked, by name, to County Limerick in Ireland and to parlour songs that invited listeners to “come to Limerick,” though the exact etymology is still debated.",
    "Edward Lear’s A Book of Nonsense (1846) made the shape famous as clean nonsense verse, often ending the fifth line on the same place-name that closed the first. Folk and club limericks kept a separate, often bawdy tradition with a punch-line twist.",
    "In English teaching, the form is described as AABBA rhyme with a bouncing anapestic (or amphibrachic) beat: longer lines with three stresses, shorter middle lines with two. Syllable counts vary in practice; lyriic’s checker uses a fixed 8 · 8 · 5 · 5 · 8 teaching shape.",
  ],
  famousPoems: [
    {
      title: "There was an Old Man with a beard",
      author: "Edward Lear",
      note: "From A Book of Nonsense (1846); a standard classroom example of Lear’s place-and-person nonsense limerick.",
      excerpt:
        "There was an Old Man with a beard, / Who said, \"It is just as I feared!\" / Two Owls and a Hen, / Four Larks and a Wren, / Have all built their nests in my beard!",
    },
    {
      title: "There was a Young Person of Smyrna",
      author: "Edward Lear",
      note: "Shows Lear’s habit of closing on the same place-word that ends line one.",
      excerpt:
        "There was a Young Person of Smyrna / Whose grandmother threatened to burn her. / But she seized on the cat, / and said 'Granny, burn that! / You incongruous old woman of Smyrna!'",
    },
    {
      title: "The limerick packs laughs anatomical",
      author: "Anonymous",
      note: "A widely quoted meta-limerick on why clean examples are hard to find.",
      excerpt:
        "The limerick packs laughs anatomical / Into space that is quite economical. / But the good ones I've seen / So seldom are clean / And the clean ones so seldom are comical.",
    },
    {
      title: "A dozen, a gross, and a score",
      author: "Leigh Mercer",
      note: "A mathematical limerick that reads an equation aloud in AABBA form.",
      excerpt:
        "A dozen, a gross, and a score / Plus three times the square root of four / Divided by seven / Plus five times eleven / Is nine squared and not a bit more.",
    },
  ],
  formNotes: [
    "Counts use English syllables from the bundled dictionary against an 8 · 8 · 5 · 5 · 8 shape — a useful teaching approximation of the long–long–short–short–long limerick contour. Real limericks often flex by a syllable or two when the anapest or amphibrach swing is clear.",
    "This checker scores the syllable shape only — not anapestic stress or comic content. For AABBA rhyme dots while you draft, open the zen editor with the Limerick meter.",
  ],
  faqs: [
    {
      q: "How many lines does a limerick have?",
      plain:
        "Five. A limerick is a five-line comic form, usually with an AABBA rhyme scheme and a bouncing long–long–short–short–long contour.",
    },
    {
      q: "What syllable pattern does this limerick checker use?",
      plain:
        "Five lines targeting eight, eight, five, five, and eight syllables. That matches lyriic’s Limerick catalog entry — a fixed teaching shape for the usual long–short–long contour, not a claim that every published limerick hits those exact counts.",
    },
    {
      q: "Does lyriic check limerick rhyme or anapests?",
      plain:
        "This page scores syllable targets only. Open the zen editor with the Limerick meter for AABBA rhyme dots beside each line; anapestic or amphibrachic stress is still left to your ear.",
    },
    {
      q: "Is my limerick uploaded?",
      plain:
        "No. Syllable checks run locally in your browser. lyriic is local-first and does not require an account.",
    },
  ],
  sampleLines: [
    "There was an old man from the coast",
    "Who lived on a diet of toast",
    "He buttered each slice",
    "With honey and spice",
    "And fed half the loaf to a ghost",
  ],
  cta: "Continue in the editor",
  meterExplainer: {
    id: "limerick",
    title: "How the limerick meter works",
    body: [
      "lyriic’s catalog treats a limerick as five lines with syllable targets 8 · 8 · 5 · 5 · 8. That mirrors the usual teaching contour: three longer lines framing two shorter ones in the middle.",
      "Tradition also expects AABBA rhyme and a rising anapestic (or rocking amphibrachic) beat — three stresses on the long lines, two on the short. This checker scores the syllable shape; AABBA rhyme dots are available in the zen editor.",
      "Published limericks often bend exact syllable counts when the bounce is clear. Use the deltas as a drafting aid, not as proof that a comic or Lear-style stanza is “wrong.”",
    ],
    status: "ready",
  },
  verificationNotes: [
    "Catalog: pattern [8, 8, 5, 5, 8], stanzaLines 5, syllable-only (no foot/stress), rhymeSchemes limerick AABBA. Form checker is syllable-only; rhyme overlays live in the zen editor. Intentionally omits anapest/amphibrach enforcement and comic/nonsense theme rules. Real Lear and folk limericks often vary ±1–2 syllables per line.",
  ],
};

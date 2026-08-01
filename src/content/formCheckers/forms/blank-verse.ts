import type { FormCheckerContent } from "../types";

export const blankVerseForm: FormCheckerContent = {
  meterId: "blank-verse",
  status: "ready",
  title: "Blank Verse Checker — lyriic",
  description:
    "Check unrhymed iambic pentameter: ten syllables per line, weak–strong beat. Live syllable and stress feedback — private in your browser, then keep writing in lyriic’s zen editor.",
  h1: "Blank verse checker",
  intro:
    "Shape a draft in unrhymed iambic pentameter (da-DUM × 5). Same syllable and stress engine as the lyriic poetry editor — private in your browser.",
  history: [
    "Blank verse is unrhymed metered poetry, almost always iambic pentameter in English. Henry Howard, Earl of Surrey, brought the form into English in the 1550s with his translation of Virgil’s Aeneid, adapting Italian versi sciolti to English speech rhythm.",
    "Christopher Marlowe and William Shakespeare made it the default for Elizabethan and Jacobean drama. John Milton then established it for non-dramatic epic in Paradise Lost (1667), calling it “English heroic verse without rhyme” and using enjambment for long, complex verse paragraphs.",
    "Later poets — Wordsworth, Tennyson, Frost, Stevens, and others — kept the ten-syllable rising line while loosening stress and syntax. Blank verse is not free verse: it keeps a regular meter while leaving rhyme aside.",
  ],
  famousPoems: [
    {
      title: "Paradise Lost",
      author: "John Milton",
      note: "The landmark non-dramatic blank-verse epic; Milton defends unrhymed pentameter in a prefatory note.",
      excerpt:
        "Of Man’s first disobedience, and the fruit / Of that forbidden tree…",
    },
    {
      title: "Hamlet (soliloquies)",
      author: "William Shakespeare",
      note: "Much of Shakespeare’s dialogue is blank verse; feminine endings (an extra weak syllable) are common.",
      excerpt: "To be, or not to be, that is the question…",
    },
    {
      title: "Ulysses",
      author: "Alfred, Lord Tennyson",
      note: "Victorian dramatic monologue in sustained blank verse.",
      excerpt: "To strive, to seek, to find, and not to yield.",
    },
    {
      title: "Mending Wall",
      author: "Robert Frost",
      note: "Modern conversational blank verse; stress bends toward speech.",
      excerpt: "Something there is that doesn’t love a wall…",
    },
  ],
  formNotes: [
    "lyriic checks a ten-syllable line with an iambic (weak–strong) stress contour. Blank verse traditionally does not rhyme; lyriic does not enforce rhyme or anti-rhyme. Substitutions, feminine endings, and speech stress are common and will show as mismatches against the ideal grid.",
    "stanzaLines is open: write as many lines as you like. This is not free verse — free verse drops regular meter. Sonnets and heroic couplets share the same pentameter contour but add fixed length or rhyme expectations lyriic does not model here.",
  ],
  faqs: [
    {
      q: "What is blank verse?",
      plain:
        "Unrhymed poetry in a regular meter — in English, usually iambic pentameter: ten syllables alternating unstressed and stressed (da-DUM × 5). It is the backbone of much Shakespearean drama and Miltonic epic.",
    },
    {
      q: "Does lyriic check stress as well as syllables?",
      plain:
        "Yes. For Blank verse, lyriic targets ten syllables and the iambic weak–strong contour when the stress pack is loaded. Open the zen editor with this meter for live rulers beside each line.",
    },
    {
      q: "Is my draft uploaded?",
      plain:
        "No. Syllable and stress checks run locally in your browser. lyriic is local-first and does not require an account.",
    },
  ],
  sampleLines: [
    "The night was cold and clear along the shore",
    "I walked alone beneath the quiet sky",
    "She spoke of hope before the day was done",
    "We heard the distant thunder in the hills",
  ],
  cta: "Write in the zen editor",
  footExplainerId: "iamb",
  stressExplainerId: "iamb-5",
  meterExplainer: {
    id: "blank-verse",
    title: "How blank verse works",
    body: [
      "Blank verse is unrhymed iambic pentameter: five iambs per line, ten syllables with expected stress on positions 2, 4, 6, 8, and 10. lyriic’s catalog uses that single-line cycle with no fixed stanza length.",
      "“Blank” means without end-rhyme, not without meter. Free verse drops the regular beat; blank verse keeps it. Shakespeare’s plays and Milton’s Paradise Lost are the classic English models; later poets often loosen stress while keeping the ten-slot line.",
      "Feminine endings (an eleventh unstressed syllable), inverted first feet, and mid-line substitutions are common in the tradition. Against lyriic’s ideal grid those will read as mismatches — useful feedback, not a claim that every historical line is perfectly regular.",
    ],
    status: "ready",
  },
  verificationNotes: [
    "Catalog: pattern [10], stressPatterns [[0,1,0,1,0,1,0,1,0,1]], footId iamb, stanzaLines null (open). Matches English teaching blank verse (unrhymed iambic pentameter). Intentionally omits rhyme/anti-rhyme enforcement, feminine endings, caesura rules, and verse-paragraph conventions. sampleLines use open-meter default of 4.",
  ],
};

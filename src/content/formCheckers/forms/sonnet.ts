import type { FormCheckerContent } from "../types";

export const sonnetForm: FormCheckerContent = {
  meterId: "sonnet",
  status: "ready",
  title: "Sonnet Checker (Iambic Pentameter) — lyriic",
  description:
    "Check a 14-line sonnet against iambic pentameter: ten syllables per line, unstressed–stressed. Live syllable and stress feedback — private in your browser, then keep writing in lyriic’s zen editor.",
  h1: "Sonnet checker",
  intro:
    "Shape a fourteen-line draft against iambic pentameter (da-DUM × 5). Same syllable and stress engine as the lyriic poetry editor — private in your browser.",
  history: [
    "The sonnet (Italian sonetto, “little song”) took shape in thirteenth-century Sicily and was popularized by Petrarch in the fourteenth century. Early Italian practice settled on fourteen lines with a turn of thought (volta) and a fixed rhyme pattern — typically an octave and sestet in the Petrarchan form.",
    "Thomas Wyatt and the Earl of Surrey brought the form into English in the sixteenth century. Surrey’s three-quatrain-plus-couplet shape, later associated with Shakespeare, became the dominant English teaching model: fourteen lines of iambic pentameter with a closing couplet.",
    "English classrooms usually treat the sonnet as fourteen lines of iambic pentameter plus a named rhyme scheme (Shakespearean ABAB CDCD EFEF GG, Petrarchan ABBAABBA + sestet, or Spenserian interlocking). Modern poets often keep the line count and meter while loosening or dropping rhyme.",
  ],
  famousPoems: [
    {
      title: "Sonnet 18 (“Shall I compare thee to a summer’s day?”)",
      author: "William Shakespeare",
      note: "Classic English (Shakespearean) sonnet: three quatrains and a couplet in iambic pentameter.",
      excerpt:
        "Shall I compare thee to a summer’s day? / Thou art more lovely and more temperate:",
    },
    {
      title: "Sonnet 130 (“My mistress’ eyes are nothing like the sun”)",
      author: "William Shakespeare",
      note: "Anti-blazon that still follows the English rhyme and meter template.",
      excerpt:
        "My mistress’ eyes are nothing like the sun; / Coral is far more red than her lips’ red;",
    },
    {
      title: "Sonnet 43 (“How do I love thee? Let me count the ways.”)",
      author: "Elizabeth Barrett Browning",
      note: "Petrarchan structure in English; often taught for the octave–sestet turn.",
      excerpt: "How do I love thee? Let me count the ways.",
    },
    {
      title: "When I Consider How My Light Is Spent",
      author: "John Milton",
      note: "Miltonic / Petrarchan English sonnet; volta arrives later than the Italian mid-point.",
      excerpt: "When I consider how my light is spent / Ere half my days in this dark world and wide,",
    },
  ],
  formNotes: [
    "lyriic checks fourteen lines of iambic pentameter: ten syllables with a weak–strong stress contour. Substitutions, feminine endings, and speech stress will show as mismatches against the ideal grid.",
    "This checker scores line count, syllable target, and iambic stress only. For Shakespearean, Petrarchan, or Spenserian rhyme dots while you draft, open the zen editor with the Sonnet meter.",
  ],
  faqs: [
    {
      q: "What does this sonnet checker require?",
      plain:
        "Fourteen lines of iambic pentameter: about ten syllables each with an unstressed–stressed contour (da-DUM × 5). That matches English teaching practice for Shakespearean and many Petrarchan sonnets in English.",
    },
    {
      q: "Does lyriic check the rhyme scheme?",
      plain:
        "Not on this page — the checker stays on syllables and stress. Open the zen editor with the Sonnet meter to pick Shakespearean, Petrarchan, or Spenserian and see colored rhyme dots beside each line.",
    },
    {
      q: "Is my draft uploaded?",
      plain:
        "No. Syllable and stress checks run locally in your browser. lyriic is local-first and does not require an account.",
    },
  ],
  sampleLines: [
    "I walk alone beside the quiet shore",
    "And hear the distant bells begin to ring.",
    "The evening air is cool against my face;",
    "The tide returns to claim the stones again.",
    "I think of days that will not come around,",
    "Of promises that fade before they bloom,",
    "Of letters left unanswered on the desk,",
    "Of doors that close before the night is done.",
    "And still the moon climbs slow above the hill,",
    "And still the harbor lights reflect the bay.",
    "If words can hold what memory lets go,",
    "Then let these lines keep watch until the dawn,",
    "When light returns and names the world anew,",
    "And what was lost is somehow found in you.",
  ],
  cta: "Continue in the editor",
  footExplainerId: "iamb",
  stressExplainerId: "iamb-5",
  meterExplainer: {
    id: "sonnet",
    title: "How the sonnet meter works",
    body: [
      "In lyriic’s catalog, a sonnet is fourteen lines of iambic pentameter: ten syllables per line with expected stress on positions 2, 4, 6, 8, and 10 (da-DUM × 5).",
      "That matches the English teaching backbone shared by Shakespearean, Petrarchan, and Spenserian sonnets. Those traditions differ mainly in rhyme scheme and where the volta falls — not in the default meter.",
      "This checker scores line count, syllable target, and the iambic stress contour when the stress pack is loaded. Named rhyme schemes (Shakespearean, Petrarchan, Spenserian) are available as colored dots in the zen editor.",
    ],
    status: "ready",
  },
  verificationNotes: [
    "Catalog: pattern [10], stressPatterns [[0,1,0,1,0,1,0,1,0,1]], footId iamb, stanzaLines 14, rhymeSchemes shakespearean/petrarchan/spenserian. Form checker is syllable/stress only; rhyme overlays live in the zen editor. Intentionally omits volta placement and thematic structure. sampleLines: 14 original lines at 10 syllables (dict primary).",
  ],
};

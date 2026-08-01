import type { FormCheckerContent } from "../types";

export const heroicCoupletForm: FormCheckerContent = {
  meterId: "heroic-couplet",
  status: "ready",
  title: "Heroic Couplet Checker — lyriic",
  description:
    "Check a heroic couplet: two lines of iambic pentameter (10 syllables each). Live syllable and stress feedback — private in your browser, then keep writing in lyriic’s zen editor.",
  h1: "Heroic couplet checker",
  intro:
    "Shape a two-line draft in iambic pentameter (da-DUM × 5). Same syllable and stress engine as the lyriic poetry editor — private in your browser.",
  history: [
    "A heroic couplet is a pair of rhyming lines in iambic pentameter — ten syllables with stress on every even beat. Geoffrey Chaucer made extensive use of the form in the fourteenth century (notably in The Canterbury Tales), adapting French and Italian models into English “riding rhyme.”",
    "The couplet became a mainstay of English verse in the Restoration and Augustan periods. John Dryden established its neoclassical polish for satire and translation; Alexander Pope perfected its balance, antithesis, and closed rhetorical unit in poems such as An Essay on Criticism and The Rape of the Lock.",
    "Closed couplets often complete a thought within the pair; open or enjambed couplets run sense across the line break. Either way, the teaching baseline remains two rhymed pentameter lines.",
  ],
  famousPoems: [
    {
      title: "The Canterbury Tales",
      author: "Geoffrey Chaucer",
      note: "Early English mastery of rhymed iambic pentameter couplets (often called riding rhyme).",
      excerpt: "Whan that Aprille with his shoures soote / The droghte of March hath perced to the roote,",
    },
    {
      title: "Absalom and Achitophel",
      author: "John Dryden",
      note: "Restoration satire that helped set the neoclassical heroic-couplet standard.",
      excerpt: "In pious times, ere priestcraft did begin, / Before polygamy was made a sin;",
    },
    {
      title: "An Essay on Criticism",
      author: "Alexander Pope",
      note: "Often cited for closed, balanced couplets and epigrammatic wit.",
      excerpt: "A little learning is a dangerous thing; / Drink deep, or taste not the Pierian spring:",
    },
    {
      title: "The Rape of the Lock",
      author: "Alexander Pope",
      note: "Mock-heroic narrative built largely in polished heroic couplets.",
      excerpt: "What dire offence from am'rous causes springs, / What mighty contests rise from trivial things,",
    },
  ],
  formNotes: [
    "lyriic checks two lines at ten syllables each with an iambic (weak–strong) stress contour. Substitutions, feminine endings, and speech stress are common and will show as mismatches against the ideal grid.",
    "Tradition expects the two lines to rhyme (aa). lyriic does not enforce rhyme pairing, caesura placement, or closed vs. open couplet rhetoric.",
  ],
  faqs: [
    {
      q: "What is a heroic couplet?",
      plain:
        "A pair of rhyming lines in iambic pentameter: each line has ten syllables with a da-DUM × 5 feel. Chaucer popularized the form in English; Dryden and Pope made it the signature meter of Restoration and Augustan verse.",
    },
    {
      q: "Does lyriic check rhyme as well as meter?",
      plain:
        "No. This checker targets two ten-syllable iambic lines and the weak–strong stress contour when the stress pack is loaded. End rhyme is traditional for heroic couplets but is not enforced.",
    },
    {
      q: "Is my draft uploaded?",
      plain:
        "No. Syllable and stress checks run locally in your browser. lyriic is local-first and does not require an account.",
    },
  ],
  sampleLines: [
    "A little learning is a dangerous thing",
    "Drink deep, or taste not the Pierian spring",
  ],
  cta: "Write in the zen editor",
  footExplainerId: "iamb",
  stressExplainerId: "iamb-5",
  meterExplainer: {
    id: "heroic-couplet",
    title: "How the heroic couplet works",
    body: [
      "A heroic couplet is two successive lines of iambic pentameter that traditionally rhyme. Each line targets ten syllables with expected stress on positions 2, 4, 6, 8, and 10 (da-DUM × 5). lyriic’s catalog models that as pattern [10] with stanzaLines 2.",
      "The same pentameter grid underlies blank verse (unrhymed) and many English sonnets. What makes the couplet “heroic” in teaching terms is the paired length plus end rhyme — not a different foot or syllable count.",
      "Closed couplets often finish a thought within the pair; open couplets spill sense across the break. lyriic checks syllable and stress only; rhyme pairing and rhetorical closure are left to the writer.",
    ],
    status: "ready",
  },
  verificationNotes: [
    "Catalog: pattern [10], stressPatterns [[0,1,0,1,0,1,0,1,0,1]], footId iamb, stanzaLines 2. Matches English heroic couplet meter (paired iambic pentameter). Intentionally omits aa rhyme enforcement, caesura rules, and closed/open couplet rhetoric. sampleLines length 2.",
  ],
};

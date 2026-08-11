import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const iCannotLiveWithYouPoem: PoemAnalysisContent = {
  slug: "i-cannot-live-with-you", status: "ready", poemTitle: "I cannot live with You", author: "Emily Dickinson", yearPublished: 1890,
  publicDomainBasis: "First published posthumously in Poems in 1890, before the US public-domain cutoff.",
  title: "I cannot live with You Analysis & Meaning — Emily Dickinson — lyriic",
  description: "Dickinson analysis of impossible love, religious imagery, paradox, form, and separation.",
  h1: "I cannot live with You analysis", intro: "This analysis follows Dickinson’s rigorous argument through life, death, heaven, hell, and impossible union.",
  fullTextSource: { label: "I cannot live with You — textual versions", url: "https://en.wikisource.org/wiki/I_cannot_live_with_You_%E2%80%94", publisher: "Wikisource" },
  editorSettings: poemOpenSettings({ showCounts: true }),
  summary: [
    p("The speaker rejects union in life, death, resurrection, salvation, and damnation; every realm creates a different separation.", ["dickinson-cannot-critical"]),
    excerpt(`I cannot live with You — It would be Life —
And Life is over there — Behind the Shelf

The Sexton keeps the Key to —`),
    p("The final solution is paradoxical: the lovers must “meet apart,” connected by a door, prayer, and despair.", ["dickinson-cannot-critical"]),
  ],
  meaning: [
    p("The refusals do not diminish love. They show a love so powerful that domestic, mortal, and religious frameworks cannot contain it.", ["dickinson-cannot-atlantic"]),
    excerpt(`So We must meet apart —
You there — I — here —
With just the Door ajar`),
    p("“Meet apart” gives distance a form of connection, while despair becomes the only remaining sustenance.", ["dickinson-cannot-poets"]),
  ],
  themes: [
    { theme: "Impossible love", blocks: [p("The speaker tests every form of union and finds each impossible.")] },
    { theme: "Love and religion", blocks: [p("Jesus, heaven, judgment, paradise, and hell frame a conflict between erotic devotion and salvation.")] },
    { theme: "Sight and perception", blocks: [p("The beloved’s face saturates sight so completely that paradise becomes hard to see.")] },
    { theme: "Paradox and separation", blocks: [p("“Meet apart,” an oceanic door, and sustaining despair make contradiction the poem’s final language.")] },
  ],
  formAndMeter: [
    p("The poem has eleven quatrains followed by a six-line stanza that acts like a sonnet’s concluding couplet.", ["dickinson-cannot-poets"]),
    p("Irregular lines, dashes, capitalizations, and tightening end-rhyme create an argumentative music rather than a fixed meter.", ["dickinson-cannot-atlantic"]),
  ],
  literaryDevices: [
    { device: "Extended metaphor", blocks: [excerpt(`Our Life — His Porcelain — Like a Cup —
Discarded of the Housewife — Quaint — or Broke —`), p("Porcelain makes emotional exclusion tangible and fragile.")] },
    { device: "Paradox", blocks: [excerpt(`So We must meet apart —`), p("The phrase makes separation the only surviving form of intimacy.")] },
    { device: "Religious allusion", blocks: [excerpt(`Because Your Face Would put out Jesus’ —`), p("Christian imagery turns romantic longing into a challenge to orthodox hierarchy.")] },
  ],
  historicalContext: [
    p("Dickinson composed the poem around 1862–1863; it was published after her death in the 1890 collection Poems under the title “In Vain.”", ["dickinson-cannot-atlantic"]),
    p("The Academy of American Poets notes that the poem is close in form to a Shakespearean sonnet argument, though it is not a conventional sonnet.", ["dickinson-cannot-poets"]),
  ],
  citations: [
    { id: "dickinson-cannot-text", source: "Wikisource", url: "https://en.wikisource.org/wiki/I_cannot_live_with_You_%E2%80%94" },
    { id: "dickinson-cannot-poets", source: "Academy of American Poets", quote: "the lovers are apart but meeting; the door is ajar, like an ocean; and the speaker is somehow sustained by despair", url: "https://poets.org/text/close-reading-i-cannot-live-you" },
    { id: "dickinson-cannot-atlantic", source: "The Atlantic", quote: "A three-part argument against erotic union", url: "https://www.theatlantic.com/magazine/archive/1999/04/emily-dickinson-i-cannot-live-with-you-poem-640/308055/" },
    { id: "dickinson-cannot-critical", source: "Poetry Lovers Page", quote: "The final three stanzas deliver the poem’s resolution, or rather its refusal of resolution.", url: "https://www.poetryloverspage.com/poets/dickinson/i_cannot_live_with_you/literary-analysis" },
  ],
  criticalViews: [{ citeId: "dickinson-cannot-poets" }, { citeId: "dickinson-cannot-atlantic" }],
  faqs: [
    { q: "What is the poem’s meaning?", plain: "The speaker argues that no shared existence is possible, and the intensity of the argument reveals overwhelming love." },
    { q: "What does “meet apart” mean?", plain: "It means emotional connection survives through physical separation, prayer, and despair." },
    { q: "What form does it use?", plain: "Uneven quatrains and a final six-line stanza use irregular meter, dashes, syntax, and echoing rhyme." },
  ],
  cta: "Write with this poem’s rhythm in the editor",
};

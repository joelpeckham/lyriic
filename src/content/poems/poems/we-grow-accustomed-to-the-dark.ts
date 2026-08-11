import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const weGrowAccustomedToTheDarkPoem: PoemAnalysisContent = {
  slug: "we-grow-accustomed-to-the-dark",
  status: "ready",
  poemTitle: "We Grow Accustomed to the Dark",
  author: "Emily Dickinson",
  yearPublished: 1890,
  publicDomainBasis:
    "First published posthumously in the United States in 1890; the poem and its 1890 publication are public domain in the United States.",
  title:
    "We Grow Accustomed to the Dark Analysis & Meaning — Emily Dickinson — lyriic",
  description:
    "Emily Dickinson’s We Grow Accustomed to the Dark analysis explores resilience, psychological darkness, common meter, and the meaning of adaptation.",
  h1: "We Grow Accustomed to the Dark analysis",
  intro:
    "This analysis explains how Emily Dickinson turns a simple loss of light into a meditation on grief, uncertainty, and the difficult work of finding one’s way. Read the poem’s meaning, themes, form, and literary devices.",
  fullTextSource: {
    label: "Emily Dickinson, poems 400–499 (poem 419)",
    url: "https://en.wikisource.org/wiki/Author:Emily_Dickinson/400-499",
    publisher: "Wikisource",
  },
  editorSettings: poemMeterSettings("common-meter", {
    showCounts: true,
    showStress: true,
    showMeterBreaks: true,
    showRhymeScheme: true,
  }),
  summary: [
    p("The poem begins with a literal scene: a neighbor withdraws a lamp, leaving someone to take an uncertain first step into the night. Gradually, the eyes adjust and the road can be met upright.", ["poetry-lovers-dark"]),
    excerpt(`We grow accustomed to the Dark —
When Light is put away —
As when the Neighbor holds the Lamp`),
    p("Dickinson expands that scene into a metaphor for larger inner darknesses, or “Evenings of the Brain.” The bravest people still stumble and may hit an obstacle, but they learn to see well enough for life to move “almost straight.”", ["litcharts-dark"]),
  ],
  meaning: [
    p("The poem presents adaptation as a practice rather than a revelation. When light disappears, the first response is uncertainty; only repeated attention and movement make the darkness navigable.", ["poem-analysis-dark"]),
    excerpt(`And so of larger — Darknesses —
Those Evenings of the Brain —
When not a Moon disclose a sign —`),
    p("The final stanza refuses to say whether the world changes or perception changes. That unresolved alternative makes the conclusion honest: life resumes, but “almost straight” leaves room for damage, hesitation, and imperfect recovery.", ["poetry-lovers-dark"]),
  ],
  themes: [
    {
      theme: "Adaptation to uncertainty",
      blocks: [
        p("The poem follows a sequence from darkness, to an uncertain step, to adjusted vision. Its hope is practical: people can learn to move without first receiving complete clarity.", ["litcharts-dark"]),
      ],
    },
    {
      theme: "Psychological darkness",
      blocks: [
        p("“Evenings of the Brain” transforms a physical night into an interior state. The missing moon and star suggest a mind without an obvious sign, answer, or external reassurance.", ["poetry-lovers-dark"]),
      ],
    },
    {
      theme: "Courage without mastery",
      blocks: [
        excerpt(`The Bravest — grope a little —
And sometimes hit a Tree
Directly in the Forehead —`),
        p("The bravest are not those who walk flawlessly. They grope, collide with a tree, and continue learning to see. Dickinson defines courage as persistence while disoriented.", ["litcharts-dark"]),
      ],
    },
    {
      theme: "Qualified recovery",
      blocks: [
        excerpt(`Either the Darkness alters —
Or something in the sight
Adjusts itself to Midnight —`),
        p("The last word of the poem is not triumph but “almost.” Adaptation restores motion and some balance, yet it does not promise that darkness has been defeated or that life becomes perfectly straight.", ["poetry-lovers-dark"]),
      ],
    },
  ],
  formAndMeter: [
    p("The poem has five quatrains and broadly uses common meter, alternating iambic tetrameter and iambic trimeter. That hymn-like structure gives the poem a familiar walking pulse even as its subject is disorientation.", ["poetry-lovers-dark"]),
    p("The rhyme pattern is generally ABCB, but Dickinson favors slant or incomplete rhymes. The imperfect echoes suit a poem about adjustment that remains incomplete.", ["poem-analysis-dark"]),
    p("Dashes interrupt syntax and rhythm throughout. They make the reader pause, change direction, and resume, reproducing the halting movement of someone learning to navigate without light."),
  ],
  literaryDevices: [
    {
      device: "Extended metaphor",
      blocks: [
        excerpt(`And so of larger — Darknesses —
Those Evenings of the Brain —`),
        p("Physical darkness becomes a sustained model for psychological hardship. The poem moves from eyes adapting to night toward a mind trying to find its way through an interior crisis.", ["litcharts-dark"]),
      ],
    },
    {
      device: "Personification",
      blocks: [
        excerpt(`Either the Darkness alters —
Or something in the sight
Adjusts itself to Midnight —`),
        p("Darkness is treated as something capable of altering, while sight behaves as though it can adjust itself. The personification keeps open whether change comes from the world or from the observer.", ["poetry-lovers-dark"]),
      ],
    },
    {
      device: "Vivid physical imagery",
      blocks: [
        excerpt(`And sometimes hit a Tree
Directly in the Forehead —
But as they learn to see —`),
        p("The blunt collision gives bodily force to an abstract claim about adversity. It also introduces a dry, almost comic shock that prevents the poem’s idea of bravery from becoming grand or sentimental."),
      ],
    },
    {
      device: "Capitalization and dashes",
      blocks: [
        excerpt(`Then — fit our Vision to the Dark —
And meet the Road — erect —`),
        p("Capitalized abstractions such as “Dark,” “Vision,” “Road,” and “Life” acquire unusual weight. The dashes split the sentence into tentative movements, making form enact the process it describes."),
      ],
    },
  ],
  historicalContext: [
    p("Dickinson composed the poem around 1862, during the most prolific period of her writing and amid the American Civil War. It was not published during her lifetime and first appeared in print in 1935.", ["poetry-lovers-dark"]),
    p("The poem is commonly identified by its first line because Dickinson generally left her poems untitled. Later editors assigned it the number J419 in Thomas H. Johnson’s variorum and Fr428 in R. W. Franklin’s edition.", ["poem-analysis-dark"]),
  ],
  citations: [
    { id: "wikisource-dark", source: "Wikisource", url: "https://en.wikisource.org/wiki/Author:Emily_Dickinson/400-499" },
    { id: "litcharts-dark", source: "LitCharts", url: "https://www.litcharts.com/poetry/emily-dickinson/we-grow-accustomed-to-the-dark", quote: "The poem speaks to the human capacity for survival and resilience in the face of hardship and uncertainty." },
    { id: "poetry-lovers-dark", source: "Poetry Lovers’ Page", url: "https://www.poetryloverspage.com/poets/dickinson/we_grow_accustomed_to_dark/literary-analysis", quote: "What makes the final stanza remarkable is its refusal to resolve cleanly." },
    { id: "poem-analysis-dark", source: "Poem Analysis", url: "https://poemanalysis.com/emily-dickinson/we-grow-accustomed-to-the-dark/" },
  ],
  criticalViews: [
    { citeId: "litcharts-dark" },
    { citeId: "poetry-lovers-dark" },
  ],
  faqs: [
    {
      q: "What is the meaning of “We Grow Accustomed to the Dark”?",
      plain:
        "Dickinson uses physical darkness as a metaphor for psychological hardship. The poem suggests that people can learn to navigate grief, uncertainty, or despair, but the final “almost straight” keeps recovery qualified rather than complete.",
    },
    {
      q: "What are the main themes in the poem?",
      plain:
        "The main themes are adaptation to uncertainty, psychological darkness, courage during disorientation, and imperfect recovery. The poem treats resilience as continuing to move while the path is still unclear.",
    },
    {
      q: "What meter does “We Grow Accustomed to the Dark” use?",
      plain:
        "The poem broadly uses common meter, alternating iambic tetrameter and iambic trimeter in five quatrains. Its dashes, substitutions, and slant rhymes make the hymn-like pattern feel unsettled.",
      href: "/tools/common-meter-checker",
      hrefLabel: "Open the common meter checker",
    },
    {
      q: "What does “Evenings of the Brain” mean?",
      plain:
        "The phrase marks the turn from literal night to inner darkness. It can describe states of grief, confusion, despair, or uncertainty in which no clear mental “Moon” or “Star” appears.",
    },
  ],
  cta: "Write with this poem’s meter in the editor",
};

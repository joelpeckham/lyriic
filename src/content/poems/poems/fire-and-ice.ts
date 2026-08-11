import type { PoemAnalysisContent } from "../types";
import { poemMeterSettings } from "../settings";

export const fireAndIcePoem: PoemAnalysisContent = {
  slug: "fire-and-ice",
  status: "ready",
  poemTitle: "Fire and Ice",
  author: "Robert Frost",
  yearPublished: 1920,
  publicDomainBasis:
    "First printed in Harper's Magazine in December 1920, so the poem is in the US public domain.",
  title: "Fire and Ice Analysis & Meaning — Robert Frost — lyriic",
  description:
    "Fire and Ice analysis and meaning: Frost’s compact poem weighs desire and hate as equally destructive forces.",
  h1: "Fire and Ice analysis",
  intro:
    "This Fire and Ice analysis explains how Robert Frost turns an end-of-the-world question into a study of desire, hatred, understatement, and poetic form.",
  text: `Some say the world will end in fire,
Some say in ice.
From what I’ve tasted of desire
I hold with those who favor fire.
But if it had to perish twice,
I think I know enough of hate
To say that for destruction ice
Is also great
And would suffice.`,
  fullTextSource: {
    label: "Fire and Ice",
    url: "https://www.poetryfoundation.org/poems/44263/fire-and-ice",
    publisher: "Poetry Foundation",
  },
  editorSettings: poemMeterSettings("iambic-tetrameter", {
    showCounts: true,
    showStress: true,
    showMeterBreaks: true,
    showRhymeScheme: true,
  }),
  summary: [
    "The speaker considers two predictions about how the world might end: fire or ice. Personal experience leads the speaker to favor fire, which is linked to desire.",
    "The speaker then grants that ice would also be enough to destroy the world, because the speaker knows the power of hate. The poem ends by making both emotions adequate causes of catastrophe.",
  ],
  meaning: [
    "Fire and ice work as elemental images for human emotions. Fire suggests desire that consumes and expands; ice suggests hatred or emotional coldness that hardens and separates.",
    "The poem’s casual, almost conversational voice makes its subject more unsettling. The speaker discusses annihilation as though comparing two plausible options, and the modest word “suffice” reduces the end of the world to a question of adequacy.",
    "The poem does not offer a reassuring third possibility. Its two alternatives differ in temperature and texture, but both reveal humanity’s capacity to turn feeling into destruction.",
  ],
  themes: [
    {
      theme: "Desire and excess",
      discussion:
        "The speaker’s phrase “tasted of desire” makes passion bodily and experiential. Fire represents desire when appetite grows hot enough to consume what surrounds it.",
    },
    {
      theme: "Hatred and emotional coldness",
      discussion:
        "Ice gives hate a physical form. Unlike spectacular fire, coldness can destroy through distance, indifference, fixation, and the slow hardening of relationships.",
    },
    {
      theme: "Human self-destruction",
      discussion:
        "The poem shifts from cosmic speculation to moral responsibility. The world-ending forces are not only astronomical elements; they are patterns of human feeling that can scale into collective ruin.",
    },
  ],
  formAndMeter: [
    "“Fire and Ice” is a single nine-line stanza. Most lines are iambic tetrameter, while lines 2, 8, and 9 contract to iambic dimeter. The changing line lengths keep the poem close to speech while giving its ending a clipped finality.",
    "The end-rhyme pattern is commonly represented as ABA ABC BCB: fire/desire, ice/twice/suffice, and hate/great interlock rather than resolving into separate blocks. The pattern has been read as a modified terza rima, a possible formal echo of Dante.",
    "The poem’s nine lines and its narrowing close can suggest a descent or compression, but the Dante connection is an interpretive possibility rather than something the poem explains directly. lyriic’s editor setting foregrounds the dominant iambic tetrameter while the analysis notes the dimeter exceptions.",
  ],
  literaryDevices: [
    {
      device: "Extended metaphor",
      example: "Some say the world will end in fire, / Some say in ice.",
      discussion:
        "The physical elements become figures for desire and hate. Frost keeps the metaphor compact, allowing the reader to move between planetary destruction and ordinary human emotion without a transition.",
    },
    {
      device: "Antithesis",
      example: "Some say ... fire, / Some say in ice.",
      discussion:
        "The repeated opening phrase sets fire against ice and gives the poem a balanced debate. The apparent opposition eventually becomes an equivalence: either force would be enough.",
    },
    {
      device: "Understatement and irony",
      example: "Is also great / And would suffice.",
      discussion:
        "“Suffice” usually means be enough, an unassuming word for global destruction. Its calm practicality clashes with the scale of the claim and creates the poem’s sharpest irony.",
    },
    {
      device: "Enjambment",
      example: "I think I know enough of hate / To say that for destruction ice",
      discussion:
        "The sentence crosses the line break as the speaker measures personal knowledge of hate. The delayed conclusion makes the judgment feel deliberate rather than explosive.",
    },
  ],
  historicalContext: [
    "The poem was first printed in Harper’s Magazine in December 1920 and later collected in New Hampshire: A Poem with Notes and Grace Notes in 1923. Its publication followed the First World War, a period when large-scale human destruction had become a newly immediate historical reality.",
    "A later account by astronomer Harlow Shapley connected Frost’s poem with a conversation about whether the sun might destroy or freeze the Earth. That story is part of the poem’s publication lore, but the finished poem turns the scientific alternatives into a metaphor for human desire and hate.",
    "Readers often connect the nine-line structure and modified terza-rima pattern with Dante’s Inferno. The connection is suggestive, especially because Dante’s Hell includes both fire and a frozen final circle, but it should be treated as an interpretive lens rather than a settled explanation of every detail.",
  ],
  criticalViews: [
    {
      source: "LitCharts",
      author: "LitCharts editors",
      quote:
        "The consistent iambs coupled with the varying line length create a breezy, conversational tone.",
      url: "https://www.litcharts.com/poetry/robert-frost/fire-and-ice",
    },
    {
      source: "Poetry Lovers’ Page",
      author: "Poetry Lovers’ Page editors",
      quote:
        "The effect is structural irony: fire gets more verbal space, but ice gets the last word.",
      url: "https://www.poetryloverspage.com/poets/frost/fire_and_ice/literary-analysis",
    },
  ],
  faqs: [
    {
      q: "What is the main meaning of “Fire and Ice”?",
      plain:
        "Frost presents desire and hate as two different but equally sufficient ways to destroy the world. The poem’s cosmic question becomes a warning about destructive human emotion.",
    },
    {
      q: "What do fire and ice symbolize?",
      plain:
        "Fire symbolizes consuming desire, passion, or appetite. Ice symbolizes hate, coldness, indifference, or emotional hardening. The poem does not make either force harmless.",
    },
    {
      q: "What is the rhyme scheme of “Fire and Ice”?",
      plain:
        "The rhyme scheme is commonly given as ABA ABC BCB. It interweaves the fire, ice, and hate rhyme families and is sometimes described as a modified terza rima.",
    },
    {
      q: "What is the meter of “Fire and Ice”?",
      plain:
        "Most lines are iambic tetrameter, but lines 2, 8, and 9 are shorter iambic dimeter lines. The variation supports the poem’s conversational sound and compressed ending.",
    },
  ],
  sources: [
    {
      label: "Poem text and first publication credit",
      url: "https://www.poetryfoundation.org/poems/44263/fire-and-ice",
      publisher: "Poetry Foundation",
    },
    {
      label: "Poem text and December 1920 publication note",
      url: "https://poets.org/poem/fire-and-ice",
      publisher: "Academy of American Poets",
    },
    {
      label: "Form, meter, rhyme, and interpretation",
      url: "https://www.litcharts.com/poetry/robert-frost/fire-and-ice",
      publisher: "LitCharts",
    },
    {
      label: "Literary analysis of form and imagery",
      url: "https://www.poetryloverspage.com/poets/frost/fire_and_ice/literary-analysis",
      publisher: "Poetry Lovers’ Page",
    },
  ],
  cta: "Write with this poem’s meter in the editor",
};

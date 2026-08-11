import type { PoemAnalysisContent } from "../types";
import { poemOpenSettings } from "../settings";

export const dreamsPoem: PoemAnalysisContent = {
  slug: "dreams",
  status: "ready",
  poemTitle: "Dreams",
  author: "Langston Hughes",
  yearPublished: 1922,
  publicDomainBasis:
    "The poem is documented as a 1922 work, placing its first publication before the US public-domain cutoff used for this catalog.",
  title: "Dreams Analysis & Meaning — Langston Hughes — lyriic",
  description:
    "Langston Hughes’s Dreams analysis explores its meaning, bird and field metaphors, themes of hope, and compact rhythmic form.",
  h1: "Dreams analysis",
  intro:
    "This analysis explains how Langston Hughes presents dreams as necessary for a life with movement, purpose, and possibility. Explore the poem’s meaning, themes, form, and imagery.",
  text: `Hold fast to dreams
For if dreams die
Life is a broken-winged bird
That cannot fly.

Hold fast to dreams
For when dreams go
Life is a barren field
Frozen with snow.`,
  fullTextSource: {
    label: "Dreams",
    url: "https://poets.org/poem/dreams",
    publisher: "Academy of American Poets",
  },
  editorSettings: poemOpenSettings({ showCounts: true }),
  summary: [
    "The speaker gives a direct command: hold tightly to dreams. Without them, life becomes like a bird with a broken wing—alive, but unable to do what gives it freedom and motion.",
    "The second stanza intensifies the warning. When dreams disappear, life becomes a barren field frozen in snow: sterile, still, and unable to support growth.",
  ],
  meaning: [
    "“Dreams” can mean hopes, aspirations, imaginative visions, or a sense of future possibility. Hughes leaves the word open enough to include both private goals and the larger dreams of communities.",
    "The poem does not describe dreams as optional decoration. Its comparisons suggest that dreams sustain life’s movement and capacity to grow; losing them is presented as a condition of deprivation.",
    "The shift from “if dreams die” to “when dreams go” makes the warning more urgent. Dreams may be vulnerable, so the imperative to “hold fast” asks readers to protect them while they can.",
  ],
  themes: [
    {
      theme: "Hope and aspiration",
      discussion:
        "The repeated command treats dreams as the source of a meaningful future. Holding onto them becomes an active form of hope rather than passive wishing.",
    },
    {
      theme: "Loss and emotional sterility",
      discussion:
        "The broken bird and frozen field turn the absence of dreams into physical conditions: impaired movement first, then complete barrenness and stillness.",
    },
    {
      theme: "Freedom and possibility",
      discussion:
        "A bird that cannot fly evokes lost freedom, while a field normally associated with cultivation becomes barren. Together, the images show how abandoned dreams restrict both movement and growth.",
    },
  ],
  formAndMeter: [
    "The poem is made of two compact quatrains. Each stanza begins with the same imperative, creating a refrain-like structure that makes the advice memorable and urgent.",
    "The short lines are closest to iambic dimeter, though Hughes varies the stresses to keep the language natural and forceful. The compressed rhythm suits the poem’s plainspoken warning.",
    "There is no elaborate end-rhyme scheme. Repetition, parallel syntax, and the echo of “die” / “fly” provide more of the poem’s musical cohesion than a regular rhyme pattern.",
  ],
  literaryDevices: [
    {
      device: "Extended metaphor",
      example: "Life is a broken-winged bird / That cannot fly.",
      discussion:
        "The poem translates the abstract loss of dreams into an injured creature. The bird’s lost ability to fly makes dreamlessness feel painful, limiting, and threatening to survival.",
    },
    {
      device: "Metaphor",
      example: "Life is a barren field / Frozen with snow.",
      discussion:
        "The field image expands the first comparison from impaired movement to total sterility. Barren ground and freezing weather suggest that no new growth can begin.",
    },
    {
      device: "Repetition",
      example: "Hold fast to dreams",
      discussion:
        "Repeating the opening command at the start of both stanzas gives the poem the sound of advice or a refrain. It also keeps the central instruction in the foreground.",
    },
    {
      device: "Juxtaposition",
      example: "if dreams die” / “when dreams go",
      discussion:
        "The poem places the vitality of dreams beside images of death, injury, barrenness, and cold. This contrast clarifies how much the speaker believes dreams contribute to life.",
    },
  ],
  historicalContext: [
    "The poem is commonly dated to 1922. A digital anthology records a related 1923 publication in The World Tomorrow, while other references identify 1922 as the poem’s date; this page uses 1922 as the catalog’s publication year.",
    "Hughes was an important writer of the Harlem Renaissance. Read in that context, the poem’s insistence on preserving dreams can apply both to individual aspiration and to the threatened hopes of Black Americans living under segregation and racism.",
  ],
  criticalViews: [
    {
      source: "Dreams Poem Summary and Analysis",
      author: "LitCharts",
      quote:
        "“Dreams” revolves around two major metaphors. The speaker compares life after the loss of dreams to “a broken-winged bird / That cannot fly” and “a barren field / Frozen with snow.”",
      url: "https://www.litcharts.com/poetry/langston-hughes/dreams",
    },
    {
      source: "“Hold fast to dreams”",
      author: "Rhode Island Foundation",
      quote:
        "The poem emphasizes the importance of holding onto dreams, especially during times of challenge.",
      url: "https://rifoundation.org/stories/hold-fast-to-dreams",
    },
  ],
  faqs: [
    {
      q: "What is the meaning of Langston Hughes’s “Dreams”?",
      plain:
        "The poem argues that dreams—especially hopes and aspirations—are necessary for a life with purpose, movement, and the possibility of growth.",
    },
    {
      q: "What are the main themes in “Dreams”?",
      plain:
        "Its main themes are hope, aspiration, loss, freedom, and the emotional barrenness that follows when people abandon their dreams.",
    },
    {
      q: "What literary devices does Hughes use in “Dreams”?",
      plain:
        "Hughes uses repetition, parallel structure, and two central metaphors: life without dreams becomes a broken-winged bird and a barren field frozen with snow.",
    },
    {
      q: "What is the form and meter of “Dreams”?",
      plain:
        "The poem has two quatrains and is closest to iambic dimeter, with short, varied lines and no fixed end-rhyme scheme.",
    },
  ],
  sources: [
    {
      label: "Dreams",
      url: "https://poets.org/poem/dreams",
      publisher: "Academy of American Poets",
    },
    {
      label: "Langston Hughes, “Dreams” (1923)",
      url: "https://scalar.lehigh.edu/african-american-poetry-a-digital-anthology/langston-hughes-dreams-1923",
      publisher: "African-American Poetry: A Digital Anthology",
    },
    {
      label: "Dreams Poem Summary and Analysis",
      url: "https://www.litcharts.com/poetry/langston-hughes/dreams",
      publisher: "LitCharts",
    },
  ],
  cta: "Write with this poem’s rhythm in the editor",
};

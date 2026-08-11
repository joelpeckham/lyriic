import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const invictusPoem: PoemAnalysisContent = {
  slug: "invictus", status: "ready", poemTitle: "Invictus", author: "William Ernest Henley", yearPublished: 1875,
  publicDomainBasis: "First published in 1875 or earlier, placing this text in the public domain in the United States.",
  title: "Invictus Analysis & Meaning — William Ernest Henley — lyriic",
  description: "Invictus analysis: Henley’s poem of resilience, suffering, agency, mortality, imagery, and famous final declaration.", h1: "Invictus analysis",
  intro: "This Invictus analysis explains the poem’s meaning, themes, form, and literary devices.",
  fullTextSource: { label: "Invictus", url: "https://poets.org/poem/invictus", publisher: "Academy of American Poets" },
  editorSettings: poemMeterSettings("iambic-tetrameter", { showCounts: true, showStress: true, showMeterBreaks: true, showRhymeScheme: true }),
  summary: [p("The speaker faces darkness, bodily pain, chance, and death without surrendering his inner authority. Four compact quatrains move from endured suffering to a final claim of self-command."), excerpt(`In the fell clutch of circumstance\nI have not winced nor cried aloud.\nUnder the bludgeonings of chance`), p("The poem’s structure makes its central tension memorable.", ["cite-one"])],
  meaning: [p("The poem does not deny suffering; it names blood, wrath, tears, and the menace of years. Its defiance concerns the speaker’s response and inner agency rather than control over every event.", ["cite-one"]), excerpt(`I am the master of my fate:\nI am the captain of my soul.`), p("Its images turn an abstract concern into a scene readers can hear and see.", ["cite-two"])],
  themes: [
    { theme: "Resilience under suffering", blocks: [p("The poem returns to resilience under suffering through recurring images and shifts in voice.", ["cite-one"])] },
    { theme: "Agency and mortality", blocks: [excerpt(`I am the master of my fate:\nI am the captain of my soul.`), p("This theme is developed through the poem’s contrast between image and argument.", ["cite-two"])] },
  ],
  formAndMeter: [p("Four quatrains follow an ABAB pattern in predominantly iambic tetrameter. The controlled form sounds like a vow, containing images of pain and uncertainty.", ["cite-two"]), excerpt(`In the fell clutch of circumstance\nI have not winced nor cried aloud.\nUnder the bludgeonings of chance`)],
  literaryDevices: [
    { device: "Extended metaphor", blocks: [excerpt(`In the fell clutch of circumstance\nI have not winced nor cried aloud.\nUnder the bludgeonings of chance`), p("The device gives the scene an emotional or rhetorical force beyond literal description.")] },
    { device: "Anaphora and parallelism", blocks: [excerpt(`I am the master of my fate:\nI am the captain of my soul.`), p("The repeated image or sound helps connect the local detail to the poem’s larger meaning.")] },
  ],
  historicalContext: [p("Henley wrote the poem in 1875 amid treatment for tuberculosis and after the loss of his leg. It first appeared without its familiar title in 1888; “Invictus,” meaning unconquered, was supplied later.", ["context"]), p("The poem’s later reception also shapes how readers understand its central images.", ["cite-two"])],
  citations: [
    { id: "cite-one", source: "Critical source", url: "https://interestingliterature.com/2017/02/i-am-the-master-of-my-fate-a-short-analysis-of-william-ernest-henleys-invictus/", quote: "That repeated assertion of the self, and of the self’s agency, is an affirmation of Henley’s autonomy." },
    { id: "cite-two", source: "Critical source", url: "https://interestingliterature.com/2017/02/i-am-the-master-of-my-fate-a-short-analysis-of-william-ernest-henleys-invictus/", quote: "The poem offers a stoic approach to life’s hardships." },
    { id: "full-text", source: "Academy of American Poets", url: "https://poets.org/poem/invictus" },
    { id: "context", source: "Academy of American Poets and contextual notes", url: "https://poets.org/poem/invictus" },
  ],
  criticalViews: [{ citeId: "cite-one" }, { citeId: "cite-two" }],
  faqs: [
    { q: "What is the main meaning of Invictus?", plain: "The poem explores resilience under suffering and uses its central images to make that concern emotionally immediate." },
    { q: "What are the main themes?", plain: "Its main themes include resilience under suffering and agency and mortality." },
    { q: "What form does the poem use?", plain: "Four quatrains follow an ABAB pattern in predominantly iambic tetrameter. The controlled form sounds like a vow, containing images of pain and uncertainty." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

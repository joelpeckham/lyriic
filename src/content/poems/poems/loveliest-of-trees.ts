import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const loveliestOfTreesPoem: PoemAnalysisContent = {
  slug: "loveliest-of-trees", status: "ready", poemTitle: "Loveliest of Trees", author: "A. E. Housman", yearPublished: 1896,
  publicDomainBasis: "First published in 1896 or earlier, placing this text in the public domain in the United States.",
  title: "Loveliest of Trees Analysis & Meaning — A. E. Housman — lyriic",
  description: "A. E. Housman’s Loveliest of Trees analysis explores mortality, seasonal beauty, carpe diem, rhyme, and meter.", h1: "Loveliest of Trees analysis",
  intro: "This Loveliest of Trees analysis explains the poem’s meaning, themes, form, and literary devices.",
  fullTextSource: { label: "Loveliest of Trees", url: "https://en.wikisource.org/wiki/A_Shropshire_Lad", publisher: "Wikisource" },
  editorSettings: poemMeterSettings("iambic-tetrameter", { showCounts: true, showStress: true, showMeterBreaks: true, showRhymeScheme: true }),
  summary: [p("A cherry tree in Easter bloom prompts the speaker to calculate the springs remaining in a seventy-year life. Mortality leads him to walk into the woods and attend to beauty."), excerpt(`Loveliest of trees, the cherry now\nIs hung with bloom along the bough,\nAnd stands about the woodland ride`), p("The poem’s structure makes its central tension memorable.", ["cite-one"])],
  meaning: [p("The poem joins carpe diem to memento mori. The finite number of future springs makes beauty more urgent, not less valuable; reflection becomes a decision to go and look.", ["cite-one"]), excerpt(`And since to look at things in bloom\nFifty springs are little room,\nAbout the woodlands I will go`), p("Its images turn an abstract concern into a scene readers can hear and see.", ["cite-two"])],
  themes: [
    { theme: "Mortality and time", blocks: [p("The poem returns to mortality and time through recurring images and shifts in voice.", ["cite-one"])] },
    { theme: "Transience and beauty", blocks: [excerpt(`And since to look at things in bloom\nFifty springs are little room,\nAbout the woodlands I will go`), p("This theme is developed through the poem’s contrast between image and argument.", ["cite-two"])] },
  ],
  formAndMeter: [p("Three quatrains are arranged as six rhyming couplets, AABB CCDD EEFF, in predominantly iambic tetrameter. The walking rhythm supports the final movement into the woods.", ["cite-two"]), excerpt(`Loveliest of trees, the cherry now\nIs hung with bloom along the bough,\nAnd stands about the woodland ride`)],
  literaryDevices: [
    { device: "Personification", blocks: [excerpt(`Loveliest of trees, the cherry now\nIs hung with bloom along the bough,\nAnd stands about the woodland ride`), p("The device gives the scene an emotional or rhetorical force beyond literal description.")] },
    { device: "Alliteration and enjambment", blocks: [excerpt(`And since to look at things in bloom\nFifty springs are little room,\nAbout the woodlands I will go`), p("The repeated image or sound helps connect the local detail to the poem’s larger meaning.")] },
  ],
  historicalContext: [p("The poem is the second lyric in A Shropshire Lad, published in 1896. “Threescore years and ten” echoes Psalm 90:10, while Eastertide adds renewal to the mortality meditation.", ["context"]), p("The poem’s later reception also shapes how readers understand its central images.", ["cite-two"])],
  citations: [
    { id: "cite-one", source: "Critical source", url: "https://www.litcharts.com/poetry/a-e-housman/loveliest-of-trees", quote: "The idea that a lifetime offers hardly enough “room” to take in all the beauty of the natural world doesn’t make the speaker despair." },
    { id: "cite-two", source: "Critical source", url: "https://interestingliterature.com/2016/09/a-short-analysis-of-a-e-housmans-loveliest-of-trees-the-cherry-now/", quote: "“Loveliest of Trees” is a carpe diem poem ... and also ... a memento mori." },
    { id: "full-text", source: "Wikisource", url: "https://en.wikisource.org/wiki/A_Shropshire_Lad" },
    { id: "context", source: "Wikisource and contextual notes", url: "https://en.wikisource.org/wiki/A_Shropshire_Lad" },
  ],
  criticalViews: [{ citeId: "cite-one" }, { citeId: "cite-two" }],
  faqs: [
    { q: "What is the main meaning of Loveliest of Trees?", plain: "The poem explores mortality and time and uses its central images to make that concern emotionally immediate." },
    { q: "What are the main themes?", plain: "Its main themes include mortality and time and transience and beauty." },
    { q: "What form does the poem use?", plain: "Three quatrains are arranged as six rhyming couplets, AABB CCDD EEFF, in predominantly iambic tetrameter. The walking rhythm supports the final movement into the woods." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

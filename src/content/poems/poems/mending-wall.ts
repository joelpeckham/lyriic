import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const mendingWallPoem: PoemAnalysisContent = {
  slug: "mending-wall", status: "ready", poemTitle: "Mending Wall", author: "Robert Frost", yearPublished: 1914,
  publicDomainBasis: "First published in 1914 or earlier, placing this text in the public domain in the United States.",
  title: "Mending Wall Analysis & Meaning — Robert Frost — lyriic",
  description: "Robert Frost’s Mending Wall analysis explores boundaries, tradition, irony, blank verse, and the meaning of good fences.", h1: "Mending Wall analysis",
  intro: "This Mending Wall analysis explains the poem’s meaning, themes, form, and literary devices.",
  fullTextSource: { label: "Mending Wall", url: "https://en.wikisource.org/wiki/North_of_Boston/Mending_Wall", publisher: "Wikisource" },
  editorSettings: poemMeterSettings("blank-verse", { showCounts: true, showStress: true, showMeterBreaks: true, showRhymeScheme: false }),
  summary: [p("Two neighbors meet each spring to rebuild a stone wall. The speaker sees no practical need for it, while the neighbor repeats an inherited proverb about fences and neighbors."), excerpt(`Something there is that doesn’t love a wall,\nThat sends the frozen-ground-swell under it,\nAnd spills the upper boulders in the sun;`), p("The poem’s structure makes its central tension memorable.", ["cite-one"])],
  meaning: [p("The wall is physical and philosophical. The speaker questions what it excludes, yet he summons the neighbor and joins the repair, so the ritual both divides and creates contact.", ["cite-one"]), excerpt(`Before I built a wall I’d ask to know\nWhat I was walling in or walling out,\nAnd to whom I was like to give offence.`), p("Its images turn an abstract concern into a scene readers can hear and see.", ["cite-two"])],
  themes: [
    { theme: "Boundaries and belonging", blocks: [p("The poem returns to boundaries and belonging through recurring images and shifts in voice.", ["cite-one"])] },
    { theme: "Tradition and critical thought", blocks: [excerpt(`Before I built a wall I’d ask to know\nWhat I was walling in or walling out,\nAnd to whom I was like to give offence.`), p("This theme is developed through the poem’s contrast between image and argument.", ["cite-two"])] },
  ],
  formAndMeter: [p("The single 46-line poem is conversational blank verse, chiefly iambic pentameter without end rhyme. Its continuous lineation makes the walk and argument feel ongoing.", ["cite-two"]), excerpt(`Something there is that doesn’t love a wall,\nThat sends the frozen-ground-swell under it,\nAnd spills the upper boulders in the sun;`)],
  literaryDevices: [
    { device: "Personification", blocks: [excerpt(`Something there is that doesn’t love a wall,\nThat sends the frozen-ground-swell under it,\nAnd spills the upper boulders in the sun;`), p("The device gives the scene an emotional or rhetorical force beyond literal description.")] },
    { device: "Irony and extended metaphor", blocks: [excerpt(`Before I built a wall I’d ask to know\nWhat I was walling in or walling out,\nAnd to whom I was like to give offence.`), p("The repeated image or sound helps connect the local detail to the poem’s larger meaning.")] },
  ],
  historicalContext: [p("Mending Wall opens North of Boston, published in 1914. Frost’s rural details support broader readings about social and national borders, but the poem preserves ambiguity.", ["context"]), p("The poem’s later reception also shapes how readers understand its central images.", ["cite-two"])],
  citations: [
    { id: "cite-one", source: "Critical source", url: "https://www.poetryfoundation.org/articles/150774/robert-frost-mending-wall", quote: "If fences do not “make good neighbors,” the “making” of fences can." },
    { id: "cite-two", source: "Critical source", url: "https://www.poetryfoundation.org/articles/150774/robert-frost-mending-wall", quote: "Doubt is what makes “Mending Wall” a poem and not an editorial." },
    { id: "full-text", source: "Wikisource", url: "https://en.wikisource.org/wiki/North_of_Boston/Mending_Wall" },
    { id: "context", source: "Wikisource and contextual notes", url: "https://en.wikisource.org/wiki/North_of_Boston/Mending_Wall" },
  ],
  criticalViews: [{ citeId: "cite-one" }, { citeId: "cite-two" }],
  faqs: [
    { q: "What is the main meaning of Mending Wall?", plain: "The poem explores boundaries and belonging and uses its central images to make that concern emotionally immediate." },
    { q: "What are the main themes?", plain: "Its main themes include boundaries and belonging and tradition and critical thought." },
    { q: "What form does the poem use?", plain: "The single 46-line poem is conversational blank verse, chiefly iambic pentameter without end rhyme. Its continuous lineation makes the walk and argument feel ongoing." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

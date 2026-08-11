import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const littleWomenPoemPoem: PoemAnalysisContent = {
  slug: "little-women-poem", status: "ready", poemTitle: "In the Garret", author: "Louisa May Alcott", yearPublished: 1869,
  publicDomainBasis: "First published in 1869 or earlier, placing this text in the public domain in the United States.",
  title: "In the Garret Analysis & Meaning — Louisa May Alcott — lyriic",
  description: "Little Women poem analysis: Alcott’s In the Garret explores sisterhood, memory, grief, domestic objects, and change.", h1: "In the Garret analysis",
  intro: "This In the Garret analysis explains the poem’s meaning, themes, form, and literary devices.",
  fullTextSource: { label: "In the Garret", url: "https://www.gutenberg.org/files/514/514-h/514-h.htm", publisher: "Project Gutenberg" },
  editorSettings: poemMeterSettings("common-meter", { showCounts: true, showStress: true, showMeterBreaks: true, showRhymeScheme: true }),
  summary: [p("Four attic chests preserve the childhood objects and adult histories of Meg, Jo, Beth, and Amy. The closing return to the chests imagines family love surviving separation and death."), excerpt(`Four little chests all in a row,\nDim with dust, and worn by time,\nAll fashioned and filled, long ago,`), p("The poem’s structure makes its central tension memorable.", ["cite-one"])],
  meaning: [p("The chests turn keepsakes into a family archive. Each lid gives material form to a sister’s path from childhood into love, work, motherhood, solitude, or death.", ["cite-one"]), excerpt(`Four sisters, parted for an hour,\nNone lost, one only gone before,\nMade by love’s immortal power,`), p("Its images turn an abstract concern into a scene readers can hear and see.", ["cite-two"])],
  themes: [
    { theme: "Sisterhood and memory", blocks: [p("The poem returns to sisterhood and memory through recurring images and shifts in voice.", ["cite-one"])] },
    { theme: "Loss and mourning", blocks: [excerpt(`Four sisters, parted for an hour,\nNone lost, one only gone before,\nMade by love’s immortal power,`), p("This theme is developed through the poem’s contrast between image and argument.", ["cite-two"])] },
  ],
  formAndMeter: [p("This long lyric is built from rhymed quatrains and recurring “falling summer rain” lines. The refrain changes from sweet to sad to blithe as the portraits unfold.", ["cite-two"]), excerpt(`Four little chests all in a row,\nDim with dust, and worn by time,\nAll fashioned and filled, long ago,`)],
  literaryDevices: [
    { device: "Extended metaphor", blocks: [excerpt(`Four little chests all in a row,\nDim with dust, and worn by time,\nAll fashioned and filled, long ago,`), p("The device gives the scene an emotional or rhetorical force beyond literal description.")] },
    { device: "Refrain", blocks: [excerpt(`Four sisters, parted for an hour,\nNone lost, one only gone before,\nMade by love’s immortal power,`), p("The repeated image or sound helps connect the local detail to the poem’s larger meaning.")] },
  ],
  historicalContext: [p("The poem appears in chapter 46 of Little Women, published in 1868–69. Jo dismisses it as “very bad poetry” in the novel, but says she felt it while lonely; its emotional truth matters within the scene.", ["context"]), p("The poem’s later reception also shapes how readers understand its central images.", ["cite-two"])],
  citations: [
    { id: "cite-one", source: "Critical source", url: "https://www.encyclopedia.com/social-sciences/applied-and-social-sciences-magazines/garret", quote: "The imagery in the poem captures each girls’ spirit." },
    { id: "cite-two", source: "Critical source", url: "https://www.gutenberg.org/files/514/514-h/514-h.htm", quote: "It’s very bad poetry, but I felt it when I wrote it, one day when I was very lonely." },
    { id: "full-text", source: "Project Gutenberg", url: "https://www.gutenberg.org/files/514/514-h/514-h.htm" },
    { id: "context", source: "Project Gutenberg and contextual notes", url: "https://www.gutenberg.org/files/514/514-h/514-h.htm" },
  ],
  criticalViews: [{ citeId: "cite-one" }, { citeId: "cite-two" }],
  faqs: [
    { q: "What is the main meaning of In the Garret?", plain: "The poem explores sisterhood and memory and uses its central images to make that concern emotionally immediate." },
    { q: "What are the main themes?", plain: "Its main themes include sisterhood and memory and loss and mourning." },
    { q: "What form does the poem use?", plain: "This long lyric is built from rhymed quatrains and recurring “falling summer rain” lines. The refrain changes from sweet to sad to blithe as the portraits unfold." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

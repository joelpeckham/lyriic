import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const inFlandersFieldsPoem: PoemAnalysisContent = {
  slug: "in-flanders-fields", status: "ready", poemTitle: "In Flanders Fields", author: "John McCrae", yearPublished: 1915,
  publicDomainBasis: "First published in 1915 or earlier, placing this text in the public domain in the United States.",
  title: "In Flanders Fields Analysis & Meaning — John McCrae — lyriic",
  description: "John McCrae’s In Flanders Fields analysis explores remembrance, war, poppy imagery, rondeau form, and its contested final command.", h1: "In Flanders Fields analysis",
  intro: "This In Flanders Fields analysis explains the poem’s meaning, themes, form, and literary devices.",
  fullTextSource: { label: "In Flanders Fields", url: "https://thecanadianencyclopedia.ca/en/article/in-flanders-fields", publisher: "The Canadian Encyclopedia" },
  editorSettings: poemOpenSettings({ showCounts: true }),
  summary: [p("The dead speak from a battlefield where poppies bloom among crosses and larks are nearly drowned by guns. The final stanza passes a torch to the living, turning remembrance into a demand."), excerpt(`In Flanders fields the poppies blow\nBetween the crosses, row on row,\nThat mark our place:`), p("The poem’s structure makes its central tension memorable.", ["cite-one"])],
  meaning: [p("The poem’s power comes from the tension between pastoral renewal and human death. Its final command is uneasy: mourning can preserve memory, but it can also pressure the living to continue a war.", ["cite-one"]), excerpt(`We are the Dead. Short days ago\nWe lived, felt dawn, saw sunset glow,\nLoved and were loved, and now we lie`), p("Its images turn an abstract concern into a scene readers can hear and see.", ["cite-two"])],
  themes: [
    { theme: "Remembrance and memorial", blocks: [p("The poem returns to remembrance and memorial through recurring images and shifts in voice.", ["cite-one"])] },
    { theme: "Nature beside destruction", blocks: [excerpt(`We are the Dead. Short days ago\nWe lived, felt dawn, saw sunset glow,\nLoved and were loved, and now we lie`), p("This theme is developed through the poem’s contrast between image and argument.", ["cite-two"])] },
  ],
  formAndMeter: [p("The poem is a rondeau-like fifteen-line lyric with a returning refrain. Repetition gives it a ceremonial shape, while varied accentual-syllabic rhythm keeps the voice urgent.", ["cite-two"]), excerpt(`In Flanders fields the poppies blow\nBetween the crosses, row on row,\nThat mark our place:`)],
  literaryDevices: [
    { device: "Personification", blocks: [excerpt(`In Flanders fields the poppies blow\nBetween the crosses, row on row,\nThat mark our place:`), p("The device gives the scene an emotional or rhetorical force beyond literal description.")] },
    { device: "Symbolism", blocks: [excerpt(`We are the Dead. Short days ago\nWe lived, felt dawn, saw sunset glow,\nLoved and were loved, and now we lie`), p("The repeated image or sound helps connect the local detail to the poem’s larger meaning.")] },
  ],
  historicalContext: [p("McCrae wrote the poem after Alexis Helmer was killed near Ypres and McCrae conducted the burial. It was printed anonymously in Punch on December 8, 1915; its poppy imagery later shaped remembrance practices.", ["context"]), p("The poem’s later reception also shapes how readers understand its central images.", ["cite-two"])],
  citations: [
    { id: "cite-one", source: "Critical source", url: "https://journals.lib.unb.ca/index.php/SCL/article/view/15269", quote: "In the first two stanzas, McCrae uses conventional pastoral imagery to disrupt the familiar association between Christian ideals of redemption and renewal with nature." },
    { id: "cite-two", source: "Critical source", url: "https://www.poetryfoundation.org/articles/148250/no-case-of-petty-right-or-wrong", quote: "The British and Canadian governments used the poem in advertisements to sell war bonds and to encourage recruitment." },
    { id: "full-text", source: "The Canadian Encyclopedia", url: "https://thecanadianencyclopedia.ca/en/article/in-flanders-fields" },
    { id: "context", source: "The Canadian Encyclopedia and contextual notes", url: "https://thecanadianencyclopedia.ca/en/article/in-flanders-fields" },
  ],
  criticalViews: [{ citeId: "cite-one" }, { citeId: "cite-two" }],
  faqs: [
    { q: "What is the main meaning of In Flanders Fields?", plain: "The poem explores remembrance and memorial and uses its central images to make that concern emotionally immediate." },
    { q: "What are the main themes?", plain: "Its main themes include remembrance and memorial and nature beside destruction." },
    { q: "What form does the poem use?", plain: "The poem is a rondeau-like fifteen-line lyric with a returning refrain. Repetition gives it a ceremonial shape, while varied accentual-syllabic rhythm keeps the voice urgent." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

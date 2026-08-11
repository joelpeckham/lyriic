import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const magdalenWalksPoem: PoemAnalysisContent = {
  slug: "magdalen-walks", status: "ready", poemTitle: "Magdalen Walks", author: "Oscar Wilde", yearPublished: 1881,
  publicDomainBasis: "First published in 1881 or earlier, placing this text in the public domain in the United States.",
  title: "Magdalen Walks Analysis & Meaning — Oscar Wilde — lyriic",
  description: "Magdalen Walks analysis and meaning: Wilde’s spring poem uses color, scent, sound, motion, and personification.", h1: "Magdalen Walks analysis",
  intro: "This Magdalen Walks analysis explains the poem’s meaning, themes, form, and literary devices.",
  fullTextSource: { label: "Magdalen Walks", url: "https://poets.org/poem/magdalen-walks", publisher: "Academy of American Poets" },
  editorSettings: poemOpenSettings({ showCounts: true }),
  summary: [p("Wilde’s spring walk moves through racing clouds, flowers, birds, trees, scents, and light. Spring is a force of motion rather than a static pastoral picture."), excerpt(`The little white clouds are racing over the sky,\nAnd the fields are strewn with the gold of the flower of March,\nThe daffodil breaks under foot,`), p("The poem’s structure makes its central tension memorable.", ["cite-one"])],
  meaning: [p("The poem celebrates renewal as a multisensory rush. Its verbs make growth disruptive as well as beautiful: flowers break, birds flash, and the kingfisher wounds the air.", ["cite-one"]), excerpt(`See! the lark starts up from his bed in the meadow there,\nBreaking the gossamer threads and the nets of dew,\nAnd flashing adown the river, a flame of blue!`), p("Its images turn an abstract concern into a scene readers can hear and see.", ["cite-two"])],
  themes: [
    { theme: "Spring and renewal", blocks: [p("The poem returns to spring and renewal through recurring images and shifts in voice.", ["cite-one"])] },
    { theme: "Movement and sensory beauty", blocks: [excerpt(`See! the lark starts up from his bed in the meadow there,\nBreaking the gossamer threads and the nets of dew,\nAnd flashing adown the river, a flame of blue!`), p("This theme is developed through the poem’s contrast between image and argument.", ["cite-two"])] },
  ],
  formAndMeter: [p("Five quatrains use long, flexible lines and an ABBA rhyme pattern. The extended syntax carries the eye across the landscape while repeated sounds create a lively pulse.", ["cite-two"]), excerpt(`The little white clouds are racing over the sky,\nAnd the fields are strewn with the gold of the flower of March,\nThe daffodil breaks under foot,`)],
  literaryDevices: [
    { device: "Personification", blocks: [excerpt(`The little white clouds are racing over the sky,\nAnd the fields are strewn with the gold of the flower of March,\nThe daffodil breaks under foot,`), p("The device gives the scene an emotional or rhetorical force beyond literal description.")] },
    { device: "Color imagery and simile", blocks: [excerpt(`See! the lark starts up from his bed in the meadow there,\nBreaking the gossamer threads and the nets of dew,\nAnd flashing adown the river, a flame of blue!`), p("The repeated image or sound helps connect the local detail to the poem’s larger meaning.")] },
  ],
  historicalContext: [p("Wilde attended Magdalen College, Oxford, from 1874 to 1878. The poem appeared in Poems in 1881, after an earlier publication in the Irish Monthly.", ["context"]), p("The poem’s later reception also shapes how readers understand its central images.", ["cite-two"])],
  citations: [
    { id: "cite-one", source: "Critical source", url: "https://poemanalysis.com/oscar-wilde/magdalen-walks/", quote: "“Magdalen Walks” describes the coming of spring and the vibrant, continually moving elements that herald its arrival." },
    { id: "cite-two", source: "Critical source", url: "https://poemanalysis.com/oscar-wilde/magdalen-walks/", quote: "Oscar Browning called it “a sweetly musical tribute to the author’s college”." },
    { id: "full-text", source: "Academy of American Poets", url: "https://poets.org/poem/magdalen-walks" },
    { id: "context", source: "Academy of American Poets and contextual notes", url: "https://poets.org/poem/magdalen-walks" },
  ],
  criticalViews: [{ citeId: "cite-one" }, { citeId: "cite-two" }],
  faqs: [
    { q: "What is the main meaning of Magdalen Walks?", plain: "The poem explores spring and renewal and uses its central images to make that concern emotionally immediate." },
    { q: "What are the main themes?", plain: "Its main themes include spring and renewal and movement and sensory beauty." },
    { q: "What form does the poem use?", plain: "Five quatrains use long, flexible lines and an ABBA rhyme pattern. The extended syntax carries the eye across the landscape while repeated sounds create a lively pulse." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

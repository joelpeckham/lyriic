import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const inPraiseOfSolidPeoplePoem: PoemAnalysisContent = {
  slug: "in-praise-of-solid-people", status: "ready", poemTitle: "In Praise of Solid People", author: "C. S. Lewis", yearPublished: 1919,
  publicDomainBasis: "First published in 1919 or earlier, placing this text in the public domain in the United States.",
  title: "In Praise of Solid People Analysis & Meaning — C. S. Lewis — lyriic",
  description: "Analyze C. S. Lewis’s In Praise of Solid People: meaning, contentment, desire, spiritual unrest, imagery, and form.", h1: "In Praise of Solid People analysis",
  intro: "This In Praise of Solid People analysis explains the poem’s meaning, themes, form, and literary devices.",
  fullTextSource: { label: "In Praise of Solid People", url: "https://www.gutenberg.org/files/2003/2003-h/2003-h.htm", publisher: "Project Gutenberg" },
  editorSettings: poemMeterSettings("iambic-tetrameter", { showCounts: true, showStress: true, showMeterBreaks: true, showRhymeScheme: true }),
  summary: [p("The speaker envies ordinary people whose domestic routines and settled affections seem peaceful. Lonely nights, phantom faces, and impossible visions reveal the cost of his restless longing."), excerpt(`Thank God that there are solid folk\nWho water flowers and roll the lawn,\nAnd sit an sew and talk and smoke,`), p("The poem’s structure makes its central tension memorable.", ["cite-one"])],
  meaning: [p("The poem reverses the speaker’s earlier contempt for ordinary life. “Weariness and strife” teach him that practical affection and contentment may be wisdom rather than dullness.", ["cite-one"]), excerpt(`And still no neared to the Light,\nAnd still no further from myself,\nAlone and lost in clinging night—`), p("Its images turn an abstract concern into a scene readers can hear and see.", ["cite-two"])],
  themes: [
    { theme: "Contentment versus desire", blocks: [p("The poem returns to contentment versus desire through recurring images and shifts in voice.", ["cite-one"])] },
    { theme: "Loneliness and spiritual uncertainty", blocks: [excerpt(`And still no neared to the Light,\nAnd still no further from myself,\nAlone and lost in clinging night—`), p("This theme is developed through the poem’s contrast between image and argument.", ["cite-two"])] },
  ],
  formAndMeter: [p("Thirteen quatrains use mostly alternating rhyme and a generally iambic-tetrameter pulse. The regular units resemble the stability the speaker admires, even as syntax and imagery become troubled.", ["cite-two"]), excerpt(`Thank God that there are solid folk\nWho water flowers and roll the lawn,\nAnd sit an sew and talk and smoke,`)],
  literaryDevices: [
    { device: "Pathetic fallacy", blocks: [excerpt(`Thank God that there are solid folk\nWho water flowers and roll the lawn,\nAnd sit an sew and talk and smoke,`), p("The device gives the scene an emotional or rhetorical force beyond literal description.")] },
    { device: "Fantastical imagery", blocks: [excerpt(`And still no neared to the Light,\nAnd still no further from myself,\nAlone and lost in clinging night—`), p("The repeated image or sound helps connect the local detail to the poem’s larger meaning.")] },
  ],
  historicalContext: [p("Spirits in Bondage was Lewis’s first book, published under the pseudonym Clive Hamilton in 1919. The collection belongs to his pre-conversion period and its recurring concern is yearning for meaning.", ["context"]), p("The poem’s later reception also shapes how readers understand its central images.", ["cite-two"])],
  citations: [
    { id: "cite-one", source: "Critical source", url: "https://www.geeksundergrace.com/books/review-spirits-in-bondage/", quote: "he honors the ability of the laypeople to function and move through life in spite of the horrors of life." },
    { id: "cite-two", source: "Critical source", url: "https://www.geeksundergrace.com/books/review-spirits-in-bondage/", quote: "The poem seems to actively show a jealousy of simple folk and their ability to function in life." },
    { id: "full-text", source: "Project Gutenberg", url: "https://www.gutenberg.org/files/2003/2003-h/2003-h.htm" },
    { id: "context", source: "Project Gutenberg and contextual notes", url: "https://www.gutenberg.org/files/2003/2003-h/2003-h.htm" },
  ],
  criticalViews: [{ citeId: "cite-one" }, { citeId: "cite-two" }],
  faqs: [
    { q: "What is the main meaning of In Praise of Solid People?", plain: "The poem explores contentment versus desire and uses its central images to make that concern emotionally immediate." },
    { q: "What are the main themes?", plain: "Its main themes include contentment versus desire and loneliness and spiritual uncertainty." },
    { q: "What form does the poem use?", plain: "Thirteen quatrains use mostly alternating rhyme and a generally iambic-tetrameter pulse. The regular units resemble the stability the speaker admires, even as syntax and imagery become troubled." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

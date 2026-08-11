import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const paradiseLostPoem: PoemAnalysisContent = {
  slug: "paradise-lost",
  status: "ready",
  poemTitle: "Paradise Lost",
  author: "John Milton",
  yearPublished: 1667,
  publicDomainBasis: "First published in 1667, before 1931; the original work is public domain in the United States.",
  title: "Paradise Lost Analysis & Meaning — John Milton — lyriic",
  description: "Paradise Lost analysis and meaning: explore its themes, form, imagery, and interpretation.",
  h1: "Paradise Lost analysis",
  intro: "This Paradise Lost analysis explains its meaning, themes, form, and major literary devices.",
  fullTextSource: { label: "Full text of Paradise Lost", url: "https://en.wikisource.org/wiki/Paradise_Lost_(1667)/Book_I", publisher: "Public-domain text" },
  editorSettings: poemMeterSettings("iambic-pentameter", { showCounts: true, showStress: true, showMeterBreaks: true }),
  summary: [p(`The Book I invocation names humanity’s first disobedience, the loss of Eden, and the epic’s aim to explain divine providence. Milton calls on a Christian muse rather than a classical one.`, ["sparknotes-paradise-lost"]), excerpt(`Of Mans First Disobedience, and the Fruit
Of that Forbidden Tree, whose mortal tast
Brought Death into the World, and all our woe,`)],
  meaning: [p(`The opening combines epic ambition with dependence: the poet intends a song that will exceed classical precedent but asks the Spirit to illuminate what is dark in him.`, ["wikisource-paradise-lost"]), excerpt(`That to the highth of this great Argument
I may assert Eternal Providence,
And justifie the wayes of God to men.`)],
  themes: [
    { theme: "Meaning and interpretation", blocks: [p(`The opening combines epic ambition with dependence: the poet intends a song that will exceed classical precedent but asks the Spirit to illuminate what is dark in him.`, ["sparknotes-paradise-lost"])] },
    { theme: "Form and language", blocks: [p(`Paradise Lost is English heroic blank verse: unrhymed iambic pentameter varied by enjambment, pauses, and inversions.`, ["wikisource-paradise-lost"])] },
  ],
  formAndMeter: [p(`Paradise Lost is English heroic blank verse: unrhymed iambic pentameter varied by enjambment, pauses, and inversions.`, ["wikisource-paradise-lost"]), excerpt(`Of Mans First Disobedience, and the Fruit
Of that Forbidden Tree, whose mortal tast
Brought Death into the World, and all our woe,`)],
  literaryDevices: [
    { device: "Imagery and contrast", blocks: [excerpt(`Of Mans First Disobedience, and the Fruit
Of that Forbidden Tree, whose mortal tast
Brought Death into the World, and all our woe,`), p("Concrete images turn the poem’s central abstraction into a memorable scene.")] },
    { device: "Repetition and sound", blocks: [excerpt(`That to the highth of this great Argument
I may assert Eternal Providence,
And justifie the wayes of God to men.`), p("Repetition and patterned sound give the argument emotional force and shape the reader’s pace.")] },
  ],
  historicalContext: [p("The work belongs to the public-domain period identified by its first publication year. Its historical setting and literary conventions inform the interpretation without replacing close reading.", ["sparknotes-paradise-lost"]), p(`Paradise Lost is English heroic blank verse: unrhymed iambic pentameter varied by enjambment, pauses, and inversions.`, ["wikisource-paradise-lost"])],
  citations: [
    { id: "sparknotes-paradise-lost", source: "SparkNotes", author: "SparkNotes editors", quote: "Milton’s invocation is extremely humble, expressing his utter dependence on God’s grace in speaking through him.", url: "https://www.sparknotes.com/poetry/paradiselost/section1/" },
    { id: "wikisource-paradise-lost", source: "Wikisource", author: "John Milton", quote: "Of Mans First Disobedience, and the Fruit", url: "https://en.wikisource.org/wiki/Paradise_Lost_(1667)/Book_I" },
    { id: "paradise-lost-full-text", source: "Public-domain full text", url: "https://en.wikisource.org/wiki/Paradise_Lost_(1667)/Book_I" },
    { id: "paradise-lost-form", source: "Poem text and formal analysis", url: "https://en.wikisource.org/wiki/Paradise_Lost_(1667)/Book_I" },
  ],
  criticalViews: [{ citeId: "sparknotes-paradise-lost" }, { citeId: "wikisource-paradise-lost" }],
  faqs: [
    { q: "What is the main meaning of Paradise Lost?", plain: "The poem’s meaning emerges from its central images, its treatment of change or conflict, and the relationship between the speaker and the world." },
    { q: "What are the main themes in Paradise Lost?", plain: "Its main themes include interpretation, human experience, and the way poetic form gives those concerns shape." },
    { q: "What form does Paradise Lost use?", plain: "The poem’s form is described in the analysis above; meter, lineation, repetition, and sound all contribute to its effect." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

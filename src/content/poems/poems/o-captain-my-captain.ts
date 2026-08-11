import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const oCaptainMyCaptainPoem: PoemAnalysisContent = {
  slug: "o-captain-my-captain",
  status: "ready",
  poemTitle: "O Captain! My Captain!",
  author: "Walt Whitman",
  yearPublished: 1865,
  publicDomainBasis: "First published in 1865, before 1931; the original work is public domain in the United States.",
  title: "O Captain! My Captain! Analysis & Meaning — Walt Whitman — lyriic",
  description: "O Captain! My Captain! analysis and meaning: explore its themes, form, imagery, and interpretation.",
  h1: "O Captain! My Captain! analysis",
  intro: "This O Captain! My Captain! analysis explains its meaning, themes, form, and major literary devices.",
  fullTextSource: { label: "Full text of O Captain! My Captain!", url: "https://www.poetryfoundation.org/poems/45474/o-captain-my-captain", publisher: "Public-domain text" },
  editorSettings: poemOpenSettings({ showCounts: true }),
  summary: [p(`A ship returns safely after a fearful voyage, but its captain lies dead on deck. The ship-of-state metaphor joins Union victory to grief for Abraham Lincoln.`, ["loc-captain"]), excerpt(`O Captain! my Captain! our fearful trip is done,
The ship has weather’d every rack, the prize we sought is won,
The port is near, the bells I hear, the people all exulting,`)],
  meaning: [p(`Whitman makes public triumph and private mourning occupy the same scene. Repeated bells, flags, and the refrain cannot make the dead leader share the celebration.`, ["poetry-foundation-captain"]), excerpt(`But I with mournful tread,
Walk the deck my Captain lies,
Fallen cold and dead.`)],
  themes: [
    { theme: "Meaning and interpretation", blocks: [p(`Whitman makes public triumph and private mourning occupy the same scene. Repeated bells, flags, and the refrain cannot make the dead leader share the celebration.`, ["loc-captain"])] },
    { theme: "Form and language", blocks: [p(`The poem uses three eight-line stanzas whose long public lines contract into repeated mourning.`, ["poetry-foundation-captain"])] },
  ],
  formAndMeter: [p(`The poem uses three eight-line stanzas whose long public lines contract into repeated mourning.`, ["poetry-foundation-captain"]), excerpt(`O Captain! my Captain! our fearful trip is done,
The ship has weather’d every rack, the prize we sought is won,
The port is near, the bells I hear, the people all exulting,`)],
  literaryDevices: [
    { device: "Imagery and contrast", blocks: [excerpt(`O Captain! my Captain! our fearful trip is done,
The ship has weather’d every rack, the prize we sought is won,
The port is near, the bells I hear, the people all exulting,`), p("Concrete images turn the poem’s central abstraction into a memorable scene.")] },
    { device: "Repetition and sound", blocks: [excerpt(`But I with mournful tread,
Walk the deck my Captain lies,
Fallen cold and dead.`), p("Repetition and patterned sound give the argument emotional force and shape the reader’s pace.")] },
  ],
  historicalContext: [p("The work belongs to the public-domain period identified by its first publication year. Its historical setting and literary conventions inform the interpretation without replacing close reading.", ["loc-captain"]), p(`The poem uses three eight-line stanzas whose long public lines contract into repeated mourning.`, ["poetry-foundation-captain"])],
  citations: [
    { id: "loc-captain", source: "Library of Congress", author: "Library of Congress", quote: "Walt Whitman wrote this poem for the death of Abraham Lincoln in 1865.", url: "https://loc.gov/loc/lcib/970609/captain.html" },
    { id: "poetry-foundation-captain", source: "The Poetry Foundation", author: "Walt Whitman", quote: "Fallen cold and dead.", url: "https://www.poetryfoundation.org/poems/45474/o-captain-my-captain" },
    { id: "o-captain-my-captain-full-text", source: "Public-domain full text", url: "https://www.poetryfoundation.org/poems/45474/o-captain-my-captain" },
    { id: "o-captain-my-captain-form", source: "Poem text and formal analysis", url: "https://www.poetryfoundation.org/poems/45474/o-captain-my-captain" },
  ],
  criticalViews: [{ citeId: "loc-captain" }, { citeId: "poetry-foundation-captain" }],
  faqs: [
    { q: "What is the main meaning of O Captain! My Captain!?", plain: "The poem’s meaning emerges from its central images, its treatment of change or conflict, and the relationship between the speaker and the world." },
    { q: "What are the main themes in O Captain! My Captain!?", plain: "Its main themes include interpretation, human experience, and the way poetic form gives those concerns shape." },
    { q: "What form does O Captain! My Captain! use?", plain: "The poem’s form is described in the analysis above; meter, lineation, repetition, and sound all contribute to its effect." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

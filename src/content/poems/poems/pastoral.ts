import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const pastoralPoem: PoemAnalysisContent = {
  slug: "pastoral",
  status: "ready",
  poemTitle: "Pastoral",
  author: "William Carlos Williams",
  yearPublished: 1917,
  publicDomainBasis: "First published in 1917, before 1931; the original work is public domain in the United States.",
  title: "Pastoral Analysis & Meaning — William Carlos Williams — lyriic",
  description: "Pastoral analysis and meaning: explore its themes, form, imagery, and interpretation.",
  h1: "Pastoral analysis",
  intro: "This Pastoral analysis explains its meaning, themes, form, and major literary devices.",
  fullTextSource: { label: "Full text of Pastoral", url: "https://www.gutenberg.org/files/51997/51997-0.txt", publisher: "Public-domain text" },
  editorSettings: poemOpenSettings(),
  summary: [p(`Williams relocates the pastoral from ideal countryside to an urban pavement. Sparrows, a gutter worker, and a minister become subjects for a poem about ordinary value.`, ["poemanalysis-pastoral"]), excerpt(`The little sparrows
hop ingenuously
about the pavement`)],
  meaning: [p(`The poem reverses social and poetic hierarchy. Useful labor appears more majestic than ceremony, while the ending preserves astonishment instead of a final doctrine.`, ["gutenberg-pastoral"]), excerpt(`his tread
is more majestic than
that of the Episcopal minister`)],
  themes: [
    { theme: "Meaning and interpretation", blocks: [p(`The poem reverses social and poetic hierarchy. Useful labor appears more majestic than ceremony, while the ending preserves astonishment instead of a final doctrine.`, ["poemanalysis-pastoral"])] },
    { theme: "Form and language", blocks: [p(`This is a single-stanza free-verse poem whose short lines and enjambment control pace and emphasis.`, ["gutenberg-pastoral"])] },
  ],
  formAndMeter: [p(`This is a single-stanza free-verse poem whose short lines and enjambment control pace and emphasis.`, ["gutenberg-pastoral"]), excerpt(`The little sparrows
hop ingenuously
about the pavement`)],
  literaryDevices: [
    { device: "Imagery and contrast", blocks: [excerpt(`The little sparrows
hop ingenuously
about the pavement`), p("Concrete images turn the poem’s central abstraction into a memorable scene.")] },
    { device: "Repetition and sound", blocks: [excerpt(`his tread
is more majestic than
that of the Episcopal minister`), p("Repetition and patterned sound give the argument emotional force and shape the reader’s pace.")] },
  ],
  historicalContext: [p("The work belongs to the public-domain period identified by its first publication year. Its historical setting and literary conventions inform the interpretation without replacing close reading.", ["poemanalysis-pastoral"]), p(`This is a single-stanza free-verse poem whose short lines and enjambment control pace and emphasis.`, ["gutenberg-pastoral"])],
  citations: [
    { id: "poemanalysis-pastoral", source: "Poem Analysis", author: "Poem Analysis Editorial Team", quote: "Williams uses it to describe an American street.", url: "https://poemanalysis.com/william-carlos-williams/pastoral/" },
    { id: "gutenberg-pastoral", source: "Project Gutenberg", author: "William Carlos Williams", quote: "These things astonish me beyond words.", url: "https://www.gutenberg.org/files/51997/51997-0.txt" },
    { id: "pastoral-full-text", source: "Public-domain full text", url: "https://www.gutenberg.org/files/51997/51997-0.txt" },
    { id: "pastoral-form", source: "Poem text and formal analysis", url: "https://www.gutenberg.org/files/51997/51997-0.txt" },
  ],
  criticalViews: [{ citeId: "poemanalysis-pastoral" }, { citeId: "gutenberg-pastoral" }],
  faqs: [
    { q: "What is the main meaning of Pastoral?", plain: "The poem’s meaning emerges from its central images, its treatment of change or conflict, and the relationship between the speaker and the world." },
    { q: "What are the main themes in Pastoral?", plain: "Its main themes include interpretation, human experience, and the way poetic form gives those concerns shape." },
    { q: "What form does Pastoral use?", plain: "The poem’s form is described in the analysis above; meter, lineation, repetition, and sound all contribute to its effect." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const odeOnAGrecianUrnPoem: PoemAnalysisContent = {
  slug: "ode-on-a-grecian-urn",
  status: "ready",
  poemTitle: "Ode on a Grecian Urn",
  author: "John Keats",
  yearPublished: 1820,
  publicDomainBasis: "First published in 1820, before 1931; the original work is public domain in the United States.",
  title: "Ode on a Grecian Urn Analysis & Meaning — John Keats — lyriic",
  description: "Ode on a Grecian Urn analysis and meaning: explore its themes, form, imagery, and interpretation.",
  h1: "Ode on a Grecian Urn analysis",
  intro: "This Ode on a Grecian Urn analysis explains its meaning, themes, form, and major literary devices.",
  fullTextSource: { label: "Full text of Ode on a Grecian Urn", url: "https://anthology.lib.virginia.edu/work/Keats/keats-grecian", publisher: "Public-domain text" },
  editorSettings: poemMeterSettings("iambic-pentameter", { showCounts: true, showStress: true, showMeterBreaks: true, showRhymeScheme: true }),
  summary: [p(`The speaker addresses an urn whose scenes preserve music, desire, ritual, and beauty beyond human lifetimes. The figures escape decay but remain frozen in incomplete actions.`, ["uva-grecian"]), excerpt(`Heard melodies are sweet, but those unheard
Are sweeter; therefore, ye soft pipes, play on;`)],
  meaning: [p(`Keats presents art as both consolation and limitation. The final statement invites interpretation rather than closing every question about beauty and truth.`, ["grecian-urn-text"]), excerpt(`When old age shall this generation waste,
Thou shalt remain, in midst of other woe
Than ours, a friend to man,`)],
  themes: [
    { theme: "Meaning and interpretation", blocks: [p(`Keats presents art as both consolation and limitation. The final statement invites interpretation rather than closing every question about beauty and truth.`, ["uva-grecian"])] },
    { theme: "Form and language", blocks: [p(`The ode has five ten-line stanzas, predominantly iambic pentameter, and the rhyme pattern ababcdedce.`, ["grecian-urn-text"])] },
  ],
  formAndMeter: [p(`The ode has five ten-line stanzas, predominantly iambic pentameter, and the rhyme pattern ababcdedce.`, ["grecian-urn-text"]), excerpt(`Heard melodies are sweet, but those unheard
Are sweeter; therefore, ye soft pipes, play on;`)],
  literaryDevices: [
    { device: "Imagery and contrast", blocks: [excerpt(`Heard melodies are sweet, but those unheard
Are sweeter; therefore, ye soft pipes, play on;`), p("Concrete images turn the poem’s central abstraction into a memorable scene.")] },
    { device: "Repetition and sound", blocks: [excerpt(`When old age shall this generation waste,
Thou shalt remain, in midst of other woe
Than ours, a friend to man,`), p("Repetition and patterned sound give the argument emotional force and shape the reader’s pace.")] },
  ],
  historicalContext: [p("The work belongs to the public-domain period identified by its first publication year. Its historical setting and literary conventions inform the interpretation without replacing close reading.", ["uva-grecian"]), p(`The ode has five ten-line stanzas, predominantly iambic pentameter, and the rhyme pattern ababcdedce.`, ["grecian-urn-text"])],
  citations: [
    { id: "uva-grecian", source: "University of Virginia, Literature in Context", author: "University of Virginia", quote: "“Ode on a Grecian Urn” was composed in 1819 and first published anonymously in the journal Annals of the Fine Arts.", url: "https://anthology.lib.virginia.edu/work/Keats/keats-grecian" },
    { id: "grecian-urn-text", source: "University of Virginia, Literature in Context", author: "John Keats", quote: "Beauty is truth, truth beauty.", url: "https://anthology.lib.virginia.edu/work/Keats/keats-grecian" },
    { id: "ode-on-a-grecian-urn-full-text", source: "Public-domain full text", url: "https://anthology.lib.virginia.edu/work/Keats/keats-grecian" },
    { id: "ode-on-a-grecian-urn-form", source: "Poem text and formal analysis", url: "https://anthology.lib.virginia.edu/work/Keats/keats-grecian" },
  ],
  criticalViews: [{ citeId: "uva-grecian" }, { citeId: "grecian-urn-text" }],
  faqs: [
    { q: "What is the main meaning of Ode on a Grecian Urn?", plain: "The poem’s meaning emerges from its central images, its treatment of change or conflict, and the relationship between the speaker and the world." },
    { q: "What are the main themes in Ode on a Grecian Urn?", plain: "Its main themes include interpretation, human experience, and the way poetic form gives those concerns shape." },
    { q: "What form does Ode on a Grecian Urn use?", plain: "The poem’s form is described in the analysis above; meter, lineation, repetition, and sound all contribute to its effect." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const odeToSilencePoem: PoemAnalysisContent = {
  slug: "ode-to-silence",
  status: "ready",
  poemTitle: "Ode to Silence",
  author: "Edna St. Vincent Millay",
  yearPublished: 1921,
  publicDomainBasis: "First published in 1921, before 1931; the original work is public domain in the United States.",
  title: "Ode to Silence Analysis & Meaning — Edna St. Vincent Millay — lyriic",
  description: "Ode to Silence analysis and meaning: explore its themes, form, imagery, and interpretation.",
  h1: "Ode to Silence analysis",
  intro: "This Ode to Silence analysis explains its meaning, themes, form, and major literary devices.",
  fullTextSource: { label: "Full text of Ode to Silence", url: "https://www.gutenberg.org/files/59167/59167-h/59167-h.htm", publisher: "Public-domain text" },
  editorSettings: poemOpenSettings({ showCounts: true }),
  summary: [p(`The speaker searches for Silence as a lost goddess, moving through mythic temples, heaven, and the underworld. Silence promises rest but also resembles oblivion.`, ["lector-silence"]), excerpt(`Grave Silence, lovelier
Than the three loveliest maidens, what of her?
Clio, not you,`)],
  meaning: [p(`The poem’s crowded names and images enact its paradox: language pursues a condition that language cannot recover. Art approaches silence while continually making sound.`, ["gutenberg-silence"]), excerpt(`Oblivion is the name of this abode: and she is there.`)],
  themes: [
    { theme: "Meaning and interpretation", blocks: [p(`The poem’s crowded names and images enact its paradox: language pursues a condition that language cannot recover. Art approaches silence while continually making sound.`, ["lector-silence"])] },
    { theme: "Form and language", blocks: [p(`This long dramatic lyric uses irregular line lengths, repetition, mythological allusion, and shifting syntax rather than a fixed meter.`, ["gutenberg-silence"])] },
  ],
  formAndMeter: [p(`This long dramatic lyric uses irregular line lengths, repetition, mythological allusion, and shifting syntax rather than a fixed meter.`, ["gutenberg-silence"]), excerpt(`Grave Silence, lovelier
Than the three loveliest maidens, what of her?
Clio, not you,`)],
  literaryDevices: [
    { device: "Imagery and contrast", blocks: [excerpt(`Grave Silence, lovelier
Than the three loveliest maidens, what of her?
Clio, not you,`), p("Concrete images turn the poem’s central abstraction into a memorable scene.")] },
    { device: "Repetition and sound", blocks: [excerpt(`Oblivion is the name of this abode: and she is there.`), p("Repetition and patterned sound give the argument emotional force and shape the reader’s pace.")] },
  ],
  historicalContext: [p("The work belongs to the public-domain period identified by its first publication year. Its historical setting and literary conventions inform the interpretation without replacing close reading.", ["lector-silence"]), p(`This long dramatic lyric uses irregular line lengths, repetition, mythological allusion, and shifting syntax rather than a fixed meter.`, ["gutenberg-silence"])],
  citations: [
    { id: "lector-silence", source: "Lector Poemarum", author: "Lector Poemarum", quote: "This is one of Edna St. Vincent Millay’s trickier works to a modern audience.", url: "https://lectorpoemarum.livejournal.com/3202.html" },
    { id: "gutenberg-silence", source: "Project Gutenberg", author: "Edna St. Vincent Millay", quote: "Ode to Silence", url: "https://www.gutenberg.org/files/59167/59167-h/59167-h.htm" },
    { id: "ode-to-silence-full-text", source: "Public-domain full text", url: "https://www.gutenberg.org/files/59167/59167-h/59167-h.htm" },
    { id: "ode-to-silence-form", source: "Poem text and formal analysis", url: "https://www.gutenberg.org/files/59167/59167-h/59167-h.htm" },
  ],
  criticalViews: [{ citeId: "lector-silence" }, { citeId: "gutenberg-silence" }],
  faqs: [
    { q: "What is the main meaning of Ode to Silence?", plain: "The poem’s meaning emerges from its central images, its treatment of change or conflict, and the relationship between the speaker and the world." },
    { q: "What are the main themes in Ode to Silence?", plain: "Its main themes include interpretation, human experience, and the way poetic form gives those concerns shape." },
    { q: "What form does Ode to Silence use?", plain: "The poem’s form is described in the analysis above; meter, lineation, repetition, and sound all contribute to its effect." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

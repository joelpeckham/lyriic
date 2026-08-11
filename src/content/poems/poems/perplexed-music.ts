import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const perplexedMusicPoem: PoemAnalysisContent = {
  slug: "perplexed-music",
  status: "ready",
  poemTitle: "Perplexed Music",
  author: "Elizabeth Barrett Browning",
  yearPublished: 1844,
  publicDomainBasis: "First published in 1844, before 1931; the original work is public domain in the United States.",
  title: "Perplexed Music Analysis & Meaning — Elizabeth Barrett Browning — lyriic",
  description: "Perplexed Music analysis and meaning: explore its themes, form, imagery, and interpretation.",
  h1: "Perplexed Music analysis",
  intro: "This Perplexed Music analysis explains its meaning, themes, form, and major literary devices.",
  fullTextSource: { label: "Full text of Perplexed Music", url: "https://en.wikisource.org/wiki/Papers_on_Literature_and_Art_%28Fuller%29/Part_II/Chapter_2", publisher: "Public-domain text" },
  editorSettings: poemMeterSettings("sonnet", { showCounts: true, showStress: true, showRhymeScheme: true }),
  summary: [p(`The poem compares experience to a musician whose difficult harmonies represent a divine order humans cannot yet hear. Angels perceive the completed cadence behind apparent discord.`, ["fuller-perplexed"]), excerpt(`Experience, like a pale musician, holds
A dulcimer of patience in his hand:
Whence harmonies we cannot understand`)],
  meaning: [p(`Browning does not deny suffering; she makes limited perspective central to faith. The final “SWEET” reframes pain without pretending that present notes are easy to hear.`, ["wikisource-perplexed"]), excerpt(`But angels leaning from the golden seat,
Are not so minded; their fine ear hath won
The issue of completed cadences;`)],
  themes: [
    { theme: "Meaning and interpretation", blocks: [p(`Browning does not deny suffering; she makes limited perspective central to faith. The final “SWEET” reframes pain without pretending that present notes are easy to hear.`, ["fuller-perplexed"])] },
    { theme: "Form and language", blocks: [p(`This fourteen-line sonnet-like lyric uses an octave and sestet, chiefly iambic pentameter, and a musical metaphor for meaning.`, ["wikisource-perplexed"])] },
  ],
  formAndMeter: [p(`This fourteen-line sonnet-like lyric uses an octave and sestet, chiefly iambic pentameter, and a musical metaphor for meaning.`, ["wikisource-perplexed"]), excerpt(`Experience, like a pale musician, holds
A dulcimer of patience in his hand:
Whence harmonies we cannot understand`)],
  literaryDevices: [
    { device: "Imagery and contrast", blocks: [excerpt(`Experience, like a pale musician, holds
A dulcimer of patience in his hand:
Whence harmonies we cannot understand`), p("Concrete images turn the poem’s central abstraction into a memorable scene.")] },
    { device: "Repetition and sound", blocks: [excerpt(`But angels leaning from the golden seat,
Are not so minded; their fine ear hath won
The issue of completed cadences;`), p("Repetition and patterned sound give the argument emotional force and shape the reader’s pace.")] },
  ],
  historicalContext: [p("The work belongs to the public-domain period identified by its first publication year. Its historical setting and literary conventions inform the interpretation without replacing close reading.", ["fuller-perplexed"]), p(`This fourteen-line sonnet-like lyric uses an octave and sestet, chiefly iambic pentameter, and a musical metaphor for meaning.`, ["wikisource-perplexed"])],
  citations: [
    { id: "fuller-perplexed", source: "Margaret Fuller, Papers on Literature and Art", author: "Margaret Fuller", quote: "She is at home in the Universe; she sees its laws; she sympathises with its motions.", url: "https://en.wikisource.org/wiki/Papers_on_Literature_and_Art_%28Fuller%29/Part_II/Chapter_2" },
    { id: "wikisource-perplexed", source: "Wikisource", author: "Elizabeth Barrett Browning", quote: "The issue of completed cadences;", url: "https://en.wikisource.org/wiki/Papers_on_Literature_and_Art_%28Fuller%29/Part_II/Chapter_2" },
    { id: "perplexed-music-full-text", source: "Public-domain full text", url: "https://en.wikisource.org/wiki/Papers_on_Literature_and_Art_%28Fuller%29/Part_II/Chapter_2" },
    { id: "perplexed-music-form", source: "Poem text and formal analysis", url: "https://en.wikisource.org/wiki/Papers_on_Literature_and_Art_%28Fuller%29/Part_II/Chapter_2" },
  ],
  criticalViews: [{ citeId: "fuller-perplexed" }, { citeId: "wikisource-perplexed" }],
  faqs: [
    { q: "What is the main meaning of Perplexed Music?", plain: "The poem’s meaning emerges from its central images, its treatment of change or conflict, and the relationship between the speaker and the world." },
    { q: "What are the main themes in Perplexed Music?", plain: "Its main themes include interpretation, human experience, and the way poetic form gives those concerns shape." },
    { q: "What form does Perplexed Music use?", plain: "The poem’s form is described in the analysis above; meter, lineation, repetition, and sound all contribute to its effect." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

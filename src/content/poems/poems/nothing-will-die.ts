import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const nothingWillDiePoem: PoemAnalysisContent = {
  slug: "nothing-will-die",
  status: "ready",
  poemTitle: "Nothing Will Die",
  author: "Alfred Lord Tennyson",
  yearPublished: 1830,
  publicDomainBasis: "First published in 1830, before 1931; the original work is public domain in the United States.",
  title: "Nothing Will Die Analysis & Meaning — Alfred Lord Tennyson — lyriic",
  description: "Nothing Will Die analysis and meaning: explore its themes, form, imagery, and interpretation.",
  h1: "Nothing Will Die analysis",
  intro: "This Nothing Will Die analysis explains its meaning, themes, form, and major literary devices.",
  fullTextSource: { label: "Full text of Nothing Will Die", url: "https://simple-poetry.com/poems/nothing-will-die-64155422380", publisher: "Public-domain text" },
  editorSettings: poemOpenSettings({ showCounts: true }),
  summary: [p(`The speaker asks when streams, wind, clouds, and the heart will tire. The emphatic answer is never: existence persists through recurring change.`, ["nothing-will-die-analysis"]), excerpt(`Never, O, never, nothing will die;
The stream flows,
The wind blows,`)],
  meaning: [p(`Winter and dryness are real, but they are temporary states within a regenerative cycle. The poem imagines transformation rather than annihilation.`, ["nothing-will-die-text"]), excerpt(`Nothing was born;
Nothing will die;
All things will change.`)],
  themes: [
    { theme: "Meaning and interpretation", blocks: [p(`Winter and dryness are real, but they are temporary states within a regenerative cycle. The poem imagines transformation rather than annihilation.`, ["nothing-will-die-analysis"])] },
    { theme: "Form and language", blocks: [p(`The poem’s irregular line lengths, refrain, and parallel syntax make its argument sound like a chant.`, ["nothing-will-die-text"])] },
  ],
  formAndMeter: [p(`The poem’s irregular line lengths, refrain, and parallel syntax make its argument sound like a chant.`, ["nothing-will-die-text"]), excerpt(`Never, O, never, nothing will die;
The stream flows,
The wind blows,`)],
  literaryDevices: [
    { device: "Imagery and contrast", blocks: [excerpt(`Never, O, never, nothing will die;
The stream flows,
The wind blows,`), p("Concrete images turn the poem’s central abstraction into a memorable scene.")] },
    { device: "Repetition and sound", blocks: [excerpt(`Nothing was born;
Nothing will die;
All things will change.`), p("Repetition and patterned sound give the argument emotional force and shape the reader’s pace.")] },
  ],
  historicalContext: [p("The work belongs to the public-domain period identified by its first publication year. Its historical setting and literary conventions inform the interpretation without replacing close reading.", ["nothing-will-die-analysis"]), p(`The poem’s irregular line lengths, refrain, and parallel syntax make its argument sound like a chant.`, ["nothing-will-die-text"])],
  citations: [
    { id: "nothing-will-die-analysis", source: "Poem Analysis", author: "Poem Analysis editors", quote: "The final lines act as a summary of the speaker’s beliefs.", url: "https://poemanalysis.com/alfred-tennyson/nothing-will-die/" },
    { id: "nothing-will-die-text", source: "Simple Poetry", author: "Alfred Lord Tennyson", quote: "Nothing will die; all things will change.", url: "https://simple-poetry.com/poems/nothing-will-die-64155422380" },
    { id: "nothing-will-die-full-text", source: "Public-domain full text", url: "https://simple-poetry.com/poems/nothing-will-die-64155422380" },
    { id: "nothing-will-die-form", source: "Poem text and formal analysis", url: "https://simple-poetry.com/poems/nothing-will-die-64155422380" },
  ],
  criticalViews: [{ citeId: "nothing-will-die-analysis" }, { citeId: "nothing-will-die-text" }],
  faqs: [
    { q: "What is the main meaning of Nothing Will Die?", plain: "The poem’s meaning emerges from its central images, its treatment of change or conflict, and the relationship between the speaker and the world." },
    { q: "What are the main themes in Nothing Will Die?", plain: "Its main themes include interpretation, human experience, and the way poetic form gives those concerns shape." },
    { q: "What form does Nothing Will Die use?", plain: "The poem’s form is described in the analysis above; meter, lineation, repetition, and sound all contribute to its effect." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

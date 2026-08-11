import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const newHampshirePoem: PoemAnalysisContent = {
  slug: "new-hampshire",
  status: "ready",
  poemTitle: "New Hampshire",
  author: "Robert Frost",
  yearPublished: 1923,
  publicDomainBasis: "First published in 1923, before 1931; the original work is public domain in the United States.",
  title: "New Hampshire Analysis & Meaning — Robert Frost — lyriic",
  description: "New Hampshire analysis and meaning: explore its themes, form, imagery, and interpretation.",
  h1: "New Hampshire analysis",
  intro: "This New Hampshire analysis explains its meaning, themes, form, and major literary devices.",
  fullTextSource: { label: "Full text of New Hampshire", url: "https://en.wikisource.org/wiki/New_Hampshire,_a_Poem_with_Notes_and_Grace_Notes", publisher: "Public-domain text" },
  editorSettings: poemOpenSettings({ showCounts: true }),
  summary: [p(`The long title poem contrasts New Hampshire with people who advertise their states, resources, and ideas. Frost presents local value as something not available in commercial quantities.`, ["atlantic-new-hampshire"]), excerpt(`Just specimens is all New Hampshire has,
One each of everything as in a show-case
Which naturally she doesn’t care to sell.`)],
  meaning: [p(`The poem’s anti-commercial stance is knowingly contradictory: its wit and descriptions also sell the reader on the state. Its final rest is a temporary decision, not an escape from judgment.`, ["mccord-new-hampshire"]), excerpt(`It’s restful to arrive at a decision,
And restful just to think about New Hampshire.`)],
  themes: [
    { theme: "Meaning and interpretation", blocks: [p(`The poem’s anti-commercial stance is knowingly contradictory: its wit and descriptions also sell the reader on the state. Its final rest is a temporary decision, not an escape from judgment.`, ["atlantic-new-hampshire"])] },
    { theme: "Form and language", blocks: [p(`New Hampshire uses loose blank verse with conversational variation. Its anecdotes, catalogues, and jokes create a discursive regional portrait.`, ["mccord-new-hampshire"])] },
  ],
  formAndMeter: [p(`New Hampshire uses loose blank verse with conversational variation. Its anecdotes, catalogues, and jokes create a discursive regional portrait.`, ["mccord-new-hampshire"]), excerpt(`Just specimens is all New Hampshire has,
One each of everything as in a show-case
Which naturally she doesn’t care to sell.`)],
  literaryDevices: [
    { device: "Imagery and contrast", blocks: [excerpt(`Just specimens is all New Hampshire has,
One each of everything as in a show-case
Which naturally she doesn’t care to sell.`), p("Concrete images turn the poem’s central abstraction into a memorable scene.")] },
    { device: "Repetition and sound", blocks: [excerpt(`It’s restful to arrive at a decision,
And restful just to think about New Hampshire.`), p("Repetition and patterned sound give the argument emotional force and shape the reader’s pace.")] },
  ],
  historicalContext: [p("The work belongs to the public-domain period identified by its first publication year. Its historical setting and literary conventions inform the interpretation without replacing close reading.", ["atlantic-new-hampshire"]), p(`New Hampshire uses loose blank verse with conversational variation. Its anecdotes, catalogues, and jokes create a discursive regional portrait.`, ["mccord-new-hampshire"])],
  citations: [
    { id: "atlantic-new-hampshire", source: "The Atlantic", author: "M. A. DeWolfe Howe", quote: "‘New Hampshire’ is the longest single poem in the book.", url: "https://www.theatlantic.com/magazine/archive/1924/01/new-hampshire-a-poem-with-notes-and-grace-notes/648653/" },
    { id: "mccord-new-hampshire", source: "Boston Evening Transcript review", author: "David Thomas Watson McCord", quote: "Mr. Frost has set his main theme in the blank verse which he fashions so adroitly.", url: "https://perscribo.com/NewHampshire/McCordReview.html" },
    { id: "new-hampshire-full-text", source: "Public-domain full text", url: "https://en.wikisource.org/wiki/New_Hampshire,_a_Poem_with_Notes_and_Grace_Notes" },
    { id: "new-hampshire-form", source: "Poem text and formal analysis", url: "https://en.wikisource.org/wiki/New_Hampshire,_a_Poem_with_Notes_and_Grace_Notes" },
  ],
  criticalViews: [{ citeId: "atlantic-new-hampshire" }, { citeId: "mccord-new-hampshire" }],
  faqs: [
    { q: "What is the main meaning of New Hampshire?", plain: "The poem’s meaning emerges from its central images, its treatment of change or conflict, and the relationship between the speaker and the world." },
    { q: "What are the main themes in New Hampshire?", plain: "Its main themes include interpretation, human experience, and the way poetic form gives those concerns shape." },
    { q: "What form does New Hampshire use?", plain: "The poem’s form is described in the analysis above; meter, lineation, repetition, and sound all contribute to its effect." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

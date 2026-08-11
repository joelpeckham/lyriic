import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const paulReveresRidePoem: PoemAnalysisContent = {
  slug: "paul-reveres-ride",
  status: "ready",
  poemTitle: "Paul Revere’s Ride",
  author: "Henry Wadsworth Longfellow",
  yearPublished: 1860,
  publicDomainBasis: "First published in 1860, before 1931; the original work is public domain in the United States.",
  title: "Paul Revere’s Ride Analysis & Meaning — Henry Wadsworth Longfellow — lyriic",
  description: "Paul Revere’s Ride analysis and meaning: explore its themes, form, imagery, and interpretation.",
  h1: "Paul Revere’s Ride analysis",
  intro: "This Paul Revere’s Ride analysis explains its meaning, themes, form, and major literary devices.",
  fullTextSource: { label: "Full text of Paul Revere’s Ride", url: "https://en.wikisource.org/wiki/Paul_Revere%27s_Ride", publisher: "Public-domain text" },
  editorSettings: poemOpenSettings({ showCounts: true }),
  summary: [p(`Longfellow turns a Revolutionary warning into a national myth. The ride becomes a story about civic attention, courage, and the transmission of memory.`, ["nps-revere"]), excerpt(`Listen, my children, and you shall hear
Of the midnight ride of Paul Revere,
On the eighteenth of April, in Seventy-five;`)],
  meaning: [p(`The poem is powerful as symbolic history, not as a complete factual account. Its galloping rhythm and final prophecy make Revere an emblem of action in national danger.`, ["wikisource-revere"]), excerpt(`The fate of a nation was riding that night;
And the spark struck out by that steed, in his flight,
Kindled the land into flame with its heat.`)],
  themes: [
    { theme: "Meaning and interpretation", blocks: [p(`The poem is powerful as symbolic history, not as a complete factual account. Its galloping rhythm and final prophecy make Revere an emblem of action in national danger.`, ["nps-revere"])] },
    { theme: "Form and language", blocks: [p(`The narrative uses irregular stanzas, steady rhyme, direct address, and predominantly anapestic, galloping movement.`, ["wikisource-revere"])] },
  ],
  formAndMeter: [p(`The narrative uses irregular stanzas, steady rhyme, direct address, and predominantly anapestic, galloping movement.`, ["wikisource-revere"]), excerpt(`Listen, my children, and you shall hear
Of the midnight ride of Paul Revere,
On the eighteenth of April, in Seventy-five;`)],
  literaryDevices: [
    { device: "Imagery and contrast", blocks: [excerpt(`Listen, my children, and you shall hear
Of the midnight ride of Paul Revere,
On the eighteenth of April, in Seventy-five;`), p("Concrete images turn the poem’s central abstraction into a memorable scene.")] },
    { device: "Repetition and sound", blocks: [excerpt(`The fate of a nation was riding that night;
And the spark struck out by that steed, in his flight,
Kindled the land into flame with its heat.`), p("Repetition and patterned sound give the argument emotional force and shape the reader’s pace.")] },
  ],
  historicalContext: [p("The work belongs to the public-domain period identified by its first publication year. Its historical setting and literary conventions inform the interpretation without replacing close reading.", ["nps-revere"]), p(`The narrative uses irregular stanzas, steady rhyme, direct address, and predominantly anapestic, galloping movement.`, ["wikisource-revere"])],
  citations: [
    { id: "nps-revere", source: "National Park Service", author: "Longfellow House Washington’s Headquarters National Historic Site", quote: "Though based on historic events, the poem should be read as a myth or tale, not as a historical account.", url: "https://www.nps.gov/long/learn/historyculture/paul-reveres-ride.htm" },
    { id: "wikisource-revere", source: "Wikisource", author: "Henry Wadsworth Longfellow", quote: "A cry of defiance, and not of fear,", url: "https://en.wikisource.org/wiki/Paul_Revere%27s_Ride" },
    { id: "paul-reveres-ride-full-text", source: "Public-domain full text", url: "https://en.wikisource.org/wiki/Paul_Revere%27s_Ride" },
    { id: "paul-reveres-ride-form", source: "Poem text and formal analysis", url: "https://en.wikisource.org/wiki/Paul_Revere%27s_Ride" },
  ],
  criticalViews: [{ citeId: "nps-revere" }, { citeId: "wikisource-revere" }],
  faqs: [
    { q: "What is the main meaning of Paul Revere’s Ride?", plain: "The poem’s meaning emerges from its central images, its treatment of change or conflict, and the relationship between the speaker and the world." },
    { q: "What are the main themes in Paul Revere’s Ride?", plain: "Its main themes include interpretation, human experience, and the way poetic form gives those concerns shape." },
    { q: "What form does Paul Revere’s Ride use?", plain: "The poem’s form is described in the analysis above; meter, lineation, repetition, and sound all contribute to its effect." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

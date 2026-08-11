import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const iTooSingAmericaPoem: PoemAnalysisContent = {
  slug: "i-too-sing-america", status: "ready", poemTitle: "I, Too, Sing America", author: "Langston Hughes", yearPublished: 1926,
  publicDomainBasis: "First published in The Weary Blues in 1926, before the US public-domain cutoff.",
  title: "I, Too, Sing America Analysis & Meaning — Langston Hughes — lyriic",
  description: "Hughes analysis of belonging, segregation, the kitchen and table, free verse, and equality.",
  h1: "I, Too, Sing America analysis", intro: "This analysis follows Hughes’s speaker from enforced exclusion toward an undeniable claim on America.",
  fullTextSource: { label: "I, Too", url: "https://www.poetryfoundation.org/poems/47558/i-too", publisher: "Poetry Foundation" },
  editorSettings: poemOpenSettings(),
  summary: [
    p("The speaker calls himself America’s “darker brother,” describes being sent to the kitchen, and predicts a place at the table.", ["hughes-i-too-context"]),
    excerpt(`I, too, sing America.

I am the darker brother.
They send me to eat in the kitchen`),
    p("The ending changes a song into a national identity: “I, too, am America.”", ["hughes-i-too-context"]),
  ],
  meaning: [
    p("The poem treats belonging as a fact racism can deny socially but cannot erase. “Too” expands the authorized national voice.", ["hughes-i-too-context"]),
    excerpt(`Tomorrow,
I’ll be at the table
When company comes.`),
    p("The kitchen and table make segregation physically visible, while “tomorrow” promises equality as a change in social order.", ["hughes-i-too-context"]),
  ],
  themes: [
    { theme: "American belonging", blocks: [p("Repeated first-person claims make Black identity part of the national voice.")] },
    { theme: "Segregation and equality", blocks: [p("The kitchen represents enforced separation; the table represents shared citizenship.")] },
    { theme: "Strength and self-respect", blocks: [p("The speaker laughs, eats well, and grows strong while excluded.")] },
  ],
  formAndMeter: [
    p("The poem uses short free-verse lines and uneven units rather than a fixed meter or rhyme scheme.", ["hughes-i-too-form"]),
    p("Repetition, pauses, and the return of “When company comes” organize the speech; the ending alters the opening from singing America to being America.", ["hughes-i-too-context"]),
  ],
  literaryDevices: [
    { device: "Allusion", blocks: [excerpt(`I, too, sing America.`), p("The opening answers Whitman’s “I Hear America Singing” by adding a voice that exclusion hides.", ["hughes-i-too-context"])] },
    { device: "Extended metaphor", blocks: [excerpt(`They send me to eat in the kitchen
When company comes,`), p("A household dining arrangement becomes an image of national segregation.")] },
    { device: "Repetition", blocks: [excerpt(`When company comes.
Nobody’ll dare`), p("The recurring phrase frames a changed future.")] },
  ],
  historicalContext: [
    p("Hughes published “I, Too” in The Weary Blues in 1926, during the Harlem Renaissance.", ["hughes-i-too-context"]),
    p("Benjamin Voigt describes the poem as a reckoning with Whitman and an imaginative claim to an equal place at the table.", ["hughes-i-too-context"]),
  ],
  citations: [
    { id: "hughes-i-too-text", source: "Poetry Foundation", url: "https://www.poetryfoundation.org/poems/47558/i-too" },
    { id: "hughes-i-too-context", source: "Poetry Foundation", quote: "“I, Too” repurposes Whitman’s demotic language and democratic I to do what Whitman could not: imagine a truly equal place at the table for “the darker brother.”", url: "https://www.poetryfoundation.org/articles/88972/langston-hughes-101" },
    { id: "hughes-i-too-form", source: "LitCharts", quote: "The poem portrays American racism as experienced by a black man.", url: "https://www.litcharts.com/poetry/langston-hughes/i-too" },
    { id: "hughes-i-too-history", source: "American Literature", quote: "I, Too, Sing America is a declaration of belonging by an African American speaker", url: "https://americanliterature.com/author/langston-hughes/poem/i-too-sing-america" },
  ],
  criticalViews: [{ citeId: "hughes-i-too-context" }, { citeId: "hughes-i-too-history" }],
  faqs: [
    { q: "What is the poem’s meaning?", plain: "It asserts that Black Americans belong fully to the nation despite racist exclusion." },
    { q: "What does the kitchen symbolize?", plain: "The kitchen symbolizes segregation and enforced invisibility; the table symbolizes equality." },
    { q: "What form does it use?", plain: "Short, conversational free verse organized by repetition, pauses, and tense shifts." },
  ],
  cta: "Write with this poem’s open form in the editor",
};

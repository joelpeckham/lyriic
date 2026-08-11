import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const theRoadNotTakenPoem: PoemAnalysisContent = {
  slug: "the-road-not-taken", status: "ready", poemTitle: "The Road Not Taken", author: "Robert Frost", yearPublished: 1916,
  publicDomainBasis: "First published in 1915 and collected in 1916, before the US public-domain cutoff.",
  title: "The Road Not Taken Analysis & Meaning — Robert Frost — lyriic", description: "The Road Not Taken analysis: choice, irony, regret, hindsight, form, and meaning.", h1: "The Road Not Taken analysis",
  intro: "Frost’s famous choice poem is less simple advice than an unsettled meditation on similar alternatives and retrospective storytelling.",
  fullTextSource: { label: "The Road Not Taken", url: "https://www.poetryfoundation.org/poems/44272/the-road-not-taken", publisher: "Poetry Foundation" },
  editorSettings: poemMeterSettings("iambic-tetrameter", { showCounts: true, showStress: true, showMeterBreaks: true, showRhymeScheme: true }),
  summary: [p("A traveler reaches two roads and chooses one, while admitting that the paths were worn about the same. The final stanza imagines a future retelling that gives the choice a “difference.”"), excerpt(`Two roads diverged in a yellow wood,
And sorry I could not travel both
And be one traveler, long I stood`), p("The poem’s tension lies between the uncertain scene and the confident story later told about it.", ["road-foundation"])],
  meaning: [p("It is not simply an instruction to choose an unconventional path. The speaker’s own evidence undercuts the claim that one road was less traveled.", ["road-foundation"]), excerpt(`Though as for that the passing there
Had worn them really about the same,`), p("The “sigh” can hold regret, satisfaction, or self-dramatization. Frost leaves the emotional meaning unresolved.", ["road-poets"])],
  themes: [
    { theme: "Choice and irreversibility", blocks: [p("One way leads to another, making return and direct knowledge of the alternative unlikely.")] },
    { theme: "Hindsight", blocks: [p("A later narrative turns an uncertain impulse into a meaningful life story.", ["road-foundation"])] },
    { theme: "Regret and ambiguity", blocks: [excerpt(`I shall be telling this with a sigh
Somewhere ages and ages hence:`), p("The sigh refuses a single emotional interpretation.")] },
  ],
  formAndMeter: [p("The poem has four five-line stanzas and an ABAAB rhyme scheme in each stanza."), p("Its base is iambic tetrameter, varied toward conversational speech; the long opening sentence mirrors deliberation.", ["road-foundation"])],
  literaryDevices: [
    { device: "Extended metaphor", blocks: [excerpt(`Two roads diverged in a yellow wood,`), p("The fork becomes a metaphor for life alternatives while remaining an ordinary, uncertain scene.")] },
    { device: "Irony", blocks: [excerpt(`I took the one less traveled by,`), p("The famous claim conflicts with the earlier admission that the roads were about the same.")] },
    { device: "Repetition", blocks: [excerpt(`And be one traveler`), p("Repeated “and” and “I” make the speaker’s thought circle and divide.")] },
  ],
  historicalContext: [p("Frost wrote the poem in 1915; it appeared in Mountain Interval in 1916. He wrote it as a joke for Edward Thomas, whose indecision on walks inspired the speaker."), p("The Poetry Foundation records Frost’s complaint that readers took the poem seriously despite his intended mock sigh.", ["road-foundation"])],
  citations: [
    { id: "road-text", source: "Poetry Foundation", url: "https://www.poetryfoundation.org/poems/44272/the-road-not-taken" },
    { id: "road-foundation", source: "Poetry Foundation", author: "William Pritchard", url: "https://www.poetryfoundation.org/articles/89511/robert-frost-the-road-not-taken", quote: "choosing one rather than the other was a matter of impulse" },
    { id: "road-poets", source: "Academy of American Poets", author: "Mark Richardson", url: "https://poets.org/text/road-not-taken-poem-everyone-loves-and-everyone-gets-wrong", quote: "Which road, after all, is the road “not taken”?" },
    { id: "road-context", source: "Poetry Foundation", url: "https://www.poetryfoundation.org/articles/89511/robert-frost-the-road-not-taken" },
  ],
  criticalViews: [{ citeId: "road-foundation" }, { citeId: "road-poets" }],
  faqs: [
    { q: "What is the main meaning?", plain: "It explores uncertain choices and the stories people create about them afterward." },
    { q: "Is it advice to take the less-traveled road?", plain: "Not simply: the poem says the roads were really about the same." },
    { q: "Why does the speaker sigh?", plain: "The sigh is deliberately ambiguous, possibly regretful, satisfied, wistful, or theatrical." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

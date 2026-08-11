import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const theRavenPoem: PoemAnalysisContent = {
  slug: "the-raven", status: "ready", poemTitle: "The Raven", author: "Edgar Allan Poe", yearPublished: 1845,
  publicDomainBasis: "First published in 1845, before the US public-domain cutoff.",
  title: "The Raven Analysis & Meaning — Edgar Allan Poe — lyriic", description: "The Raven analysis: grief, Lenore, Nevermore, sound, form, meter, and symbolism.", h1: "The Raven analysis",
  intro: "Poe’s tightly patterned narrative turns a grieving speaker’s questions into an escalating encounter with the word “Nevermore.”",
  fullTextSource: { label: "The Raven", url: "https://www.poetryfoundation.org/poems/48860/the-raven", publisher: "Poetry Foundation" },
  editorSettings: poemMeterSettings("trochaic-octameter", { showCounts: true, showStress: true, showMeterBreaks: true, showRhymeScheme: true }),
  summary: [p("On a bleak December night, a grieving speaker hears tapping, opens the window, and admits a raven. The bird perches above the chamber door and answers every question with one word."), excerpt(`Once upon a midnight dreary, while I pondered, weak and weary,
Over many a quaint and curious volume of forgotten lore—`), p("The speaker gradually loads “Nevermore” with meanings about Lenore, relief, and the afterlife, until the bird becomes an image of permanent grief.", ["raven-form"])],
  meaning: [p("The poem presents grief as an interpretive loop. The bird may have learned one word from a former master, but the speaker supplies its increasingly painful meanings.", ["raven-analysis"]), excerpt(`Quoth the Raven “Nevermore.”
Much I marvelled this ungainly fowl to hear discourse so plainly,`), p("By the final stanza, the refrain sounds less like an external prophecy than the speaker’s conclusion that sorrow will outlast him.", ["raven-analysis"])],
  themes: [
    { theme: "Grief and memory", blocks: [p("Books cannot provide “surcease of sorrow”; memory of Lenore keeps returning.")] },
    { theme: "Loss of hope", blocks: [excerpt(`Is there—is there balm in Gilead?—tell me—tell me, I implore!
Quoth the Raven “Nevermore.”`), p("Each question makes the repeated answer more final.")] },
    { theme: "Psychology and the supernatural", blocks: [p("The raven can be supernatural, psychological, or both; its fixed word becomes terrifying through the speaker’s interpretation.")] },
  ],
  formAndMeter: [p("The poem has eighteen six-line stanzas, traditionally using an ABCBBB rhyme pattern."), p("Its long lines are commonly described as trochaic octameter, varied by pauses, catalexis, internal rhyme, and shortened refrains.", ["raven-form"])],
  literaryDevices: [
    { device: "Internal rhyme", blocks: [excerpt(`Once upon a midnight dreary, while I pondered, weak and weary,`), p("Rhyme inside the line creates musical pressure before the end rhyme.")] },
    { device: "Alliteration", blocks: [excerpt(`While I nodded, nearly napping, suddenly there came a tapping,`), p("Repeated consonants make the anxious scene audible.")] },
    { device: "Refrain", blocks: [excerpt(`Quoth the Raven “Nevermore.”`), p("The same word changes meaning according to the speaker’s question.")] },
  ],
  historicalContext: [p("Poe first published the poem in 1845 in The Raven and Other Poems. Its public-domain status permits short verse excerpts here."), p("Poe’s essay “The Philosophy of Composition” discusses melancholy, refrain, and intended unity of effect, though readers need not accept the essay as a complete account of composition.", ["raven-analysis"])],
  citations: [
    { id: "raven-text", source: "Poetry Foundation", url: "https://www.poetryfoundation.org/poems/48860/the-raven" },
    { id: "raven-form", source: "University of Iowa Pressbooks", author: "LeDavid Olmstead", url: "https://pressbooks.uiowa.edu/poetales/chapter/ledavid-olmstead-main-text/", quote: "“The Raven” is a ballad utilizing trochaic octameter ... It also follows the ABCBBB rhyme scheme." },
    { id: "raven-analysis", source: "Poem Analysis", url: "https://poemanalysis.com/edgar-allan-poe/the-raven/", quote: "‘The Raven’ by Edgar Allan Poe is a ballad of eighteen six-line stanzas." },
    { id: "raven-poetry", source: "Poetry Foundation", url: "https://www.poetryfoundation.org/poems/48860/the-raven" },
  ],
  criticalViews: [{ citeId: "raven-form" }, { citeId: "raven-analysis" }],
  faqs: [
    { q: "What is the meaning of The Raven?", plain: "It shows a grieving speaker turning one repeated word into a verdict that loss and loneliness will never end." },
    { q: "Who is Lenore?", plain: "Lenore is the speaker’s deceased beloved and the emotional center of his questions." },
    { q: "What does Nevermore mean?", plain: "Its meaning grows from a learned word into the speaker’s imagined answer about grief, relief, and reunion." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const aDreamWithinADreamPoem: PoemAnalysisContent = {
  slug: "a-dream-within-a-dream", status: "ready", poemTitle: "A Dream Within a Dream", author: "Edgar Allan Poe", yearPublished: 1849,
  publicDomainBasis: "First published in 1849, before the US public-domain cutoff.",
  title: "A Dream Within a Dream Analysis & Meaning — Edgar Allan Poe — lyriic",
  description: "Analysis of Poe’s A Dream Within a Dream: reality, loss, impermanence, imagery, and form.",
  h1: "A Dream Within a Dream analysis",
  intro: "Poe’s poem moves from farewell to shoreline, turning grief into a question about reality and loss.",
  fullTextSource: { label: "A Dream Within a Dream", url: "https://en.wikisource.org/wiki/The_Works_of_the_Late_Edgar_Allan_Poe_(1859)/Volume_2/A_Dream_within_a_Dream", publisher: "Wikisource" },
  editorSettings: poemOpenSettings({ showCounts: true }),
  summary: [p("The speaker says goodbye while wondering whether life and hope have been dreamlike. The second stanza makes that uncertainty physical: golden sand slips through his hands on a surf-tormented shore."), excerpt(`Take this kiss upon the brow!
And, in parting from you now,
Thus much let me avow—`), p("The refrain returns as a question, so the speaker’s initial claim becomes less secure.", ["dream-analysis"])],
  meaning: [p("The poem does not prove that reality is unreal. It shows instead that loss remains painful even when the speaker cannot define what was real.", ["dream-analysis"]), excerpt(`Grains of the golden sand—
How few! yet how they creep
Through my fingers to the deep,`), p("The tactile image turns time, memory, and hope into something visible but impossible to hold.")],
  themes: [
    { theme: "Reality and uncertainty", blocks: [excerpt(`All that we see or seem
Is but a dream within a dream.`), p("The distinction between seeing and seeming keeps perception unresolved.")] },
    { theme: "Impermanence", blocks: [p("Hope flies away and sand moves toward the sea; emotional and material loss share one image.")] },
    { theme: "Helplessness", blocks: [excerpt(`O God! can I not grasp
Them with a tighter clasp?`), p("The urgent questions dramatize the limits of will against change.")] },
  ],
  formAndMeter: [p("The poem has two irregular stanzas of eleven and thirteen lines. Varied line lengths, dashes, questions, and rhyme create a speech-like rhythm.", ["dream-form"]), p("The repeated refrain frames both stanzas, but its final question changes assertion into doubt.")],
  literaryDevices: [
    { device: "Extended metaphor", blocks: [excerpt(`Grains of the golden sand—
How few! yet how they creep`), p("The sand gives the abstract fear of impermanence a bodily form.")] },
    { device: "Refrain", blocks: [excerpt(`Is all that we see or seem
But a dream within a dream?`), p("Repetition makes the poem circular without making it certain.")] },
    { device: "Rhetorical question", blocks: [p("Questions ask whether disappearance makes an experience less real, but no answer resolves the grief.")] },
  ],
  historicalContext: [p("The poem was published in The Flag of Our Union on March 31, 1849, during Poe’s final year. Mabbott describes the mature version as distinct from earlier poems that supplied related ideas.", ["dream-history"]), excerpt(`I stand amid the roar
Of a surf-tormented shore,`), p("Poe’s editorial history matters because the poem’s final form develops an earlier theme into a more complicated meditation.")],
  citations: [
    { id: "dream-text", source: "Wikisource", url: "https://en.wikisource.org/wiki/The_Works_of_the_Late_Edgar_Allan_Poe_(1859)/Volume_2/A_Dream_within_a_Dream" },
    { id: "dream-analysis", source: "Edgar Allan Poe Society of Baltimore", author: "Thomas Ollive Mabbott", url: "https://eapoe.org/works/mabbott/tom1p104.htm", quote: "A Dream Within a Dream is a mature poem, characteristic of Poe's later years, and is based on an idea more complicated than the one that inspired the two earlier poems." },
    { id: "dream-form", source: "Edgar Allan Poe Society of Baltimore", url: "https://eapoe.org/works/mabbott/tom1p104.htm", quote: "The text used is D, not differing verbally from B." },
    { id: "dream-history", source: "Edgar Allan Poe Society of Baltimore", url: "https://eapoe.org/works/mabbott/tom1p104.htm", quote: "Boston Flag of Our Union for March 31, 1849." },
  ],
  criticalViews: [{ citeId: "dream-analysis" }, { citeId: "dream-form" }],
  faqs: [
    { q: "What is the main meaning?", plain: "The poem explores whether reality can be trusted and whether anything can be held permanently." },
    { q: "What does the sand symbolize?", plain: "It may represent time, memory, hope, or life slipping beyond human control." },
    { q: "What form does it use?", plain: "It uses two irregular stanzas, varied line lengths, rhyme, repetition, and a changing refrain." },
  ],
  cta: "Write with this poem’s rhythm in the editor",
};

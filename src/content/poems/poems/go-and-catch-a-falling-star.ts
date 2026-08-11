import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const goAndCatchAFallingStarPoem: PoemAnalysisContent = {
  slug: "go-and-catch-a-falling-star",
  status: "ready",
  poemTitle: "Song: Go and catch a falling star",
  author: "John Donne",
  yearPublished: 1633,
  publicDomainBasis: "First published in Donne's collected poems in 1633, well before the US public-domain cutoff.",
  title: "Go and Catch a Falling Star Analysis & Meaning — John Donne — lyriic",
  description: "Analysis of Donne’s witty song about impossible quests, fidelity, gender, and cynical love.",
  h1: "Go and Catch a Falling Star analysis",
  intro: "This analysis explains how Donne turns supernatural commands and a brisk song form into a bitter argument about fidelity.",
  fullTextSource: { label: "Song — full poem", url: "https://en.wikisource.org/wiki/Song:_Go_and_catch_a_falling_star", publisher: "Wikisource" },
  editorSettings: poemMeterSettings("trochaic-tetrameter", { showCounts: true, showStress: true, showMeterBreaks: true, showRhymeScheme: true }),
  summary: [
    p("The speaker orders a listener to perform impossible tasks, then asks him to search for a woman who is both true and fair.", ["donne-song-criticism"]),
    excerpt(`GO and catch a falling star,
Get with child a mandrake root,
Tell me where all past years are,`),
    p("The final stanza withdraws the apparent invitation: even if such a woman were found, she would be false before the speaker arrived.", ["donne-song-structure"]),
  ],
  meaning: [
    p("Donne makes fidelity seem less attainable than catching a star or hearing mermaids. The comic quest turns a conventional complaint about infidelity into a memorable paradox.", ["donne-song-criticism"]),
    excerpt(`And swear
No where
Lives a woman true and fair.`),
    p("The speaker’s misogynistic generalization is a historical literary posture, not a neutral account of relationships; the song’s musical confidence makes it sound persuasive.", ["donne-song-criticism"]),
  ],
  themes: [
    { theme: "Fidelity and skepticism", blocks: [p("The search for a faithful woman becomes an impossible quest, and the ending turns skepticism into a universal judgment.", ["donne-song-criticism"])] },
    { theme: "Gender and power", blocks: [p("The poem treats women’s supposed inconstancy as a conventionally gendered claim that modern readers can examine critically.", ["donne-song-criticism"])] },
    { theme: "Wonder and disillusionment", blocks: [p("Stars, mandrakes, mermaids, and a ten-thousand-day journey create marvels against which human constancy is judged.")] },
  ],
  formAndMeter: [
    p("The poem has three nine-line stanzas. Each uses ABABCC followed by a rhyming triplet, giving the argument brisk song-like momentum.", ["donne-song-structure"]),
    p("Its predominant rhythm is trochaic tetrameter; the short “And find / What wind” lines sharpen each stanza’s punchline.", ["donne-song-structure"]),
  ],
  literaryDevices: [
    { device: "Hyperbole", blocks: [excerpt(`Ride ten thousand days and nights
Till Age snow white hairs on thee;`), p("The enormous journey makes fidelity sound beyond ordinary human effort.")] },
    { device: "Imperative", blocks: [excerpt(`GO and catch a falling star`), p("The direct command gives the poem the energy of spoken banter.")] },
    { device: "Folkloric allusion", blocks: [excerpt(`Teach me to hear mermaids singing,
Or to keep off envy's stinging,`), p("Supernatural references build a catalogue of strange possibilities.")] },
    { device: "Irony", blocks: [excerpt(`Such a pilgrimage were sweet.
Yet do not; I would not go,`), p("The reversal exposes the gap between stated desire and settled disappointment.")] },
  ],
  historicalContext: [
    p("The poem was first published posthumously in 1633 in the first collected edition of Donne’s poems. Its early-modern song form supports a witty complaint about inconstancy.", ["donne-song-structure"]),
    p("The speaker’s claim belongs to a gendered literary convention and can be read both as clever rhetoric and as prejudice.", ["donne-song-criticism"]),
  ],
  citations: [
    { id: "donne-song-text", source: "Wikisource", url: "https://en.wikisource.org/wiki/Song:_Go_and_catch_a_falling_star" },
    { id: "donne-song-criticism", source: "LitCharts", quote: "The poem's rhyme scheme, relatively steady meter, and clear hyperbole make its tone feel light-hearted and satirical, but the speaker also seems to harbor genuine melancholy, bitterness, and cynicism towards women and relationships.", url: "https://www.litcharts.com/poetry/john-donne/song-go-and-catch-a-falling-star" },
    { id: "donne-song-structure", source: "Literary Theory and Criticism", quote: "John Donne enforced a tight structure on his song Go and Catch a Falling Star", url: "https://literariness.org/2020/07/08/analysis-of-john-donnes-go-and-catch-a-falling-star/" },
    { id: "donne-song-analysis", source: "Poem Analysis", url: "https://poemanalysis.com/john-donne/song-go-and-catch-a-falling-star/" },
  ],
  criticalViews: [{ citeId: "donne-song-criticism" }, { citeId: "donne-song-structure" }],
  faqs: [
    { q: "What is the poem’s main meaning?", plain: "The speaker claims that a beautiful, faithful woman is as impossible to find as a supernatural wonder, though the claim is deliberately witty and gendered." },
    { q: "What are its main themes?", plain: "Fidelity, skepticism, wonder, gender, and disillusionment shape the poem’s argument." },
    { q: "What form does it use?", plain: "It has three nine-line stanzas with ABABCC and a closing triplet, in a brisk, predominantly trochaic song rhythm." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

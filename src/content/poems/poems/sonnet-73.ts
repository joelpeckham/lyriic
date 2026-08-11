import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const sonnet73Poem: PoemAnalysisContent = {
  slug: "sonnet-73",
  status: "ready",
  poemTitle: "Sonnet 73",
  author: "William Shakespeare",
  yearPublished: 1609,
  publicDomainBasis: "Shakespeare’s Sonnets were first published in 1609 and are public domain.",
  title: "Sonnet 73 Analysis & Meaning — William Shakespeare — lyriic",
  description: "Sonnet 73 analysis of aging, mortality, autumn, twilight, fire, love, and Shakespearean sonnet form.",
  h1: "Sonnet 73 analysis",
  intro: "This Sonnet 73 analysis explains how three diminishing images turn aging into an argument for intensified love.",
  fullTextSource: { label: "Sonnet 73", url: "https://www.poetryfoundation.org/poems/45099/sonnet-73-that-time-of-year-thou-mayst-in-me-behold", publisher: "Poetry Foundation" },
  editorSettings: poemMeterSettings("sonnet", { showRhymeScheme: true, showMeterBreaks: true }),
  summary: [
    p("The speaker asks the beloved to see him as late autumn, fading twilight, and a fire nearly consumed by its own fuel.", ["sonnet73-text"]),
    excerpt(`That time of year thou mayst in me behold
When yellow leaves, or none, or few, do hang`),
    p("The final couplet turns decline into an emotional claim: awareness of approaching separation makes love stronger.", ["sonnet73-shakespeare-online"]),
  ],
  meaning: [
    p("The metaphors narrow in scale from a season to a day and then to the last glow of a fire. Mortality becomes increasingly immediate."),
    excerpt(`In me thou see’st the glowing of such fire
That on the ashes of his youth doth lie,`),
    p("The couplet makes impermanence part of love’s value. What must soon be left is cherished more carefully now.", ["sonnet73-shakespeare-online"]),
  ],
  themes: [
    { theme: "Aging and mortality", blocks: [p("Sparse leaves, vanishing light, and dying embers make bodily decline visible. “Death’s second self” joins ordinary sleep to mortality.")] },
    { theme: "Time and compression", blocks: [excerpt(`Which by and by black night doth take away,
Death’s second self, that seals up all in rest.`), p("Each quatrain measures a smaller remainder of time, compressing the speaker’s future.")] },
    { theme: "Love strengthened by loss", blocks: [p("The closing argument is paradoxical: the beloved’s knowledge of impending separation intensifies attachment.")] },
  ],
  formAndMeter: [
    p("This is a Shakespearean sonnet: three quatrains and a couplet, with ABAB CDCD EFEF GG rhyme and chiefly iambic pentameter."),
    p("The repeated “In me thou see’st” creates parallel structure, while the couplet turns image into conclusion."),
  ],
  literaryDevices: [
    { device: "Extended metaphor", blocks: [excerpt(`In me thou see’st the twilight of such day
As after sunset fadeth in the west,`), p("Autumn, twilight, and fire are successive versions of the same approach toward disappearance.")] },
    { device: "Personification", blocks: [excerpt(`Which by and by black night doth take away`), p("Night acts as an agent that removes the remaining light, giving death an unavoidable force.")] },
    { device: "Paradox", blocks: [excerpt(`This thou perceiv’st, which makes thy love more strong,
To love that well which thou must leave ere long.`), p("Weakening and approaching loss produce stronger love, making mortality emotionally productive.")] },
  ],
  historicalContext: [
    p("The sonnets appeared in the 1609 Quarto. Sonnet 73 is traditionally associated with the Fair Youth sequence, though the poems do not establish a complete biography."),
    p("The poem’s “ruin’d choirs” can evoke both bare branches and stripped church interiors, layering personal aging with cultural memory.", ["sonnet73-shakespeare-online"]),
  ],
  citations: [
    { id: "sonnet73-text", source: "Poetry Foundation", url: "https://www.poetryfoundation.org/poems/45099/sonnet-73-that-time-of-year-thou-mayst-in-me-behold" },
    { id: "sonnet73-shakespeare-online", source: "Shakespeare Online", author: "John Berryman", quote: "The fundamental emotion [in Sonnet 73] is self-pity. Not an attractive emotion. What renders it pathetic, in the good instead of the bad sense, is the sinister diminution of the time concept, quatrain by quatrain.", url: "https://www.shakespeare-online.com/sonnets/73detail.html" },
    { id: "sonnet73-ransom", source: "Shakespeare Online", author: "John Crowe Ransom", quote: "The structure is good, the three quatrains offering distinct yet equivalent figures for the time of life of the unsuccessful and to-be-pitied lover.", url: "https://www.shakespeare-online.com/sonnets/73detail.html" },
    { id: "sonnet73-wikisource", source: "Wikisource", url: "https://en.wikisource.org/wiki/Shakespeare%27s_Sonnets" },
  ],
  criticalViews: [{ citeId: "sonnet73-shakespeare-online" }, { citeId: "sonnet73-ransom" }],
  faqs: [
    { q: "What is the main meaning?", plain: "Three images of decline lead to the idea that approaching loss can make love more intense." },
    { q: "What are the three metaphors?", plain: "The speaker compares himself to late autumn, fading twilight, and a dying fire." },
    { q: "What is the form?", plain: "It is a Shakespearean sonnet in iambic pentameter with ABAB CDCD EFEF GG rhyme." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

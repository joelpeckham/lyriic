import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const sheWalksInBeautyPoem: PoemAnalysisContent = {
  slug: "she-walks-in-beauty",
  status: "ready",
  poemTitle: "She Walks in Beauty",
  author: "Lord Byron",
  yearPublished: 1815,
  publicDomainBasis: "Written in 1814 and published in Hebrew Melodies (1815), before the US public-domain cutoff.",
  title: "She Walks in Beauty Analysis & Meaning — Lord Byron — lyriic",
  description: "She Walks in Beauty analysis of Byron’s light-and-dark imagery, harmony, inner goodness, and common-meter form.",
  h1: "She Walks in Beauty analysis",
  intro: "This analysis explains how Byron joins physical beauty to inner peace through balanced images of darkness and light.",
  fullTextSource: { label: "She Walks in Beauty", url: "https://www.poetryfoundation.org/poems/43844/she-walks-in-beauty", publisher: "Poetry Foundation" },
  editorSettings: poemMeterSettings("common-meter", { showCounts: true, showStress: true, showMeterBreaks: true, showRhymeScheme: true }),
  summary: [
    p("The speaker compares a woman’s beauty to a clear, starry night, where darkness and brightness meet in a gentle balance."),
    excerpt(`She walks in beauty, like the night
Of cloudless climes and starry skies;`),
    p("The poem moves from hair, face, and color toward thought, goodness, peace, and innocent love.", ["she-walks-wikisource"]),
  ],
  meaning: [
    p("Night is not presented as an absence of beauty. Its darkness makes possible a tender light that daylight, described as “gaudy,” cannot provide."),
    excerpt(`One shade the more, one ray the less,
Had half impaired the nameless grace`),
    p("The ideal depends on proportion: either excess shade or excess brightness would damage the harmony. Appearance becomes meaningful because it seems to express a peaceful mind.", ["she-walks-poets"]),
  ],
  themes: [
    { theme: "Harmony of opposites", blocks: [p("Dark and bright, night and light, meet without canceling one another. Contrast is the condition of the poem’s ideal beauty.", ["she-walks-poets"])] },
    { theme: "Outer beauty and inner character", blocks: [excerpt(`Where thoughts serenely sweet express,
How pure, how dear their dwelling-place.`), p("The speaker gradually moves beneath physical description to moral and emotional qualities.")] },
    { theme: "Nature and perception", blocks: [p("Stars, clouds, night, and light supply a language for describing beauty as a changing relation rather than a fixed list of features.")] },
  ],
  formAndMeter: [
    p("The lyric has three six-line stanzas with an ABABAB rhyme scheme. Its alternating iambic tetrameter and trimeter create the familiar movement of common meter."),
    p("Regular stanza shape and balanced clauses enact the harmony the speaker praises.", ["she-walks-wikisource"]),
  ],
  literaryDevices: [
    { device: "Simile", blocks: [excerpt(`She walks in beauty, like the night`), p("The opening comparison makes night a positive image and immediately establishes the poem’s preference for softened darkness.")] },
    { device: "Antithesis", blocks: [excerpt(`And all that’s best of dark and bright
Meet in her aspect and her eyes;`), p("Paired opposites organize the claim that beauty is created by a measured combination of qualities.")] },
    { device: "Personification", blocks: [excerpt(`Which heaven to gaudy day denies.`), p("Heaven appears to withhold a tender quality from daylight, giving the preference for night a cosmic scale.")] },
  ],
  historicalContext: [
    p("Byron dated the poem June 12, 1814; it appeared in Hebrew Melodies in 1815. The Wikisource edition preserves a note connecting its inspiration with Anne Beatrix Wilmot’s mourning dress and spangles.", ["she-walks-wikisource"]),
    p("The lyric’s compact, singable stanzas also reflect its setting within a collection designed to be paired with music."),
  ],
  citations: [
    { id: "she-walks-poets", source: "Academy of American Poets", url: "https://poets.org/poem/she-walks-beauty" },
    { id: "she-walks-foundation", source: "Poetry Foundation", quote: "And all that’s best of dark and bright / Meet in her aspect and her eyes", url: "https://www.poetryfoundation.org/poems/43844/she-walks-in-beauty" },
    { id: "she-walks-wikisource", source: "Wikisource", quote: "One shade the more, one ray the less, / Had half impaired the nameless grace", url: "https://en.wikisource.org/wiki/The_Works_of_Lord_Byron_(ed._Coleridge,_Prothero)/Poetry/Volume_3/Hebrew_Melodies/She_walks_in_Beauty" },
    { id: "she-walks-text", source: "Poetry Foundation, Hebrew Melodies", url: "https://www.poetryfoundation.org/poems/43844/she-walks-in-beauty" },
  ],
  criticalViews: [{ citeId: "she-walks-foundation" }, { citeId: "she-walks-wikisource" }],
  faqs: [
    { q: "What is the main meaning?", plain: "Beauty is presented as a harmony of light and darkness joined to inner peace, goodness, and innocent love." },
    { q: "What does night symbolize?", plain: "Night represents a gentle, restrained light and the balance that makes the speaker’s ideal beauty possible." },
    { q: "What is the form and meter?", plain: "The poem has three six-line stanzas, ABABAB rhyme, and mainly alternating iambic tetrameter and trimeter." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

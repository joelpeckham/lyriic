import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const aDayOfSunshinePoem: PoemAnalysisContent = {
  slug: "a-day-of-sunshine", status: "ready", poemTitle: "A Day of Sunshine",
  author: "Henry Wadsworth Longfellow", yearPublished: 1863,
  publicDomainBasis: "First published in 1863; public domain in the United States.",
  title: "A Day of Sunshine Analysis & Meaning — Henry Wadsworth Longfellow — lyriic",
  description: "A Day of Sunshine analysis: Longfellow’s nature imagery, joy, freedom, form, and meaning.",
  h1: "A Day of Sunshine analysis",
  intro: "This analysis explains how Longfellow turns a bright day into a meditation on presence, joy, and freedom.",
  fullTextSource: { label: "A Day of Sunshine", url: "https://www.hwlongfellow.org/poems_poem.php?pid=56", publisher: "Maine Historical Society" },
  editorSettings: poemMeterSettings("iambic-tetrameter", { showCounts: true, showStress: true, showMeterBreaks: true, showRhymeScheme: true }),
  summary: [p("The speaker treats a bright day as a divine gift, choosing presence over work. The lyric expands from bodily sensation to a musical, animated landscape."), excerpt(`O gift of God! O perfect day:
Whereon shall no man work, but play;
Whereon it is enough for me`), p("The closing question turns delight into an invitation: can the human heart become as free as the air?", ["day-analysis"])],
  meaning: [p("Longfellow presents rest as spiritually productive: simply being allows the world to register more intensely. The poem’s joy is physical, auditory, and visual.", ["day-analysis"]), excerpt(`I feel the electric thrill, the touch
Of life, that seems almost too much.`), p("Beauty feels nearly overwhelming, so freedom includes receptivity as well as release from duty.")],
  themes: [
    { theme: "Nature as renewal", blocks: [excerpt(`I hear the wind among the trees
Playing celestial symphonies;`), p("Nature becomes restorative when ordinary sound is perceived as music.")] },
    { theme: "Being over productivity", blocks: [p("The opening rejects work as the measure of a day and makes attentive existence sufficient.")] },
    { theme: "Freedom", blocks: [excerpt(`O heart of man! canst thou not be
Blithe as the air is, and as free?`), p("The question tests whether human feeling can match nature’s apparent ease.")] },
  ],
  formAndMeter: [p("The 28-line lyric has seven quatrains and predominantly iambic tetrameter. Its four-beat pulse supports the poem’s songlike exuberance.", ["day-form"]), p("Rhyming couplets close each quatrain, while exclamations and syntactic variations keep the regularity from becoming mechanical.")],
  literaryDevices: [
    { device: "Simile", blocks: [excerpt(`Where through a sapphire sea the sun
Sails like a golden galleon,`), p("The sky becomes an ocean and sunlight a voyage, giving a static day motion and scale.")] },
    { device: "Personification", blocks: [p("Wind and branches become active performers; the landscape seems to create its own music.")] },
    { device: "Sensory imagery", blocks: [p("Touch, sound, and sight accumulate until joy becomes a bodily event.")] },
  ],
  historicalContext: [p("The poem appeared in Birds of Passage, Flight the Second (1863), within Longfellow’s practice of grouping shorter poems into themed volumes.", ["day-history"]), excerpt(`Towards yonder cloud-land in the West,
Towards yonder Islands of the Blest,`), p("Its spiritual vocabulary joins Romantic nature feeling to a Christian sense of gift.")],
  citations: [
    { id: "day-text", source: "Maine Historical Society", url: "https://www.hwlongfellow.org/poems_poem.php?pid=56" },
    { id: "day-analysis", source: "Poem Analysis", author: "Poem Analysis editors", url: "https://poemanalysis.com/henry-wadsworth-longfellow/a-day-of-sunshine/", quote: "The poem concludes with the speaker expressing his desire that the human heart gain similar freedom to that which is demonstrated by the broader natural world." },
    { id: "day-form", source: "Poem Analysis", url: "https://poemanalysis.com/henry-wadsworth-longfellow/a-day-of-sunshine/", quote: "Closest metre: iambic tetrameter." },
    { id: "day-history", source: "Maine Historical Society", url: "https://www.hwlongfellow.org/poems_poem.php?pid=56", quote: "Birds of Passage 1863." },
  ],
  criticalViews: [{ citeId: "day-analysis" }, { citeId: "day-form" }],
  faqs: [
    { q: "What is the meaning of A Day of Sunshine?", plain: "A beautiful day restores the spirit by making pause, attention, and simple being feel valuable." },
    { q: "What are its main themes?", plain: "Nature as renewal, freedom from productivity, sensory joy, and the wish for a blithe human heart." },
    { q: "What form and meter does it use?", plain: "It is a 28-line lyric in seven quatrains, predominantly iambic tetrameter with rhyming couplets.", href: "/tools/iambic-tetrameter-checker", hrefLabel: "Try the tetrameter checker" },
  ],
  cta: "Write with this poem’s meter in the editor",
};

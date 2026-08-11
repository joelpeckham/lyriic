import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const theRiverMerchantsWifePoem: PoemAnalysisContent = {
  slug: "the-river-merchants-wife", status: "ready", poemTitle: "The River-Merchant's Wife: A Letter", author: "Ezra Pound, after Li Bai", yearPublished: 1915,
  publicDomainBasis: "Pound’s Cathay translation was published in 1915, before the US public-domain cutoff.",
  title: "The River-Merchant's Wife: A Letter Analysis & Meaning — Ezra Pound — lyriic", description: "Analysis of Pound’s River-Merchant’s Wife: love, separation, memory, translation, and free verse.", h1: "The River-Merchant's Wife: A Letter analysis",
  intro: "Pound’s modernist re-creation uses childhood memory and seasonal images to make separation emotionally immediate.",
  fullTextSource: { label: "Cathay", url: "https://www.gutenberg.org/files/50155/50155-h/50155-h.htm", publisher: "Project Gutenberg" },
  editorSettings: poemOpenSettings({ showCounts: true }),
  summary: [p("The speaker remembers childhood play, marriage, and the husband’s departure on a journey. As months pass, moss, leaves, butterflies, and the river make absence visible."), excerpt(`While my hair was still cut straight across my forehead
I played about the front gate, pulling flowers.
You came by on bamboo stilts, playing horse,`), p("The final request imagines a reunion but receives no answer, leaving the letter emotionally open.", ["river-yale"])],
  meaning: [p("Separation reveals the depth of love: ordinary memories become intense because the beloved is absent.", ["river-analysis"]), excerpt(`At sixteen you departed,
You went into far Ku-to-Yen, by the river of swirling eddies,
And you have been gone five months.`), p("The poem is also a modernist translation or re-creation, not a word-for-word rendering. Pound’s images and lineation make an ancient situation new in English.", ["river-yale"])],
  themes: [
    { theme: "Love and separation", blocks: [p("Shared childhood becomes evidence of a bond that absence tests.")] },
    { theme: "Time and identity", blocks: [p("Ages fourteen, fifteen, and sixteen organize emotional growth.")] },
    { theme: "Nature and waiting", blocks: [excerpt(`The leaves fall early this autumn, in wind.
The paired butterflies are already yellow with August`), p("Seasonal change measures the speaker’s loneliness.")] },
  ],
  formAndMeter: [p("The poem uses free verse, uneven stanzas, no fixed rhyme scheme, and conversational syntax."), p("Age markers, repeated “forever,” and concrete images provide structure in place of regular meter.", ["river-yale"])],
  literaryDevices: [
    { device: "Concrete imagery", blocks: [excerpt(`You came by on bamboo stilts, playing horse,
You walked about my seat, playing with blue plums.`), p("Tactile objects carry the relationship more effectively than abstract declarations.")] },
    { device: "Anaphora", blocks: [excerpt(`At fourteen I married My Lord you.
At fifteen I stopped scowling,
At sixteen you departed,`), p("Repeated ages create a compressed chronology.")] },
    { device: "Seasonal imagery", blocks: [excerpt(`The monkeys make sorrowful noise overhead.`), p("Natural sound becomes emotional evidence through the speaker’s perception.")] },
  ],
  historicalContext: [p("Cathay appeared in 1915 and identifies its poems as translations from Rihaku, Pound’s name for Li Bai. Pound worked from Fenollosa’s notes and other decipherings."), p("Yale’s Modernism Lab emphasizes that Pound altered details to craft innovative English poems and that Cathay appeared during World War I.", ["river-yale"])],
  citations: [
    { id: "river-text", source: "Project Gutenberg", url: "https://www.gutenberg.org/files/50155/50155-h/50155-h.htm" },
    { id: "river-yale", source: "Yale Modernism Lab", author: "Andrew Karas", url: "https://campuspress.yale.edu/modernismlab/cathay/", quote: "The poems in Cathay might be more profitably considered translations of certain states of mind or modes of existence than of specific words on a page." },
    { id: "river-analysis", source: "Poem Analysis", url: "https://poemanalysis.com/ezra-pound/the-river-merchants-wife-a-letter/", quote: "It explores themes of love, loss, and separation." },
    { id: "river-wikisource", source: "Wikisource", url: "https://en.wikisource.org/wiki/The_River_Merchant%27s_Wife:_A_Letter" },
  ],
  criticalViews: [{ citeId: "river-yale" }, { citeId: "river-analysis" }],
  faqs: [
    { q: "What is the main meaning?", plain: "Separation reveals and intensifies the speaker’s love." },
    { q: "What are the main themes?", plain: "Love, separation, time, memory, nature, and translation." },
    { q: "Is it a direct translation?", plain: "No. It is a modernist re-creation based on Fenollosa’s notes and other decipherings." },
  ],
  cta: "Write with this poem’s open form in the editor",
};

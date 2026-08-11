import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const aPinchOfSaltPoem: PoemAnalysisContent = {
  slug: "a-pinch-of-salt", status: "ready", poemTitle: "A Pinch of Salt", author: "Robert Graves", yearPublished: 1916,
  publicDomainBasis: "Published in Fairies and Fusiliers (1918), before the US public-domain cutoff.",
  title: "A Pinch of Salt Analysis & Meaning — Robert Graves — lyriic",
  description: "A Pinch of Salt analysis: Graves’s bird metaphor, creative inspiration, patience, rhyme, and meaning.",
  h1: "A Pinch of Salt analysis", intro: "Graves makes poetic inspiration a wary bird, teaching the poet when to wait and when to grasp.",
  fullTextSource: { label: "A Pinch of Salt", url: "https://www.poetry.com/poem-analysis/31093/a-pinch-of-salt", publisher: "Poetry.com" },
  editorSettings: poemMeterSettings("iambic-tetrameter", { showCounts: true, showMeterBreaks: true, showRhymeScheme: true }),
  summary: [p("A beautiful dream arrives with painful intensity, but trying to seize it too quickly may damage it. Graves turns that warning into a bird-catching fable."), excerpt(`When a dream is born in you
With a sudden clamorous pain,
When you know the dream is true`), p("The final stanza advises apparent indifference followed by decisive control.", ["salt-analysis"])],
  meaning: [p("The poem treats inspiration as fragile and independent. Creative discipline means resisting panic first, then shaping the idea once it is ready.", ["salt-analysis"]), excerpt(`Poet, never chase the dream.
Laugh yourself and turn away.`), p("The contradiction between detachment and possession describes timing, not passivity.")],
  themes: [
    { theme: "Inspiration", blocks: [p("The dream represents a poem or idea that cannot safely be summoned by force.")] },
    { theme: "Patience", blocks: [excerpt(`When you seize at the salt-box
Over the hedge you'll see him sail.`), p("The bird escapes when desire becomes visibly urgent.")] },
    { theme: "Creative control", blocks: [excerpt(`But when he nestles in your hand at last,
Close up your fingers tight and hold him fast.`), p("The poem distinguishes premature grasping from deliberate final control.")] },
  ],
  formAndMeter: [p("The poem has three six-line stanzas, with ABABCC, DEDEFF, and GHGHII rhyme patterns. It is predominantly iambic tetrameter.", ["salt-form"]), p("Short stanzas and closing couplets make the advice sound proverbial.")],
  literaryDevices: [
    { device: "Extended metaphor", blocks: [excerpt(`Dreams are like a bird that mocks,
Flirting the feathers of his tail.`), p("The sustained bird image makes inspiration alive, mobile, and resistant to force.")] },
    { device: "Imperative voice", blocks: [p("Commands addressed to “Poet” turn description into practical artistic counsel.")] },
    { device: "Paradox", blocks: [p("The speaker says to turn away from the dream, then hold it fast; restraint enables possession.")] },
  ],
  historicalContext: [p("The poem was published in Fairies and Fusiliers (1918), a collection associated with Graves’s early poetry. Its fable-like subject turns away from direct war experience toward artistic escape.", ["salt-history"]), excerpt(`Old birds are neither caught with salt nor chaff:
They watch you from the apple bough and laugh.`), p("The rural image gives a modern creative problem the shape of a compact proverb.")],
  citations: [
    { id: "salt-text", source: "Poetry.com", url: "https://www.poetry.com/poem-analysis/31093/a-pinch-of-salt" },
    { id: "salt-analysis", source: "Poetry.com", url: "https://www.poetry.com/poem-analysis/31093/a-pinch-of-salt", quote: "Closest metre | Iambic tetrameter." },
    { id: "salt-form", source: "Poetry.com", url: "https://www.poetry.com/poem-analysis/31093/a-pinch-of-salt", quote: "Closest metre | Iambic tetrameter." },
    { id: "salt-history", source: "Poetry.com", url: "https://www.poetry.com/poem-analysis/31093/a-pinch-of-salt", quote: "Stanza Lengths | 6, 6, 6." },
  ],
  criticalViews: [{ citeId: "salt-analysis" }, { citeId: "salt-form" }],
  faqs: [
    { q: "What is the meaning?", plain: "Do not force inspiration; wait until the idea approaches naturally, then shape it firmly." },
    { q: "What does the bird symbolize?", plain: "It symbolizes a dream, poem, or creative insight that escapes anxious pursuit." },
    { q: "What form does it use?", plain: "Three six-line stanzas use alternating rhymes and predominantly iambic tetrameter." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

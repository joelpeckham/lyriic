import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const acquaintedWithTheNightPoem: PoemAnalysisContent = {
  slug: "acquainted-with-the-night", status: "ready", poemTitle: "Acquainted with the Night", author: "Robert Frost", yearPublished: 1928,
  publicDomainBasis: "First published in 1928; public domain under the project’s US screening policy.",
  title: "Acquainted with the Night Analysis & Meaning — Robert Frost — lyriic",
  description: "Acquainted with the Night analysis: Frost’s solitude, urban isolation, terza rima, time, and uncertainty.",
  h1: "Acquainted with the Night analysis", intro: "Frost uses a rainy city walk, interlocking rhyme, and circular repetition to explore solitude.",
  fullTextSource: { label: "Acquainted with the Night", url: "https://www.poetryfoundation.org/poems/47548/acquainted-with-the-night", publisher: "Poetry Foundation" },
  editorSettings: poemMeterSettings("iambic-pentameter", { showCounts: true, showStress: true, showMeterBreaks: true, showRhymeScheme: true }),
  summary: [p("A first-person speaker repeatedly walks through a rainy city, passing a watchman and hearing a distant cry. A high clock says the time is neither wrong nor right."), excerpt(`I have been one acquainted with the night.
I have walked out in rain—and back in rain.
I have outwalked the furthest city light.`), p("The identical opening and closing line makes the journey circular and unresolved.", ["night-analysis"])],
  meaning: [p("Night is both setting and figure for inward loneliness. The speaker is surrounded by houses and possible voices yet remains separate from human contact.", ["night-analysis"]), excerpt(`But not to call me back or say good-bye;
And further still at an unearthly height,`), p("“Acquainted” suggests familiarity without intimacy: the speaker knows darkness through repetition but does not master it.")],
  themes: [
    { theme: "Solitude", blocks: [p("Loneliness occurs within a populated city, not only in an empty landscape.")] },
    { theme: "Night and inward experience", blocks: [excerpt(`I have looked down the saddest city lane.
I have passed by the watchman on his beat`), p("The urban route reflects the speaker’s interior state.")] },
    { theme: "Time and uncertainty", blocks: [excerpt(`Proclaimed the time was neither wrong nor right.`), p("The clock offers judgment without resolution.")] },
  ],
  formAndMeter: [p("The 14-line poem is a terza-rima sonnet: four tercets followed by a couplet, with interlocking rhyme and predominantly iambic pentameter.", ["night-form"]), p("Repeated “I have” creates a measured pulse like recurring footsteps; the final repetition returns the speaker to his condition.")],
  literaryDevices: [
    { device: "Repetition", blocks: [excerpt(`I have been one acquainted with the night.`), p("The framing line makes solitude habitual and circular.")] },
    { device: "Personification", blocks: [p("The luminary clock proclaims a judgment, but its words preserve ambiguity rather than answering the speaker.")] },
    { device: "Auditory imagery", blocks: [excerpt(`When far away an interrupted cry
Came over houses from another street,`), p("Sound briefly connects separate lives, then fails to summon the speaker.")] },
  ],
  historicalContext: [p("The poem appeared in 1928 in West-Running Brook after publication in the Virginia Quarterly Review. Its urban setting distinguishes it from Frost’s better-known rural lyrics.", ["night-history"]), excerpt(`One luminary clock against the sky
Proclaimed the time was neither wrong nor right.`), p("A constructed lyric voice, rather than a direct autobiography, carries the poem’s uncertainty.")],
  citations: [
    { id: "night-text", source: "Poetry Foundation", url: "https://www.poetryfoundation.org/poems/47548/acquainted-with-the-night" },
    { id: "night-analysis", source: "LitCharts", url: "https://www.litcharts.com/poetry/robert-frost/acquainted-with-the-night", quote: "Acquainted with the Night is a terza rima sonnet with the traditional 14 lines and ending couplet." },
    { id: "night-form", source: "LitCharts", url: "https://www.litcharts.com/poetry/robert-frost/acquainted-with-the-night", quote: "Each line is also written using iambic pentameter." },
    { id: "night-history", source: "Poetry Foundation", url: "https://www.poetryfoundation.org/poems/47548/acquainted-with-the-night", quote: "Source: Twentieth-Century American Poetry (2004)." },
  ],
  criticalViews: [{ citeId: "night-analysis" }, { citeId: "night-form" }],
  faqs: [
    { q: "What is the main meaning?", plain: "The poem presents repeated night walking as a figure for loneliness, inward reflection, and uncertainty." },
    { q: "What are the themes?", plain: "Solitude, urban isolation, night, time, and unresolved judgment." },
    { q: "What form does it use?", plain: "A terza-rima sonnet with four tercets, a closing couplet, and predominantly iambic pentameter." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

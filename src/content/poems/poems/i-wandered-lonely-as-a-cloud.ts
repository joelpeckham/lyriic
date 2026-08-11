import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const iWanderedLonelyAsACloudPoem: PoemAnalysisContent = {
  slug: "i-wandered-lonely-as-a-cloud", status: "ready", poemTitle: "I Wandered Lonely as a Cloud", author: "William Wordsworth", yearPublished: 1807,
  publicDomainBasis: "First published in 1807, before the US public-domain cutoff.",
  title: "I Wandered Lonely as a Cloud Analysis & Meaning — William Wordsworth — lyriic",
  description: "Wordsworth analysis of daffodils, Romantic memory, solitude, nature, form, and meaning.",
  h1: "I Wandered Lonely as a Cloud analysis", intro: "This analysis explains how Wordsworth turns a solitary walk into a meditation on memory and nature.",
  fullTextSource: { label: "I wandered lonely as a Cloud", url: "https://poets.org/poem/i-wandered-lonely-cloud", publisher: "Academy of American Poets" },
  editorSettings: poemMeterSettings("iambic-tetrameter", { showCounts: true, showStress: true, showMeterBreaks: true, showRhymeScheme: true }),
  summary: [
    p("A solitary speaker encounters a vast field of golden daffodils beside a lake; their movement makes nature feel social and alive.", ["wordsworth-daffodils-context"]),
    excerpt(`I wandered lonely as a Cloud
That floats on high o’er Vales and Hills,
When all at once I saw a crowd,`),
    p("Later, the remembered flowers flash into the speaker’s inward eye and transform solitude into pleasure.", ["wordsworth-daffodils-context"]),
  ],
  meaning: [
    p("Nature is more than a beautiful view: the daffodils become imaginative wealth available after the walk has ended.", ["wordsworth-daffodils-context"]),
    excerpt(`For oft, when on my couch I lie
In vacant or in pensive mood,
They flash upon that inward eye`),
    p("The poem’s opening loneliness is revised rather than erased; memory creates inward companionship.", ["wordsworth-daffodils-analysis"]),
  ],
  themes: [
    { theme: "Nature and imagination", blocks: [p("The mind turns flowers into a crowd, host, stars, and dancers.")] },
    { theme: "Memory", blocks: [p("The final stanza makes recollection the source of lasting joy.", ["wordsworth-daffodils-context"])] },
    { theme: "Solitude and companionship", blocks: [p("The speaker begins alone but ends with nature as remembered company.")] },
  ],
  formAndMeter: [
    p("Four six-line stanzas use ABABCC rhyme; the closing couplets give each scene a musical resolution.", ["wordsworth-daffodils-analysis"]),
    p("The lines are chiefly iambic tetrameter, whose steady movement supports the poem’s shift from wandering to dancing.", ["wordsworth-daffodils-analysis"]),
  ],
  literaryDevices: [
    { device: "Simile", blocks: [excerpt(`I wandered lonely as a Cloud`), p("The speaker appears detached and drifting before the flowers create companionship.")] },
    { device: "Personification", blocks: [excerpt(`Fluttering and dancing in the breeze.`), p("Human movement makes natural motion into emotional communication.")] },
    { device: "Hyperbole", blocks: [excerpt(`Ten thousand saw I at a glance,
Tossing their heads in sprightly dance.`), p("The vast number enlarges the scene into a memorable vision.")] },
  ],
  historicalContext: [
    p("Wordsworth composed the poem in 1804 after the 1802 Ullswater walk with Dorothy and first published it in 1807; the familiar four-stanza version was revised in 1815.", ["wordsworth-daffodils-context"]),
    p("Wordsworth Grasmere links the later stanza to the poet’s idea of emotion “recollected in tranquillity.”", ["wordsworth-daffodils-context"]),
  ],
  citations: [
    { id: "wordsworth-daffodils-text", source: "Academy of American Poets", url: "https://poets.org/poem/i-wandered-lonely-cloud" },
    { id: "wordsworth-daffodils-context", source: "Wordsworth Grasmere", quote: "These changes deepen the poem’s emphasis on memory and reflection.", url: "https://wordsworth.org.uk/daffodils/" },
    { id: "wordsworth-daffodils-analysis", source: "SparkNotes", quote: "poetry takes its origin from “emotion recollected in tranquility.”", url: "https://www.sparknotes.com/poetry/i-wandered-lonely-as-a-cloud/overview/" },
    { id: "wordsworth-daffodils-critical", source: "LitCharts", quote: "The poem is based on one of Wordsworth's own walks in the countryside of England's Lake District.", url: "https://www.litcharts.com/poetry/william-wordsworth/i-wandered-lonely-as-a-cloud" },
  ],
  criticalViews: [{ citeId: "wordsworth-daffodils-context" }, { citeId: "wordsworth-daffodils-analysis" }],
  faqs: [
    { q: "What is the poem’s meaning?", plain: "An encounter with nature becomes lasting joy when memory returns it to the inward eye." },
    { q: "What do the daffodils symbolize?", plain: "Natural vitality, companionship, and the imaginative wealth of remembered experience." },
    { q: "What form does it use?", plain: "Four six-line stanzas with ABABCC rhyme and chiefly iambic tetrameter." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

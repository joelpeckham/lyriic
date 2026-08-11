import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const howDoILoveTheePoem: PoemAnalysisContent = {
  slug: "how-do-i-love-thee", status: "ready", poemTitle: "How Do I Love Thee? (Sonnet 43)", author: "Elizabeth Barrett Browning", yearPublished: 1850,
  publicDomainBasis: "First published in Sonnets from the Portuguese in 1850, before the US public-domain cutoff.",
  title: "How Do I Love Thee? Analysis & Meaning — Elizabeth Barrett Browning — lyriic",
  description: "Analysis of Sonnet 43: love’s spiritual scale, daily devotion, sonnet form, and lasting meaning.",
  h1: "How Do I Love Thee? analysis", intro: "This analysis follows how Browning turns a question about love into a measured sequence of spiritual and everyday answers.",
  fullTextSource: { label: "How Do I Love Thee? — full poem", url: "https://poets.org/poem/how-do-i-love-thee-sonnet-43", publisher: "Academy of American Poets" },
  editorSettings: poemMeterSettings("iambic-pentameter", { showCounts: true, showStress: true, showMeterBreaks: true, showRhymeScheme: true }),
  summary: [
    p("The speaker answers her opening question by measuring love through the soul, daily need, moral choice, memory, and the whole range of life.", ["browning-sonnet-analysis"]),
    excerpt(`How do I love thee? Let me count the ways.
I love thee to the depth and breadth and height
My soul can reach, when feeling out of sight`),
    p("The final conditional promise extends devotion beyond mortal life.", ["browning-sonnet-analysis"]),
  ],
  meaning: [
    p("The poem makes love both transcendent and practical: spiritual aspiration is brought down to ordinary care by sun and candle-light.", ["browning-sonnet-analysis"]),
    excerpt(`I love thee to the level of every day’s
Most quiet need, by sun and candle-light.
I love thee freely, as men strive for right;`),
    p("Repeated declarations make love an act of agency, while religious language gives private affection an ethical and spiritual dimension.", ["browning-sonnet-analysis"]),
  ],
  themes: [
    { theme: "Boundless love", blocks: [p("Depth, breadth, height, and afterlife push devotion beyond ordinary measurement.")] },
    { theme: "Daily devotion", blocks: [p("The poem grounds grand feeling in the quiet needs of every day.")] },
    { theme: "Freedom and moral feeling", blocks: [p("Love is described as chosen freely and purely, not imposed from outside.")] },
    { theme: "Religious devotion", blocks: [p("Soul, grace, faith, saints, and God place romantic love beside religious experience.")] },
  ],
  formAndMeter: [
    p("This is a Petrarchan sonnet: an octave and sestet with ABBA ABBA CDCDCD rhyme.", ["browning-sonnet-form"]),
    p("Iambic pentameter supports the promise to “count the ways,” while anaphora and enjambment keep the feeling expansive.", ["browning-sonnet-analysis"]),
  ],
  literaryDevices: [
    { device: "Anaphora", blocks: [excerpt(`I love thee with the passion put to use
In my old griefs, and with my childhood’s faith.`), p("Repeated “I love thee” clauses add register after register of devotion.")] },
    { device: "Measurement imagery", blocks: [excerpt(`I love thee to the depth and breadth and height`), p("Spatial measurement turns counting into an encounter with the infinite.")] },
    { device: "Simile", blocks: [excerpt(`I love thee freely, as men strive for right;
I love thee purely, as they turn from praise.`), p("Ethical comparisons characterize love as voluntary and disciplined.")] },
  ],
  historicalContext: [
    p("The sonnet appeared in Sonnets from the Portuguese in 1850; the sequence was written during Browning’s courtship with Robert Browning.", ["browning-sonnet-history"]),
    p("The title presented the sequence as translations, helping frame an intensely personal set of poems for Victorian readers.", ["browning-sonnet-history"]),
  ],
  citations: [
    { id: "browning-sonnet-text", source: "Academy of American Poets", url: "https://poets.org/poem/how-do-i-love-thee-sonnet-43" },
    { id: "browning-sonnet-analysis", source: "LitCharts", quote: "The poem thus begins as a means of attempting to justify love in rational terms.", url: "https://www.litcharts.com/poetry/elizabeth-barrett-browning/how-do-i-love-thee-let-me-count-the-ways-sonnets-from-the-portuguese-43" },
    { id: "browning-sonnet-form", source: "Interesting Literature", quote: "Barrett Browning’s poem is not even a Shakespearean sonnet but a Petrarchan one", url: "https://interestingliterature.com/2017/05/a-short-analysis-of-elizabeth-barrett-brownings-how-do-i-love-thee-let-me-count-the-ways/" },
    { id: "browning-sonnet-history", source: "Poetry Foundation", url: "https://www.poetryfoundation.org/poems/43742/sonnets-from-the-portuguese-43-how-do-i-love-thee-let-me-count-the-ways" },
  ],
  criticalViews: [{ citeId: "browning-sonnet-analysis" }, { citeId: "browning-sonnet-form" }],
  faqs: [
    { q: "What is the poem’s meaning?", plain: "The speaker describes love as spiritual, ethical, ordinary, and enduring beyond death." },
    { q: "What are its themes?", plain: "Boundless devotion, daily care, freedom, faith, memory, and eternity." },
    { q: "What form does it use?", plain: "A Petrarchan sonnet in iambic pentameter with ABBA ABBA CDCDCD rhyme." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const weWearTheMaskPoem: PoemAnalysisContent = {
  slug: "we-wear-the-mask",
  status: "ready",
  poemTitle: "We Wear the Mask",
  author: "Paul Laurence Dunbar",
  yearPublished: 1896,
  publicDomainBasis:
    "First published in Majors and Minors in 1895 and included in Lyrics of Lowly Life in 1896; both nineteenth-century publications are public domain in the United States.",
  title: "We Wear the Mask Analysis & Meaning — Paul Laurence Dunbar — lyriic",
  description:
    "We Wear the Mask analysis explores Dunbar’s themes of racial oppression, hidden suffering, public performance, and collective resilience.",
  h1: "We Wear the Mask analysis",
  intro:
    "This analysis explains how Dunbar turns a smiling mask into a public facade shaped by oppression, hidden pain, and communal endurance.",
  fullTextSource: {
    label: "We Wear the Mask",
    url: "https://poets.org/poem/we-wear-mask",
    publisher: "Academy of American Poets",
  },
  editorSettings: poemOpenSettings(),
  summary: [
    p("The collective speaker describes a community that presents a smiling face while concealing pain. The mask grins and lies, hiding both visible emotion and the identity beneath it.", ["litcharts-mask"]),
    excerpt(`We wear the mask that grins and lies,
It hides our cheeks and shades our eyes,—`),
    p("The second stanza makes concealment sound strategic: the community refuses to let an oppressive world count every tear. In the final stanza, private cries and difficult labor exist beneath public singing.", ["sparknotes-mask"]),
  ],
  meaning: [
    p("The central mask is a public facade forced into existence by an unequal society. “With torn and bleeding hearts we smile” makes the gap between appearance and experience physical: the smile is evidence of emotional labor.", ["litcharts-mask"]),
    excerpt(`With torn and bleeding hearts we smile,
And mouth with myriad subtleties.`),
    p("The repeated pronoun “we” makes the poem communal. Its historical context connects the mask to Black Americans navigating white supremacy, while the image can also describe other marginalized people managing a hostile public gaze.", ["artincontext-mask", "sparknotes-mask"]),
  ],
  themes: [
    { theme: "Racial oppression and survival", blocks: [p("Though race is not named directly, Dunbar’s context and the poem’s post-Reconstruction setting connect the mask to Black life under white supremacy. The facade protects its wearers from scrutiny in a hostile society.", ["litcharts-mask", "sparknotes-mask"])] },
    { theme: "Public facade and hidden suffering", blocks: [excerpt(`We smile, but oh great Christ, our cries
To thee from tortured souls arise.`), p("The poem places injury beside happiness to expose the cost of public composure. A smile is not proof of contentment but a performance over pain.", ["artincontext-mask"])] },
    { theme: "Double consciousness", blocks: [p("The speaker holds an inward self that cries and an outward self that smiles and sings. The poem dramatizes the split between self-knowledge and the identity demanded by the dominant culture.", ["litcharts-mask"])] },
    { theme: "Collective resilience", blocks: [excerpt(`But let the world dream otherwise,
We wear the mask!`), p("The repeated “we” turns individual suffering into shared testimony. Naming the strategy together gives the speakers some control over how their endurance is understood.", ["artincontext-mask"])] },
  ],
  formAndMeter: [
    p("The poem is a 15-line rondeau-like lyric in three stanzas. Its compact form and recurring refrain make masking feel repeated and habitual.", ["artincontext-mask", "sparknotes-mask"]),
    p("The refrain returns at the end of each stanza, with punctuation moving from statement to acceptance to defiant communal assertion. Short lines and tight rhyme intensify the pressure beneath the controlled surface.", ["artincontext-mask"]),
  ],
  literaryDevices: [
    { device: "Extended metaphor", blocks: [excerpt(`We wear the mask that grins and lies,
It hides our cheeks and shades our eyes,—`), p("The mask represents the socially required public self: it conceals suffering while performing respectability.", ["artincontext-mask"])] },
    { device: "Refrain", blocks: [excerpt(`Nay, let them only see us, while
We wear the mask.`), p("The repeated phrase gives the poem a ritual quality. Concealment is a recurring condition shared by the “we.”", ["litcharts-mask"])] },
    { device: "Juxtaposition", blocks: [excerpt(`With torn and bleeding hearts we smile,
And mouth with myriad subtleties.`), p("Injury sits beside happiness, exposing the lie of the public expression and the emotional cost of maintaining it.", ["artincontext-mask"])] },
    { device: "Religious imagery", blocks: [excerpt(`We smile, but oh great Christ, our cries
To thee from tortured souls arise.`), p("The direct address to Christ opens a spiritual register beneath the public performance: suffering is heard by God even when the wider world refuses to hear it.") ] },
  ],
  historicalContext: [
    p("Dunbar first published the poem in Majors and Minors in 1895. Its standard-English form belongs to the collection’s “major” poems, unlike the dialect verse that drew much of the early attention.", ["sparknotes-mask"]),
    p("The post-Reconstruction period brought legal emancipation without ending racial violence, segregation, or pressure to accommodate white power. That history gives the collective “we” political and communal weight.", ["sparknotes-mask"]),
  ],
  citations: [
    { id: "poets-mask", source: "Academy of American Poets", url: "https://poets.org/poem/we-wear-mask" },
    { id: "litcharts-mask", source: "LitCharts", url: "https://www.litcharts.com/poetry/paul-laurence-dunbar/we-wear-the-mask", quote: "Although race isn’t mentioned in this poem, it is essential to its meaning: most of Dunbar’s work engaged with race in some way, and this mask metaphor extends itself to the specific experience of being black in America at the end of the 19th century." },
    { id: "sparknotes-mask", source: "SparkNotes", url: "https://www.sparknotes.com/poetry/we-wear-the-mask/critical-context/", quote: "“We Wear the Mask” first appeared in Dunbar’s 1895 poetry collection, Majors and Minors." },
    { id: "artincontext-mask", source: "Art in Context", author: "Justin van Huyssteen", url: "https://artincontext.org/we-wear-the-mask-by-paul-laurence-dunbar/", quote: "We Wear the Mask is a rondeau." },
  ],
  criticalViews: [{ citeId: "litcharts-mask" }, { citeId: "sparknotes-mask" }],
  faqs: [
    { q: "What is the main meaning of “We Wear the Mask”?", plain: "Dunbar shows a community hiding suffering behind a public performance of happiness. The mask is a survival strategy under oppression, but it also reveals the cost of being denied an honest public self." },
    { q: "What does the mask symbolize?", plain: "It symbolizes a public facade: a smile and managed identity shown to the world while pain remains private." },
    { q: "How does the poem address race?", plain: "Race is not named explicitly, but Dunbar’s authorship and post-Reconstruction context connect the mask to Black Americans navigating white supremacy and public stereotypes." },
    { q: "What form does the poem use?", plain: "It is a compact rondeau-like lyric with three stanzas, short lines, tight rhyme, and a repeated refrain.", href: "/tools/sonnet-checker", hrefLabel: "Explore a poetry form in lyriic" },
  ],
  cta: "Write with this poem’s language and refrain in the editor",
};

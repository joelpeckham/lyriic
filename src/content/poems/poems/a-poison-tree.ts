import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const aPoisonTreePoem: PoemAnalysisContent = {
  slug: "a-poison-tree", status: "ready", poemTitle: "A Poison Tree", author: "William Blake", yearPublished: 1794,
  publicDomainBasis: "First published in Songs of Experience in 1794; public domain in the United States.",
  title: "A Poison Tree Analysis & Meaning — William Blake — lyriic",
  description: "A Poison Tree analysis: Blake’s anger, secrecy, revenge, apple imagery, form, and themes.",
  h1: "A Poison Tree analysis", intro: "Blake traces anger from honest expression to secret cultivation, deceit, and revenge.",
  fullTextSource: { label: "A Poison Tree", url: "https://en.wikisource.org/wiki/A_Poison_Tree", publisher: "Wikisource" },
  editorSettings: poemMeterSettings("common-meter", { showMeterBreaks: true, showRhymeScheme: true }),
  summary: [p("The speaker’s anger toward a friend ends when expressed, but anger toward a foe grows when concealed. It becomes a tree fed by fear, tears, smiles, and deceit."), excerpt(`I was angry with my friend;
I told my wrath, my wrath did end.
I was angry with my foe:`), p("A bright apple draws the foe into the garden, and the speaker greets the result with disturbing pleasure.", ["poison-analysis"])],
  meaning: [p("The poem warns that secrecy changes anger into a cultivated plan. The speaker is morally implicated because false friendliness sustains the resentment.", ["poison-analysis"]), excerpt(`And it grew both day and night.
Till it bore an apple bright.`), p("The attractive fruit disguises the poison within and recalls the forbidden fruit of Genesis.")],
  themes: [
    { theme: "Communication and anger", blocks: [p("The opening parallelism presents expression as release and silence as growth.")] },
    { theme: "Secrecy and hypocrisy", blocks: [excerpt(`And I sunned it with smiles,
And with soft deceitful wiles.`), p("The speaker performs friendliness while nurturing hostility.")] },
    { theme: "Revenge", blocks: [excerpt(`In the morning glad I see
My foe outstretched beneath the tree.`), p("The speaker’s gladness makes the ending morally unsettling rather than triumphant.")] },
  ],
  formAndMeter: [p("Four quatrains use short, strongly stressed lines and paired end rhymes. The simple, nursery-rhyme surface contrasts with the subject of deception and death.", ["poison-form"]), p("Repeated syntax makes the poem a compact moral experiment: telling anger ends it, while concealment grows it.")],
  literaryDevices: [
    { device: "Extended metaphor", blocks: [excerpt(`And I waterd it in fears,
Night & morning with my tears:`), p("Wrath becomes a tree that can be deliberately cultivated.")] },
    { device: "Biblical symbolism", blocks: [excerpt(`Till it bore an apple bright.
And my foe beheld it shine,`), p("Garden, tree, fruit, and trespass echo Eden while reversing its moral pattern.")] },
    { device: "Antithesis", blocks: [p("The nearly identical friend and foe sentences show how one small change—telling or not telling—produces opposite consequences.")] },
  ],
  historicalContext: [p("Blake published the poem in Songs of Experience (1794), paired with Songs of Innocence under the subtitle “Two Contrary States of the Human Soul.” The manuscript title “Christian Forbearance” sharpens the irony of polite concealment.", ["poison-history"]), excerpt(`When the night had veild the pole;
In the morning glad I see`), p("The garden imagery places a private quarrel inside biblical language about temptation and the Fall.")],
  citations: [
    { id: "poison-text", source: "Wikisource", url: "https://en.wikisource.org/wiki/A_Poison_Tree" },
    { id: "poison-analysis", source: "LitCharts", url: "https://www.litcharts.com/poetry/william-blake/a-poison-tree", quote: "The poem uses an extended metaphor to describe the speaker’s anger as growing into a tree that bears poisonous apples." },
    { id: "poison-form", source: "LitCharts", url: "https://www.litcharts.com/poetry/william-blake/a-poison-tree", quote: "In deceptively simple language with an almost nursery-rhyme quality." },
    { id: "poison-history", source: "Wikisource", url: "https://en.wikisource.org/wiki/A_Poison_Tree", quote: "This work was published before January 1, 1931, and is in the public domain worldwide." },
  ],
  criticalViews: [{ citeId: "poison-analysis" }, { citeId: "poison-form" }],
  faqs: [
    { q: "What is the main meaning?", plain: "Hidden anger nurtured through fear and deceit can become destructive, unlike anger openly expressed." },
    { q: "What does the apple symbolize?", plain: "It is an attractive but poisonous product of resentment and an allusion to forbidden fruit." },
    { q: "What form does it use?", plain: "Four quatrains with paired rhymes create a memorable nursery-rhyme surface." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

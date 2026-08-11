import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const thereWillComeSoftRainsPoem: PoemAnalysisContent = {
  slug: "there-will-come-soft-rains", status: "ready", poemTitle: "There Will Come Soft Rains",
  author: "Sara Teasdale", yearPublished: 1920,
  publicDomainBasis: "First published in 1918 and public domain in the United States.",
  title: "There Will Come Soft Rains Analysis & Meaning — Sara Teasdale — lyriic",
  description: "Analysis of There Will Come Soft Rains: nature, war, extinction, renewal, imagery, and musical form.",
  h1: "There Will Come Soft Rains analysis",
  intro: "Teasdale imagines spring continuing after humanity and its wars have disappeared, making nature’s beauty both consolation and rebuke.",
  fullTextSource: { label: "Flame and Shadow", url: "https://en.m.wikisource.org/wiki/Flame_and_Shadow/%22There_Will_Come_Soft_Rains%22", publisher: "Wikisource" },
  editorSettings: poemMeterSettings("iambic-tetrameter", { showCounts: true, showStress: true, showMeterBreaks: true, showRhymeScheme: true }),
  summary: [
    p("Rain, swallows, frogs, plum trees, and robins continue their spring life after the war.", ["rains-poets"]),
    excerpt(`There will come soft rains and the smell of the ground,
And swallows circling with their shimmering sound;
And frogs in the pools singing at night,`),
    p("Nature neither knows nor cares if humanity perishes utterly.", ["rains-litcharts"]),
  ],
  meaning: [
    p("The calm pastoral surface makes human violence appear temporary, while the repeated “not one” removes every possible witness.", ["rains-litcharts"]),
    excerpt(`And not one will know of the war, not one
Will care at last when it is done.`),
    p("The ending is bleak but not lifeless: Spring still wakes, joining consolation with a rebuke to human self-importance.", ["rains-database"]),
  ],
  themes: [
    { theme: "Nature’s indifference", blocks: [p("Birds, trees, and Spring continue on their own terms rather than serving as witnesses to history.", ["rains-litcharts"])] },
    { theme: "War and human fragility", blocks: [excerpt(`Not one would mind, neither bird nor tree
If mankind perished utterly;`), p("The brief mention of war expands into the possibility of total human extinction.")] },
    { theme: "Renewal and extinction", blocks: [p("Spring’s renewal survives humanity, making rebirth both hopeful and unsettling.")] },
  ],
  formAndMeter: [
    p("The twelve-line poem is arranged as six rhyming couplets, with a clear AA BB CC DD EE FF pattern.", ["rains-database"]),
    p("Loose tetrameter and regular couplets create songlike calm that contrasts with the subject of extinction."),
  ],
  literaryDevices: [
    { device: "Sensory imagery", blocks: [excerpt(`There will come soft rains and the smell of the ground,
And swallows circling with their shimmering sound;`), p("Smell and sound establish a vivid spring before the war is named.")] },
    { device: "Personification", blocks: [excerpt(`And Spring herself, when she woke at dawn,
Would scarcely know that we were gone.`), p("Spring becomes a waking figure whose indifference makes extinction intimate and strange.")] },
    { device: "Repetition", blocks: [excerpt(`Not one would mind, neither bird nor tree
If mankind perished utterly;`), p("“Not one” narrows the poem toward absolute absence.")] },
  ],
  historicalContext: [
    p("Teasdale first published the poem in Harper’s Magazine in 1918 and added “War Time” for Flame and Shadow in 1920.", ["rains-database"]),
    p("The subtitle places the peaceful landscape against World War I without depicting a battlefield.", ["rains-litcharts"]),
  ],
  citations: [
    { id: "rains-poets", source: "Academy of American Poets", url: "https://poets.org/poem/there-will-come-soft-rains" },
    { id: "rains-text", source: "Wikisource", url: "https://en.m.wikisource.org/wiki/Flame_and_Shadow/%22There_Will_Come_Soft_Rains%22" },
    { id: "rains-litcharts", source: "LitCharts", url: "https://www.litcharts.com/poetry/sara-teasdale/there-will-come-soft-rains", quote: "The poem frames humanity’s squabbles as both an affront to nature and totally insignificant in the long run." },
    { id: "rains-database", source: "Poetry Database", url: "https://poetrydatabase.com/poems/there-will-come-soft-rains/", quote: "Teasdale writes in six rhymed couplets, in a loose tetrameter that gives the lines a song-like, almost nursery-rhyme simplicity." },
  ],
  criticalViews: [{ citeId: "rains-litcharts" }, { citeId: "rains-database" }],
  faqs: [
    { q: "What is the poem’s meaning?", plain: "Nature continues after humanity destroys itself, making war seem temporary and human life fragile." },
    { q: "What are its themes?", plain: "Nature’s indifference, war, extinction, and renewal." },
    { q: "What form does it use?", plain: "Six rhyming couplets in loose tetrameter." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

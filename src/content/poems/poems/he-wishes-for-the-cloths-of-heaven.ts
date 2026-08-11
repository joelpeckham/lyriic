import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const heWishesForTheClothsOfHeavenPoem: PoemAnalysisContent = {
  slug: "he-wishes-for-the-cloths-of-heaven", status: "ready", poemTitle: "He Wishes for the Cloths of Heaven", author: "W. B. Yeats", yearPublished: 1899,
  publicDomainBasis: "First published in The Wind Among the Reeds in 1899, before the US public-domain cutoff.",
  title: "He Wishes for the Cloths of Heaven Analysis & Meaning — W. B. Yeats — lyriic",
  description: "Yeats analysis of love, dreams, poverty, vulnerability, imagery, and the poem’s compact form.",
  h1: "He Wishes for the Cloths of Heaven analysis", intro: "This analysis explains how Yeats turns heavenly fabric into a fragile offering of dreams.",
  fullTextSource: { label: "He wishes for the Cloths of Heaven", url: "https://en.wikisource.org/wiki/He_wishes_for_the_Cloths_of_Heaven", publisher: "Wikisource" },
  editorSettings: poemOpenSettings({ showCounts: true }),
  summary: [
    p("The speaker imagines giving a beloved the sky as embroidered cloth, then admits that poverty leaves only dreams to offer.", ["yeats-cloths-analysis"]),
    excerpt(`Had I the heavens' embroidered cloths,
Enwrought with golden and silver light,
The blue and the dim and the dark cloths`),
    p("The repeated image of spreading something beneath the beloved’s feet becomes a plea for emotional care.", ["yeats-cloths-analysis"]),
  ],
  meaning: [
    p("Dreams are less tangible than wealth but more personal than any material gift. The speaker offers the inner life that produced the vision.", ["yeats-cloths-analysis"]),
    excerpt(`But I, being poor, have only my dreams;
I have spread my dreams under your feet;
Tread softly because you tread on my dreams.`),
    p("The final imperative makes love vulnerable: accepting the gift gives the beloved power to hurt the speaker.", ["yeats-cloths-analysis"]),
  ],
  themes: [
    { theme: "Love and vulnerability", blocks: [p("The closing plea asks the beloved to handle the speaker’s exposed dreams gently.")] },
    { theme: "Imagination and poverty", blocks: [p("Material lack redirects the gift toward imagination and feeling.")] },
    { theme: "Idealization", blocks: [p("The beloved is placed above cloths made from the heavens, giving devotion a near-sacred scale.")] },
  ],
  formAndMeter: [
    p("The poem is a single eight-line stanza divided into two quatrains by its ABAB CDCD rhyme pattern.", ["yeats-cloths-form"]),
    p("Loose four-beat accentual verse and repeated end words make the short poem feel tightly woven rather than mechanically regular.", ["yeats-cloths-form"]),
  ],
  literaryDevices: [
    { device: "Extended metaphor", blocks: [excerpt(`Had I the heavens' embroidered cloths`), p("The sky becomes fabric that can be embroidered and spread beneath the beloved.")] },
    { device: "Visual imagery", blocks: [excerpt(`The blue and the dim and the dark cloths
Of night and light and the half-light,`), p("Gradations of light create a whole imagined sky.")] },
    { device: "Repetition", blocks: [excerpt(`I would spread the cloths under your feet:
But I, being poor, have only my dreams;`), p("The shift from hypothetical cloths to actual dreams changes fantasy into an offering.")] },
  ],
  historicalContext: [
    p("Yeats published the poem in The Wind Among the Reeds in 1899; the earlier title was “Aedh Wishes for the Cloths of Heaven.”", ["yeats-cloths-form"]),
    p("The Academy of American Poets records Joseph Hone’s remark that this poem was “the way to lose” a lady, a comment that underscores its vulnerable rather than triumphant courtship.", ["yeats-cloths-critical"]),
  ],
  citations: [
    { id: "yeats-cloths-text", source: "Wikisource", url: "https://en.wikisource.org/wiki/He_wishes_for_the_Cloths_of_Heaven" },
    { id: "yeats-cloths-analysis", source: "LitCharts", quote: "Love, this short but powerful poem suggests, can feel at once transcendently beautiful and perilous.", url: "https://www.litcharts.com/poetry/william-butler-yeats/he-wishes-for-the-cloths-of-heaven" },
    { id: "yeats-cloths-form", source: "LitCharts", quote: "The poem is written in a single octave (or eight-line stanza)", url: "https://www.litcharts.com/poetry/william-butler-yeats/he-wishes-for-the-cloths-of-heaven" },
    { id: "yeats-cloths-critical", source: "Academy of American Poets", quote: "Aedh wishes for the Cloths of Heaven is the way to lose one.", url: "https://poets.org/poem/aedh-wishes-cloths-heaven" },
  ],
  criticalViews: [{ citeId: "yeats-cloths-analysis" }, { citeId: "yeats-cloths-critical" }],
  faqs: [
    { q: "What is the poem’s meaning?", plain: "The speaker offers dreams instead of the heavenly riches he imagines and asks the beloved to treat them gently." },
    { q: "What are its themes?", plain: "Love, vulnerability, imagination, poverty, and idealization." },
    { q: "What form does it use?", plain: "One eight-line stanza with an ABAB CDCD rhyme pattern and loose four-beat rhythm." },
  ],
  cta: "Write with this poem’s rhythm in the editor",
};

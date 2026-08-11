import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const thirteenWaysOfLookingAtABlackbirdPoem: PoemAnalysisContent = {
  slug: "thirteen-ways-of-looking-at-a-blackbird", status: "ready", poemTitle: "Thirteen Ways of Looking at a Blackbird",
  author: "Wallace Stevens", yearPublished: 1917,
  publicDomainBasis: "First published in 1917 and public domain in the United States.",
  title: "Thirteen Ways of Looking at a Blackbird Analysis & Meaning — Wallace Stevens — lyriic",
  description: "Analysis of Thirteen Ways of Looking at a Blackbird: perception, free verse, imagery, and shifting viewpoints.",
  h1: "Thirteen Ways of Looking at a Blackbird analysis",
  intro: "Stevens presents thirteen brief encounters with one bird, making meaning emerge through shifting perspectives rather than one symbol.",
  fullTextSource: { label: "Thirteen Ways of Looking at a Blackbird", url: "https://www.poetryfoundation.org/poems/45236/thirteen-ways-of-looking-at-a-blackbird", publisher: "Poetry Foundation" },
  editorSettings: poemOpenSettings({ showCounts: true, showRulers: false }),
  summary: [
    p("Thirteen numbered sections place a blackbird in natural, social, visual, and intellectual settings.", ["blackbird-litcharts"]),
    excerpt(`Among twenty snowy mountains,
The only moving thing
Was the eye of the blackbird.`),
    p("The poem accumulates sensations rather than presenting one continuous narrative or fixed meaning.", ["blackbird-interesting"]),
  ],
  meaning: [
    p("The blackbird changes with the observer: it can be an eye, a shadow, a sound, a boundary, or simply a bird.", ["blackbird-litcharts"]),
    excerpt(`I do not know which to prefer,
The beauty of inflections
Or the beauty of innuendoes,`),
    p("The closing section reverses the opening: snow moves while the blackbird is still, showing perception as relational and changeable.", ["blackbird-interesting"]),
  ],
  themes: [
    { theme: "Perception and perspective", blocks: [p("Each section supplies a new angle; no single viewpoint cancels the others.", ["blackbird-litcharts"])] },
    { theme: "Imagination and reality", blocks: [excerpt(`Why do you imagine golden birds?
Do you not see how the blackbird
Walks around the feet`), p("Imagined golden birds contrast with attention to the ordinary bird at hand.")] },
    { theme: "Change and stillness", blocks: [excerpt(`It was evening all afternoon.
It was snowing
And it was going to snow.`), p("The final temporal instability prepares the still blackbird in the cedar limbs.")] },
  ],
  formAndMeter: [
    p("The poem consists of thirteen numbered sections ranging from two to seven lines.", ["blackbird-interesting"]),
    p("It uses free verse rather than fixed meter or end rhyme; pauses, repetition, and compressed images create its rhythm.", ["blackbird-sparknotes"]),
  ],
  literaryDevices: [
    { device: "Juxtaposition", blocks: [excerpt(`Among twenty snowy mountains,
The only moving thing`), p("Dark movement against white stillness makes perception immediate.")] },
    { device: "Paradox", blocks: [excerpt(`It was evening all afternoon.`), p("The contradiction makes ordinary time feel unstable.")] },
    { device: "Repetition and variation", blocks: [excerpt(`A man and a woman
Are one.
A man and a woman and a blackbird`), p("The added bird changes the meaning of the repeated declaration.")] },
  ],
  historicalContext: [
    p("The poem first appeared in Others in 1917 and was later collected in Harmonium (1923).", ["blackbird-interesting"]),
    p("Its short, haiku-like sections reflect modernist interest in concentrated images and multiple viewpoints.", ["blackbird-sparknotes"]),
  ],
  citations: [
    { id: "blackbird-text", source: "Poetry Foundation", url: "https://www.poetryfoundation.org/poems/45236/thirteen-ways-of-looking-at-a-blackbird" },
    { id: "blackbird-litcharts", source: "LitCharts", url: "https://www.litcharts.com/poetry/wallace-stevens/thirteen-ways-of-looking-at-a-blackbird", quote: "reality is always a matter of perspective" },
    { id: "blackbird-interesting", source: "Interesting Literature", author: "Oliver Tearle", url: "https://interestingliterature.com/2020/04/thirteen-ways-looking-blackbird-stevens-summary-analysis/", quote: "He is not setting out to offer one unified vision or interpretation of the bird." },
    { id: "blackbird-sparknotes", source: "SparkNotes", url: "https://www.sparknotes.com/poetry/thirteen-ways/", quote: "Each stanza offers a fragmentary, haiku-like perspective on a blackbird." },
  ],
  criticalViews: [{ citeId: "blackbird-interesting" }, { citeId: "blackbird-sparknotes" }],
  faqs: [
    { q: "What is the main meaning?", plain: "The poem shows that perception shapes meaning and resists one final interpretation of the bird." },
    { q: "What are its themes?", plain: "Perspective, imagination and reality, nature and knowledge, movement, and stillness." },
    { q: "What form does it use?", plain: "Thirteen irregular free-verse sections with haiku-like compression." },
  ],
  cta: "Open the zen editor",
};

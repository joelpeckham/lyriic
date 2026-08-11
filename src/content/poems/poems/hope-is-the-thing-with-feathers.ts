import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const hopeIsTheThingWithFeathersPoem: PoemAnalysisContent = {
  slug: "hope-is-the-thing-with-feathers", status: "ready", poemTitle: "Hope Is the Thing with Feathers", author: "Emily Dickinson", yearPublished: 1891,
  publicDomainBasis: "First published posthumously in 1891, before the US public-domain cutoff.",
  title: "Hope Is the Thing with Feathers Analysis & Meaning — Emily Dickinson — lyriic",
  description: "Dickinson analysis of hope’s bird metaphor, resilience, hymn meter, themes, and meaning.",
  h1: "Hope Is the Thing with Feathers analysis", intro: "This analysis explains how Dickinson turns hope into a wordless bird that sings through hardship.",
  fullTextSource: { label: "Hope is the thing with feathers", url: "https://www.poetryfoundation.org/poems/42889/hope-is-the-thing-with-feathers-314", publisher: "Poetry Foundation" },
  editorSettings: poemMeterSettings("common-meter", { showCounts: true, showStress: true, showMeterBreaks: true }),
  summary: [
    p("Dickinson imagines hope as a bird living in the soul, singing continuously and offering warmth without demanding payment.", ["hope-dickinson-criticism"]),
    excerpt(`“Hope” is the thing with feathers -
That perches in the soul -
And sings the tune without the words -`),
    p("The bird’s song survives gale, cold, and sea; the final stanza says it has never asked even a crumb in return.", ["hope-dickinson-text"]),
  ],
  meaning: [
    p("The central metaphor makes hope intimate yet independent: it lives within the soul but does not depend on words or conscious effort.", ["hope-dickinson-criticism"]),
    excerpt(`And sweetest - in the Gale - is heard -
And sore must be the storm -
That could abash the little Bird`),
    p("Hope is strongest under pressure and radically selfless, sustaining people without demanding certainty or proof.", ["hope-dickinson-criticism"]),
  ],
  themes: [
    { theme: "Inner resource", blocks: [p("The bird perches in the soul, presenting hope as a capacity already present within a person.")] },
    { theme: "Endurance", blocks: [p("Gale, storm, chill, and sea test the bird’s persistence.")] },
    { theme: "Generosity", blocks: [p("Hope keeps people warm but asks no crumb in return.")] },
  ],
  formAndMeter: [
    p("Three quatrains broadly follow common meter, alternating iambic tetrameter and trimeter.", ["hope-dickinson-form"]),
    p("Dashes interrupt the hymn-like pulse, while slant rhymes keep the form flexible rather than mechanically neat.", ["hope-dickinson-criticism"]),
  ],
  literaryDevices: [
    { device: "Extended metaphor", blocks: [excerpt(`“Hope” is the thing with feathers -`), p("Perching, singing, and surviving weather develop the bird comparison across the poem.")] },
    { device: "Personification", blocks: [excerpt(`It asked a crumb - of me.`), p("Hope is given intention, then shown to ask for nothing.")] },
    { device: "Sound imagery", blocks: [excerpt(`And sings the tune without the words -`), p("The wordless song suggests that hope can be felt before it is explained.")] },
  ],
  historicalContext: [
    p("Dickinson wrote the poem around 1861; it was first published posthumously in 1891.", ["hope-dickinson-history"]),
    p("Susannah Fullerton describes it as hymn-like and emphasizes Dickinson’s dashes, capitalization, and the bird’s persistence through storms.", ["hope-dickinson-criticism"]),
  ],
  citations: [
    { id: "hope-dickinson-text", source: "Poetry Foundation", url: "https://www.poetryfoundation.org/poems/42889/hope-is-the-thing-with-feathers-314" },
    { id: "hope-dickinson-criticism", source: "Susannah Fullerton", quote: "This poem is like a hymn. In its use of the bird as an extended metaphor, Hope does not disappear when it faces storms of hardship, but sings on.", url: "https://susannahfullerton.com.au/emily-dickinson-hope-is-the-thing-with-feathers/" },
    { id: "hope-dickinson-form", source: "LitCharts", quote: "Hope is the thing with feathers is a kind of hymn of praise", url: "https://www.litcharts.com/poetry/emily-dickinson/hope-is-the-thing-with-feathers" },
    { id: "hope-dickinson-history", source: "Owl Eyes", quote: "Publication Date: 1891", url: "https://www.owleyes.org/text/hope-is-the-thing-with-feathers" },
  ],
  criticalViews: [{ citeId: "hope-dickinson-criticism" }, { citeId: "hope-dickinson-form" }],
  faqs: [
    { q: "What is the poem’s meaning?", plain: "Hope is a persistent inner strength that sings through hardship and gives without asking anything in return." },
    { q: "What does the bird symbolize?", plain: "It symbolizes hope as a living, resilient, selfless force within the soul." },
    { q: "What meter does the poem use?", plain: "It broadly uses common meter, with Dickinson’s dashes and slant rhymes disrupting a strict hymn pattern." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

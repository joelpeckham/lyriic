import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const theSecondComingPoem: PoemAnalysisContent = {
  slug: "the-second-coming", status: "ready", poemTitle: "The Second Coming", author: "William Butler Yeats", yearPublished: 1920,
  publicDomainBasis: "First published in The Dial in 1920, before the US public-domain cutoff.",
  title: "The Second Coming Analysis & Meaning — William Butler Yeats — lyriic", description: "The Second Coming analysis: gyres, collapse, apocalypse, spiritual crisis, and the rough beast.", h1: "The Second Coming analysis",
  intro: "Yeats turns a falcon’s lost command and a sphinx-like beast into a vision of civilization entering a terrifying new cycle.",
  fullTextSource: { label: "The Second Coming", url: "https://celt.ucc.ie/published/E910001-066.html", publisher: "University College Cork" },
  editorSettings: poemOpenSettings({ showCounts: true }),
  summary: [p("The first stanza describes a world whose centre cannot hold: authority, innocence, and conviction collapse while anarchy spreads."), excerpt(`Turning and turning in the widening gyre
The falcon cannot hear the falconer;
Things fall apart; the centre cannot hold;`), p("The expected Christian revelation becomes a desert vision of a hybrid rough beast moving toward Bethlehem.", ["second-moore"])],
  meaning: [p("The gyre represents Yeats’s cyclical theory of history. Its widening motion suggests an era expanding beyond the authority that once contained it.", ["second-litcharts"]), excerpt(`A shape with lion body and the head of a man,
A gaze blank and pitiless as the sun,`), p("The poem reverses the Second Coming: instead of a savior, an unnamed force approaches. Its ambiguity allows later readers to apply the image to different crises.", ["second-moore"])],
  themes: [
    { theme: "Historical cycles", blocks: [p("The widening gyre catches a cycle at the point where its centre can no longer contain released forces.")] },
    { theme: "Collapse of authority", blocks: [p("Falcon and falconer lose contact, while the best lack conviction.")] },
    { theme: "Reversed revelation", blocks: [excerpt(`And what rough beast, its hour come round at last,
Slouches towards Bethlehem to be born?`), p("Birth becomes ominous rather than redemptive.")] },
  ],
  formAndMeter: [p("The poem has two stanzas, eight lines followed by fourteen. Its second stanza is sonnet-like in length but not conventionally ordered."), p("Irregular blank verse, enjambment, and partial rhyme make formal instability echo the collapsing order.", ["second-litcharts"])],
  literaryDevices: [
    { device: "Symbolism", blocks: [excerpt(`Turning and turning in the widening gyre`), p("The gyre symbolizes cyclical history moving toward violent transition.")] },
    { device: "Extended metaphor", blocks: [excerpt(`The falcon cannot hear the falconer;`), p("The lost bird becomes an image of failed communication and authority.")] },
    { device: "Allusion and inversion", blocks: [excerpt(`Surely the Second Coming is at hand;`), p("Christian prophecy is invoked and then darkly overturned.")] },
  ],
  historicalContext: [p("Yeats wrote the poem in January 1919 amid the aftermath of World War I, unrest in Ireland, and the influenza pandemic. It appeared in The Dial in November 1920."), p("The poem draws on Yeats’s mystical system of interlocking gyres and combines biblical, occult, and mythic language.", ["second-moore"])],
  citations: [
    { id: "second-text", source: "University College Cork CELT", url: "https://celt.ucc.ie/published/E910001-066.html" },
    { id: "second-moore", source: "Moore Institute, University of Galway", author: "Adrian Paterson", url: "https://mooreinstitute.ie/2020/12/18/9809/", quote: "The poem reveals, in other words, an order, a twisted logic behind the apparent disorder of the contemporary world" },
    { id: "second-litcharts", source: "LitCharts", url: "https://www.litcharts.com/poetry/william-butler-yeats/the-second-coming", quote: "the gyre is an image Yeats uses to symbolize grand, sweeping historical movements as a kind of spiral" },
    { id: "second-context", source: "University College Cork CELT", url: "https://celt.ucc.ie/published/E910001-066.html" },
  ],
  criticalViews: [{ citeId: "second-moore" }, { citeId: "second-litcharts" }],
  faqs: [
    { q: "What is the main meaning?", plain: "Yeats presents a civilization losing its centre as one historical cycle ends and a frightening new force emerges." },
    { q: "What does the gyre mean?", plain: "It is a spiral image for Yeats’s theory of recurring historical cycles." },
    { q: "What is the rough beast?", plain: "It is an intentionally ambiguous hybrid representing a brutal new historical force or era." },
  ],
  cta: "Write with this poem’s open form in the editor",
};

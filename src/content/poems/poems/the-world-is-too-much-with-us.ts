import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const theWorldIsTooMuchWithUsPoem: PoemAnalysisContent = {
  slug: "the-world-is-too-much-with-us", status: "ready", poemTitle: "The World Is Too Much with Us",
  author: "William Wordsworth", yearPublished: 1807,
  publicDomainBasis: "Published in 1807 and public domain in the United States.",
  title: "The World Is Too Much with Us Analysis & Meaning — William Wordsworth — lyriic",
  description: "Analysis of Wordsworth’s sonnet on materialism, spiritual loss, nature, myth, and Romantic protest.",
  h1: "The World Is Too Much with Us analysis",
  intro: "Wordsworth’s sonnet argues that commercial life has made people spiritually numb to the living power of nature.",
  fullTextSource: { label: "The World Is Too Much with Us", url: "https://poets.org/poem/world-too-much-us", publisher: "Academy of American Poets" },
  editorSettings: poemMeterSettings("iambic-pentameter", { showCounts: true, showStress: true, showMeterBreaks: true, showRhymeScheme: true }),
  summary: [
    p("The speaker says “getting and spending” has wasted human powers and severed people from nature.", ["world-poets"]),
    excerpt(`The world is too much with us; late and soon,
Getting and spending, we lay waste our powers;
Little we see in Nature that is ours;`),
    p("The sestet imagines pagan myth as a desperate alternative to modern indifference.", ["world-litcharts"]),
  ],
  meaning: [
    p("Economic language—getting, spending, giving, and boon—makes feeling sound like something traded away for material gain.", ["world-poetrylovers"]),
    excerpt(`For this, for everything, we are out of tune;
It moves us not.—Great God! I’d rather be
A Pagan suckled in a creed outworn;`),
    p("Proteus and Triton represent an imaginative world in which natural power remains spiritually legible.", ["world-poemanalysis"]),
  ],
  themes: [
    { theme: "Materialism and spiritual loss", blocks: [p("Commerce has become a way of life that consumes attention and emotional power.", ["world-litcharts"])] },
    { theme: "Humanity and nature", blocks: [excerpt(`This Sea that bares her bosom to the moon;
The winds that will be howling at all hours,`), p("Nature remains vivid; the failure is human responsiveness.")] },
    { theme: "Imagination and belief", blocks: [p("Myth makes the sea and wind newly visible as living, meaningful forces.", ["world-poemanalysis"])] },
  ],
  formAndMeter: [
    p("This is a Petrarchan sonnet: an ABBAABBA octave turns toward a CDCDCD sestet.", ["world-poetrylovers"]),
    p("Its predominant meter is iambic pentameter. The octave diagnoses alienation; the sestet turns to an impossible imaginative solution."),
  ],
  literaryDevices: [
    { device: "Personification", blocks: [excerpt(`This Sea that bares her bosom to the moon;`), p("The sea becomes a living presence rather than a resource.", ["world-poetrylovers"])] },
    { device: "Simile", blocks: [excerpt(`And are up-gathered now like sleeping flowers;`), p("The invisible winds become organic and temporarily still.")] },
    { device: "Classical allusion", blocks: [excerpt(`Have sight of Proteus rising from the sea;
Or hear old Triton blow his wreathèd horn.`), p("Myth restores wonder to a landscape modern people fail to feel.")] },
  ],
  historicalContext: [
    p("Wordsworth wrote the sonnet around 1802–04 and published it in 1807 during the Romantic response to industrialization and commerce.", ["world-litcharts"]),
    p("Its “getting and spending” critique turns the period’s commercial transformation into a crisis of attention and feeling.", ["world-poetrylovers"]),
  ],
  citations: [
    { id: "world-poets", source: "Academy of American Poets", url: "https://poets.org/poem/world-too-much-us" },
    { id: "world-litcharts", source: "LitCharts", url: "https://www.litcharts.com/poetry/william-wordsworth/the-world-is-too-much-with-us", quote: "the poem describes it from three angles: economic, spiritual, and cultural" },
    { id: "world-poetrylovers", source: "Poetry Lovers’ Page", url: "https://www.poetryloverspage.com/poets/wordsworth/the_world_is_too_much_with_us/literary-analysis", quote: "The poem is a Petrarchan sonnet in fourteen lines of iambic pentameter." },
    { id: "world-poemanalysis", source: "Poem Analysis", url: "https://poemanalysis.com/william-wordsworth/the-world-is-too-much-with-us/", quote: "laments humanity’s disconnection from nature due to materialistic pursuits and industrialization." },
  ],
  criticalViews: [{ citeId: "world-litcharts" }, { citeId: "world-poetrylovers" }],
  faqs: [
    { q: "What is the main meaning?", plain: "Commercial life has made people spiritually numb to nature and imagination." },
    { q: "What are the themes?", plain: "Materialism, alienation from nature, spiritual loss, and mythic imagination." },
    { q: "What form does it use?", plain: "A Petrarchan sonnet in predominantly iambic pentameter." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

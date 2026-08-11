import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const theWalrusAndTheCarpenterPoem: PoemAnalysisContent = {
  slug: "the-walrus-and-the-carpenter", status: "ready", poemTitle: "The Walrus and the Carpenter",
  author: "Lewis Carroll", yearPublished: 1871,
  publicDomainBasis: "Published in Through the Looking-Glass in 1871 and public domain in the United States.",
  title: "The Walrus and the Carpenter Analysis & Meaning — Lewis Carroll — lyriic",
  description: "Analysis of The Walrus and the Carpenter: nonsense, deception, appetite, power, and dark humor.",
  h1: "The Walrus and the Carpenter analysis",
  intro: "Carroll’s cheerful nonsense story uses musical form and predatory comedy to expose false sympathy and exploitation.",
  fullTextSource: { label: "Through the Looking-Glass, Chapter IV", url: "https://en.wikisource.org/wiki/Through_the_Looking-Glass,_and_What_Alice_Found_There/Chapter_IV", publisher: "Wikisource" },
  editorSettings: poemMeterSettings("iambic-tetrameter", { showMeterBreaks: true, showRhymeScheme: true }),
  summary: [
    p("The Walrus and the Carpenter invite young Oysters for a pleasant walk, then eat them all.", ["walrus-litcharts"]),
    excerpt(`“O Oysters, come and walk with us!”
The Walrus did beseech.
“A pleasant walk, a pleasant talk,`),
    p("The poem’s nursery-like music makes the betrayal comic on the surface and disturbing underneath.", ["walrus-poemanalysis"]),
  ],
  meaning: [
    p("The Walrus uses flattery, sympathy, and distracting talk to manage the Oysters, while the Carpenter states the appetite more directly.", ["walrus-litcharts"]),
    excerpt(`“A loaf of bread,” the Walrus said,
“Is what we chiefly need:
Pepper and vinegar besides`),
    p("The eldest Oyster’s refusal offers a small contrast: caution protects him where trust destroys the younger Oysters.", ["walrus-interesting"]),
  ],
  themes: [
    { theme: "Deception and false sympathy", blocks: [excerpt(`“I weep for you,” the Walrus said.
“I deeply sympathize!”`), p("Emotional language becomes a mask for predation.", ["walrus-litcharts"])] },
    { theme: "Power and exploitation", blocks: [p("The stronger characters lead vulnerable creatures away from safety and consume them.") ] },
    { theme: "Nonsense and dark humor", blocks: [excerpt(`Their shoes were brushed and clean—
And this was odd, because, you know,
They hadn’t any feet.`), p("Logical contradiction keeps the scene playful while making its violence stranger.")] },
  ],
  formAndMeter: [
    p("The poem uses eighteen six-line stanzas with a recurring ballad-like ABCBDB rhyme pattern.", ["walrus-poemanalysis"]),
    p("Alternating tetrameter and trimeter make the walk feel safe and songlike, which sharpens the irony of the ending."),
  ],
  literaryDevices: [
    { device: "Personification", blocks: [excerpt(`The moon was shining sulkily,
Because she thought the sun`), p("Talking celestial bodies establish an impossible but emotionally recognizable world.")] },
    { device: "Bathos and irony", blocks: [excerpt(`“I weep for you,” the Walrus said.
“I deeply sympathize!”`), p("Grand feeling sits beside practical eating, exposing sympathy as theatrical.")] },
    { device: "Accumulation", blocks: [excerpt(`And thick and fast they came at last,
And more, and more, and more—`), p("Repetition turns the Oysters’ arrival into a comic flood and increases the scale of the meal.")] },
  ],
  historicalContext: [
    p("The poem appears in Chapter IV of Through the Looking-Glass, where Tweedledum and Tweedledee recite it to Alice.", ["walrus-text"]),
    p("It belongs to Victorian nonsense verse; criticism cautions against forcing the characters into one fixed allegory.", ["walrus-interesting"]),
  ],
  citations: [
    { id: "walrus-text", source: "Wikisource", url: "https://en.wikisource.org/wiki/Through_the_Looking-Glass,_and_What_Alice_Found_There/Chapter_IV" },
    { id: "walrus-litcharts", source: "LitCharts", url: "https://www.litcharts.com/poetry/lewis-carroll/the-walrus-and-the-carpenter", quote: "the poem makes some subtle points about greed, power, and hypocrisy." },
    { id: "walrus-poemanalysis", source: "Poem Analysis", url: "https://poemanalysis.com/lewis-carroll/the-walrus-and-the-carpenter/", quote: "The story of a deceptive little fable wrapped in cheerful, musical nonsense." },
    { id: "walrus-interesting", source: "Interesting Literature", author: "Oliver Tearle", url: "https://interestingliterature.com/2017/02/a-short-analysis-of-lewis-carrolls-the-walrus-and-the-carpenter/", quote: "nonsense doesn’t like to offer itself up to easily graspable analytical readings." },
  ],
  criticalViews: [{ citeId: "walrus-litcharts" }, { citeId: "walrus-interesting" }],
  faqs: [
    { q: "What is the poem’s main meaning?", plain: "It shows how appetite and exploitation can hide behind friendliness, sympathy, and entertaining talk." },
    { q: "What are its themes?", plain: "Deception, power, false sympathy, blind trust, and the uneasy mixture of nonsense with cruelty." },
    { q: "What is its form?", plain: "A ballad-like poem of eighteen six-line stanzas with alternating tetrameter and trimeter." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

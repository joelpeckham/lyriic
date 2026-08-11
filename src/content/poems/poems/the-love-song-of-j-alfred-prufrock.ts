import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const theLoveSongOfJAlfredPrufrockPoem: PoemAnalysisContent = {
  slug: "the-love-song-of-j-alfred-prufrock", status: "ready",
  poemTitle: "The Love Song of J. Alfred Prufrock", author: "T. S. Eliot", yearPublished: 1915,
  publicDomainBasis: "First published in 1915, before the US public-domain cutoff.",
  title: "The Love Song of J. Alfred Prufrock Analysis & Meaning — T. S. Eliot — lyriic",
  description: "Prufrock analysis: modernist alienation, hesitation, aging, imagery, and the fear behind “Do I dare?”",
  h1: "The Love Song of J. Alfred Prufrock analysis",
  intro: "Eliot’s dramatic monologue turns social hesitation into a modernist study of self-consciousness, time, and failed connection.",
  fullTextSource: { label: "Prufrock and Other Observations", url: "https://en.wikisource.org/wiki/Prufrock_and_Other_Observations/The_Love_Song_of_J._Alfred_Prufrock", publisher: "Wikisource" },
  editorSettings: poemOpenSettings({ showCounts: true }),
  summary: [
    p("Prufrock imagines an evening visit through streets and drawing rooms, but the proposed encounter never becomes decisive. His thoughts repeatedly return to appearance, age, and social judgment."),
    excerpt(`Let us go then, you and I,
When the evening is spread out against the sky
Like a patient etherized upon a table;`),
    p("The poem ends in a sea fantasy where the mermaids sing to one another, not to Prufrock. Human voices wake the dreamer, and “we drown” closes the possibility of escape.", ["prufrock-criticism"]),
  ],
  meaning: [
    p("The poem presents paralysis as a condition of excessive interpretation. Prufrock can imagine “a hundred indecisions,” but every possible action is revised before it happens.", ["prufrock-criticism"]),
    excerpt(`And indeed there will be time
To wonder, "Do I dare?" and, "Do I dare?"
Time to turn back and descend the stair,`),
    p("His alienation is social and inward: other people become eyes and formulas that pin him in place. The inability to say what he means becomes the poem’s central dramatic event.", ["prufrock-litcharts"]),
  ],
  themes: [
    { theme: "Indecision", blocks: [p("Repeated questions turn a minor social risk into an existential crisis.")] },
    { theme: "Modern alienation", blocks: [p("Urban streets, drawing rooms, and disconnected voices place people near one another without intimacy.", ["prufrock-criticism"])] },
    { theme: "Time and aging", blocks: [excerpt(`I have measured out my life with coffee spoons;`), p("The image makes a life feel divided into small, repetitive rituals.")] },
    { theme: "Failed connection", blocks: [p("Prufrock expects even revelation to be answered with misunderstanding, so speech cannot secure intimacy.")] },
  ],
  formAndMeter: [
    p("This modernist dramatic monologue uses irregular free verse, short rhyming passages, refrains, dialogue, and abrupt shifts rather than one fixed meter."),
    p("Recurring lines such as “In the room the women come and go” create structure through echo and return. The poem’s form imitates thought that circles instead of arriving."),
  ],
  literaryDevices: [
    { device: "Simile", blocks: [excerpt(`Like a patient etherized upon a table;`), p("The opening image replaces a romantic evening with suspended consciousness, establishing paralysis immediately.")] },
    { device: "Personification", blocks: [excerpt(`The yellow fog that rubs its back upon the window-panes,`), p("The catlike fog softens and encloses the city, mirroring Prufrock’s indirect movement.")] },
    { device: "Repetition", blocks: [excerpt(`In the room the women come and go
Talking of Michelangelo.`), p("The refrain makes fashionable conversation feel cyclical and impersonal.")] },
  ],
  historicalContext: [
    p("The poem appeared in Poetry in 1915 and in Prufrock and Other Observations in 1917. Its fractured voice and urban imagery make it an early English-language modernist landmark."),
    p("The Italian epigraph and allusions to Michelangelo, Hamlet, Lazarus, and John the Baptist place private anxiety inside a dense literary tradition.", ["prufrock-litcharts"]),
  ],
  citations: [
    { id: "prufrock-text", source: "Wikisource", url: "https://en.wikisource.org/wiki/Prufrock_and_Other_Observations/The_Love_Song_of_J._Alfred_Prufrock" },
    { id: "prufrock-criticism", source: "Literary Theory and Criticism", url: "https://literariness.org/2020/07/05/analysis-of-t-s-eliots-love-song-of-j-alfred-prufrock/", quote: "Prufrock’s dilemma is not that he is trapped but that he thinks that he knows that he is trapped." },
    { id: "prufrock-litcharts", source: "LitCharts", url: "https://www.litcharts.com/poetry/t-s-eliot/the-love-song-of-j-alfred-prufrock", quote: "The speaker in “The Love Song of J. Alfred Prufrock” is paralyzed by indecision." },
    { id: "prufrock-context", source: "Wikisource", url: "https://en.wikisource.org/wiki/Prufrock_and_Other_Observations/The_Love_Song_of_J._Alfred_Prufrock" },
  ],
  criticalViews: [{ citeId: "prufrock-criticism" }, { citeId: "prufrock-litcharts" }],
  faqs: [
    { q: "What is the main meaning of Prufrock?", plain: "The poem explores how fear of judgment and self-consciousness prevent action and connection." },
    { q: "What does “Do I dare?” mean?", plain: "It turns an unnamed social risk into a crisis, making hesitation the poem’s central action." },
    { q: "What do the coffee spoons suggest?", plain: "They suggest a life measured by small, repetitive social rituals." },
  ],
  cta: "Write with this poem’s open form in the editor",
};

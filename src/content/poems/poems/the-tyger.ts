import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const theTygerPoem: PoemAnalysisContent = {
  slug: "the-tyger", status: "ready", poemTitle: "The Tyger", author: "William Blake", yearPublished: 1794,
  publicDomainBasis: "Published in Songs of Experience in 1794 and public domain in the United States.",
  title: "The Tyger Analysis & Meaning — William Blake — lyriic",
  description: "The Tyger analysis and meaning: Blake’s creation questions, forge imagery, beauty, terror, and mystery.",
  h1: "The Tyger analysis",
  intro: "Blake’s repeated questions and forge imagery make creation both beautiful and frightening, without resolving the mystery.",
  fullTextSource: { label: "The Tyger", url: "https://www.poetryfoundation.org/poems/43687/the-tyger", publisher: "Poetry Foundation" },
  editorSettings: poemMeterSettings("trochaic-tetrameter", { showMeterBreaks: true, showRhymeScheme: true }),
  summary: [
    p("The speaker addresses a tiger whose beauty and violence provoke questions about the identity and courage of its maker.", ["tyger-pf"]),
    excerpt(`Tyger Tyger, burning bright,
In the forests of the night;
What immortal hand or eye,`),
    p("The closing stanza repeats the opening but changes “Could” to “Dare,” intensifying the question from ability to audacity.", ["tyger-blake101"]),
  ],
  meaning: [
    p("“Fearful symmetry” joins order and terror. Blake does not reduce the Tyger to simple evil; unanswered questions keep its moral meaning open.", ["tyger-interesting"]),
    excerpt(`What the hammer? what the chain,
In what furnace was thy brain?
What the anvil? what dread grasp.`),
    p("The question about the Lamb places innocence and experience in one creation, making contradiction central to the poem.", ["tyger-blake101"]),
  ],
  themes: [
    { theme: "Creation and mystery", blocks: [p("The speaker can imagine a maker but cannot explain or identify that maker; uncertainty is the poem’s central condition.", ["tyger-blake101"])] },
    { theme: "Beauty and terror", blocks: [excerpt(`Could frame thy fearful symmetry?`), p("The phrase holds attraction and danger together in a single image.")] },
    { theme: "Innocence and experience", blocks: [p("“Did he who made the Lamb make thee?” connects this poem to Blake’s companion poem and its different moral atmosphere.", ["tyger-blake101"])] },
  ],
  formAndMeter: [
    p("The poem has six quatrains and is commonly read as catalectic trochaic tetrameter. The falling beat suits the hammering forge imagery.", ["tyger-pf"]),
    p("Repeated opening and closing stanzas create a circular structure, while the final “Dare” marks its key variation."),
  ],
  literaryDevices: [
    { device: "Rhetorical questions", blocks: [excerpt(`What immortal hand or eye,
Could frame thy fearful symmetry?`), p("The accumulation of questions makes uncertainty a formal effect.", ["tyger-blake101"])] },
    { device: "Forge imagery", blocks: [excerpt(`What the hammer? what the chain,
In what furnace was thy brain?`), p("Tools recast creation as physical, forceful labor.", ["tyger-interesting"])] },
    { device: "Repetition and variation", blocks: [excerpt(`Could frame thy fearful symmetry?
... Dare frame thy fearful symmetry?`), p("The altered verb changes the poem’s final pressure from capacity to moral nerve.")] },
  ],
  historicalContext: [
    p("Blake published the poem in Songs of Experience (1794), paired conceptually with Songs of Innocence and its poem “The Lamb.”", ["tyger-blake101"]),
    p("Blake was both poet and engraver; the image of a maker shaping a creature through fire resonates with his material art practice.", ["tyger-blake101"]),
  ],
  citations: [
    { id: "tyger-pf", source: "Poetry Foundation", url: "https://www.poetryfoundation.org/poems/43687/the-tyger" },
    { id: "tyger-interesting", source: "Interesting Literature", author: "Oliver Tearle", url: "https://interestingliterature.com/2023/04/blake-tyger-symbolism-imagery/", quote: "God is thus ‘reduced’ to the status of an artisan or skilled craftsman." },
    { id: "tyger-britannica", source: "Britannica", url: "https://www.britannica.com/topic/The-Tyger", quote: "The tiger is the key image in the Songs of Experience, the embodiment of an implacable primal power." },
    { id: "tyger-blake101", source: "Poetry Foundation", url: "https://www.poetryfoundation.org/articles/91570/william-blake-101", quote: "Blake chooses to leave the question unanswered, creating a powerful, ambiguous space for readers to explore their own answers." },
  ],
  criticalViews: [{ citeId: "tyger-interesting" }, { citeId: "tyger-blake101" }],
  faqs: [
    { q: "What is the main meaning of The Tyger?", plain: "It asks how one creator could make something both beautiful and terrifying, and leaves the question unresolved." },
    { q: "What does the Tyger symbolize?", plain: "It can suggest fierce energy, danger, sublime power, or an unknowable aspect of creation." },
    { q: "What meter does it use?", plain: "It is commonly read as catalectic trochaic tetrameter." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

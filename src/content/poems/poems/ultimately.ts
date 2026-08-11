import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const ultimatelyPoem: PoemAnalysisContent = {
  slug: "ultimately", status: "ready", poemTitle: "Ultimately", author: "Ernest Hemingway", yearPublished: 1923,
  publicDomainBasis: "Published before 1931 and public domain in the United States.",
  title: "Ultimately Analysis & Meaning — Ernest Hemingway — lyriic",
  description: "Ultimately analysis and meaning: Hemingway’s compressed poem makes truth physical, messy, and uncontrollable.",
  h1: "Ultimately analysis",
  intro: "This four-line poem turns the act of telling the truth into a vivid physical struggle between hesitation and overflow.",
  fullTextSource: { label: "Ultimately", url: "https://en.wikisource.org/wiki/Ultimately", publisher: "Wikisource" },
  editorSettings: poemOpenSettings(),
  summary: [
    p("An unnamed man tries to speak truth, beginning with dryness and ending with an uncontrolled bodily overflow.", ["ultimately-poemanalysis"]),
    excerpt(`He tried to spit out the truth;
Dry mouthed at first,`),
    p("The poem refuses to make honesty elegant: truth leaves saliva on the speaker’s chin.", ["ultimately-dusty"]),
  ],
  meaning: [
    p("“Dry mouthed” suggests hesitation, while “drooled,” “slobbed,” and “dribbling” make release humiliatingly physical.", ["ultimately-poemanalysis"]),
    excerpt(`He drooled and slobbed in the end;
Truth dribbling his chin.`),
    p("The poem leaves open whether confession is liberating or damaging; once begun, it may be impossible to contain.", ["ultimately-dusty"]),
  ],
  themes: [
    { theme: "Truth and hesitation", blocks: [p("The movement from dryness to overflow dramatizes the difficulty of beginning to speak honestly.")] },
    { theme: "Loss of control", blocks: [excerpt(`He drooled and slobbed in the end;`), p("The verbs become increasingly involuntary, turning honesty into a physical process.")] },
    { theme: "Embarrassment and exposure", blocks: [p("Saliva on the chin rejects the comforting idea that truth-telling is always clean or noble.", ["ultimately-dusty"])] },
  ],
  formAndMeter: [
    p("“Ultimately” is a four-line free-verse poem with no fixed metrical pattern.", ["ultimately-poemanalysis"]),
    p("Semicolons divide attempted speech, dryness, overflow, and the final visible result; rough sound links keep the ending unresolved.", ["ultimately-dusty"]),
  ],
  literaryDevices: [
    { device: "Metaphor", blocks: [excerpt(`He tried to spit out the truth;`), p("Truth becomes a substance in the mouth rather than an abstract moral idea.")] },
    { device: "Sensory imagery", blocks: [excerpt(`He drooled and slobbed in the end;`), p("Unattractive diction makes honesty tactile and embarrassing.", ["ultimately-poemanalysis"])] },
    { device: "Progression", blocks: [excerpt(`Dry mouthed at first,
He drooled and slobbed in the end;`), p("The time markers create a compressed before-and-after narrative.")] },
  ],
  historicalContext: [
    p("The poem appears in Hemingway’s early collection Three Stories & Ten Poems, published in 1923.", ["ultimately-gutenberg"]),
    p("Its extreme compression anticipates the concrete, spare style associated with Hemingway’s later work.", ["ultimately-gutenberg"]),
  ],
  citations: [
    { id: "ultimately-text", source: "Wikisource", url: "https://en.wikisource.org/wiki/Ultimately" },
    { id: "ultimately-poemanalysis", source: "Poem Analysis", url: "https://poemanalysis.com/ernest-hemingway/ultimately/", quote: "The striking images in these lines depict truth as something messy and uncontrollable." },
    { id: "ultimately-gutenberg", source: "Project Gutenberg", url: "https://www.gutenberg.org/files/59603/59603-h/59603-h.htm" },
    { id: "ultimately-dusty", source: "Dusty Reviews", url: "https://dustyreviews.com/2025/08/06/ultimately/", quote: "This four line poem is written in free verse and has a rhyme scheme of ABCC." },
  ],
  criticalViews: [{ citeId: "ultimately-poemanalysis" }, { citeId: "ultimately-dusty" }],
  faqs: [
    { q: "What is the main meaning?", plain: "Truth is difficult to begin but may become impossible to contain once it starts." },
    { q: "What does spit symbolize?", plain: "It makes truth physical, messy, and potentially humiliating." },
    { q: "What is the form?", plain: "A four-line free-verse poem whose punctuation and rough sound carry its progression." },
  ],
  cta: "Write with this poem’s open form in the editor",
};

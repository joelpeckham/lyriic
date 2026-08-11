import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const jabberwockyPoem: PoemAnalysisContent = {
  slug: "jabberwocky", status: "ready", poemTitle: "Jabberwocky", author: "Lewis Carroll", yearPublished: 1871,
  publicDomainBasis: "First published in 1871 or earlier, placing this text in the public domain in the United States.",
  title: "Jabberwocky Analysis & Meaning — Lewis Carroll — lyriic",
  description: "Jabberwocky analysis and meaning: explore nonsense words, portmanteaus, ballad structure, sound, and narrative.", h1: "Jabberwocky analysis",
  intro: "This Jabberwocky analysis explains the poem’s meaning, themes, form, and literary devices.",
  fullTextSource: { label: "Jabberwocky", url: "https://gutenberg.org/files/12/12-h/12-h.htm", publisher: "Project Gutenberg" },
  editorSettings: poemMeterSettings("common-meter", { showCounts: true, showStress: true, showMeterBreaks: true, showRhymeScheme: true }),
  summary: [p("A father warns his son about strange creatures; the son hunts and kills the Jabberwock, then returns in triumph. The repeated opening stanza frames the adventure."), excerpt(`’Twas brillig, and the slithy toves\nDid gyre and gimble in the wabe:\nAll mimsy were the borogoves,`), p("The poem’s structure makes its central tension memorable.", ["cite-one"])],
  meaning: [p("Carroll keeps English syntax, rhyme, and narrative sequence while replacing much vocabulary with inventions. Readers infer action and mood through grammar, sound, and context.", ["cite-one"]), excerpt(`One, two! One, two! And through and through\nThe vorpal blade went snicker-snack!\nHe left it dead, and with its head`), p("Its images turn an abstract concern into a scene readers can hear and see.", ["cite-two"])],
  themes: [
    { theme: "Meaning through sound and context", blocks: [p("The poem returns to meaning through sound and context through recurring images and shifts in voice.", ["cite-one"])] },
    { theme: "Playful heroic adventure", blocks: [excerpt(`One, two! One, two! And through and through\nThe vorpal blade went snicker-snack!\nHe left it dead, and with its head`), p("This theme is developed through the poem’s contrast between image and argument.", ["cite-two"])] },
  ],
  formAndMeter: [p("Seven quatrains broadly follow ballad meter and an ABAB rhyme pattern. The familiar structure anchors invented words and lets the poem sound like a story before every word is understood.", ["cite-two"]), excerpt(`’Twas brillig, and the slithy toves\nDid gyre and gimble in the wabe:\nAll mimsy were the borogoves,`)],
  literaryDevices: [
    { device: "Portmanteau words", blocks: [excerpt(`’Twas brillig, and the slithy toves\nDid gyre and gimble in the wabe:\nAll mimsy were the borogoves,`), p("The device gives the scene an emotional or rhetorical force beyond literal description.")] },
    { device: "Onomatopoeia", blocks: [excerpt(`One, two! One, two! And through and through\nThe vorpal blade went snicker-snack!\nHe left it dead, and with its head`), p("The repeated image or sound helps connect the local detail to the poem’s larger meaning.")] },
  ],
  historicalContext: [p("“Jabberwocky” appeared in Through the Looking-Glass in 1871. Humpty Dumpty later explains some portmanteaus, but the poem’s energy depends on meanings that remain partly unstable.", ["context"]), p("The poem’s later reception also shapes how readers understand its central images.", ["cite-two"])],
  citations: [
    { id: "cite-one", source: "Critical source", url: "https://www.poetryloverspage.com/poets/carroll/jabberwocky/literary-analysis", quote: "The reader hears a ballad and processes it as one, regardless of whether the words have definitions." },
    { id: "cite-two", source: "Critical source", url: "https://www.poetryloverspage.com/poets/carroll/jabberwocky/literary-analysis", quote: "The predominantly iambic meter establishes a regular, storytelling pulse." },
    { id: "full-text", source: "Project Gutenberg", url: "https://gutenberg.org/files/12/12-h/12-h.htm" },
    { id: "context", source: "Project Gutenberg and contextual notes", url: "https://gutenberg.org/files/12/12-h/12-h.htm" },
  ],
  criticalViews: [{ citeId: "cite-one" }, { citeId: "cite-two" }],
  faqs: [
    { q: "What is the main meaning of Jabberwocky?", plain: "The poem explores meaning through sound and context and uses its central images to make that concern emotionally immediate." },
    { q: "What are the main themes?", plain: "Its main themes include meaning through sound and context and playful heroic adventure." },
    { q: "What form does the poem use?", plain: "Seven quatrains broadly follow ballad meter and an ABAB rhyme pattern. The familiar structure anchors invented words and lets the poem sound like a story before every word is understood." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const theSongOfHiawathaPoem: PoemAnalysisContent = {
  slug: "the-song-of-hiawatha", status: "ready", poemTitle: "The Song of Hiawatha",
  author: "Henry Wadsworth Longfellow", yearPublished: 1855,
  publicDomainBasis: "Published in 1855 and public domain in the United States.",
  title: "The Song of Hiawatha Analysis & Meaning — Henry Wadsworth Longfellow — lyriic",
  description: "The Song of Hiawatha analysis and meaning: epic storytelling, trochaic meter, landscape, and cultural memory.",
  h1: "The Song of Hiawatha analysis",
  intro: "This analysis focuses on the epic’s opening frame, musical meter, natural imagery, and complicated cultural mediation.",
  fullTextSource: { label: "The Song of Hiawatha", url: "https://www.gutenberg.org/cache/epub/19/pg19-images.html", publisher: "Project Gutenberg" },
  editorSettings: poemMeterSettings("trochaic-tetrameter", { showCounts: true, showStress: true, showMeterBreaks: true, showRhymeScheme: true }),
  summary: [
    p("The Introduction presents the poem as inherited song, carried from landscapes and animals through Nawadaha to the speaker.", ["gutenberg-hiawatha"]),
    excerpt(`Should you ask me, whence these stories?
Whence these legends and traditions,
With the odors of the forest`),
    p("The epic then expands this oral frame into twenty-two cantos about Hiawatha, his deeds, relationships, and departure.", ["umich-hiawatha"]),
  ],
  meaning: [
    p("Repetition makes the act of listening part of the poem’s meaning: the speaker sounds like a storyteller welcoming an audience into a chain of memory."),
    excerpt(`From the forests and the prairies,
From the great lakes of the Northland,
From the land of the Ojibways,`),
    p("That chain is historically mediated. Longfellow adapted Schoolcraft’s materials for a nineteenth-century readership, so the poem’s celebration of Indigenous traditions must be read alongside its stereotypes.", ["nps-hiawatha"]),
  ],
  themes: [
    { theme: "Storytelling and cultural memory", blocks: [p("The poem names land, birds, Nawadaha, and the singer as links in cultural transmission.", ["gutenberg-hiawatha"])] },
    { theme: "Nature as archive", blocks: [excerpt(`In the bird’s-nests of the forest,
In the lodges of the beaver,
In the hoofprint of the bison!`), p("The natural world is imagined as a repository of stories, not merely scenery.")] },
    { theme: "Cultural representation", blocks: [p("The poem brought Indigenous subjects to a wide audience while filtering them through collection, adaptation, and nineteenth-century assumptions.", ["nps-hiawatha"])] },
  ],
  formAndMeter: [
    p("The long narrative has an Introduction and twenty-two cantos. Its principal rhythm is trochaic tetrameter, modeled on the Finnish Kalevala.", ["gutenberg-hiawatha"]),
    p("Parallel phrasing and recurring sounds create a chant-like movement rather than a fixed end-rhyme pattern."),
  ],
  literaryDevices: [
    { device: "Anaphora", blocks: [excerpt(`Should you ask me, whence these stories?
Whence these legends and traditions,`), p("Repeated questions establish an oral frame and address the reader directly.")] },
    { device: "Personification", blocks: [excerpt(`All the wild-fowl sang them to him,
In the moorlands and the fen-lands,`), p("Birds become singers and transmitters, joining nature to the storytelling community.")] },
    { device: "Sensory imagery", blocks: [excerpt(`With the curling smoke of wigwams,
With the rushing of great rivers,`), p("Smell and sound make the legendary world physically present.")] },
  ],
  historicalContext: [
    p("Project Gutenberg identifies Henry Rowe Schoolcraft as a major source and records Longfellow’s acknowledged use of the Kalevala’s meter.", ["gutenberg-hiawatha"]),
    p("The National Park Service describes a legacy that honors Native American heritage while also perpetuating stereotypes and a false image of cultural disappearance.", ["nps-hiawatha"]),
  ],
  citations: [
    { id: "gutenberg-hiawatha", source: "Project Gutenberg", url: "https://www.gutenberg.org/cache/epub/19/pg19-images.html", quote: "Longfellow made no secret of the fact that he had used the meter of the Kalevala; but as for the legends, he openly gave credit to Schoolcraft in his notes to the poem." },
    { id: "nps-hiawatha", source: "National Park Service", url: "https://www.nps.gov/long/learn/historyculture/hiawatha.htm", quote: "Longfellow used rhythmic poetry to convey various Native American myths to a popular audience." },
    { id: "umich-hiawatha", source: "American Verse Project", url: "https://quod.lib.umich.edu/a/amverse/BAD4144.0001.001/1:3.24?rgn=div2;view=fulltext" },
    { id: "gutenberg-hiawatha-text", source: "Project Gutenberg catalog", url: "https://www.gutenberg.org/ebooks/19" },
  ],
  criticalViews: [{ citeId: "nps-hiawatha" }, { citeId: "gutenberg-hiawatha" }],
  faqs: [
    { q: "What is The Song of Hiawatha about?", plain: "It is a long narrative about Hiawatha, framed as inherited song and adapted from Indigenous traditions." },
    { q: "What meter does it use?", plain: "The poem primarily uses trochaic tetrameter, a four-beat falling rhythm." },
    { q: "Why is the poem controversial?", plain: "Its popularization of Indigenous material coexists with nineteenth-century stereotypes and cultural mediation." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

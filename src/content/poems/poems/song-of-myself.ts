import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const songOfMyselfPoem: PoemAnalysisContent = {
  slug: "song-of-myself",
  status: "ready",
  poemTitle: "Song of Myself",
  author: "Walt Whitman",
  yearPublished: 1855,
  publicDomainBasis: "First published as “I celebrate myself” in Leaves of Grass (1855), before the US public-domain cutoff.",
  title: "Song of Myself Analysis & Meaning — Walt Whitman — lyriic",
  description: "Song of Myself analysis of Whitman’s selfhood, democracy, nature, grass symbolism, and free-verse form.",
  h1: "Song of Myself analysis",
  intro: "Whitman’s Song of Myself turns a personal voice into an expansive claim about shared human identity. This analysis focuses on its meaning, themes, and free verse.",
  fullTextSource: { label: "Leaves of Grass (1855), “I celebrate myself”", url: "https://en.wikisource.org/wiki/Leaves_of_Grass_(1855)/I_celebrate_myself", publisher: "Wikisource" },
  editorSettings: poemOpenSettings({ showCounts: true, showRulers: false }),
  summary: [
    p("The speaker celebrates himself while immediately linking his identity to the reader. The poem’s “I” expands through bodies, work, nature, death, and shared experience."),
    excerpt(`I celebrate myself,
And what I assume you shall assume,`),
    p("When a child asks what grass means, the speaker offers several guesses rather than a final definition. The poem keeps knowledge open and experiential.", ["song-myself-miller"]),
  ],
  meaning: [
    p("Whitman’s self-celebration is not meant to isolate the speaker. “Every atom” becomes a material image of equality between poet and reader."),
    excerpt(`For every atom belonging to me as good belongs to you.`),
    p("Grass gathers possible meanings—common life, spiritual mystery, and continuity between the living and the dead—without settling into one symbol.", ["song-myself-foundation"]),
  ],
  themes: [
    { theme: "Self and shared identity", blocks: [p("The singular voice becomes a route into fellowship: the speaker asks readers to recognize their own material and spiritual participation in the world.")] },
    { theme: "Democracy and equality", blocks: [p("Catalogues place bodies, occupations, places, and experiences in an expansive series. Formally and thematically, the poem resists a narrow hierarchy of subjects.", ["song-myself-miller"])] },
    { theme: "Nature and mystery", blocks: [excerpt(`I lean and loafe at my ease .... observing a spear of summer grass.`), p("Ordinary natural objects become occasions for thought, not decorations placed outside human experience.")] },
  ],
  formAndMeter: [
    p("The poem uses free verse rather than a fixed meter or regular rhyme scheme. Breath-length lines, parallel syntax, anaphora, and catalogues supply its rhythm."),
    p("James E. Miller argues that the poem’s apparent looseness should not be mistaken for the absence of structure; he searches for an informing idea connecting its parts.", ["song-myself-miller"]),
  ],
  literaryDevices: [
    { device: "Anaphora", blocks: [excerpt(`I celebrate myself,
And what I assume you shall assume,`), p("Repeated conjunctions and openings create additive forward motion, making each perception part of an unfinished whole.")] },
    { device: "Catalogue", blocks: [p("Whitman’s long lists widen the field of attention and give equality a formal shape by placing unlike people and sensations in one sequence.")] },
    { device: "Symbolism", blocks: [excerpt(`I guess it must be the flag of my disposition, out of hopeful green stuff woven.`), p("Grass remains multivalent: it can suggest character, growth, divine communication, and shared material life.")] },
  ],
  historicalContext: [
    p("Whitman self-published Leaves of Grass on July 4, 1855. The poem was initially untitled, and later editions changed its title, wording, and section divisions.", ["song-myself-foundation"]),
    p("The first edition’s democratic address and long lines helped establish Whitman’s distinct American poetic voice. The Poetry Foundation describes his method as adapting epic scale through connected lyric poems.", ["song-myself-foundation"]),
  ],
  citations: [
    { id: "song-myself-text", source: "Wikisource", url: "https://en.wikisource.org/wiki/Leaves_of_Grass_(1855)/I_celebrate_myself" },
    { id: "song-myself-miller", source: "PMLA / Cambridge Core", author: "James E. Miller Jr.", quote: "Inability to find a structure in “Song of Myself” has resulted, I believe, from a failure to find a center of relevancy, an “informing idea,” to which the parts of the poem may be related.", url: "https://www.cambridge.org/core/journals/pmla/article/abs/song-of-myself-as-inverted-mystical-experience/A58A45564DC5E54D10E98CB71E56E1AB" },
    { id: "song-myself-foundation", source: "Poetry Foundation", quote: "Whitman adapted the form of the epic, constructing it by connecting lyric poems; the long, narrative lines in “Song of Myself” are characteristic of his poetry.", url: "https://www.poetryfoundation.org/articles/69391/from-preface-to-leaves-of-grass-first-edition" },
    { id: "song-myself-context", source: "Poetry Foundation", url: "https://www.poetryfoundation.org/articles/69391/from-preface-to-leaves-of-grass-first-edition" },
  ],
  criticalViews: [{ citeId: "song-myself-miller" }, { citeId: "song-myself-foundation" }],
  faqs: [
    { q: "What is the main meaning?", plain: "Whitman presents individuality as connected to other people, the natural world, and shared material life." },
    { q: "What does grass symbolize?", plain: "Grass has several possible meanings, including common life, spiritual mystery, growth, and continuity between living and dead bodies." },
    { q: "What form does the poem use?", plain: "It uses free verse, with rhythm shaped by breath, syntax, repetition, and catalogues rather than fixed meter." },
  ],
  cta: "Open the zen editor",
};

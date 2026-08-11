import type { PoemAnalysisContent } from "../types";
import { poemOpenSettings } from "../settings";

export const songOfMyselfPoem: PoemAnalysisContent = {
  slug: "song-of-myself",
  status: "ready",
  poemTitle: "Song of Myself",
  author: "Walt Whitman",
  yearPublished: 1855,
  publicDomainBasis:
    "First published in the United States in the 1855 edition of Leaves of Grass, well before the 1930 US public-domain cutoff.",
  title: "Song of Myself Analysis & Meaning — Walt Whitman — lyriic",
  description:
    "A Song of Myself analysis covering Whitman's meaning, democracy, nature, free verse, imagery, and the poem's shifting idea of self.",
  h1: "Song of Myself analysis",
  intro:
    "Walt Whitman's Song of Myself turns a personal voice into an argument for shared human identity. This analysis explains its meaning, themes, free-verse form, and recurring grass image.",
  text: `I celebrate myself,
And what I assume you shall assume,
For every atom belonging to me as good belongs to you.

I loafe and invite my soul,
I lean and loafe at my ease .... observing a spear of summer grass.

A child said, What is the grass? fetching it to me with full hands;
How could I answer the child? .... I do not know what it is any more than he.

I guess it must be the flag of my disposition, out of hopeful green stuff woven.

Or I guess it is the handkerchief of the Lord,
A scented gift and remembrancer designedly dropped,
Bearing the owner’s name someway in the corners, that we may see and remark, and say Whose?`,
  isExcerpt: true,
  excerptNote:
    "This long poem is excerpted from the 1855 version of Leaves of Grass. The passage pairs its opening declaration of shared identity with the later grass passage, often identified with the poem's famous sixth section in revised editions.",
  fullTextSource: {
    label: "Leaves of Grass (1855), “I celebrate myself”",
    url: "https://en.wikisource.org/wiki/Leaves_of_Grass_(1855)/I_celebrate_myself",
    publisher: "Wikisource",
  },
  editorSettings: poemOpenSettings({ showCounts: true, showRulers: false }),
  summary: [
    "The speaker begins by celebrating himself, then immediately makes that self available to everyone: what belongs to him also belongs to the reader. He invites the soul into a relaxed attention to the body, the senses, and the natural world.",
    "When a child asks what grass means, the speaker offers several guesses rather than a final definition. The poem's movement is expansive and associative, moving from a single body to other people, the nation, nature, death, and the continuing life of the self.",
  ],
  meaning: [
    "The poem's “I” is personal but not private. Its central claim is that individuality can be a route into fellowship, because the atom that belongs to the speaker belongs equally to the reader. The opening therefore asks readers to test experience for themselves rather than accept a doctrine from the poet.",
    "The grass passage gives that idea a physical image. Grass may be a flag, a divine handkerchief, or a child of vegetation, but each guess keeps the image open. Its commonness matters: grass grows across differences of status and identity, making it a useful figure for shared life and for the relation between the living and the dead.",
  ],
  themes: [
    {
      theme: "Self and shared identity",
      discussion:
        "The speaker's self-celebration becomes democratic when he says that every atom belonging to him belongs to the reader as well. The poem keeps moving between the singular voice and a much larger human community.",
    },
    {
      theme: "Nature and spiritual experience",
      discussion:
        "Whitman treats grass, breath, bodies, and sunlight as direct forms of knowledge. The natural world is not a decorative setting; it is where the speaker tests ideas about the soul and the sacred.",
    },
    {
      theme: "Democracy and equality",
      discussion:
        "The poem's catalogues and broad address make room for people and experiences that conventional poetic decorum might exclude. Its democratic vision depends on attention to ordinary bodies, work, desire, and difference.",
    },
    {
      theme: "Death and continuity",
      discussion:
        "Death does not cancel identity in the poem. Bodies return to the material world, and the speaker imagines the self as part of processes that continue beyond one person's lifetime.",
    },
  ],
  formAndMeter: [
    "Song of Myself is written in free verse rather than a fixed metrical pattern or regular rhyme scheme. Its long lines are shaped by breath, syntax, repetition, and the pressure of a speaking voice.",
    "Whitman builds rhythm through parallel clauses, anaphora, catalogues, and recurring words such as “And.” The result can feel conversational in one line and ceremonial in the next.",
    "The poem's form suits its subject. Instead of enclosing the self in a preset stanza pattern, the lines expand as the speaker's attention moves through bodies, places, ideas, and the natural world.",
  ],
  literaryDevices: [
    {
      device: "Anaphora",
      example: "And what I assume you shall assume,",
      discussion:
        "Repeated openings and conjunctions create forward motion. The recurring “And” makes separate observations feel connected, as if the poem is adding each new part to an unfinished whole.",
    },
    {
      device: "Catalogue",
      example: "The smoke of my own breath, Echos, ripples, and buzzed whispers ....",
      discussion:
        "Whitman piles up sensory details, occupations, bodies, and places. The catalogue widens the poem's field of attention and gives equality a formal shape by placing unlike things in the same series.",
    },
    {
      device: "Symbolism",
      example: "I guess it must be the flag of my disposition, out of hopeful green stuff woven.",
      discussion:
        "Grass gathers several possible meanings without settling into one. It can suggest personal character, divine communication, growth, and the common material shared by living beings.",
    },
    {
      device: "Apostrophe and direct address",
      example: "Stop this day and night with me and you shall possess the origin of all poems,",
      discussion:
        "The speaker repeatedly addresses “you,” turning reading into an encounter. The reader is not a distant observer but a participant asked to listen, judge, and discover independently.",
    },
  ],
  historicalContext: [
    "Whitman self-published the first edition of Leaves of Grass on July 4, 1855. That volume contained twelve poems and a preface; the poem later called Song of Myself was initially untitled and appeared as “I celebrate myself.”",
    "Whitman was developing a distinctly American poetic voice in a period of intense arguments about democracy, slavery, work, religion, and the body. The Poetry Foundation notes that he adapted the epic by connecting lyric poems and that the long narrative lines of Song of Myself are characteristic of his method.",
    "The title and section divisions changed across later editions. The familiar 52-section arrangement belongs to a later version, so the 1855 text should not be treated as if its original page had those numbered sections.",
  ],
  criticalViews: [
    {
      source: "PMLA / Cambridge Core",
      author: "James E. Miller Jr.",
      quote:
        "Inability to find a structure in “Song of Myself” has resulted, I believe, from a failure to find a center of relevancy, an “informing idea,” to which the parts of the poem may be related.",
      url: "https://www.cambridge.org/core/journals/pmla/article/abs/song-of-myself-as-inverted-mystical-experience/A58A45564DC5E54D10E98CB71E56E1AB",
    },
    {
      source: "The Poetry Foundation",
      quote:
        "Whitman adapted the form of the epic, constructing it by connecting lyric poems; the long, narrative lines in “Song of Myself” are characteristic of his poetry.",
      url: "https://www.poetryfoundation.org/articles/69391/from-preface-to-leaves-of-grass-first-edition",
    },
  ],
  faqs: [
    {
      q: "What is the main meaning of Song of Myself?",
      plain:
        "The poem presents individuality as connected to other people and to the natural world. Whitman's “I” is both one person and a voice that asks readers to recognize themselves in shared human experience.",
    },
    {
      q: "What does the grass symbolize in Song of Myself?",
      plain:
        "Grass has several possible meanings rather than one fixed definition. It can suggest shared life, nature, spiritual mystery, and the continuity between living bodies and the dead.",
    },
    {
      q: "What themes are in Song of Myself?",
      plain:
        "Major themes include selfhood, democracy, equality, nature, the body, spiritual experience, sexuality, and death. The poem links these subjects instead of keeping them in separate categories.",
    },
    {
      q: "What form and meter does Song of Myself use?",
      plain:
        "It uses free verse with no regular rhyme scheme or fixed meter. Its rhythm comes from breath-length lines, syntax, parallel phrasing, repetition, and catalogues.",
      href: "/tools",
      hrefLabel: "Open the zen editor",
    },
  ],
  sources: [
    {
      label: "Leaves of Grass (1855), “I celebrate myself”",
      url: "https://en.wikisource.org/wiki/Leaves_of_Grass_(1855)/I_celebrate_myself",
      publisher: "Wikisource",
    },
    {
      label: "“Song of Myself” as Inverted Mystical Experience",
      url: "https://www.cambridge.org/core/journals/pmla/article/abs/song-of-myself-as-inverted-mystical-experience/A58A45564DC5E54D10E98CB71E56E1AB",
      publisher: "Cambridge University Press",
    },
    {
      label: "From Preface to Leaves of Grass, first edition",
      url: "https://www.poetryfoundation.org/articles/69391/from-preface-to-leaves-of-grass-first-edition",
      publisher: "The Poetry Foundation",
    },
  ],
  cta: "Open the zen editor",
};

import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const theSongOfWanderingAengusPoem: PoemAnalysisContent = {
  slug: "the-song-of-wandering-aengus", status: "ready", poemTitle: "The Song of Wandering Aengus",
  author: "W. B. Yeats", yearPublished: 1899,
  publicDomainBasis: "Collected in 1899 and public domain in the United States.",
  title: "The Song of Wandering Aengus Analysis & Meaning — W. B. Yeats — lyriic",
  description: "Analysis of The Song of Wandering Aengus: longing, transformation, mythic imagery, and songlike form.",
  h1: "The Song of Wandering Aengus analysis",
  intro: "Yeats turns a fleeting supernatural encounter into a lifelong search for love, beauty, and an unattainable ideal.",
  fullTextSource: { label: "The Song of Wandering Aengus", url: "https://en.wikisource.org/wiki/The_Song_of_Wandering_Aengus", publisher: "Wikisource" },
  editorSettings: poemMeterSettings("iambic-tetrameter", { showCounts: true, showStress: true, showMeterBreaks: true, showRhymeScheme: true }),
  summary: [
    p("Aengus enters a hazel wood, catches a silver trout, and sees it become a girl who calls his name before vanishing.", ["aengus-text"]),
    excerpt(`I went out to the hazel wood,
Because a fire was in my head,
And cut and peeled a hazel wand,`),
    p("Old age has not ended his pursuit: the brief vision becomes the organizing desire of his life.", ["aengus-litcharts"]),
  ],
  meaning: [
    p("The poem makes desire both exhausting and sustaining. The girl remains powerful because she appears only long enough to become an ideal.", ["aengus-litcharts"]),
    excerpt(`It had become a glimmering girl
With apple blossom in her hair
Who called me by my name and ran`),
    p("The ending leaves the search unresolved, balancing obsession with imaginative hope.", ["aengus-poemanalysis"]),
  ],
  themes: [
    { theme: "Longing and unattainable desire", blocks: [p("A momentary encounter governs a lifetime because the desired figure remains out of reach.", ["aengus-litcharts"])] },
    { theme: "Myth and transformation", blocks: [excerpt(`I dropped the berry in a stream
And caught a little silver trout.`), p("The ordinary fishing scene turns into myth through sudden transformation.")] },
    { theme: "Age and eternity", blocks: [p("The speaker’s old age contrasts with his promise to gather the moon’s and sun’s apples “till time and times are done.”")] },
  ],
  formAndMeter: [
    p("The poem has three eight-line stanzas and a ballad-like narrative movement. Its underlying rhythm is mostly iambic tetrameter.", ["aengus-enotes"]),
    p("Yeats uses slant rhyme rather than mechanical exact rhyme, a flexibility that keeps the song strange and conversational.", ["aengus-enotes"]),
  ],
  literaryDevices: [
    { device: "Transformation", blocks: [excerpt(`It had become a glimmering girl
With apple blossom in her hair`), p("The trout’s change shifts the poem from practical action to supernatural desire.")] },
    { device: "Symbolism", blocks: [excerpt(`The silver apples of the moon,
The golden apples of the sun.`), p("The paired apples suggest an ideal harvest beyond ordinary human time.", ["aengus-poemanalysis"])] },
    { device: "Repetition", blocks: [excerpt(`Who called me by my name and ran
And faded through the brightening air.`), p("Repeated conjunctions carry the speaker forward toward a reunion that never occurs.")] },
  ],
  historicalContext: [
    p("The poem was first printed in 1897 and collected in The Wind Among the Reeds in 1899.", ["aengus-litcharts"]),
    p("Aengus draws on Irish mythology, but Yeats reshapes the figure into a personal dramatic monologue about pursuit.", ["aengus-litcharts"]),
  ],
  citations: [
    { id: "aengus-text", source: "Wikisource", url: "https://en.wikisource.org/wiki/The_Song_of_Wandering_Aengus" },
    { id: "aengus-litcharts", source: "LitCharts", url: "https://www.litcharts.com/poetry/william-butler-yeats/the-song-of-wandering-aengus", quote: "unrequited love—or any other unattainable dream—can both exhaust a person's energies and nourish a person's imagination." },
    { id: "aengus-poemanalysis", source: "Poem Analysis", url: "https://poemanalysis.com/william-butler-yeats/the-song-of-wandering-aengus/", quote: "The poem is divided into three stanzas." },
    { id: "aengus-enotes", source: "eNotes", url: "https://www.enotes.com/topics/song-wandering-aengus/analysis", quote: "Yeats’s poem adheres to the four-beat iambic tetrameter, which lends the poem the songlike quality common to ballads." },
  ],
  criticalViews: [{ citeId: "aengus-litcharts" }, { citeId: "aengus-enotes" }],
  faqs: [
    { q: "What is the poem’s meaning?", plain: "A fleeting vision becomes a lifelong search for love, beauty, or an unattainable ideal." },
    { q: "What are its themes?", plain: "Longing, transformation, myth, aging, and the sustaining power of imagination." },
    { q: "What meter does it use?", plain: "Mostly iambic tetrameter, with ballad-like movement and flexible slant rhyme." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

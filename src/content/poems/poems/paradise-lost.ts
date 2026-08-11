import type { PoemAnalysisContent } from "../types";
import { poemMeterSettings } from "../settings";

export const paradiseLostPoem: PoemAnalysisContent = {
  slug: "paradise-lost",
  status: "ready",
  poemTitle: "Paradise Lost",
  author: "John Milton",
  yearPublished: 1667,
  publicDomainBasis:
    "First published in 1667, well before 1930; John Milton died in 1674, so the original English poem is public domain in the United States.",
  title: "Paradise Lost Analysis & Meaning — John Milton — lyriic",
  description:
    "An analysis of John Milton's Paradise Lost: the opening invocation, its meaning, themes of disobedience and free will, and blank verse form.",
  h1: "Paradise Lost analysis",
  intro:
    "John Milton's Paradise Lost begins by announcing an epic subject: humanity's first disobedience and the loss of Eden. This analysis of the Book I invocation examines its meaning, Christian epic form, and themes of free will and divine providence.",
  text: `Of Mans First Disobedience, and the Fruit
Of that Forbidden Tree, whose mortal tast
Brought Death into the World, and all our woe,
With loss of Eden, till one greater Man
Restore us, and regain the blissful Seat,
Sing Heav'nly Muse, that on the secret top
Of Oreb, or of Sinai, didst inspire
That Shepherd, who first taught the chosen Seed,
In the Beginning how the Heav'ns and Earth
Rose out of Chaos: or if Sion Hill
Delight thee more, and Siloa's brook that flow'd
Fast by the Oracle of God; I thence
Invoke thy aid to my adventrous Song,
That with no middle flight intends to soar
Above th' Aonian Mount, while it pursues
Things unattempted yet in Prose or Rhime.
And chiefly Thou, O Spirit, that dost prefer
Before all Temples th' upright heart and pure,
Instruct me, for Thou know'st; Thou from the first
Wast present, and with mighty wings outspread
Dove-like satst brooding on the vast Abyss
And mad'st it pregnant: What in me is dark
Illumin, what is low raise and support;
That to the highth of this great Argument
I may assert Eternal Providence,
And justifie the wayes of God to men.`,
  isExcerpt: true,
  excerptNote:
    "This is the opening invocation of Book I, lines 1–26, where Milton states the epic's subject, calls on the Holy Spirit for inspiration, and announces his aim to explain divine providence. Read the full ten-book 1667 edition at Wikisource.",
  fullTextSource: {
    label: "Paradise Lost (1667), Book I — Wikisource",
    url: "https://en.wikisource.org/wiki/Paradise_Lost_(1667)/Book_I",
    publisher: "Wikisource",
  },
  editorSettings: poemMeterSettings("iambic-pentameter", {
    showCounts: true,
    showStress: true,
    showMeterBreaks: true,
    showRhymeScheme: false,
  }),
  summary: [
    "The speaker names the poem's subject as humanity's first disobedience: Adam and Eve's eating of the forbidden fruit, the arrival of death, and the loss of Eden. He then asks a heavenly muse to guide the song.",
    "The invocation moves from the biblical locations of Oreb, Sinai, and Sion to the Holy Spirit's presence at creation. Milton ends by stating the epic's governing purpose: to assert eternal providence and justify God's ways to humanity.",
  ],
  meaning: [
    "The opening frames Paradise Lost as an explanation of a theological problem: how a world governed by divine providence can contain disobedience, suffering, and death. “Justifie” here means to make God's purposes intelligible and defensible, not to put God on trial before a higher court.",
    "Milton combines epic ambition with dependence. He intends a song that will soar above the classical tradition, yet asks the Spirit to illuminate what is dark and raise what is low in him. The poem's authority is therefore presented as received through inspiration rather than claimed as personal mastery alone.",
  ],
  themes: [
    {
      theme: "Disobedience and consequence",
      discussion:
        "The first line makes disobedience the poem's origin point, while the fruit produces a chain of consequences: death, woe, and the loss of Eden. The compressed syntax makes the fall feel like a single act with world-historical reach.",
    },
    {
      theme: "Divine providence and human understanding",
      discussion:
        "The declared aim to “assert Eternal Providence” promises an account of how God's larger plan relates to human suffering. The request for illumination also admits that the argument exceeds ordinary human understanding.",
    },
    {
      theme: "Free will and moral responsibility",
      discussion:
        "Although the excerpt does not yet narrate Adam and Eve's choice, its emphasis on disobedience establishes the moral question the epic will pursue: how responsible agents can fall within a universe that is also governed by divine foreknowledge and providence.",
    },
    {
      theme: "Christian revision of classical epic",
      discussion:
        "Milton uses the conventional epic invocation but redirects it from the Muses of Greek poetry to the Spirit associated with Moses and creation. The form of Homer and Virgil becomes a vehicle for a Christian account of origins, fall, and redemption.",
    },
  ],
  formAndMeter: [
    "Paradise Lost is an epic poem in unrhymed iambic pentameter, or English heroic blank verse. The lines generally move through five iambic beats without a fixed end-rhyme scheme.",
    "Milton uses enjambment, inversions, pauses, and varied syntax to keep the pentameter flexible. The long opening sentence carries the reader through several clauses before arriving at the request for inspiration, giving the invocation an expansive, ceremonial movement.",
    "The 1667 first edition presented the poem in ten books; Milton's 1674 revision reorganized it into twelve. This excerpt belongs to the opening of Book I in the original ten-book publication.",
  ],
  literaryDevices: [
    {
      device: "Epic invocation",
      example: "Sing Heav'nly Muse, that on the secret top",
      discussion:
        "The direct address follows the classical convention of asking a muse to inspire an epic. Milton transforms that convention by identifying the source of inspiration with the Spirit behind biblical revelation and creation.",
    },
    {
      device: "Biblical allusion",
      example: "Of Oreb, or of Sinai",
      discussion:
        "References to Oreb, Sinai, Sion, and Siloa place the poem inside biblical geography and history. These allusions connect the speaker's poetic project to Moses, prophecy, worship, and the origins of the chosen people.",
    },
    {
      device: "Personification and metaphor",
      example: "Dove-like satst brooding on the vast Abyss",
      discussion:
        "The Spirit is pictured as a dove-like presence hovering over the abyss. The image recalls creation and gives the invisible force of divine inspiration a vivid, generative shape.",
    },
    {
      device: "Antithesis",
      example: "What in me is dark / Illumin, what is low raise and support",
      discussion:
        "The paired opposites of dark and light, low and raised turn poetic composition into a movement from limitation toward understanding. The language also mirrors the poem's broader interest in fall and restoration.",
    },
  ],
  historicalContext: [
    "Paradise Lost was first published in 1667 as a poem in ten books. Milton's second edition, published in 1674, revised and reorganized the work into twelve books. The opening invocation remained the poem's statement of subject and purpose.",
    "Milton adapts the classical epic tradition of Homer and Virgil for an English Christian epic. The 1667 prefatory note describes the verse as “English Heroic Verse without Rime” and defends unrhymed measure as a recovery of ancient poetic liberty.",
    "The poem's biblical subject reflects Milton's interest in the Fall, providence, and the relationship between obedience and freedom. The invocation presents those matters as the “great Argument” that requires divine assistance to render fully.",
  ],
  criticalViews: [
    {
      source: "SparkNotes",
      author: "SparkNotes editors",
      quote:
        "Milton’s invocation is extremely humble, expressing his utter dependence on God’s grace in speaking through him.",
      url: "https://www.sparknotes.com/poetry/paradiselost/section1/",
    },
    {
      source: "Paradise Lost, Book 1, Commentary",
      author: "R. Cunningham",
      quote:
        "In the first 26 lines of the poem the narrator, in keeping with the tradition of epic poetry, invokes the aid of his “Heav’nly Muse.”",
      url: "https://socrates.acadiau.ca/courses/engl/rcunningham/2283-W15/collect/Bk1.html",
    },
    {
      source: "The Review of English Studies",
      author: "Christopher Ricks",
      quote:
        "The appeal to freedom in Milton’s note on the verse is justified, by the unusual flexibility of movement the poet finds within the prosodic norms.",
      url: "https://doi.org/10.1093/res/hgl150",
    },
  ],
  faqs: [
    {
      q: "What is the main meaning of Paradise Lost's opening?",
      plain:
        "The opening states that the epic will explain humanity's fall and loss of Eden while exploring how those events fit within divine providence. Milton asks the Holy Spirit to help him make this difficult theological argument understandable.",
    },
    {
      q: "What is Paradise Lost about?",
      plain:
        "The full epic retells the biblical Fall: Satan's rebellion, his temptation of Adam and Eve, their disobedience, and their expulsion from Eden. It also considers free will, obedience, justice, and the possibility of redemption.",
    },
    {
      q: "What form and meter does Paradise Lost use?",
      plain:
        "It uses blank verse: unrhymed iambic pentameter. Milton varies the regular five-beat line with enjambment, pauses, inversions, and changes in syntax to create a flexible epic voice.",
      href: "/tools/iambic-pentameter-checker",
      hrefLabel: "Open the iambic pentameter checker",
    },
    {
      q: "Why does Milton invoke a heavenly muse?",
      plain:
        "The invocation follows the classical epic convention of asking for poetic inspiration, but Milton Christianizes it. His muse is linked to the Spirit that inspired Moses and was present at creation, giving the poem a source of authority beyond the pagan classical tradition.",
    },
  ],
  sources: [
    {
      label: "Paradise Lost (1667), Book I — full text",
      url: "https://en.wikisource.org/wiki/Paradise_Lost_(1667)/Book_I",
      publisher: "Wikisource",
    },
    {
      label: "Paradise Lost: Book I, Lines 1–26 — analysis",
      url: "https://www.sparknotes.com/poetry/paradiselost/section1/",
      publisher: "SparkNotes",
    },
    {
      label: "Paradise Lost, Book 1, Commentary",
      url: "https://socrates.acadiau.ca/courses/engl/rcunningham/2283-W15/collect/Bk1.html",
      publisher: "Acadia University",
    },
    {
      label: "The Verse — 1667 first edition",
      url: "https://ota.bodleian.ox.ac.uk/repository/xmlui/bitstream/handle/20.500.12024/3022/3022.html?sequence=6&isAllowed=y",
      publisher: "Oxford Text Archive",
    },
  ],
  cta: "Write with this poem’s meter in the editor",
};

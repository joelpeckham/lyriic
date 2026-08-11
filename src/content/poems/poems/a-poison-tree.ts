import type { PoemAnalysisContent } from "../types";
import { poemMeterSettings } from "../settings";

export const aPoisonTreePoem: PoemAnalysisContent = {
  slug: "a-poison-tree",
  status: "ready",
  poemTitle: "A Poison Tree",
  author: "William Blake",
  yearPublished: 1794,
  publicDomainBasis:
    "First published in Songs of Experience in 1794; William Blake died in 1827, so the poem is public domain in the United States.",
  title: "A Poison Tree Analysis & Meaning — William Blake — lyriic",
  description:
    "A Poison Tree analysis and meaning: William Blake’s poem traces how hidden anger grows through secrecy, deceit, and revenge.",
  h1: "A Poison Tree analysis",
  intro:
    "This analysis of William Blake’s “A Poison Tree” follows the speaker’s anger from honest expression to secret cultivation, then examines the bright apple, the foe, and the poem’s unsettling final image.",
  text: `I was angry with my friend;
I told my wrath, my wrath did end.
I was angry with my foe:
I told it not, my wrath did grow.

And I waterd it in fears,
Night & morning with my tears:
And I sunned it with smiles,
And with soft deceitful wiles.

And it grew both day and night.
Till it bore an apple bright.
And my foe beheld it shine,
And he knew that it was mine.

And into my garden stole,
When the night had veild the pole;
In the morning glad I see;
My foe outstretched beneath the tree.`,
  fullTextSource: {
    label: "A Poison Tree",
    url: "https://www.poetryfoundation.org/poems/45952/a-poison-tree",
    publisher: "Poetry Foundation",
  },
  editorSettings: poemMeterSettings("common-meter", {
    showMeterBreaks: true,
    showRhymeScheme: true,
  }),
  summary: [
    "The speaker contrasts two responses to anger. Speaking openly to a friend ends the wrath, while concealing anger toward a foe allows it to grow.",
    "The hidden wrath becomes a tree fed by fear, tears, false smiles, and deceit. It produces a bright apple that draws the foe into the speaker’s garden; by morning, the foe lies beneath the tree.",
  ],
  meaning: [
    "The poem’s central warning is not simply that anger exists, but that secrecy changes its form. The speaker’s phrase “I told it not” begins a process of deliberate, almost horticultural cultivation: resentment is watered, sunned, and maintained until it becomes capable of harm.",
    "Blake makes the speaker morally implicated. The foe trespasses, but the speaker takes satisfaction in the death—“glad I see”—after having disguised hostility with “smiles” and “soft deceitful wiles.” The ending therefore refuses a clean division between innocent victim and guilty enemy.",
    "The bright apple is attractive precisely because the poison has been made to look desirable. Its garden setting evokes the forbidden fruit of Genesis, but Blake reverses the familiar story: this fruit grows from concealed anger and deceit, and its consequence is not merely a fall from innocence but apparent death. The foe’s knowledge that the apple is “mine” also makes the fruit a shared sign of the conflict between them.",
  ],
  themes: [
    {
      theme: "Anger and communication",
      discussion:
        "The opening couplet presents expression as a release: telling the friend about the anger brings it to an end. The parallel lines about the foe invert that outcome, showing how unspoken wrath becomes an active force.",
    },
    {
      theme: "Secrecy and hypocrisy",
      discussion:
        "The speaker does not merely remain silent; they perform friendliness while nurturing hostility. Fear, tears, smiles, and “deceitful wiles” turn secrecy into a sustained practice of concealment.",
    },
    {
      theme: "Revenge and moral complicity",
      discussion:
        "The speaker’s gladness at finding the foe beneath the tree makes the final scene disturbing rather than triumphant. The poem exposes revenge as a relationship in which both sides are drawn into the consequences of hatred.",
    },
    {
      theme: "Temptation and the Fall",
      discussion:
        "The shining apple recalls the biblical forbidden fruit, but its origin is psychological and interpersonal: it is produced by the speaker’s hidden wrath. The image joins attraction, knowledge, trespass, and destruction.",
    },
  ],
  formAndMeter: [
    "The poem has four quatrains with short, strongly stressed lines. It is often read through the flexible tradition of common meter, although Blake’s compact phrasing and occasional variations make the rhythm feel closer to a dark nursery rhyme than to a mechanically regular hymn stanza.",
    "Each stanza is organized around paired end rhymes, including “friend”/“end,” “foe”/“grow,” and “night”/“bright.” The simple pattern gives the poem a memorable, almost childlike surface that contrasts with its adult subject: deception, revenge, and death.",
    "The repeated syntax of “I was angry” and “I told” sets up the poem’s moral experiment. In the final stanza, the movement from night to morning compresses the hidden process into a stark discovery, while the shift to “glad I see” reveals the speaker’s pleasure in the outcome.",
  ],
  literaryDevices: [
    {
      device: "Extended metaphor",
      example: "And I waterd it in fears, / Night & morning with my tears",
      discussion:
        "The speaker’s wrath becomes a tree that can be watered, sunned, and grown. The metaphor makes emotional repression seem like deliberate cultivation rather than passive waiting.",
    },
    {
      device: "Antithesis and parallelism",
      example: "I told my wrath, my wrath did end. ... I told it not, my wrath did grow.",
      discussion:
        "The nearly repeated sentence structure places communication and concealment side by side. The tiny verbal difference—telling versus not telling—produces opposite emotional consequences.",
    },
    {
      device: "Symbolism",
      example: "Till it bore an apple bright.",
      discussion:
        "The apple is both tempting fruit and the visible product of resentment. Its brightness disguises the poison within and invites a reading shaped by the forbidden fruit of Eden.",
    },
    {
      device: "Dramatic irony",
      example: "And with soft deceitful wiles.",
      discussion:
        "The foe sees the speaker’s apparent surface but not the anger being cultivated underneath. Readers, however, are told exactly how the smiles operate, so the final approach to the apple is ominous from the start.",
    },
  ],
  historicalContext: [
    "Blake published “A Poison Tree” in Songs of Experience in 1794, the Experience half of Songs of Innocence and of Experience. The combined collection is framed as showing “Two Contrary States of the Human Soul,” which helps explain the poem’s contrast between direct feeling and corrupted experience.",
    "The poem is also associated with the title “Christian Forbearance” in Blake’s manuscript history. That title makes the poem’s polite smiles and hidden wrath especially ironic: apparent restraint can conceal malice rather than produce forgiveness.",
    "Blake’s use of the garden and apple places a private quarrel inside a larger biblical vocabulary of temptation and the Fall. The familiar symbols are made unsettling because the poison is produced by the speaker’s own emotional secrecy.",
  ],
  criticalViews: [
    {
      source: "LitCharts",
      quote:
        "The poem uses an extended metaphor to describe the speaker’s anger as growing into a tree that bears poisonous apples.",
      url: "https://www.litcharts.com/poetry/william-blake/a-poison-tree",
    },
    {
      source: "Finding Blake",
      author: "Clare Crossman",
      quote:
        "This apple does not cause the fall of man by being picked and eaten; it causes death destruction and an eerie acknowledgement of the way evil can fascinate and entangle.",
      url: "https://findingblake.org.uk/reflections-on-a-poison-tree/",
    },
    {
      source: "Encyclopedia.com",
      quote:
        "Blake published Songs of Innocence and Songs of Experience in one volume in 1794, adding the descriptive subtitle ‘Shewing the Two Contrary States of the Human Soul.’",
      url: "https://www.encyclopedia.com/arts/educational-magazines/poison-tree",
    },
  ],
  faqs: [
    {
      q: "What is the main meaning of “A Poison Tree”?",
      plain:
        "The poem warns that anger concealed and nurtured through fear and deceit can become destructive. Blake contrasts this with the speaker’s anger toward a friend, which ends after it is openly expressed.",
    },
    {
      q: "What does the apple symbolize in “A Poison Tree”?",
      plain:
        "The apple symbolizes the attractive but poisonous result of hidden resentment. Its garden setting also recalls the forbidden fruit in Genesis, connecting private revenge with temptation and the Fall.",
    },
    {
      q: "Who is the foe in “A Poison Tree”?",
      plain:
        "The foe is an unnamed enemy of the speaker. The lack of a name keeps the conflict broadly human, while the foe’s trespass and death make the speaker’s secret hostility visible through action.",
    },
    {
      q: "Why does the speaker tell the friend but not the foe?",
      plain:
        "The contrast shows two possible responses to anger. Communication with the friend resolves the feeling, while silence toward the foe lets resentment become a concealed plan.",
    },
  ],
  sources: [
    {
      label: "Poem text",
      url: "https://www.poetryfoundation.org/poems/45952/a-poison-tree",
      publisher: "Poetry Foundation",
    },
    {
      label: "Public-domain text and Songs of Experience context",
      url: "https://en.wikisource.org/wiki/A_Poison_Tree",
      publisher: "Wikisource",
    },
    {
      label: "Analysis of anger, secrecy, and the apple",
      url: "https://www.litcharts.com/poetry/william-blake/a-poison-tree",
      publisher: "LitCharts",
    },
    {
      label: "Reflection on the poem’s deceit and apple symbolism",
      url: "https://findingblake.org.uk/reflections-on-a-poison-tree/",
      publisher: "Finding Blake",
    },
  ],
  cta: "Write with this poem’s meter in the editor",
};

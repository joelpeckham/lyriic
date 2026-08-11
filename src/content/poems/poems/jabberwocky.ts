import type { PoemAnalysisContent } from "../types";
import { poemMeterSettings } from "../settings";

export const jabberwockyPoem: PoemAnalysisContent = {
  slug: "jabberwocky",
  status: "ready",
  poemTitle: "Jabberwocky",
  author: "Lewis Carroll",
  yearPublished: 1871,
  publicDomainBasis:
    "First published in Through the Looking-Glass in 1871; Lewis Carroll (Charles Lutwidge Dodgson) died in 1898, and this nineteenth-century text is public domain in the United States.",
  title: "Jabberwocky Analysis & Meaning — Lewis Carroll — lyriic",
  description:
    "Jabberwocky analysis and meaning: explore Lewis Carroll’s nonsense words, portmanteaus, ballad structure, sound, and monster-slaying narrative.",
  h1: "Jabberwocky analysis",
  intro:
    "This analysis of Lewis Carroll’s “Jabberwocky” follows its strange words through a remarkably familiar ballad form. The poem makes a story legible through rhythm, rhyme, syntax, and sound even when its vocabulary remains partly unknown.",
  text: `’Twas brillig, and the slithy toves
Did gyre and gimble in the wabe:
All mimsy were the borogoves,
And the mome raths outgrabe.

“Beware the Jabberwock, my son!
The jaws that bite, the claws that catch!
Beware the Jubjub bird, and shun
The frumious Bandersnatch!”

He took his vorpal sword in hand:
Long time the manxome foe he sought—
So rested he by the Tumtum tree,
And stood awhile in thought.

And, as in uffish thought he stood,
The Jabberwock, with eyes of flame,
Came whiffling through the tulgey wood,
And burbled as it came!

One, two! One, two! And through and through
The vorpal blade went snicker-snack!
He left it dead, and with its head
He went galumphing back.

“And hast thou slain the Jabberwock?
Come to my arms, my beamish boy!
O frabjous day! Callooh! Callay!”
He chortled in his joy.

’Twas brillig, and the slithy toves
Did gyre and gimble in the wabe:
All mimsy were the borogoves,
And the mome raths outgrabe.`,
  fullTextSource: {
    label: "Through the Looking-Glass, and What Alice Found There",
    url: "https://gutenberg.org/files/12/12-h/12-h.htm",
    publisher: "Project Gutenberg",
  },
  editorSettings: poemMeterSettings("common-meter", {
    showCounts: true,
    showStress: true,
    showMeterBreaks: true,
    showRhymeScheme: true,
  }),
  summary: [
    "A father warns his son about the Jabberwock, the Jubjub bird, and the frumious Bandersnatch. The son takes up a vorpal sword, finds the monster, kills it, and returns home in triumph.",
    "The opening stanza returns at the end, so the victory does not replace the strange world that began the poem. The narrative is clear enough to follow even though many of its words must be inferred from context, sound, and grammar.",
  ],
  meaning: [
    "“Jabberwocky” turns nonsense into a reading experience rather than a simple absence of meaning. Familiar syntax and a recognizable adventure plot give the reader a framework, while invented words leave room for physical impressions and imaginative guesses.",
    "The poem’s mock-heroic force comes from the contrast between epic danger and playful language. “Vorpal,” “snicker-snack,” and “galumphing” make the fight vivid through sound, but the exaggerated celebration keeps the monster-slaying story light and theatrical.",
  ],
  themes: [
    {
      theme: "Meaning through sound and context",
      discussion:
        "Words such as “tulgey,” “whiffling,” and “burbled” suggest movement or texture before they can be defined. Their grammatical positions, repeated sounds, and neighboring words let readers build provisional meanings.",
    },
    {
      theme: "Courage and heroic adventure",
      discussion:
        "The poem uses the pattern of a warning, quest, combat, and homecoming. The son’s unnamed identity makes him feel like a folk-tale hero, while the invented vocabulary turns a familiar quest into a newly imagined one.",
    },
    {
      theme: "Playful instability",
      discussion:
        "The poem sounds orderly but keeps disrupting certainty. Its steady ballad pulse and recurring rhyme invite confidence, while its nonce words, abrupt exclamations, and rhythmic variations keep the reader off balance.",
    },
  ],
  formAndMeter: [
    "The poem has seven quatrains, or four-line stanzas, and follows the broad shape of a traditional narrative ballad. The end rhymes are generally ABAB, though the strength and exactness of individual rhymes vary.",
    "The meter is predominantly iambic and close to common ballad meter: the first and third lines tend toward four beats, while the second and fourth tend toward three. The pattern is an approximation rather than a mechanically exact scheme, which helps the poem sound both traditional and comic.",
    "The final stanza repeats the first almost verbatim. That circular frame makes the adventure feel like a story or song that can be performed again, while the recurring nonsense turns the opening landscape into a refrain.",
  ],
  literaryDevices: [
    {
      device: "Portmanteau words",
      example: "“slithy” and “mimsy”",
      discussion:
        "Carroll blends words or meanings into compact coinages: “slithy” combines “lithe” and “slimy,” while “mimsy” suggests “miserable” and “flimsy.” The result is not definition-free; it packs several sensory suggestions into one word. Humpty Dumpty later explains this method as putting two meanings into one portmanteau.",
    },
    {
      device: "Nonsense and nonce vocabulary",
      example: "“brillig,” “toves,” “borogoves,” and “outgrabe”",
      discussion:
        "Many words are invented for this poem or are used in unusual ways. Their suffixes, syntax, consonants, and placement still signal whether they act as nouns, verbs, or adjectives, allowing readers to grasp a scene without a complete dictionary.",
    },
    {
      device: "Onomatopoeia and sound symbolism",
      example: "“The vorpal blade went snicker-snack!”",
      discussion:
        "The clipped, repeated consonants of “snicker-snack” imitate a sharp cutting sound. “Jabberwocky” also uses “whiffling,” “burbled,” and “chortled” to make motion and emotion audible.",
    },
    {
      device: "Repetition and framing",
      example: "“’Twas brillig, and the slithy toves”",
      discussion:
        "Repeating the first stanza at the close encloses the quest in a musical frame. The hero’s success changes the plot, but the surrounding landscape continues as before.",
    },
  ],
  historicalContext: [
    "“Jabberwocky” appeared in Chapter 1 of Carroll’s Through the Looking-Glass, and What Alice Found There in 1871. Alice reads the poem in a looking-glass book and turns it around to read the reversed writing; afterward she can identify only the broad fact that “somebody killed something.”",
    "The opening stanza had appeared earlier, in 1855, as “Stanza of Anglo-Saxon Poetry” in Carroll’s family manuscript magazine Mischmasch. Carroll later expanded the stanza into the seven-stanza narrative found in Through the Looking-Glass.",
    "The poem’s portmanteau idea is explained later in the same novel by Humpty Dumpty. That scene gives readers possible glosses, but it does not close every ambiguity: the poem’s imaginative power depends partly on meanings that remain felt rather than fixed.",
  ],
  criticalViews: [
    {
      source: "Jabberwocky: Meter",
      author: "SparkNotes",
      quote:
        "“Jabberwocky” is composed in a verse form that is very close to what’s known as “ballad meter.”",
      url: "https://www.sparknotes.com/poetry/jabberwocky/meter/",
    },
    {
      source: "“Jabberwocky” by Lewis Carroll — Literary Analysis",
      author: "Poetry Lovers’ Page",
      quote:
        "The reader hears a ballad and processes it as one, regardless of whether the words have definitions.",
      url: "https://poetryloverspage.com/poets/carroll/jabberwocky/literary-analysis",
    },
    {
      source: "Through the Looking-Glass, and What Alice Found There",
      author: "Lewis Carroll",
      quote:
        "“Somehow it seems to fill my head with ideas——only I don't exactly know what they are!”",
      url: "https://gutenberg.org/files/12/12-h/12-h.htm",
    },
  ],
  faqs: [
    {
      q: "What is the main meaning of “Jabberwocky”?",
      plain:
        "The poem shows how readers can recognize story, mood, and action even when many words are invented. Its nonsense language does not erase meaning; it makes meaning depend on sound, grammar, rhythm, and imagination.",
    },
    {
      q: "What are portmanteau words in “Jabberwocky”?",
      plain:
        "Portmanteau words combine parts or meanings from existing words. “Slithy” blends “lithe” and “slimy,” while “mimsy” suggests “miserable” and “flimsy”; “frumious” combines “fuming” and “furious.”",
    },
    {
      q: "What is the structure and meter of “Jabberwocky”?",
      plain:
        "It is a seven-quatrain narrative ballad with a generally ABAB rhyme pattern. The lines are predominantly iambic and approximate common ballad meter, with longer four-beat lines alternating with shorter three-beat lines.",
    },
    {
      q: "Why is “Jabberwocky” called a nonsense poem?",
      plain:
        "It uses many invented or unfamiliar words, but its syntax, sounds, rhyme, and plot remain intelligible. “Nonsense” here means that conventional definitions are disrupted, not that the poem has no design or emotional effect.",
    },
  ],
  sources: [
    {
      label: "Full text in Through the Looking-Glass",
      url: "https://gutenberg.org/files/12/12-h/12-h.htm",
      publisher: "Project Gutenberg",
    },
    {
      label: "Chapter 1 text and Alice’s response",
      url: "https://en.wikisource.org/wiki/Through_the_Looking-Glass,_and_What_Alice_Found_There/Chapter_I",
      publisher: "Wikisource",
    },
    {
      label: "Ballad meter analysis",
      url: "https://www.sparknotes.com/poetry/jabberwocky/meter/",
      publisher: "SparkNotes",
    },
    {
      label: "Nonsense words and portmanteaus",
      url: "https://poetryloverspage.com/poets/carroll/jabberwocky/literary-analysis",
      publisher: "Poetry Lovers’ Page",
    },
  ],
  cta: "Write with this poem’s ballad meter in the editor",
};

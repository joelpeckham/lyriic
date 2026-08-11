import type { PoemAnalysisContent } from "../types";
import { poemMeterSettings } from "../settings";

export const ozymandiasPoem: PoemAnalysisContent = {
  slug: "ozymandias",
  status: "ready",
  poemTitle: "Ozymandias",
  author: "Percy Bysshe Shelley",
  yearPublished: 1818,
  publicDomainBasis:
    "First published in The Examiner in January 1818, so the poem is public domain in the United States.",
  title: "Ozymandias Analysis & Meaning — Percy Bysshe Shelley — lyriic",
  description:
    "Ozymandias analysis and meaning: Shelley’s sonnet on hubris, ruined power, art, and the persistence of time.",
  h1: "Ozymandias analysis",
  intro:
    "This Ozymandias analysis explains how Shelley uses a ruined statue, a traveler’s frame, and an ironic inscription to examine power and impermanence.",
  text: `I met a traveller from an antique land,
Who said: “Two vast and trunkless legs of stone
Stand in the desert. Near them, on the sand,
Half sunk, a shattered visage lies, whose frown,
And wrinkled lip, and sneer of cold command,
Tell that its sculptor well those passions read
Which yet survive, stamped on these lifeless things,
The hand that mocked them, and the heart that fed:
And on the pedestal these words appear:
“My name is Ozymandias, king of kings:
Look on my works, ye Mighty, and despair!”
Nothing beside remains. Round the decay
Of that colossal wreck, boundless and bare
The lone and level sands stretch far away.”`,
  fullTextSource: {
    label: "The Complete Poetical Works of Percy Bysshe Shelley",
    url: "https://en.wikisource.org/wiki/The_Complete_Poetical_Works_of_Percy_Bysshe_Shelley_(ed._Hutchinson,_1914)/Ozymandias",
    publisher: "Wikisource",
  },
  editorSettings: poemMeterSettings("sonnet", {
    showRhymeScheme: true,
    showMeterBreaks: true,
  }),
  summary: [
    "The speaker reports what a traveler saw in an ancient desert: the broken remains of a colossal statue. Only legs, a shattered face, and a pedestal survive.",
    "The inscription presents Ozymandias as an absolute ruler, but the empty landscape makes that boast absurd. The ruler’s intended monument to power has become evidence of power’s fragility.",
  ],
  meaning: [
    "Shelley turns political ambition into an ironic image: Ozymandias wants later generations to despair before his works, yet there are no works left to see. The poem’s central contrast is between the language of permanence and the material fact of decay.",
    "The traveler’s account also complicates the warning. The king and his kingdom have vanished, but the sculptor’s interpretation and the written inscription preserve a recognizable record of his character. Art and language outlast the authority they once served, even when they preserve it critically.",
  ],
  themes: [
    {
      theme: "Hubris and tyranny",
      discussion:
        "The title and inscription give Ozymandias an extravagant sense of superiority. His “sneer of cold command” makes the statue a portrait of authoritarian pride, while the ruined monument exposes the limits of that pride.",
    },
    {
      theme: "The impermanence of power",
      discussion:
        "“Nothing beside remains” answers the king’s command with stark finality. Political power, empire, and reputation cannot control the passage of time or guarantee the survival of their monuments.",
    },
    {
      theme: "Art, memory, and time",
      discussion:
        "The sculptor’s hand and the pedestal’s words survive in fragments. The poem suggests that art can preserve a ruler’s image, but it cannot preserve the ruler’s power or control the meaning later readers make from it.",
    },
  ],
  formAndMeter: [
    "“Ozymandias” is a 14-line sonnet in generally iambic pentameter. Its narrative is framed through several voices: the speaker quotes a traveler, who describes a sculptor and then reads the king’s inscription.",
    "The poem’s rhyme is deliberately irregular rather than a standard Shakespearean or Petrarchan pattern. It is often described as ABABACDCEDEFEF, with slant rhymes such as “stone”/“frown” and “read”/“fed.” The disrupted sonnet pattern echoes the statue’s broken form.",
    "The syntax moves across line breaks and pauses around the missing statue and the inscription. The final couplet-like closure does not restore order; it leaves the eye moving across the “boundless and bare” desert.",
  ],
  literaryDevices: [
    {
      device: "Frame narrative",
      example: "I met a traveller from an antique land",
      discussion:
        "The traveler’s story distances the speaker from Ozymandias and makes the ruined king part of a chain of transmission: observer, traveler, speaker, and reader.",
    },
    {
      device: "Irony",
      example: "Look on my works, ye Mighty, and despair!",
      discussion:
        "The command promises overwhelming evidence of greatness, but it is immediately overturned by “Nothing beside remains.” The boast survives only as an ironic inscription.",
    },
    {
      device: "Imagery and alliteration",
      example: "The lone and level sands stretch far away",
      discussion:
        "The repeated l and s sounds create a smooth, extended landscape that contrasts with the hard fragments of the statue and emphasizes the desert’s scale.",
    },
    {
      device: "Synecdoche",
      example: "Two vast and trunkless legs of stone",
      discussion:
        "The surviving body parts stand for a once-complete ruler and empire. Their separation from the rest of the statue makes absence visible.",
    },
  ],
  historicalContext: [
    "Shelley wrote the poem in 1817, and it was first published in The Examiner on January 11, 1818. It was written in friendly competition with Horace Smith after a discussion of ancient Egypt and a passage by the Greek historian Diodorus Siculus.",
    "Ozymandias is the Greek name associated with the Egyptian pharaoh Ramses II. Diodorus described a colossal statue and a boastful inscription; Shelley had not seen the statue itself, so the poem’s image comes through historical writing and literary imagination.",
    "The traveler frame reflects the early nineteenth-century European fascination with Egyptian antiquity after Napoleon’s campaign in Egypt. Shelley transforms that fascination into a warning about rulers who treat monuments as proof that their authority will last.",
  ],
  criticalViews: [
    {
      source: "Poetry Foundation",
      author: "David Mikics",
      quote:
        "Timelessness can be achieved only by the poet’s words, not by the ruler’s will to dominate.",
      url: "https://www.poetryfoundation.org/articles/69503/percy-bysshe-shelley-ozymandias",
    },
    {
      source: "LitCharts",
      quote:
        "The inscription stands in ironic contrast to the decrepit reality of the statue, however, underscoring the ultimate transience of political power.",
      url: "https://www.litcharts.com/poetry/percy-bysshe-shelley/ozymandias",
    },
  ],
  faqs: [
    {
      q: "What is the main meaning of “Ozymandias”?",
      plain:
        "The sonnet shows that political power and human achievement are temporary. Ozymandias’s boast survives, but the empire and monuments it celebrates have disappeared.",
    },
    {
      q: "Who is Ozymandias?",
      plain:
        "Ozymandias is the Greek name associated with Ramses II, an ancient Egyptian pharaoh. Shelley uses the historical figure as the center of a broader meditation on rulers, monuments, and time.",
    },
    {
      q: "Why does Shelley use a traveler’s story?",
      plain:
        "The traveler creates distance and layers of perspective. The ruined statue reaches the speaker and reader through testimony, emphasizing how history and memory are passed on through language.",
    },
    {
      q: "What is unusual about the sonnet’s rhyme scheme?",
      plain:
        "It is a 14-line sonnet in mostly iambic pentameter, but its rhyme scheme is irregular—often given as ABABACDCEDEFEF—with several slant rhymes instead of a conventional sonnet pattern.",
    },
  ],
  sources: [
    {
      label: "Poem text and 1818 publication history",
      url: "https://en.wikisource.org/wiki/The_Complete_Poetical_Works_of_Percy_Bysshe_Shelley_(ed._Hutchinson,_1914)/Ozymandias",
      publisher: "Wikisource",
    },
    {
      label: "Percy Bysshe Shelley: “Ozymandias”",
      url: "https://www.poetryfoundation.org/articles/69503/percy-bysshe-shelley-ozymandias",
      publisher: "Poetry Foundation",
    },
    {
      label: "First printing and historical transcription",
      url: "https://anthologydev.lib.virginia.edu/work/ShelleyP/shelley-ozymandias",
      publisher: "Literature in Context, University of Virginia",
    },
  ],
  cta: "Write with this poem’s meter in the editor",
};

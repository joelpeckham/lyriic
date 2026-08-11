import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

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
    p(
      "The speaker reports what a traveler saw in an ancient desert: the broken remains of a colossal statue. Only legs, a shattered face, and a pedestal survive.",
    ),
    excerpt(
      `I met a traveller from an antique land,
Who said: “Two vast and trunkless legs of stone
Stand in the desert.`,
    ),
    p(
      "The inscription presents Ozymandias as an absolute ruler, but the empty landscape makes that boast absurd. The ruler’s intended monument to power has become evidence of power’s fragility.",
      ["litcharts-ozymandias"],
    ),
  ],
  meaning: [
    p(
      "Shelley turns political ambition into an ironic image: Ozymandias wants later generations to despair before his works, yet there are no works left to see. The poem’s central contrast is between the language of permanence and the material fact of decay.",
      ["litcharts-ozymandias"],
    ),
    excerpt(
      `“My name is Ozymandias, king of kings:
Look on my works, ye Mighty, and despair!”
Nothing beside remains.`,
    ),
    p(
      "The traveler’s account also complicates the warning. The king and his kingdom have vanished, but the sculptor’s interpretation and the written inscription preserve a recognizable record of his character. Art and language outlast the authority they once served, even when they preserve it critically.",
      ["poetry-foundation-mikics"],
    ),
  ],
  themes: [
    {
      theme: "Hubris and tyranny",
      blocks: [
        p(
          "The title and inscription give Ozymandias an extravagant sense of superiority. His “sneer of cold command” makes the statue a portrait of authoritarian pride, while the ruined monument exposes the limits of that pride.",
          ["uva-ozymandias"],
        ),
      ],
    },
    {
      theme: "The impermanence of power",
      blocks: [
        p(
          "“Nothing beside remains” answers the king’s command with stark finality. Political power, empire, and reputation cannot control the passage of time or guarantee the survival of their monuments.",
          ["litcharts-ozymandias"],
        ),
      ],
    },
    {
      theme: "Art, memory, and time",
      blocks: [
        p(
          "The sculptor’s hand and the pedestal’s words survive in fragments. Timelessness belongs to the poet’s words more than to the ruler’s will to dominate.",
          ["poetry-foundation-mikics"],
        ),
      ],
    },
  ],
  formAndMeter: [
    p(
      "“Ozymandias” is a 14-line sonnet in generally iambic pentameter. Its narrative is framed through several voices: the speaker quotes a traveler, who describes a sculptor and then reads the king’s inscription.",
      ["poetry-foundation-poem"],
    ),
    p(
      "The poem’s rhyme is deliberately irregular rather than a standard Shakespearean or Petrarchan pattern. It is often described as ABABACDCEDEFEF, with slant rhymes such as “stone”/“frown” and “read”/“fed.” The disrupted sonnet pattern echoes the statue’s broken form.",
    ),
  ],
  literaryDevices: [
    {
      device: "Frame narrative",
      blocks: [
        excerpt(`I met a traveller from an antique land`),
        p(
          "The traveler’s story distances the speaker from Ozymandias and makes the ruined king part of a chain of transmission: observer, traveler, speaker, and reader.",
        ),
      ],
    },
    {
      device: "Irony",
      blocks: [
        excerpt(`Look on my works, ye Mighty, and despair!`),
        p(
          "The command promises overwhelming evidence of greatness, but it is immediately overturned by “Nothing beside remains.” The boast survives only as an ironic inscription.",
          ["litcharts-ozymandias"],
        ),
      ],
    },
    {
      device: "Imagery",
      blocks: [
        excerpt(`The lone and level sands stretch far away.`),
        p(
          "The repeated l and s sounds create a smooth, extended landscape that contrasts with the hard fragments of the statue and emphasizes the desert’s scale.",
        ),
      ],
    },
  ],
  historicalContext: [
    p(
      "Shelley wrote the poem in 1817, and it was first published in The Examiner on January 11, 1818. It was written in friendly competition with Horace Smith after a discussion of ancient Egypt and a passage by the Greek historian Diodorus Siculus.",
      ["uva-ozymandias"],
    ),
    p(
      "Ozymandias is the Greek name associated with the Egyptian pharaoh Ramses II. Diodorus described a colossal statue and a boastful inscription; Shelley had not seen the statue itself, so the poem’s image comes through historical writing and literary imagination.",
      ["poetry-foundation-mikics"],
    ),
  ],
  citations: [
    {
      id: "poetry-foundation-mikics",
      source: "Poetry Foundation",
      author: "David Mikics",
      quote:
        "Timelessness can be achieved only by the poet’s words, not by the ruler’s will to dominate.",
      url: "https://www.poetryfoundation.org/articles/69503/percy-bysshe-shelley-ozymandias",
    },
    {
      id: "litcharts-ozymandias",
      source: "LitCharts",
      quote:
        "The inscription stands in ironic contrast to the decrepit reality of the statue, however, underscoring the ultimate transience of political power.",
      url: "https://www.litcharts.com/poetry/percy-bysshe-shelley/ozymandias",
    },
    {
      id: "uva-ozymandias",
      source: "Literature in Context",
      author: "University of Virginia",
      url: "https://anthologydev.lib.virginia.edu/work/ShelleyP/shelley-ozymandias",
    },
    {
      id: "poetry-foundation-poem",
      source: "Poetry Foundation",
      url: "https://www.poetryfoundation.org/poems/46565/ozymandias",
    },
  ],
  criticalViews: [
    { citeId: "poetry-foundation-mikics" },
    { citeId: "litcharts-ozymandias" },
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
      href: "/tools/sonnet-checker",
      hrefLabel: "Check a sonnet in lyriic",
    },
  ],
  cta: "Write with this poem’s meter in the editor",
};

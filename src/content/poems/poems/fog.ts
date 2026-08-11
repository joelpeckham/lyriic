import type { PoemAnalysisContent } from "../types";
import { poemOpenSettings } from "../settings";

export const fogPoem: PoemAnalysisContent = {
  slug: "fog",
  status: "ready",
  poemTitle: "Fog",
  author: "Carl Sandburg",
  yearPublished: 1916,
  publicDomainBasis:
    "The Academy of American Poets identifies this poem as public domain; it first appeared in Chicago Poems in 1916.",
  title: "Fog Analysis & Meaning — Carl Sandburg — lyriic",
  description:
    "Fog analysis and meaning: Carl Sandburg’s six-line poem turns a passing weather event into a quiet, watchful cat.",
  h1: "Fog analysis",
  intro:
    "This Fog analysis explains how Carl Sandburg uses an extended cat metaphor, compressed free verse, and a harbor-city setting to make a brief arrival and departure feel mysterious.",
  text: `The fog comes
on little cat feet.

It sits looking
over harbor and city
on silent haunches
and then moves on.`,
  fullTextSource: {
    label: "Fog by Carl Sandburg",
    url: "https://poets.org/poem/fog",
    publisher: "Academy of American Poets",
  },
  editorSettings: poemOpenSettings(),
  summary: [
    "The speaker presents fog as a creature that arrives quietly, settles over a harbor and city, watches for a moment, and then leaves.",
    "The poem’s central image compares fog to a cat. Its small feet, silent haunches, and independent movement give an ordinary weather event the presence of a living observer.",
  ],
  meaning: [
    "Sandburg makes the fog feel active without explaining or personifying it through a long narrative. The cat metaphor lets readers sense its stealth, patience, and self-possession.",
    "The final phrase, “and then moves on,” keeps the poem open-ended. The fog does not conquer or transform the city; it visits, changes perception briefly, and disappears.",
  ],
  themes: [
    {
      theme: "The mystery of nature",
      discussion:
        "The fog is familiar but difficult to understand. By giving it catlike behavior, Sandburg makes the natural world seem alert, independent, and slightly unknowable.",
    },
    {
      theme: "Transience",
      discussion:
        "The poem follows a complete arc from arrival to departure in six short lines. Its brevity mirrors fog’s temporary presence and the fleeting nature of observation.",
    },
    {
      theme: "Nature and the city",
      discussion:
        "The fog moves over both “harbor and city,” placing a soft, shapeless natural force above an organized urban landscape. The city becomes a scene the fog can quietly inspect.",
    },
  ],
  formAndMeter: [
    "“Fog” is a six-line free-verse poem arranged as a two-line couplet followed by a four-line stanza. The first stanza introduces the cat metaphor; the second shows the fog sitting, looking, and moving away.",
    "There is no fixed meter or rhyme scheme. The varied line lengths and plain syntax create a flexible, quiet rhythm that suits the fog’s unannounced movement.",
    "The poem’s three-part progression—coming, sitting and looking, then moving on—gives the miniature a complete shape. Its compression and focus on one concrete natural image also recall haiku, though it is not a traditional Japanese haiku.",
  ],
  literaryDevices: [
    {
      device: "Extended metaphor",
      example: "The fog comes / on little cat feet",
      discussion:
        "The poem sustains the comparison between fog and cat through “feet,” “sits,” “haunches,” and “moves on.” The metaphor makes the fog seem alive and self-directed.",
    },
    {
      device: "Personification",
      example: "It sits looking / over harbor and city",
      discussion:
        "Fog is given the posture and attention of an animal watching a scene. This turns passive weather into a quiet presence with apparent agency.",
    },
    {
      device: "Alliteration and consonance",
      example: "little cat feet",
      discussion:
        "The repeated l, c, and t sounds make the opening image tactile and lightly percussive. The sound pattern suggests the delicate approach of the imagined cat.",
    },
    {
      device: "Enjambment",
      example: "It sits looking / over harbor and city",
      discussion:
        "The line break delays the object of “looking,” extending the fog’s gaze across the page and allowing the city to emerge gradually.",
    },
  ],
  historicalContext: [
    "“Fog” first appeared in Sandburg’s 1916 collection Chicago Poems. Sandburg was living and working in Chicago, a city whose harbor and rapid industrial growth often shaped his poetry.",
    "The poem is commonly associated with Sandburg’s attempt to make an American version of haiku: a brief, free, image-centered poem rather than a strict imitation of Japanese form.",
    "Chicago is a plausible setting because the poem names a harbor and appeared in Chicago Poems, but the text never identifies the city. Its deliberately spare setting allows the fog to belong to any harbor city.",
  ],
  criticalViews: [
    {
      source: "LitCharts",
      quote:
        "The comparison makes the fog, which readers might take for an ordinary natural phenomenon, seem mysterious and unknowable.",
      url: "https://www.litcharts.com/poetry/carl-sandburg/fog",
    },
    {
      source: "Harriet Monroe, quoted in Wikipedia",
      author: "Harriet Monroe",
      quote:
        "The loveliness of ... a fog coming on “little cat feet,”—the incommunicable loveliness of the earth, of life—is too keen to be borne.",
      url: "https://en.wikipedia.org/wiki/Fog_(poem)",
    },
  ],
  faqs: [
    {
      q: "What is the main meaning of “Fog”?",
      plain:
        "The poem presents fog as a quiet, catlike visitor. Its brief appearance suggests the mystery and beauty of nature, as well as the transience of any single moment.",
    },
    {
      q: "Why does Sandburg compare fog to a cat?",
      plain:
        "Cats can move silently, appear and disappear quickly, and watch from a still position. Those qualities help Sandburg make the fog feel alive, independent, and slightly mysterious.",
    },
    {
      q: "What poetic form does “Fog” use?",
      plain:
        "“Fog” is free verse: it has six lines, two stanzas, no fixed meter, and no regular rhyme scheme. Its compact, image-driven structure resembles Sandburg’s idea of an American haiku.",
    },
    {
      q: "Is “Fog” about Chicago?",
      plain:
        "Chicago is a likely context because Sandburg lived there and the poem appeared in Chicago Poems, but the poem only says “harbor and city.” Its setting remains intentionally open.",
    },
  ],
  sources: [
    {
      label: "Poem text and public-domain notice",
      url: "https://poets.org/poem/fog",
      publisher: "Academy of American Poets",
    },
    {
      label: "Chicago Poems text and bibliographic record",
      url: "https://www.bartleby.com/lit-hub/chicago-poems/56-fog",
      publisher: "Bartleby",
    },
    {
      label: "Publication history and reception",
      url: "https://en.wikipedia.org/wiki/Fog_(poem)",
      publisher: "Wikipedia",
    },
    {
      label: "Form, devices, and context",
      url: "https://www.litcharts.com/poetry/carl-sandburg/fog",
      publisher: "LitCharts",
    },
  ],
  cta: "Write with this poem’s open form in the editor",
};

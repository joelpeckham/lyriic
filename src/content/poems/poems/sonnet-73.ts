import type { PoemAnalysisContent } from "../types";
import { poemMeterSettings } from "../settings";

export const sonnet73Poem: PoemAnalysisContent = {
  slug: "sonnet-73",
  status: "ready",
  poemTitle: "Sonnet 73",
  author: "William Shakespeare",
  yearPublished: 1609,
  publicDomainBasis:
    "Shakespeare's Sonnets were first published in 1609, placing this poem in the US public domain.",
  title: "Sonnet 73 Analysis & Meaning — William Shakespeare — lyriic",
  description:
    "Read a concise analysis of Shakespeare's Sonnet 73, including its aging metaphors, form, themes, and meaning.",
  h1: "Sonnet 73 analysis",
  intro:
    "This Sonnet 73 analysis explains how Shakespeare turns autumn, twilight, and a dying fire into a meditation on aging, mortality, and love.",
  text: `That time of year thou mayst in me behold
When yellow leaves, or none, or few, do hang
Upon those boughs which shake against the cold,
Bare ruin'd choirs, where late the sweet birds sang.

In me thou see'st the twilight of such day
As after sunset fadeth in the west,
Which by and by black night doth take away,
Death's second self, that seals up all in rest.

In me thou see'st the glowing of such fire
That on the ashes of his youth doth lie,
As the death-bed whereon it must expire,
Consum'd with that which it was nourish'd by.

This thou perceiv'st, which makes thy love more strong,
To love that well which thou must leave ere long.`,
  fullTextSource: {
    label: "Sonnet 73",
    url: "https://www.poetryfoundation.org/poems/45099/sonnet-73-that-time-of-year-thou-mayst-in-me-behold",
    publisher: "The Poetry Foundation",
  },
  editorSettings: poemMeterSettings("sonnet", {
    showRhymeScheme: true,
  }),
  summary: [
    "The speaker asks the beloved to see signs of decline in him: late autumn, fading daylight, and a fire nearly consumed by its own fuel.",
    "The three images move toward shorter and more immediate endings. The couplet turns this mortality into a claim about love: knowing that separation is near makes the beloved's love more intense.",
  ],
  meaning: [
    "The poem is not simply a description of old age. It stages the speaker's gradual approach to disappearance, narrowing from a season to a day and then to the final glow of a fire.",
    "The couplet makes loss part of love's value. The beloved loves what must soon be left, so awareness of impermanence becomes a reason to cherish the relationship more strongly.",
  ],
  themes: [
    {
      theme: "Aging and mortality",
      discussion:
        "Autumn's sparse leaves, twilight's vanishing light, and the fire's last glow all make bodily decline visible. 'Death's second self' links ordinary sleep and darkness to the finality of death.",
    },
    {
      theme: "Time and impermanence",
      discussion:
        "Each quatrain measures a smaller remainder of time: the end of a year, the end of a day, and the end of a fire. This compression makes mortality feel increasingly immediate.",
    },
    {
      theme: "Love strengthened by loss",
      discussion:
        "The final couplet argues that love can grow stronger when both people recognize that the beloved and the relationship are temporary.",
    },
  ],
  formAndMeter: [
    "This is a Shakespearean sonnet: three quatrains followed by a rhyming couplet, with the rhyme scheme ABAB CDCD EFEF GG.",
    "The poem is written chiefly in iambic pentameter. The repeated openings 'In me thou see'st' give the second and third quatrains a parallel structure.",
    "The couplet supplies the turn from images of decline to the emotional consequence of perceiving them.",
  ],
  literaryDevices: [
    {
      device: "Extended metaphor",
      example: "That time of year thou mayst in me behold",
      discussion:
        "The speaker successively compares himself to late autumn, twilight, and a dying fire. Together, the metaphors describe different scales of the same decline.",
    },
    {
      device: "Personification",
      example: "Which by and by black night doth take away",
      discussion:
        "Night acts like an agent that removes the remaining light, giving the transition toward death a deliberate, unavoidable force.",
    },
    {
      device: "Paradox",
      example: "Which makes thy love more strong",
      discussion:
        "The speaker's weakening and approaching loss produce stronger love. The poem therefore makes mortality painful but also emotionally productive.",
    },
    {
      device: "Compressed imagery",
      example: "Bare ruin'd choirs, where late the sweet birds sang",
      discussion:
        "The ruined choir suggests both leafless branches and abandoned places of song. Its silence turns the loss of youth into a vivid, almost architectural image.",
    },
  ],
  historicalContext: [
    "The sonnets were published in the 1609 Quarto under Shakespeare's name. Sonnet 73 belongs to the group traditionally associated with the Fair Youth, though the poems do not establish a complete biographical narrative.",
    "The poem's 'ruin'd choirs' can evoke stripped church interiors and the loss of former music, while also functioning as a natural image of bare branches. The sonnet uses that layered image to connect personal aging with cultural and seasonal change.",
  ],
  criticalViews: [
    {
      source: "Shakespeare Online, quoting John Berryman",
      author: "John Berryman",
      quote:
        "The fundamental emotion [in Sonnet 73] is self-pity. Not an attractive emotion. What renders it pathetic, in the good instead of the bad sense, is the sinister diminution of the time concept, quatrain by quatrain.",
      url: "https://www.shakespeare-online.com/sonnets/73detail.html",
    },
    {
      source: "Shakespeare Online, quoting John Crowe Ransom",
      author: "John Crowe Ransom",
      quote:
        "The structure is good, the three quatrains offering distinct yet equivalent figures for the time of life of the unsuccessful and to-be-pitied lover.",
      url: "https://www.shakespeare-online.com/sonnets/73detail.html",
    },
  ],
  faqs: [
    {
      q: "What is the main meaning of Sonnet 73?",
      plain:
        "The speaker presents aging and mortality through three images, then argues that knowing loss is near can make love more devoted and intense.",
    },
    {
      q: "What are the three metaphors in Sonnet 73?",
      plain:
        "The three quatrains compare the speaker to late autumn, fading twilight, and a dying fire. Each image represents a later stage of decline and a shorter remaining span.",
    },
    {
      q: "What is the form and meter of Sonnet 73?",
      plain:
        "It is a Shakespearean sonnet of fourteen lines in three quatrains and a final couplet, written chiefly in iambic pentameter with an ABAB CDCD EFEF GG rhyme scheme.",
    },
    {
      q: "What does the final couplet of Sonnet 73 mean?",
      plain:
        "The couplet says that the beloved's awareness of the speaker's approaching loss makes love stronger: what must soon be left is loved more carefully now.",
    },
  ],
  sources: [
    {
      label: "Sonnet 73 text",
      url: "https://www.poetryfoundation.org/poems/45099/sonnet-73-that-time-of-year-thou-mayst-in-me-behold",
      publisher: "The Poetry Foundation",
    },
    {
      label: "Analysis and critical commentary",
      url: "https://www.shakespeare-online.com/sonnets/73detail.html",
      publisher: "Shakespeare Online",
    },
  ],
  cta: "Write with this poem's meter in the editor",
};

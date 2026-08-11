import type { PoemAnalysisContent } from "../types";
import { poemMeterSettings } from "../settings";

export const odeOnAGrecianUrnPoem: PoemAnalysisContent = {
  slug: "ode-on-a-grecian-urn",
  status: "ready",
  poemTitle: "Ode on a Grecian Urn",
  author: "John Keats",
  yearPublished: 1820,
  publicDomainBasis:
    "First published in 1820; works first published by 1930 are public domain in the US.",
  title: "Ode on a Grecian Urn Analysis & Meaning — John Keats — lyriic",
  description:
    "An analysis of Keats's Ode on a Grecian Urn, exploring its meaning, themes, imagery, paradoxes, form, and famous final lines.",
  h1: "Ode on a Grecian Urn analysis",
  intro:
    "This Ode on a Grecian Urn analysis explains how Keats uses an imagined Greek urn to examine art, desire, mortality, beauty, and truth.",
  text: `Thou still unravish'd bride of quietness,
Thou foster-child of silence and slow time,
Sylvan historian, who canst thus express
A flowery tale more sweetly than our rhyme:
What leaf-fring'd legend haunts about thy shape
Of deities or mortals, or of both,
In Tempe or the dales of Arcady?
What men or gods are these? What maidens loth?
What mad pursuit? What struggle to escape?
What pipes and timbrels? What wild ecstasy?

Heard melodies are sweet, but those unheard
Are sweeter; therefore, ye soft pipes, play on;
Not to the sensual ear, but, more endear'd,
Pipe to the spirit ditties of no tone:
Fair youth, beneath the trees, thou canst not leave
Thy song, nor ever can those trees be bare;
Bold Lover, never, never canst thou kiss,
Though winning near the goal—yet, do not grieve;
She cannot fade, though thou hast not thy bliss,
For ever wilt thou love; and she be fair!

Ah, happy, happy boughs! that cannot shed
Your leaves, nor ever bid the Spring adieu;
And, happy melodist, unwearied,
For ever piping songs for ever new;
More happy love! more happy, happy love!
For ever warm and still to be enjoy'd,
For ever panting, and for ever young;
All breathing human passion far above,
That leaves a heart high-sorrowful and cloy'd,
A burning forehead, and a parching tongue.

Who are these coming to the sacrifice?
To what green altar, O mysterious priest,
Lead'st thou that heifer lowing at the skies,
And all her silken flanks with garlands drest?
What little town by river or sea shore,
Or mountain-built with peaceful citadel,
Is emptied of this folk, this pious morn?
And, little town, thy streets for evermore
Will silent be; and not a soul to tell
Why thou art desolate, can e'er return.

O Attic shape! Fair attitude! with brede
Of marble men and maidens overwrought,
With forest branches and the trodden weed;
Thou, silent form, dost tease us out of thought
As doth eternity: Cold Pastoral!
When old age shall this generation waste,
Thou shalt remain, in midst of other woe
Than ours, a friend to man, to whom thou say'st,
"Beauty is truth, truth beauty,"—that is all
Ye know on earth, and all ye need to know.`,
  fullTextSource: {
    label: "Ode on a Grecian Urn — Wikisource",
    url: "https://en.wikisource.org/wiki/Keats;_poems_published_in_1820/Ode_on_a_Grecian_Urn",
    publisher: "Wikisource",
  },
  editorSettings: poemMeterSettings("iambic-pentameter", {
    showCounts: true,
    showStress: true,
    showMeterBreaks: true,
    showRhymeScheme: true,
  }),
  summary: [
    "The speaker addresses an ancient Greek urn as a silent bride, foster-child, and historian, then questions the scenes painted on it: musicians, lovers, and a religious procession.",
    "The urn's figures are preserved from age and change, but they are also denied completion. The poem ends by imagining the urn as a lasting friend that offers the enigmatic statement, “Beauty is truth, truth beauty.”",
  ],
  meaning: [
    "Keats presents art as both consolation and limitation. The figures on the urn escape ordinary decay: their music never stops, the trees never lose their leaves, and the lovers remain young. Yet the lover can never kiss, the song can never develop, and the town can never explain why it is empty. Permanence preserves a moment by freezing it.",
    "The final statement does not settle every question the poem raises. The urn's beauty gives the speaker a way to contemplate truth beyond immediate experience, but its silence leaves interpretation unfinished. As the Poetry Foundation notes, the poem's power lies in its unresolved paradoxes about art, life, beauty, and truth.",
  ],
  themes: [
    {
      theme: "Art and mortality",
      discussion:
        "The urn outlasts generations and holds its scenes in a form that does not age. Against that permanence, the speaker places “old age” and the waste of his own generation, making art a possible answer to human transience.",
    },
    {
      theme: "Desire and incompletion",
      discussion:
        "The bold lover is always near the goal but can never kiss the maiden. The poem treats anticipation as intensely pleasurable while also showing the cost of a desire that can never be fulfilled.",
    },
    {
      theme: "Beauty, truth, and uncertainty",
      discussion:
        "The closing aphorism sounds authoritative, but the poem has trained its reader to notice ambiguity. The urn's beauty provokes thought without supplying a single factual account of the people and places it depicts.",
    },
    {
      theme: "Silence and interpretation",
      discussion:
        "The urn is silent, yet the speaker gives it questions, commands, and finally a voice. This tension makes the poem an act of interpretation: the viewer creates meaning while acknowledging that the object cannot answer back.",
    },
  ],
  formAndMeter: [
    "The poem is an ode in five 10-line stanzas. Each stanza uses the rhyme pattern ababcdedce, a scheme that combines alternating quatrain rhymes with a closing couplet-like pair.",
    "Its predominant meter is iambic pentameter, with five metrical feet in most lines. Keats varies the rhythm through substitutions, pauses, repeated stresses, and questions so that the form can sound both controlled and excited.",
    "The poem is also ekphrastic: it uses language to describe and respond to a work of visual art. Its movement from questions, to commands, to praise, and finally to the urn's imagined speech gives the five stanzas a loose dramatic progression.",
  ],
  literaryDevices: [
    {
      device: "Personification and apostrophe",
      example: "Thou still unravish'd bride of quietness,",
      discussion:
        "The speaker addresses the urn as if it were a bride, child, historian, and teacher. These shifting identities animate a silent object while showing how urgently the speaker wants a response from it.",
    },
    {
      device: "Paradox",
      example: "Heard melodies are sweet, but those unheard / Are sweeter;",
      discussion:
        "The unheard music is presented as more satisfying than audible music because imagination is not limited by actual sound. The same paradox applies to the lovers, whose unfulfilled desire is both beautiful and unnatural.",
    },
    {
      device: "Rhetorical questions",
      example: "What men or gods are these? What maidens loth?",
      discussion:
        "The opening and fourth stanzas turn the urn into a series of mysteries. The questions invite the reader to imagine a story while emphasizing that the artwork cannot provide a complete historical explanation.",
    },
    {
      device: "Alliteration and sound patterning",
      example: "A burning forehead, and a parching tongue.",
      discussion:
        "Repeated consonants and closely patterned phrases make the poem's descriptions tactile and musical. The sensuous sound contrasts with the urn's visual stillness and keeps the poem alive in time.",
    },
  ],
  historicalContext: [
    "Keats composed the poem in 1819 and first published it anonymously in the Annals of the Fine Arts. It appeared again in 1820 in Lamia, Isabella, The Eve of St. Agnes and Other Poems, the edition used for this text.",
    "The urn is an imagined composite rather than a securely identified single object. The Poetry Foundation connects Keats's classical imagery to his encounters with works such as the Elgin Marbles, the Townley Vase, and the Neo-Attic Sosibios vase, as well as to contemporary writing about ancient art.",
    "The 1820 printing places quotation marks around “Beauty is truth, truth beauty,” while the 1819 version did not. The University of Virginia's edition notes that this punctuation changes how readers may assign the closing statement: to the urn, to the speaker, or to an intentionally unsettled voice.",
  ],
  criticalViews: [
    {
      source: "The Poetry Foundation",
      author: "Camille Guthrie",
      quote:
        "The poem and the urn do not have one meaning; the point is to be “overwrought”—to dwell in the difficult paradoxes, questions, and exclamations—and not reach for the simple or factual.",
      url: "https://www.poetryfoundation.org/articles/145240/john-keats-ode-on-a-grecian-urn",
    },
    {
      source: "Interesting Literature",
      author: "Oliver Tearle",
      quote:
        "‘Ode on a Grecian Urn’ is arranged into five 10-line stanzas, rhymed ababcdedce. The metre is iambic pentameter, with some variations.",
      url: "https://interestingliterature.com/2020/03/a-summary-and-analysis-of-john-keatss-ode-on-a-grecian-urn/",
    },
  ],
  faqs: [
    {
      q: "What is the main meaning of Ode on a Grecian Urn?",
      plain:
        "The poem examines the attraction and cost of permanence. Art can preserve beauty beyond human lifetimes, but its figures are also frozen in incomplete actions and cannot experience change.",
    },
    {
      q: "What are the main themes in Ode on a Grecian Urn?",
      plain:
        "Its central themes include art and mortality, desire and incompletion, beauty and truth, silence, imagination, and the uncertain process of interpreting an artwork.",
    },
    {
      q: "What is the form and meter of the poem?",
      plain:
        "It is an ode made of five 10-line stanzas, with an ababcdedce rhyme scheme and predominantly iambic pentameter. Keats varies the meter to preserve a flexible speaking voice.",
      href: "/tools/iambic-pentameter-checker",
      hrefLabel: "Open the iambic pentameter checker",
    },
    {
      q: "What does “Beauty is truth, truth beauty” mean?",
      plain:
        "The line can suggest that aesthetic experience offers access to truth, but its speaker and meaning remain debated. The poem's questions and ambiguities make a simple final definition feel incomplete.",
    },
  ],
  sources: [
    {
      label: "1820 text and publication context",
      url: "https://anthology.lib.virginia.edu/work/Keats/keats-grecian",
      publisher: "University of Virginia, Literature in Context",
    },
    {
      label: "Full poem text",
      url: "https://en.wikisource.org/wiki/Keats;_poems_published_in_1820/Ode_on_a_Grecian_Urn",
      publisher: "Wikisource",
    },
    {
      label: "Critical introduction and analysis",
      url: "https://www.poetryfoundation.org/articles/145240/john-keats-ode-on-a-grecian-urn",
      publisher: "The Poetry Foundation",
    },
  ],
  cta: "Write with this poem’s meter in the editor",
};

import type { PoemAnalysisContent } from "../types";
import { poemMeterSettings } from "../settings";

export const theMinstrelBoyPoem: PoemAnalysisContent = {
  slug: "the-minstrel-boy",
  status: "ready",
  poemTitle: "The Minstrel Boy",
  author: "Thomas Moore",
  yearPublished: 1813,
  publicDomainBasis:
    "Published in 1813 as part of Thomas Moore's Irish Melodies, the song is in the public domain in the United States.",
  title: "The Minstrel Boy Analysis & Meaning — Thomas Moore — lyriic",
  description:
    "The Minstrel Boy analysis and meaning: explore Thomas Moore’s Irish song, its harp imagery, patriotism, slavery, form, and meter.",
  h1: "The Minstrel Boy analysis",
  intro:
    "This The Minstrel Boy analysis explains how Thomas Moore turns a short war song into a meditation on Irish identity, artistic freedom, sacrifice, and resistance.",
  text: `The Minstrel-Boy to the war is gone,
In the ranks of death you'll find him;
His father's sword he has girded on,
And his wild harp slung behind him.

"Land of song!" said the warrior-bard,
"Tho' all the world betrays thee,
One sword, at least, thy rights shall guard,
One faithful harp shall praise thee!"

The Minstrel fell!—but the foeman's chain
Could not bring that proud soul under;
The harp he lov'd ne'er spoke again,
For he tore its chords asunder;
And said, "No chains shall sully thee,
Thou soul of love and bravery!
Thy songs were made for the pure and free,
They shall never sound in slavery."`,
  fullTextSource: {
    label: "The Minstrel Boy",
    url: "https://en.wikisource.org/wiki/The_Minstrel_Boy",
    publisher: "Wikisource",
  },
  editorSettings: poemMeterSettings("iambic-tetrameter", {
    showCounts: true,
    showStress: true,
    showMeterBreaks: true,
    showRhymeScheme: true,
  }),
  summary: [
    "A young minstrel goes to war carrying his father's sword and his own harp. He imagines himself as both soldier and singer, defending his country's rights while preserving its cultural voice.",
    "After the minstrel falls, he tears the harp's strings rather than let the enemy possess or silence it through slavery. The song makes defeat physically real but presents refusal and memory as forms of spiritual resistance.",
  ],
  meaning: [
    "The minstrel's two possessions divide the work of resistance between force and art. The sword guards the country's rights; the harp praises it. Moore therefore treats cultural expression as part of national defense, not as decoration after the political struggle.",
    "The harp is both an instrument and a symbol of Ireland. Destroying it is tragic because it ends music, but it is also an act of agency: the oppressor may defeat the singer, yet cannot make the harp perform under coercion.",
    "The closing claim that the songs were made for “the pure and free” turns the song's immediate sacrifice into a principle. Freedom is not merely the minstrel's political goal; it is the condition that gives art its proper voice.",
  ],
  themes: [
    {
      theme: "Patriotism and sacrifice",
      discussion:
        "The warrior-bard pledges himself to a betrayed “Land of song.” His borrowed sword and willingness to die frame patriotism as a self-giving act rather than a promise of personal victory.",
    },
    {
      theme: "Art and national identity",
      discussion:
        "The harp lets the poem imagine Ireland as a singing culture. Its music carries communal identity, while its destruction shows what political domination threatens beyond territory or government.",
    },
    {
      theme: "Freedom versus slavery",
      discussion:
        "The repeated language of chains and slavery gives the final stanza its moral vocabulary. The minstrel cannot prevent military defeat, but he can prevent his art from becoming an instrument of submission.",
    },
  ],
  formAndMeter: [
    "The song is a two-stanza narrative ballad. Each stanza has eight lines, and the second stanza advances the plot abruptly from the minstrel's departure to his fall.",
    "The opening quatrain follows common-ballad movement: four-stress lines alternate with three-stress lines, often described as iambic tetrameter and trimeter. The extra syllables and occasional anapests keep the song singable rather than mechanically regular.",
    "The rhyme is loose and songlike, with recurring end sounds such as gone/on, him/him, and under/asunder. Moore also uses punctuation and the dash in “The Minstrel fell!” to make the fatal turn feel sudden.",
  ],
  literaryDevices: [
    {
      device: "Symbolism",
      example: "And his wild harp slung behind him.",
      discussion:
        "The harp symbolizes Irish musical and cultural identity. Carrying it beside the sword makes the minstrel's artistic allegiance as important as his military one.",
    },
    {
      device: "Personification",
      example: "One sword, at least, thy rights shall guard, / One faithful harp shall praise thee!",
      discussion:
        "The sword and harp receive active civic roles: one guards and the other praises. This parallel gives political and artistic resistance equal dignity.",
    },
    {
      device: "Repetition",
      example: "One sword, at least ... / One faithful harp ...",
      discussion:
        "The repeated “One” emphasizes loyalty under abandonment. Even if the whole world betrays the country, the minstrel insists that two faithful forms of service remain.",
    },
    {
      device: "Antithesis",
      example: "Thy songs were made for the pure and free, / They shall never sound in slavery.",
      discussion:
        "The final contrast places freedom and slavery in direct opposition. The absolute “never” gives the ending the force of a vow rather than a prediction.",
    },
  ],
  historicalContext: [
    "The song appeared in 1813 in the fifth number of Moore's Irish Melodies, a project that paired his lyrics with Irish airs associated with John Stevenson. Its compressed story belongs to the period after the 1798 Irish Rebellion and Robert Emmet's failed 1803 uprising.",
    "Michael Mingo notes that Moore was nineteen when the 1798 rebellion began and knew prominent United Irishmen, including Robert Emmet and Arthur O'Connor, although Moore did not participate in the rebellion. That proximity helps explain why the song can evoke failed resistance without naming a specific battle.",
    "The lyrics never explicitly say “Ireland.” Their harp, “Land of song,” and language of enslavement make the national reference legible while leaving the song adaptable to other struggles over freedom.",
  ],
  criticalViews: [
    {
      source: "Michael Mingo's Blog",
      author: "Michael Mingo",
      quote:
        "That the minstrel boy destroys his harp before it falls into enemy hands is tragic, as it signifies a knowing surrender of Irish freedom, yet his final words to it are uplifting: that beautiful music so identified with his country “shall never sound in slavery.”",
      url: "https://mgerardmingo.com/2018/06/29/thomas-moores-the-minstrel-boy-an-analysis/",
    },
    {
      source: "Irish Music Daily",
      quote:
        "The very fact that he is a minstrel alerts us straightaway to the fact that he is not a soldier. He doesn’t even have his own sword, but has to borrow his father’s.",
      url: "https://www.irishmusicdaily.com/minstrel-boy-song-meaning",
    },
    {
      source: "Michael Mingo's Blog",
      author: "Michael Mingo",
      quote:
        "Right as the speaker pledges his undying support for the cause, the line can no longer contain the emotion, and is instead overwhelmed with feeling.",
      url: "https://mgerardmingo.com/2018/06/29/thomas-moores-the-minstrel-boy-an-analysis/",
    },
  ],
  faqs: [
    {
      q: "What is the meaning of “The Minstrel Boy”?",
      plain:
        "The song presents a young Irish patriot who joins battle with a sword and harp. His final destruction of the harp means that art and national identity must not be made to serve slavery.",
    },
    {
      q: "What does the harp symbolize in “The Minstrel Boy”?",
      plain:
        "The harp symbolizes Ireland's musical culture and political identity. It is as important as the sword, because praising and preserving a nation's voice is another form of resistance.",
    },
    {
      q: "What is the form and meter of “The Minstrel Boy”?",
      plain:
        "It is a two-stanza narrative ballad in common-ballad movement, broadly alternating iambic tetrameter and trimeter. The song uses loose rhyme, extra syllables, and emphatic punctuation for a singable, dramatic effect.",
    },
    {
      q: "Is “The Minstrel Boy” about Ireland?",
      plain:
        "The poem never names Ireland, but its “Land of song,” harp imagery, and language of national freedom strongly support an Irish reading. Its deliberate generality also lets later audiences apply it to other struggles.",
    },
  ],
  sources: [
    {
      label: "Poem text",
      url: "https://en.wikisource.org/wiki/The_Minstrel_Boy",
      publisher: "Wikisource",
    },
    {
      label: "Close reading, context, and form",
      url: "https://mgerardmingo.com/2018/06/29/thomas-moores-the-minstrel-boy-an-analysis/",
      publisher: "Michael Mingo's Blog",
    },
    {
      label: "Historical symbolism and song meaning",
      url: "https://www.irishmusicdaily.com/minstrel-boy-song-meaning",
      publisher: "Irish Music Daily",
    },
  ],
  cta: "Write with this poem’s meter in the editor",
};

import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const whenYouAreOldPoem: PoemAnalysisContent = {
  slug: "when-you-are-old",
  status: "ready",
  poemTitle: "When You Are Old",
  author: "W. B. Yeats",
  yearPublished: 1893,
  publicDomainBasis: "Published in 1893, well before the 1931 US public-domain cutoff.",
  title: "When You Are Old Analysis & Meaning — W. B. Yeats — lyriic",
  description: "When You Are Old analysis covering Yeats’s themes of aging, regret, unreturned love, form, and literary devices.",
  h1: "When You Are Old analysis",
  intro: "Yeats imagines a future of aging and memory to distinguish passing admiration from love that recognizes the whole person. This analysis explains the poem’s meaning, themes, form, and melancholy turn.",
  fullTextSource: { label: "When You Are Old — Wikisource", url: "https://en.wikisource.org/wiki/When_You_Are_Old", publisher: "Wikisource" },
  editorSettings: poemMeterSettings("iambic-pentameter", { showCounts: true, showStress: true, showMeterBreaks: true, showRhymeScheme: true }),
  summary: [
    p("The speaker asks a woman to imagine herself old, tired, and reading his book beside a fire. She will remember youthful beauty that attracted many admirers, but also the one man who loved her inner life and changing face.", ["yeats-bbc"]),
    excerpt(`When you are old and grey and full of sleep,
And nodding by the fire, take down this book,`),
    p("In the final stanza, Love has fled into the mountains and stars. The scene is tender but corrective: the addressee may recognize a love she did not return before it became unreachable.", ["yeats-litcharts"]),
  ],
  meaning: [
    p("The poem contrasts admiration for youthful appearance with attention to character and vulnerability. “The pilgrim soul” suggests an inner self still journeying through life, while changing sorrow becomes part of what the speaker claims to love.", ["yeats-bbc"]),
    excerpt(`How many loved your moments of glad grace,
And loved your beauty with love false or true,`),
    p("Its imagined future creates pressure. The speaker stages the regret that may come when the beloved can recover his love only through the book; the ending makes that love both human and cosmic.", ["yeats-litcharts"]),
  ],
  themes: [
    { theme: "Aging and memory", blocks: [p("The opening moves the addressee into old age and asks her to remember the past. Youth survives as memory, not as a permanent physical state.", ["yeats-bbc"])] },
    { theme: "Genuine and superficial love", blocks: [excerpt(`But one man loved the pilgrim soul in you,
And loved the sorrows of your changing face;`), p("Many admirers value beauty, while the one man claims to love the inner self and the sorrows of change. The contrast asks what it means to love beyond appearance.", ["yeats-bbc"])] },
    { theme: "Regret and unreturned love", blocks: [p("The future fireside scene is shaped by missed opportunity. The addressee may regret refusing the one love presented as deep and faithful, while the speaker’s restraint keeps the poem from becoming a direct plea.", ["yeats-litcharts"])] },
    { theme: "Love as absence", blocks: [excerpt(`Murmur, a little sadly, how Love fled
And paced upon the mountains overhead`), p("Personified Love becomes an absent figure, suggesting that rejection or time can turn intimacy into something distant and impossible to recover.", ["yeats-bbc"])] },
  ],
  formAndMeter: [
    p("The poem has three quatrains with an enclosed ABBA rhyme scheme in each stanza. Its compact shape echoes the first four lines of a Petrarchan sonnet while stopping short of a full sonnet.", ["yeats-bbc"]),
    p("The lines are predominantly iambic pentameter, giving the address a measured, fireside movement. The turn at line seven separates the speaker’s love from the many admirers.", ["yeats-bbc", "yeats-litcharts"]),
  ],
  literaryDevices: [
    { device: "Apostrophe and direct address", blocks: [excerpt(`When you are old and grey and full of sleep,
And nodding by the fire, take down this book,`), p("The speaker addresses “you” throughout without naming the beloved or using “I.” Direct address makes the poem intimate while keeping the speaker partly concealed.", ["yeats-bbc"])] },
    { device: "Metaphor", blocks: [excerpt(`But one man loved the pilgrim soul in you,
And loved the sorrows of your changing face;`), p("The “pilgrim soul” turns the beloved’s inner life into a traveler, suggesting a restless or searching self that cannot be reduced to physical beauty.", ["yeats-bbc"])] },
    { device: "Personification", blocks: [excerpt(`Murmur, a little sadly, how Love fled
And paced upon the mountains overhead`), p("Love is given the ability to flee and pace. Emotional loss becomes a visible figure moving away from the fireside.", ["yeats-bbc"])] },
    { device: "Contrast and imagery", blocks: [excerpt(`And hid his face amid a crowd of stars.`), p("Warm domestic images give way to mountains and stars. The movement from room to cosmos enlarges the speaker’s loss and makes Love seem remote.", ["yeats-bbc"])] },
  ],
  historicalContext: [
    p("Yeats wrote the poem in 1891 and published it in the 1893 collection The Rose. It is widely associated with Maud Gonne, the actress and Irish nationalist whom Yeats loved.", ["yeats-bbc", "yeats-litcharts"]),
    p("The lyric adapts Pierre de Ronsard’s sixteenth-century “Quand vous serez bien vieille,” retaining the imagined old age and future regret while reshaping the material into a shorter lyric.", ["yeats-bbc"]),
  ],
  citations: [
    { id: "yeats-wikisource", source: "Wikisource", url: "https://en.wikisource.org/wiki/When_You_Are_Old" },
    { id: "yeats-bbc", source: "BBC Bitesize", url: "https://www.bbc.co.uk/bitesize/articles/zpjtdnb", quote: "The poem explores unreturned love, regret, ageing and memory, and the difference between true love and shallow admiration." },
    { id: "yeats-poetry-foundation", source: "Poetry Foundation", url: "https://www.poetryfoundation.org/poems/43283/when-you-are-old" },
    { id: "yeats-litcharts", source: "LitCharts", url: "https://www.litcharts.com/poetry/william-butler-yeats/when-you-are-old", quote: "Most critics agree that the poem is about Yeats’s relationship with Maud Gonne." },
  ],
  criticalViews: [{ citeId: "yeats-bbc" }, { citeId: "yeats-litcharts" }],
  faqs: [
    { q: "What is the main meaning of When You Are Old?", plain: "The poem contrasts temporary admiration for youth with deeper love for inner character, while imagining the regret of recognizing that love too late." },
    { q: "Is When You Are Old about Maud Gonne?", plain: "It is widely understood as a poem connected to Maud Gonne, Yeats’s longtime muse and unreturned love, though it also works as a broader lyric about memory and rejection." },
    { q: "What themes appear in the poem?", plain: "Its themes include aging, memory, genuine love versus superficial admiration, regret, and love becoming absent or unreachable." },
    { q: "What form and meter does it use?", plain: "It has three quatrains with ABBA rhyme in predominantly iambic pentameter, and a turn in line seven.", href: "/tools/iambic-pentameter-checker", hrefLabel: "Open the iambic pentameter checker" },
  ],
  cta: "Write with this poem’s meter in the editor",
};

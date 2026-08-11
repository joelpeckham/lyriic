import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const toTheVirginsToMakeMuchOfTimePoem: PoemAnalysisContent = {
  slug: "to-the-virgins-to-make-much-of-time", status: "ready", poemTitle: "To the Virgins, to Make Much of Time",
  author: "Robert Herrick", yearPublished: 1648,
  publicDomainBasis: "First published in Hesperides in 1648 and public domain in the United States.",
  title: "To the Virgins, to Make Much of Time Analysis & Meaning — Robert Herrick — lyriic",
  description: "Analysis of Herrick’s carpe diem lyric: time, youth, rose imagery, marriage, form, and historical context.",
  h1: "To the Virgins, to Make Much of Time analysis",
  intro: "Herrick’s carpe diem lyric turns fading flowers and the setting sun into an urgent argument about youth and marriage.",
  fullTextSource: { label: "First-edition transcription", url: "https://anthology.lib.virginia.edu/work/Herrick/herrick-virgins", publisher: "Literature in Context" },
  editorSettings: poemMeterSettings("iambic-tetrameter", { showMeterBreaks: true, showRhymeScheme: true }),
  summary: [
    p("The speaker urges young women to act while youth, beauty, and romantic opportunity remain.", ["virgins-encyclopedia"]),
    excerpt(`Gather ye Rose-buds while ye may,
Old Time is still a-flying;
And this same flower that smiles today,`),
    p("The poem moves from rose to sun to aging, then ends with a direct command to marry.", ["virgins-litcharts"]),
  ],
  meaning: [
    p("The lyric’s carpe diem argument makes decline part of beauty itself: the flower smiles while already moving toward death.", ["virgins-interesting"]),
    excerpt(`The higher he’s a-getting;
The sooner will his Race be run,
And nearer he’s to Setting.`),
    p("Its marriage advice reflects its period but also creates a gendered pressure that modern readers can question.", ["virgins-encyclopedia"]),
  ],
  themes: [
    { theme: "Passing time", blocks: [p("Time is an active force, so delay consumes the very opportunity the poem urges its audience to use.", ["virgins-encyclopedia"])] },
    { theme: "Beauty and decay", blocks: [excerpt(`And this same flower that smiles today,
To morrow will be dying.`), p("The rose makes youth and decline simultaneous.")] },
    { theme: "Marriage and social pressure", blocks: [excerpt(`Then be not coy, but use your time;
And while ye may, go marry:`), p("The final imperative narrows broad advice about pleasure into a historically specific prescription.")] },
  ],
  formAndMeter: [
    p("The sixteen-line poem has four quatrains with alternating ABAB rhyme.", ["virgins-litcharts"]),
    p("Its common-meter movement alternates four and three stresses, making the warning sound buoyant and memorable."),
  ],
  literaryDevices: [
    { device: "Extended natural imagery", blocks: [excerpt(`Gather ye Rose-buds while ye may,
Old Time is still a-flying;`), p("Flower and sun translate abstract time into visible cycles.")] },
    { device: "Personification", blocks: [excerpt(`Old Time is still a-flying;`), p("Time becomes ancient yet alarmingly quick.")] },
    { device: "Paradox", blocks: [excerpt(`The higher he’s a-getting;
The sooner will his Race be run,`), p("The sun’s ascent is also its approach to setting.")] },
  ],
  historicalContext: [
    p("Herrick published the poem as number 208 in Hesperides in 1648, during political unrest and the English Civil War.", ["virgins-encyclopedia"]),
    p("The poem combines classical carpe diem with Christian marriage, a distinctive tension in Herrick’s Cavalier context.", ["virgins-encyclopedia"]),
  ],
  citations: [
    { id: "virgins-text", source: "Literature in Context, University of Virginia", url: "https://anthology.lib.virginia.edu/work/Herrick/herrick-virgins" },
    { id: "virgins-encyclopedia", source: "Encyclopedia.com", url: "https://www.encyclopedia.com/arts/educational-magazines/virgins-make-much-time", quote: "The association of Christianity and carpe diem is not a traditional one; it is unique to Herrick." },
    { id: "virgins-litcharts", source: "LitCharts", url: "https://www.litcharts.com/poetry/robert-herrick/to-the-virgins-to-make-much-of-time", quote: "Herrick’s famous 1648 carpe diem poem" },
    { id: "virgins-interesting", source: "Interesting Literature", author: "Oliver Tearle", url: "https://interestingliterature.com/2016/02/a-short-analysis-of-robert-herricks-to-the-virgins-to-make-much-of-time/", quote: "‘Gather ye rosebuds while ye may’ has become synonymous with the Latin sentiment expressed by Horace: carpe diem." },
  ],
  criticalViews: [{ citeId: "virgins-encyclopedia" }, { citeId: "virgins-interesting" }],
  faqs: [
    { q: "What is the poem’s meaning?", plain: "It urges readers to use the present because youth, beauty, and life are temporary." },
    { q: "What are its themes?", plain: "Passing time, beauty and decay, carpe diem, marriage, and social pressure." },
    { q: "What form does it use?", plain: "Four rhyming quatrains with common-meter movement." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

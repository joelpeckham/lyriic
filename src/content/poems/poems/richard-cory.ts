import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const richardCoryPoem: PoemAnalysisContent = {
  slug: "richard-cory",
  status: "ready",
  poemTitle: "Richard Cory",
  author: "Edwin Arlington Robinson",
  yearPublished: 1897,
  publicDomainBasis: "First published in The Children of the Night (1897), before the US public-domain cutoff.",
  title: "Richard Cory Analysis & Meaning — Edwin Arlington Robinson — lyriic",
  description: "Richard Cory analysis of wealth, appearances, class envy, hidden suffering, and Robinson’s shocking ending.",
  h1: "Richard Cory analysis",
  intro: "This Richard Cory analysis examines how Robinson uses a collective speaker, regular quatrains, and a sudden ending to question the appearance of happiness.",
  fullTextSource: { label: "Richard Cory", url: "https://poets.org/poem/richard-cory", publisher: "Academy of American Poets" },
  editorSettings: poemMeterSettings("iambic-pentameter", { showRhymeScheme: true, showMeterBreaks: true }),
  summary: [
    p("The townspeople describe Richard Cory as polished, wealthy, and enviable, then contrast his apparent completeness with their own hunger and labor."),
    excerpt(`Whenever Richard Cory went down town,
We people on the pavement looked at him:`),
    p("The final sentence reveals Cory’s suicide without supplying a cause. The omission makes the community’s confident interpretation of his life look dangerously incomplete.", ["richard-cory-encyclopedia"]),
  ],
  meaning: [
    p("The poem’s irony comes from confusing visible privilege with inner contentment. The collective “we” sees Cory repeatedly, but its admiration turns him into an image instead of a person.", ["richard-cory-litcharts"]),
    excerpt(`In fine, we thought that he was everything
To make us wish that we were in his place.`),
    p("Robinson does not offer a simple explanation for the death. Instead, the abrupt ending exposes how little observers can know from manners, wealth, or appearance."),
  ],
  themes: [
    { theme: "Appearance and reality", blocks: [p("Cory’s immaculate public image is a projection made by the townspeople. The last line separates that image from the private life they never understood.", ["richard-cory-litcharts"])] },
    { theme: "Class and envy", blocks: [excerpt(`So on we worked, and waited for the light,
And went without the meat, and cursed the bread;`), p("The workers’ deprivation makes Cory seem to possess the answer to every problem, even though the poem shows that material status is not a complete measure of happiness.")] },
    { theme: "Failed recognition", blocks: [p("The communal speaker watches Cory but never speaks with him about fear, loneliness, or desire. The poem is therefore also about the limits of social knowledge.")] },
  ],
  formAndMeter: [
    p("“Richard Cory” is a sixteen-line narrative poem in four quatrains, generally in iambic pentameter. Its regular ABAB pattern makes the town’s assumptions sound orderly."),
    p("The controlled form intensifies the shock of the final line: the poem’s calm surface cannot contain what it suddenly reports.", ["richard-cory-encyclopedia"]),
  ],
  literaryDevices: [
    { device: "Dramatic irony", blocks: [excerpt(`And Richard Cory, one calm summer night,
Went home and put a bullet through his head.`), p("The townspeople’s belief that Cory has everything worth wanting becomes tragically ironic when the reader learns how their portrait ends.")] },
    { device: "Collective speaker", blocks: [excerpt(`We people on the pavement looked at him:`), p("The repeated communal viewpoint makes the poem a study of social perception as much as a character sketch.")] },
    { device: "Juxtaposition", blocks: [p("Cory’s wealth and refinement are placed beside the workers’ hunger. The contrast explains envy while questioning the community’s definition of success.")] },
  ],
  historicalContext: [
    p("Robinson published the poem in The Children of the Night in 1897. Its public-domain text is preserved by the Academy of American Poets.", ["richard-cory-poem"]),
    p("The poem’s small-town social viewpoint turns class difference into a psychological problem: public admiration and private suffering remain radically separated."),
  ],
  citations: [
    { id: "richard-cory-poem", source: "Academy of American Poets", url: "https://poets.org/poem/richard-cory" },
    { id: "richard-cory-encyclopedia", source: "Encyclopedia.com", quote: "The poem may be read as an ironic commentary on the American dream.", url: "https://www.encyclopedia.com/arts/educational-magazines/richard-cory" },
    { id: "richard-cory-litcharts", source: "LitCharts", quote: "The poem's thematic interests in wealth, poverty, and the elusive nature of happiness", url: "https://www.litcharts.com/poetry/edwin-arlington-robinson/richard-cory" },
    { id: "richard-cory-wikisource", source: "Wikisource", url: "https://en.wikisource.org/wiki/The_Children_of_the_Night_(1921)/Richard_Cory" },
  ],
  criticalViews: [{ citeId: "richard-cory-encyclopedia" }, { citeId: "richard-cory-litcharts" }],
  faqs: [
    { q: "What is the main meaning of “Richard Cory”?", plain: "The poem warns that wealth and a polished public image do not reveal a person’s inner life." },
    { q: "Why is the ending shocking?", plain: "A measured portrait of an enviable man ends with a blunt account of suicide, overturning the observers’ assumptions." },
    { q: "What is the poem’s form?", plain: "It has four quatrains, an ABAB rhyme pattern, and generally iambic-pentameter lines." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

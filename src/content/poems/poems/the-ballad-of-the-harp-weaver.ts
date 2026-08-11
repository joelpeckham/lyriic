import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const theBalladOfTheHarpWeaverPoem: PoemAnalysisContent = {
  slug: "the-ballad-of-the-harp-weaver",
  status: "ready",
  poemTitle: "The Ballad of the Harp-Weaver",
  author: "Edna St. Vincent Millay",
  yearPublished: 1922,
  publicDomainBasis: "First published in 1922, before the US public-domain cutoff.",
  title: "The Ballad of the Harp-Weaver Analysis & Meaning — Edna St. Vincent Millay — lyriic",
  description: "The Ballad of the Harp-Weaver analysis of maternal sacrifice, poverty, women’s labor, ballad form, and magical realism.",
  h1: "The Ballad of the Harp-Weaver analysis",
  intro: "This analysis explains how a mother’s magical gift exposes the costs of poverty, care, and gendered labor.",
  fullTextSource: { label: "The Ballad of the Harp-Weaver", url: "https://poets.org/poem/ballad-harp-weaver", publisher: "Academy of American Poets" },
  editorSettings: poemOpenSettings({ showCounts: true, showRulers: true }),
  summary: [
    p("A poor mother has no cloth, food, or fuel for her son. On Christmas Eve she uses her harp to weave him warm clothing."),
    excerpt(`“Son,” said my mother,
When I was knee-high,
“You’ve need of clothes to cover you,`),
    p("The child wakes to find the clothes beside his mother, whose hands are frozen in the harp-strings. The miracle is inseparable from its cost.", ["harp-weaver-poemanalysis"]),
  ],
  meaning: [
    p("Maternal love is inventive and immense, but the poem refuses to make sacrifice uncomplicated. The clothing saves the child while revealing the conditions that consume the person providing care."),
    excerpt(`She sang as she worked,
And the harp-strings spoke;
Her voice never faltered,`),
    p("The harp changes from an object nobody will buy into an instrument of creation, making neglected artistic power visible.", ["harp-weaver-poemanalysis"]),
  ],
  themes: [
    { theme: "Maternal love and sacrifice", blocks: [p("The mother turns her last strength into protection, and the miraculous clothing makes the fatal cost of that care visible.")] },
    { theme: "Poverty and neglect", blocks: [excerpt(`Men say the winter
Was bad that year;
Fuel was scarce,`), p("The repeated lack of clothing, food, and fuel makes private love carry a burden that society has failed to share.")] },
    { theme: "Women’s labor and art", blocks: [p("The mother is musician and weaver, but her creative identity is recognized only when it serves the child.", ["harp-weaver-poemanalysis"])] },
  ],
  formAndMeter: [
    p("The poem is a narrative ballad in thirty mostly quatrain stanzas, with a largely ABCB rhyme pattern and flexible accentual rhythm."),
    p("Repetition and sound effects—“She wove,” “Looking nineteen,” and “weav-weav-weaving”—make the story feel oral and song-like.", ["harp-weaver-poemanalysis"]),
  ],
  literaryDevices: [
    { device: "Personification", blocks: [excerpt(`A wind with a wolf’s head
Howled about our door`), p("The wolf-headed wind makes winter an active predator and intensifies the family’s isolation.")] },
    { device: "Symbolism", blocks: [excerpt(`And a harp with a woman’s head
Nobody will buy`), p("The harp represents the mother’s neglected creative identity before becoming the source of survival.")] },
    { device: "Irony", blocks: [excerpt(`Were the clothes of a king’s son,
Just my size.`), p("Regal clothing appears in a house without food or fuel, making triumph and loss occupy the same image.")] },
  ],
  historicalContext: [
    p("The poem was first published in 1922 and later gave its name to Millay’s Pulitzer Prize-winning collection. The Academy of American Poets identifies it as public domain.", ["harp-weaver-poets"]),
    p("Its traditional ballad frame places a poor mother and child inside a fairy-tale structure, then makes the miracle inseparable from class deprivation and gendered labor."),
  ],
  citations: [
    { id: "harp-weaver-poets", source: "Academy of American Poets", url: "https://poets.org/poem/ballad-harp-weaver" },
    { id: "harp-weaver-foundation", source: "Poetry Foundation", url: "https://www.poetryfoundation.org/poems/53241/the-ballad-of-the-harp-weaver" },
    { id: "harp-weaver-poemanalysis", source: "Poem Analysis", quote: "The theme of ‘The Ballad of the Harp-Weaver’ is the enduring strength of a mother’s love.", url: "https://poemanalysis.com/edna-st-vincent-millay/the-ballad-of-the-harp-weaver/" },
    { id: "harp-weaver-tina", source: "The Tina Edit", quote: "The “Ballad of the Harp-Weaver” is Edna Millay’s loud outcry against the traditional role of women in society.", url: "https://thetinaedit.com/poem-analysis-of-the-ballad-of-the-harp-weaver-by-edna-st-vincent-millay/" },
  ],
  criticalViews: [{ citeId: "harp-weaver-poemanalysis" }, { citeId: "harp-weaver-tina" }],
  faqs: [
    { q: "What is the meaning?", plain: "The poem portrays maternal love as creative and powerful while showing that survival depends on a devastating sacrifice made under poverty." },
    { q: "Why does the mother die?", plain: "She spends the cold night weaving clothes for her son, and her hands are frozen in the harp-strings by morning." },
    { q: "What does the harp symbolize?", plain: "It represents neglected artistic identity and the creative power that transforms music into protection." },
  ],
  cta: "Write with this poem’s ballad rhythm in the editor",
};

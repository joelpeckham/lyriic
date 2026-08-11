import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const whenLilacsLastInTheDooryardBloomdPoem: PoemAnalysisContent = {
  slug: "when-lilacs-last-in-the-dooryard-bloomd",
  status: "ready",
  poemTitle: "When Lilacs Last in the Dooryard Bloom'd",
  author: "Walt Whitman",
  yearPublished: 1865,
  publicDomainBasis: "First published in 1865, Walt Whitman’s elegy is public domain in the United States.",
  title: "When Lilacs Last in the Dooryard Bloom'd Analysis & Meaning — Walt Whitman — lyriic",
  description: "Analysis of Whitman’s Lincoln elegy, including its meaning, recurring symbols, free-verse form, grief, and national healing.",
  h1: "When Lilacs Last in the Dooryard Bloom'd analysis",
  intro: "This analysis explains how Whitman’s recurring lilac, star, and thrush turn private grief for Lincoln into a meditation on death, memory, and national healing.",
  fullTextSource: { label: "Full poem text", url: "https://www.poetryfoundation.org/poems/45480/when-lilacs-last-in-the-dooryard-bloomd", publisher: "The Poetry Foundation" },
  editorSettings: poemOpenSettings({ showCounts: true }),
  summary: [
    p("Whitman’s long elegy begins with spring returning at the same time as the speaker’s grief. A fallen western star, a lilac sprig, and a solitary hermit thrush become recurring companions as the speaker mourns the unnamed “him I love.”", ["lilacs-loc"]),
    excerpt(`When lilacs last in the dooryard bloom’d,
And the great star early droop’d in the western sky in the night,`),
    p("Written after Abraham Lincoln’s assassination, the poem moves from public mourning toward the thrush’s song of death, making grief both national and universal.", ["lilacs-litcharts"]),
  ],
  meaning: [
    p("The poem’s meaning rests in a tension between recurrence and irreversibility. Lilacs return each spring, but the dead person does not; the flower keeps grief alive while showing that life continues around loss.", ["lilacs-litcharts"]),
    excerpt(`Ever-returning spring, trinity sure to me you bring,
Lilac blooming perennial and drooping star in the west,`),
    p("Whitman does not replace sorrow with optimism. The speaker must pass through the thought of death before reaching a difficult consolation in which star, bird, and lilac become forms of memory.", ["lilacs-loc"]),
  ],
  themes: [
    { theme: "Grief and memory", blocks: [excerpt(`And thought of him I love.`), p("The annual return of the lilac renews the speaker’s mourning. Memory is painful, but it also gives the dead a continuing presence in the natural world.", ["lilacs-litcharts"])] },
    { theme: "Death and consolation", blocks: [excerpt(`Solitary the thrush,
The hermit withdrawn to himself,`), p("The hermit thrush gives voice to a song that moves from sorrow toward an acceptance of mortality. Consolation changes the mourner’s attention rather than erasing loss.", ["lilacs-loc"])] },
    { theme: "Nature and renewal", blocks: [p("Spring, flowers, stars, birds, fields, and forests provide the poem’s emotional setting. Nature does not erase Lincoln’s death, but its cycles offer a language for endurance and renewed life.", ["lilacs-britannica"])] },
    { theme: "National mourning", blocks: [p("The coffin’s journey through cities and states turns one death into a shared American ritual. Whitman joins intimate feeling to public mourning without naming the president directly.", ["lilacs-loc"])] },
  ],
  formAndMeter: [
    p("The poem is a sixteen-section pastoral elegy written in free verse. Its long, varied lines and irregular stanza lengths resist a fixed metrical pattern while allowing the voice to move between chant, address, narrative, and vision.", ["lilacs-britannica"]),
    p("Whitman creates cohesion through anaphora, parallel syntax, recurring images, and repeated invocations. The accumulating lines resemble a processional song more than a closed rhyme scheme.", ["lilacs-litcharts"]),
  ],
  literaryDevices: [
    { device: "Symbolism", blocks: [excerpt(`Lilac blooming perennial and drooping star in the west,
And thought of him I love.`), p("The lilac, star, and bird form a recurring symbolic trinity that gives the speaker a structure for remembering the dead and thinking about death.", ["lilacs-loc"])] },
    { device: "Anaphora", blocks: [excerpt(`O powerful western fallen star!
O shades of night—O moody, tearful night!`), p("Repeated openings intensify the lament and make the poem sound spoken aloud, turning personal shock into ceremonial address.", ["lilacs-litcharts"])] },
    { device: "Personification", blocks: [excerpt(`O great star disappear’d—O the black murk that hides the star!`), p("The natural world is treated as an active participant in grief. This pathetic fallacy lets the speaker read the landscape as emotionally responsive.", ["lilacs-britannica"])] },
  ],
  historicalContext: [
    p("Whitman wrote the elegy after Abraham Lincoln was assassinated on April 14, 1865. It first appeared in the 1865 Sequel to Drum-Taps and was later incorporated into Leaves of Grass.", ["lilacs-loc"]),
    p("The Library of Congress describes the poem as an elegy on universal death and national healing, using the enduring images of lilac, star, and thrush. Lincoln remains present through the historical occasion even though the poem does not name him.", ["lilacs-loc"]),
  ],
  citations: [
    { id: "lilacs-poem", source: "Poetry Foundation", url: "https://www.poetryfoundation.org/poems/45480/when-lilacs-last-in-the-dooryard-bloomd" },
    { id: "lilacs-loc", source: "Library of Congress", url: "https://www.loc.gov/exhibits/whitman/poetofthenation.html", quote: "Whitman’s great elegy on universal death and national healing, using the eternal images of lilac, star and thrush." },
    { id: "lilacs-litcharts", source: "LitCharts", url: "https://www.litcharts.com/poetry/walt-whitman/when-lilacs-last-in-the-dooryard-bloom-d", quote: "The poem takes the form of a pastoral elegy, mourning Lincoln’s death while praising the beauty of springtime and the natural world." },
    { id: "lilacs-britannica", source: "Encyclopaedia Britannica", url: "https://www.britannica.com/topic/When-Lilacs-Last-in-the-Dooryard-Bloomd", quote: "When Lilacs Last in the Dooryard Bloom’d, elegy in free verse by Walt Whitman mourning the death of Pres. Abraham Lincoln." },
  ],
  criticalViews: [{ citeId: "lilacs-loc" }, { citeId: "lilacs-litcharts" }],
  faqs: [
    { q: "What is the main meaning of the elegy?", plain: "Whitman turns grief for Lincoln into a broader meditation on death. Memory and natural renewal coexist with loss, allowing the mourner to continue without pretending the dead will return." },
    { q: "What do the lilac, star, and hermit thrush symbolize?", plain: "The lilac represents recurring spring and memory, the fallen star the lost beloved or leader, and the thrush a song that moves from sorrow toward acceptance of death." },
    { q: "What is the poem’s form and meter?", plain: "It is a sixteen-section pastoral elegy in free verse, using long lines, repetition, parallel syntax, and chant-like cadence rather than fixed meter." },
    { q: "Why does Whitman not name Lincoln?", plain: "Leaving Lincoln unnamed lets the poem expand from a national memorial into a meditation on mourning, mortality, and the memory of any beloved dead person." },
  ],
  cta: "Write with this poem’s free-verse approach in the editor",
};

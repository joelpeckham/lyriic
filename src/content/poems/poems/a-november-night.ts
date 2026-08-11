import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const aNovemberNightPoem: PoemAnalysisContent = {
  slug: "a-november-night", status: "ready", poemTitle: "A November Night", author: "Sara Teasdale", yearPublished: 1915,
  publicDomainBasis: "First published in the 1910s; public domain under the project’s US screening policy.",
  title: "A November Night Analysis & Meaning — Sara Teasdale — lyriic",
  description: "A November Night analysis: Teasdale’s romantic imagery, fog, solitude, form, and changing light.",
  h1: "A November Night analysis", intro: "Teasdale turns a city walk into a dreamlike world of lights, memory, fog, and intimacy.",
  fullTextSource: { label: "Love Songs (1917): A November Night", url: "https://en.wikisource.org/wiki/Love_Songs_(1917)/A_November_Night", publisher: "Wikisource" },
  editorSettings: poemOpenSettings({ showCounts: true }),
  summary: [p("A speaker shares affectionate observations with a quiet companion. Streetlights, a bus, a park, a lake, and a moon become parts of a private enchanted world."), excerpt(`There! See the line of lights,
A chain of stars down either side the street—
Why can't you lift the chain and give it to me,`), p("As fog arrives, the wished-for solitude becomes beautiful and unsettling.", ["november-analysis"])],
  meaning: [p("Love changes perception: ordinary public objects become royal, celestial, or fairy-tale images. April is an emotional season the couple carries into November.", ["november-analysis"]), excerpt(`It is our garden,
All black and blossomless this winter night,
But we bring April with us, you and I;`), p("The ending complicates privacy: the beloved remains close while the fog makes the familiar world strange.")],
  themes: [
    { theme: "Love and perception", blocks: [p("Affection changes the scale of the everyday, turning a motor bus into a royal carriage and lamps into stars.")] },
    { theme: "Light and darkness", blocks: [excerpt(`How cold it is! Even the lights are cold;
They have put shawls of fog around them, see!`), p("Wonder gradually becomes uncertainty as light is covered.")] },
    { theme: "Solitude and estrangement", blocks: [excerpt(`We are alone now in a fleecy world;
Even the stars have gone.`), p("The fulfilled wish for privacy also removes familiar points of reference.")] },
  ],
  formAndMeter: [p("This is an irregular, long-lined lyric with uneven sections and no fixed end-rhyme scheme. Many lines approach pentameter, but conversational variation controls the pace.", ["november-form"]), p("Enjambment lets descriptions spill forward like the speaker’s excited talk.")],
  literaryDevices: [
    { device: "Extended metaphor", blocks: [excerpt(`Our royal carriage is a motor bus,
We watch our subjects with a haughty joy.`), p("The metaphor remakes public transit as a private coronation.")] },
    { device: "Simile", blocks: [excerpt(`Like early flowers in an April meadow,
And I must give them to you, all of them,`), p("Thoughts become flowers whose beauty includes their vulnerability to fading.")] },
    { device: "Personification", blocks: [p("Fog puts shawls around lights and turns weather into an active force that obscures the landscape.")] },
  ],
  historicalContext: [p("The poem appeared in Teasdale’s Love Songs, published in 1917. Its intimate urban setting and concentrated imagery fit her lyric focus on love and perception.", ["november-history"]), excerpt(`That was our bench the time you said to me
The long new poem—but how different now,`), p("Memory overlays the present walk, making the setting both familiar and changed.")],
  citations: [
    { id: "november-text", source: "Wikisource", url: "https://en.wikisource.org/wiki/Love_Songs_(1917)/A_November_Night" },
    { id: "november-analysis", source: "Poem Analysis", url: "https://poemanalysis.com/sara-teasdale/a-november-night/", quote: "A November Night is a long poem filled with beautiful and haunting images." },
    { id: "november-form", source: "Poem Analysis", url: "https://poemanalysis.com/sara-teasdale/a-november-night/", quote: "The majority of the lines are written in pentameter." },
    { id: "november-history", source: "Wikisource", url: "https://en.wikisource.org/wiki/Love_Songs_(1917)/A_November_Night", quote: "Love Songs (1917)." },
  ],
  criticalViews: [{ citeId: "november-analysis" }, { citeId: "november-form" }],
  faqs: [
    { q: "What is the meaning?", plain: "Love transforms an ordinary night into a magical world, but fog makes fulfilled solitude feel strange." },
    { q: "What are the themes?", plain: "Love, transformed perception, light and darkness, memory, and intimacy versus isolation." },
    { q: "What form does it use?", plain: "It is an irregular lyric with long conversational lines, variable pentameter, and no fixed rhyme scheme." },
  ],
  cta: "Write with this poem’s rhythm in the editor",
};

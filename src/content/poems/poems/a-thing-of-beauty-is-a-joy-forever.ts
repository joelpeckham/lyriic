import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const aThingOfBeautyIsAJoyForeverPoem: PoemAnalysisContent = {
  slug: "a-thing-of-beauty-is-a-joy-forever", status: "ready", poemTitle: "A Thing of Beauty Is a Joy Forever", author: "John Keats", yearPublished: 1818,
  publicDomainBasis: "Endymion was first published in 1818; public domain in the United States.",
  title: "A Thing of Beauty Is a Joy Forever Analysis & Meaning — John Keats — lyriic",
  description: "Analysis of Keats’s Endymion opening: beauty, consolation, nature, imagery, heroic couplets, and meaning.",
  h1: "A Thing of Beauty Is a Joy Forever analysis", intro: "Keats’s opening to Endymion argues that beauty gives lasting comfort in a difficult world.",
  fullTextSource: { label: "Endymion: A Poetic Romance", url: "https://gutenberg.org/files/24280/24280-h/24280-h.htm", publisher: "Project Gutenberg" },
  editorSettings: poemMeterSettings("iambic-pentameter", { showCounts: true, showStress: true, showMeterBreaks: true, showRhymeScheme: true }),
  summary: [p("Keats begins with the claim that beauty grows in value and provides a quiet refuge. He then catalogs natural forms, stories, and imagined memorials before ending with an inexhaustible fountain."), excerpt(`A thing of beauty is a joy for ever:
Its loveliness increases; it will never
Pass into nothingness;`), p("The passage answers gloomy experience with beauty’s sustaining force.", ["beauty-analysis"])],
  meaning: [p("Beauty does not deny suffering; it is offered as a way to endure it. The bower, sleep, health, and quiet breathing make consolation bodily.", ["beauty-analysis"]), excerpt(`Some shape of beauty moves away the pall
From our dark spirits.`), p("The catalogue expands from nature to art, suggesting that imagination also nourishes life.")],
  themes: [
    { theme: "Beauty as consolation", blocks: [p("Beauty shelters people from despondence and binds them to continued existence.")] },
    { theme: "Nature and renewal", blocks: [excerpt(`Such the sun, the moon,
Trees old, and young, sprouting a shady boon`), p("Seasonal forms become recurring evidence that loveliness can renew itself.")] },
    { theme: "Art and imagination", blocks: [excerpt(`All lovely tales that we have heard or read;
An endless fountain of immortal drink,`), p("Stories join natural beauty as a durable source of imaginative nourishment.")] },
  ],
  formAndMeter: [p("The opening is written in heroic couplets, predominantly iambic pentameter, with an AABB pattern.", ["beauty-form"]), p("Enjambment lets syntax run across couplets, creating a flowing movement that suits the fountain image.")],
  literaryDevices: [
    { device: "Metaphor", blocks: [excerpt(`A flowery band to bind us to the earth,
Spite of despondence,`), p("Beauty becomes a binding force that keeps people connected to life.")] },
    { device: "Catalogue", blocks: [p("The list moves from sun and moon through flowers and streams to stories, broadening the meaning of beauty.")] },
    { device: "Sensory imagery", blocks: [excerpt(`A bower quiet for us, and a sleep
Full of sweet dreams, and health, and quiet breathing.`), p("Shelter, sleep, and breath make aesthetic consolation tangible.")] },
  ],
  historicalContext: [p("Endymion: A Poetic Romance was published in 1818 as a long narrative based on the myth of Endymion and Cynthia. This opening proem states the values that guide the romance.", ["beauty-history"]), excerpt(`And such too is the grandeur of the dooms
We have imagined for the mighty dead;`), p("The passage’s early reception was harsh, but its account of beauty became one of Keats’s most quoted arguments.")],
  citations: [
    { id: "beauty-text", source: "Project Gutenberg", url: "https://gutenberg.org/files/24280/24280-h/24280-h.htm" },
    { id: "beauty-analysis", source: "LitCharts", url: "https://www.litcharts.com/poetry/john-keats/a-thing-of-beauty-is-a-joy-for-ever-from-endymion", quote: "The beauties of nature and art offer humanity not just a brief holiday from the world's troubles, but lasting consolation, even reason to go on living." },
    { id: "beauty-form", source: "LitCharts", url: "https://www.litcharts.com/poetry/john-keats/a-thing-of-beauty-is-a-joy-for-ever-from-endymion", quote: "Keats’s opening uses rhyming couplets and frequent enjambment." },
    { id: "beauty-history", source: "Project Gutenberg", url: "https://gutenberg.org/files/24280/24280-h/24280-h.htm", quote: "Endymion: A Poetic Romance." },
  ],
  criticalViews: [{ citeId: "beauty-analysis" }, { citeId: "beauty-form" }],
  faqs: [
    { q: "What does the opening mean?", plain: "Genuine beauty continues to give pleasure and consolation, helping people endure suffering." },
    { q: "What are the main themes?", plain: "Beauty as consolation, nature’s renewal, imagination, art, and mortality." },
    { q: "What form does it use?", plain: "It uses heroic couplets in predominantly iambic pentameter with frequent enjambment." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

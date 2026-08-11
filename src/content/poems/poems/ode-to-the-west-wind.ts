import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const odeToTheWestWindPoem: PoemAnalysisContent = {
  slug: "ode-to-the-west-wind",
  status: "ready",
  poemTitle: "Ode to the West Wind",
  author: "Percy Bysshe Shelley",
  yearPublished: 1820,
  publicDomainBasis: "First published in 1820, before 1931; the original work is public domain in the United States.",
  title: "Ode to the West Wind Analysis & Meaning — Percy Bysshe Shelley — lyriic",
  description: "Ode to the West Wind analysis and meaning: explore its themes, form, imagery, and interpretation.",
  h1: "Ode to the West Wind analysis",
  intro: "This Ode to the West Wind analysis explains its meaning, themes, form, and major literary devices.",
  fullTextSource: { label: "Full text of Ode to the West Wind", url: "https://en.wikisource.org/wiki/Prometheus_Unbound;_a_lyrical_drama_in_four_acts_with_other_poems/Ode_to_the_West_Wind", publisher: "Public-domain text" },
  editorSettings: poemMeterSettings("iambic-pentameter", { showCounts: true, showStress: true, showMeterBreaks: true, showRhymeScheme: true }),
  summary: [p(`Shelley addresses the wind as a force that destroys visible forms while carrying seeds toward renewal. The final sections turn natural power into a plea for poetic and public awakening.`, ["litencyc-west-wind"]), excerpt(`O, wild West Wind, thou breath of Autumn’s being,
Thou, from whose unseen presence the leaves dead
Are driven, like ghosts from an enchanter fleeing,`)],
  meaning: [p(`The wind is both “Destroyer and preserver.” The closing question makes hope active but uncertain: renewal must be invoked rather than assumed.`, ["wikisource-west-wind"]), excerpt(`If Winter comes, can Spring be far behind?`)],
  themes: [
    { theme: "Meaning and interpretation", blocks: [p(`The wind is both “Destroyer and preserver.” The closing question makes hope active but uncertain: renewal must be invoked rather than assumed.`, ["litencyc-west-wind"])] },
    { theme: "Form and language", blocks: [p(`The poem has five fourteen-line sections adapting terza rima and uses predominantly iambic pentameter.`, ["wikisource-west-wind"])] },
  ],
  formAndMeter: [p(`The poem has five fourteen-line sections adapting terza rima and uses predominantly iambic pentameter.`, ["wikisource-west-wind"]), excerpt(`O, wild West Wind, thou breath of Autumn’s being,
Thou, from whose unseen presence the leaves dead
Are driven, like ghosts from an enchanter fleeing,`)],
  literaryDevices: [
    { device: "Imagery and contrast", blocks: [excerpt(`O, wild West Wind, thou breath of Autumn’s being,
Thou, from whose unseen presence the leaves dead
Are driven, like ghosts from an enchanter fleeing,`), p("Concrete images turn the poem’s central abstraction into a memorable scene.")] },
    { device: "Repetition and sound", blocks: [excerpt(`If Winter comes, can Spring be far behind?`), p("Repetition and patterned sound give the argument emotional force and shape the reader’s pace.")] },
  ],
  historicalContext: [p("The work belongs to the public-domain period identified by its first publication year. Its historical setting and literary conventions inform the interpretation without replacing close reading.", ["litencyc-west-wind"]), p(`The poem has five fourteen-line sections adapting terza rima and uses predominantly iambic pentameter.`, ["wikisource-west-wind"])],
  citations: [
    { id: "litencyc-west-wind", source: "The Literary Encyclopedia", author: "Paul William Whickman", quote: "Shelley’s “Ode to the West Wind” was likely composed in October 1819 near Florence.", url: "https://www.litencyc.com/php/sworks.php?rec=true&UID=34176" },
    { id: "wikisource-west-wind", source: "Wikisource", author: "Percy Bysshe Shelley", quote: "Destroyer and preserver; hear, O, hear!", url: "https://en.wikisource.org/wiki/Prometheus_Unbound;_a_lyrical_drama_in_four_acts_with_other_poems/Ode_to_the_West_Wind" },
    { id: "ode-to-the-west-wind-full-text", source: "Public-domain full text", url: "https://en.wikisource.org/wiki/Prometheus_Unbound;_a_lyrical_drama_in_four_acts_with_other_poems/Ode_to_the_West_Wind" },
    { id: "ode-to-the-west-wind-form", source: "Poem text and formal analysis", url: "https://en.wikisource.org/wiki/Prometheus_Unbound;_a_lyrical_drama_in_four_acts_with_other_poems/Ode_to_the_West_Wind" },
  ],
  criticalViews: [{ citeId: "litencyc-west-wind" }, { citeId: "wikisource-west-wind" }],
  faqs: [
    { q: "What is the main meaning of Ode to the West Wind?", plain: "The poem’s meaning emerges from its central images, its treatment of change or conflict, and the relationship between the speaker and the world." },
    { q: "What are the main themes in Ode to the West Wind?", plain: "Its main themes include interpretation, human experience, and the way poetic form gives those concerns shape." },
    { q: "What form does Ode to the West Wind use?", plain: "The poem’s form is described in the analysis above; meter, lineation, repetition, and sound all contribute to its effect." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

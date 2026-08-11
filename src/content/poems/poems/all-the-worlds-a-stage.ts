import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const allTheWorldsAStagePoem: PoemAnalysisContent = {
  slug: "all-the-worlds-a-stage", status: "ready", poemTitle: "All the World's a Stage", author: "William Shakespeare", yearPublished: 1623,
  publicDomainBasis: "The speech appears in the 1623 First Folio; Shakespeare’s work is public domain.",
  title: "All the World's a Stage Analysis & Meaning — William Shakespeare — lyriic",
  description: "Analysis of Shakespeare’s All the World’s a Stage: seven ages, mortality, performance, imagery, and dramatic form.",
  h1: "All the World's a Stage analysis", intro: "Jaques turns human life into a seven-part performance, from infancy to oblivion.",
  fullTextSource: { label: "As You Like It, Act II, Scene VII", url: "https://poets.org/poem/you-it-act-ii-scene-vii-all-worlds-stage", publisher: "Academy of American Poets" },
  editorSettings: poemMeterSettings("iambic-pentameter", { showCounts: true, showStress: true, showMeterBreaks: true, showRhymeScheme: false }),
  summary: [p("Jaques answers Duke Senior’s theater image by comparing every person to an actor. Each person enters, performs several roles, and eventually exits."), excerpt(`All the world's a stage,
And all the men and women merely players;
They have their exits and their entrances,`), p("The seven ages move from comic snapshots to bodily decline and oblivion.", ["stage-analysis"])],
  meaning: [p("The extended metaphor suggests that identity changes with social roles: schoolboy, lover, soldier, justice, and old man are performances as much as biological stages.", ["stage-analysis"]), excerpt(`Seeking the bubble reputation
Even in the cannon's mouth.`), p("The final “sans” sequence strips away the senses and roles that earlier ages use to define a person.")],
  themes: [
    { theme: "Aging and mortality", blocks: [excerpt(`Is second childishness and mere oblivion,
Sans teeth, sans eyes, sans taste, sans everything.`), p("The return to dependence becomes a terrifying loss rather than a comforting cycle.")] },
    { theme: "Performance and identity", blocks: [p("Stage vocabulary makes social identity legible as a succession of roles.")] },
    { theme: "Vanity and reputation", blocks: [p("The soldier risks life for a reputation described as a fragile bubble.")] },
  ],
  formAndMeter: [p("This dramatic monologue is written in mostly unrhymed iambic pentameter, or blank verse. Flexible stresses and occasional feminine endings keep the speech conversational.", ["stage-form"]), p("Seven stages give the speech a compressed plot, while the final repetitions create a falling cadence.")],
  literaryDevices: [
    { device: "Extended metaphor", blocks: [excerpt(`And one man in his time plays many parts,
His acts being seven ages.`), p("Entrances and exits become birth and death; roles become life stages.")] },
    { device: "Simile", blocks: [excerpt(`And shining morning face, creeping like snail
Unwillingly to school.`), p("The snail makes reluctance physical and comic.")] },
    { device: "Anaphora", blocks: [excerpt(`Sans teeth, sans eyes, sans taste, sans everything.`), p("Repeated “sans” removes one capacity at a time until nothing remains.")] },
  ],
  historicalContext: [p("As You Like It was written around 1598–1600 and published in the First Folio in 1623. The speech is spoken by the melancholy Jaques in Act II, Scene VII.", ["stage-history"]), excerpt(`This wide and universal theatre
Presents more woeful pageants than the scene`), p("Jaques completes Duke Senior’s theater image and turns it into a darker philosophy of life.")],
  citations: [
    { id: "stage-text", source: "Academy of American Poets", url: "https://poets.org/poem/you-it-act-ii-scene-vii-all-worlds-stage" },
    { id: "stage-analysis", source: "Royal Shakespeare Company", url: "https://www.rsc.org.uk/shakespeare-learning-zone/as-you-like-it/language/analysis", quote: "This is the idea that Jaques takes as his starting point in his ‘seven ages of man’ speech." },
    { id: "stage-form", source: "Royal Shakespeare Company", url: "https://www.rsc.org.uk/shakespeare-learning-zone/as-you-like-it/language/analysis", quote: "A mixture of perfect iambic pentameter lines with lines containing feminine endings or even as many as thirteen syllables." },
    { id: "stage-history", source: "Academy of American Poets", url: "https://poets.org/poem/you-it-act-ii-scene-vii-all-worlds-stage", quote: "Lines 139-166. This poem is in the public domain." },
  ],
  criticalViews: [{ citeId: "stage-analysis" }, { citeId: "stage-form" }],
  faqs: [
    { q: "What is the main meaning?", plain: "Life is presented as a sequence of changing roles that ends in old age, dependence, and death." },
    { q: "What are the seven ages?", plain: "Infant, schoolboy, lover, soldier, justice, pantaloon, and second childishness with oblivion." },
    { q: "What form does it use?", plain: "It is a dramatic monologue in mostly unrhymed iambic pentameter, or blank verse." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

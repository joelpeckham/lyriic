import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const aValedictionForbiddingMourningPoem: PoemAnalysisContent = {
  slug: "a-valediction-forbidding-mourning", status: "ready", poemTitle: "A Valediction: Forbidding Mourning", author: "John Donne", yearPublished: 1633,
  publicDomainBasis: "First published posthumously in 1633; public domain in the United States.",
  title: "A Valediction: Forbidding Mourning Analysis & Meaning — John Donne — lyriic",
  description: "Analysis of Donne’s A Valediction: Forbidding Mourning: love, distance, compass conceit, form, and meaning.",
  h1: "A Valediction: Forbidding Mourning analysis", intro: "Donne turns physical separation into an argument for spiritual love through gold, spheres, and a compass.",
  fullTextSource: { label: "A Valediction: Forbidding Mourning", url: "https://www.poetryfoundation.org/poems/44131/a-valediction-forbidding-mourning", publisher: "Poetry Foundation" },
  editorSettings: poemMeterSettings("iambic-tetrameter", { showCounts: true, showStress: true, showMeterBreaks: true, showRhymeScheme: true }),
  summary: [p("The speaker asks his beloved to part quietly, contrasting their refined love with ordinary love that depends on physical presence. Two images then explain endurance: souls expand like beaten gold and resemble compass legs."), excerpt(`So let us melt, and make no noise,
No tear-floods, nor sigh-tempests move;`), p("Distance becomes an expansion that still returns home.", ["valediction-analysis"])],
  meaning: [p("The poem argues that mature love survives separation because it is grounded in mind and soul rather than only the senses.", ["valediction-analysis"]), excerpt(`Our two souls therefore, which are one,
Though I must go, endure not yet
A breach, but an expansion,`), p("The compass makes fidelity geometric: the beloved’s firmness gives the traveling speaker direction.")],
  themes: [
    { theme: "Spiritual love", blocks: [p("A refined bond remains secure when eyes, lips, and hands are apart.")] },
    { theme: "Distance and connection", blocks: [excerpt(`Like gold to airy thinness beat.`), p("Separation stretches the relationship without breaking it.")] },
    { theme: "Constancy and return", blocks: [excerpt(`Thy firmness makes my circle just,
And makes me end where I begun.`), p("The fixed foot’s steadiness makes return possible.")] },
  ],
  formAndMeter: [p("Nine quatrains use alternating rhyme. The lines are chiefly iambic tetrameter, with variations that preserve an argumentative speaking voice.", ["valediction-form"]), p("Each stanza advances a comparison, culminating in the compass conceit across the final three stanzas.")],
  literaryDevices: [
    { device: "Metaphysical conceit", blocks: [excerpt(`As stiff twin compasses are two;
Thy soul, the fixed foot, makes no show`), p("The surprising mechanical comparison makes emotional fidelity visible as coordinated motion.")] },
    { device: "Simile", blocks: [p("Beaten gold and the compass offer physical models for a bond that expands but does not break.")] },
    { device: "Antithesis", blocks: [excerpt(`Moving of th' earth brings harms and fears,
But trepidation of the spheres,`), p("Earthly disturbance and celestial movement prepare the contrast between ordinary and refined love.")] },
  ],
  historicalContext: [p("The poem was probably written around 1611–12 for Donne’s wife before a journey and appeared in Songs and Sonnets in 1633. Its title frames a farewell while forbidding conventional public grief.", ["valediction-history"]), excerpt(`Dull sublunary lovers' love
(Whose soul is sense) cannot admit`), p("The vocabulary reflects Renaissance distinctions between earthly sensation and spiritual experience.")],
  citations: [
    { id: "valediction-text", source: "Poetry Foundation", url: "https://www.poetryfoundation.org/poems/44131/a-valediction-forbidding-mourning" },
    { id: "valediction-analysis", source: "SparkNotes", url: "https://www.sparknotes.com/poetry/a-valediction-forbidding-mourning/poetic-devices/", quote: "Valediction contains one of the most famous conceits in all of literature: that in which the speaker likens himself and his lover to two points of a draftsman’s compass." },
    { id: "valediction-form", source: "Poetry Foundation", url: "https://www.poetryfoundation.org/poems/44131/a-valediction-forbidding-mourning", quote: "Our two souls therefore, which are one." },
    { id: "valediction-history", source: "SparkNotes", url: "https://www.sparknotes.com/poetry/a-valediction-forbidding-mourning/poetic-devices/", quote: "The speaker sustains this conceit throughout the poem’s final three stanzas." },
  ],
  criticalViews: [{ citeId: "valediction-analysis" }, { citeId: "valediction-history" }],
  faqs: [
    { q: "What is the main meaning?", plain: "A spiritually grounded love can survive physical separation without dramatic mourning." },
    { q: "What does the compass conceit mean?", plain: "The beloved is the fixed foot; the traveling speaker remains connected and returns home." },
    { q: "What form and meter does it use?", plain: "Nine quatrains with alternating rhyme and chiefly iambic tetrameter." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

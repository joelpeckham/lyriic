import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const becauseICouldNotStopForDeathPoem: PoemAnalysisContent = {
  slug: "because-i-could-not-stop-for-death", status: "ready", poemTitle: "Because I Could Not Stop for Death", author: "Emily Dickinson", yearPublished: 1890,
  publicDomainBasis: "First published posthumously in 1890, before the US public-domain cutoff.",
  title: "Because I Could Not Stop for Death Analysis & Meaning — Emily Dickinson — lyriic", description: "Analysis of Dickinson’s death poem, its meaning, imagery, form, and uncertainty.", h1: "Because I Could Not Stop for Death analysis", intro: "Dickinson turns dying into a calm but unsettling carriage ride toward an uncertain eternity.",
  fullTextSource: { label: "Because I could not stop for Death", url: "https://poets.org/poem/because-i-could-not-stop-death-479", publisher: "Academy of American Poets" },
  editorSettings: poemMeterSettings("common-meter", { showCounts: true, showStress: true, showMeterBreaks: true, showRhymeScheme: true }),
  summary: [p("Death courteously stops for the speaker, who enters a carriage with Death and Immortality. The journey passes children, grain, sunset, and finally a grave.", ["poem-text-dickinson"]), excerpt(`Because I could not stop for Death—
He kindly stopped for me—
The Carriage held but just Ourselves—`), p("Centuries later, the speaker still remembers first guessing that the horses were headed toward Eternity.")],
  meaning: [p("Polite words such as “kindly” and “Civility” make death sound like a genteel visit, but the speaker also surrenders work, leisure, clothing, and control."), excerpt(`We paused before a House that seemed
A Swelling of the Ground—
The Roof was scarcely visible—`), p("The ending is directional rather than conclusive: Eternity remains a destination the poem approaches without explaining.", ["dickinson-miller"])],
  themes: [
    { theme: "Death as social encounter", blocks: [p("Personified Death behaves like a patient gentleman caller, making dying familiar while leaving the speaker’s surrender unsettling.")] },
    { theme: "Stages of life", blocks: [excerpt(`We passed the School, where Children strove
At Recess—in the Ring—
We passed the Fields of Gazing Grain—`), p("School, grain, and sunset compress childhood, maturity, and decline into one route.")] },
    { theme: "Immortality and uncertainty", blocks: [p("Immortality rides silently in the carriage; its presence suggests survival without proving what that survival means.")] },
  ],
  formAndMeter: [p("Six quatrains broadly follow common meter, alternating iambic tetrameter and trimeter. Dickinson’s dashes and substitutions make the hymn-like pattern flexible."), p("Slant rhymes such as “me”/“Immortality” and “Day”/“Eternity” echo without fully closing the sound.")],
  literaryDevices: [
    { device: "Personification", blocks: [excerpt(`He kindly stopped for me—`), p("Death becomes a courteous driver, allowing an abstract event to unfold as an ambiguous social encounter.")] },
    { device: "Extended metaphor", blocks: [excerpt(`The Carriage held but just Ourselves—
And Immortality.`), p("The carriage sustains a model of dying as departure, passage, burial, and possible continuation.")] },
    { device: "Reversal", blocks: [excerpt(`Or rather—He passed Us—`), p("The correction unsettles the apparent direction and exposes the speaker’s unstable perception of time and death.")] },
  ],
  historicalContext: [p("Written around 1862, the poem was published in Poems by Emily Dickinson in 1890. Early editors titled it “The Chariot,” omitted the fourth stanza, and regularized wording.", ["dickinson-miller"]), p("Cristanne Miller calls the omitted stanza an emotional turning point and reads the opening as an ironic portrait of Victorian gentility and repression.", ["dickinson-miller"])],
  citations: [
    { id: "poem-text-dickinson", source: "Academy of American Poets", url: "https://poets.org/poem/because-i-could-not-stop-death-479" },
    { id: "dickinson-miller", source: "White Heat, Dartmouth College", author: "Cristanne Miller", quote: "For many modern readers, the omitted fourth stanza is the emotional heart of the poem and its turning point.", url: "https://journeys.dartmouth.edu/whiteheat/jan8-14f479/" },
    { id: "dickinson-history", source: "White Heat, Dartmouth College", author: "Cristanne Miller", quote: "The poem becomes a satiric portrait of Victorian gentility and repression …", url: "https://journeys.dartmouth.edu/whiteheat/jan8-14f479/" },
    { id: "dickinson-gutenberg", source: "Project Gutenberg", url: "https://www.gutenberg.org/files/12242/12242-h/12242-h.htm" },
  ],
  criticalViews: [{ citeId: "dickinson-miller" }, { citeId: "dickinson-history" }],
  faqs: [{ q: "What is the meaning?", plain: "The poem imagines death as a carriage journey through life, burial, and an uncertain eternity." }, { q: "What does the house represent?", plain: "It is a grave described through domestic architecture." }, { q: "What meter does it use?", plain: "A flexible form of common meter with slant rhyme and distinctive dashes." }],
  cta: "Write with this poem’s meter in the editor",
};

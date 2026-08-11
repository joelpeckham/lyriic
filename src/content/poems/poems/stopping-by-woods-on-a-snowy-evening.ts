import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const stoppingByWoodsOnASnowyEveningPoem: PoemAnalysisContent = {
  slug: "stopping-by-woods-on-a-snowy-evening",
  status: "ready",
  poemTitle: "Stopping by Woods on a Snowy Evening",
  author: "Robert Frost",
  yearPublished: 1923,
  publicDomainBasis: "First published in New Hampshire (1923), before the US public-domain cutoff.",
  title: "Stopping by Woods on a Snowy Evening Analysis & Meaning — Robert Frost — lyriic",
  description: "Stopping by Woods on a Snowy Evening analysis of rest, responsibility, nature, mortality, rhyme, and meter.",
  h1: "Stopping by Woods on a Snowy Evening analysis",
  intro: "This analysis examines the poem’s quiet scene, interlocking rhyme, and unresolved pull between the woods and the speaker’s obligations.",
  fullTextSource: { label: "Stopping by Woods on a Snowy Evening", url: "https://en.wikisource.org/wiki/New_Hampshire,_a_Poem_with_Notes_and_Grace_Notes/Stopping_by_Woods_on_a_Snowy_Evening", publisher: "Wikisource" },
  editorSettings: poemMeterSettings("iambic-tetrameter", { showRhymeScheme: true, showMeterBreaks: true }),
  summary: [
    p("A traveler pauses to watch snow fill privately owned woods. His horse interrupts the stillness, and the speaker remembers promises and distance."),
    excerpt(`The woods are lovely, dark and deep.
But I have promises to keep,`),
    p("The repeated closing line can describe ordinary travel while also suggesting a darker meditation on sleep and death.", ["woods-sparknotes"]),
  ],
  meaning: [
    p("The poem lets beauty and duty coexist. The woods offer solitude and rest, while promises bind the speaker to people and responsibilities outside the scene."),
    excerpt(`And miles to go before I sleep,
And miles to go before I sleep.`),
    p("The poem does not force a single interpretation: the final repetition may sound like resolve, weariness, self-command, or a thought lingering near sleep.", ["woods-litcharts"]),
  ],
  themes: [
    { theme: "Duty and temptation", blocks: [p("The speaker is drawn toward the woods but turns toward obligations. The pause is meaningful precisely because it is not allowed to become permanent.")] },
    { theme: "Nature and society", blocks: [excerpt(`He will not see me stopping here
To watch his woods fill up with snow.`), p("Ownership, village, farmhouse, horse, and harness bells place the speaker between society and a nearly silent landscape.")] },
    { theme: "Rest and mortality", blocks: [p("Darkness, snow, and sleep support both a literal travel reading and a suggestive meditation on death.", ["woods-litcharts"])] },
  ],
  formAndMeter: [
    p("The poem has four quatrains in iambic tetrameter. Its chain rhyme is AABA BBCB CCDC DDDD, with each third line preparing the next stanza’s rhyme."),
    p("The final stanza resolves into one repeated rhyme, making formal closure sound like an echo rather than a simple ending.", ["woods-sparknotes"]),
  ],
  literaryDevices: [
    { device: "Personification", blocks: [excerpt(`My little horse must think it queer
To stop without a farmhouse near`), p("The speaker imagines the horse judging the unexplained stop, giving practical society a nearby voice.")] },
    { device: "Sensory imagery", blocks: [excerpt(`The only other sound’s the sweep
Of easy wind and downy flake.`), p("Soft sound and touch make the snow sheltering, which also makes the woods’ darkness more seductive.")] },
    { device: "Repetition", blocks: [excerpt(`And miles to go before I sleep`), p("Repeating the line turns a travel statement into an unresolved verbal echo.", ["woods-sparknotes"])] },
  ],
  historicalContext: [
    p("Frost wrote the poem in 1922 and published it in New Hampshire in 1923. The Wikisource text preserves the poem’s public-domain form."),
    p("Its traditional form and plain rural setting allow philosophical tension to emerge through ordinary speech rather than abstract argument."),
  ],
  citations: [
    { id: "woods-text", source: "Wikisource", url: "https://en.wikisource.org/wiki/New_Hampshire,_a_Poem_with_Notes_and_Grace_Notes/Stopping_by_Woods_on_a_Snowy_Evening" },
    { id: "woods-litcharts", source: "LitCharts", quote: "Though Frost’s poem resists a definitive interpretation, the natural world it depicts is at once “lovely” and overwhelming.", url: "https://www.litcharts.com/poetry/robert-frost/stopping-by-woods-on-a-snowy-evening" },
    { id: "woods-sparknotes", source: "SparkNotes", quote: "The basic conflict in the poem, resolved in the last stanza, is between an attraction toward the woods and the pull of responsibility outside of the woods.", url: "https://www.sparknotes.com/poetry/frost/section10/" },
    { id: "woods-poets", source: "Academy of American Poets", url: "https://poets.org/poem/stopping-woods-snowy-evening" },
  ],
  criticalViews: [{ citeId: "woods-litcharts" }, { citeId: "woods-sparknotes" }],
  faqs: [
    { q: "What is the main meaning?", plain: "The speaker is tempted by a beautiful, dark pause but pulled onward by promises and responsibilities." },
    { q: "What do the final miles mean?", plain: "Literally they are travel before rest; figuratively they can suggest unfinished duties before death, though the poem remains open." },
    { q: "What is the rhyme and meter?", plain: "It uses iambic tetrameter and interlocking AABA BBCB CCDC DDDD rhyme." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

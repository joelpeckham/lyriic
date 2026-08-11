import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const theRedWheelbarrowPoem: PoemAnalysisContent = {
  slug: "the-red-wheelbarrow", status: "ready", poemTitle: "The Red Wheelbarrow", author: "William Carlos Williams", yearPublished: 1923,
  publicDomainBasis: "First published in 1923, before the US public-domain cutoff.",
  title: "The Red Wheelbarrow Analysis & Meaning — William Carlos Williams — lyriic", description: "The Red Wheelbarrow analysis: Imagist attention, ordinary things, lineation, and “so much depends.”", h1: "The Red Wheelbarrow analysis",
  intro: "Williams makes an ordinary farm tool newly visible through exact color, surface, spacing, and radical compression.",
  fullTextSource: { label: "The Red Wheelbarrow", url: "https://www.poetryfoundation.org/poems/45502/the-red-wheelbarrow", publisher: "Poetry Foundation" },
  editorSettings: poemOpenSettings(),
  summary: [p("One sentence says that much depends on a red wheelbarrow beside white chickens. The poem explains neither what depends nor why, leaving significance inside the act of attention."), excerpt(`so much depends
upon
a red wheel`), p("Four two-line units separate and reconnect the tool, rainwater, and chickens. The plain scene becomes consequential without becoming a fixed allegory.", ["wheelbarrow-poets"])],
  meaning: [p("“So much depends” creates uncertainty while the concrete image prevents interpretation from becoming abstract. The poem asks readers to notice practical things that support a human world.", ["wheelbarrow-poets"]), excerpt(`glazed with rain
water
beside the white`), p("Its significance comes from perception: red, white, water, and labor remain visible rather than being replaced by explanation.", ["wheelbarrow-foundation"])],
  themes: [
    { theme: "Ordinary things", blocks: [p("A humble tool becomes a serious poetic subject.")] },
    { theme: "Attention", blocks: [p("Line breaks slow seeing and make the familiar strange.")] },
    { theme: "Labor and interdependence", blocks: [p("Tool, weather, animals, and people imply a network of practical dependence.", ["wheelbarrow-poets"])] },
  ],
  formAndMeter: [p("The sixteen words are arranged in four couplets with no fixed meter or rhyme."), p("Compound words split across lines—“wheel / barrow” and “rain / water”—make typography part of perception.", ["wheelbarrow-poets"])],
  literaryDevices: [
    { device: "Imagery", blocks: [excerpt(`a red wheel
barrow`), p("Exact visual details carry meaning without abstract explanation.")] },
    { device: "Enjambment", blocks: [excerpt(`glazed with rain
water`), p("The break gives rain and water separate emphasis.")] },
    { device: "Ambiguity", blocks: [excerpt(`so much depends
upon`), p("The missing object of “depends” invites readings without closing the image.")] },
  ],
  historicalContext: [p("The poem appeared in Spring and All in 1923, amid modernist experiments with ordinary American speech and free verse."), p("The Academy of American Poets connects the poem’s separated stanzas and absent punctuation to a tension between independence and connection.", ["wheelbarrow-poets"])],
  citations: [
    { id: "wheelbarrow-text", source: "Poetry Foundation", url: "https://www.poetryfoundation.org/poems/45502/the-red-wheelbarrow" },
    { id: "wheelbarrow-poets", source: "Academy of American Poets", url: "https://poets.org/text/red-wheelbarrow", quote: "The stanzas stand on the page as separate, but the lack of punctuation connects them." },
    { id: "wheelbarrow-foundation", source: "Poetry Foundation", author: "Craig Morgan Teicher", url: "https://www.poetryfoundation.org/articles/68731/william-carlos-williams-the-red-wheelbarrow", quote: "No ideas but in things" },
    { id: "wheelbarrow-form", source: "Academy of American Poets", url: "https://poets.org/text/red-wheelbarrow" },
  ],
  criticalViews: [{ citeId: "wheelbarrow-poets" }, { citeId: "wheelbarrow-foundation" }],
  faqs: [
    { q: "What is the meaning?", plain: "It makes an ordinary wheelbarrow feel essential without naming exactly what depends on it." },
    { q: "Why is it Imagist?", plain: "It uses economical language and a precise concrete image instead of abstract explanation." },
    { q: "Why split wheelbarrow and rainwater?", plain: "The breaks slow the reader’s seeing and make material details newly noticeable." },
  ],
  cta: "Write in the zen editor",
};

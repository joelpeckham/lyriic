import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const aNamelessGravePoem: PoemAnalysisContent = {
  slug: "a-nameless-grave", status: "ready", poemTitle: "A Nameless Grave", author: "Henry Wadsworth Longfellow", yearPublished: 1864,
  publicDomainBasis: "First published in the nineteenth century; public domain in the United States.",
  title: "A Nameless Grave Analysis & Meaning — Henry Wadsworth Longfellow — lyriic",
  description: "Analysis of Longfellow’s A Nameless Grave: sacrifice, anonymity, Civil War memory, sonnet form, and meaning.",
  h1: "A Nameless Grave analysis", intro: "Longfellow turns an unknown Union soldier’s burial into a meditation on sacrifice, memory, and civic debt.",
  fullTextSource: { label: "The Masque of Pandora and Other Poems", url: "https://www.gutenberg.org/files/1365/1365-0.txt", publisher: "Project Gutenberg" },
  editorSettings: poemMeterSettings("iambic-pentameter", { showCounts: true, showStress: true, showMeterBreaks: true, showRhymeScheme: true }),
  summary: [p("The poem begins with an inscription for an unknown Union soldier at Newport News. Because the marker gives no name or date, the speaker can imagine only several possible battlefield deaths."), excerpt(`"A soldier of the Union mustered out,"
Is the inscription on an unknown grave
At Newport News, beside the salt-sea wave,`), p("The sestet shifts from speculation to direct address and shame.", ["grave-analysis"])],
  meaning: [p("The soldier’s sacrifice creates a debt that public language cannot settle. Anonymity means the living cannot even recover the biography they would need to remember him personally.", ["grave-analysis"]), excerpt(`All that thou hadst, thy life, thy very name,
And I can give thee nothing in return.`), p("The final contrast refuses easy patriotic consolation.")],
  themes: [
    { theme: "Sacrifice and obligation", blocks: [p("The soldier gives life and identity; the speaker can offer only belated gratitude.")] },
    { theme: "Anonymity and memory", blocks: [excerpt(`Nameless and dateless; sentinel or scout`), p("Two adjectives compress the loss of a whole biography.")] },
    { theme: "War’s uncertainty", blocks: [p("The octave’s alternatives—sentinel or scout, skirmish or rout—show how war destroys the facts needed for individual stories.")] },
  ],
  formAndMeter: [p("This Petrarchan sonnet has an octave and sestet, with an ABBAABBA octave and CDECDE sestet rhyme pattern.", ["grave-form"]), p("Predominantly iambic pentameter gives the poem a grave, measured pace. The turn occurs when battlefield possibilities become personal confession.")],
  literaryDevices: [
    { device: "Apostrophe", blocks: [excerpt(`Thou unknown hero sleeping by the sea
In thy forgotten grave!`), p("Direct address creates intimacy while emphasizing that the dead cannot answer.")] },
    { device: "Imagery", blocks: [excerpt(`when the loud artillery drave
Its iron wedges through the ranks of brave`), p("Hard motion and metal contrast with the quiet grave.")] },
    { device: "Antithesis", blocks: [p("The soldier’s total gift is set against the speaker’s total inability to repay it.")] },
  ],
  historicalContext: [p("The poem belongs to Longfellow’s post–Civil War writing and appeared in The Masque of Pandora and Other Poems. Newport News anchors the meditation in a real military landscape.", ["grave-history"]), excerpt(`At Newport News, beside the salt-sea wave,
Nameless and dateless;`), p("Its public-domain source preserves the period wording and punctuation.")],
  citations: [
    { id: "grave-text", source: "Project Gutenberg", url: "https://www.gutenberg.org/files/1365/1365-0.txt" },
    { id: "grave-analysis", source: "Poem Analysis", url: "https://poemanalysis.com/henry-wadsworth-longfellow/a-nameless-grave/", quote: "The contrast between the ultimate sacrifice and the inability to properly honor it creates the poem’s powerful emotional resonance." },
    { id: "grave-form", source: "Poem Analysis", url: "https://poemanalysis.com/henry-wadsworth-longfellow/a-nameless-grave/", quote: "A Nameless Grave is written as a Petrarchan sonnet." },
    { id: "grave-history", source: "Project Gutenberg", url: "https://www.gutenberg.org/files/1365/1365-0.txt", quote: "The Masque of Pandora and Other Poems." },
  ],
  criticalViews: [{ citeId: "grave-analysis" }, { citeId: "grave-form" }],
  faqs: [
    { q: "What is the meaning?", plain: "An unknown soldier’s total sacrifice creates an ethical debt the living cannot fully repay." },
    { q: "What are the main themes?", plain: "Sacrifice, anonymity, memory, civic obligation, and the uncertainty of war." },
    { q: "What form does it use?", plain: "It is a Petrarchan sonnet in predominantly iambic pentameter." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

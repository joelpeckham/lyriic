import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const ifPoem: PoemAnalysisContent = {
  slug: "if", status: "ready", poemTitle: "If—", author: "Rudyard Kipling", yearPublished: 1910,
  publicDomainBasis: "First published in Rewards and Fairies in 1910, before the US public-domain cutoff.",
  title: "If— Analysis & Meaning — Rudyard Kipling — lyriic",
  description: "Kipling’s If— analysis: stoic virtue, resilience, masculinity, empire, rhetoric, and form.",
  h1: "If— analysis", intro: "This analysis examines Kipling’s advice about self-command alongside its Victorian gender and imperial assumptions.",
  fullTextSource: { label: "If— — full poem", url: "https://www.poetryfoundation.org/poems/46473/if---", publisher: "Poetry Foundation" },
  editorSettings: poemOpenSettings({ showCounts: true }),
  summary: [
    p("The poem addresses a son through conditional tests: remain calm, resist hatred, rebuild after loss, and keep balance around crowds and kings.", ["kipling-if-text"]),
    excerpt(`If you can keep your head when all about you
Are losing theirs and blaming it on you,
If you can trust yourself when all men doubt you,`),
    p("The final promise of owning the Earth is conditional on disciplined conduct, but “a Man” reveals the poem’s original gendered frame.", ["kipling-if-criticism"]),
  ],
  meaning: [
    p("If— defines maturity as active self-government rather than emotional emptiness. It asks readers to choose responses to pain, failure, lies, and hatred.", ["kipling-if-criticism"]),
    excerpt(`If you can meet with Triumph and Disaster
And treat those two impostors just the same;`),
    p("The accumulating conditions inspire resilience but can also make vulnerability and ordinary failure look like moral defects.", ["kipling-if-criticism"]),
  ],
  themes: [
    { theme: "Stoic virtue", blocks: [p("Composure, integrity, and proportion are treated as central virtues.")] },
    { theme: "Resilience", blocks: [p("The speaker asks the son to rebuild from total loss without self-pity.")] },
    { theme: "Balance", blocks: [p("Opposites—dream and thought, crowds and kings, triumph and disaster—test equilibrium.")] },
    { theme: "Masculinity and power", blocks: [p("The ending makes moral completion specifically male and promises possession of the Earth.", ["kipling-if-criticism"])] },
  ],
  formAndMeter: [
    p("Four eight-line stanzas are each one long conditional sentence; repeated “If you can” creates anaphora and cumulative momentum.", ["kipling-if-form"]),
    p("Predominantly iambic movement, alternating rhyme, semicolons, and parallel clauses make the poem sound like spoken instruction.", ["kipling-if-form"]),
  ],
  literaryDevices: [
    { device: "Anaphora", blocks: [excerpt(`If you can dream—and not make dreams your master;
If you can think—and not make thoughts your aim;`), p("The repeated conditional makes every virtue a test of the final reward.")] },
    { device: "Personification", blocks: [excerpt(`And treat those two impostors just the same;`), p("Triumph and Disaster become deceptive figures whose authority can be resisted.")] },
    { device: "Antithesis", blocks: [excerpt(`Or walk with Kings—nor lose the common touch,`), p("Balanced opposites model the equilibrium the poem recommends.")] },
  ],
  historicalContext: [
    p("Kipling published the poem in Rewards and Fairies in 1910; the Kipling Society records his statement that it was drawn from Leander Starr Jameson’s character.", ["kipling-if-history"]),
    p("Austin Allen reads the poem as Victorian didactic rhetoric whose confidence contains an anxiety about whether its conditions can ever be met.", ["kipling-if-criticism"]),
  ],
  citations: [
    { id: "kipling-if-text", source: "Poetry Foundation", url: "https://www.poetryfoundation.org/poems/46473/if---" },
    { id: "kipling-if-criticism", source: "Poetry Foundation", quote: "Kipling dryly remarked, in his late memoirs, that the poem offers “counsels of perfection most easy to give.”", url: "https://www.poetryfoundation.org/articles/70303/iffy" },
    { id: "kipling-if-history", source: "The Kipling Society", quote: "Published in Rewards and Fairies (1910) where it follows the story “Brother Squaretoes”", url: "https://www.kiplingsociety.co.uk/readers-guide/rg_if1.htm" },
    { id: "kipling-if-form", source: "LitCharts", quote: "The poem's speaker advises his son to live with restraint, moderation, and composure.", url: "https://www.litcharts.com/poetry/rudyard-kipling/if" },
  ],
  criticalViews: [{ citeId: "kipling-if-criticism" }, { citeId: "kipling-if-history" }],
  faqs: [
    { q: "What is If— about?", plain: "It presents maturity as patient, honest, resilient, balanced self-command." },
    { q: "What inspired the poem?", plain: "Kipling associated it with Leander Starr Jameson and published it in Rewards and Fairies in 1910." },
    { q: "What form does it use?", plain: "Four eight-line stanzas built from anaphora, conditional syntax, alternating rhyme, and predominantly iambic movement." },
  ],
  cta: "Write with this poem’s rhythm in the editor",
};

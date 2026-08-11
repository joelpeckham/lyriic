import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const theCremationOfSamMcGeePoem: PoemAnalysisContent = {
  slug: "the-cremation-of-sam-mcgee",
  status: "ready",
  poemTitle: "The Cremation of Sam McGee",
  author: "Robert W. Service",
  yearPublished: 1907,
  publicDomainBasis: "First published in Songs of a Sourdough (1907), before the US public-domain cutoff.",
  title: "The Cremation of Sam McGee Analysis & Meaning — Robert W. Service — lyriic",
  description: "The Cremation of Sam McGee analysis of loyalty, Yukon survival, dark humor, gold, ballad rhythm, and reversal.",
  h1: "The Cremation of Sam McGee analysis",
  intro: "This analysis explains how Service turns a grim Yukon promise into a fast-moving narrative of loyalty, survival, and comic reversal.",
  fullTextSource: { label: "The Cremation of Sam McGee", url: "https://en.wikisource.org/wiki/The_Cremation_of_Sam_McGee", publisher: "Wikisource" },
  editorSettings: poemOpenSettings({ showCounts: true, showRulers: false }),
  summary: [
    p("Sam, terrified of an icy grave, asks Cap to cremate him if he dies on the trail. Cap carries out the promise at Lake Lebarge using a derelict steamer."),
    excerpt(`There are strange things done in the midnight sun
By the men who moil for gold;`),
    p("The horror reverses into comedy when Sam is alive inside the furnace, enjoying its warmth.", ["sam-mcgee-encyclopedia"]),
  ],
  meaning: [
    p("The poem treats loyalty as a practical law: “a promise made is a debt unpaid” gives Cap’s exhausting task a moral shape."),
    excerpt(`A pal’s last need is a thing to heed,
So I swore I would not fail;`),
    p("The twist does not erase the danger. Its humor grows from the same cold that nearly kills Sam, making warmth a reversal of the Yukon world.", ["sam-mcgee-poemanalysis"]),
  ],
  themes: [
    { theme: "Friendship and loyalty", blocks: [p("Cap’s actions are driven by Sam’s request, and the trail’s code turns a private promise into a social duty.")] },
    { theme: "Survival and landscape", blocks: [excerpt(`Talk of your cold! through the parka’s fold it stabbed like a driven nail.`), p("Cold is physical and psychological: it freezes eyelashes, drains the dogs, and turns a companion’s body into a burden.")] },
    { theme: "Death and dark comedy", blocks: [p("Service creates a Gothic situation with a corpse and furnace, then breaks the tension through Sam’s literal complaint about the cold.", ["sam-mcgee-poemanalysis"])] },
  ],
  formAndMeter: [
    p("The poem is a narrative ballad framed by a repeated eight-line stanza. Its dominant movement is anapestic tetrameter, varied for conversational speech."),
    p("Internal rhyme and paired end rhyme create forward momentum suited to mushing, oral recitation, and a fireside tale.", ["sam-mcgee-encyclopedia"]),
  ],
  literaryDevices: [
    { device: "Simile", blocks: [excerpt(`Through the parka’s fold it stabbed like a driven nail.`), p("The comparison gives cold the force of a weapon and prepares the reader for Sam’s fear of the icy grave.")] },
    { device: "Personification", blocks: [excerpt(`Now a promise made is a debt unpaid, and the trail has its own stern code.`), p("The trail becomes an authority, making Cap’s promise part of a culture of survival.")] },
    { device: "Irony and reversal", blocks: [excerpt(`Since I left Plumtree, down in Tennessee, it’s the first time I’ve been warm.`), p("Sam’s calm response reverses the expected result of cremation: warmth, not death, is the immediate point of the furnace.")] },
  ],
  historicalContext: [
    p("The poem appeared in Service’s 1907 collection Songs of a Sourdough, drawing on the Yukon world associated with the Klondike Gold Rush."),
    p("Service’s narrative turns a grim survival anecdote into a comic ballad whose moral center is the keeping of a promise.", ["sam-mcgee-poemanalysis"]),
  ],
  citations: [
    { id: "sam-mcgee-text", source: "Wikisource", url: "https://en.wikisource.org/wiki/The_Cremation_of_Sam_McGee" },
    { id: "sam-mcgee-poemanalysis", source: "Poem Analysis", author: "Sudip Das Gupta", quote: "Service uses rhyme and rhythm not only to entertain but to subtly mirror the march of obligation through harsh, unforgiving terrain.", url: "https://poemanalysis.com/robert-service/the-cremation-of-sam-mcgee/" },
    { id: "sam-mcgee-encyclopedia", source: "Encyclopedia.com", quote: "exhibits the elements that mark Service’s style: internal rhymes, stressed rhythms, a dash of stereotypical Yukon machismo, ironic and slightly macabre humor", url: "https://www.encyclopedia.com/arts/educational-magazines/cremation-sam-mcgee" },
    { id: "sam-mcgee-archive", source: "Internet Archive", url: "https://archive.org/details/songssourdough00servuoft" },
  ],
  criticalViews: [{ citeId: "sam-mcgee-poemanalysis" }, { citeId: "sam-mcgee-encyclopedia" }],
  faqs: [
    { q: "What is the meaning?", plain: "The poem presents friendship as a promise honored under extreme conditions, then transforms fear into dark comedy." },
    { q: "What are the themes?", plain: "Loyalty, survival, gold, death, and comic reversal." },
    { q: "Is Sam McGee really dead?", plain: "No. Cap expects a corpse, but Sam is alive inside the furnace and finally feels warm." },
  ],
  cta: "Write with this poem’s rhythm in the editor",
};

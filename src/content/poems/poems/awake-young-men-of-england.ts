import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const awakeYoungMenOfEnglandPoem: PoemAnalysisContent = {
  slug: "awake-young-men-of-england",
  status: "ready",
  poemTitle: "Awake! Young Men of England",
  author: "George Orwell",
  yearPublished: 1914,
  publicDomainBasis: "Published in 1914, before the US public-domain cutoff.",
  title: "Awake! Young Men of England Analysis & Meaning — George Orwell — lyriic",
  description: "Analysis of Orwell’s wartime recruitment poem, its patriotic pressure, rhetoric, and historical meaning.",
  h1: "Awake! Young Men of England analysis",
  intro: "This analysis examines how Orwell’s youthful wartime poem turns enlistment into a test of courage and loyalty.",
  fullTextSource: { label: "Awake! Young Men of England", url: "https://en.wikisource.org/wiki/Awake!_Young_Men_of_England", publisher: "Wikisource" },
  editorSettings: poemOpenSettings({ showCounts: true }),
  summary: [
    p("The speaker addresses young English men during the opening months of the First World War and urges them to enlist. Animal emblems and blunt military language make recruitment sound like a test of character."),
    excerpt(`Awake! Oh you young men of England,
For if, when your Country’s in need,
You do not enlist by the thousand,`),
    p("The final accusation turns patriotic pressure into public shame: refusing service is labeled cowardice.", ["orwell-foundation-poetry"]),
  ],
  meaning: [
    p("The poem presents enlistment as a moral obligation rather than a choice. Its simplified heroic vocabulary leaves little room for fear, dissent, or conscientious objection."),
    excerpt(`You truly are cowards indeed.`),
    p("The image of soldiers throwing away their lives briefly acknowledges sacrifice, but uses it to intensify the appeal rather than question the war.", ["orwell-society-taylor"]),
  ],
  themes: [
    { theme: "Patriotism and duty", blocks: [p("Repeated appeals to England and “your Country” make national service the expected proof of belonging.")] },
    { theme: "Shame as persuasion", blocks: [p("The closing couplet divides the audience into men who answer the call and those branded cowards.")] },
    { theme: "Heroic language and violence", blocks: [excerpt(`The strength of the Lion,
The wisdom of Reynard the Fox`), p("Fable-like symbols make modern violence sound energetic and uncomplicated.")] },
  ],
  formAndMeter: [
    p("The poem uses three quatrains with alternating rhyme in each stanza. Its loose four-beat, ballad-like rhythm and short clauses suit public recitation."),
    p("The stanzas move from imagined strength, to danger and sacrifice, to a command. The repeated address gives the ending the sound of a slogan."),
  ],
  literaryDevices: [
    { device: "Direct address", blocks: [excerpt(`Awake! Oh you young men of England`), p("The imperative summons a public audience and makes each young man feel personally responsible.")] },
    { device: "Animal symbolism", blocks: [excerpt(`The strength of the Lion,
The wisdom of Reynard the Fox`), p("The lion suggests courage and the fox cunning, a compact inventory of qualities desired in war.")] },
    { device: "Metaphor", blocks: [excerpt(`Oh! think of the War Lord’s mailed fist`), p("The enemy becomes a striking armored hand, making an abstract threat bodily and immediate.")] },
  ],
  historicalContext: [
    p("The poem appeared in the Henley and South Oxfordshire Standard on October 2, 1914, soon after Britain entered the First World War. Orwell was then eleven-year-old Eric Blair.", ["orwell-society-taylor"]),
    p("The Orwell Foundation describes it as the energetic, romantic view of warfare of a child at the start of the war; its historical value lies partly in the contrast with Orwell’s mature political skepticism.", ["orwell-foundation-poetry"]),
  ],
  citations: [
    { id: "poem-text-orwell", source: "Wikisource", url: "https://en.wikisource.org/wiki/Awake!_Young_Men_of_England" },
    { id: "orwell-society-taylor", source: "The Orwell Society", author: "D. J. Taylor", quote: "the patriotic fervour of ‘Awake! Young Men of England’, published in the Henley & South Oxfordshire Standard on 2 October 1914", url: "https://orwellsociety.com/edition-of-orwells-poems-a-triumph/" },
    { id: "orwell-foundation-poetry", source: "The Orwell Foundation", quote: "the energy and excitement of a child’s romantic view of warfare", url: "https://www.orwellfoundation.com/uncategorized/fools-rush-in/" },
    { id: "orwell-poetry-history", source: "The Orwell Foundation", author: "D. J. Taylor", url: "https://www.orwellfoundation.com/the-orwell-foundation/orwell/articles/d-j-taylor-orwells-poetry/" },
  ],
  criticalViews: [{ citeId: "orwell-society-taylor" }, { citeId: "orwell-foundation-poetry" }],
  faqs: [
    { q: "What is the poem’s meaning?", plain: "It urges young English men to enlist and uses patriotism and shame to frame service as moral duty." },
    { q: "What are its themes?", plain: "Patriotism, masculine courage, recruitment, shame, and the gap between heroic language and wartime cost." },
    { q: "What is its form?", plain: "Three rhymed quatrains in a loose, four-beat ballad-like rhythm." },
  ],
  cta: "Write with this poem’s rhythm in the editor",
};

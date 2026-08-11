import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const theBattleHymnOfTheRepublicPoem: PoemAnalysisContent = {
  slug: "the-battle-hymn-of-the-republic",
  status: "ready",
  poemTitle: "The Battle Hymn of the Republic",
  author: "Julia Ward Howe",
  yearPublished: 1862,
  publicDomainBasis: "First published in The Atlantic Monthly in February 1862, before the US public-domain cutoff.",
  title: "The Battle Hymn of the Republic Analysis & Meaning — Julia Ward Howe — lyriic",
  description: "The Battle Hymn of the Republic analysis of judgment, emancipation, Civil War context, biblical imagery, and hymn form.",
  h1: "The Battle Hymn of the Republic analysis",
  intro: "This analysis explains how Julia Ward Howe turns a marching song into a religious vision of justice, war, sacrifice, and freedom.",
  fullTextSource: { label: "The Battle Hymn of the Republic", url: "https://en.wikisource.org/wiki/The_Atlantic_Monthly/Battle_Hymn_of_the_Republic", publisher: "Wikisource" },
  editorSettings: poemOpenSettings({ showCounts: true, showRulers: false }),
  summary: [
    p("The speaker sees Civil War camps, weapons, trumpets, and marching feet as signs that divine judgment is moving through history.", ["battle-hymn-text"]),
    excerpt(`Mine eyes have seen the glory of the coming of the Lord:
He is trampling out the vintage where the grapes of wrath are stored;`),
    p("The hymn moves from judgment toward a demand that people die to make others free.", ["battle-hymn-hall"]),
  ],
  meaning: [
    p("The poem frames the Union cause and emancipation as part of a sacred drama. Truth is imagined as an active force moving through armies, sacrifice, and history."),
    excerpt(`As He died to make men holy, let us die to make men free,
While God is marching on.`),
    p("That framing is hopeful but severe: freedom is holy, yet the path toward it involves judgment and human cost.", ["battle-hymn-hall"]),
  ],
  themes: [
    { theme: "Justice and judgment", blocks: [p("The Lord reads hearts and answers people according to how they treat those they contemn. Confidence in justice includes a threat of reckoning.")] },
    { theme: "Emancipation and action", blocks: [excerpt(`With a glory in his bosom that transfigures you and me:`), p("Christ’s sacrifice becomes a model for people willing to act so others can be free.")] },
    { theme: "War as sacred history", blocks: [p("Military spectacle is transformed into biblical sign, interpreting the Civil War as a crisis in the nation’s moral direction.", ["battle-hymn-hall"])] },
  ],
  formAndMeter: [
    p("The poem has five four-line stanzas with hymn-like 8.7.8.7 movement, flexible stresses, and an ABCB-like rhyme pattern."),
    p("Its repeated marching refrain and connection with the tune of “John Brown’s Body” make collective performance central to its effect.", ["battle-hymn-hall"]),
  ],
  literaryDevices: [
    { device: "Biblical allusion", blocks: [excerpt(`He is trampling out the vintage where the grapes of wrath are stored;`), p("The vintage and grapes of wrath evoke prophetic judgment and give the war an absolute moral scale.")] },
    { device: "Extended metaphor", blocks: [excerpt(`I have read a fiery gospel writ in burnished rows of steel:`), p("Rows of weapons become a gospel, fusing military spectacle with scriptural interpretation.")] },
    { device: "Personification", blocks: [excerpt(`His truth is marching on.`), p("Truth receives the movement of an army or procession, becoming active and historical.")] },
  ],
  historicalContext: [
    p("Howe wrote the poem in November 1861 after hearing Union soldiers sing “John Brown’s Body.” It appeared on the first page of The Atlantic Monthly in February 1862.", ["battle-hymn-hall"]),
    p("Florence Howe Hall records that James T. Fields supplied the title and that the poem quickly circulated through newspapers, army hymnbooks, and broadsides."),
  ],
  citations: [
    { id: "battle-hymn-text", source: "Wikisource", url: "https://en.wikisource.org/wiki/The_Atlantic_Monthly/Battle_Hymn_of_the_Republic" },
    { id: "battle-hymn-hall", source: "The Story of the Battle Hymn of the Republic", author: "Florence Marion Howe Hall", quote: "The passion of the poem seems, indeed, to lift on high and glorify our poor humanity.", url: "https://en.wikisource.org/wiki/The_Story_of_the_Battle_Hymn_of_the_Republic/Chapter_4" },
    { id: "battle-hymn-origin", source: "The Story of the Battle Hymn of the Republic", quote: "The original draft of the “Battle Hymn” was written on the back of a sheet of the letter-paper of the Sanitary Commission", url: "https://en.wikisource.org/wiki/The_Story_of_the_Battle_Hymn_of_the_Republic/Chapter_4" },
    { id: "battle-hymn-atlantic", source: "The Atlantic Monthly", url: "https://en.wikisource.org/wiki/The_Atlantic_Monthly/Battle_Hymn_of_the_Republic" },
  ],
  criticalViews: [{ citeId: "battle-hymn-hall" }, { citeId: "battle-hymn-origin" }],
  faqs: [
    { q: "What is the main meaning?", plain: "The poem interprets the Civil War as a sacred struggle in which judgment moves toward freedom." },
    { q: "What are its main themes?", plain: "Judgment, emancipation, sacrifice, religious faith, and the attempt to understand war as moral history." },
    { q: "What is its form?", plain: "It is a five-stanza hymn with four lines per stanza, flexible 8.7.8.7 movement, rhyme, and repeated refrains." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const theRapeOfTheLockPoem: PoemAnalysisContent = {
  slug: "the-rape-of-the-lock", status: "ready", poemTitle: "The Rape of the Lock", author: "Alexander Pope", yearPublished: 1714,
  publicDomainBasis: "First published in 1712 and expanded in 1714, centuries before the US cutoff.",
  title: "The Rape of the Lock Analysis & Meaning — Alexander Pope — lyriic", description: "The Rape of the Lock analysis: mock epic, vanity, gender, honor, and social conflict.", h1: "The Rape of the Lock analysis",
  intro: "Pope turns a stolen lock of hair into a mock epic whose heroic couplets expose fashionable vanity and conflict.",
  fullTextSource: { label: "The Rape of the Lock and other poems", url: "https://www.gutenberg.org/files/9800/9800-h/9800-h.htm", publisher: "Project Gutenberg" },
  editorSettings: poemMeterSettings("iambic-pentameter", { showMeterBreaks: true, showRhymeScheme: true }),
  summary: [p("Belinda attends fashionable society, plays ombre, and becomes the target of the Baron, who cuts a lock of her hair. Sylphs guard her, but epic machinery cannot prevent the social crisis."), excerpt(`Swift to the Lock a thousand Sprites repair,
A thousand wings, by turns, blow back the hair;
And thrice they twitch'd the diamond in her ear;`), p("The poem’s grand style makes a small social incident look enormous, revealing how status and reputation govern its world.", ["rape-criticism"])],
  meaning: [p("Its central joke is a mismatch between subject and style: cards, cosmetics, and scissors receive the language of war and epic destiny.", ["rape-criticism"]), excerpt(`Let Spades be trumps! she said, and trumps they were.
Now move to war her sable Matadores,`), p("The satire is amused but not empty. The Baron’s language of conquest makes desire and possession visible beneath the comedy.", ["rape-virginia"])],
  themes: [
    { theme: "Triviality and social importance", blocks: [p("A lock is materially small but becomes a crisis of honor.")] },
    { theme: "Gender and possession", blocks: [p("Epic battle language turns a fashionable flirtation into a contest over a woman’s body and reputation.")] },
    { theme: "Vanity and performance", blocks: [p("Cards, fans, cosmetics, and conversation make identity a public performance.", ["rape-virginia"])] },
  ],
  formAndMeter: [p("The five-canto mock epic is chiefly written in heroic couplets: rhymed pairs of iambic pentameter."), p("Invocation, supernatural guardians, battle scenes, speeches, and elevated diction imitate epic conventions while miniaturizing them around fashionable life.", ["rape-criticism"])],
  literaryDevices: [
    { device: "Mock epic", blocks: [excerpt(`And particolour'd troops, a shining train,
Draw forth to combat on the velvet plain.`), p("The card table becomes a battlefield, creating comic disproportion.")] },
    { device: "Bathos", blocks: [excerpt(`Here Britain's statesmen oft the fall foredoom
Of foreign Tyrants and of Nymphs at home;`), p("The movement from national politics to gossip deflates grandeur.")] },
    { device: "Personification", blocks: [excerpt(`T' inclose the Lock; now joins it, to divide.`), p("The scissors become a heroic weapon in a miniature encounter.")] },
  ],
  historicalContext: [p("Pope wrote the poem after a quarrel between Arabella Fermor and Lord Robert Petre. He published two cantos in 1712 and expanded the work to five in 1714.", ["rape-virginia"]), p("The early eighteenth-century setting includes Hampton Court, ombre, cosmetics, coffee, and elaborate dress, giving the satire a concrete social target.")],
  citations: [
    { id: "rape-text", source: "Project Gutenberg", url: "https://www.gutenberg.org/files/9800/9800-h/9800-h.htm" },
    { id: "rape-criticism", source: "eCampusOntario Pressbooks", author: "John L. Kessler", url: "https://ecampusontario.pressbooks.pub/lithumanities/chapter/chapter-6-pope-the-rape-of-the-lock/", quote: "Although Pope himself called the poem “An Heroi-Comical Poem,” critics like to call it a “mock epic.”" },
    { id: "rape-virginia", source: "University of Virginia Literature in Context", url: "https://anthology.lib.virginia.edu/work/Pope/pope-rape-lock", quote: "Pope's poem is a mock-heroic poem that treats a trivial subject in the elevated style of epic." },
    { id: "rape-history", source: "Project Gutenberg", url: "https://www.gutenberg.org/files/9800/9800-h/9800-h.htm" },
  ],
  criticalViews: [{ citeId: "rape-criticism" }, { citeId: "rape-virginia" }],
  faqs: [
    { q: "Why is it called a mock epic?", plain: "It imitates epic conventions while applying them to cards, cosmetics, gossip, and scissors." },
    { q: "What is the main meaning?", plain: "The poem satirizes vanity, status anxiety, and possessive social conflict through comic disproportion." },
    { q: "What form does it use?", plain: "It is a five-canto poem chiefly written in heroic couplets." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

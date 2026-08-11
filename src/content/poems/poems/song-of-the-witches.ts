import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const songOfTheWitchesPoem: PoemAnalysisContent = {
  slug: "song-of-the-witches",
  status: "ready",
  poemTitle: "Song of the Witches",
  author: "William Shakespeare",
  yearPublished: 1606,
  publicDomainBasis: "Macbeth was written and performed in the early seventeenth century; Shakespeare’s text is public domain.",
  title: "Song of the Witches Analysis & Meaning — William Shakespeare — lyriic",
  description: "Song of the Witches analysis of Macbeth’s chant, including its ritual, grotesque imagery, rhyme, and trochaic rhythm.",
  h1: "Song of the Witches analysis",
  intro: "This analysis explains how “Double, double, toil and trouble” turns a grotesque ingredient list into a ritual of disorder.",
  fullTextSource: { label: "Macbeth, Act IV, Scene I", url: "https://www.shakespeare-online.com/plays/macbeth_4_1.html", publisher: "Shakespeare Online" },
  editorSettings: poemMeterSettings("trochaic-tetrameter", { showMeterBreaks: true, showRhymeScheme: true }),
  summary: [
    p("Three witches prepare a potion from poisonous animals, plants, and human remains. The recurring refrain makes the inventory sound like a spell."),
    excerpt(`Round about the cauldron go;
In the poison’d entrails throw.`),
    p("The chant occurs as Macbeth seeks supernatural knowledge, so its organized recipe gives physical form to a world of moral corruption.", ["witches-online"]),
  ],
  meaning: [
    p("“Double” suggests intensification and doubleness: the refrain is catchy and musical while the witches’ language elsewhere hides danger inside apparent certainty."),
    excerpt(`Double, double toil and trouble;
Fire burn and cauldron bubble.`),
    p("The chant does not merely describe magic; repetition, rhyme, and falling rhythm perform a ritual that makes disorder feel controlled.", ["witches-meter"]),
  ],
  themes: [
    { theme: "Chaos made ritual", blocks: [p("Imperatives such as throw, boil, add, and cool impose sequence on grotesque materials. The witches give supernatural disorder the shape of a recipe.")] },
    { theme: "Deception and doubleness", blocks: [excerpt(`For a charm of powerful trouble,
Like a hell-broth boil and bubble.`), p("The sing-song surface disguises destructive purpose, echoing the witches’ misleading prophecies.")] },
    { theme: "Corrupted nature", blocks: [p("Animal parts and plants are stripped of ordinary identity and reduced to ingredients, making the natural world raw material for violence.")] },
  ],
  formAndMeter: [
    p("The chant is mainly trochaic tetrameter, often catalectic, with four falling beats and a clipped ending. Rhyming couplets separate the witches’ speech from the play’s usual blank verse.", ["witches-meter"]),
    p("The repeated “trouble / bubble” rhyme makes the spell circular and memorable."),
  ],
  literaryDevices: [
    { device: "Refrain", blocks: [excerpt(`Double, double toil and trouble;
Fire burn and cauldron bubble.`), p("Returning after each ingredient group makes the incantation feel iterative, as though each cycle increases its force.")] },
    { device: "Catalogue", blocks: [excerpt(`Eye of newt and toe of frog,
Wool of bat and tongue of dog,`), p("Paired body parts accumulate sensory detail while reducing living creatures to interchangeable components.")] },
    { device: "Grotesque imagery", blocks: [excerpt(`Finger of birth-strangled babe
Ditch-deliver’d by a drab,`), p("The movement from animal parts to human remains makes the magic ethically repellent, not merely exotic.")] },
  ],
  historicalContext: [
    p("Macbeth was written around 1606 during James I’s reign, when witchcraft, treason, kingship, and supernatural signs were powerful cultural concerns."),
    p("The early modern text contains antisemitic and dehumanizing language in its ingredient list. That historical wording should be identified critically rather than repeated as neutral description.", ["witches-online"]),
  ],
  citations: [
    { id: "witches-text", source: "Academy of American Poets", url: "https://poets.org/poem/macbeth-act-iv-scene-i-round-about-cauldron-go" },
    { id: "witches-online", source: "Shakespeare Online", quote: "The speeches of the witches are thrown into the same trochaic metre that they have employed on their former appearances.", url: "https://www.shakespeare-online.com/plays/macbeth_4_1.html" },
    { id: "witches-meter", source: "The Educational Hub", quote: "The witches' chant uses trochaic tetrameter (strong/weak pattern, four times) with catalectic lines (missing the final weak syllable).", url: "https://educationalhub.org/shakespeare-macbeth-witches-reading-analysis/" },
    { id: "witches-style", source: "No Sweat Shakespeare", quote: "Shakespeare distinguishes them from the other characters by making them speak in a distinctive way", url: "https://nosweatshakespeare.com/quotes/famous/double-double-toil-and-trouble/" },
  ],
  criticalViews: [{ citeId: "witches-meter" }, { citeId: "witches-online" }],
  faqs: [
    { q: "What does “Double, double, toil and trouble” mean?", plain: "It is an incantation that intensifies the witches’ work and hints at the deceptive doubleness of their language." },
    { q: "What meter does the chant use?", plain: "It mainly uses catalectic trochaic tetrameter and rhyming couplets." },
    { q: "Why list strange ingredients?", plain: "The catalogue turns violence into a physical recipe and creates grotesque sensory imagery." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

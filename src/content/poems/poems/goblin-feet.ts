import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const goblinFeetPoem: PoemAnalysisContent = {
  slug: "goblin-feet", status: "ready", poemTitle: "Goblin Feet", author: "J. R. R. Tolkien", yearPublished: 1915,
  publicDomainBasis: "First published in Oxford Poetry 1915, before the US public-domain cutoff.",
  title: "Goblin Feet Analysis & Meaning — J. R. R. Tolkien — lyriic",
  description: "Goblin Feet analysis: Tolkien’s fairy imagery, sound, form, themes, and bittersweet ending.",
  h1: "Goblin Feet analysis", intro: "This analysis reads Tolkien’s poem as a spell-like journey from sensory enchantment to loss.",
  fullTextSource: { label: "Goblin Feet — full poem", url: "https://en.wikisource.org/wiki/Goblin_Feet", publisher: "Wikisource" },
  editorSettings: poemOpenSettings({ showCounts: true }),
  summary: [
    p("The speaker follows a procession of tiny supernatural beings through a moonlit landscape of lanterns, wings, jewels, and padded feet.", ["goblin-tolkien-context"]),
    excerpt(`I am off down the road
Where the fairy lanterns glowed
And the little pretty flitter-mice are flying:`),
    p("The procession fades around a turn, so delight becomes sorrow when the magic disappears.", ["goblin-tolkien-context"]),
  ],
  meaning: [
    p("The poem makes enchantment sensory: the reader hears humming, horns, robes, and feet while seeing lamps, colours, jewels, and wings.", ["goblin-tolkien-context"]),
    excerpt(`They are fading round the turn
Where the glow worms palely burn
And the echo of their padding feet is dying!`),
    p("Wonder is temporary. The speaker wants to follow into another world, but the final line admits that magic’s disappearance is part of its emotional power.", ["goblin-tolkien-context"]),
  ],
  themes: [
    { theme: "Wonder", blocks: [p("Repeated lights, wings, and diminutive creatures make the fairy world feel close enough to enter.")] },
    { theme: "Transience and loss", blocks: [p("Fading figures and dying echoes turn enchantment into an experience of grief.")] },
    { theme: "Desire for another world", blocks: [p("Commands such as “Let me go!” turn observation into pursuit and longing.")] },
  ],
  formAndMeter: [
    p("The four stanzas alternate longer descriptive passages with short exclamatory choruses. Flexible accentual-syllabic rhythm makes the poem songlike rather than strictly metrical."),
    p("Rhyme, internal sound, repeated “O!”, and recurring words such as “little” and “feet” create an incantatory pulse.", ["goblin-tolkien-context"]),
  ],
  literaryDevices: [
    { device: "Onomatopoeia", blocks: [excerpt(`That warn you with their whirring and their humming.`), p("Sound-imitating words make the invisible fairy traffic audible.")] },
    { device: "Sensory imagery", blocks: [excerpt(`O! the warmth! O! the hum!
O! the colours in the dark!`), p("Accumulated sensations define the fairies more vividly than explanation.")] },
    { device: "Repetition", blocks: [excerpt(`O! the echo of their feet—of their happy little feet:`), p("Repetition establishes a childlike, spell-like voice.")] },
  ],
  historicalContext: [
    p("Tolkien wrote the poem on April 27–28, 1915, to please Edith Bratt, and Oxford Poetry 1915 published it in December.", ["goblin-tolkien-publication"]),
    p("The Tolkien Library describes its fairy world as close to the Victorian depiction of fairies; Tolkien later regretted the poem’s diminutive tradition.", ["goblin-tolkien-context"]),
  ],
  citations: [
    { id: "goblin-feet-text", source: "Wikisource", url: "https://en.wikisource.org/wiki/Goblin_Feet" },
    { id: "goblin-tolkien-context", source: "Tolkien Library", quote: "The result was as close to the Victorian depiction of fairies as it can get.", url: "https://tolkienlibrary.com/press/oxfordpoetry1915.php" },
    { id: "goblin-tolkien-publication", source: "Tolkien Library", quote: "Originally published by B.H. Blackwell. in 1915.", url: "https://tolkienlibrary.com/booksedited/oxfordp/description.php" },
    { id: "goblin-wikipedia", source: "Wikipedia", quote: "It celebrates the diminutive type of elf that Tolkien soon came to dislike", url: "https://en.wikipedia.org/wiki/Goblin_Feet" },
  ],
  criticalViews: [{ citeId: "goblin-tolkien-context" }, { citeId: "goblin-wikipedia" }],
  faqs: [
    { q: "What is Goblin Feet about?", plain: "It depicts a speaker following a fairy procession whose beauty and music fade into sorrow." },
    { q: "What are its themes?", plain: "Wonder, sensory imagination, transience, loss, and the desire to cross into another world." },
    { q: "What form does it use?", plain: "Its flexible, songlike rhythm alternates longer descriptions with exclamatory choruses." },
  ],
  cta: "Write with this poem’s rhythm in the editor",
};

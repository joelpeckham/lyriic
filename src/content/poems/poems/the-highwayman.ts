import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const theHighwaymanPoem: PoemAnalysisContent = {
  slug: "the-highwayman",
  status: "ready",
  poemTitle: "The Highwayman",
  author: "Alfred Noyes",
  yearPublished: 1906,
  publicDomainBasis: "First published in 1906, before the US public-domain cutoff.",
  title: "The Highwayman Analysis & Meaning — Alfred Noyes — lyriic",
  description: "The Highwayman analysis: love, sacrifice, betrayal, imagery, ballad rhythm, and tragic memory.",
  h1: "The Highwayman analysis",
  intro: "This analysis follows Noyes’s doomed lovers through a vivid narrative ballad of betrayal, sacrifice, and legendary return.",
  fullTextSource: {
    label: "The Highwayman",
    url: "https://www.poetryfoundation.org/poems/43187/the-highwayman",
    publisher: "Poetry Foundation",
  },
  editorSettings: poemOpenSettings({ showCounts: true }),
  summary: [
    p("A highwayman visits Bess, the landlord’s daughter, and promises to return by moonlight. Tim the ostler, who loves Bess, betrays the meeting to King George’s soldiers."),
    excerpt(`The wind was a torrent of darkness among the gusty trees.
The moon was a ghostly galleon tossed upon cloudy seas.
The road was a ribbon of moonlight over the purple moor.`),
    p("The soldiers use Bess as bait. She fires the musket tied beneath her breast to warn the approaching rider, and the highwayman later rides back in grief and is killed.", ["highwayman-encyclopedia"]),
  ],
  meaning: [
    p("The poem makes love an active sacrifice rather than a private feeling. Bess’s warning saves the highwayman from the ambush but costs her life; his return turns grief into a second fatal act.", ["highwayman-encyclopedia"]),
    excerpt(`Her musket shattered the moonlight,
Shattered her breast in the moonlight and warned him—with her death.`),
    p("The final “they say” moves the lovers from history into legend. The repeated opening images suggest that communal storytelling preserves their bond after both bodies are gone.", ["highwayman-memory"]),
  ],
  themes: [
    { theme: "Love and sacrifice", blocks: [p("Bess chooses a warning that she knows will kill her, while the highwayman’s return shows devotion shaped by loss.")] },
    { theme: "Betrayal and power", blocks: [p("Tim’s jealousy enables the soldiers’ ambush, joining private resentment to institutional violence.")] },
    { theme: "Memory and legend", blocks: [p("The closing winter-night refrain turns tragedy into a story that can be repeated across generations.", ["highwayman-memory"])] },
  ],
  formAndMeter: [
    p("This is a narrative ballad in two parts, with irregular stanza lengths, recurring refrains, dialogue, and a strong performance-like pulse."),
    p("Long rolling lines mix iambic and anapaestic movement, while short repeated phrases imitate hoofbeats and marching. The repeated “Riding—riding—” makes motion audible."),
  ],
  literaryDevices: [
    { device: "Metaphor", blocks: [excerpt(`The moon was a ghostly galleon tossed upon cloudy seas.`), p("The moon becomes a ship and the clouds a sea, enlarging the road into a mythic night journey.")] },
    { device: "Onomatopoeia", blocks: [excerpt(`Tlot-tlot; tlot-tlot! Had they heard it?`), p("The invented hoofbeat is both a sound effect and a suspense signal: its return announces love, danger, and approaching death.")] },
    { device: "Refrain", blocks: [excerpt(`Look for me by moonlight;
Watch for me by moonlight;
I’ll come to thee by moonlight, though hell should bar the way!`), p("The promise is repeated by the soldiers as cruelty and finally survives as a ghostly pattern.")] },
  ],
  historicalContext: [
    p("Noyes first published the poem in 1906. Its King George setting supplies historical color, but the poem’s main method is romantic ballad legend rather than documentary history."),
    p("The Penn State study describes the poem as a vessel for collective memory, emphasizing how its images and narrative can preserve a period’s imagined past.", ["highwayman-memory"]),
  ],
  citations: [
    { id: "highwayman-text", source: "Poetry Foundation", url: "https://www.poetryfoundation.org/poems/43187/the-highwayman" },
    { id: "highwayman-encyclopedia", source: "Encyclopedia.com", url: "https://www.encyclopedia.com/arts/educational-magazines/highwayman", quote: "The poem is notable for the way in which it reverses our expectations concerning light and dark imagery." },
    { id: "highwayman-memory", source: "Penn State, ES Review", url: "https://pure.psu.edu/en/publications/ballads-as-vessels-for-collective-cultural-memory-a-critical-comp/", quote: "Alfred Noyes's “The Highwayman” (1906) and Federico García Lorca's “Romance sonámbulo” (1928) ... serve as literary vessels for the collective memory of historical periods." },
    { id: "highwayman-poetics", source: "Poetry Foundation", url: "https://www.poetryfoundation.org/poems/43187/the-highwayman" },
  ],
  criticalViews: [{ citeId: "highwayman-encyclopedia" }, { citeId: "highwayman-memory" }],
  faqs: [
    { q: "What is the meaning of The Highwayman?", plain: "It presents love as courageous sacrifice while showing how betrayal and violence destroy the lovers." },
    { q: "What are the main themes?", plain: "Love, sacrifice, jealousy, betrayal, night and daylight, and the transformation of tragedy into legend." },
    { q: "What kind of poem is it?", plain: "It is a romantic narrative ballad with refrains, dialogue, vivid imagery, and varied galloping rhythms." },
  ],
  cta: "Write with this poem’s rhythm in the editor",
};

import type { PoemAnalysisContent } from "../types";
import { poemOpenSettings } from "../settings";

export const inFlandersFieldsPoem: PoemAnalysisContent = {
  slug: "in-flanders-fields",
  status: "ready",
  poemTitle: "In Flanders Fields",
  author: "John McCrae",
  yearPublished: 1915,
  publicDomainBasis:
    "First published in Punch on December 8, 1915, placing the poem well before the US public-domain cutoff used for this catalog.",
  title: "In Flanders Fields Analysis & Meaning — John McCrae — lyriic",
  description:
    "John McCrae's In Flanders Fields analysis explores its meaning, remembrance, war, poppy imagery, rondeau form, and contested final stanza.",
  h1: "In Flanders Fields analysis",
  intro:
    "This analysis explains the meaning of John McCrae's In Flanders Fields, from its poppy-covered battlefield and speaking dead to its forceful command to the living. Explore its themes, imagery, form, and uneasy legacy.",
  text: `In Flanders fields the poppies blow
Between the crosses, row on row,
That mark our place: and in the sky
The larks, still bravely singing, fly
Scarce heard amid the guns below.

We are the Dead. Short days ago
We lived, felt dawn, saw sunset glow,
Loved and were loved, and now we lie
In Flanders fields.

Take up our quarrel with the foe:
To you from failing hands we throw
The torch; be yours to hold it high.
If ye break faith with us who die
We shall not sleep, though poppies grow
In Flanders fields.`,
  fullTextSource: {
    label: "In Flanders Fields — The Canadian Encyclopedia",
    url: "https://thecanadianencyclopedia.ca/en/article/in-flanders-fields",
    publisher: "The Canadian Encyclopedia",
  },
  editorSettings: poemOpenSettings({ showCounts: true }),
  summary: [
    "The poem begins over the graves of soldiers in Flanders, where poppies bloom among the crosses and larks continue to sing above the artillery. The dead speak collectively, contrasting the ordinary life they had only days earlier with their sudden burial.",
    "The final stanza turns remembrance into an obligation. The dead pass a torch to the living and demand that they continue their quarrel with the foe, making the poem both an elegy and a wartime call to action.",
  ],
  meaning: [
    "The poem's central meaning lies in its tension between natural renewal and human death. Poppies keep blooming and larks keep flying, but the soldiers beneath them are cut off from dawn, love, and ordinary time. The Canadian Encyclopedia connects this poppy imagery to the lasting tradition of the poppy as a remembrance symbol.",
    "The collective voice of “We are the Dead” makes individual loss feel communal, while the details of having “Loved and were loved” keep the dead from becoming abstract symbols. They were people with lives that have been abruptly interrupted.",
    "The final command is deliberately more troubling than a simple request to remember. “Take up our quarrel with the foe” and “If ye break faith” can sound like a demand for continued military sacrifice. The poem therefore preserves grief while also exposing how mourning can be used to authorize further fighting.",
  ],
  themes: [
    {
      theme: "Remembrance and memorial",
      discussion:
        "The crosses, poppies, and repeated place-name create a ritual landscape of memory. The dead ask the living not to let their deaths disappear into the ordinary passage of time.",
    },
    {
      theme: "Nature beside destruction",
      discussion:
        "Poppies and larks suggest continuity and beauty, but the guns interrupt the larks and the flowers grow over graves. Nature does not erase the violence; it makes the contrast more visible.",
    },
    {
      theme: "Duty and sacrifice",
      discussion:
        "The torch is an image of inherited responsibility. By presenting the dead as speakers who assign a task to the living, the poem turns private mourning into a public duty.",
    },
    {
      theme: "The ambiguity of patriotic memory",
      discussion:
        "The first two stanzas are mournful and intimate, while the last stanza presses toward recruitment rhetoric. That shift allows the poem to function both as a memorial and as an argument for continuing the war.",
    },
  ],
  formAndMeter: [
    "The poem is a rondeau: three stanzas built around a repeated refrain, “In Flanders fields.” Its 15-line structure and returning phrase give the poem a ceremonial, song-like shape.",
    "McCrae uses a mostly accentual-syllabic rhythm with strong variation rather than a single regular meter. The opening lines move with a rolling, nearly anapestic pulse, while pauses and shorter phrases slow the dead speakers' account of what has been lost.",
    "The rhyme pattern helps bind the stanzas together, especially through the recurring sounds of “blow” / “row” / “foe” / “throw” and “sky” / “fly” / “die.” The repeated refrain is both formal return and thematic reminder: the scene remains the same even as the poem changes from lament to command.",
  ],
  literaryDevices: [
    {
      device: "Personification",
      example: "We are the Dead.",
      discussion:
        "The dead speak directly to the living as a collective presence. This makes the graves feel rhetorically active and gives remembrance the force of an address rather than a quiet observation.",
    },
    {
      device: "Juxtaposition",
      example: "The larks, still bravely singing, fly / Scarce heard amid the guns below.",
      discussion:
        "The larks' song is placed above the guns and the buried soldiers. Beauty and violence occupy the same landscape, so the natural image cannot be separated from the machinery of war.",
    },
    {
      device: "Symbolism",
      example: "To you from failing hands we throw / The torch;",
      discussion:
        "The torch symbolizes a responsibility handed from the dead to the living. Its light suggests continuity and public purpose, but the command to hold it high also carries the pressure of inherited wartime duty.",
    },
    {
      device: "Refrain",
      example: "In Flanders fields.",
      discussion:
        "The repeated phrase closes the first and third stanzas and stands alone at the end of the second. Each return brings the reader back to the battlefield, preventing the final call to action from floating free of the graves that motivate it.",
    },
  ],
  historicalContext: [
    "John McCrae was a Canadian physician and soldier who served during the Second Battle of Ypres. The Canadian Encyclopedia records that his friend Alexis Helmer was killed on May 2, 1915, and that McCrae conducted the burial service before writing the first lines of the poem.",
    "The poem was published anonymously in Punch on December 8, 1915, and quickly became widely known. The Canadian War Museum describes McCrae composing it after caring for wounded troops and says the poem captured the Allies' belligerent mood and the demand to “keep faith” with the dead.",
    "Its later public life complicated its memorial function. The Poetry Foundation notes that British and Canadian governments used the poem in advertisements for war bonds and recruitment, so its language of remembrance also became part of the machinery of wartime persuasion.",
  ],
  criticalViews: [
    {
      source: "“In Flanders Fields” — Canada's Official Poem: Breaking Faith",
      author: "Studies in Canadian Literature",
      quote:
        "In the first two stanzas, McCrae uses conventional pastoral imagery to disrupt the familiar association between Christian ideals of redemption and renewal with nature, hauntingly capturing the uncertainty and fear that pervaded the collective consciousness of soldiers and civilians alike, both during and after World War I.",
      url: "https://journals.lib.unb.ca/index.php/SCL/article/view/15269",
    },
    {
      source: "“No Case of Petty Right or Wrong”",
      author: "The Poetry Foundation editorial staff",
      quote:
        "The British and Canadian governments used the poem in advertisements to sell war bonds and to encourage recruitment.",
      url: "https://www.poetryfoundation.org/articles/148250/no-case-of-petty-right-or-wrong",
    },
  ],
  faqs: [
    {
      q: "What is the main meaning of In Flanders Fields?",
      plain:
        "The poem remembers soldiers who died in World War I and asks the living to preserve the significance of their sacrifice. Its final stanza also makes that remembrance a demand to continue the fight, which gives the poem its central tension.",
    },
    {
      q: "What do the poppies symbolize in In Flanders Fields?",
      plain:
        "The poppies symbolize remembrance growing over the graves of the dead. Their recurring image connects natural renewal with loss and helped establish the red poppy as an enduring symbol of military remembrance.",
    },
    {
      q: "What are the main themes of In Flanders Fields?",
      plain:
        "The main themes are remembrance, death, nature beside violence, duty, sacrifice, and the uneasy relationship between mourning and patriotic or military obligation.",
    },
    {
      q: "What form does In Flanders Fields use?",
      plain:
        "It is a rondeau, a short fixed form with three stanzas and a recurring refrain. Its rhythm is varied and accentual-syllabic rather than strictly regular, with rhyme and repetition creating its ceremonial musicality.",
    },
  ],
  sources: [
    {
      label: "In Flanders Fields — full poem and history",
      url: "https://thecanadianencyclopedia.ca/en/article/in-flanders-fields",
      publisher: "The Canadian Encyclopedia",
    },
    {
      label: "In Flanders Fields and John McCrae",
      url: "https://www.warmuseum.ca/firstworldwar/history/after-the-war/remembrance/in-flanders-fields-and-john-mccrae/",
      publisher: "Canadian War Museum",
    },
    {
      label: "“In Flanders Fields” — Canada's Official Poem: Breaking Faith",
      url: "https://journals.lib.unb.ca/index.php/SCL/article/view/15269",
      publisher: "Studies in Canadian Literature",
    },
    {
      label: "“No Case of Petty Right or Wrong”",
      url: "https://www.poetryfoundation.org/articles/148250/no-case-of-petty-right-or-wrong",
      publisher: "The Poetry Foundation",
    },
  ],
  cta: "Write with this poem’s rhythm in the editor",
};

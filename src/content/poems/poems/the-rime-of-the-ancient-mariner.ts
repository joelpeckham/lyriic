import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const theRimeOfTheAncientMarinerPoem: PoemAnalysisContent = {
  slug: "the-rime-of-the-ancient-mariner", status: "ready", poemTitle: "The Rime of the Ancient Mariner", author: "Samuel Taylor Coleridge", yearPublished: 1798,
  publicDomainBasis: "First published in Lyrical Ballads in 1798, before the US public-domain cutoff.",
  title: "The Rime of the Ancient Mariner Analysis & Meaning — Samuel Taylor Coleridge — lyriic", description: "The Rime of the Ancient Mariner analysis: guilt, nature, redemption, symbolism, and ballad form.", h1: "The Rime of the Ancient Mariner analysis",
  intro: "Coleridge turns an inexplicable act at sea into a supernatural study of guilt, nature, storytelling, and incomplete redemption.",
  fullTextSource: { label: "The Rime of the Ancyent Marinere (1798)", url: "https://en.wikisource.org/w/index.php?title=The_Rime_of_the_Ancyent_Marinere_%281798%29", publisher: "Wikisource" },
  editorSettings: poemOpenSettings({ showCounts: true }),
  summary: [p("An ancient mariner stops a wedding guest and compels him to hear a sea story. After an albatross appears, the mariner shoots it without explanation, beginning an ordeal of guilt and punishment."), excerpt(`At length did cross an Albatross,
Thorough the Fog it came;
And an it were a Christian Soul,`), p("The long poem is presented through a frame narrative; its archaic diction and repeated formulas preserve the feeling of an oral tale.", ["mariner-criticism"])],
  meaning: [p("The arbitrary shooting resists a simple moral. The mariner is guilty, but the poem’s deeper subject is how a person is thrown into responsibility and loss without understanding the cause.", ["mariner-criticism"]), excerpt(`With my cross-bow
I shot the Albatross.`), p("Blessing living creatures begins penance but does not end it. The mariner remains compelled to retell the story.", ["mariner-nature"])],
  themes: [
    { theme: "Guilt and penance", blocks: [p("The albatross becomes a visible burden and the tale becomes an endless obligation.")] },
    { theme: "Nature and spirituality", blocks: [p("The poem treats harm to nature as both physical violence and spiritual disorder.", ["mariner-nature"])] },
    { theme: "Storytelling", blocks: [p("The mariner’s interruption changes the wedding guest and makes narrative a form of witness.")] },
  ],
  formAndMeter: [p("This is a seven-part supernatural narrative ballad with short stanzas, dialogue, archaic diction, and recurring phrases."), p("It often uses alternating four- and three-stress ballad lines, but varies rhythm and stanza shape extensively.", ["mariner-criticism"])],
  literaryDevices: [
    { device: "Frame narrative", blocks: [excerpt(`He holds him with his glittering eye—
The Wedding-Guest stood still,
And listens like a three years’ child:`), p("The guest gives the reader a character whose response registers the tale’s force.")] },
    { device: "Symbolism", blocks: [excerpt(`The Albatross fell off, and sank
Like lead into the sea.`), p("The bird becomes a symbol of violated life and consequence.")] },
    { device: "Repetition", blocks: [excerpt(`The Ice was here, the Ice was there,
The Ice was all around:`), p("Repetition turns description into incantation and confinement.")] },
  ],
  historicalContext: [p("The poem opened the 1798 edition of Lyrical Ballads, the collaborative volume associated with Coleridge and Wordsworth."), p("The 1798 text differs from later versions, especially the 1817 version with marginal glosses; this page keeps the early edition explicit.", ["mariner-text"])],
  citations: [
    { id: "mariner-text", source: "Wikisource", url: "https://en.wikisource.org/w/index.php?title=The_Rime_of_the_Ancyent_Marinere_%281798%29" },
    { id: "mariner-criticism", source: "Literary Theory and Criticism", author: "Adam Roberts", url: "https://literariness.org/2021/02/16/analysis-of-coleridges-the-rime-of-the-ancient-mariner/", quote: "The remarkable thing about the poem is its analysis of a sense of guilt without a corresponding sense of willful wrongdoing." },
    { id: "mariner-nature", source: "LitCharts", url: "https://www.litcharts.com/lit/rime-of-the-ancient-mariner/themes/the-natural-and-the-spiritual", quote: "The poem ... casts the appreciation and valuing of nature ... as above all a spiritual, religious necessity." },
    { id: "mariner-context", source: "Wikisource", url: "https://en.wikisource.org/w/index.php?title=The_Rime_of_the_Ancyent_Marinere_%281798%29" },
  ],
  criticalViews: [{ citeId: "mariner-criticism" }, { citeId: "mariner-nature" }],
  faqs: [
    { q: "What is the main meaning?", plain: "It examines guilt, responsibility, nature, and the difficult possibility of redemption." },
    { q: "What does the albatross symbolize?", plain: "It represents living nature, violated innocence, and the burden of consequence." },
    { q: "What form does it use?", plain: "It is a seven-part supernatural narrative ballad with irregular ballad rhythms." },
  ],
  cta: "Write with this poem’s ballad rhythm in the editor",
};

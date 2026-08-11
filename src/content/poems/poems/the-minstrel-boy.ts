import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const theMinstrelBoyPoem: PoemAnalysisContent = {
  slug: "the-minstrel-boy", status: "ready", poemTitle: "The Minstrel Boy", author: "Thomas Moore", yearPublished: 1813,
  publicDomainBasis: "Published in 1813 as part of Irish Melodies, before the US public-domain cutoff.",
  title: "The Minstrel Boy Analysis & Meaning — Thomas Moore — lyriic", description: "The Minstrel Boy analysis: harp symbolism, patriotism, sacrifice, freedom, and ballad meter.", h1: "The Minstrel Boy analysis",
  intro: "Moore’s song joins military resistance to cultural resistance, making the harp as important as the sword.",
  fullTextSource: { label: "The Minstrel Boy", url: "https://en.wikisource.org/wiki/The_Minstrel_Boy", publisher: "Wikisource" },
  editorSettings: poemMeterSettings("iambic-tetrameter", { showCounts: true, showStress: true, showMeterBreaks: true, showRhymeScheme: true }),
  summary: [p("A young minstrel goes to war with his father’s sword and his own harp. After he falls, he tears the harp’s strings rather than let the enemy make it sound in slavery."), excerpt(`The Minstrel-Boy to the war is gone,
In the ranks of death you'll find him;
His father's sword he has girded on,`), p("The song presents artistic voice as part of national defense: the sword guards rights while the harp praises the land.", ["minstrel-mingo"])],
  meaning: [p("The harp symbolizes Ireland’s cultural identity, and its destruction is both tragic defeat and an act of agency. The oppressor can defeat the singer without making the instrument serve submission.", ["minstrel-irishmusic"]), excerpt(`The harp he lov'd ne'er spoke again,
For he tore its chords asunder;
And said, "No chains shall sully thee,`), p("The final vow makes freedom the condition of authentic song rather than merely the minstrel’s political objective.", ["minstrel-mingo"])],
  themes: [
    { theme: "Patriotism and sacrifice", blocks: [p("The warrior-bard gives both body and art to a betrayed “Land of song.”")] },
    { theme: "Art and national identity", blocks: [p("The harp carries communal identity alongside the sword.", ["minstrel-irishmusic"])] },
    { theme: "Freedom versus slavery", blocks: [excerpt(`Thy songs were made for the pure and free,
They shall never sound in slavery.`), p("“Never” makes the ending a vow of refusal.")] },
  ],
  formAndMeter: [p("This is a two-stanza narrative song in common-ballad movement, broadly alternating four- and three-stress lines."), p("Loose rhyme, emphatic punctuation, and a sudden dash after “The Minstrel fell!” make the song dramatic and performable.", ["minstrel-mingo"])],
  literaryDevices: [
    { device: "Symbolism", blocks: [excerpt(`And his wild harp slung behind him.`), p("The harp represents Irish music and cultural memory.")] },
    { device: "Antithesis", blocks: [excerpt(`One sword, at least, thy rights shall guard,
One faithful harp shall praise thee!`), p("The parallel sword and harp give military and artistic resistance equal civic dignity.")] },
    { device: "Repetition", blocks: [excerpt(`One sword, at least...
One faithful harp shall praise thee!`), p("Repeated “One” emphasizes loyalty when the wider world has betrayed the country.")] },
  ],
  historicalContext: [p("Moore’s Irish Melodies appeared in the aftermath of the 1798 rebellion and the 1803 uprising associated with Robert Emmet. The song never names Ireland, but its harp and “Land of song” make the national context legible.", ["minstrel-mingo"]), p("Irish Music Daily describes the minstrel as an idealistic patriot rather than an experienced soldier.", ["minstrel-irishmusic"])],
  citations: [
    { id: "minstrel-text", source: "Wikisource", url: "https://en.wikisource.org/wiki/The_Minstrel_Boy" },
    { id: "minstrel-mingo", source: "Michael Mingo’s Blog", url: "https://mgerardmingo.com/2018/06/29/thomas-moores-the-minstrel-boy-an-analysis/", quote: "That the minstrel boy destroys his harp before it falls into enemy hands is tragic, as it signifies a knowing surrender of Irish freedom" },
    { id: "minstrel-irishmusic", source: "Irish Music Daily", url: "https://www.irishmusicdaily.com/minstrel-boy-song-meaning", quote: "The very fact that he is a minstrel alerts us straightaway to the fact that he is not a soldier." },
    { id: "minstrel-context", source: "Michael Mingo’s Blog", url: "https://mgerardmingo.com/2018/06/29/thomas-moores-the-minstrel-boy-an-analysis/" },
  ],
  criticalViews: [{ citeId: "minstrel-mingo" }, { citeId: "minstrel-irishmusic" }],
  faqs: [
    { q: "What is the meaning of The Minstrel Boy?", plain: "It presents artistic freedom and political freedom as inseparable forms of resistance." },
    { q: "What does the harp symbolize?", plain: "The harp symbolizes Ireland’s musical culture and national identity." },
    { q: "What is the form and meter?", plain: "It is a two-stanza narrative song using common-ballad movement and loose rhyme." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

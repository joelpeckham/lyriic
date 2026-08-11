import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const theWasteLandPoem: PoemAnalysisContent = {
  slug: "the-waste-land", status: "ready", poemTitle: "The Waste Land", author: "T. S. Eliot", yearPublished: 1922,
  publicDomainBasis: "Published in 1922 and public domain in the United States.",
  title: "The Waste Land Analysis & Meaning — T. S. Eliot — lyriic",
  description: "The Waste Land analysis and meaning: fragmentation, spiritual drought, memory, allusion, and renewal.",
  h1: "The Waste Land analysis",
  intro: "This analysis reads Eliot’s fractured voices, allusions, and dry landscapes as a modernist search for meaning after cultural crisis.",
  fullTextSource: { label: "The Waste Land", url: "https://gutenberg.org/files/1321/1321-h/1321-h.htm", publisher: "Project Gutenberg" },
  editorSettings: poemOpenSettings({ showCounts: true }),
  summary: [
    p("Part I moves among spring memory, a barren landscape, prophecy, intimacy, and a London crowd rather than following one speaker.", ["waste-yale"]),
    excerpt(`April is the cruellest month, breeding
Lilacs out of the dead land, mixing
Memory and desire,`),
    p("Its fragments connect modern city life to older myths and texts without producing one stable narrative.", ["waste-pf"]),
  ],
  meaning: [
    p("April is cruel because renewal disturbs numbness: memory and desire return to a world that has learned to live with winter.", ["waste-pf"]),
    excerpt(`What are the roots that clutch, what branches grow
Out of this stony rubbish?
Son of man,`),
    p("Dust, dry roots, and broken images turn spiritual exhaustion into physical landscape; water and speech remain possible but fractured.", ["waste-yale"]),
  ],
  themes: [
    { theme: "Cultural fragmentation", blocks: [p("Languages, voices, and quotations collide, making the poem’s form resemble the crisis it describes.", ["waste-yale"])] },
    { theme: "Death and failed renewal", blocks: [excerpt(`I will show you fear in a handful of dust.`), p("Growth and burial repeatedly appear together, so regeneration is uncertain rather than automatic.")] },
    { theme: "Urban alienation", blocks: [p("The London crowd is physically together but emotionally isolated, moving with lowered eyes and private sighs.", ["waste-pf"])] },
  ],
  formAndMeter: [
    p("The five-part poem combines lyric, dialogue, monologue, song, prophecy, quotation, and notes rather than one meter.", ["waste-yale"]),
    p("Allusion, multilingual quotation, changing line lengths, and collage create local patterns inside a deliberately unstable whole.", ["waste-pf"]),
  ],
  literaryDevices: [
    { device: "Paradox", blocks: [excerpt(`Winter kept us warm,
covering
Earth in forgetful snow,`), p("Forgetfulness becomes shelter while spring becomes painful remembrance.")] },
    { device: "Allusion", blocks: [excerpt(`I had not thought death had undone so many.`), p("The London crowd is seen through Dante, enlarging modern alienation through an older vision of the dead.")] },
    { device: "Imagery", blocks: [excerpt(`I will show you fear in a handful of dust.`), p("Dust joins mortality, burial, and barren land in one compact image.")] },
  ],
  historicalContext: [
    p("The poem was published in 1922 and quickly became associated with postwar disillusionment, though Eliot resisted reducing it to one generation’s feeling.", ["waste-yale"]),
    p("Its notes identify From Ritual to Romance and The Golden Bough as important sources, making the poem’s method of inherited fragments explicit.", ["waste-text"]),
  ],
  citations: [
    { id: "waste-text", source: "Project Gutenberg", url: "https://gutenberg.org/files/1321/1321-h/1321-h.htm" },
    { id: "waste-yale", source: "Yale Modernism Lab", url: "https://campuspress.yale.edu/modernismlab/the-waste-land/", quote: "The Waste Land made use of allusion, quotation (in several languages), a variety of verse forms, and a collage of poetic fragments to create the sense of speaking for an entire culture in crisis." },
    { id: "waste-pf", source: "Poetry Foundation", url: "https://www.poetryfoundation.org/articles/158847/ts-eliot-the-waste-land", quote: "Fragmentation is not only a feature of the setting, plot, and theme of The Waste Land but also, crucially, its defining formal feature." },
    { id: "waste-britannica", source: "Britannica", url: "https://www.britannica.com/topic/The-Waste-Land", quote: "It explores themes of disillusionment, disgust, the breakdown of relationships, and spiritual emptiness after World War I." },
  ],
  criticalViews: [{ citeId: "waste-yale" }, { citeId: "waste-pf" }],
  faqs: [
    { q: "What is the main meaning?", plain: "The poem presents spiritual exhaustion and cultural fracture while searching among inherited stories for renewal." },
    { q: "Why is April cruel?", plain: "Spring forces memory and desire back into a world that found comfort in winter’s forgetfulness." },
    { q: "What kind of poem is it?", plain: "A five-part modernist collage of voices, allusions, quotations, and shifting forms." },
  ],
  cta: "Write with this poem’s open form in the editor",
};

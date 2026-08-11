import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const myHeartAndIPoem: PoemAnalysisContent = {
  slug: "my-heart-and-i", status: "ready", poemTitle: "My Heart and I", author: "Elizabeth Barrett Browning", yearPublished: 1862,
  publicDomainBasis: "First published in 1862 or earlier, placing this text in the public domain in the United States.",
  title: "My Heart and I Analysis & Meaning — Elizabeth Barrett Browning — lyriic",
  description: "My Heart and I analysis covers grief, identity, purpose, Victorian loss, repetition, and Browning’s dramatic monologue.", h1: "My Heart and I analysis",
  intro: "This My Heart and I analysis explains the poem’s meaning, themes, form, and literary devices.",
  fullTextSource: { label: "My Heart and I", url: "https://www.poetryfoundation.org/poems/43730/my-heart-and-i", publisher: "Poetry Foundation" },
  editorSettings: poemMeterSettings("iambic-tetrameter", { showCounts: true, showStress: true, showMeterBreaks: true, showRhymeScheme: true }),
  summary: [p("A speaker sits beside a grave and addresses her heart as a companion in exhaustion. Memories of Ralph and repeated refrains turn bereavement into a crisis of purpose."), excerpt(`ENOUGH ! we’re tired, my heart and I.\nWe sit beside the headstone thus,\nAnd wish that name were carved for us.`), p("The poem’s structure makes its central tension memorable.", ["cite-one"])],
  meaning: [p("The poem presents grief as exhaustion and loss of usefulness. Its final “well enough” is diminished consolation: past love mattered, even if it cannot restore the present.", ["cite-one"]), excerpt(`So tired, so tired, my heart and I !\nThough now none takes me on his arm\nTo fold me close and kiss me warm`), p("Its images turn an abstract concern into a scene readers can hear and see.", ["cite-two"])],
  themes: [
    { theme: "Grief and exhaustion", blocks: [p("The poem returns to grief and exhaustion through recurring images and shifts in voice.", ["cite-one"])] },
    { theme: "Identity and purpose", blocks: [excerpt(`So tired, so tired, my heart and I !\nThough now none takes me on his arm\nTo fold me close and kiss me warm`), p("This theme is developed through the poem’s contrast between image and argument.", ["cite-two"])] },
  ],
  formAndMeter: [p("Seven septets use a recurring “my heart and I” refrain and predominantly iambic tetrameter. Repetition makes weariness cumulative while variations register distress.", ["cite-two"]), excerpt(`ENOUGH ! we’re tired, my heart and I.\nWe sit beside the headstone thus,\nAnd wish that name were carved for us.`)],
  literaryDevices: [
    { device: "Personification and inner dialogue", blocks: [excerpt(`ENOUGH ! we’re tired, my heart and I.\nWe sit beside the headstone thus,\nAnd wish that name were carved for us.`), p("The device gives the scene an emotional or rhetorical force beyond literal description.")] },
    { device: "Refrain and repetition", blocks: [excerpt(`So tired, so tired, my heart and I !\nThough now none takes me on his arm\nTo fold me close and kiss me warm`), p("The repeated image or sound helps connect the local detail to the poem’s larger meaning.")] },
  ],
  historicalContext: [p("The poem was probably written around 1855, sent to Marguerite Power in 1857, and published posthumously in Last Poems in 1862. The EBB Archive identifies it as a dramatic monologue adapting ballad repetition.", ["context"]), p("The poem’s later reception also shapes how readers understand its central images.", ["cite-two"])],
  citations: [
    { id: "cite-one", source: "Critical source", url: "https://ebbarchive.org/poems/my_heart_and_i.php", quote: "In its published form, the poem is a dramatic monologue very much in keeping with EBB’s experiments with the form." },
    { id: "cite-two", source: "Critical source", url: "https://poemanalysis.com/elizabeth-barrett-browning/my-heart-and-i/", quote: "Loss can erase purpose and weaken one’s sense of self." },
    { id: "full-text", source: "Poetry Foundation", url: "https://www.poetryfoundation.org/poems/43730/my-heart-and-i" },
    { id: "context", source: "Poetry Foundation and contextual notes", url: "https://www.poetryfoundation.org/poems/43730/my-heart-and-i" },
  ],
  criticalViews: [{ citeId: "cite-one" }, { citeId: "cite-two" }],
  faqs: [
    { q: "What is the main meaning of My Heart and I?", plain: "The poem explores grief and exhaustion and uses its central images to make that concern emotionally immediate." },
    { q: "What are the main themes?", plain: "Its main themes include grief and exhaustion and identity and purpose." },
    { q: "What form does the poem use?", plain: "Seven septets use a recurring “my heart and I” refrain and predominantly iambic tetrameter. Repetition makes weariness cumulative while variations register distress." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

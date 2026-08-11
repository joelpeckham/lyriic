import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const theChargeOfTheLightBrigadePoem: PoemAnalysisContent = {
  slug: "the-charge-of-the-light-brigade",
  status: "ready",
  poemTitle: "The Charge of the Light Brigade",
  author: "Alfred, Lord Tennyson",
  yearPublished: 1854,
  publicDomainBasis: "First published in The Examiner on December 9, 1854, before the US public-domain cutoff.",
  title: "The Charge of the Light Brigade Analysis & Meaning — Alfred, Lord Tennyson — lyriic",
  description: "The Charge of the Light Brigade analysis of duty, military error, sacrifice, galloping rhythm, and remembrance.",
  h1: "The Charge of the Light Brigade analysis",
  intro: "This analysis explains how Tennyson makes a disastrous Crimean War charge into a ballad of courage, obedience, error, and memory.",
  fullTextSource: { label: "The Charge of the Light Brigade", url: "https://en.wikisource.org/wiki/The_Charge_of_the_Light_Brigade_(Tennyson)", publisher: "Wikisource" },
  editorSettings: poemOpenSettings({ showCounts: true, showRulers: false }),
  summary: [
    p("The poem narrates the brigade’s advance into artillery fire, its sabre attack, and the reduced group returning through the same danger."),
    excerpt(`Half a league, half a league,
Half a league onward,
All in the valley of Death`),
    p("Tennyson praises the soldiers while keeping the command’s mistake visible. The final imperative turns the charge into public memory.", ["charge-perry"]),
  ],
  meaning: [
    p("The central tension is between obedience and judgment. The soldiers act despite knowing that someone has blundered, while the poem leaves responsibility for the disaster in view."),
    excerpt(`Their’s not to make reply,
Their’s not to reason why,
Their’s but to do and die:`),
    p("The valley, jaws, and mouth of Hell make the route mythic without erasing bodily loss. The ending honors courage, not the wisdom of the order.", ["charge-perry"]),
  ],
  themes: [
    { theme: "Duty and obedience", blocks: [p("The poem separates command from action: soldiers obey even when judgment has failed. That division honors discipline while exposing its danger.")] },
    { theme: "Courage and sacrifice", blocks: [excerpt(`While horse and hero fell,
They that had fought so well`), p("Praise is directed at the soldiers’ conduct and endurance rather than the decision that sent them into the valley.")] },
    { theme: "Remembrance", blocks: [p("Refrains and repeated numbers turn one battle into communal memory, while “Left of six hundred” makes the cost audible.", ["charge-perry"])] },
  ],
  formAndMeter: [
    p("This six-stanza narrative ballad uses short, heavily stressed lines, repeated phrases, and a strongly dactylic, often dactylic-dimeter movement."),
    p("The recurring rhymes—hundred, blunder’d, thunder’d, wonder’d, sunder’d—create compulsive motion, while the changed refrain records depletion.", ["charge-guardian"]),
  ],
  literaryDevices: [
    { device: "Repetition", blocks: [excerpt(`Rode the six hundred.`), p("The refrain gives the charge ceremonial momentum; later “Left of six hundred” repeats the sound while changing its meaning.")] },
    { device: "Auditory imagery", blocks: [excerpt(`Cannon to right of them,
Cannon to left of them,
Cannon in front of them`), p("Symmetrical repetition verbally surrounds the riders, while “volley’d” and “thunder’d” make the artillery audible.")] },
    { device: "Understatement", blocks: [excerpt(`Some one had blunder’d.`), p("The vague subject and restrained verb place a small phrase beside enormous loss, avoiding a simple assignment of blame.")] },
  ],
  historicalContext: [
    p("The poem responds to the Charge of the Light Brigade at Balaklava on October 25, 1854. A misunderstanding sent cavalry toward Russian artillery; Tennyson published the poem in The Examiner on December 9.", ["charge-perry"]),
    p("Seamus Perry describes the poem as suspended between admiration for the charge’s magnificence and conviction of its idiocy.", ["charge-perry"]),
  ],
  citations: [
    { id: "charge-text", source: "Wikisource", url: "https://en.wikisource.org/wiki/The_Charge_of_the_Light_Brigade_(Tennyson)" },
    { id: "charge-perry", source: "Victorian Poetry and Poetics", author: "Seamus Perry", quote: "Tennyson is suspended between admiration at the reckless magnificence of the charge and a conviction of its idiocy.", url: "https://odp.library.tamu.edu/victorianpoetry/chapter/seamus-perry-the-charge-of-the-light-brigade-making-poetry-from-war/" },
    { id: "charge-guardian", source: "The Guardian", quote: "Not a protest, but in no way a celebration of a disastrous historical event, it remains a compelling dramatisation of battle", url: "https://www.theguardian.com/books/booksblog/2014/jan/20/poem-of-the-week-charge-light-brigade-tennyson" },
    { id: "charge-context", source: "Victorian Poetry and Poetics", url: "https://odp.library.tamu.edu/victorianpoetry/chapter/the-charge-of-the-light-brigade-1854/" },
  ],
  criticalViews: [{ citeId: "charge-perry" }, { citeId: "charge-guardian" }],
  faqs: [
    { q: "What is the meaning?", plain: "The poem honors courage and obedience during a disastrous charge without hiding the military error." },
    { q: "What are the themes?", plain: "Duty, courage, sacrifice, military error, and remembrance." },
    { q: "What is the meter?", plain: "It is a short-line ballad with strongly dactylic, galloping rhythm and repeated rhymes." },
  ],
  cta: "Write with this poem’s galloping rhythm in the editor",
};

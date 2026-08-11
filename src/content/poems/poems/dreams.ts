import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";
export const dreamsPoem: PoemAnalysisContent = {
 slug:"dreams",status:"ready",poemTitle:"Dreams",author:"Langston Hughes",yearPublished:1922,publicDomainBasis:"Documented as a 1922 work, before the US public-domain cutoff.",title:"Dreams Analysis & Meaning — Langston Hughes — lyriic",description:"Analysis of Hughes’s Dreams: hope, aspiration, metaphor, and compact form.",h1:"Dreams analysis",intro:"Hughes presents dreams as necessary for life’s movement, purpose, and possibility.",fullTextSource:{label:"Dreams",url:"https://poets.org/poem/dreams",publisher:"Academy of American Poets"},editorSettings:poemOpenSettings({showCounts:true}),
 summary:[p("The speaker commands readers to hold fast to dreams. Without them, life is first injured and unable to fly, then barren and frozen."),excerpt(`Hold fast to dreams
For if dreams die
Life is a broken-winged bird`),p("The second stanza intensifies the warning by replacing impaired movement with sterility.")],
 meaning:[p("Dreams can mean hopes, aspirations, or communal possibility. Hughes does not treat them as decoration; they sustain movement and growth."),excerpt(`For when dreams go
Life is a barren field
Frozen with snow.`),p("The shift from “if” to “when” makes loss feel both avoidable and inevitable.",["hughes-dreams-analysis"])],
 themes:[{theme:"Hope and aspiration",blocks:[p("The repeated imperative makes hope an active practice rather than passive wishing.")]},{theme:"Loss and sterility",blocks:[excerpt(`Life is a broken-winged bird
That cannot fly.`),p("The injured bird turns dreamlessness into lost freedom.")]},{theme:"Possibility",blocks:[p("The barren field shows that without dreams, growth and future action become impossible.")]}],
 formAndMeter:[p("Two compact quatrains repeat the opening command. Short, varied lines create plainspoken urgency."),p("ABCB-like echoes, especially “die”/“fly,” provide musical cohesion without elaborate rhyme.")],
 literaryDevices:[{device:"Metaphor",blocks:[excerpt(`Life is a broken-winged bird
That cannot fly.`),p("An abstract loss becomes physical incapacity.")]},{device:"Extended imagery",blocks:[excerpt(`Life is a barren field
Frozen with snow.`),p("Barren ground and cold suggest sterility and stillness.")]},{device:"Repetition",blocks:[excerpt(`Hold fast to dreams
...
Hold fast to dreams`),p("The refrain keeps the central instruction foregrounded.")]}],
 historicalContext:[p("The poem is commonly dated 1922; related publication evidence places it in The World Tomorrow in 1923.",["hughes-dreams-history"]),p("Hughes’s place in the Harlem Renaissance makes the preservation of dreams legible both as individual aspiration and collective hope.",["hughes-dreams-analysis"])],
 citations:[{id:"poem-text-hughes",source:"Academy of American Poets",url:"https://poets.org/poem/dreams"},{id:"hughes-dreams-analysis",source:"LitCharts",quote:"The speaker compares life after the loss of dreams to “a broken-winged bird / That cannot fly” and “a barren field / Frozen with snow.”",url:"https://www.litcharts.com/poetry/langston-hughes/dreams"},{id:"hughes-dreams-history",source:"Study.com",quote:"‘Dreams’ by Langston Hughes is a short poem of 8 lines",url:"https://study.com/academy/lesson/dreams-by-langston-hughes-summary-analysis.html"},{id:"hughes-dreams-form",source:"Poem Analysis",url:"https://poemanalysis.com/langston-hughes/dreams/"}],
 criticalViews:[{citeId:"hughes-dreams-analysis"},{citeId:"hughes-dreams-history"}],faqs:[{q:"What is the meaning?",plain:"Dreams sustain purpose, movement, hope, and the possibility of growth."},{q:"What are the themes?",plain:"Hope, aspiration, loss, freedom, and emotional barrenness."},{q:"What is the form?",plain:"Two quatrains with short lines, repetition, and loose ABCB echoes."}],cta:"Write with this poem’s rhythm in the editor",
};

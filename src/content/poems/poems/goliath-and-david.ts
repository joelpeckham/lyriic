import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const goliathAndDavidPoem: PoemAnalysisContent = {
  slug: "goliath-and-david", status: "ready", poemTitle: "Goliath and David", author: "Robert Graves", yearPublished: 1916,
  publicDomainBasis: "First published in 1916, before the US public-domain cutoff.",
  title: "Goliath and David Analysis & Meaning — Robert Graves — lyriic",
  description: "Analysis of Graves’s war poem: biblical reversal, unequal power, faith, grief, and form.",
  h1: "Goliath and David analysis", intro: "Graves turns the biblical victory into a grim First World War parable; this analysis follows its reversal and war imagery.",
  fullTextSource: { label: "The Muse in Arms — full poem", url: "https://en.wikisource.org/wiki/The_Muse_in_Arms/In_Memoriam", publisher: "Wikisource" },
  editorSettings: poemOpenSettings({ showCounts: true }),
  summary: [
    p("Graves retells David and Goliath but announces that the familiar historian “Had not the heart to tell it right.”", ["graves-goliath-analysis"]),
    excerpt(`But the historian of that fight
Had not the heart to tell it right.`),
    p("David’s sling and staff fail against shield and steel; Goliath survives and stands over the dead boy.", ["graves-goliath-text"]),
  ],
  meaning: [
    p("The reversal challenges the comforting underdog myth: courage cannot cancel superior material force in modern combat.", ["graves-goliath-analysis"]),
    excerpt(`(God's eyes are dim, His ears are shut.)
One cruel backhand sabre-cut—`),
    p("The parenthesis makes the failure theological as well as military, while the dedication turns the rewritten legend into a memorial.", ["graves-goliath-dedication"]),
  ],
  themes: [
    { theme: "Failure of heroic myth", blocks: [p("The expected miracle is replaced by a blunt account of defeat.")] },
    { theme: "Unequal power", blocks: [p("Pebble and wood are opposed to shield, armor, and steel.", ["graves-goliath-analysis"])] },
    { theme: "Faith and divine silence", blocks: [p("David trusts that God will save him, but the poem depicts no intervention.")] },
    { theme: "Grief and remembrance", blocks: [p("The dedication identifies the poem with David Cuthbert Thomas, killed at Fricourt in March 1916.", ["graves-goliath-dedication"])] },
  ],
  formAndMeter: [
    p("The poem has a twelve-line opening stanza and a thirty-four-line battle stanza, mostly organized in rhyming couplets.", ["graves-goliath-analysis"]),
    p("The brisk couplets accommodate narrative action, while interruptions such as “Then ... but” fracture the traditional tale at the moment of reversal."),
  ],
  literaryDevices: [
    { device: "Biblical inversion", blocks: [excerpt(`ONCE an earlier David took
Smooth pebbles from the brook:`), p("The reversed title and altered outcome keep the biblical story present while denying its familiar moral.")] },
    { device: "Onomatopoeia", blocks: [excerpt(`Goliath's shield parries each cast.
Clang! clang! and clang! was David's last.`), p("Metallic repetition makes the failed attack audible.")] },
    { device: "Simile", blocks: [excerpt(`The pebble, humming from the sling
Like a wild bee, flies a sure line`), p("The lively simile emphasizes the pebble’s smallness against the giant’s equipment.")] },
  ],
  historicalContext: [
    p("The poem is dedicated “For D. C. T., killed at Fricourt, March 1916”; the GMU notes identify David Cuthbert Thomas as Graves’s friend and fellow Royal Welch Fusilier.", ["graves-goliath-dedication"]),
    p("The spike-helmeted giant brings the biblical encounter into the First World War and its German military imagery.", ["graves-goliath-text"]),
  ],
  citations: [
    { id: "graves-goliath-text", source: "Wikisource", url: "https://en.wikisource.org/wiki/The_Muse_in_Arms/In_Memoriam" },
    { id: "graves-goliath-analysis", source: "Poem Analysis", quote: "Graves has chosen to format this piece with a rhyme scheme of aabbccdd", url: "https://poemanalysis.com/robert-graves/goliath-and-david/" },
    { id: "graves-goliath-dedication", source: "George Mason University", quote: "This poem is dedicated to David Cuthbert Thomas, a lieutenant in the First Battalion of the Royal Welch Fusiliers", url: "https://mason.gmu.edu/~rnanian/Graves-GoliathandDavid.html" },
    { id: "graves-goliath-review", source: "Robert Graves Review", quote: "Like Wilfred Owen’s ‘Parable of the Old Man and the Young’ (1918), it generalizes the death of Thomas to illustrate a larger truth", url: "https://robertgravesreview.org/essay/378" },
  ],
  criticalViews: [{ citeId: "graves-goliath-analysis" }, { citeId: "graves-goliath-review" }],
  faqs: [
    { q: "What is the poem’s meaning?", plain: "It reverses the biblical victory to show how courage and faith can fail against overwhelming force." },
    { q: "What are its themes?", plain: "Heroic myth, unequal power, divine silence, war, grief, and remembrance." },
    { q: "What form does it use?", plain: "A two-stanza narrative built mainly from rhyming couplets, with varied meter and abrupt sound effects." },
  ],
  cta: "Write with this poem’s rhythm in the editor",
};

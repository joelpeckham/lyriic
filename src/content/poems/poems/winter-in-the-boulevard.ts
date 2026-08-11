import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const winterInTheBoulevardPoem: PoemAnalysisContent = {
  slug: "winter-in-the-boulevard",
  status: "ready",
  poemTitle: "Winter in the Boulevard",
  author: "D. H. Lawrence",
  yearPublished: 1918,
  publicDomainBasis: "The poem appears in New Poems, published in 1916/1918-era editions; it is public domain in the United States.",
  title: "Winter in the Boulevard Analysis & Meaning — D. H. Lawrence — lyriic",
  description: "Winter in the Boulevard analysis explores Lawrence’s frost-bound cityscape, nature, vulnerability, silence, and uncertain judgment.",
  h1: "Winter in the Boulevard analysis",
  intro: "This analysis explains how Lawrence turns a frozen city street into a scene of exposure, thought, and uncertain judgment.",
  fullTextSource: { label: "New Poems by D. H. Lawrence", url: "https://www.gutenberg.org/files/22726/22726-h/22726-h.htm", publisher: "Project Gutenberg" },
  editorSettings: poemOpenSettings({ showCounts: true }),
  summary: [
    p("The poem observes frost settling over a boulevard, stripping leaves from trees and turning a familiar urban scene into a stark winter tableau.", ["lawrence-poem-analysis"]),
    excerpt(`THE frost has settled down upon the trees
And ruthlessly strangled off the fantasies
Of leaves that have gone unnoticed, swept like old`),
    p("The speaker first sees loss and exposure, then notices sparrows huddled in the branches. In the final stanza, the landscape waits beneath a thinking sky for an unexplained sentence.", ["lawrence-bartleby"]),
  ],
  meaning: [
    p("Lawrence makes winter more than a change in weather. Frost silences the trees’ “summery wordage,” while the boulevard becomes a place where nature is exposed and compelled to endure.", ["lawrence-poem-analysis"]),
    excerpt(`The trees down the boulevard stand naked in thought,
Their abundant summery wordage silenced, caught
In the grim undertow;`),
    p("The ending leaves judgment unresolved. Trees, birds, and earth are “arrested” and waiting, so the poem’s meaning lies partly in suspended uncertainty: the world is alive, but its fate appears beyond it.", ["lawrence-poem-analysis"]),
  ],
  themes: [
    { theme: "Nature in the city", blocks: [p("The boulevard is urban, but the poem gives nearly all its attention to trees, birds, earth, air, and sky. Natural life, rather than human activity, controls the scene.", ["lawrence-poem-analysis"])] },
    { theme: "Exposure and vulnerability", blocks: [excerpt(`naked the trees confront
Implacable winter's long, cross-questioning brunt.`), p("The trees are exposed after their leaves are stripped away, and the sparrows huddle for warmth. Winter reveals how little protection living things have against the season.", ["lawrence-poem-analysis"])] },
    { theme: "Silence and thought", blocks: [p("The trees’ former “wordage” is silenced, while the sky and air are described through mental language. The quiet landscape becomes a theater of thought without speech.", ["lawrence-bartleby"])] },
    { theme: "Uncertain judgment", blocks: [excerpt(`Trees, birds, and earth, arrested in the after-thought
Awaiting the sentence out from the welkin brought.`), p("Words such as “cross-questioning,” “arrested,” and “sentence” make winter resemble an interrogation or trial. The judge and verdict remain unidentified.", ["lawrence-poem-analysis"])] },
  ],
  formAndMeter: [
    p("The poem is arranged in four quatrains. Its long lines and dense syntax create a measured observational movement, but it does not sustain a fixed metrical pattern.", ["lawrence-poem-analysis"]),
    p("Strong paired sounds and internal echoes matter more than a strict end-rhyme scheme. The loose structure suits the poem’s shifting, unsettled perception.", ["lawrence-bartleby"]),
  ],
  literaryDevices: [
    { device: "Personification", blocks: [excerpt(`The frost has settled down upon the trees
And ruthlessly strangled off the fantasies`), p("Frost is given deliberate violence, while leaves are given “fantasies.” Seasonal change feels like an act of intention rather than a neutral process.", ["lawrence-poem-analysis"])] },
    { device: "Extended metaphor", blocks: [excerpt(`naked the trees confront
Implacable winter's long, cross-questioning brunt.`), p("Winter is framed as an interrogator and the stripped trees as subjects forced to face its questions. Legal language turns weather into a test of endurance.", ["lawrence-poem-analysis"])] },
    { device: "Simile and visual reversal", blocks: [excerpt(`It is only the sparrows, like dead black leaves on the sprigs,
Sitting huddled against the cerulean, one flesh with their perch.`), p("The sparrows resemble the leaves winter has removed, so living birds initially appear as remnants of death. The image captures vulnerability and persistence.", ["lawrence-poem-analysis"])] },
    { device: "Alliteration and semantic echo", blocks: [excerpt(`The clear, cold sky coldly bethinks itself.`), p("Repeated c sounds make the line feel chilled and deliberate, joining physical temperature to the sky’s imagined detachment.", ["lawrence-poem-analysis"])] },
  ],
  historicalContext: [
    p("The poem was published in New Poems during Lawrence’s early twentieth-century period. Its boulevard is notably free of human figures, leaving an urban environment to be read through trees, birds, and weather.", ["lawrence-gutenberg"]),
    p("The older word “welkin” means the sky or heavens. Its elevated register makes an ordinary winter scene feel cosmic and potentially theological.", ["lawrence-poem-analysis"]),
  ],
  citations: [
    { id: "lawrence-gutenberg", source: "Project Gutenberg", url: "https://www.gutenberg.org/files/22726/22726-h/22726-h.htm" },
    { id: "lawrence-poem-analysis", source: "Poem Analysis", url: "https://poemanalysis.com/d-h-lawrence/winter-in-the-boulevard/", quote: "The poem concludes with the speaker stating that all life on earth is at the mercy of the “welkin,” or sky and heavens." },
    { id: "lawrence-bartleby", source: "Bartleby", url: "https://www.bartleby.com/lit-hub/new-poems/27-winter-in-the-boulevard", quote: "THE FROST has settled down upon the trees" },
    { id: "lawrence-american-literature", source: "American Literature", url: "https://americanliterature.com/author/d-h-lawrence/poem/winter-in-the-boulevard" },
  ],
  criticalViews: [{ citeId: "lawrence-poem-analysis" }, { citeId: "lawrence-bartleby" }],
  faqs: [
    { q: "What is the main meaning of “Winter in the Boulevard”?", plain: "The poem presents winter as a force that strips, silences, and tests the living world. Its final image leaves the landscape waiting for an uncertain verdict." },
    { q: "What are the main themes?", plain: "The main themes are nature in an urban setting, vulnerability, silence, and judgment." },
    { q: "What is the form and meter?", plain: "It has four quatrains and long, irregular lines. Recurring sound patterns and loose rhyme replace one fixed meter." },
    { q: "What does “welkin” mean?", plain: "“Welkin” is an archaic word for the sky or heavens. Here it makes the winter sky seem like a higher power that may deliver a sentence." },
  ],
  cta: "Write with this poem’s open form in the editor",
};

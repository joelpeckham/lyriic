import type { PoemAnalysisContent } from "../types";
import { poemMeterSettings } from "../settings";

export const allTheWorldsAStagePoem: PoemAnalysisContent = {
  slug: "all-the-worlds-a-stage",
  status: "ready",
  poemTitle: "All the World's a Stage",
  author: "William Shakespeare",
  yearPublished: 1623,
  publicDomainBasis:
    "The speech appears in As You Like It, first published in the 1623 First Folio; Shakespeare died in 1616, so the work is public domain in the United States.",
  title:
    "All the World's a Stage Analysis & Meaning — William Shakespeare — lyriic",
  description:
    "An analysis of Shakespeare's All the World's a Stage: meaning, seven ages, themes, imagery, form, and the speech's view of human life.",
  h1: "All the World's a Stage analysis",
  intro:
    "Shakespeare's “All the World's a Stage” speech turns human life into a seven-part performance. This analysis explains its meaning, dark humor, themes, imagery, and dramatic form.",
  text: `All the world's a stage,
And all the men and women merely players;
They have their exits and their entrances,
And one man in his time plays many parts,
His acts being seven ages. At first, the infant,
Mewling and puking in the nurse's arms.
Then the whining schoolboy, with his satchel
And shining morning face, creeping like snail
Unwillingly to school. And then the lover,
Sighing like furnace, with a woeful ballad
Made to his mistress' eyebrow. Then a soldier,
Full of strange oaths and bearded like the pard,
Jealous in honor, sudden and quick in quarrel,
Seeking the bubble reputation
Even in the cannon's mouth. And then the justice,
In fair round belly with good capon lined,
With eyes severe and beard of formal cut,
Full of wise saws and modern instances;
And so he plays his part. The sixth age shifts
Into the lean and slippered pantaloon,
With spectacles on nose and pouch on side,
His youthful hose, well saved, a world too wide
For his shrunk shank, and his big manly voice,
Turning again toward childish treble, pipes
And whistles in his sound. Last scene of all,
That ends this strange eventful history,
Is second childishness and mere oblivion,
Sans teeth, sans eyes, sans taste, sans everything.`,
  fullTextSource: {
    label: "As You Like It, Act II, Scene VII — Academy of American Poets",
    url: "https://poets.org/poem/you-it-act-ii-scene-vii-all-worlds-stage",
    publisher: "Academy of American Poets",
  },
  editorSettings: poemMeterSettings("iambic-pentameter", {
    showCounts: true,
    showStress: true,
    showMeterBreaks: true,
    showRhymeScheme: false,
  }),
  summary: [
    "Jaques answers Duke Senior's image of the world as a “wide and universal theater” by comparing every person to an actor. Each person enters, performs several roles, and eventually exits.",
    "The speech divides a man's life into seven ages: infant, schoolboy, lover, soldier, justice, old age, and a final state of dependence and oblivion. Its comic snapshots gradually darken into a stark account of bodily decline.",
  ],
  meaning: [
    "The central metaphor suggests that identity is changeable and partly performative. People do not keep one stable role: they move through social expectations, from the schoolboy's reluctance and the lover's exaggerated devotion to the soldier's pursuit of reputation and the justice's authority.",
    "Jaques's account is not a neutral biological timetable. The RSC notes that he uses the Duke's theater image as the starting point for a description of life from birth to death, while the speech's images expose vanity and fragility. Its final “sans” sequence strips away the senses and social roles that have defined the earlier ages.",
    "The speech's bleakness also reflects its speaker. Jaques is a melancholy observer, and his neat seven-act structure makes life seem predetermined. Yet the theatrical metaphor leaves room to question him: a role can be performed, changed, or mocked, so the speech is a perspective on life rather than an unquestionable law.",
  ],
  themes: [
    {
      theme: "Aging and mortality",
      discussion:
        "The movement from birth to “mere oblivion” makes time the speech's governing force. The final age reverses the beginning: dependence returns, but the loss of teeth, sight, taste, and everything else makes the reversal terrifying rather than comforting.",
    },
    {
      theme: "Performance and identity",
      discussion:
        "The stage metaphor presents social identity as a sequence of roles. The lover, soldier, and justice are recognizable types whose clothes, speech, habits, and ambitions make them legible to an audience.",
    },
    {
      theme: "Vanity and reputation",
      discussion:
        "The soldier seeks “the bubble reputation / Even in the cannon's mouth.” Calling reputation a bubble makes honor look brilliant but fragile, while the dangerous setting shows how much people may risk for an image that can disappear.",
    },
    {
      theme: "The limits of Jaques's worldview",
      discussion:
        "Jaques compresses varied lives into a fixed sequence of comic types. That clarity gives the speech its force, but it also reveals his habit of turning other people into objects of observation and judgment.",
    },
  ],
  formAndMeter: [
    "This is a dramatic monologue in blank verse: unrhymed iambic pentameter shaped for speech onstage. The passage comes from Act II, Scene VII of As You Like It and is spoken by Jaques to Duke Senior and the others.",
    "The underlying five-beat rhythm is flexible. The RSC observes that Shakespeare mixes regular iambic pentameter with feminine endings and longer lines as Jaques expands the seven ages, allowing the meter to follow his quick, accumulating thought.",
    "The speech is organized as a compressed seven-act plot. Stage vocabulary such as “players,” “parts,” “acts,” “scene,” and “history” gives the life-cycle a theatrical structure, while the final clipped repetitions create a falling, depleted cadence.",
  ],
  literaryDevices: [
    {
      device: "Extended metaphor",
      example: "All the world's a stage, / And all the men and women merely players;",
      discussion:
        "The opening comparison governs the whole speech. Entrances and exits become birth and death, while the seven ages become successive roles in one person's life.",
    },
    {
      device: "Simile",
      example: "And shining morning face, creeping like snail / Unwillingly to school.",
      discussion:
        "The snail simile makes the schoolboy's reluctance physical and comic. His bright appearance contrasts with the slow, unwilling movement underneath it.",
    },
    {
      device: "Metaphor and personification",
      example: "Seeking the bubble reputation / Even in the cannon's mouth.",
      discussion:
        "Reputation is imagined as a bubble: visible and attractive, but easily burst. The cannon's “mouth” personifies the weapon and places the soldier's vanity beside mortal danger.",
    },
    {
      device: "Anaphora and repetition",
      example: "Sans teeth, sans eyes, sans taste, sans everything.",
      discussion:
        "The repeated French word sans (“without”) removes one human capacity at a time. The accumulation ends not with a partial loss but with total negation.",
    },
  ],
  historicalContext: [
    "As You Like It was written and performed around 1598–1600 and first published in the First Folio in 1623. The speech is therefore presented here as a passage from a play, not as a separately published lyric poem.",
    "The seven ages draw on an older tradition of dividing human life into stages. Shakespeare makes that inherited scheme distinctly theatrical, using familiar Elizabethan social types and the commedia dell'arte figure of Pantalone for the sixth age.",
    "The Academy of American Poets identifies the passage as lines 139–166 and marks it public domain. The speech begins immediately after Duke Senior calls the forest a “wide and universal theater,” so Jaques's metaphor grows out of the scene's shared language.",
  ],
  criticalViews: [
    {
      source: "Royal Shakespeare Company, Shakespeare Learning Zone",
      quote:
        "Jaques uses a mixture of perfect iambic pentameter lines with lines containing feminine endings or even as many as thirteen syllables, describing the different facets of the human experience through the ‘seven ages’.",
      url: "https://www.rsc.org.uk/shakespeare-learning-zone/as-you-like-it/language/analysis",
    },
    {
      source: "Internet Shakespeare Editions",
      quote:
        "In As You Like It, the ‘melancholy’ Jacques speaks these lines just before Orlando brings the good old man Adam on stage.",
      url: "https://internetshakespeare.uvic.ca/Library/SLT/life/lifesubj+1.html",
    },
  ],
  faqs: [
    {
      q: "What is the main meaning of “All the World's a Stage”?",
      plain:
        "It compares life to a play in which people move through changing roles and stages. The speech emphasizes that identity and status are temporary, ending in old age and death.",
    },
    {
      q: "What are the seven ages in Shakespeare's speech?",
      plain:
        "They are the infant, schoolboy, lover, soldier, justice, old man or pantaloon, and the final state of “second childishness and mere oblivion.”",
    },
    {
      q: "What themes appear in “All the World's a Stage”?",
      plain:
        "The main themes are aging, mortality, performance, identity, vanity, reputation, and the limits of judging a whole life through fixed social types.",
    },
    {
      q: "What form and meter does the speech use?",
      plain:
        "It is a dramatic monologue in mostly unrhymed iambic pentameter, or blank verse. Shakespeare varies the line length and stress to keep Jaques's speech conversational and expansive.",
      href: "/tools/iambic-pentameter-checker",
      hrefLabel: "Open the iambic pentameter checker",
    },
  ],
  sources: [
    {
      label: "As You Like It, Act II, Scene VII — full speech",
      url: "https://poets.org/poem/you-it-act-ii-scene-vii-all-worlds-stage",
      publisher: "Academy of American Poets",
    },
    {
      label: "As You Like It — Act 2, scene 7",
      url: "https://www.folger.edu/explore/shakespeares-works/as-you-like-it/read/2/7/",
      publisher: "Folger Shakespeare Library",
    },
    {
      label: "Language analysis in As You Like It",
      url: "https://www.rsc.org.uk/shakespeare-learning-zone/as-you-like-it/language/analysis",
      publisher: "Royal Shakespeare Company",
    },
    {
      label: "“All the world's a stage” — Life and Times",
      url: "https://internetshakespeare.uvic.ca/Library/SLT/life/lifesubj+1.html",
      publisher: "Internet Shakespeare Editions",
    },
  ],
  cta: "Write with this poem’s meter in the editor",
};

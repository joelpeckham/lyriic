import type { PoemAnalysisContent } from "../types";
import { poemMeterSettings } from "../settings";

export const invictusPoem: PoemAnalysisContent = {
  slug: "invictus",
  status: "ready",
  poemTitle: "Invictus",
  author: "William Ernest Henley",
  yearPublished: 1875,
  publicDomainBasis:
    "Written in 1875 and first published in the United States in the nineteenth century; the Academy of American Poets identifies the poem as public domain.",
  title: "Invictus Analysis & Meaning — William Ernest Henley — lyriic",
  description:
    "An analysis of William Ernest Henley’s Invictus: its meaning, resilience, themes, form, imagery, and famous final declaration.",
  h1: "Invictus analysis",
  intro:
    "William Ernest Henley’s Invictus turns illness, pain, and uncertainty into a compact declaration of resilience. Its famous ending asserts inner agency while the earlier stanzas acknowledge forces the speaker cannot control.",
  text: `Out of the night that covers me,
Black as the Pit from pole to pole,
I thank whatever gods may be
For my unconquerable soul.

In the fell clutch of circumstance
I have not winced nor cried aloud.
Under the bludgeonings of chance
My head is bloody, but unbowed.

Beyond this place of wrath and tears
Looms but the Horror of the shade,
And yet the menace of the years
Finds and shall find me unafraid.

It matters not how strait the gate,
How charged with punishments the scroll,
I am the master of my fate:
I am the captain of my soul.`,
  fullTextSource: {
    label: "Invictus — Academy of American Poets",
    url: "https://poets.org/poem/invictus",
    publisher: "Academy of American Poets",
  },
  editorSettings: poemMeterSettings("iambic-tetrameter", {
    showCounts: true,
    showStress: true,
    showMeterBreaks: true,
    showRhymeScheme: true,
  }),
  summary: [
    "The speaker moves through darkness, physical pain, and the prospect of death without surrendering his sense of self. He thanks the unknown gods for an “unconquerable soul” and insists that circumstance has not made him bow.",
    "The final quatrain turns suffering into a claim of agency: whatever judgment or fate may threaten, the speaker presents himself as responsible for his direction and inner life.",
  ],
  meaning: [
    "Invictus means “unconquered,” and the poem earns that name through a progression from darkness and injury to defiance. Its resilience is not an assertion that pain is unreal; the speaker is bloody, surrounded by wrath and tears, and aware of the menace of time.",
    "“I am the master of my fate” is best read as a forceful claim about moral and psychological agency, not literal control over every event. The poem’s tension comes from the contrast between the “clutch of circumstance” and the speaker’s decision to remain unafraid.",
    "The phrase “captain of my soul” makes the self into a navigator facing hostile waters. It can sound empowering, but its absolutism also invites debate: the poem acknowledges chance and punishment even as it rejects their authority over the speaker’s inner posture.",
  ],
  themes: [
    {
      theme: "Resilience under suffering",
      discussion:
        "The speaker names darkness, pain, blood, and tears directly, then answers them with endurance. Courage here is persistence without pretending that suffering is small.",
    },
    {
      theme: "Agency and circumstance",
      discussion:
        "“Circumstance” and “chance” represent forces outside the speaker’s command. Against them, the repeated first-person declarations define a smaller but meaningful sphere of choice: how he meets what happens.",
    },
    {
      theme: "Mortality and fear",
      discussion:
        "The “Horror of the shade” and the “menace of the years” place death and time beyond easy reassurance. The speaker’s response is not proof of safety but a vow to face the future unafraid.",
    },
    {
      theme: "Self-command and accountability",
      discussion:
        "The final stanza uses the language of mastery, a gate, and a charged scroll to frame judgment. The speaker claims authority over his soul even while the imagery keeps external judgment in view.",
    },
  ],
  formAndMeter: [
    "The poem has four quatrains and sixteen lines. Each stanza follows an ABAB rhyme pattern, giving the declaration a controlled, memorable structure.",
    "Its base is iambic tetrameter: four rising metrical feet per line, generally producing eight syllables. The opening feet of “Out” and “Black” are trochaic substitutions, and the natural stresses vary with syntax, so the rhythm is firm without being mechanical.",
    "The short, balanced lines and repeated first-person syntax make the poem sound like a spoken vow. The regular form contains images of pain and uncertainty, reinforcing the speaker’s effort to impose order on experience.",
  ],
  literaryDevices: [
    {
      device: "Extended metaphor",
      example: "I am the captain of my soul.",
      discussion:
        "The closing nautical image presents the self as a captain steering through darkness and chance. It transforms inward resolve into an image of command and direction.",
    },
    {
      device: "Personification",
      example: "In the fell clutch of circumstance",
      discussion:
        "Circumstance is given a grasping body, while chance delivers “bludgeonings.” These hostile figures make suffering feel active and physical rather than abstract.",
    },
    {
      device: "Imagery and symbolism",
      example: "Black as the Pit from pole to pole,",
      discussion:
        "The pit, blood, wrath, tears, and shade create a dark symbolic landscape. The scale expands from the speaker’s body to the whole world and finally to mortality.",
    },
    {
      device: "Anaphora and parallelism",
      example: "I am the master of my fate: / I am the captain of my soul.",
      discussion:
        "The repeated “I am” gives the ending the cadence of a credo. Parallel syntax makes the two claims feel complete and emphatic, while the colon links them as one conclusion.",
    },
  ],
  historicalContext: [
    "Henley wrote the poem in 1875 during a long period of treatment at the Royal Infirmary of Edinburgh. He had developed tuberculosis of the bone as a child; the illness led to the amputation of his left leg below the knee in 1868–69, and later threatened his remaining leg.",
    "Henley sought Joseph Lister’s treatment in Edinburgh, where his remaining leg was saved. Poem Analysis describes the poem as written while Henley recovered in a hospital bed, making its language of bodily pain and resistance closely connected to his circumstances, while cautioning that the speaker is still a poetic construction rather than a medical diary.",
    "The poem was first published without a title in Henley’s 1888 collection. According to Poem Analysis, the Latin title meaning “unconquered” was supplied later by editor Arthur Quiller-Couch. The 1875 date refers to composition, while 1888 marks its first book publication.",
  ],
  criticalViews: [
    {
      source: "Poem Analysis",
      author: "Jamie Jenson and the Poem Analysis Editorial Team",
      quote:
        "The indomitable human spirit and the power of resilience in the face of adversity",
      url: "https://poemanalysis.com/william-ernest-henley/invictus/",
    },
    {
      source: "Better Living through Beowulf",
      quote:
        "Those of us who come after, however, can observe that the poem does not explore soul. It’s more about the triumph of the will",
      url: "https://betterlivingthroughbeowulf.com/invictus-a-flawed-poem-easily-abused/",
    },
  ],
  faqs: [
    {
      q: "What is the main meaning of Invictus?",
      plain:
        "The poem presents resilience as a choice of inner stance. It does not deny pain or mortality; it argues that circumstance and chance do not have to determine the speaker’s courage or sense of self.",
    },
    {
      q: "What does “captain of my soul” mean?",
      plain:
        "It means that the speaker claims responsibility for directing his inner life. The image is deliberately strong and absolute, which is why it can be read as empowering self-command or questioned as an overstatement of human control.",
    },
    {
      q: "How did Henley’s illness influence Invictus?",
      plain:
        "Henley had tuberculosis of the bone, lost his left leg below the knee, and later underwent treatment to save his remaining leg. He wrote the poem during recovery in an Edinburgh hospital, giving its language of endurance a personal context.",
    },
    {
      q: "What meter does Invictus use?",
      plain:
        "It is primarily iambic tetrameter, with four feet and usually eight syllables per line. The opening lines use stressed opening substitutions, and other natural variations keep the rhythm close to speech.",
      href: "/tools/iambic-tetrameter-checker",
      hrefLabel: "Open the iambic tetrameter checker",
    },
  ],
  sources: [
    {
      label: "Invictus — full poem",
      url: "https://poets.org/poem/invictus",
      publisher: "Academy of American Poets",
    },
    {
      label: "Invictus by William Ernest Henley — analysis",
      url: "https://poemanalysis.com/william-ernest-henley/invictus/",
      publisher: "Poem Analysis",
    },
    {
      label: "“Invictus,” a Flawed Poem Easily Abused",
      url: "https://betterlivingthroughbeowulf.com/invictus-a-flawed-poem-easily-abused/",
      publisher: "Better Living through Beowulf",
    },
  ],
  cta: "Write with this poem’s meter in the editor",
};

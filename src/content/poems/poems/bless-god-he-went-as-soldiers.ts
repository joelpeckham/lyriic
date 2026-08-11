import { excerpt, p } from "../blocks";
import { poemMeterSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const blessGodHeWentAsSoldiersPoem: PoemAnalysisContent = {
  slug: "bless-god-he-went-as-soldiers",
  status: "ready",
  poemTitle: "Bless God, he went as soldiers",
  author: "Emily Dickinson",
  yearPublished: 1890,
  publicDomainBasis:
    "Written mid-nineteenth century and published posthumously in Poems, Third Series (1896), so the poem is public domain in the United States.",
  title:
    "Bless God, he went as soldiers Analysis & Meaning — Emily Dickinson — lyriic",
  description:
    "Analysis of Dickinson’s martial prayer: faith, fear, heavenly “epauletted white,” and uncertain victory.",
  h1: "Bless God, he went as soldiers analysis",
  intro:
    "This analysis follows the poem’s blend of military imagery, prayer, and conditional courage.",
  fullTextSource: {
    label: "Bless God, he went as soldiers",
    url: "https://en.wikisource.org/wiki/Poems:_Third_Series/Bless_God,_he_went_as_soldiers",
    publisher: "Wikisource",
  },
  editorSettings: poemMeterSettings("common-meter", {
    showCounts: true,
    showStress: true,
    showMeterBreaks: true,
    showRhymeScheme: true,
  }),
  summary: [
    p(
      "The speaker imagines a beloved man entering battle with a musket and asks God to place him among the bravest blessed.",
    ),
    excerpt(
      `BLESS God, he went as soldiers,
His musket on his breast;
Grant, God, he charge the bravest`,
    ),
    p(
      "Seeing him in heavenly white would let the speaker face an unnamed foe without fear.",
      ["bless-commentary"],
    ),
  ],
  meaning: [
    p(
      "Faith is desired but not fully possessed. The speaker’s courage depends on seeing visible proof that the beloved has reached a safe, honored afterlife.",
      ["dickinson-martial"],
    ),
    excerpt(
      `Please God, might I behold him
In epauletted white,
I should not fear the foe then`,
    ),
    p(
      "The subjunctive “might” keeps the requested vision unresolved, so the poem ends before certainty arrives.",
      ["dickinson-martial"],
    ),
  ],
  themes: [
    {
      theme: "Faith and uncertainty",
      blocks: [
        p(
          "Bless, Grant, and Please make belief sound like a request awaiting an answer rather than a settled creed.",
          ["bless-commentary"],
        ),
      ],
    },
    {
      theme: "Courage through example",
      blocks: [
        p(
          "The beloved’s imagined bravery becomes the speaker’s possible source of courage.",
        ),
      ],
    },
    {
      theme: "War and spiritual language",
      blocks: [
        p(
          "Musket, charge, foe, and fight overlap with God, blest, and white, so secular battle and spiritual trial share one vocabulary.",
          ["dickinson-martial"],
        ),
      ],
    },
  ],
  formAndMeter: [
    p(
      "Two quatrains broadly resemble common meter, with flexible stresses and hymn-like short lines.",
      ["poem-text-bless"],
    ),
    p(
      "Slant rhyme links “breast”/“blest,” while “white”/“fight” gives the second stanza a restrained closure.",
    ),
  ],
  literaryDevices: [
    {
      device: "Martial metaphor",
      blocks: [
        excerpt(`His musket on his breast;`),
        p(
          "Spiritual status is described through enlistment, rank, and battle.",
        ),
      ],
    },
    {
      device: "Color imagery",
      blocks: [
        excerpt(`In epauletted white`),
        p(
          "Military insignia and heavenly whiteness combine in one desired vision.",
        ),
      ],
    },
    {
      device: "Anaphora",
      blocks: [
        excerpt(
          `BLESS God, he went as soldiers,
Grant, God, he charge the bravest
Please God, might I behold him`,
        ),
        p("Repeated divine address creates a prayer-like rhythm."),
      ],
    },
  ],
  historicalContext: [
    p(
      "Dickinson preserved the poem in an early fascicle around 1859; it appeared posthumously in Poems, Third Series in 1896.",
      ["dickinson-morgan"],
    ),
    p(
      "Scholar Shira Wolosky notes that Dickinson used martial vocabulary before the Civil War; this poem leaves its foe and fight deliberately unnamed.",
      ["dickinson-martial"],
    ),
  ],
  citations: [
    {
      id: "poem-text-bless",
      source: "Wikisource",
      url: "https://en.wikisource.org/wiki/Poems:_Third_Series/Bless_God,_he_went_as_soldiers",
    },
    {
      id: "dickinson-martial",
      source: "Hitotsubashi University Repository",
      author: "Shira Wolosky",
      quote:
        "it is not clear whether or not the narrator can in the end obtain ‘victory.’",
      url: "https://hit-u.repo.nii.ac.jp/record/2042924/files/jinbun0000900510.pdf",
    },
    {
      id: "dickinson-morgan",
      source: "Morgan Library & Museum",
      quote: "Dickinson included this poem in one of her earliest fascicles.",
      url: "https://www.themorgan.org/exhibitions/online/emily-dickinson/9",
    },
    {
      id: "bless-commentary",
      source: "BookishNerDan",
      quote: "Yet there is no resolution in the poem",
      url: "https://slowlander.com/2019/06/07/page-45-of-864-of-emily-dickinsons-poems-as-she-preserved-them-2/",
    },
  ],
  criticalViews: [
    { citeId: "dickinson-martial" },
    { citeId: "bless-commentary" },
  ],
  faqs: [
    {
      q: "What is the meaning of “Bless God, he went as soldiers”?",
      plain:
        "The speaker wants a vision of a beloved soldier’s heavenly honor so she can face her own unnamed fight.",
    },
    {
      q: "What does “epauletted white” mean?",
      plain:
        "It joins decorated military clothing with heavenly white, imagining the beloved as both officer and blessed spirit.",
    },
    {
      q: "What is the poem’s form?",
      plain:
        "Two flexible, hymn-like quatrains that broadly resemble common meter, with slant rhyme.",
      href: "/tools/common-meter-checker",
      hrefLabel: "Check common meter in lyriic",
    },
  ],
  cta: "Write with this poem’s meter in the editor",
};

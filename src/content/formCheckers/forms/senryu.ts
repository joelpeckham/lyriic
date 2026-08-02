import type { FormCheckerContent } from "../types";

export const senryuForm: FormCheckerContent = {
  meterId: "senryu",
  status: "ready",
  title: "Senryu Checker (5-7-5) — lyriic",
  description:
    "Check a three-line senryu against 5-7-5 with live syllable deltas. Free, private, and dictionary-based — then keep writing with lyriic’s Senryu meter ruler.",
  h1: "Senryu checker",
  intro:
    "Shape a three-line draft against 5 · 7 · 5. Same syllable engine as the lyriic poetry editor — private in your browser.",
  history: [
    "Senryu shares haiku’s short three-phrase shape, but it turns toward human nature rather than seasonal nature scenes. Where English haiku teaching often emphasizes image and stillness, senryu traditionally leans on irony, satire, and the foibles of everyday life.",
    "The form is named for Karai Senryū (1718–1790), an Edo-period judge of maekuzuke verse-capping contests. Selected witty entries were gathered in anthologies such as Haifū Yanagidaru (Willow Barrel). In Japanese, the count is in on (sound units), not English syllables; English workshops commonly teach the same 5-7-5 grid used for haiku practice.",
    "Unlike haiku, senryu is not expected to carry a seasonal word (kigo) or a cutting word (kireji). The difference is mainly subject and tone: people, manners, and social absurdity rather than landscape.",
  ],
  famousPoems: [
    {
      title: "Catching the robber",
      author: "Traditional (Yanagidaru)",
      note: "A classic anonymous senryu often cited to show the form’s ironic turn; English syllable counts vary by translation.",
      excerpt: "Catching him / I see the robber / is my own son.",
    },
    {
      title: "Hide and seek",
      author: "Traditional",
      note: "Another frequently quoted piece: a child’s game opens into a darker, seasonal punchline.",
      excerpt: "Hide and seek / Count to three / Winter comes.",
    },
    {
      title: "From Haifū Yanagidaru",
      author: "Karai Senryū (judge / tradition)",
      note: "Senryū’s Willow Barrel anthologies collected merchant-class wit from maekuzuke contests; many surviving verses are anonymous types rather than single-author lyrics.",
    },
  ],
  formNotes: [
    "Counts use English syllables from the bundled dictionary. Traditional Japanese senryu is measured in on — sound units that are not the same as English syllables — so treat 5 · 7 · 5 as a useful teaching form, not a universal rule.",
    "lyriic does not score satire, humor, or “human nature” subject matter. Senryu and haiku share the same syllable pattern here; the distinction is thematic, not metrical.",
  ],
  faqs: [
    {
      q: "How is senryu different from haiku?",
      plain:
        "Both are often taught in English as three lines of 5-7-5 syllables. Haiku traditionally leans toward nature and seasonal reference; senryu leans toward human foibles, irony, and social observation. lyriic checks the shared syllable shape, not theme.",
    },
    {
      q: "Does lyriic include a senryu meter ruler?",
      plain:
        "Yes. Open the Senryu writer, or choose Senryu under Meter in Settings, for live 5/7/5 ticks beside each line as you write.",
    },
    {
      q: "Is my senryu uploaded?",
      plain:
        "No. Syllable checks run locally in your browser. lyriic is local-first and does not require an account.",
    },
  ],
  sampleLines: [
    "She checks her phone twice",
    "during the wedding vows still",
    "nobody is shocked",
  ],
  cta: "Continue in the editor",
  meterExplainerId: "syllable-5-7-5",
  verificationNotes: [
    "Catalog: pattern [5,7,5], stanzaLines 3, syllable-only (no stress) — identical to haiku meter. Matches English teaching 5-7-5. Intentionally omits theme/satire scoring, kigo/kireji, and Japanese on counting; senryu vs haiku is content, not a separate catalog pattern.",
  ],
};

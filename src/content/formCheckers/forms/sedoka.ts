import type { FormCheckerContent } from "../types";

/** Sedoka — paired katauta (5-7-7 × 2). */
export const sedokaForm: FormCheckerContent = {
  meterId: "sedoka",
  status: "ready",
  title: "Sedoka Checker (5-7-7-5-7-7) — lyriic",
  description:
    "Check a six-line sedoka against paired katauta 5-7-7 / 5-7-7 with live syllable deltas. Free, private, and dictionary-based — then keep writing with lyriic’s Sedoka meter ruler.",
  h1: "Sedoka checker",
  intro:
    "Shape a six-line draft against 5 · 7 · 7 · 5 · 7 · 7 — two katauta side by side. Same syllable engine as the lyriic poetry editor — private in your browser.",
  history: [
    "Sedōka (旋頭歌, often glossed as a “head-repeating” or “head-spinning” poem) is an early waka form: two tercets of 5-7-7 on, for six phrases total. It appears in the Kojiki, Nihon Shoki, and especially the Man’yōshū (eighth century), where roughly sixty examples survive.",
    "Many sedoka read as dialogue or exchange — question and answer, or two angles on one subject — whether composed by two voices or a single author. Kakinomoto no Hitomaro is closely tied to the form; a large share of Man’yōshū sedoka come from the Hitomaro Collection.",
    "By the early Heian period the form had largely faded; imperial anthologies such as the Kokinshū keep almost none. English workshops usually teach the syllable map 5-7-7-5-7-7 as a useful practice shape, while Japanese originals count on (sound units), not English syllables.",
  ],
  famousPoems: [
    {
      title: "Purple fields (Man’yōshū I:20)",
      author: "Princess Nukata",
      note: "Often cited as a landmark early love lyric; some readings treat the exchange with Prince Ōama as sedoka-shaped dialogue. Translations vary widely in syllable count.",
      excerpt:
        "You ride purple fields / marked as imperial domain — / these murasaki grasses. / Will the groundskeeper / be so blind as not to see / as you wave your sleeves at me?",
    },
    {
      title: "Atokawa willow (Man’yōshū)",
      author: "Anonymous",
      note: "A refrain-style sedoka: the opening image returns at the close — the “head” repeated that gives the form its name.",
      excerpt:
        "A willow by the Atokawa / in Tōtōmi — cut again / and again, yet it grows thick. / A willow by the Atokawa / in Tōtōmi — still it stands / green beside the running stream.",
    },
    {
      title: "Suminoe rice field (Man’yōshū 1275)",
      author: "Anonymous",
      note: "Classic question-and-answer (mondō) texture: one katauta asks, the other answers — a common sedoka posture in the Man’yō age.",
      excerpt:
        "Young man reaping / the small field at Suminoe — / is that fellow over there? / Yes, he is there, / but he reaps a private plot / so the girl he loves may see.",
    },
  ],
  formNotes: [
    "Counts use English syllables from the bundled dictionary. Traditional sedoka is measured in on — sound units that are not the same as English syllables — so treat 5 · 7 · 7 · 5 · 7 · 7 as a useful teaching form, not a universal rule.",
    "lyriic does not enforce dialogue structure, refrain repetition, or theme rules. A sedoka is two katauta (5-7-7 each); related mondo exchanges by two authors are outside the checker’s scope.",
  ],
  faqs: [
    {
      q: "What is a sedoka?",
      plain:
        "In English teaching contexts, a sedoka is six lines in two katauta: 5-7-7, then 5-7-7 again. Traditional Japanese sedōka is measured in on (sound units), which is not identical to English syllables.",
    },
    {
      q: "Does lyriic include a sedoka meter ruler?",
      plain:
        "Yes. Open the Sedoka writer, or choose Sedoka under Meter in Settings, for live 5/7/7 ticks beside each line as you write.",
    },
    {
      q: "Is my sedoka uploaded?",
      plain:
        "No. Syllable checks run locally in your browser. lyriic is local-first and does not require an account.",
    },
  ],
  sampleLines: [
    "Soft mist on the lake",
    "A heron lifts from the reeds",
    "Wings cut a path through the dawn",
    "Still water returns",
    "Ripples fold into the dark",
    "The heron is somewhere gone",
  ],
  cta: "Write in the zen editor",
  meterExplainerId: "sedoka",
  meterExplainer: {
    id: "sedoka",
    title: "How sedoka meter works",
    body: [
      "A sedoka is two katauta stacked: six lines targeting 5 · 7 · 7 · 5 · 7 · 7 English syllables. lyriic’s catalog labels this “paired katauta” and checks that syllable cycle only — syllable-only, no stress contour.",
      "In classical waka the same map is counted in on. English teaching copies the 5-7-7 twice shape; it is not a claim that every Man’yōshū sedoka matches English syllable counts in translation.",
      "Tradition often pairs the halves as dialogue, refrain, or two views of one subject. Those rhetorical habits are not scored here — only the six-line syllable grid.",
    ],
    status: "ready",
  },
  verificationNotes: [
    "Catalog: pattern [5,7,7,5,7,7], stanzaLines 6, syllable-only (no stress). Matches English teaching sedoka as paired katauta 5-7-7 × 2. Intentionally omits on counting, mondo/two-author rules, refrain requirements, and theme.",
  ],
};

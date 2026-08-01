import type { FormCheckerContent } from "../types";

export const katautaForm: FormCheckerContent = {
  meterId: "katauta",
  status: "ready",
  title: "Katauta Checker (5-7-7) — lyriic",
  description:
    "Check a three-line katauta against 5-7-7 with live syllable deltas. Free, private, and dictionary-based — then keep writing with lyriic’s Katauta meter ruler.",
  h1: "Katauta checker",
  intro:
    "Shape a three-line draft against 5 · 7 · 7. Same syllable engine as the lyriic poetry editor — private in your browser.",
  history: [
    "Katauta (片歌, “half-poem” or fragment-verse) is an early Japanese short form: three phrases, most often counted as 5-7-7. A single katauta was traditionally treated as incomplete on its own — half of an exchange — though it can stand as a complete lyric in modern English practice.",
    "When two 5-7-7 katauta are paired, they form a sedōka (5-7-7 / 5-7-7), often cast as a question-and-answer or lovers’ dialogue (mondō). Sources such as the Man’yōshū preserve these shapes; Britannica notes the form was rarely used after about the eighth century.",
    "English workshops usually teach katauta as three lines totaling nineteen syllables in a 5-7-7 pattern, sometimes allowing 5-7-5. That grid is useful for practice, but Japanese counting is in on (sound units), not English syllables, and classical pieces were often addressed to a lover.",
  ],
  famousPoems: [
    {
      title: "Man’yōshū I:20 (opening katauta)",
      author: "Princess Nukata (Nukata no Ōkimi)",
      note: "Opening half of a celebrated sedōka: purple fields, imperial hunting grounds, and a secret sleeve-wave. English syllable counts vary widely by translation.",
      excerpt:
        "You ride purple fields / marked as imperial domain — / these murasaki grasses.",
    },
    {
      title: "Untitled katauta",
      author: "Robert Lee Brewer",
      note: "A contemporary English teaching example (Writer’s Digest) cast as a lover’s question in 5-7-7.",
      excerpt:
        "why do winter stars / shine brighter than summer stars / as if they are shards of glass?",
    },
    {
      title: "Kojiki / Nihon Shoki short songs",
      author: "Anonymous (early chronicles)",
      note: "Arthur Waley and others note that a few of the shortest poems in the early chronicles already take a 5-7-7 shape — ancestors of later katauta counting practice.",
    },
  ],
  formNotes: [
    "Counts use English syllables from the bundled dictionary. Traditional Japanese katauta is measured in on — sound units that are not the same as English syllables — so treat 5 · 7 · 7 as a useful teaching form, not a universal rule.",
    "lyriic does not enforce lover-address, dialogue pairing, or sedōka structure. Pair two katauta yourself (or use the Sedoka meter) if you want the full exchange.",
  ],
  faqs: [
    {
      q: "What is a 5-7-7 katauta?",
      plain:
        "In English teaching contexts, a katauta is three lines with five syllables, then seven, then seven. The name means “half-poem”: classically it was often one side of a paired exchange (a sedōka). Japanese counting uses on, which is not identical to English syllables.",
    },
    {
      q: "Does lyriic include a katauta meter ruler?",
      plain:
        "Yes. Open the Katauta writer, or choose Katauta under Meter in Settings, for live 5/7/7 ticks beside each line as you write.",
    },
    {
      q: "Is my katauta uploaded?",
      plain:
        "No. Syllable checks run locally in your browser. lyriic is local-first and does not require an account.",
    },
  ],
  sampleLines: [
    "I wait by the gate",
    "listening for your footsteps",
    "yet only the wind answers",
  ],
  cta: "Write in the zen editor",
  meterExplainerId: "katauta",
  meterExplainer: {
    id: "katauta",
    title: "How katauta works",
    body: [
      "lyriic’s catalog treats katauta as three lines with syllable targets 5, then 7, then 7 — nineteen syllables total. Checks are syllable-only; there is no stress contour for this meter.",
      "English teaching materials usually prefer 5-7-7 and sometimes allow 5-7-5. Classical Japanese practice counted on and often framed the piece as half of a lovers’ exchange; two katauta make a sedōka (see lyriic’s Sedoka meter for the six-line pair).",
      "Use the checker to hit the English 5 · 7 · 7 grid. Theme (address to a lover), dialogue pairing, and Japanese on counting are outside what the tool scores.",
    ],
    status: "ready",
  },
  verificationNotes: [
    "Catalog: pattern [5,7,7], stanzaLines 3, syllable-only (no stress). Matches English teaching 5-7-7 katauta (Britannica/Writer’s Digest). Tradition also allows 5-7-5 and frames the poem as a half-exchange; lyriic intentionally omits alternate 5-7-5 mode, lover-address/theme rules, sedōka pairing, and Japanese on counting. Sedoka is a separate catalog entry ([5,7,7,5,7,7]).",
  ],
};

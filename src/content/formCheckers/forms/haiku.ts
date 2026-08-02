import type { FormCheckerContent } from "../types";

/** Reference implementation — ported from the original haiku tool page. */
export const haikuForm: FormCheckerContent = {
  meterId: "haiku",
  status: "ready",
  title: "Haiku Checker (5-7-5) — lyriic",
  description:
    "Check a three-line haiku against 5-7-5 with live syllable deltas. Free, private, and dictionary-based — then keep writing with lyriic’s Haiku meter ruler.",
  h1: "Haiku checker",
  intro:
    "Shape a three-line draft against 5 · 7 · 5. Same syllable engine as the lyriic poetry editor — private in your browser.",
  history: [
    "Haiku grew out of earlier Japanese linked-verse traditions, with the opening hokku later standing alone. In English classrooms and workshops, the form is often taught as three lines totaling seventeen syllables in a 5-7-5 pattern.",
    "That English teaching shape is useful for practice, but it is not identical to Japanese counting in on (sound units), and many contemporary English haiku writers prefer a looser, image-first approach.",
  ],
  famousPoems: [
    {
      title: "Old pond",
      author: "Matsuo Bashō",
      note: "Classroom staple of the pond/frog moment; English versions rarely match 5-7-5 because the original counts on, not syllables.",
      excerpt: "An old silent pond — / A frog jumps into the pond — / Splash! Silence again.",
    },
    {
      title: "Crow on a bare branch",
      author: "Matsuo Bashō",
      note: "Often taught for its spare autumn image (kigo); syllable totals swing with each translator’s phrasing.",
      excerpt: "On a bare branch / A crow has alighted — / Autumn evening.",
    },
    {
      title: "Lighting one candle",
      author: "Yosa Buson",
      note: "A spring-evening haiku frequently anthologized in English; again, translations diverge from strict 5-7-5.",
      excerpt: "Lighting one candle / with another candle — / spring evening.",
    },
    {
      title: "This world of dew",
      author: "Kobayashi Issa",
      note: "Issa’s dewdrop poem is a common teaching example of pathos within a short seasonal frame.",
      excerpt: "This world of dew / is a world of dew — / and yet, and yet…",
    },
  ],
  formNotes: [
    "Counts use English syllables from the bundled dictionary. Traditional Japanese haiku is measured in on — sound units that are not the same as English syllables — so treat 5 · 7 · 5 as a useful teaching form, not a universal rule.",
    "lyriic does not enforce seasonal words (kigo) or a cutting word (kireji).",
  ],
  faqs: [
    {
      q: "What is a 5-7-5 haiku?",
      plain:
        "In English teaching contexts, a haiku is often three lines with five syllables, then seven, then five. Traditional Japanese haiku is measured in on (sound units), which is not identical to English syllables.",
    },
    {
      q: "Does lyriic include a haiku meter ruler?",
      plain:
        "Yes. Open the Haiku writer, or choose Haiku under Meter in Settings, for live 5/7/5 ticks beside each line as you write.",
    },
    {
      q: "Is my haiku uploaded?",
      plain:
        "No. Syllable checks run locally in your browser. lyriic is local-first and does not require an account.",
    },
  ],
  sampleLines: [
    "An old silent pond",
    "A frog jumps into the pond",
    "Splash! Silence again",
  ],
  cta: "Continue in the editor",
  meterExplainerId: "syllable-5-7-5",
  verificationNotes: [
    "Catalog: pattern [5,7,5], stanzaLines 3, syllable-only (no stress). Matches English teaching 5-7-5. Intentionally omits kigo/kireji and Japanese on counting.",
  ],
};

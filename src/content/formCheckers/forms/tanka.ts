import type { FormCheckerContent } from "../types";

export const tankaForm: FormCheckerContent = {
  meterId: "tanka",
  status: "ready",
  title: "Tanka Checker (5-7-5-7-7) — lyriic",
  description:
    "Check a five-line tanka against 5-7-5-7-7 with live syllable deltas. Free, private, and dictionary-based — then keep writing with lyriic’s Tanka meter ruler.",
  h1: "Tanka checker",
  intro:
    "Shape a five-line draft against 5 · 7 · 5 · 7 · 7. Same syllable engine as the lyriic poetry editor — private in your browser.",
  history: [
    "Tanka (short song) is a form of waka and one of the oldest Japanese lyric shapes still in wide use. By the seventh century it was already central to court life — composed in contests, exchanged as love notes, and collected in anthologies such as the Man’yōshū (ca. 759), which holds thousands of tanka.",
    "Classical Japanese tanka is measured in on (sound units), usually totaling thirty-one in a 5-7-5-7-7 pattern. English teaching often presents the same counts as five lines. The upper phrase (kami-no-ku, 5-7-5) and lower phrase (shimo-no-ku, 7-7) often meet at a turn — a shift from image toward feeling — though practice varies.",
    "In the early twentieth century Masaoka Shiki revived the name tanka for a modernized waka. English-language writers use the form less than haiku, but poets such as Amy Lowell, Kenneth Rexroth, and later translators and practitioners have kept it visible.",
  ],
  famousPoems: [
    {
      title: "The flowers withered",
      author: "Ono no Komachi",
      note: "Heian classic from the Kokinshū / Hyakunin Isshu tradition; English syllable counts depend on the translation.",
      excerpt:
        "The flowers withered / Their color faded away / While in idle thoughts / I spent my days in the world / And the long rains were falling.",
    },
    {
      title: "From Tangled Hair (Midaregami)",
      author: "Yosano Akiko",
      note: "Early modern tanka that helped reopen the form to frank emotion; often taught via English five-line versions that only roughly track 5-7-5-7-7.",
      excerpt:
        "My shiny black hair / fallen into disarray / a thousand tangles / like a thousand tangled thoughts / about my love for you.",
    },
    {
      title: "The Tale of Genji (embedded waka)",
      author: "Murasaki Shikibu",
      note: "The foundational prose narrative includes hundreds of tanka exchanged as courtly and intimate verse.",
    },
    {
      title: "English tanka experiments",
      author: "Amy Lowell",
      note: "Early twentieth-century Imagist who wrote original English tanka; English practice often favors short-long-short-long-long rhythm over strict on equivalence.",
    },
  ],
  formNotes: [
    "Counts use English syllables from the bundled dictionary. Traditional Japanese tanka is measured in on — sound units that are not the same as English syllables — so treat 5 · 7 · 5 · 7 · 7 as a useful teaching form, not a universal rule.",
    "lyriic does not enforce the upper/lower turn (kami-no-ku / shimo-no-ku), engo (verbal associations), seasonal topics, or Japanese on counting. Contemporary English tanka often aims for thirty-one or fewer syllables with a short-long feel rather than exact counts.",
  ],
  faqs: [
    {
      q: "What is a 5-7-5-7-7 tanka?",
      plain:
        "In English teaching contexts, a tanka is often five lines with five, seven, five, seven, and seven syllables — thirty-one in all. Traditional Japanese tanka is measured in on (sound units), which is not identical to English syllables.",
    },
    {
      q: "Does lyriic include a tanka meter ruler?",
      plain:
        "Yes. Open the Tanka writer, or choose Tanka under Meter in Settings, for live 5/7/5/7/7 ticks beside each line as you write.",
    },
    {
      q: "Is my tanka uploaded?",
      plain:
        "No. Syllable checks run locally in your browser. lyriic is local-first and does not require an account.",
    },
  ],
  sampleLines: [
    "Autumn wind arrives",
    "Leaves scatter across the yard",
    "I fold your letter",
    "Words I meant to say aloud",
    "Stay folded against my coat",
  ],
  cta: "Continue in the editor",
  meterExplainer: {
    id: "tanka",
    title: "How the tanka meter works",
    body: [
      "In lyriic’s catalog, a tanka is five lines targeting 5 · 7 · 5 · 7 · 7 English syllables — the shape most English classrooms and workshops use for practice.",
      "That grid mirrors the classical Japanese on pattern and the split into an upper phrase (5-7-5) and lower phrase (7-7). Haiku’s three-line shape grew from that upper unit; tanka keeps both halves in one poem.",
      "lyriic checks syllable targets only. It does not score the thematic turn, rhyme (tanka is traditionally unrhymed), or Japanese on counting. Drafts that aim for a looser short-long English cadence will show deltas against this strict teaching grid.",
    ],
    status: "ready",
  },
  verificationNotes: [
    "Catalog: pattern [5,7,5,7,7], stanzaLines 5, syllable-only (no stress). Matches English teaching 5-7-5-7-7 / thirty-one syllables. Intentionally omits Japanese on counting, kami-no-ku/shimo-no-ku turn enforcement, engo, seasonal dai, ji-amari/ji-tarazu variants, and rhyme (tradition is unrhymed). sampleLines are original 5-7-5-7-7 teaching lines.",
  ],
};

import type { FormCheckerContent } from "../types";

/** American Crapsey cinquain — syllable 2-4-6-8-2. */
export const cinquainForm: FormCheckerContent = {
  meterId: "cinquain",
  status: "ready",
  title: "Cinquain Checker (2-4-6-8-2) — lyriic",
  description:
    "Check a five-line American cinquain against 2-4-6-8-2 with live syllable deltas. Free, private, and dictionary-based — then keep writing with lyriic’s Cinquain meter ruler.",
  h1: "Cinquain checker",
  intro:
    "Shape a five-line draft against 2 · 4 · 6 · 8 · 2. Same syllable engine as the lyriic poetry editor — private in your browser.",
  history: [
    "The American cinquain is a five-line form devised by the Imagist poet Adelaide Crapsey (1878–1914), partly as an English-language analogue to Japanese haiku and tanka. Her collection Verse (1915), published the year after her death, included twenty-eight cinquains.",
    "Crapsey’s mature shape is accentual-syllabic: five lines of 2, 4, 6, 8, and 2 syllables (twenty-two in all), often with a matching stress count of 1-2-3-4-1 and a preference for iambic movement. She titled her cinquains, treating the title almost as a sixth line.",
    "In schools, “cinquain” also names a didactic word-count exercise (noun / adjectives / gerunds / feeling / synonym). That classroom form is not the same as Crapsey’s syllable stanza, which is what lyriic checks here.",
  ],
  famousPoems: [
    {
      title: "November Night",
      author: "Adelaide Crapsey",
      note: "Classic American cinquain from Verse (1915); often cited as the teaching example of 2-4-6-8-2.",
      excerpt:
        "Listen… / With faint dry sound, / Like steps of passing ghosts, / The leaves, frost-crisp’d, break from the trees / And fall.",
    },
    {
      title: "Triad",
      author: "Adelaide Crapsey",
      note: "Compressed Imagist list poem; title and silence carry as much weight as the lines.",
      excerpt:
        "These be / Three silent things: / The falling snow… the hour / Before the dawn… the mouth of one / Just dead.",
    },
    {
      title: "Snow",
      author: "Adelaide Crapsey",
      note: "Another Verse cinquain; winter imagery and an imperative opening typical of her style.",
      excerpt:
        "Look up… / From bleakening hills / Blows down the light, first breath / Of wintry wind… look up, and scent / The snow!",
    },
  ],
  formNotes: [
    "Counts use English syllables from the bundled dictionary. lyriic checks the American (Crapsey) pattern 2 · 4 · 6 · 8 · 2 across five lines — not the classroom word-count cinquain.",
    "Crapsey often aimed for iambic stress (about 1-2-3-4-1 accents per line). This checker is syllable-only; it does not score stress, titles, or imagery rules.",
    "Variations such as reverse, mirror, butterfly, crown, and garland cinquains use other line counts or syllable orders and are not enforced here.",
  ],
  faqs: [
    {
      q: "What is a 2-4-6-8-2 cinquain?",
      plain:
        "The American cinquain, associated with Adelaide Crapsey, is five lines with two, four, six, eight, and two syllables — twenty-two syllables in all. It is usually unrhymed and image-driven. School “cinquains” that count words by part of speech are a different exercise.",
    },
    {
      q: "Does lyriic include a cinquain meter ruler?",
      plain:
        "Yes. Open the Cinquain writer, or choose Cinquain under Meter in Settings, for live 2/4/6/8/2 ticks beside each line as you write.",
    },
    {
      q: "Is my cinquain uploaded?",
      plain:
        "No. Syllable checks run locally in your browser. lyriic is local-first and does not require an account.",
    },
  ],
  sampleLines: [
    "Listen…",
    "With faint dry sound,",
    "Like steps of passing ghosts,",
    "The leaves, frost-crisp’d, break from the trees",
    "And fall.",
  ],
  cta: "Continue in the editor",
  meterExplainerId: "cinquain",
  meterExplainer: {
    id: "cinquain",
    title: "Cinquain (2 · 4 · 6 · 8 · 2)",
    body: [
      "lyriic’s catalog treats the cinquain as five lines totaling twenty-two syllables: two, then four, then six, then eight, then two. Checks are syllable-only — there is no required foot or stress grid.",
      "That matches the American (Adelaide Crapsey) teaching shape. Crapsey also favored iambic movement and a 1-2-3-4-1 stress outline; those accentual aims are left to the writer here.",
      "Didactic classroom cinquains (word counts by part of speech) and later variations with reversed or mirrored syllable orders are outside this meter’s pattern.",
    ],
    status: "ready",
  },
  verificationNotes: [
    "Catalog: pattern [2,4,6,8,2], stanzaLines 5, syllable-only (no footId / stressPatterns). Matches American Crapsey syllable cinquain. Intentionally omits iambic/1-2-3-4-1 stress, titles-as-sixth-line, didactic word-count school form, rhyme, and reverse/mirror/butterfly/crown/garland variants.",
  ],
};

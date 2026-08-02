import type { FormCheckerContent } from "../types";

export const nonetForm: FormCheckerContent = {
  meterId: "nonet",
  status: "ready",
  title: "Nonet Checker (9→1) — lyriic",
  description:
    "Check a nine-line nonet against 9-8-7-6-5-4-3-2-1 with live syllable deltas. Free, private, and dictionary-based — then keep writing with lyriic’s Nonet meter ruler.",
  h1: "Nonet checker",
  intro:
    "Shape a nine-line draft that counts down 9 · 8 · 7 · 6 · 5 · 4 · 3 · 2 · 1. Same syllable engine as the lyriic poetry editor — private in your browser.",
  history: [
    "A nonet is a nine-line English poem whose syllable count falls by one each line: nine in the first, eight in the second, and so on down to a single syllable in the ninth. The name echoes the musical term for a group of nine players; a clear inventor or first publication date has not been established.",
    "The form spread mainly through online poetry communities and craft columns (Writer’s Digest, Shadow Poetry, and similar guides). It is usually taught as syllable-only — unmetered, any subject, rhyme optional — and is often paired in workshops with the etheree, which climbs from one syllable to ten instead of descending from nine to one.",
  ],
  famousPoems: [
    {
      title: "Nature",
      author: "Robert Lee Brewer",
      note: "Writer’s Digest teaching nonet illustrating the 9→1 countdown; a craft example, not a canonical anthology piece.",
      excerpt:
        "There's a life curled in the darkness / sweating out the evening storm / beneath leaves covered with rain / …",
    },
    {
      title: "Midnight's Breath",
      author: "Shadow Poetry community example",
      note: "Frequently cited on form-reference sites; typical of how nonets circulate in online workshops rather than major anthologies.",
    },
    {
      title: "Canonical nonets",
      note: "The form has no widely agreed canon of famous poems. Contests and teaching samples dominate; treat “famous” examples as illustrative, not authoritative.",
    },
  ],
  formNotes: [
    "Counts use English syllables from the bundled dictionary. A nonet is nine lines descending 9 → 1; lyriic does not require a title, centering on the page, or any particular subject.",
    "lyriic does not enforce rhyme. Tradition treats rhyme as optional and uncommon.",
    "An “upside-down” nonet (1 up to 9) is a workshop variant; this checker follows the standard descending pattern only. For 1→10, use Etheree.",
  ],
  faqs: [
    {
      q: "What is a nonet poem?",
      plain:
        "A nonet is nine lines with a descending syllable count: nine in line one, eight in line two, and so on down to one syllable in line nine. Subject and rhyme are free; most guides treat the form as unmetered.",
    },
    {
      q: "Does lyriic include a nonet meter ruler?",
      plain:
        "Yes. Open the Nonet writer, or choose Nonet under Meter in Settings, for live 9→1 ticks beside each line as you write.",
    },
    {
      q: "Is my nonet uploaded?",
      plain:
        "No. Syllable checks run locally in your browser. lyriic is local-first and does not require an account.",
    },
  ],
  sampleLines: [
    "The streetlight flickers on the wet road",
    "Rain beads along the car windshield",
    "A bus sighs past empty stops",
    "Neon hums in alleys",
    "Footsteps thin away",
    "The night takes hold",
    "A soft hush",
    "Still air",
    "Here",
  ],
  cta: "Continue in the editor",
  meterExplainerId: "nonet",
  meterExplainer: {
    id: "nonet",
    title: "How a nonet works",
    body: [
      "A nonet is nine lines with syllable targets 9 · 8 · 7 · 6 · 5 · 4 · 3 · 2 · 1. lyriic’s catalog matches that countdown and treats the form as syllable-only — no fixed foot or stress contour.",
      "Guides agree that rhyme and theme are optional. Some writers reverse the count or stack multiple nonets; this checker models one descending stanza of nine lines.",
      "The related etheree climbs from one syllable to ten (or descends from ten to one). Choose Etheree in the catalog if you want that ten-line ladder instead.",
    ],
    status: "ready",
  },
  verificationNotes: [
    "Catalog: pattern [9,8,7,6,5,4,3,2,1], stanzaLines 9, syllable-only (no stress/foot). Matches Writer’s Digest, MasterClass, and Shadow Poetry teaching rules for the descending nonet.",
    "Intentionally omits rhyme, title requirements, page centering, and reversed (1→9) or multi-stanza variants. Etheree is a separate catalog entry.",
    "Famous-poem slot notes scarcity: no stable literary canon; cited pieces are craft/community examples.",
  ],
};

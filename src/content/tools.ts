export type ToolFaq = {
  q: string;
  plain: string;
};

export type ToolPageContent = {
  path: string;
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  body: string[];
  faqs: ToolFaq[];
  cta: string;
};

export const TOOL_PAGES: ToolPageContent[] = [
  {
    path: "/tools/syllable-counter",
    slug: "syllable-counter",
    title: "Syllable Counter for Poetry & Lyrics — lyriic",
    description:
      "Free syllable counter for poems and song lyrics. Per-line and per-word counts from lyriic’s pronunciation dictionary — private in your browser.",
    h1: "Syllable counter",
    intro:
      "Paste a stanza or type line by line. See totals and per-word beats from the same pronunciation engine that powers the lyriic editor.",
    body: [
      "Each line shows a syllable total, with a per-word breakdown so you can spot where a beat runs short or long. Try the haiku, iambic, or lyric samples to get a feel for the readout.",
      "Counts prefer the primary pronunciation from a fused US dictionary (Misaki, CMUdict, WikiPron). Hyphenated compounds are split and summed; words missing from the dictionary fall back to a spelling heuristic (shown in italics).",
      "For live counts beside the cursor, meter rulers, and per-draft overrides, open the full editor — nothing leaves your device.",
    ],
    faqs: [
      {
        q: "Is this syllable counter free?",
        plain:
          "Yes. The tool runs in your browser on lyriic.com with no account and no upload of your text to a server for counting.",
      },
      {
        q: "How accurate are the counts?",
        plain:
          "Most English words use primary pronunciations from the bundled dictionary. Ambiguous poetic words can be overridden in the full lyriic editor under Settings → Syllable overrides.",
      },
      {
        q: "Can I use it for song lyrics?",
        plain:
          "Yes. Per-line totals help match syllable counts to a melody or flow, whether you are writing verse, chorus, or spoken word.",
      },
    ],
    cta: "Write with live counts in the editor",
  },
  {
    path: "/tools/rhyme-finder",
    slug: "rhyme-finder",
    title: "Rhyme Finder — lyriic",
    description:
      "Find rhymes grouped by syllable count with lyriic’s local dictionary. Free in your browser — then keep writing with hover-or-tap lookup in the editor.",
    h1: "Rhyme finder",
    intro:
      "Browse rhymes by syllable count from a local dictionary. In the lyriic editor, hover or tap a word to open the same index beside your draft.",
    body: [
      "Type a word to see rhyming candidates from the bundled index, grouped by syllables so you can keep meter in mind. Perfect rhymes are always listed; optional toggles add end rhymes (final syllable even when stress differs, e.g. fun ↔ anyone) and slant rhymes (related vowel and coda families such as night ↔ side, plus one-segment coda add/drop such as mind ↔ time or hold ↔ coal). Results stay on-device; there is no cloud rhyme API.",
      "The page is for browsing. The editor is for drafting: hover or tap a word, pick a rhyme sorted by syllable count—with meter-aware highlighting when a ruler is set.",
      "lyriic pairs rhyme helpers with live syllable counts and synonym lookup so you can shape meter and diction without leaving the line.",
    ],
    faqs: [
      {
        q: "Is this a full RhymeZone replacement?",
        plain:
          "It is a focused local rhyme index for drafting. For an all-in-one writing session with syllables and meter beside your lines, use the lyriic editor rather than switching tabs.",
      },
      {
        q: "Do rhymes work offline?",
        plain:
          "Yes after the app assets load. The rhyme index ships with the site and lookups run in your browser.",
      },
      {
        q: "What are slant rhymes?",
        plain:
          "Slant (near) rhymes share a related vowel family and coda family from the last stressed nucleus—night with side, love with rough—and also allow dropping or adding one final coda segment (mind with time, hold with coal). They are looser than perfect rhymes and optional in the finder and editor popover.",
      },
      {
        q: "Does lyriic generate lyrics with AI?",
        plain:
          "No. lyriic is a meter-focused editor with dictionary helpers — not a generative AI songwriting tool.",
      },
    ],
    cta: "Write with rhymes beside your draft",
  },
];

export function getToolBySlug(slug: string): ToolPageContent | undefined {
  return TOOL_PAGES.find((tool) => tool.slug === slug);
}

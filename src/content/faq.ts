export type FaqEntry = {
  q: string;
  plain: string;
};

export const FAQ_TITLE = "FAQ — lyriic";

export const FAQ_DESCRIPTION =
  "Answers about lyriic: syllable counting, meter rulers for haiku and iambic verse, synonyms and rhymes, and local-first drafts.";

export const FAQ_INTRO =
  "Quick answers about writing in meter with lyriic.";

/** Plain FAQ copy shared by the page, JSON-LD, and markdown mirrors. */
export const FAQ_ENTRIES: FaqEntry[] = [
  {
    q: "What is lyriic?",
    plain:
      "lyriic is a zen text editor for writing in meter — poetry, lyrics, or any line that needs a syllable count. It stays quiet so you can stay with the words. It is not a generative AI lyric writer.",
  },
  {
    q: "How are syllables counted?",
    plain:
      "Counts follow a fused US pronunciation dictionary (Misaki, CMU Pronouncing Dictionary, and WikiPron). Hyphenated compounds are split and summed. Unfamiliar words use a spelling heuristic. Per-draft overrides are available in Settings.",
  },
  {
    q: "What are meter rulers?",
    plain:
      "Optional ticks at syllable boundaries. Presets include Haiku (5/7/5), iambic pentameter (10), and common meter (8/6), or a custom target.",
  },
  {
    q: "How do synonyms and rhymes work?",
    plain:
      "Hover or tap a word in the editor to open synonyms, rhymes, and syllable tools. Synonyms prefer the matching part of speech from local context, then meter fit and syllable count; rhymes sort by syllable count. Meter-matching options are highlighted. Dictionaries ship with the app (Open English WordNet and Wiktionary for synonyms; Misaki, CMUdict, and WikiPron for perfect rhymes).",
  },
  {
    q: "Where does the dictionary data come from?",
    plain:
      "Syllables and rhymes use Misaki (Apache 2.0), the CMU Pronouncing Dictionary (acknowledgment requested by CMU), and WikiPron / Wiktionary pronunciations (CC-BY-SA). Synonyms use Open English WordNet (CC-BY 4.0) with additional links from Wiktionary (CC-BY-SA).",
  },
  {
    q: "Where are my drafts stored?",
    plain:
      "Locally in your browser — no account, no cloud sync. Drafts and preferences stay on this device. See the privacy policy for details.",
  },
  {
    q: "Can I change the look of the editor?",
    plain:
      "Yes. Settings include system, light, or dark theme, higher contrast, and editor font size (S–XL).",
  },
  {
    q: "Does writing leave my browser?",
    plain:
      "No. Syllable counts, thesaurus, and rhyme helpers run client-side. Poem text is not sent to a server for editing. You can keep writing offline after assets load.",
  },
];

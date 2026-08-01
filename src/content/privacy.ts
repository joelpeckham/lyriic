export const PRIVACY_TITLE = "Privacy — lyriic";

export const PRIVACY_DESCRIPTION =
  "lyriic is local-first: drafts stay in your browser. No accounts, no analytics, no third-party trackers.";

export const PRIVACY_EFFECTIVE = "Effective July 31, 2026";

export const PRIVACY_INTRO =
  "lyriic is a client-only writing tool. This page explains what stays on your device and what does not leave your browser.";

export const PRIVACY_SECTIONS = [
  {
    h2: "What lyriic stores",
    body: "Drafts (poem text, settings, and syllable overrides) are saved in your browser's local storage under the key lyriic.projects.v1. Appearance preferences (theme, contrast, and font size) use lyriic.prefs.v1. There is no account and no cloud sync — data stays on this device unless you clear site data or your browser removes it.",
  },
  {
    h2: "What we do not collect",
    body: "lyriic does not run analytics, advertising pixels, or third-party trackers. Writing, syllable counts, synonym lookups, and rhyme helpers run in your browser. Poem text is not sent to a server for editing. Dictionaries ship with the app bundle and load locally.",
  },
  {
    h2: "Hosting and network",
    body: "The website is served as static files (currently via Vercel). Your browser requests those assets like any other site. The app is built so editing does not require outbound API calls for its core features. Hosting providers may log standard technical request data (such as IP address and user agent) as part of delivering the site; that is outside the editor's local storage model described above.",
  },
  {
    h2: "Sale of data",
    body: "We do not sell personal information. There is no personal profile stored by lyriic on a server to sell.",
  },
  {
    h2: "Contact",
    body: "Questions about this policy? Reach the maker at https://jpeckham.com.",
  },
] as const;

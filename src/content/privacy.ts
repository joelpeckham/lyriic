export const PRIVACY_TITLE = "Privacy — lyriic";

export const PRIVACY_DESCRIPTION =
  "lyriic is local-first: drafts stay in your browser. No accounts, no analytics, no third-party trackers.";

export const PRIVACY_EFFECTIVE = "Effective August 1, 2026";

export const PRIVACY_INTRO =
  "lyriic is a client-only writing tool. This page explains what stays on your device, what technical data hosting may process, and your rights under the GDPR.";

export const PRIVACY_SECTIONS = [
  {
    h2: "Who runs lyriic",
    body: "The data controller for lyriic is Joel Peckham, the individual maker of the site. There is no Data Protection Officer. For privacy questions or rights requests, contact the maker at https://jpeckham.com. lyriic is not established in the EU/EEA; that same contact channel is the way to reach the controller.",
  },
  {
    h2: "What stays on your device",
    body: "Drafts (poem text, settings, and syllable overrides) are saved in your browser's local storage under the key lyriic.projects.v1. Appearance preferences (theme, contrast, and font size) use lyriic.prefs.v1. There is no account and no cloud sync — data stays on this device unless you clear site data or your browser removes it.",
  },
  {
    h2: "What we do not collect",
    body: "lyriic does not run analytics, advertising pixels, or third-party trackers. Writing, syllable counts, synonym lookups, and rhyme helpers run in your browser. Poem text is not sent to a server for editing. Dictionaries ship with the app bundle and load locally.",
  },
  {
    h2: "Hosting and technical data",
    body: "The website is served as static files by Vercel. When your browser loads the site, Vercel may process standard technical request data such as IP address, user agent, requested URL, and timestamps (and similar CDN or edge metadata) to deliver the site, keep it secure, and investigate abuse. That processing is outside the editor's local storage model. With Observability Plus, runtime and related request logs are retained for up to 30 days under Vercel's published plan limits (those limits can change).",
  },
  {
    h2: "Processors and international transfers",
    body: "Vercel Inc. hosts lyriic and acts as a processor for technical request data needed to serve the site. Processing may occur in the United States and in other countries where Vercel or its subprocessors operate. Where required, transfers rely on Vercel's Data Processing Addendum and Standard Contractual Clauses (and related UK transfer terms as applicable).",
  },
  {
    h2: "Legal bases",
    body: "Device storage for drafts and preferences is used to provide the writing tool you requested. Technical hosting logs are processed on the basis of legitimate interests (Article 6(1)(f) GDPR): delivering the site, security, reliability, and abuse prevention.",
  },
  {
    h2: "Your rights",
    body: "If GDPR applies to you, you may have rights to access, rectify, erase, restrict, or object to certain processing, and to data portability, as well as the right to lodge a complaint with a supervisory authority. To exercise rights that relate to processing by lyriic as controller, contact the maker at https://jpeckham.com. Practical note: poem drafts and preferences are stored only on your device, so there is no server-side copy of your writing for the controller to export or delete — clear site data in your browser to remove them locally. Rights requests about hosting logs are limited by what short-lived technical logs contain and how long they are retained.",
  },
  {
    h2: "Cookies and local storage",
    body: "lyriic does not use non-essential cookies or tracking technologies. Local storage holds drafts and appearance preferences that are strictly necessary to provide the editor and settings you use. For that reason there is no cookie or storage consent banner.",
  },
  {
    h2: "Sale of data and profiling",
    body: "We do not sell personal information. There is no personal profile stored by lyriic on a server to sell. lyriic does not use automated decision-making that produces legal or similarly significant effects.",
  },
  {
    h2: "Contact",
    body: "Questions about this policy? Reach the maker at https://jpeckham.com.",
  },
] as const;

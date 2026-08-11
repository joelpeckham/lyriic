import { excerpt, p } from "../blocks";
import { poemOpenSettings } from "../settings";
import type { PoemAnalysisContent } from "../types";

export const loveAndFriendshipPoem: PoemAnalysisContent = {
  slug: "love-and-friendship", status: "ready", poemTitle: "Love and Friendship", author: "Emily Brontë", yearPublished: 1846,
  publicDomainBasis: "First published in 1846 or earlier, placing this text in the public domain in the United States.",
  title: "Love and Friendship Analysis & Meaning — Emily Brontë — lyriic",
  description: "Emily Brontë’s Love and Friendship analysis explores seasonal imagery, constancy, romance, friendship, and form.", h1: "Love and Friendship analysis",
  intro: "This Love and Friendship analysis explains the poem’s meaning, themes, form, and literary devices.",
  fullTextSource: { label: "Love and Friendship", url: "https://en.wikisource.org/wiki/The_Complete_Poems_of_Emily_Bront%C3%AB/Love_and_Friendship", publisher: "Wikisource" },
  editorSettings: poemOpenSettings({ showCounts: true }),
  summary: [p("Love is compared with a fragrant wild rose-briar; friendship is compared with evergreen holly. Winter tests the relationships and gives the holly the advantage."), excerpt(`Love is like the wild rose-briar; Friendship like the holly-tree.\nThe holly is dark when the rose-briar blooms,\nBut which will bloom most constantly?`), p("The poem’s structure makes its central tension memorable.", ["cite-one"])],
  meaning: [p("The plants make an abstract distinction visible: romance may be beautiful and intense, while friendship is less showy but more dependable through hardship, aging, and disappointment.", ["cite-one"]), excerpt(`Then, scorn the silly rose-wreath now,\nAnd deck thee with the holly’s sheen,\nThat, when December blights thy brow,`), p("Its images turn an abstract concern into a scene readers can hear and see.", ["cite-two"])],
  themes: [
    { theme: "Constancy in friendship", blocks: [p("The poem returns to constancy in friendship through recurring images and shifts in voice.", ["cite-one"])] },
    { theme: "Beauty versus endurance", blocks: [excerpt(`Then, scorn the silly rose-wreath now,\nAnd deck thee with the holly’s sheen,\nThat, when December blights thy brow,`), p("This theme is developed through the poem’s contrast between image and argument.", ["cite-two"])] },
  ],
  formAndMeter: [p("Three quatrains use a songlike, predominantly iambic movement and alternating rhyme. The final stanza turns the comparison into direct advice.", ["cite-two"]), excerpt(`Love is like the wild rose-briar; Friendship like the holly-tree.\nThe holly is dark when the rose-briar blooms,\nBut which will bloom most constantly?`)],
  literaryDevices: [
    { device: "Extended metaphor", blocks: [excerpt(`Love is like the wild rose-briar; Friendship like the holly-tree.\nThe holly is dark when the rose-briar blooms,\nBut which will bloom most constantly?`), p("The device gives the scene an emotional or rhetorical force beyond literal description.")] },
    { device: "Seasonal imagery", blocks: [excerpt(`Then, scorn the silly rose-wreath now,\nAnd deck thee with the holly’s sheen,\nThat, when December blights thy brow,`), p("The repeated image or sound helps connect the local detail to the poem’s larger meaning.")] },
  ],
  historicalContext: [p("The poem appeared in Poems by Currer, Ellis, and Acton Bell in 1846. Emily Brontë published under the name Ellis Bell alongside her sisters.", ["context"]), p("The poem’s later reception also shapes how readers understand its central images.", ["cite-two"])],
  citations: [
    { id: "cite-one", source: "Critical source", url: "https://www.bbc.co.uk/bitesize/guides/zc7jwxs/revision/2", quote: "Brontë suggests that friendship is steady and constant and able to sustain all difficulties." },
    { id: "cite-two", source: "Critical source", url: "https://interestingliterature.com/2018/06/a-short-analysis-of-emily-brontes-love-and-friendship/", quote: "The poem’s final stanza entreats us to view friendship as more valuable to us than love." },
    { id: "full-text", source: "Wikisource", url: "https://en.wikisource.org/wiki/The_Complete_Poems_of_Emily_Bront%C3%AB/Love_and_Friendship" },
    { id: "context", source: "Wikisource and contextual notes", url: "https://en.wikisource.org/wiki/The_Complete_Poems_of_Emily_Bront%C3%AB/Love_and_Friendship" },
  ],
  criticalViews: [{ citeId: "cite-one" }, { citeId: "cite-two" }],
  faqs: [
    { q: "What is the main meaning of Love and Friendship?", plain: "The poem explores constancy in friendship and uses its central images to make that concern emotionally immediate." },
    { q: "What are the main themes?", plain: "Its main themes include constancy in friendship and beauty versus endurance." },
    { q: "What form does the poem use?", plain: "Three quatrains use a songlike, predominantly iambic movement and alternating rhyme. The final stanza turns the comparison into direct advice." },
  ],
  cta: "Write with this poem’s meter in the editor",
};

import { listSkippedCatalog, POEM_CATALOG } from "./catalog";
import { aDayOfSunshinePoem } from "./poems/a-day-of-sunshine";
import { aDreamWithinADreamPoem } from "./poems/a-dream-within-a-dream";
import { aNamelessGravePoem } from "./poems/a-nameless-grave";
import { aNovemberNightPoem } from "./poems/a-november-night";
import { aPinchOfSaltPoem } from "./poems/a-pinch-of-salt";
import { aPoisonTreePoem } from "./poems/a-poison-tree";
import { aThingOfBeautyIsAJoyForeverPoem } from "./poems/a-thing-of-beauty-is-a-joy-forever";
import { aValedictionForbiddingMourningPoem } from "./poems/a-valediction-forbidding-mourning";
import { acquaintedWithTheNightPoem } from "./poems/acquainted-with-the-night";
import { allTheWorldsAStagePoem } from "./poems/all-the-worlds-a-stage";
import { awakeYoungMenOfEnglandPoem } from "./poems/awake-young-men-of-england";
import { becauseICouldNotStopForDeathPoem } from "./poems/because-i-could-not-stop-for-death";
import { blessGodHeWentAsSoldiersPoem } from "./poems/bless-god-he-went-as-soldiers";
import { chicagoPoem } from "./poems/chicago";
import { doubtNoMoreThatOberonPoem } from "./poems/doubt-no-more-that-oberon";
import { dreamsPoem } from "./poems/dreams";
import { eachAndAllPoem } from "./poems/each-and-all";
import { fireAndIcePoem } from "./poems/fire-and-ice";
import { firstFigPoem } from "./poems/first-fig";
import { fogPoem } from "./poems/fog";
import { goAndCatchAFallingStarPoem } from "./poems/go-and-catch-a-falling-star";
import { goblinFeetPoem } from "./poems/goblin-feet";
import { goliathAndDavidPoem } from "./poems/goliath-and-david";
import { heWishesForTheClothsOfHeavenPoem } from "./poems/he-wishes-for-the-cloths-of-heaven";
import { hopeIsTheThingWithFeathersPoem } from "./poems/hope-is-the-thing-with-feathers";
import { howDoILoveTheePoem } from "./poems/how-do-i-love-thee";
import { iCannotLiveWithYouPoem } from "./poems/i-cannot-live-with-you";
import { iTooSingAmericaPoem } from "./poems/i-too-sing-america";
import { iWanderedLonelyAsACloudPoem } from "./poems/i-wandered-lonely-as-a-cloud";
import { ifPoem } from "./poems/if";
import { inFlandersFieldsPoem } from "./poems/in-flanders-fields";
import { inPraiseOfSolidPeoplePoem } from "./poems/in-praise-of-solid-people";
import { invictusPoem } from "./poems/invictus";
import { jabberwockyPoem } from "./poems/jabberwocky";
import { littleWomenPoemPoem } from "./poems/little-women-poem";
import { loveAndFriendshipPoem } from "./poems/love-and-friendship";
import { loveliestOfTreesPoem } from "./poems/loveliest-of-trees";
import { magdalenWalksPoem } from "./poems/magdalen-walks";
import { mendingWallPoem } from "./poems/mending-wall";
import { myHeartAndIPoem } from "./poems/my-heart-and-i";
import { newHampshirePoem } from "./poems/new-hampshire";
import { nothingWillDiePoem } from "./poems/nothing-will-die";
import { oCaptainMyCaptainPoem } from "./poems/o-captain-my-captain";
import { odeOnAGrecianUrnPoem } from "./poems/ode-on-a-grecian-urn";
import { odeToSilencePoem } from "./poems/ode-to-silence";
import { odeToTheWestWindPoem } from "./poems/ode-to-the-west-wind";
import { ozymandiasPoem } from "./poems/ozymandias";
import { paradiseLostPoem } from "./poems/paradise-lost";
import { pastoralPoem } from "./poems/pastoral";
import { paulReveresRidePoem } from "./poems/paul-reveres-ride";
import { perplexedMusicPoem } from "./poems/perplexed-music";
import { richardCoryPoem } from "./poems/richard-cory";
import { sheWalksInBeautyPoem } from "./poems/she-walks-in-beauty";
import { songOfMyselfPoem } from "./poems/song-of-myself";
import { songOfTheWitchesPoem } from "./poems/song-of-the-witches";
import { sonnet73Poem } from "./poems/sonnet-73";
import { stoppingByWoodsOnASnowyEveningPoem } from "./poems/stopping-by-woods-on-a-snowy-evening";
import { theBalladOfTheHarpWeaverPoem } from "./poems/the-ballad-of-the-harp-weaver";
import { theBattleHymnOfTheRepublicPoem } from "./poems/the-battle-hymn-of-the-republic";
import { theChargeOfTheLightBrigadePoem } from "./poems/the-charge-of-the-light-brigade";
import { theCremationOfSamMcGeePoem } from "./poems/the-cremation-of-sam-mcgee";
import { theHighwaymanPoem } from "./poems/the-highwayman";
import { theLoveSongOfJAlfredPrufrockPoem } from "./poems/the-love-song-of-j-alfred-prufrock";
import { theMinstrelBoyPoem } from "./poems/the-minstrel-boy";
import { theRapeOfTheLockPoem } from "./poems/the-rape-of-the-lock";
import { theRavenPoem } from "./poems/the-raven";
import { theRedWheelbarrowPoem } from "./poems/the-red-wheelbarrow";
import { theRimeOfTheAncientMarinerPoem } from "./poems/the-rime-of-the-ancient-mariner";
import { theRiverMerchantsWifePoem } from "./poems/the-river-merchants-wife";
import { theRoadNotTakenPoem } from "./poems/the-road-not-taken";
import { theSecondComingPoem } from "./poems/the-second-coming";
import { theSongOfHiawathaPoem } from "./poems/the-song-of-hiawatha";
import { theSongOfWanderingAengusPoem } from "./poems/the-song-of-wandering-aengus";
import { theTygerPoem } from "./poems/the-tyger";
import { theWalrusAndTheCarpenterPoem } from "./poems/the-walrus-and-the-carpenter";
import { theWasteLandPoem } from "./poems/the-waste-land";
import { theWorldIsTooMuchWithUsPoem } from "./poems/the-world-is-too-much-with-us";
import { thereWillComeSoftRainsPoem } from "./poems/there-will-come-soft-rains";
import { thirteenWaysOfLookingAtABlackbirdPoem } from "./poems/thirteen-ways-of-looking-at-a-blackbird";
import { toTheVirginsToMakeMuchOfTimePoem } from "./poems/to-the-virgins-to-make-much-of-time";
import { ultimatelyPoem } from "./poems/ultimately";
import { weGrowAccustomedToTheDarkPoem } from "./poems/we-grow-accustomed-to-the-dark";
import { weWearTheMaskPoem } from "./poems/we-wear-the-mask";
import { whenLilacsLastInTheDooryardBloomdPoem } from "./poems/when-lilacs-last-in-the-dooryard-bloomd";
import { whenYouAreOldPoem } from "./poems/when-you-are-old";
import { winterInTheBoulevardPoem } from "./poems/winter-in-the-boulevard";
import type { ComposedPoemPage, PoemAnalysisContent } from "./types";
import { composePoemPage } from "./types";

/**
 * Registered poem analysis modules. Agents write `poems/{slug}.ts`;
 * regenerate this file with: node scripts/register-poem-modules.mjs
 */
const POEM_CONTENTS: PoemAnalysisContent[] = [
  aDayOfSunshinePoem,
  aDreamWithinADreamPoem,
  aNamelessGravePoem,
  aNovemberNightPoem,
  aPinchOfSaltPoem,
  aPoisonTreePoem,
  aThingOfBeautyIsAJoyForeverPoem,
  aValedictionForbiddingMourningPoem,
  acquaintedWithTheNightPoem,
  allTheWorldsAStagePoem,
  awakeYoungMenOfEnglandPoem,
  becauseICouldNotStopForDeathPoem,
  blessGodHeWentAsSoldiersPoem,
  chicagoPoem,
  doubtNoMoreThatOberonPoem,
  dreamsPoem,
  eachAndAllPoem,
  fireAndIcePoem,
  firstFigPoem,
  fogPoem,
  goAndCatchAFallingStarPoem,
  goblinFeetPoem,
  goliathAndDavidPoem,
  heWishesForTheClothsOfHeavenPoem,
  hopeIsTheThingWithFeathersPoem,
  howDoILoveTheePoem,
  iCannotLiveWithYouPoem,
  iTooSingAmericaPoem,
  iWanderedLonelyAsACloudPoem,
  ifPoem,
  inFlandersFieldsPoem,
  inPraiseOfSolidPeoplePoem,
  invictusPoem,
  jabberwockyPoem,
  littleWomenPoemPoem,
  loveAndFriendshipPoem,
  loveliestOfTreesPoem,
  magdalenWalksPoem,
  mendingWallPoem,
  myHeartAndIPoem,
  newHampshirePoem,
  nothingWillDiePoem,
  oCaptainMyCaptainPoem,
  odeOnAGrecianUrnPoem,
  odeToSilencePoem,
  odeToTheWestWindPoem,
  ozymandiasPoem,
  paradiseLostPoem,
  pastoralPoem,
  paulReveresRidePoem,
  perplexedMusicPoem,
  richardCoryPoem,
  sheWalksInBeautyPoem,
  songOfMyselfPoem,
  songOfTheWitchesPoem,
  sonnet73Poem,
  stoppingByWoodsOnASnowyEveningPoem,
  theBalladOfTheHarpWeaverPoem,
  theBattleHymnOfTheRepublicPoem,
  theChargeOfTheLightBrigadePoem,
  theCremationOfSamMcGeePoem,
  theHighwaymanPoem,
  theLoveSongOfJAlfredPrufrockPoem,
  theMinstrelBoyPoem,
  theRapeOfTheLockPoem,
  theRavenPoem,
  theRedWheelbarrowPoem,
  theRimeOfTheAncientMarinerPoem,
  theRiverMerchantsWifePoem,
  theRoadNotTakenPoem,
  theSecondComingPoem,
  theSongOfHiawathaPoem,
  theSongOfWanderingAengusPoem,
  theTygerPoem,
  theWalrusAndTheCarpenterPoem,
  theWasteLandPoem,
  theWorldIsTooMuchWithUsPoem,
  thereWillComeSoftRainsPoem,
  thirteenWaysOfLookingAtABlackbirdPoem,
  toTheVirginsToMakeMuchOfTimePoem,
  ultimatelyPoem,
  weGrowAccustomedToTheDarkPoem,
  weWearTheMaskPoem,
  whenLilacsLastInTheDooryardBloomdPoem,
  whenYouAreOldPoem,
  winterInTheBoulevardPoem,
];

const BY_SLUG = new Map(
  POEM_CONTENTS.map((poem) => [poem.slug, poem] as const),
);

export function listPoemContents(): PoemAnalysisContent[] {
  return POEM_CONTENTS;
}

export function getPoemBySlug(slug: string): PoemAnalysisContent | undefined {
  return BY_SLUG.get(slug);
}

export function isPoemSlug(slug: string): boolean {
  return BY_SLUG.has(slug);
}

export function listPoemPages(): ComposedPoemPage[] {
  return POEM_CONTENTS.map(composePoemPage);
}

export function getPoemPageBySlug(slug: string): ComposedPoemPage | undefined {
  const poem = getPoemBySlug(slug);
  return poem ? composePoemPage(poem) : undefined;
}

/** Index page SEO chrome. */
export const POEMS_INDEX_TITLE = "Poem Analyses for Students — lyriic";
export const POEMS_INDEX_DESCRIPTION =
  "Cited analyses of classic poems students study — meaning, themes, form, and critical views — with key lines shown in a live annotated editor.";
export const POEMS_INDEX_H1 = "Poem analyses";
export const POEMS_INDEX_INTRO =
  "Close readings of poems students often meet in class. Each page sprinkles key lines in lyriic’s editor beside well-cited views on meaning, themes, form, and context.";

/**
 * Assert no copyrighted-skip poems are registered, every registered slug is in
 * the catalog as public-domain (or verify resolved to PD), and slugs are unique.
 */
export function assertPoemRegistryInvariants(): void {
  const skipped = new Set(listSkippedCatalog().map((e) => e.slug));
  const catalogSlugs = new Set(POEM_CATALOG.map((e) => e.slug));
  const seen = new Set<string>();

  for (const poem of POEM_CONTENTS) {
    if (seen.has(poem.slug)) {
      throw new Error(`Duplicate poem content for slug: ${poem.slug}`);
    }
    seen.add(poem.slug);
    if (skipped.has(poem.slug)) {
      throw new Error(
        `Copyrighted poem must not be registered: ${poem.slug}`,
      );
    }
    if (!catalogSlugs.has(poem.slug)) {
      throw new Error(`Poem slug not in catalog: ${poem.slug}`);
    }
    const entry = POEM_CATALOG.find((e) => e.slug === poem.slug);
    if (entry?.copyrightStatus === "copyrighted-skip") {
      throw new Error(`Registered poem is copyrighted-skip: ${poem.slug}`);
    }
  }
}

export type {
  ComposedPoemPage,
  PoemAnalysisContent,
  PoemBlock,
  PoemCitation,
} from "./types";
export { poemPath, composePoemPage, poemWritePath } from "./types";
export { p, excerpt } from "./blocks";
export {
  POEM_CATALOG,
  getCatalogEntry,
  listPublicDomainCatalog,
  listSkippedCatalog,
  listVerifyCatalog,
} from "./catalog";

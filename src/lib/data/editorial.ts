import { links } from "./links";
import type { Champion, NewsItem } from "./types";

export const news: NewsItem[] = [
  {
    id: "scouting",
    date: "2026-11-09",
    title: {
      sv: "Fem saker att följa: Fritz, Ruud och Musetti",
      en: "Five things to watch: Fritz, Ruud and Musetti",
    },
    summary: {
      sv: "ATP-text på arrangörens nyhetssida. Den behandlar Fritz, Ruud och Musetti som de tre högsta seedade under inomhusveckan. Hela genomgången ligger kvar hos arrangören. Den kopieras inte hit.",
      en: "ATP copy on the organizer’s news page. It treats Fritz, Ruud and Musetti as the top three seeds for the indoor week. The full briefing stays on the organizer’s site and is not copied here.",
    },
    url: links.scouting,
    source: { sv: "Stockholm Open / ATP, 9 november 2026", en: "Stockholm Open / ATP, 9 November 2026" },
  },
  {
    id: "sunday",
    date: "2026-11-08",
    title: {
      sv: "Ymer ute efter en tajt andra set",
      en: "Ymer out after a tight second set",
    },
    summary: {
      sv: "Söndagsrapporten beskriver Cerúndolos 6–1, 7–6(4) mot Ymer, Tirantes 7–6, 6–3 mot Munar, två dubbelresultat och måndagens svenska matcher: Borg, Dahlin och Grevelius/Heinonen.",
      en: "Sunday’s report describes Cerúndolo’s 6–1, 7–6(4) win over Ymer, Tirante’s 7–6, 6–3 win over Munar, two doubles results, and Monday’s Swedish matches: Borg, Dahlin and Grevelius/Heinonen.",
    },
    url: links.sunday,
    source: { sv: "Stockholm Open, 8 november 2026", en: "Stockholm Open, 8 November 2026" },
  },
  {
    id: "musetti",
    date: "2026-11-06",
    title: {
      sv: "Musetti bekräftad för inomhusveckan",
      en: "Musetti confirmed for the indoor week",
    },
    summary: {
      sv: "Arrangören skrev att Lorenzo Musetti är klar för 7–14 november och beskrev OS-brons samt en högsta ranking på femma från januari 2026. Turneringen spelas i Kungl. Tennishallen.",
      en: "The organizer wrote that Lorenzo Musetti was confirmed for 7–14 November, mentioning Olympic bronze and a career-high of world No. 5 from January 2026. The event is at the Royal Tennis Hall.",
    },
    url: links.musettiStory,
    source: { sv: "Stockholm Open, 6 november 2026", en: "Stockholm Open, 6 November 2026" },
  },
  {
    id: "fritz",
    date: "2026-10-13",
    title: {
      sv: "Fritz tillbaka i Tennishallen",
      en: "Fritz returning to the Tennis Hall",
    },
    summary: {
      sv: "Arrangören meddelade att Taylor Fritz återvänder 7–14 november. Han spelade senast i Stockholm 2021. Texten nämner också US Open-finalen 2024 och segern i Indian Wells 2022.",
      en: "The organizer announced Taylor Fritz’s return for 7–14 November. He last played Stockholm in 2021. The piece also mentions the 2024 US Open final and the 2022 Indian Wells title.",
    },
    url: links.fritzStory,
    source: { sv: "Stockholm Open, 13 oktober 2026", en: "Stockholm Open, 13 October 2026" },
  },
  {
    id: "ruud",
    date: "2026-05-19",
    title: {
      sv: "Ruud återvänder för att försvara titeln",
      en: "Ruud returns to defend the title",
    },
    summary: {
      sv: "Den regerande mästaren bekräftades för veckan 7–14 november. Han vann 2025 mot Ugo Humbert i raka set. Thomas Enqvist omnämns som turneringsdirektör.",
      en: "The defending champion was confirmed for the week of 7–14 November. He beat Ugo Humbert in straight sets in 2025. Thomas Enqvist is named tournament director.",
    },
    url: links.ruudStory,
    source: { sv: "Stockholm Open, 19 maj 2026", en: "Stockholm Open, 19 May 2026" },
  },
];

export const recentSingles: Champion[] = [
  { year: 2025, winner: "Casper Ruud", runnerUp: "Ugo Humbert", score: "6–2, 6–3" },
  { year: 2024, winner: "Tommy Paul", runnerUp: "Grigor Dimitrov", score: "6–4, 6–3" },
  { year: 2023, winner: "Gaël Monfils", runnerUp: "Pavel Kotov", score: "4–6, 7–6(8), 6–3" },
  { year: 2022, winner: "Holger Rune", runnerUp: "Stefanos Tsitsipas", score: "6–4, 6–4" },
  { year: 2021, winner: "Tommy Paul", runnerUp: "Denis Shapovalov", score: "6–4, 2–6, 6–4" },
  { year: 2019, winner: "Denis Shapovalov", runnerUp: "Filip Krajinović", score: "6–4, 6–4" },
  { year: 2018, winner: "Stefanos Tsitsipas", runnerUp: "Ernests Gulbis", score: "6–4, 6–4" },
  { year: 2017, winner: "Juan Martín del Potro", runnerUp: "Grigor Dimitrov", score: "6–4, 6–2" },
  { year: 2016, winner: "Juan Martín del Potro", runnerUp: "Jack Sock", score: "7–5, 6–1" },
  { year: 2015, winner: "Tomáš Berdych", runnerUp: "Jack Sock", score: "7–6(1), 6–2" },
];

export const landmarkSingles: Champion[] = [
  { year: 2010, winner: "Roger Federer", runnerUp: "Florian Mayer", score: "6–4, 6–3" },
  { year: 1999, winner: "Thomas Enqvist", runnerUp: "Magnus Gustafsson", score: "6–3, 6–4, 6–2" },
  { year: 1996, winner: "Thomas Enqvist", runnerUp: "Todd Martin", score: "7–5, 6–4, 7–6(0)" },
  { year: 1995, winner: "Thomas Enqvist", runnerUp: "Arnaud Boetsch", score: "7–5, 6–4" },
  { year: 1988, winner: "Boris Becker", runnerUp: "Peter Lundgren", score: "6–4, 6–1, 6–1" },
  { year: 1986, winner: "Stefan Edberg", runnerUp: "Mats Wilander", score: "6–2, 6–1, 6–1" },
  { year: 1983, winner: "Mats Wilander", runnerUp: "Tomáš Šmíd", score: "6–1, 7–5" },
  { year: 1980, winner: "Björn Borg", runnerUp: "John McEnroe", score: "6–3, 6–4" },
  { year: 1978, winner: "John McEnroe", runnerUp: "Tim Gullikson", score: "6–2, 6–2" },
  { year: 1969, winner: "Nikola Pilić", runnerUp: "Ilie Năstase", score: "6–4, 4–6, 6–2" },
];

export const doubles2025 = {
  winners: "Alexander Erler / Robert Galloway",
  runners: "Vasil Kirkov / Bart Stevens",
  score: "6–3, 6–2",
};

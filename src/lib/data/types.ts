export type Lang = "sv" | "en";

export type Entry = "WC" | "Q" | "LL" | "ALT" | "PR";

export type Discipline = "singles" | "doubles";

export type Round = "Q1" | "Q2" | "R32" | "R16" | "D";

export type MatchStatus = "completed" | "scheduled" | "pending";

export type Court = "center" | "court1" | "unspecified";

export interface Localized {
  sv: string;
  en: string;
}

export interface Player {
  id: string;
  first: string;
  last: string;
  countryCode?: string;
  country: Localized;
  birth?: string;
  birthplace?: Localized;
  heightCm?: number;
  coach?: string;
  seed?: number;
  qualifyingSeed?: number;
  entry?: Entry;
  mainDraw: boolean;
  officialUrl?: string;
  bio: Localized;
}

export interface PairMember {
  name: string;
  playerId?: string;
  country?: Localized;
}

export interface Side {
  members: PairMember[];
  seed?: number;
  entry?: Entry;
}

export interface SetScore {
  games: [number, number];
  tiebreak?: number;
}

export interface Score {
  sets: SetScore[];
  matchTiebreak?: [number, number];
}

export interface Match {
  id: string;
  discipline: Discipline;
  round: Round;
  status: MatchStatus;
  date?: string;
  court: Court;
  start?: "clock" | "not-before" | "followed-by";
  time?: string;
  order?: number;
  sides: [Side, Side];
  winner?: 0 | 1;
  score?: Score;
  duration?: string;
  umpire?: string;
  note?: Localized;
  sources: string[];
}

export interface R32Tie {
  id: string;
  a?: string;
  b?: string;
  bye?: "a" | "b";
  matchId?: string;
}

export interface NewsItem {
  id: string;
  date: string;
  title: Localized;
  summary: Localized;
  url: string;
  source: Localized;
}

export interface Champion {
  year: number;
  winner: string;
  runnerUp: string;
  score: string;
}

export interface SnapshotMeta {
  id: string;
  live: false;
  fetchedOn: string;
  timezone: "Europe/Stockholm";
  label: Localized;
}

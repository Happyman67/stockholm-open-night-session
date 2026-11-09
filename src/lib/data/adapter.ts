import { doubles2025, landmarkSingles, news, recentSingles } from "./editorial";
import { links, snapshotMeta } from "./links";
import { matches, r32Ties } from "./matches";
import { listedButNotInDraw, players, playersById } from "./players";
import type {
  Court,
  Discipline,
  Lang,
  Localized,
  Match,
  MatchStatus,
  Player,
  Round,
  Score,
  Side,
} from "./types";

/**
 * UI reads tournament data only through this module.
 * `snapshotSource` is a static read of public pages on 9 November 2026.
 * It is not a live feed. A later source can implement the same getters
 * without changing the pages.
 */
export interface TournamentSource {
  id: string;
  live: boolean;
  players: Player[];
  matches: Match[];
}

const snapshotSource: TournamentSource = {
  id: snapshotMeta.id,
  live: snapshotMeta.live,
  players,
  matches,
};

export function getSource(): TournamentSource {
  return snapshotSource;
}

export function getSnapshot() {
  return snapshotMeta;
}

export function getLinks() {
  return links;
}

export function getPlayers() {
  return players;
}

export function getPlayer(id: string) {
  return playersById.get(id);
}

export function getMatches() {
  return matches;
}

export function getMatch(id: string) {
  return matches.find((match) => match.id === id);
}

export function getNews() {
  return news;
}

export function getRecentChampions() {
  return recentSingles;
}

export function getLandmarkChampions() {
  return landmarkSingles;
}

export function getDoubles2025() {
  return doubles2025;
}

export function getEntryListGaps() {
  return listedButNotInDraw;
}

export interface MatchQuery {
  date?: string;
  court?: Court | "all";
  status?: MatchStatus | "all";
  discipline?: Discipline | "all";
  round?: Round | "all";
  q?: string;
}

export function filterMatches(query: MatchQuery = {}): Match[] {
  const q = query.q?.trim().toLowerCase();
  return matches
    .filter((match) => {
      if (query.date === "undated") {
        if (match.date) return false;
      } else if (query.date && query.date !== "all" && match.date !== query.date) {
        return false;
      }
      if (query.court && query.court !== "all" && match.court !== query.court) {
        return false;
      }
      if (query.status && query.status !== "all" && match.status !== query.status) {
        return false;
      }
      if (
        query.discipline &&
        query.discipline !== "all" &&
        match.discipline !== query.discipline
      ) {
        return false;
      }
      if (query.round && query.round !== "all" && match.round !== query.round) {
        return false;
      }
      if (q && !matchSearchText(match).includes(q)) return false;
      return true;
    })
    .sort(compareMatches);
}

export function matchesForPlayer(id: string): Match[] {
  return matches
    .filter((match) =>
      match.sides.some((side) => side.members.some((member) => member.playerId === id)),
    )
    .sort(compareMatches);
}

export function playerName(player: Player) {
  return `${player.first} ${player.last}`;
}

export function sideLabel(side: Side) {
  return side.members
    .map((member) => {
      if (member.playerId) {
        const player = playersById.get(member.playerId);
        if (player) return playerName(player);
      }
      return member.name;
    })
    .join(" / ");
}

export function shortSide(side: Side) {
  return side.members
    .map((member) => {
      if (member.playerId) {
        const player = playersById.get(member.playerId);
        if (player) return `${player.first.charAt(0)}. ${player.last}`;
      }
      return member.name;
    })
    .join(" / ");
}

function matchSearchText(match: Match) {
  return match.sides
    .flatMap((side) => side.members.map((member) => member.name))
    .join(" ")
    .toLowerCase();
}

function compareMatches(a: Match, b: Match) {
  const date = (a.date ?? "9999").localeCompare(b.date ?? "9999");
  if (date !== 0) return date;
  const order = (a.order ?? 50) - (b.order ?? 50);
  if (order !== 0) return order;
  return a.id.localeCompare(b.id);
}

export function setsWon(score: Score, side: 0 | 1) {
  let won = 0;
  for (const set of score.sets) {
    if (set.games[0] === set.games[1]) continue;
    const winner = set.games[0] > set.games[1] ? 0 : 1;
    if (winner === side) won += 1;
  }
  if (score.matchTiebreak) {
    const winner = score.matchTiebreak[0] > score.matchTiebreak[1] ? 0 : 1;
    if (winner === side) won += 1;
  }
  return won;
}

export function formatScore(score: Score | undefined) {
  if (!score) return "";
  const sets = score.sets.map((set) => {
    const tiebreak = set.tiebreak === undefined ? "" : `(${set.tiebreak})`;
    return `${set.games[0]}–${set.games[1]}${tiebreak}`;
  });
  if (score.matchTiebreak) {
    sets.push(`[${score.matchTiebreak[0]}–${score.matchTiebreak[1]}]`);
  }
  return sets.join(", ");
}

const weekdays: Record<string, Localized> = {
  "2026-11-07": { sv: "lördag", en: "Saturday" },
  "2026-11-08": { sv: "söndag", en: "Sunday" },
  "2026-11-09": { sv: "måndag", en: "Monday" },
};

const months: Record<Lang, string[]> = {
  sv: [
    "januari",
    "februari",
    "mars",
    "april",
    "maj",
    "juni",
    "juli",
    "augusti",
    "september",
    "oktober",
    "november",
    "december",
  ],
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};

export function formatDate(iso: string | undefined, lang: Lang) {
  if (!iso) {
    return lang === "sv" ? "Inget publicerat pass" : "No published session";
  }
  const [year, month, day] = iso.split("-").map(Number);
  const weekday = weekdays[iso]?.[lang];
  const body = `${day} ${months[lang][month - 1]} ${year}`;
  return weekday ? `${weekday} ${body}` : body;
}

export function roundLabel(round: Round, lang: Lang, discipline?: Discipline) {
  const map: Record<Round, Localized> = {
    Q1: { sv: "Kval, omgång 1", en: "Qualifying, round 1" },
    Q2: { sv: "Kval, omgång 2", en: "Qualifying, round 2" },
    R32: { sv: "Första omgången", en: "Round of 32" },
    R16: {
      sv: discipline === "doubles" ? "Dubbel, andra omgången" : "Andra omgången",
      en: discipline === "doubles" ? "Doubles, round of 16" : "Round of 16",
    },
    D: { sv: "Dubbel, omgång ej angiven", en: "Doubles, round not stated" },
  };
  return map[round][lang];
}

export function statusLabel(status: MatchStatus, lang: Lang) {
  const map: Record<MatchStatus, Localized> = {
    completed: { sv: "Slutspelad", en: "Completed" },
    scheduled: { sv: "Planerad", en: "Scheduled" },
    pending: { sv: "Saknar pass", en: "No session yet" },
  };
  return map[status][lang];
}

export function courtLabel(court: Court, lang: Lang) {
  const map: Record<Court, Localized> = {
    center: { sv: "Center Court", en: "Centre Court" },
    court1: { sv: "Bana 1", en: "Court 1" },
    unspecified: { sv: "Bana ej angiven", en: "Court not stated" },
  };
  return map[court][lang];
}

export function startLabel(match: Match, lang: Lang) {
  if (match.start === "clock" && match.time) return match.time;
  if (match.start === "not-before" && match.time) {
    return lang === "sv" ? `Ej före ${match.time}` : `Not before ${match.time}`;
  }
  if (match.start === "followed-by") {
    return lang === "sv" ? "Därefter" : "Followed by";
  }
  return lang === "sv" ? "Starttid ej publicerad" : "Start time not published";
}

export function entryLabel(entry: Player["entry"], lang: Lang) {
  if (!entry) return "";
  const map: Record<NonNullable<Player["entry"]>, Localized> = {
    WC: { sv: "Wild card", en: "Wildcard" },
    Q: { sv: "Kval", en: "Qualifier" },
    LL: { sv: "Lucky loser", en: "Lucky loser" },
    ALT: { sv: "Alternativ", en: "Alternate" },
    PR: { sv: "Skyddad ranking", en: "Protected ranking" },
  };
  return map[entry][lang];
}

export interface BracketSlot {
  id: string;
  round: "R32" | "R16" | "QF" | "SF" | "F";
  playerA?: string;
  playerB?: string;
  byeA?: boolean;
  byeB?: boolean;
  winnerId?: string;
  matchId?: string;
  state: "completed" | "scheduled" | "pending" | "bye" | "waiting" | "paired";
}

function tieWinner(tie: (typeof r32Ties)[number]) {
  if (tie.bye === "b") return tie.a;
  if (tie.bye === "a") return tie.b;
  const match = tie.matchId ? getMatch(tie.matchId) : undefined;
  if (match?.status === "completed" && match.winner !== undefined) {
    return match.sides[match.winner].members[0]?.playerId;
  }
  return undefined;
}

export function singlesBracket(): Record<BracketSlot["round"], BracketSlot[]> {
  const r32: BracketSlot[] = r32Ties.map((tie) => {
    const match = tie.matchId ? getMatch(tie.matchId) : undefined;
    const bye = Boolean(tie.bye);
    return {
      id: tie.id,
      round: "R32",
      playerA: tie.a,
      playerB: tie.b,
      byeA: tie.bye === "a",
      byeB: tie.bye === "b",
      winnerId: tieWinner(tie),
      matchId: tie.matchId,
      state: bye ? "bye" : match?.status ?? "pending",
    };
  });

  const r16: BracketSlot[] = Array.from({ length: 8 }, (_, index) => {
    const left = r32[index * 2];
    const right = r32[index * 2 + 1];
    const playerA = left.winnerId;
    const playerB = right.winnerId;
    return {
      id: `r16-${index + 1}`,
      round: "R16",
      playerA,
      playerB,
      state: playerA && playerB ? "paired" : "waiting",
    };
  });

  const empty = (round: BracketSlot["round"], count: number): BracketSlot[] =>
    Array.from({ length: count }, (_, index) => ({
      id: `${round}-${index + 1}`,
      round,
      state: "waiting",
    }));

  return {
    R32: r32,
    R16: r16,
    QF: empty("QF", 4),
    SF: empty("SF", 2),
    F: empty("F", 1),
  };
}

export function mondayCenterCourt() {
  return matches
    .filter((match) => match.date === "2026-11-09" && match.court === "center")
    .sort(compareMatches);
}

export const matchDates = ["2026-11-07", "2026-11-08", "2026-11-09"] as const;

"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageIntro } from "@/components/chrome";
import { useDocumentTitle, useI18n } from "@/lib/i18n";
import {
  courtLabel,
  filterMatches,
  formatDate,
  formatScore,
  matchDates,
  roundLabel,
  shortSide,
  startLabel,
  statusLabel,
} from "@/lib/data/adapter";
import type { Court, Discipline, Match, Round } from "@/lib/data/types";

const title = {
  sv: "Resultat",
  en: "Results",
};

const boards = ["results", "schedule", "all"] as const;
type Board = (typeof boards)[number];
const courts = ["all", "center", "court1", "unspecified"] as const;
const rounds = ["all", "Q1", "Q2", "R32", "R16", "D"] as const;
const disciplines = ["all", "singles", "doubles"] as const;

function oneOf<T extends string>(value: string | null, allowed: readonly T[], fallback: T) {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

export function MatchHub() {
  const { lang } = useI18n();
  useDocumentTitle(title);
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const board = oneOf(params.get("board"), boards, "results");
  const [filters, setFilters] = useState<{
    date: string;
    court: string;
    round: string;
    discipline: string;
    q: string;
  }>(() => ({
    date: oneOf(params.get("date"), ["all", "undated", ...matchDates] as const, "all"),
    court: oneOf(params.get("court"), courts, "all"),
    round: oneOf(params.get("round"), rounds, "all"),
    discipline: oneOf(params.get("discipline"), disciplines, "all"),
    q: params.get("q") ?? "",
  }));

  function writeFilters(next: typeof filters, nextBoard = board) {
    const query = new URLSearchParams();
    if (nextBoard !== "results") query.set("board", nextBoard);
    if (next.date !== "all") query.set("date", next.date);
    if (next.court !== "all") query.set("court", next.court);
    if (next.round !== "all") query.set("round", next.round);
    if (next.discipline !== "all") query.set("discipline", next.discipline);
    if (next.q) query.set("q", next.q);
    const search = query.toString();
    window.history.replaceState(null, "", search ? `${pathname}?${search}` : pathname);
  }

  function update(key: keyof typeof filters, value: string) {
    setFilters((current) => {
      const next = { ...current, [key]: value };
      writeFilters(next);
      return next;
    });
  }

  function chooseBoard(next: Board) {
    const query = new URLSearchParams();
    if (next !== "results") query.set("board", next);
    if (filters.date !== "all") query.set("date", filters.date);
    if (filters.court !== "all") query.set("court", filters.court);
    if (filters.round !== "all") query.set("round", filters.round);
    if (filters.discipline !== "all") query.set("discipline", filters.discipline);
    if (filters.q) query.set("q", filters.q);
    const search = query.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
  }

  function clearFilters() {
    const next = { date: "all", court: "all", round: "all", discipline: "all", q: "" };
    setFilters(next);
    writeFilters(next);
  }

  const { date, court, round, discipline, q } = filters;
  const filtered = filterMatches({
    date: date === "all" ? undefined : date,
    court: court as Court | "all",
    round: round as Round | "all",
    discipline: discipline as Discipline | "all",
    q,
  });
  const matches =
    board === "results"
      ? filtered.filter((match) => match.status === "completed")
      : board === "schedule"
        ? filtered.filter((match) => match.status !== "completed")
        : filtered;

  const boardCopy = {
    results: {
      kicker: lang === "sv" ? "Resultat · 9 november 2026" : "Results · 9 November 2026",
      title: lang === "sv" ? "Resultat" : "Results",
      lede: lang === "sv" ? "Slutspelade matcher." : "Completed matches.",
      count: lang === "sv" ? `${matches.length} resultat` : `${matches.length} results`,
    },
    schedule: {
      kicker: lang === "sv" ? "Schema · 9 november 2026" : "Schedule · 9 November 2026",
      title: lang === "sv" ? "Schema" : "Schedule",
      lede: lang === "sv" ? "Matcher som inte är slutspelade." : "Matches that are not completed.",
      count: lang === "sv" ? `${matches.length} i schemat` : `${matches.length} on the schedule`,
    },
    all: {
      kicker: lang === "sv" ? "Matcher · 9 november 2026" : "Matches · 9 November 2026",
      title: lang === "sv" ? "Matcher" : "Matches",
      lede: lang === "sv" ? "Resultat först, därefter schemat." : "Results first, then the schedule.",
      count: lang === "sv" ? `${matches.length} matcher` : `${matches.length} matches`,
    },
  }[board];

  const sections =
    board === "all"
      ? [
          { key: "completed", label: lang === "sv" ? "Resultat" : "Results", list: matches.filter((match) => match.status === "completed") },
          { key: "scheduled", label: lang === "sv" ? "Schema" : "Schedule", list: matches.filter((match) => match.status !== "completed") },
        ]
      : [{ key: "matches", label: "", list: matches }];

  return (
    <div className="pb-16">
      <PageIntro kicker={boardCopy.kicker} title={boardCopy.title} lede={boardCopy.lede} />
      <div className="mx-auto max-w-[1180px] px-5">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label={lang === "sv" ? "Urval" : "View"}>
          {(
            [
              ["results", lang === "sv" ? "Resultat" : "Results"],
              ["schedule", lang === "sv" ? "Schema" : "Schedule"],
              ["all", lang === "sv" ? "Alla" : "All"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={board === value}
              onClick={() => chooseBoard(value)}
              className={`h-10 rounded-full border px-4 text-sm ${board === value ? "border-amber bg-amber text-[#1a1208]" : "border-white/15 text-white"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <form
          className="panel mt-4 grid gap-4 rounded-xl p-4 md:grid-cols-2 xl:grid-cols-3"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="grid gap-1 text-sm">
            <span>{lang === "sv" ? "Datum" : "Date"}</span>
            <select className="h-11 rounded-lg border border-input bg-transparent px-3" value={date} onChange={(event) => update("date", event.target.value)}>
              <option value="all">{lang === "sv" ? "Alla" : "All"}</option>
              {matchDates.map((item) => (
                <option key={item} value={item}>{formatDate(item, lang)}</option>
              ))}
              <option value="undated">{lang === "sv" ? "Utan datum" : "No date"}</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span>{lang === "sv" ? "Bana" : "Court"}</span>
            <select className="h-11 rounded-lg border border-input bg-transparent px-3" value={court} onChange={(event) => update("court", event.target.value)}>
              <option value="all">{lang === "sv" ? "Alla" : "All"}</option>
              <option value="center">{courtLabel("center", lang)}</option>
              <option value="court1">{courtLabel("court1", lang)}</option>
              <option value="unspecified">{courtLabel("unspecified", lang)}</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span>{lang === "sv" ? "Gren" : "Event"}</span>
            <select className="h-11 rounded-lg border border-input bg-transparent px-3" value={discipline} onChange={(event) => update("discipline", event.target.value)}>
              <option value="all">{lang === "sv" ? "Alla" : "All"}</option>
              <option value="singles">{lang === "sv" ? "Singel" : "Singles"}</option>
              <option value="doubles">{lang === "sv" ? "Dubbel" : "Doubles"}</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span>{lang === "sv" ? "Omgång" : "Round"}</span>
            <select className="h-11 rounded-lg border border-input bg-transparent px-3" value={round} onChange={(event) => update("round", event.target.value)}>
              <option value="all">{lang === "sv" ? "Alla" : "All"}</option>
              {rounds.filter((item) => item !== "all").map((item) => (
                <option key={item} value={item}>{roundLabel(item, lang)}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span>{lang === "sv" ? "Sök spelare" : "Search players"}</span>
            <Input className="h-11" value={q} onChange={(event) => update("q", event.target.value)} placeholder={lang === "sv" ? "Namn" : "Name"} />
          </label>
        </form>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground" aria-live="polite">{boardCopy.count}</p>
          <Button type="button" variant="outline" className="h-9" onClick={clearFilters}>
            {lang === "sv" ? "Rensa filter" : "Clear filters"}
          </Button>
        </div>

        {matches.length === 0 ? (
          <div className="panel mt-6 rounded-xl p-8">
            <h2 className="font-display text-4xl">{lang === "sv" ? "Inga matcher i urvalet" : "No matches in this view"}</h2>
            <Button type="button" className="mt-4 h-10" onClick={clearFilters}>
              {lang === "sv" ? "Rensa filter" : "Clear filters"}
            </Button>
          </div>
        ) : (
          <div className="mt-6 space-y-10">
            {sections.map((section) =>
              section.list.length === 0 ? null : (
                <section key={section.key}>
                  {section.label ? <h2 className="font-display text-3xl tracking-wide">{section.label}</h2> : null}
                  <MatchGroups matches={section.list} board={board} />
                </section>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MatchGroups({ matches, board }: { matches: Match[]; board: Board }) {
  const { lang } = useI18n();
  const groups = new Map<string, Match[]>();
  const ordered = [...matches].sort((a, b) => {
    const date = board === "schedule" ? (a.date ?? "9999").localeCompare(b.date ?? "9999") : (b.date ?? "").localeCompare(a.date ?? "");
    if (date !== 0) return date;
    return (a.order ?? 50) - (b.order ?? 50);
  });
  for (const match of ordered) {
    const key = match.date ?? "undated";
    const list = groups.get(key) ?? [];
    list.push(match);
    groups.set(key, list);
  }
  return (
    <div className="space-y-8">
      {[...groups.entries()].map(([key, list]) => (
        <div key={key}>
          <h3 className="font-display text-2xl tracking-wide">{formatDate(key === "undated" ? undefined : key, lang)}</h3>
          <ul className="mt-3 divide-y divide-white/10 border-y border-white/10">
            {list.map((match) => (
              <li key={match.id}>
                <Link href={`/matcher/${match.id}`} className="grid gap-2 py-4 sm:grid-cols-[8rem_1fr_auto] sm:items-center">
                  <span className="text-sm text-cyan">{startLabel(match, lang)}</span>
                  <span>
                    <span className="block">{shortSide(match.sides[0])} – {shortSide(match.sides[1])}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {match.discipline === "doubles" ? (lang === "sv" ? "Dubbel" : "Doubles") : lang === "sv" ? "Singel" : "Singles"}
                      {" · "}
                      {roundLabel(match.round, lang, match.discipline)}
                      {" · "}
                      {courtLabel(match.court, lang)}
                    </span>
                  </span>
                  <span className={`text-sm ${match.status === "completed" ? "text-foreground" : "text-amber"}`}>
                    {match.score ? formatScore(match.score) : statusLabel(match.status, lang)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

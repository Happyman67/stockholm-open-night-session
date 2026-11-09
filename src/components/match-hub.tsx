"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
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
  getLinks,
  matchDates,
  roundLabel,
  shortSide,
  startLabel,
  statusLabel,
} from "@/lib/data/adapter";
import type { Court, Discipline, Match, MatchStatus, Round } from "@/lib/data/types";

const title = {
  sv: "Matcher",
  en: "Matches",
};

const statuses = ["all", "completed", "scheduled", "pending"] as const;
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
  const links = getLinks();
  const [filters, setFilters] = useState<{
    date: string;
    court: string;
    status: string;
    round: string;
    discipline: string;
    q: string;
  }>(() => ({
    date: oneOf(params.get("date"), ["all", "undated", ...matchDates] as const, "all"),
    court: oneOf(params.get("court"), courts, "all"),
    status: oneOf(params.get("status"), statuses, "all"),
    round: oneOf(params.get("round"), rounds, "all"),
    discipline: oneOf(params.get("discipline"), disciplines, "all"),
    q: params.get("q") ?? "",
  }));

  function writeFilters(next: typeof filters) {
    const query = new URLSearchParams();
    if (next.date !== "all") query.set("date", next.date);
    if (next.court !== "all") query.set("court", next.court);
    if (next.status !== "all") query.set("status", next.status);
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

  function clearFilters() {
    const next = { date: "all", court: "all", status: "all", round: "all", discipline: "all", q: "" };
    setFilters(next);
    writeFilters(next);
  }

  const { date, court, status, round, discipline, q } = filters;

  const matches = filterMatches({
    date: date === "all" ? undefined : date,
    court: court as Court | "all",
    status: status as MatchStatus | "all",
    round: round as Round | "all",
    discipline: discipline as Discipline | "all",
    q,
  });

  const groups = new Map<string, Match[]>();
  for (const match of matches) {
    const key = match.date ?? "undated";
    const list = groups.get(key) ?? [];
    list.push(match);
    groups.set(key, list);
  }

  return (
    <div className="pb-16">
      <PageIntro
        kicker={lang === "sv" ? "Matchnav · ögonblicksbild" : "Match hub · snapshot"}
        title={lang === "sv" ? "Schema, resultat, kvar att spela" : "Order, results, still to play"}
        lede={
          lang === "sv"
            ? "Ett nav för det som gick att läsa 9 november 2026: kval, singel och de dubbelmatcher som var publicerade. Inget är märkt live. Saknas ett pass står det så."
            : "One hub for what could be read on 9 November 2026: qualifying, singles and the doubles matches that were published. Nothing is marked live. If a session was missing, it says so."
        }
      />
      <div className="mx-auto max-w-[1180px] px-5">
        <form
          className="panel grid gap-4 rounded-xl p-4 md:grid-cols-2 xl:grid-cols-3"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="grid gap-1 text-sm">
            <span>{lang === "sv" ? "Datum" : "Date"}</span>
            <select className="h-11 rounded-lg border border-input bg-transparent px-3" value={date} onChange={(event) => update("date", event.target.value)}>
              <option value="all">{lang === "sv" ? "Alla" : "All"}</option>
              {matchDates.map((item) => (
                <option key={item} value={item}>{formatDate(item, lang)}</option>
              ))}
              <option value="undated">{lang === "sv" ? "Utan publicerat pass" : "No published session"}</option>
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
            <span>{lang === "sv" ? "Status" : "Status"}</span>
            <select className="h-11 rounded-lg border border-input bg-transparent px-3" value={status} onChange={(event) => update("status", event.target.value)}>
              <option value="all">{lang === "sv" ? "Alla" : "All"}</option>
              <option value="completed">{statusLabel("completed", lang)}</option>
              <option value="scheduled">{statusLabel("scheduled", lang)}</option>
              <option value="pending">{statusLabel("pending", lang)}</option>
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
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {lang === "sv" ? `${matches.length} matcher` : `${matches.length} matches`}
          </p>
          <Button type="button" variant="outline" className="h-9" onClick={clearFilters}>
            {lang === "sv" ? "Rensa filter" : "Clear filters"}
          </Button>
        </div>

        {matches.length === 0 ? (
          <div className="panel mt-6 rounded-xl p-8">
            <h2 className="font-display text-4xl">{lang === "sv" ? "Inget träffar filtren" : "Nothing matches the filters"}</h2>
            <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
              {lang === "sv"
                ? "Prova att rensa, eller öppna arrangörens spelschema. Den här sajten hittar inte på matcher för att fylla ett tomt läge."
                : "Try clearing the filters, or open the organizer’s order of play. This site does not invent matches to fill an empty state."}
            </p>
            <div className="mt-4 flex gap-4">
              <Button type="button" className="h-10" onClick={clearFilters}>
                {lang === "sv" ? "Visa allt i ögonblicksbilden" : "Show the whole snapshot"}
              </Button>
              <a className="self-center text-sm text-amber" href={links.schedule} target="_blank" rel="noreferrer">
                {lang === "sv" ? "Officiellt schema" : "Official schedule"}
              </a>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-8">
            {[...groups.entries()].map(([key, list]) => (
              <section key={key}>
                <h2 className="font-display text-3xl tracking-wide">{formatDate(key === "undated" ? undefined : key, lang)}</h2>
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
              </section>
            ))}
          </div>
        )}
        <p className="mt-8 text-sm text-muted-foreground">
          {lang === "sv"
            ? "Vill du se arrangörens egen livesida gör du det där, inte här."
            : "The organizer’s own live page stays on their site, not here."}{" "}
          <a className="text-amber" href={links.organizerLive} target="_blank" rel="noreferrer">
            {lang === "sv" ? "Öppna den" : "Open it"}
          </a>
        </p>
      </div>
    </div>
  );
}

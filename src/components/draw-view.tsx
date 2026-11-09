"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { PageIntro } from "@/components/chrome";
import { useDocumentTitle, useI18n } from "@/lib/i18n";
import {
  filterMatches,
  formatScore,
  getPlayer,
  playerName,
  singlesBracket,
  statusLabel,
} from "@/lib/data/adapter";
import type { BracketSlot } from "@/lib/data/adapter";

const title = { sv: "Lottning", en: "Draw" };
const rounds = ["R32", "R16", "QF", "SF", "F"] as const;

const roundName = {
  sv: { R32: "Första omgången", R16: "Andra omgången", QF: "Kvartsfinal", SF: "Semifinal", F: "Final" },
  en: { R32: "Round of 32", R16: "Round of 16", QF: "Quarter-final", SF: "Semi-final", F: "Final" },
} as const;

export function DrawView() {
  const { lang } = useI18n();
  useDocumentTitle(title);
  const params = useSearchParams();
  const pathname = usePathname();
  const [event, setEvent] = useState(params.get("event") === "doubles" ? "doubles" : "singles");
  const [round, setRound] = useState<(typeof rounds)[number]>(
    rounds.includes(params.get("round") as (typeof rounds)[number])
      ? (params.get("round") as (typeof rounds)[number])
      : "R32",
  );
  const bracket = singlesBracket();

  function choose(nextEvent: string, nextRound: (typeof rounds)[number]) {
    setEvent(nextEvent);
    setRound(nextRound);
    const query = new URLSearchParams();
    if (nextEvent !== "singles") query.set("event", nextEvent);
    if (nextRound !== "R32") query.set("round", nextRound);
    const search = query.toString();
    window.history.replaceState(null, "", search ? `${pathname}?${search}` : pathname);
  }

  const doubles = filterMatches({ discipline: "doubles" });

  return (
    <div className="pb-16">
      <PageIntro
        kicker={lang === "sv" ? "Lottning · 9 november 2026" : "Draw · 9 November 2026"}
        title={lang === "sv" ? "Singellottning" : "Singles draw"}
        lede={
          lang === "sv"
            ? "28 spelare och fyra fripass. En spelare går vidare när matchen är slutspelad."
            : "28 players and four byes. A player moves on when the match is completed."
        }
      />
      <div className="mx-auto max-w-[1180px] px-5">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label={lang === "sv" ? "Gren" : "Event"}>
          <Tab pressed={event === "singles"} onClick={() => choose("singles", round)}>
            {lang === "sv" ? "Singel" : "Singles"}
          </Tab>
          <Tab pressed={event === "doubles"} onClick={() => choose("doubles", round)}>
            {lang === "sv" ? "Dubbel" : "Doubles"}
          </Tab>
        </div>

        {event === "singles" ? (
          <>
            <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label={lang === "sv" ? "Omgång" : "Round"}>
              {rounds.map((item) => (
                <Tab key={item} pressed={round === item} onClick={() => choose(event, item)}>
                  {roundName[lang][item]}
                </Tab>
              ))}
            </div>
            {(round === "QF" || round === "SF" || round === "F") && (
              <p className="panel mt-6 rounded-xl p-5 text-sm leading-6">
                {lang === "sv"
                  ? "Inga namn i den här omgången."
                  : "No names in this round."}
              </p>
            )}
            <ul className="mt-6 grid gap-3 md:grid-cols-2">
              {bracket[round].map((slot) => (
                <li key={slot.id}>
                  <SlotCard slot={slot} />
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">
              {lang === "sv"
                ? "Kvartsfinal, semifinal och final har inga namn än."
                : "Quarter-finals, semi-finals and the final have no names yet."}
            </p>
          </>
        ) : (
          <div className="mt-6">
            <div className="panel rounded-xl p-5">
              <h2 className="font-display text-4xl">{lang === "sv" ? "Dubbel" : "Doubles"}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                {lang === "sv" ? "Publicerade dubbelmatcher." : "Published doubles matches."}
              </p>
            </div>
            <ul className="mt-4 divide-y divide-white/10 border-y border-white/10">
              {doubles.map((match) => (
                <li key={match.id}>
                  <Link href={`/matcher/${match.id}`} className="flex flex-wrap items-baseline justify-between gap-3 py-4">
                    <span>
                      {match.sides[0].members.map((member) => member.name).join(" / ")}
                      {" – "}
                      {match.sides[1].members.map((member) => member.name).join(" / ")}
                    </span>
                    <span className="text-sm text-amber">{match.score ? formatScore(match.score) : statusLabel(match.status, lang)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function Tab({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={pressed}
      onClick={onClick}
      className={`h-10 rounded-full border px-4 text-sm ${pressed ? "border-amber bg-amber text-[#1a1208]" : "border-white/15 text-foreground"}`}
    >
      {children}
    </button>
  );
}

function SlotCard({ slot }: { slot: BracketSlot }) {
  const { lang } = useI18n();
  return (
    <div className="rounded-xl border border-white/10 p-4">
      <PlayerLine id={slot.playerA} bye={slot.byeA} winner={slot.winnerId} />
      <PlayerLine id={slot.playerB} bye={slot.byeB} winner={slot.winnerId} />
      <p className="mt-3 text-xs text-muted-foreground">
        {slot.state === "bye"
          ? lang === "sv"
            ? "Fripass"
            : "Bye"
          : slot.state === "completed"
            ? lang === "sv"
              ? "Slutspelad"
              : "Completed"
            : slot.state === "scheduled"
              ? lang === "sv"
                ? "Planerad"
                : "Scheduled"
              : slot.state === "paired"
                ? lang === "sv"
                ? "Båda vidare. Matchen är inte spelad."
                : "Both through. The match has not been played."
                : slot.state === "pending"
                  ? lang === "sv"
                  ? "I lottningen, utan tid"
                  : "In the draw, no start time"
                  : lang === "sv"
                    ? "Inte avgjord"
                    : "Not decided"}
      </p>
      {slot.matchId ? (
        <Link href={`/matcher/${slot.matchId}`} className="mt-2 inline-block text-sm text-amber">
          {lang === "sv" ? "Matchfakta" : "Match facts"}
        </Link>
      ) : null}
    </div>
  );
}

function PlayerLine({ id, bye, winner }: { id?: string; bye?: boolean; winner?: string }) {
  const { lang } = useI18n();
  if (bye) return <p className="py-1 text-muted-foreground">{lang === "sv" ? "Fripass" : "Bye"}</p>;
  if (!id) return <p className="py-1 text-muted-foreground">{lang === "sv" ? "Inte klart" : "Not yet"}</p>;
  const player = getPlayer(id);
  if (!player) return null;
  const mark = [player.seed ? player.seed : null, player.entry].filter(Boolean).join(" · ");
  return (
    <p className={`py-1 ${winner === id ? "text-amber" : ""}`}>
      <Link href={`/spelare/${id}`} className="hover:underline">
        {playerName(player)}
      </Link>
      {mark ? <span className="ml-2 text-xs text-muted-foreground">{mark}</span> : null}
    </p>
  );
}

"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { PageIntro } from "@/components/chrome";
import { useDocumentTitle, useI18n } from "@/lib/i18n";
import {
  filterMatches,
  formatScore,
  getLinks,
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
  const links = getLinks();

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
        kicker={lang === "sv" ? "Lottning · 9 november" : "Draw · 9 November"}
        title={lang === "sv" ? "Singel går att läsa. Dubbel bara delvis." : "Singles can be read. Doubles only in part."}
        lede={
          lang === "sv"
            ? "Singellottningen följer den ordning som gick att läsa hos arrangören och ATP den 9 november. Fyra fripass. Bara färdigspelade matcher flyttar en spelare uppåt. Dubbelns hela träd fanns inte i den läsbara texten."
            : "The singles draw follows the order that could be read from the organizer and ATP on 9 November. Four byes. Only completed matches move a player up. The full doubles tree was not in the readable text."
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
                  ? "Den här omgången hade inga namn den 9 november. Korten nedan är tomma med flit."
                  : "This round had no names on 9 November. The cards below are empty on purpose."}
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
                ? "Kvartsfinal, semifinal och final hade inga namn den 9 november. De visas tomma med flit."
                : "Quarter-finals, semi-finals and the final had no names on 9 November. They are empty on purpose."}{" "}
              <a className="text-amber" href={links.draw} target="_blank" rel="noreferrer">
                {lang === "sv" ? "Arrangörens lottning" : "Organizer draw"}
              </a>
            </p>
          </>
        ) : (
          <div className="mt-6">
            <div className="panel rounded-xl p-5">
              <h2 className="font-display text-4xl">{lang === "sv" ? "Ingen komplett dubbellottning" : "No complete doubles draw"}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                {lang === "sv"
                  ? "Här listas bara dubbelmatcher som gick att verifiera i resultat, schema eller söndagsrapporten. Ett tomt fält betyder att källan inte namngav resten."
                  : "Only doubles matches that could be verified in results, the order of play or Sunday’s report are listed. An empty field means the source did not name the rest."}
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
                ? "Planerad, inget resultat"
                : "Scheduled, no result"
              : slot.state === "paired"
                ? lang === "sv"
                  ? "Båda klara. Mötet är inte publicerat som spelat."
                  : "Both through. The meeting is not published as played."
                : slot.state === "pending"
                  ? lang === "sv"
                    ? "I lottningen, utan pass"
                    : "In the draw, no session"
                  : lang === "sv"
                    ? "Inte avgjord i ögonblicksbilden"
                    : "Not decided in the snapshot"}
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

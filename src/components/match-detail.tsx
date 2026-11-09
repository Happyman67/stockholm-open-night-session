"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { useDocumentTitle, useI18n } from "@/lib/i18n";
import {
  courtLabel,
  entryLabel,
  formatDate,
  formatScore,
  getLinks,
  getMatch,
  getPlayer,
  roundLabel,
  sideLabel,
  startLabel,
  statusLabel,
} from "@/lib/data/adapter";

export function MatchDetail({ id }: { id: string }) {
  const { lang } = useI18n();
  const match = getMatch(id);
  const links = getLinks();
  useDocumentTitle({
    sv: match ? sideLabel(match.sides[0]) : "Match",
    en: match ? sideLabel(match.sides[0]) : "Match",
  });
  if (!match) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-[900px] px-5 py-12">
      <p className="kicker">{statusLabel(match.status, lang)} · {lang === "sv" ? "Ögonblicksbild" : "Snapshot"}</p>
      <h1 className="mt-3 font-display text-5xl leading-none tracking-wide sm:text-6xl">
        {sideLabel(match.sides[0])}
        <span className="mt-2 block text-amber">{lang === "sv" ? "mot" : "vs"} {sideLabel(match.sides[1])}</span>
      </h1>
      <p className="mt-6 text-lg">
        {match.score ? formatScore(match.score) : lang === "sv" ? "Inget resultat i ögonblicksbilden." : "No result in the snapshot."}
      </p>
      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <Fact label={lang === "sv" ? "Datum" : "Date"} value={formatDate(match.date, lang)} />
        <Fact label={lang === "sv" ? "Bana" : "Court"} value={courtLabel(match.court, lang)} />
        <Fact label={lang === "sv" ? "Omgång" : "Round"} value={roundLabel(match.round, lang, match.discipline)} />
        <Fact label={lang === "sv" ? "Start" : "Start"} value={startLabel(match, lang)} />
        <Fact label={lang === "sv" ? "Gren" : "Event"} value={match.discipline === "doubles" ? (lang === "sv" ? "Dubbel" : "Doubles") : lang === "sv" ? "Singel" : "Singles"} />
        {match.duration ? <Fact label={lang === "sv" ? "Tid på banan" : "Time on court"} value={match.duration} /> : null}
        {match.umpire ? <Fact label={lang === "sv" ? "Domare hos ATP" : "Umpire on ATP"} value={match.umpire} /> : null}
      </dl>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {match.sides.map((side, index) => (
          <div key={index} className={`rounded-xl border p-4 ${match.winner === index ? "border-amber/50" : "border-white/10"}`}>
            <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
              {match.winner === index ? (lang === "sv" ? "Vann" : "Won") : lang === "sv" ? "Sida" : "Side"}
              {side.seed ? ` · ${side.seed}` : ""}
              {side.entry ? ` · ${entryLabel(side.entry, lang)}` : ""}
            </p>
            <ul className="mt-2 space-y-1">
              {side.members.map((member) => (
                <li key={member.name}>
                  {member.playerId ? (
                    <Link href={`/spelare/${member.playerId}`} className="text-lg hover:text-amber">
                      {getPlayer(member.playerId)?.first} {getPlayer(member.playerId)?.last}
                    </Link>
                  ) : (
                    <span className="text-lg">{member.name}</span>
                  )}
                  {member.country ? <span className="ml-2 text-sm text-muted-foreground">{member.country[lang]}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {match.note ? <p className="mt-6 text-sm leading-6 text-muted-foreground">{match.note[lang]}</p> : null}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        {match.sources.map((url) => (
          <a key={url} href={url} target="_blank" rel="noreferrer" className="text-amber">
            {lang === "sv" ? "Källa" : "Source"}
          </a>
        ))}
        <Link href="/matcher" className="text-foreground">{lang === "sv" ? "Tillbaka till navet" : "Back to the hub"}</Link>
        <Link href="/lottning" className="text-foreground">{lang === "sv" ? "Lottning" : "Draw"}</Link>
        <a href={links.results} target="_blank" rel="noreferrer" className="text-cyan">
          {lang === "sv" ? "Arrangörens resultat" : "Organizer results"}
        </a>
      </div>
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-white/10 pt-3">
      <dt className="text-xs tracking-[0.16em] text-muted-foreground uppercase">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}

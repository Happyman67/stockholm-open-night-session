"use client";

import Link from "next/link";
import { useDocumentTitle, useI18n } from "@/lib/i18n";
import {
  formatDate,
  formatScore,
  getMatches,
  getPlayer,
  roundLabel,
  shortSide,
} from "@/lib/data/adapter";

const title = {
  sv: "Stockholm Open",
  en: "Stockholm Open",
};

const featuredIds = [
  "cameron-norrie",
  "alex-michelsen",
  "juan-manuel-cerundolo",
  "thiago-agustin-tirante",
] as const;

const lines = {
  sv: {
    "cameron-norrie": "7–5, 6–0 mot Duckworth",
    "alex-michelsen": "6–2, 6–3 mot Hanfmann",
    "juan-manuel-cerundolo": "6–1, 7–6 mot Ymer",
    "thiago-agustin-tirante": "7–6, 6–3 mot Munar",
  },
  en: {
    "cameron-norrie": "7–5, 6–0 vs Duckworth",
    "alex-michelsen": "6–2, 6–3 vs Hanfmann",
    "juan-manuel-cerundolo": "6–1, 7–6 vs Ymer",
    "thiago-agustin-tirante": "7–6, 6–3 vs Munar",
  },
} as const;

export function HomeLower() {
  const { lang } = useI18n();
  useDocumentTitle(title);
  const results = getMatches()
    .filter((match) => match.status === "completed")
    .sort((a, b) => {
      const date = (b.date ?? "").localeCompare(a.date ?? "");
      if (date !== 0) return date;
      return (a.order ?? 50) - (b.order ?? 50);
    })
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-[1180px] px-5 pt-8 pb-16">
      <section>
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl tracking-wide sm:text-4xl">
            {lang === "sv" ? "Spelarprofiler" : "Player profiles"}
          </h2>
          <Link href="/spelare" className="text-sm text-amber">
            {lang === "sv" ? "Alla spelare" : "All players"}
          </Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {featuredIds.map((id, index) => {
            const player = getPlayer(id);
            if (!player) return null;
            const tone = index % 2 === 0 ? "amber" : "cyan";
            return (
              <Link
                key={id}
                href={`/spelare/${id}`}
                className={`profile-card profile-card-${tone} grid grid-cols-[4.5rem_1fr] items-center gap-3 rounded-2xl p-3`}
              >
                <PlayerMark tone={tone} />
                <span>
                  <span className={`block text-[0.65rem] tracking-[0.16em] uppercase ${tone === "amber" ? "text-amber" : "text-cyan"}`}>
                    {player.countryCode}
                    {player.seed ? ` · SEED ${player.seed}` : ""}
                  </span>
                  <span className="mt-1 block font-display text-3xl leading-none tracking-wide">{player.last.toUpperCase()}</span>
                  <span className="mt-1 block text-xs text-[#d9d1c4]">{lines[lang][id]}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="kicker">{lang === "sv" ? "Resultat · 9 november 2026" : "Results · 9 November 2026"}</p>
            <h2 className="mt-2 font-display text-3xl tracking-wide sm:text-4xl">
              {lang === "sv" ? "Slutspelade matcher" : "Completed matches"}
            </h2>
          </div>
          <Link href="/matcher" className="text-sm text-amber">
            {lang === "sv" ? "Hela listan" : "Full list"}
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-white/10 border-y border-white/10">
          {results.map((match) => (
            <li key={match.id}>
              <Link href={`/matcher/${match.id}`} className="grid gap-1 py-3 sm:grid-cols-[9rem_1fr_auto] sm:items-center sm:gap-4">
                <span className="text-xs tracking-[0.08em] text-muted-foreground uppercase">
                  {formatDate(match.date, lang)}
                </span>
                <span>
                  <span className="block text-sm">{shortSide(match.sides[0])} – {shortSide(match.sides[1])}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {roundLabel(match.round, lang, match.discipline)}
                  </span>
                </span>
                <span className="font-display text-xl tracking-wide text-white">{formatScore(match.score)}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted-foreground">
          <Link href="/matcher?board=schedule" className="text-amber">
            {lang === "sv" ? "Schema för matcher som inte är spelade" : "Schedule for matches still to be played"}
          </Link>
        </p>
      </section>
    </div>
  );
}

function PlayerMark({ tone }: { tone: "amber" | "cyan" }) {
  const color = tone === "amber" ? "#e39a45" : "#8eebff";
  return (
    <span className={`player-mark player-mark-${tone}`} aria-hidden>
      <svg viewBox="0 0 80 96" className="h-20 w-14">
        <ellipse cx="40" cy="90" rx="22" ry="4" fill={color} opacity="0.35" />
        <circle cx="40" cy="24" r="10" fill={color} />
        <path d="M22 78c2-18 8-26 18-26s16 8 18 26" fill={color} />
        <path d="M54 42c10 1 16 8 18 16" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="74" cy="60" rx="7" ry="9" fill="none" stroke={color} strokeWidth="2" />
      </svg>
    </span>
  );
}

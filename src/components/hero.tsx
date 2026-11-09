"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CourtScene } from "@/components/court-scene";
import { useI18n } from "@/lib/i18n";
import {
  formatScore,
  getMatch,
  mondayCenterCourt,
  shortSide,
  startLabel,
  statusLabel,
} from "@/lib/data/adapter";
import type { Match } from "@/lib/data/types";

export function Hero() {
  const { lang } = useI18n();
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);
  const [forcePlay, setForcePlay] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [lite, setLite] = useState(false);
  const order = mondayCenterCourt();
  const featured = getMatch("m-duckworth-norrie");

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 760px)");
    const update = () => {
      setReduced(motion.matches);
      setLite(narrow.matches);
      setReady(true);
    };
    update();
    motion.addEventListener("change", update);
    narrow.addEventListener("change", update);
    return () => {
      motion.removeEventListener("change", update);
      narrow.removeEventListener("change", update);
    };
  }, []);

  const showScene = ready && (!reduced || forcePlay);

  return (
    <section className="relative isolate min-h-[920px] overflow-hidden lg:h-[680px] lg:min-h-[680px]" aria-labelledby="hero-title">
      <div className="absolute inset-0">
        <CourtScene lite={lite} playing={showScene && playing} />
      </div>
      <div className="hero-scrim pointer-events-none absolute inset-0" />
      <p className="sr-only">
        {lang === "sv"
          ? "Mörk tennisarena med bana, nät och färgade strålkastare."
          : "Dark tennis arena with a court, net and coloured spotlights."}
      </p>
      <div className="relative z-10 mx-auto flex h-full max-w-[1180px] flex-col justify-end px-5 pt-24 pb-8 lg:justify-center lg:pb-10">
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.05fr)_340px] lg:items-center">
          <div>
            <p className="kicker">ATP 250</p>
            <h1 id="hero-title" className="mt-3 font-display text-[17vw] leading-[0.82] font-semibold tracking-[-0.03em] sm:text-7xl lg:text-[6.6rem]">
              <span className="block text-white">STOCKHOLM</span>
              <span className="word-open block">OPEN</span>
            </h1>
            <p className="mt-4 text-base text-[#f4efe6] sm:text-lg">
              {lang === "sv" ? "Resultat · 9 november 2026" : "Results · 9 November 2026"}
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm text-[#d9d1c4]">
              <span className="inline-block size-1.5 rounded-full bg-amber" aria-hidden />
              Kungl. Tennishallen
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/matcher" className="inline-flex h-10 items-center rounded-full border border-amber/80 px-4 text-sm text-amber hover:bg-amber/10">
                {lang === "sv" ? "Alla resultat" : "All results"}
              </Link>
              <Link href="/lottning" className="inline-flex h-10 items-center rounded-full border border-white/20 px-4 text-sm text-white hover:bg-white/10">
                {lang === "sv" ? "Lottning" : "Draw"}
              </Link>
            </div>
          </div>
          <div className="grid gap-3">
            <aside className="glass-panel rounded-2xl p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[0.68rem] tracking-[0.18em] text-[#d7ecff] uppercase">
                  {lang === "sv" ? "Center Court" : "Centre Court"}
                </p>
                <p className="text-[0.68rem] tracking-[0.16em] text-amber uppercase">
                  {lang === "sv" ? "9 november" : "9 November"}
                </p>
              </div>
              <ol className="mt-2 divide-y divide-white/10">
                {order.map((match) => (
                  <li key={match.id}>
                    <Link href={`/matcher/${match.id}`} className="grid grid-cols-[4.6rem_1fr_auto] items-center gap-2 py-2.5 hover:text-amber">
                      <span className="text-xs text-cyan">{startLabel(match, lang)}</span>
                      <span className="truncate text-sm">{compactSide(match.sides[0])} – {compactSide(match.sides[1])}</span>
                      <span className={`text-xs ${match.status === "completed" ? "text-white" : "text-amber"}`}>
                        {match.score ? formatScore(match.score) : statusLabel(match.status, lang)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </aside>
            {featured?.score ? <ScorePanel match={featured} lang={lang} /> : null}
          </div>
        </div>
      </div>
      <button
        type="button"
        className="absolute bottom-4 left-5 z-20 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-xs text-[#d7ecff] backdrop-blur-sm"
        onClick={() => (showScene ? setPlaying((value) => !value) : setForcePlay(true))}
        aria-pressed={showScene ? playing : false}
      >
        {showScene
          ? playing
            ? lang === "sv"
              ? "Pausa ljuset"
              : "Pause the lights"
            : lang === "sv"
              ? "Spela ljuset"
              : "Play the lights"
          : lang === "sv"
            ? "Visa ljuset"
            : "Show the lights"}
      </button>
    </section>
  );
}

function compactSide(side: Match["sides"][number]) {
  return side.members
    .map((member) => {
      const parts = member.name.trim().split(/\s+/);
      if (parts.length < 2) return parts[0] ?? "";
      return `${parts[0].charAt(0)}. ${parts[parts.length - 1]}`;
    })
    .join(" / ");
}

function ScorePanel({ match, lang }: { match: Match; lang: "sv" | "en" }) {
  return (
    <aside className="glass-panel rounded-2xl p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.68rem] tracking-[0.18em] text-cyan uppercase">
          {lang === "sv" ? "Resultat" : "Result"}
        </p>
        <p className="text-[0.68rem] tracking-[0.16em] text-amber uppercase">
          {lang === "sv" ? "Slutspelad" : "Completed"}
        </p>
      </div>
      <div className="mt-3 space-y-2">
        {match.sides.map((side, index) => (
          <div key={index} className="flex items-center justify-between gap-3 border-t border-white/10 pt-2">
            <span className={match.winner === index ? "text-white" : "text-white/65"}>
              {shortSide(side)}
            </span>
            <span className="flex gap-3 font-display text-2xl tracking-wide text-white">
              {match.score?.sets.map((set, setIndex) => (
                <span key={setIndex}>{set.games[index]}</span>
              ))}
            </span>
          </div>
        ))}
      </div>
      <Link href={`/matcher/${match.id}`} className="mt-3 inline-block text-xs tracking-[0.12em] text-amber uppercase">
        {lang === "sv" ? "Matchfakta" : "Match facts"} →
      </Link>
    </aside>
  );
}

"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Component, useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { StaticCourt } from "@/components/static-court";
import { useI18n } from "@/lib/i18n";
import {
  formatScore,
  mondayCenterCourt,
  roundLabel,
  shortSide,
  startLabel,
  statusLabel,
} from "@/lib/data/adapter";

const CourtScene = dynamic(
  () => import("@/components/court-scene").then((mod) => mod.CourtScene),
  { ssr: false },
);

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return <StaticCourt />;
    return this.props.children;
  }
}

export function Hero() {
  const { lang } = useI18n();
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);
  const [forcePlay, setForcePlay] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [lite, setLite] = useState(false);
  const order = mondayCenterCourt();

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
    <section className="relative isolate min-h-[100svh] overflow-hidden" aria-labelledby="hero-title">
      <div className="absolute inset-0">
        {showScene ? (
          <SceneBoundary>
            <CourtScene lite={lite} playing={playing} />
          </SceneBoundary>
        ) : (
          <StaticCourt />
        )}
      </div>
      <div className="hero-scrim pointer-events-none absolute inset-0" />
      <p className="sr-only">
        {lang === "sv"
          ? "Dekorativ animation av en blå inomhusbana, en studsande boll och bärnstensljus. Inte en sändning från arenan."
          : "Decorative animation of a blue indoor court, a bouncing ball and amber light. Not a broadcast from the arena."}
      </p>
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1180px] flex-col justify-end px-5 pt-28 pb-8 lg:justify-center lg:pb-16">
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.15fr)_340px] lg:items-center">
          <div>
            <p className="kicker">ATP 250 · Kungl. Tennishallen</p>
            <h1 id="hero-title" className="mt-3 font-display leading-[0.84] tracking-[0.02em]">
              <span className="block text-[18vw] text-white sm:text-8xl lg:text-[7.4rem]">STOCKHOLM</span>
              <span className="word-open block text-[18vw] sm:text-8xl lg:text-[7.4rem]">OPEN</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#f4efe6] sm:text-lg">
              {lang === "sv"
                ? "Inomhusveckan i en hall som är mörk även mitt på dagen. Blå bana, trävalv och bärnsten i strålkastarna."
                : "The indoor week in a hall that stays dark even at noon. Blue court, timber vault and amber in the lights."}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#d9d1c4]">
              {lang === "sv"
                ? "Arrangören och hallen anger 7–14 november 2026. ATP listar 8–14 november. Kvalet spelades den 7:e. Det här är en ögonblicksbild från den 9:e, inte en livesändning."
                : "The organizer and the hall say 7–14 November 2026. ATP lists 8–14 November. Qualifying was played on the 7th. This is a 9 November snapshot, not a live broadcast."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="h-11 px-5">
                <Link href="/matcher">{lang === "sv" ? "Till matcherna" : "Go to matches"}</Link>
              </Button>
              <Button asChild variant="outline" className="h-11 border-white/20 bg-[#12151c] px-5 text-white hover:bg-white/10">
                <Link href="/besok">{lang === "sv" ? "Planera besöket" : "Plan the visit"}</Link>
              </Button>
              <Button asChild variant="outline" className="h-11 border-white/20 bg-[#12151c] px-5 text-white hover:bg-white/10">
                <a href="https://www.stockholmopen.se/en/tickets" target="_blank" rel="noreferrer">
                  {lang === "sv" ? "Biljetter hos arrangören" : "Tickets at the organizer"}
                </a>
              </Button>
            </div>
            {showScene ? (
              <button
                type="button"
                className="mt-4 text-sm text-[#d7ecff] underline decoration-cyan/50 underline-offset-4"
                onClick={() => setPlaying((value) => !value)}
                aria-pressed={playing}
              >
                {playing
                  ? lang === "sv"
                    ? "Pausa banan"
                    : "Pause the court"
                  : lang === "sv"
                    ? "Spela banan"
                    : "Play the court"}
              </button>
            ) : (
              <button
                type="button"
                className="mt-4 text-sm text-[#d7ecff] underline decoration-cyan/50 underline-offset-4"
                onClick={() => setForcePlay(true)}
              >
                {lang === "sv" ? "Spela bananimationen" : "Play the court animation"}
              </button>
            )}
          </div>
          <aside className="panel rounded-xl p-4 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="kicker">{lang === "sv" ? "Center Court · 9 november" : "Centre Court · 9 November"}</p>
                <h2 className="mt-1 font-display text-3xl tracking-wide">
                  {lang === "sv" ? "Publicerad ordning" : "Published order"}
                </h2>
              </div>
              <span className="rounded-full border border-amber/40 px-2 py-1 text-[0.65rem] tracking-[0.14em] text-amber uppercase">
                {lang === "sv" ? "Ögonblicksbild" : "Snapshot"}
              </span>
            </div>
            <ol className="mt-4 divide-y divide-white/10">
              {order.map((match) => (
                <li key={match.id}>
                  <Link href={`/matcher/${match.id}`} className="grid grid-cols-[5.5rem_1fr] gap-3 py-3 hover:text-amber">
                    <span className="text-xs leading-5 text-cyan">{startLabel(match, lang)}</span>
                    <span>
                      <span className="block text-sm">{shortSide(match.sides[0])} – {shortSide(match.sides[1])}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {roundLabel(match.round, lang, match.discipline)}
                        {" · "}
                        {match.score ? formatScore(match.score) : statusLabel(match.status, lang)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
            <Link href="/matcher?date=2026-11-09" className="mt-2 inline-block text-sm text-amber">
              {lang === "sv" ? "Hela matchnavet" : "Full match hub"} →
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}

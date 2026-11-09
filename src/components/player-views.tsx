"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageIntro } from "@/components/chrome";
import { useDocumentTitle, useI18n } from "@/lib/i18n";
import {
  courtLabel,
  entryLabel,
  formatDate,
  formatScore,
  getPlayer,
  getPlayers,
  matchesForPlayer,
  playerName,
  roundLabel,
  statusLabel,
} from "@/lib/data/adapter";

const directoryTitle = { sv: "Spelare", en: "Players" };

export function PlayerDirectory() {
  const { lang } = useI18n();
  useDocumentTitle(directoryTitle);
  const params = useSearchParams();
  const pathname = usePathname();
  const [filters, setFilters] = useState({
    q: params.get("q") ?? "",
    scope: params.get("scope") === "all" ? "all" : "main",
    country: params.get("country") ?? "all",
  });
  const q = filters.q.trim().toLowerCase();
  const scope = filters.scope;
  const country = filters.country;
  const countries = [...new Set(getPlayers().map((player) => player.countryCode).filter(Boolean))] as string[];

  function update(key: "q" | "scope" | "country", value: string) {
    setFilters((current) => {
      const next = { ...current, [key]: value };
      const query = new URLSearchParams();
      if (next.q) query.set("q", next.q);
      if (next.scope === "all") query.set("scope", "all");
      if (next.country !== "all") query.set("country", next.country);
      const search = query.toString();
      window.history.replaceState(null, "", search ? `${pathname}?${search}` : pathname);
      return next;
    });
  }

  const players = getPlayers().filter((player) => {
    if (scope === "main" && !player.mainDraw) return false;
    if (country !== "all" && player.countryCode !== country) return false;
    if (!q) return true;
    return `${player.first} ${player.last} ${player.country.sv} ${player.country.en}`.toLowerCase().includes(q);
  });

  return (
    <div className="pb-16">
      <PageIntro
        kicker={lang === "sv" ? "Spelare" : "Players"}
        title={lang === "sv" ? "Huvudlottning" : "Main draw"}
        lede={
          lang === "sv"
            ? "Seedning, wild cards och kval."
            : "Seeds, wildcards and qualifying."
        }
      />
      <div className="mx-auto max-w-[1180px] px-5">
        <div className="grid gap-3 md:grid-cols-[1fr_12rem_auto] md:items-end">
          <label className="grid gap-1 text-sm">
            <span>{lang === "sv" ? "Sök" : "Search"}</span>
            <Input className="h-11" value={filters.q} onChange={(event) => update("q", event.target.value)} placeholder={lang === "sv" ? "Namn eller land" : "Name or country"} />
          </label>
          <label className="grid gap-1 text-sm">
            <span>{lang === "sv" ? "Land" : "Country"}</span>
            <select className="h-11 rounded-lg border border-input bg-transparent px-3" value={country} onChange={(event) => update("country", event.target.value)}>
              <option value="all">{lang === "sv" ? "Alla" : "All"}</option>
              {countries.sort().map((code) => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
          </label>
          <Button type="button" variant={scope === "all" ? "default" : "outline"} className="h-11" onClick={() => update("scope", scope === "all" ? "main" : "all")} aria-pressed={scope === "all"}>
            {scope === "all"
              ? lang === "sv"
                ? "Kvalet visas"
                : "Qualifying shown"
              : lang === "sv"
                ? "Visa även kval"
                : "Also show qualifying"}
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
          {lang === "sv" ? `${players.length} spelare` : `${players.length} players`}
        </p>
        {players.length === 0 ? (
          <div className="panel mt-4 rounded-xl p-8">
            <h2 className="font-display text-4xl">{lang === "sv" ? "Ingen spelare med det urvalet" : "No player in that selection"}</h2>
            <Button type="button" className="mt-4 h-10" onClick={() => { setFilters({ q: "", scope: "main", country: "all" }); window.history.replaceState(null, "", pathname); }}>
              {lang === "sv" ? "Rensa" : "Clear"}
            </Button>
          </div>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {players.map((player) => (
              <li key={player.id}>
                <Link href={`/spelare/${player.id}`} className="panel block h-full rounded-xl p-4 hover:border-amber/40">
                  <p className="text-xs tracking-[0.16em] text-cyan">
                    {player.countryCode ?? "—"}
                    {player.seed ? ` · SEED ${player.seed}` : ""}
                    {player.entry ? ` · ${player.entry}` : ""}
                    {!player.mainDraw ? (lang === "sv" ? " · KVAL" : " · QUAL") : ""}
                  </p>
                  <p className="mt-3 font-display text-4xl leading-none tracking-wide">{player.last.toUpperCase()}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{player.first}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function PlayerProfile({ id }: { id: string }) {
  const { lang } = useI18n();
  const player = getPlayer(id);
  useDocumentTitle({
    sv: player ? playerName(player) : "Spelare",
    en: player ? playerName(player) : "Player",
  });
  if (!player) notFound();
  const matches = matchesForPlayer(player.id);

  return (
    <article className="mx-auto max-w-[900px] px-5 py-12">
      <p className="kicker">
        {player.countryCode ?? (lang === "sv" ? "Land ej angivet" : "Country not stated")}
        {player.mainDraw ? "" : lang === "sv" ? " · kval" : " · qualifying"}
      </p>
      <h1 className="mt-3 font-display text-6xl leading-none tracking-wide sm:text-7xl">{player.last.toUpperCase()}</h1>
      <p className="mt-3 text-xl text-muted-foreground">{player.first} · {player.country[lang]}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs tracking-[0.14em] uppercase">
        {player.seed ? <span className="rounded-full border border-cyan/40 px-3 py-1 text-cyan">Seed {player.seed}</span> : null}
        {player.entry ? <span className="rounded-full border border-amber/40 px-3 py-1 text-amber">{entryLabel(player.entry, lang)}</span> : null}
        {player.qualifyingSeed ? (
          <span className="rounded-full border border-white/15 px-3 py-1">
            {lang === "sv" ? `Kvalseed ${player.qualifyingSeed}` : `Qualifying seed ${player.qualifyingSeed}`}
          </span>
        ) : null}
      </div>
      <p className="mt-6 max-w-2xl text-base leading-7">{player.bio[lang]}</p>
      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        {player.birth ? <Fact label={lang === "sv" ? "Född" : "Born"} value={player.birth} /> : null}
        {player.birthplace ? <Fact label={lang === "sv" ? "Födelseort" : "Birthplace"} value={player.birthplace[lang]} /> : null}
        {player.heightCm ? <Fact label={lang === "sv" ? "Längd" : "Height"} value={`${player.heightCm} cm`} /> : null}
        {player.coach ? <Fact label={lang === "sv" ? "Tränare" : "Coach"} value={player.coach} /> : null}
      </dl>
      <h2 className="mt-10 font-display text-4xl">{lang === "sv" ? "Matcher" : "Matches"}</h2>
      {matches.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          {lang === "sv" ? "Inget resultat utöver ett eventuellt fripass." : "No result beyond a possible bye."}
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-white/10 border-y border-white/10">
          {matches.map((match) => (
            <li key={match.id}>
              <Link href={`/matcher/${match.id}`} className="grid gap-1 py-3 sm:grid-cols-[1fr_auto]">
                <span>
                  {roundLabel(match.round, lang, match.discipline)} · {courtLabel(match.court, lang)}
                  <span className="mt-1 block text-sm text-muted-foreground">{formatDate(match.date, lang)}</span>
                </span>
                <span className="text-sm">{match.score ? formatScore(match.score) : statusLabel(match.status, lang)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <Link href="/spelare">{lang === "sv" ? "Alla spelare" : "All players"}</Link>
        <Link href="/lottning">{lang === "sv" ? "Lottning" : "Draw"}</Link>
        <Link href="/matcher">{lang === "sv" ? "Resultat" : "Results"}</Link>
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

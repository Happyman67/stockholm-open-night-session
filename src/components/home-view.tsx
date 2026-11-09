"use client";

import Link from "next/link";
import { useDocumentTitle, useI18n } from "@/lib/i18n";
import { getLinks, getNews, getPlayers, playerName } from "@/lib/data/adapter";

const title = {
  sv: "Stockholm Open",
  en: "Stockholm Open",
};

export function HomeLower() {
  const { lang } = useI18n();
  useDocumentTitle(title);
  const links = getLinks();
  const swedes = getPlayers().filter((player) => player.countryCode === "SWE" && player.mainDraw);
  const seeds = getPlayers()
    .filter((player) => player.seed)
    .sort((a, b) => (a.seed ?? 0) - (b.seed ?? 0));

  return (
    <div className="mx-auto max-w-[1180px] px-5 py-16">
      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            k: lang === "sv" ? "Vecka" : "Week",
            t: "7–14 nov 2026",
            d:
              lang === "sv"
                ? "Arrangören, KLTK och nyhetsartiklarna säger 7–14 november. ATP:s turneringshuvud säger 8–14 november. Båda står kvar, med källänkar."
                : "The organizer, KLTK and the news articles say 7–14 November. ATP’s tournament header says 8–14 November. Both stay, with source links.",
          },
          {
            k: lang === "sv" ? "Klass" : "Category",
            t: "ATP 250",
            d:
              lang === "sv"
                ? "Inomhus hardcourt i Kungl. Tennishallen. Wikipedia kallar 2026 den 57:e upplagan. Singellottningen som lästes är 28 spelare."
                : "Indoor hard court at the Royal Tennis Hall. Wikipedia calls 2026 the 57th edition. The singles draw that was read has 28 players.",
          },
          {
            k: lang === "sv" ? "Data" : "Data",
            t: lang === "sv" ? "Inte live" : "Not live",
            d:
              lang === "sv"
                ? "Matcher, lottning och resultat är en läsning av offentliga sidor 9 november 2026. Grön live-status används inte."
                : "Matches, the draw and results are a reading of public pages on 9 November 2026. A green live status is not used.",
          },
        ].map((card) => (
          <article key={card.t} className="panel rounded-xl p-5">
            <p className="kicker">{card.k}</p>
            <h2 className="mt-2 font-display text-4xl tracking-wide">{card.t}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{card.d}</p>
          </article>
        ))}
      </section>

      <section className="mt-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="kicker">{lang === "sv" ? "Huvudlottning" : "Main draw"}</p>
            <h2 className="mt-2 font-display text-5xl tracking-wide">
              {lang === "sv" ? "Seedade och svenska wild cards" : "Seeds and Swedish wildcards"}
            </h2>
          </div>
          <Link href="/spelare" className="text-sm text-amber">
            {lang === "sv" ? "Alla spelare" : "All players"}
          </Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {seeds.map((player) => (
            <Link key={player.id} href={`/spelare/${player.id}`} className="panel rounded-xl p-4 hover:border-amber/50">
              <p className="text-xs tracking-[0.16em] text-cyan">SEED {player.seed}</p>
              <p className="mt-2 font-display text-3xl leading-none tracking-wide">{player.last.toUpperCase()}</p>
              <p className="mt-2 text-sm text-muted-foreground">{player.first} · {player.countryCode}</p>
            </Link>
          ))}
          {swedes.map((player) => (
            <Link key={player.id} href={`/spelare/${player.id}`} className="rounded-xl border border-amber/30 bg-[#1a140d] p-4">
              <p className="text-xs tracking-[0.16em] text-amber">WC · SWE</p>
              <p className="mt-2 font-display text-3xl leading-none tracking-wide">{player.last.toUpperCase()}</p>
              <p className="mt-2 text-sm text-[#e7d7c2]">{playerName(player)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="kicker">{lang === "sv" ? "Nyheter som gick att läsa" : "News that could be read"}</p>
          <h2 className="mt-2 font-display text-5xl tracking-wide">{lang === "sv" ? "Fem källartiklar" : "Five sourced stories"}</h2>
          <ul className="mt-6 divide-y divide-white/10">
            {getNews().map((item) => (
              <li key={item.id} className="py-4">
                <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">{item.date}</p>
                <h3 className="mt-1 text-lg">{item.title[lang]}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.summary[lang]}</p>
                <a href={item.url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-amber">
                  {lang === "sv" ? "Läs hos arrangören" : "Read at the organizer"}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <aside className="panel h-fit rounded-xl p-6">
          <p className="kicker">{lang === "sv" ? "Besökaren först" : "Visitor first"}</p>
          <h2 className="mt-2 font-display text-4xl tracking-wide">Lidingövägen 75</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {lang === "sv"
              ? "Tunnelbana till Gärdet, ungefär tio minuters promenad. Väskor större än 40 × 40 × 20 cm lämnas i garderoben. En tröskelfri entré finns vid den runda platsen framför hallen."
              : "Metro to Gärdet, about a ten-minute walk. Bags larger than 40 × 40 × 20 cm go to the cloakroom. A step-free entrance is by the round plaza in front of the hall."}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/besok" className="text-sm text-amber">{lang === "sv" ? "Besöksguiden" : "Visitor guide"}</Link>
            <a href={links.maps} target="_blank" rel="noreferrer" className="text-sm text-cyan">
              {lang === "sv" ? "Karta" : "Map"}
            </a>
            <a href={links.hospitality} target="_blank" rel="noreferrer" className="text-sm text-foreground">
              Hospitality
            </a>
          </div>
        </aside>
      </section>
    </div>
  );
}

"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { PageIntro } from "@/components/chrome";
import { useDocumentTitle, useI18n } from "@/lib/i18n";
import {
  getDoubles2025,
  getLandmarkChampions,
  getNews,
  getRecentChampions,
} from "@/lib/data/adapter";

function Frame({
  kicker,
  title,
  lede,
  children,
}: {
  kicker: string;
  title: string;
  lede: string;
  children: ReactNode;
}) {
  return (
    <div className="pb-16">
      <PageIntro kicker={kicker} title={title} lede={lede} />
      <div className="mx-auto max-w-[900px] px-5">{children}</div>
    </div>
  );
}

export function VisitView() {
  const { lang } = useI18n();
  useDocumentTitle({ sv: "Besök", en: "Visit" });
  const copy = lang === "sv";
  return (
    <Frame
      kicker="Kungl. Tennishallen"
      title={copy ? "Besök" : "Visit"}
      lede={copy ? "Lidingövägen 75, Stockholm." : "Lidingövägen 75, Stockholm."}
    >
      <dl className="grid gap-4 sm:grid-cols-2">
        <Item label={copy ? "Tunnelbana" : "Metro"} value={copy ? "Gärdet, ungefär 10 minuters promenad" : "Gärdet, about a 10-minute walk"} />
        <Item label={copy ? "Bil" : "Car"} value={copy ? "Av- och påstigning vid Lidingövägen och Storängsvägen" : "Drop-off on Lidingövägen and Storängsvägen"} />
        <Item label={copy ? "Cykel" : "Bike"} value={copy ? "Parkering nere vid bilparkeringen" : "Parking down by the car park"} />
        <Item label={copy ? "Väskor" : "Bags"} value={copy ? "Högst 40 × 40 × 20 cm. Större väskor lämnas i garderoben." : "Maximum 40 × 40 × 20 cm. Larger bags go to the cloakroom."} />
        <Item label={copy ? "Öppettid" : "Doors"} value={copy ? "En timme före första match, en och en halv timme före finalen." : "One hour before the first match, one and a half hours before the final."} />
      </dl>
      <section className="mt-10">
        <h2 className="font-display text-4xl">{copy ? "Entré" : "Entry"}</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {copy
            ? "Gå in genom grinden på Lidingövägen och följ gången förbi grusbanorna till huvudentrén. En tröskelfri entré ligger vid den runda platsen framför hallen."
            : "Enter through the gate on Lidingövägen and follow the path past the clay courts to the main entrance. A step-free entrance is by the round plaza in front of the hall."}
        </p>
      </section>
      <section className="mt-10">
        <h2 className="font-display text-4xl">{copy ? "Mat" : "Food"}</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {copy
            ? "I hallen finns food court, sittande trerätters och café. Pizza finns utanför grinden."
            : "Inside there is a food court, a seated three-course service and a café. Pizza is outside the gate."}
        </p>
      </section>
      <section className="mt-10">
        <h2 className="font-display text-4xl">{copy ? "Hallen" : "The hall"}</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {copy
            ? "Kungl. Tennishallen invigdes 22 oktober 1943. Inomhus hardcourt, omkring 5 000 åskådare. Stockholm Open spelas här, med undantag för åren 1989–1994 i Globen."
            : "The Royal Tennis Hall opened on 22 October 1943. Indoor hard court, about 5,000 spectators. The Stockholm Open is played here, except for 1989–1994 at the Globe."}
        </p>
      </section>
    </Frame>
  );
}

export function TicketsView() {
  const { lang } = useI18n();
  useDocumentTitle({ sv: "Biljetter", en: "Tickets" });
  const copy = lang === "sv";
  return (
    <Frame
      kicker={copy ? "7–14 november 2026" : "7–14 November 2026"}
      title={copy ? "Hospitality" : "Hospitality"}
      lede={
        copy
          ? "Winners Table, Executive Box och Swedish Royal Trophy Lounge."
          : "Winners Table, Executive Box and the Swedish Royal Trophy Lounge."
      }
    >
      <div className="grid gap-3">
        <Note title="Winners Table by Teatergrillen" text={copy ? "2–10 gäster. 2 800–4 450 kr per person inklusive moms, beroende på pass." : "2–10 guests. 2,800–4,450 SEK per person including VAT, depending on the session."} />
        <Note title="Executive Box" text={copy ? "Upp till 25 gäster. 150 000–250 000 kr exklusive förtäring och moms." : "Up to 25 guests. 150,000–250,000 SEK excluding food, drink and VAT."} />
        <Note title="Swedish Royal Trophy Lounge" text={copy ? "30–60 gäster. Loungen 30 000–60 000 kr beroende på pass, plus biljett och buffé." : "30–60 guests. Lounge 30,000–60,000 SEK depending on the session, plus ticket and buffet."} />
      </div>
      <p className="mt-8 text-sm text-muted-foreground">
        <Link href="/matcher" className="text-amber">{copy ? "Till resultaten" : "To the results"}</Link>
      </p>
    </Frame>
  );
}

export function NewsView() {
  const { lang } = useI18n();
  useDocumentTitle({ sv: "Nyheter", en: "News" });
  const copy = lang === "sv";
  return (
    <Frame
      kicker={copy ? "Veckan i hallen" : "The week in the hall"}
      title={copy ? "Nyheter" : "News"}
      lede={copy ? "Inför och under Stockholm Open." : "Before and during the Stockholm Open."}
    >
      <ul className="divide-y divide-white/10 border-y border-white/10">
        {getNews().map((item) => (
          <li key={item.id} className="py-6">
            <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">{item.date}</p>
            <h2 className="mt-2 font-display text-4xl tracking-wide">{item.title[lang]}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.summary[lang]}</p>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

export function HistoryView() {
  const { lang } = useI18n();
  useDocumentTitle({ sv: "Historia", en: "History" });
  const copy = lang === "sv";
  return (
    <Frame
      kicker={copy ? "Sedan 1969" : "Since 1969"}
      title={copy ? "Historia" : "History"}
      lede={copy ? "Stockholm Open är en inomhusturnering på ATP-touren." : "The Stockholm Open is an indoor tournament on the ATP Tour."}
    >
      <p className="text-sm leading-7 text-muted-foreground">
        {copy
          ? "Turneringen startade 1969 på initiativ av Sven Davidson. Den ägs av Salk, Stockholms Tennisförbund och KLTK. En vanlig vecka samlar omkring 30 000 besökare. Namnet var en period Nordic Open och är 2026 åter Stockholm Open. 2020 ställdes turneringen in. Årets mästare är inte korad."
          : "The tournament started in 1969 at the initiative of Sven Davidson. It is owned by Salk, the Stockholm Tennis Federation and KLTK. A typical week draws about 30,000 visitors. The name was Nordic Open for a period and in 2026 is the Stockholm Open again. The 2020 tournament was cancelled. This year’s champion is not yet decided."}
      </p>
      <h2 className="mt-10 font-display text-4xl">{copy ? "Senaste singelfinaler" : "Recent singles finals"}</h2>
      <ChampionTable />
      <h2 className="mt-10 font-display text-4xl">{copy ? "Äldre finaler" : "Older finals"}</h2>
      <ul className="mt-3 divide-y divide-white/10 border-y border-white/10 text-sm">
        {getLandmarkChampions().map((row) => (
          <li key={row.year} className="grid grid-cols-[4rem_1fr] gap-3 py-3">
            <span className="text-amber">{row.year}</span>
            <span>{row.winner} <span className="text-muted-foreground">{copy ? "mot" : "def."} {row.runnerUp}, {row.score}</span></span>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm leading-6 text-muted-foreground">
        {copy ? "Dubbelfinalen 2025: " : "The 2025 doubles final: "}
        {getDoubles2025().winners} {copy ? "mot" : "def."} {getDoubles2025().runners}, {getDoubles2025().score}.
      </p>
      <p className="mt-4 text-sm">
        <Link href="/spelare/casper-ruud" className="text-amber">{copy ? "Regerande mästare" : "Defending champion"}</Link>
      </p>
    </Frame>
  );
}

function ChampionTable() {
  const { lang } = useI18n();
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
          <tr>
            <th className="py-2 pr-3 font-medium">{lang === "sv" ? "År" : "Year"}</th>
            <th className="py-2 pr-3 font-medium">{lang === "sv" ? "Mästare" : "Champion"}</th>
            <th className="py-2 pr-3 font-medium">{lang === "sv" ? "Finalist" : "Runner-up"}</th>
            <th className="py-2 font-medium">{lang === "sv" ? "Siffror" : "Score"}</th>
          </tr>
        </thead>
        <tbody>
          {getRecentChampions().map((row) => (
            <tr key={row.year} className="border-t border-white/10">
              <td className="py-2 pr-3 text-amber">{row.year}</td>
              <td className="py-2 pr-3">{row.winner}</td>
              <td className="py-2 pr-3 text-muted-foreground">{row.runnerUp}</td>
              <td className="py-2">{row.score}</td>
            </tr>
          ))}
          <tr className="border-t border-white/10">
            <td className="py-2 pr-3">2020</td>
            <td className="py-2" colSpan={3}>{lang === "sv" ? "Inställd" : "Cancelled"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function AboutView() {
  const { lang } = useI18n();
  useDocumentTitle({ sv: "Stockholm Open", en: "Stockholm Open" });
  const copy = lang === "sv";
  return (
    <Frame
      kicker="ATP 250"
      title="Stockholm Open"
      lede={copy ? "Inomhusvecka i Kungl. Tennishallen. Resultat till och med 9 november 2026." : "Indoor week at the Royal Tennis Hall. Results through 9 November 2026."}
    >
      <p className="text-sm leading-7 text-muted-foreground">
        {copy
          ? "Singellottningen har 28 spelare. Här visas slutspelade matcher, schemat och lottningen."
          : "The singles draw has 28 players. Completed matches, the schedule and the draw are shown here."}
      </p>
      <p className="mt-6 text-sm">
        <Link href="/matcher" className="text-amber">{copy ? "Till resultaten" : "To the results"}</Link>
      </p>
    </Frame>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-white/10 pt-3">
      <dt className="text-xs tracking-[0.16em] text-muted-foreground uppercase">{label}</dt>
      <dd className="mt-1 text-sm leading-6">{value}</dd>
    </div>
  );
}

function Note({ title, text }: { title: string; text: string }) {
  return (
    <div className="panel rounded-xl p-4">
      <p className="text-lg">{title}</p>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}

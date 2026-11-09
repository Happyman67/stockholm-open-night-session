"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { PageIntro } from "@/components/chrome";
import { useDocumentTitle, useI18n } from "@/lib/i18n";
import {
  getDoubles2025,
  getLandmarkChampions,
  getLinks,
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
  const links = getLinks();
  useDocumentTitle({ sv: "Besök", en: "Visit" });
  const copy = lang === "sv";
  return (
    <Frame
      kicker={copy ? "Besök · Kungl. Tennishallen" : "Visit · Royal Tennis Hall"}
      title={copy ? "Så tar du dig in" : "How you get in"}
      lede={
        copy
          ? "Praktiken är omskriven från arrangörens besöksinformation, läst 9 november 2026. Hallens historia och publikkapacitet kommer från Wikipedia. Egen karta ritas inte. Länkarna går till arrangören, Visit Stockholm och en karttjänst."
          : "The practical notes are rewritten from the organizer’s visitor information, read on 9 November 2026. The hall’s history and capacity come from Wikipedia. No map is drawn here. The links go to the organizer, Visit Stockholm and a map service."
      }
    >
      <dl className="grid gap-4 sm:grid-cols-2">
        <Item label={copy ? "Adress" : "Address"} value="Lidingövägen 75, Stockholm" />
        <Item label={copy ? "Tunnelbana" : "Metro"} value={copy ? "Gärdet, ungefär 10 minuters promenad" : "Gärdet, about a 10-minute walk"} />
        <Item label={copy ? "Bil" : "Car"} value={copy ? "Av- och påstigning för Uber vid Lidingövägen och vid Storängsvägen" : "Uber drop-off on Lidingövägen and on Storängsvägen"} />
        <Item label={copy ? "Cykel" : "Bike"} value={copy ? "Parkering nere vid bilparkeringen, med en gång upp till hallen" : "Parking down by the car park, with a path up to the hall"} />
        <Item label={copy ? "Väskor" : "Bags"} value={copy ? "Högst 40 × 40 × 20 cm. Större väskor lämnas i garderoben, mot avgift." : "Maximum 40 × 40 × 20 cm. Larger bags go to the cloakroom, for a fee."} />
        <Item label={copy ? "När hallen öppnar" : "When the arena opens"} value={copy ? "En timme före första match, en och en halv timme före finalen." : "One hour before the first match, one and a half hours before the final."} />
      </dl>
      <section className="mt-10">
        <h2 className="font-display text-4xl">{copy ? "Entré och tillgänglighet" : "Entry and access"}</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {copy
            ? "Gå in genom grinden på Lidingövägen och följ gången förbi grusbanorna till huvudentrén i hallens västra ände. En tröskelfri entré ligger vid den runda platsen framför hallen. Kom i tid om du vill slippa kön och sitta på plats när bollen sätts i spel. Mer detaljer om rullstolsplatser än så stod inte i den lästa texten. Fråga arrangören."
            : "Enter through the gate on Lidingövägen and follow the path past the clay courts to the main entrance at the west end of the hall. A step-free entrance is by the round plaza in front of the hall. Arrive early if you want to miss the queue and be seated when the ball goes up. The text that was read did not add further wheelchair-seat detail. Ask the organizer."}
        </p>
      </section>
      <section className="mt-10">
        <h2 className="font-display text-4xl">{copy ? "Mat" : "Food"}</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {copy
            ? "Serveringen sköts av Svenska Brasserier. I hallen finns en food court, sittande trerätters hos Sturehof och Fazer Café för kaffe, öl och vin. Pizza finns utanför om du är hungrig redan vid grinden."
            : "Food and drink are run by Svenska Brasserier. Inside there is a food court, a seated three-course service from Sturehof, and Fazer Café for coffee, beer and wine. There is pizza outside if you are hungry at the gate."}
        </p>
      </section>
      <section className="mt-10">
        <h2 className="font-display text-4xl">{copy ? "Hallen" : "The hall"}</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          {copy
            ? "Kungl. Tennishallen invigdes 22 oktober 1943. Wikipedia anger omkring 5 000 åskådare i tennissammanhang, inomhus hardcourt (GreenSet) och grusbanor ute. Samma källa nämner att hallen tog Masters 1975 och Davis Cup-finalen samma år, Sverige mot Tjeckoslovakien. Underlaget på Stockholm Open är inomhus hardcourt. 1989–1994 spelades turneringen i Globen."
            : "The Royal Tennis Hall opened on 22 October 1943. Wikipedia gives a tennis capacity of about 5,000, indoor hard courts (GreenSet) and outdoor clay. The same source notes that the hall hosted the 1975 Masters and that year’s Davis Cup final, Sweden against Czechoslovakia. The Stockholm Open surface is indoor hard. From 1989 to 1994 the tournament was played at the Globe."}
        </p>
      </section>
      <section className="mt-10">
        <h2 className="font-display text-4xl">FAQ</h2>
        <div className="mt-4 divide-y divide-white/10 border-y border-white/10">
          <Faq q={copy ? "Är det här den officiella biljettsidan?" : "Is this the official ticket page?"} a={copy ? "Nej. Biljetter köps hos arrangören. Här finns bara länkar dit." : "No. Tickets are bought from the organizer. This page only links there."} />
          <Faq q={copy ? "Är resultatet live?" : "Are the scores live?"} a={copy ? "Nej. Matcherna är en ögonblicksbild från 9 november 2026." : "No. The matches are a snapshot from 9 November 2026."} />
          <Faq q={copy ? "Får jag ta med en stor väska?" : "Can I bring a large bag?"} a={copy ? "Bara om den ryms inom 40 × 40 × 20 cm. Annars garderoben." : "Only if it fits within 40 × 40 × 20 cm. Otherwise, the cloakroom."} />
          <Faq q={copy ? "Vilken tidzon gäller?" : "Which time zone?"} a={copy ? "Europe/Stockholm. Tiderna på sajten är de som stod i schemat, inte omräknade." : "Europe/Stockholm. Times on this site are the ones printed on the schedule, not converted."} />
        </div>
      </section>
      <div className="mt-8 flex flex-wrap gap-4 text-sm">
        <a className="text-amber" href={links.practical} target="_blank" rel="noreferrer">{copy ? "Arrangörens praktiska info" : "Organizer practical info"}</a>
        <a className="text-amber" href={links.map} target="_blank" rel="noreferrer">{copy ? "Arenakarta" : "Venue map"}</a>
        <a className="text-amber" href={links.maps} target="_blank" rel="noreferrer">{copy ? "Hitta hit" : "Directions"}</a>
        <a className="text-amber" href={links.visitStockholm} target="_blank" rel="noreferrer">Visit Stockholm</a>
        <a className="text-amber" href={links.hall} target="_blank" rel="noreferrer">Wikipedia</a>
      </div>
    </Frame>
  );
}

export function TicketsView() {
  const { lang } = useI18n();
  const links = getLinks();
  useDocumentTitle({ sv: "Biljetter", en: "Tickets" });
  const copy = lang === "sv";
  return (
    <Frame
      kicker={copy ? "Biljetter · bara länkar" : "Tickets · links only"}
      title={copy ? "Köp inte här" : "Do not buy here"}
      lede={
        copy
          ? "Den här konceptsajten tar inte betalt, håller ingen kassa och lovar inga platser. Knapparna öppnar arrangörens egna sidor i en ny flik. Priserna nedan är de som stod på hospitality-sidorna den 9 november 2026 och kan ha ändrats."
          : "This concept site takes no payment, holds no checkout and promises no seats. The buttons open the organizer’s own pages in a new tab. The prices below are what the hospitality pages said on 9 November 2026 and may have changed."
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Outbound href={links.ticketCheckout} title={copy ? "Arrangörens biljettshop" : "Organizer ticket shop"} text={copy ? "Själva köpet sker på tickets.stockholmopen.se." : "The purchase itself happens on tickets.stockholmopen.se."} />
        <Outbound href={links.tickets} title={copy ? "Biljettsidor" : "Ticket pages"} text={copy ? "Samlingssida för biljetter och besök." : "The organizer’s tickets and visit section."} />
        <Outbound href={links.policy} title={copy ? "Köpvillkor" : "Ticket policy"} text={copy ? "Arrangörens villkor, inte våra." : "The organizer’s terms, not ours."} />
        <Outbound href={links.weekly} title={copy ? "Veckoschema" : "Weekly schedule"} text={copy ? "Publikt schema 7–14 november, med familjedag den 7:e." : "Public schedule for 7–14 November, with Family Day on the 7th."} />
      </div>
      <h2 className="mt-12 font-display text-4xl">Hospitality</h2>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        {copy
          ? "Svenska Brasserier sköter maten. Swedish Royal Trophy Lounge är döpt efter vandringspokalen som kung Carl XVI Gustaf skänkt. På Executive Box-sidan står att Thomas Enqvist presenterar dagens matcher före huvudmatchen. Winners Table beskrevs som ännu inte öppen för bokning."
          : "Svenska Brasserier runs the food. The Swedish Royal Trophy Lounge is named after the challenge trophy donated by King Carl XVI Gustaf. The Executive Box page says Thomas Enqvist presents the day’s matches before the main match. Winners Table was described as not yet open for booking."}
      </p>
      <div className="mt-4 grid gap-3">
        <Outbound href={links.winners} title="Winners Table by Teatergrillen" text={copy ? "2–10 gäster. Publicerat pris 2 800–4 450 kr per person inklusive moms, beroende på pass." : "2–10 guests. Published price 2,800–4,450 SEK per person including VAT, depending on the session."} />
        <Outbound href={links.executive} title="Executive Box" text={copy ? "Upp till 25 gäster. Publicerat pris 150 000–250 000 kr exklusive förtäring och moms." : "Up to 25 guests. Published price 150,000–250,000 SEK excluding food, drink and VAT."} />
        <Outbound href={links.lounge} title="Swedish Royal Trophy Lounge" text={copy ? "30–60 gäster. Loungen 30 000–60 000 kr beroende på pass, plus biljett och buffé. Moms tillkommer på loungen." : "30–60 guests. Lounge 30,000–60,000 SEK depending on the session, plus ticket and buffet. VAT is added on the lounge."} />
        <Outbound href={links.hospitality} title={copy ? "Hospitality, översikt" : "Hospitality overview"} text={copy ? "Arrangörens egen sammanställning av de tre miljöerna." : "The organizer’s own summary of the three settings."} />
      </div>
    </Frame>
  );
}

export function NewsView() {
  const { lang } = useI18n();
  const links = getLinks();
  useDocumentTitle({ sv: "Nyheter", en: "News" });
  const copy = lang === "sv";
  return (
    <Frame
      kicker={copy ? "Nyheter och video" : "News and video"}
      title={copy ? "Det som var publicerat" : "What was published"}
      lede={
        copy
          ? "Fem artiklar som gick att öppna den 9 november, omskrivna kort. Inga påhittade rubriker. Video bäddas inte in, eftersom den här sajten inte är en sändningsyta."
          : "Five articles that could be opened on 9 November, rewritten briefly. No invented headlines. Video is not embedded, because this site is not a broadcast surface."
      }
    >
      <ul className="divide-y divide-white/10 border-y border-white/10">
        {getNews().map((item) => (
          <li key={item.id} className="py-6">
            <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">{item.date} · {item.source[lang]}</p>
            <h2 className="mt-2 font-display text-4xl tracking-wide">{item.title[lang]}</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.summary[lang]}</p>
            <a href={item.url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-amber">
              {copy ? "Öppna artikeln" : "Open the article"}
            </a>
          </li>
        ))}
      </ul>
      <div className="panel mt-8 rounded-xl p-6">
        <h2 className="font-display text-4xl">{copy ? "Video" : "Video"}</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {copy
            ? "Arrangören har en egen videosida. Den är inte inbäddad här, och inget på den här sajten ska läsas som en pågående sändning."
            : "The organizer has a video page of their own. It is not embedded here, and nothing on this site should be read as a broadcast in progress."}
        </p>
        <a href={links.videos} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm text-amber">
          {copy ? "Till arrangörens video" : "To the organizer’s video"}
        </a>
      </div>
    </Frame>
  );
}

export function HistoryView() {
  const { lang } = useI18n();
  const links = getLinks();
  useDocumentTitle({ sv: "Historia", en: "History" });
  const copy = lang === "sv";
  return (
    <Frame
      kicker={copy ? "Historia · sedan 1969" : "History · since 1969"}
      title={copy ? "Världens äldsta inomhus-ATP" : "The oldest indoor ATP"}
      lede={
        copy
          ? "Ursprunget är omskrivet från arrangörens historiksida. Finalerna är ett urval ur Wikipedias tabell, läst 9 november 2026, inte en avskrift av hela listan. 2026 års mästare är inte avgjord i ögonblicksbilden."
          : "The origin is rewritten from the organizer’s history page. The finals are a selection from Wikipedia’s table, read on 9 November 2026, not a copy of the full list. The 2026 champion is not decided in the snapshot."
      }
    >
      <p className="text-sm leading-7 text-muted-foreground">
        {copy
          ? "Stockholm Open startade 1969 på initiativ av Sven Davidson. Turneringen ägs av Salk, Stockholms Tennisförbund och KLTK. Överskott har gått till deras ungdomsverksamhet, enligt arrangören mer än 60 miljoner kronor. En vanlig vecka samlar omkring 30 000 besökare och fler än 350 funktionärer. Namnet var en period Nordic Open och är 2026 tillbaka som Stockholm Open, med Bybit som titelnamn i arrangörens texter. Wikipedia kallar årets upplaga den 57:e. 2020 ställdes turneringen in."
          : "The Stockholm Open started in 1969 at the initiative of Sven Davidson. It is owned by Salk, the Stockholm Tennis Federation and KLTK. Surpluses have gone to their youth programmes, more than 60 million SEK according to the organizer. A typical week draws about 30,000 visitors and more than 350 volunteers. The name was Nordic Open for a period and in 2026 is back as the Stockholm Open, with Bybit as the title name in the organizer’s copy. Wikipedia calls this the 57th edition. The 2020 tournament was cancelled."}
      </p>
      <h2 className="mt-10 font-display text-4xl">{copy ? "Senaste singelfinaler" : "Recent singles finals"}</h2>
      <ChampionTable />
      <h2 className="mt-10 font-display text-4xl">{copy ? "Äldre hållpunkter" : "Older landmarks"}</h2>
      <ul className="mt-3 divide-y divide-white/10 border-y border-white/10 text-sm">
        {getLandmarkChampions().map((row) => (
          <li key={row.year} className="grid grid-cols-[4rem_1fr] gap-3 py-3">
            <span className="text-amber">{row.year}</span>
            <span>{row.winner} <span className="text-muted-foreground">{copy ? "mot" : "def."} {row.runnerUp}, {row.score}</span></span>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm leading-6 text-muted-foreground">
        {copy ? "Dubbelfinalen 2025, enligt Wikipedia: " : "The 2025 doubles final, according to Wikipedia: "}
        {getDoubles2025().winners} {copy ? "mot" : "def."} {getDoubles2025().runners}, {getDoubles2025().score}.
      </p>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        {copy
          ? "Damklassen spelades 1969, 1975 och 1979–1980. Dagens tävling är herrarnas ATP-vecka. Thomas Enqvist, trefaldig mästare, är turneringsdirektör 2026 enligt arrangörens artiklar."
          : "A women’s event was held in 1969, 1975 and 1979–1980. Today’s competition is the men’s ATP week. Thomas Enqvist, a three-time champion, is the 2026 tournament director according to the organizer’s articles."}
      </p>
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <a className="text-amber" href={links.history} target="_blank" rel="noreferrer">{copy ? "Arrangörens historia" : "Organizer history"}</a>
        <a className="text-amber" href={links.wikipedia} target="_blank" rel="noreferrer">Wikipedia</a>
        <Link href="/spelare/casper-ruud" className="text-foreground">{copy ? "Regerande mästare" : "Defending champion"}</Link>
      </div>
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
  const links = getLinks();
  useDocumentTitle({ sv: "Om konceptet", en: "About the concept" });
  const copy = lang === "sv";
  return (
    <Frame
      kicker={copy ? "Om den här sajten" : "About this site"}
      title={copy ? "Ett koncept, inte ett förbund" : "A concept, not a federation"}
      lede={
        copy
          ? "Night Session var en visuell riktning: mörk hall, blå bana, bärnsten i taket, cyan i ljusbågen. Turneringens namn är Stockholm Open. Sajten är inte officiell och har ingen koppling till Bybit, ATP eller arrangörerna utöver att den länkar till dem."
          : "Night Session was a visual direction: a dark hall, a blue court, amber in the roof, cyan in the light arch. The tournament’s name is the Stockholm Open. This site is not official and has no relationship with Bybit, the ATP or the organizers beyond linking to them."
      }
    >
      <ul className="space-y-4 text-sm leading-7 text-muted-foreground">
        <li>{copy ? "Ögonblicksbilden togs 9 november 2026 från offentliga sidor. Den uppdateras inte av sig själv." : "The snapshot was taken on 9 November 2026 from public pages. It does not update itself."}</li>
        <li>{copy ? "Inget resultat är märkt live. Planerade matcher saknar siffror. Pär där källan inte angav bana eller tid lämnas de tomma." : "No result is marked live. Scheduled matches have no score. Where the source did not state a court or a time, those fields stay empty."}</li>
        <li>{copy ? "ATP listar turneringen 8–14 november. Arrangören, KLTK och flera nyhetsartiklar säger 7–14 november. Kvalresultat finns från lördagen den 7:e. Båda formuleringarna redovisas." : "ATP lists the tournament as 8–14 November. The organizer, KLTK and several news articles say 7–14 November. Qualifying results exist from Saturday the 7th. Both wordings are shown."}</li>
        <li>{copy ? "Seedningen följer lottningen från den 9:e: Humbert 7 och Bergs 8. En Wikipedia-sida hade en annan sjuseedad. Den används inte." : "Seeding follows the 9 November draw: Humbert 7 and Bergs 8. A Wikipedia page had a different seventh seed. It is not used."}</li>
        <li>{copy ? "Spelarwidgetens ranking, prispengar och vinst-förlust används inte. Födelsedata används där profilen såg hel ut. Vallejos profil gjorde det inte." : "The player widget’s ranking, prize money and win-loss are not used. Birth details are used where the profile looked intact. Vallejo’s profile did not."}</li>
        <li>{copy ? "Dataadaptern är ett gränssnitt. En senare riktig källa kan bytas in utan att sidorna skrivs om. Den här versionen har ingen sådan källa." : "The data adapter is an interface. A later real source can be swapped in without rewriting the pages. This version has no such source."}</li>
      </ul>
      <div className="mt-8 flex flex-wrap gap-4 text-sm">
        <a className="text-amber" href={links.home} target="_blank" rel="noreferrer">stockholmopen.se</a>
        <a className="text-amber" href={links.atpResults} target="_blank" rel="noreferrer">{copy ? "ATP-resultat" : "ATP results"}</a>
        <a className="text-amber" href={links.atpDraw} target="_blank" rel="noreferrer">{copy ? "ATP-lottning" : "ATP draw"}</a>
        <a className="text-amber" href={links.kltk} target="_blank" rel="noreferrer">KLTK</a>
        <Link href="/matcher" className="text-foreground">{copy ? "Matchnavet" : "Match hub"}</Link>
      </div>
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

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group py-3">
      <summary className="cursor-pointer text-base">{q}</summary>
      <p className="pt-2 text-sm leading-6 text-muted-foreground">{a}</p>
    </details>
  );
}

function Outbound({ href, title, text }: { href: string; title: string; text: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="panel block rounded-xl p-4 hover:border-amber/40">
      <span className="block text-lg">{title}</span>
      <span className="mt-1 block text-sm leading-6 text-muted-foreground">{text}</span>
      <span className="mt-3 block text-xs tracking-[0.14em] text-amber uppercase">↗</span>
    </a>
  );
}

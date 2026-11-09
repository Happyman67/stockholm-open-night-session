"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useI18n, type Lang } from "@/lib/i18n";
import { getLinks, getSnapshot } from "@/lib/data/adapter";
import { Button } from "@/components/ui/button";

export const nav = [
  { href: "/matcher", sv: "Matcher", en: "Matches" },
  { href: "/lottning", sv: "Lottning", en: "Draw" },
  { href: "/spelare", sv: "Spelare", en: "Players" },
  { href: "/besok", sv: "Besök", en: "Visit" },
  { href: "/biljetter", sv: "Biljetter", en: "Tickets" },
  { href: "/nyheter", sv: "Nyheter", en: "News" },
  { href: "/historia", sv: "Historia", en: "History" },
] as const;

export function ConceptBanner() {
  const { lang } = useI18n();
  return (
    <div className="border-b border-amber/30 bg-[#1a140c] text-center text-[0.78rem] text-[#f3e2c4]">
      <p className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2">
        <span>
          {lang === "sv"
            ? "Inofficiellt koncept. Inte arrangörens webbplats. Ingen biljettförsäljning och ingen livekoppling."
            : "Unofficial concept. Not the organizer’s website. No ticket sales and no live connection."}
        </span>
        <Link href="/om" className="underline decoration-amber/70 underline-offset-4">
          {lang === "sv" ? "Om underlaget" : "About the sources"}
        </Link>
      </p>
    </div>
  );
}

function LangSwitch({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useI18n();
  return (
    <div className={`flex rounded-md border border-border ${compact ? "" : ""}`} role="group" aria-label={lang === "sv" ? "Språk" : "Language"}>
      {(["sv", "en"] as Lang[]).map((code) => (
        <button
          key={code}
          type="button"
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
          className={`px-2.5 py-1 text-xs tracking-[0.14em] uppercase ${
            lang === code ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const { lang } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-[#07080c]/90 backdrop-blur-md">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        {lang === "sv" ? "Hoppa till innehåll" : "Skip to content"}
      </a>
      <div className="mx-auto flex h-16 max-w-[1180px] items-center gap-4 px-4 sm:px-5">
        <Link href="/" className="leading-none">
          <span className="block font-display text-[1.65rem] tracking-[0.08em] text-foreground">STOCKHOLM</span>
          <span className="block text-[0.62rem] tracking-[0.28em] text-amber">OPEN · KONCEPT</span>
        </Link>
        <nav className="ml-6 hidden items-center gap-5 lg:flex" aria-label={lang === "sv" ? "Huvudmeny" : "Main"}>
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm ${active ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {item[lang]}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <LangSwitch />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? (lang === "sv" ? "Stäng meny" : "Close menu") : lang === "sv" ? "Öppna meny" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {open ? (
        <nav id="mobile-menu" className="border-t border-border bg-[#10141c] px-5 py-2 lg:hidden" aria-label={lang === "sv" ? "Mobilmeny" : "Mobile"}>
          <Link href="/" className="block border-b border-border py-3 text-lg" onClick={() => setOpen(false)}>
            {lang === "sv" ? "Hem" : "Home"}
          </Link>
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="block border-b border-border py-3 text-lg" onClick={() => setOpen(false)}>
              {item[lang]}
            </Link>
          ))}
          <Link href="/om" className="block py-3 text-lg" onClick={() => setOpen(false)}>
            {lang === "sv" ? "Om konceptet" : "About the concept"}
          </Link>
        </nav>
      ) : null}
    </header>
  );
}

export function HeaderFallback() {
  return <div className="h-16 border-b border-border bg-[#07080c]" />;
}

export function SiteFooter() {
  const { lang } = useI18n();
  const snapshot = getSnapshot();
  const links = getLinks();
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-4xl tracking-[0.08em]">STOCKHOLM OPEN</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            {lang === "sv"
              ? "Ett inofficiellt koncept i kvällsljus. Sajten säljer inga biljetter, företräder inga sponsorer och är inte kopplad till en livescore."
              : "An unofficial concept in evening light. This site sells no tickets, represents no sponsors and is not connected to a live score feed."}
          </p>
          <p className="mt-4 text-sm text-amber">{snapshot.label[lang]} · {snapshot.timezone}</p>
        </div>
        <div>
          <p className="kicker">{lang === "sv" ? "På sajten" : "On this site"}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-muted-foreground hover:text-foreground">
                  {item[lang]}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/om" className="text-muted-foreground hover:text-foreground">
                {lang === "sv" ? "Om konceptet" : "About"}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="kicker">{lang === "sv" ? "Officiella källor" : "Official sources"}</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><a className="text-muted-foreground hover:text-foreground" href={links.home} target="_blank" rel="noreferrer">stockholmopen.se</a></li>
            <li><a className="text-muted-foreground hover:text-foreground" href={links.atpOverview} target="_blank" rel="noreferrer">ATP Tour</a></li>
            <li><a className="text-muted-foreground hover:text-foreground" href={links.wikipedia} target="_blank" rel="noreferrer">Wikipedia</a></li>
            <li><a className="text-muted-foreground hover:text-foreground" href={links.hall} target="_blank" rel="noreferrer">{lang === "sv" ? "Kungl. Tennishallen" : "Royal Tennis Hall"}</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export function PageIntro({
  kicker,
  title,
  lede,
}: {
  kicker: string;
  title: string;
  lede: string;
}) {
  return (
    <header className="mx-auto max-w-[1180px] px-5 pt-12 pb-8">
      <p className="kicker">{kicker}</p>
      <h1 className="mt-3 font-display text-5xl tracking-[0.04em] text-foreground sm:text-7xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{lede}</p>
    </header>
  );
}

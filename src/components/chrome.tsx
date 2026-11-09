"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useI18n, type Lang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export const nav = [
  { href: "/spelare", sv: "Spelare", en: "Players" },
  { href: "/matcher?board=schedule", sv: "Schema", en: "Schedule", key: "schedule" },
  { href: "/matcher", sv: "Resultat", en: "Results", key: "results" },
  { href: "/lottning", sv: "Lottning", en: "Draw" },
] as const;

function LangSwitch() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex rounded-full border border-white/15" role="group" aria-label={lang === "sv" ? "Språk" : "Language"}>
      {(["sv", "en"] as Lang[]).map((code) => (
        <button
          key={code}
          type="button"
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
          className={`px-2.5 py-1 text-[0.68rem] tracking-[0.14em] uppercase ${
            lang === code ? "bg-amber text-[#1a1208]" : "text-muted-foreground hover:text-foreground"
          } first:rounded-l-full last:rounded-r-full`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const params = useSearchParams();
  const { lang } = useI18n();
  const [open, setOpen] = useState(false);
  const board = params.get("board");

  function active(item: (typeof nav)[number]) {
    if ("key" in item && item.key === "schedule") return pathname === "/matcher" && board === "schedule";
    if ("key" in item && item.key === "results") return pathname.startsWith("/matcher") && board !== "schedule";
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07080c]/80 backdrop-blur-md">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-50 focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        {lang === "sv" ? "Hoppa till innehåll" : "Skip to content"}
      </a>
      <div className="mx-auto flex h-16 max-w-[1180px] items-center gap-4 px-4 sm:px-5">
        <Link href="/" className="leading-none">
          <span className="block font-display text-[1.05rem] tracking-[0.16em] text-white">STOCKHOLM OPEN</span>
          <span className="mt-0.5 block text-[0.58rem] tracking-[0.32em] text-amber">NIGHT SESSION</span>
        </Link>
        <nav className="ml-auto hidden items-center gap-6 lg:flex" aria-label={lang === "sv" ? "Huvudmeny" : "Main"}>
          {nav.map((item) => {
            const current = active(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={`inline-flex items-center gap-2 text-sm ${current ? "text-white" : "text-[#b7b0a4] hover:text-white"}`}
              >
                {current ? <span className="size-1.5 rounded-full bg-amber" aria-hidden /> : null}
                {item[lang]}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/matcher"
          className="ml-auto hidden h-9 items-center rounded-full border border-amber px-4 text-sm text-amber hover:bg-amber/10 sm:inline-flex lg:ml-4"
        >
          {lang === "sv" ? "Resultat" : "Results"} →
        </Link>
        <div className="flex items-center gap-2 lg:ml-1">
          <LangSwitch />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="border-white/15 lg:hidden"
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
        <nav id="mobile-menu" className="border-t border-white/10 bg-[#10141c] px-5 py-2 lg:hidden" aria-label={lang === "sv" ? "Mobilmeny" : "Mobile"}>
          <Link href="/" className="block border-b border-white/10 py-3 text-lg" onClick={() => setOpen(false)}>
            {lang === "sv" ? "Hem" : "Home"}
          </Link>
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="block border-b border-white/10 py-3 text-lg" onClick={() => setOpen(false)}>
              {item[lang]}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

export function HeaderFallback() {
  return <div className="h-16 border-b border-white/10 bg-[#07080c]" />;
}

export function SiteFooter() {
  const { lang } = useI18n();
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-6 px-5 py-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-2xl tracking-[0.12em]">STOCKHOLM OPEN</p>
          <p className="mt-1 text-xs tracking-[0.22em] text-amber">NIGHT SESSION</p>
          <p className="mt-3 text-sm text-muted-foreground">
            {lang === "sv" ? "Resultat · 9 november 2026 · Kungl. Tennishallen" : "Results · 9 November 2026 · Royal Tennis Hall"}
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="text-muted-foreground hover:text-foreground">
                {item[lang]}
              </Link>
            </li>
          ))}
        </ul>
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
    <header className="mx-auto max-w-[1180px] px-5 pt-10 pb-6">
      <p className="kicker">{kicker}</p>
      <h1 className="mt-3 font-display text-5xl tracking-[0.03em] text-foreground sm:text-6xl">{title}</h1>
      {lede ? <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{lede}</p> : null}
    </header>
  );
}

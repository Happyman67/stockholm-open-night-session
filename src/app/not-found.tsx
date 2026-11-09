"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function NotFound() {
  const { lang } = useI18n();
  return (
    <div className="mx-auto max-w-[720px] px-5 py-24">
      <p className="kicker">404</p>
      <h1 className="mt-3 font-display text-6xl tracking-wide">{lang === "sv" ? "Sidan finns inte" : "Page not found"}</h1>
      <p className="mt-4 text-muted-foreground">
        {lang === "sv"
          ? "Antingen är adressen fel, eller så fanns posten inte i ögonblicksbilden."
          : "The address is wrong, or that record was not in the snapshot."}
      </p>
      <Link href="/" className="mt-6 inline-block text-amber">
        {lang === "sv" ? "Till startsidan" : "Back home"}
      </Link>
    </div>
  );
}

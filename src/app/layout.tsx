import type { Metadata } from "next";
import { Oswald, Outfit } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { ConceptBanner, HeaderFallback, SiteFooter, SiteHeader } from "@/components/chrome";
import { I18nProvider } from "@/lib/i18n";

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-outfit",
});

const display = Oswald({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  variable: "--font-display-face",
});

export const metadata: Metadata = {
  title: {
    default: "Stockholm Open · inofficiellt koncept",
    template: "%s · Stockholm Open-koncept",
  },
  description:
    "Inofficiellt koncept för Stockholm Open i Kungl. Tennishallen. Ögonblicksbild från 9 november 2026, utan biljettförsäljning och utan livekoppling.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sv" className={`${outfit.variable} ${display.variable} dark h-full antialiased`}>
      <body className="min-h-full">
        <I18nProvider>
          <ConceptBanner />
          <Suspense fallback={<HeaderFallback />}>
            <SiteHeader />
          </Suspense>
          <main id="content">{children}</main>
          <SiteFooter />
        </I18nProvider>
      </body>
    </html>
  );
}

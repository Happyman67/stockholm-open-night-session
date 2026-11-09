import { Suspense } from "react";
import { MatchHub } from "@/components/match-hub";

export const metadata = { title: "Resultat" };

export default function Page() {
  return (
    <Suspense fallback={<p className="px-5 py-16 text-muted-foreground">…</p>}>
      <MatchHub />
    </Suspense>
  );
}

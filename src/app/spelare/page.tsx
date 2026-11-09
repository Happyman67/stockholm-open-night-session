import { Suspense } from "react";
import { PlayerDirectory } from "@/components/player-views";

export const metadata = { title: "Spelare" };

export default function Page() {
  return (
    <Suspense fallback={<p className="px-5 py-16 text-muted-foreground">…</p>}>
      <PlayerDirectory />
    </Suspense>
  );
}

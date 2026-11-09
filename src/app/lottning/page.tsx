import { Suspense } from "react";
import { DrawView } from "@/components/draw-view";

export const metadata = { title: "Lottning" };

export default function Page() {
  return (
    <Suspense fallback={<p className="px-5 py-16 text-muted-foreground">…</p>}>
      <DrawView />
    </Suspense>
  );
}

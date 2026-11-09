import { notFound } from "next/navigation";
import { PlayerProfile } from "@/components/player-views";
import { getPlayer, getPlayers } from "@/lib/data/adapter";

export function generateStaticParams() {
  return getPlayers().map((player) => ({ id: player.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getPlayer(id)) notFound();
  return <PlayerProfile id={id} />;
}

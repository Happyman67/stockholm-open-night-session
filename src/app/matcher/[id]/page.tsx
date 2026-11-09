import { notFound } from "next/navigation";
import { MatchDetail } from "@/components/match-detail";
import { getMatch, getMatches } from "@/lib/data/adapter";

export function generateStaticParams() {
  return getMatches().map((match) => ({ id: match.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getMatch(id)) notFound();
  return <MatchDetail id={id} />;
}

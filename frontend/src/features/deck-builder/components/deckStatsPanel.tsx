import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useDeckStats } from "../hooks/useDeckStats";
import type { DeckState } from "../deckTypes";

function MiniBarChart({ data, height = 140 }: { data: { name: string; count: number }[]; height?: number }) {
  if (data.length === 0) return <p style={{ fontSize: 12, opacity: 0.6 }}>No data yet</p>;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-30} textAnchor="end" height={50} />
        <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
        <Tooltip />
        <Bar dataKey="count" fill="#5b8def" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DeckStatsPanel({ deck }: { deck: DeckState }) {
  const { typeDistribution, attributeDistribution } = useDeckStats(deck);

  return (
    <div style={{ marginTop: 16 }}>
      <h3>Deck Stats</h3>
      <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Card Types</p>
      <MiniBarChart data={typeDistribution} />
      <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Attributes</p>
      <MiniBarChart data={attributeDistribution} />
    </div>
  );
}
import type { Violation } from "../deckTypes";

export function RuleWarning({ violations }: { violations: Violation[] }) {
  if (violations.length === 0) return null;

  return (
    <div style={{ background: "#3a2a00", border: "1px solid #a86400", padding: 8, borderRadius: 4, marginBottom: 12 }}>
      <strong>Not Legal:</strong>
      <ul style={{ margin: "4px 0 0", paddingLeft: 20 }}>
        {violations.map((v) => (
          <li key={v.rule}>{v.message}</li>
        ))}
      </ul>
    </div>
  );
}
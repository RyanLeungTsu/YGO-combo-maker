import { useState } from "react";
import { probabilityAtLeast } from "../../../lib/handProbability";

export function ProbabilityCalculator({ deckSize }: { deckSize: number }) {
  const [copies, setCopies] = useState(3);
  const [handSize, setHandSize] = useState(5);
  const [wanted, setWanted] = useState(1);

  const prob = deckSize > 0 ? probabilityAtLeast(deckSize, copies, handSize, wanted) : 0;

  return (
    <div style={{ marginTop: 12, fontSize: 12 }}>
      <p style={{ fontWeight: 600, marginBottom: 4 }}>Odds Calculator</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <label>Copies in deck: <input type="number" min={0} max={deckSize} value={copies} onChange={(e) => setCopies(Number(e.target.value))} style={{ width: 50 }} /></label>
        <label>Hand size: <input type="number" min={1} max={deckSize} value={handSize} onChange={(e) => setHandSize(Number(e.target.value))} style={{ width: 50 }} /></label>
        <label>Want at least: <input type="number" min={1} value={wanted} onChange={(e) => setWanted(Number(e.target.value))} style={{ width: 50 }} /></label>
      </div>
      <p style={{ marginTop: 6 }}>
        Chance of {wanted}+ copy in opening {handSize}: <strong>{(prob * 100).toFixed(1)}%</strong>
      </p>
    </div>
  );
}
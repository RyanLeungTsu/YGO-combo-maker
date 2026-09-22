import { useUiStore } from "../../store/uiStore";

const BANLIST_FORMATS = [
  { value: "tcg", label: "TCG" },
  { value: "ocg", label: "OCG" },
  { value: "masterduel", label: "Master Duel" },
];

export function Header() {
  const banlistFormat = useUiStore((s) => s.banlistFormat);
  const setBanlistFormat = useUiStore((s) => s.setBanlistFormat);

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        borderBottom: "1px solid #333",
        background: "#141414",
      }}
    >
      <div style={{ width: 140 }} /> 

      <h1 style={{ margin: 0, fontSize: 18, textAlign: "center" }}>Combo Maker</h1>

      <select
        value={banlistFormat}
        onChange={(e) => setBanlistFormat(e.target.value)}
        style={{ fontSize: 12, width: 140 }}
        title="Banlist format used for deck legality checks"
      >
        {BANLIST_FORMATS.map((f) => (
          <option key={f.value} value={f.value}>{f.label} Banlist</option>
        ))}
      </select>
    </header>
  );
}
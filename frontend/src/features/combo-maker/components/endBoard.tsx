import { useDroppable } from "@dnd-kit/core";
import { useEndBoardStore } from "../hooks/useEndBoardStore";
import { useUiStore } from "../../../store/uiStore";
import {
  MAIN_MONSTER_ZONES,
  EXTRA_MONSTER_ZONES,
  SPELL_TRAP_ZONES,
  FIELD_ZONE,
} from "../fieldTypes";
import type { ZoneId, CardOrientation } from "../fieldTypes";
import "../../../styles/fieldArea.css";

const ORIENTATION_CYCLE: CardOrientation[] = ["face-up", "face-up-defense", "face-down-defense", "face-down"];

function nextOrientation(current: CardOrientation): CardOrientation {
  const idx = ORIENTATION_CYCLE.indexOf(current);
  return ORIENTATION_CYCLE[(idx + 1) % ORIENTATION_CYCLE.length];
}

function EndBoardSlot({ zone }: { zone: ZoneId }) {
  const placed = useEndBoardStore((s) => s.board[zone]);
  const clearZone = useEndBoardStore((s) => s.clearZone);
  const setOrientation = useEndBoardStore((s) => s.setOrientation);
  const openPreview = useUiStore((s) => s.openPreview);
  const { setNodeRef, isOver } = useDroppable({
    id: `endboard-${zone}`,
    data: { endBoardZone: zone },
  });

  const isRotated = placed?.orientation.includes("defense");
  const isFaceDown = placed?.orientation.includes("face-down");

  return (
    <div
      ref={setNodeRef}
      className={`field-zone-slot ${placed ? "field-zone-slot--filled" : ""}`}
      style={{ borderColor: isOver ? "#50a0ff" : undefined, width: 44, height: 44 }}
      onClick={() => placed && openPreview(placed.card)}
      onContextMenu={(e) => {
        e.preventDefault();
        if (placed) clearZone(zone);
      }}
      onDoubleClick={() => placed && setOrientation(zone, nextOrientation(placed.orientation))}
      title={placed ? `${zone} — double-click to rotate/flip, right-click to remove` : zone}
    >
      {placed && (
        <img
          src={placed.card.card_images[0]?.image_url_small}
          alt={placed.card.name}
          className="field-zone-image"
          style={{
            transform: isRotated ? "rotate(90deg) scale(0.8)" : "none",
            filter: isFaceDown ? "brightness(0.3) grayscale(1)" : "none",
          }}
        />
      )}
    </div>
  );
}

export function EndBoard() {
  const clearAll = useEndBoardStore((s) => s.clearAll);

  return (
    <div>
      <button onClick={clearAll} style={{ marginBottom: 8 }}>Clear Board</button>
      <div className="field-area">
        <div className="field-area-row field-area-row--extra">
          {EXTRA_MONSTER_ZONES.map((z) => <EndBoardSlot key={z} zone={z} />)}
        </div>
        <div className="field-area-row field-area-row--main">
          {MAIN_MONSTER_ZONES.map((z) => <EndBoardSlot key={z} zone={z} />)}
        </div>
        <div className="field-area-row field-area-row--backrow">
          {SPELL_TRAP_ZONES.map((z) => <EndBoardSlot key={z} zone={z} />)}
          {FIELD_ZONE.map((z) => <EndBoardSlot key={z} zone={z} />)}
        </div>
      </div>
      <p style={{ fontSize: 10, opacity: 0.6, marginTop: 6 }}>
        Drag a card here. Double-click to cycle face-up/defense/set/face-down. Right-click to remove.
      </p>
    </div>
  );
}
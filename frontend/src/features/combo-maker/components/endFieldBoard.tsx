import { useDroppable } from "@dnd-kit/core";
import { useEndFieldStore } from "../hooks/useEndFieldStore";
import { useUiStore } from "../../../store/uiStore";
import {
  MAIN_MONSTER_ZONES,
  EXTRA_MONSTER_ZONES,
  SPELL_TRAP_ZONES,
  FIELD_ZONE,
} from "../fieldTypes";
import type { ZoneId } from "../fieldTypes";
import "../../../styles/fieldArea.css";

function EndFieldSlot({ zone }: { zone: ZoneId }) {
  const card = useEndFieldStore((s) => s.board[zone]);
  const clearZone = useEndFieldStore((s) => s.clearZone);
  const openPreview = useUiStore((s) => s.openPreview);
  const { setNodeRef, isOver } = useDroppable({
    id: `endfield-${zone}`,
    data: { endFieldZone: zone },
  });

  return (
    <div
      ref={setNodeRef}
      className={`field-zone-slot ${card ? "field-zone-slot--filled" : ""}`}
      style={{
        borderColor: isOver ? "#50a0ff" : undefined,
        width: 44,
        height: 44,
      }}
      onClick={() => (card ? openPreview(card) : undefined)}
      onContextMenu={(e) => {
        e.preventDefault();
        if (card) clearZone(zone);
      }}
      title={zone}
    >
      {card && (
        <img
          src={card.card_images[0]?.image_url_small}
          alt={card.name}
          className="field-zone-image"
        />
      )}
    </div>
  );
}

export function EndFieldBoard() {
  const clearAll = useEndFieldStore((s) => s.clearAll);

  return (
    <div>
      <button onClick={clearAll} style={{ marginBottom: 8 }}>
        Clear Board
      </button>
      <div className="field-area">
        <div className="field-area-row field-area-row--extra">
          {EXTRA_MONSTER_ZONES.map((z) => (
            <EndFieldSlot key={z} zone={z} />
          ))}
        </div>
        <div className="field-area-row field-area-row--main">
          {MAIN_MONSTER_ZONES.map((z) => (
            <EndFieldSlot key={z} zone={z} />
          ))}
        </div>
        <div className="field-area-row field-area-row--backrow">
          {FIELD_ZONE.map((z) => (
            <EndFieldSlot key={z} zone={z} />
          ))}
          {SPELL_TRAP_ZONES.map((z) => (
            <EndFieldSlot key={z} zone={z} />
          ))}
        </div>
      </div>
      <p style={{ fontSize: 10, opacity: 0.6, marginTop: 6 }}>
        Drag a card here, right-click to remove.
      </p>
    </div>
  );
}

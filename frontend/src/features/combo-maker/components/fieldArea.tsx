import type { Card } from "../../../types/card";
import type { ZoneId } from "../fieldTypes";
import {
  MAIN_MONSTER_ZONES,
  EXTRA_MONSTER_ZONES,
  SPELL_TRAP_ZONES,
  FIELD_ZONE,
} from "../fieldTypes";
import "../../../styles/fieldArea.css";

interface FieldAreaProps {
  board: Map<ZoneId, Card>;
  onZoneRightClick?: (zone: ZoneId) => void;
  highlightZones?: Set<ZoneId>;
}

function ZoneSlot({
  zone,
  board,
  isViolation,
  onZoneRightClick,
}: {
  zone: ZoneId;
  board: Map<ZoneId, Card>;
  isViolation?: boolean;
  onZoneRightClick?: (z: ZoneId) => void;
}) {
  const card = board.get(zone);
  return (
    <div
      className={`field-zone-slot ${card ? "field-zone-slot--filled" : ""} ${isViolation ? "field-zone-slot--violation" : ""}`}
      onContextMenu={(e) => {
        e.preventDefault();
        if (card) onZoneRightClick?.(zone);
      }}
      title={card ? `${zone} — right-click to remove` : zone}
    >
      {card ? (
        <img
          src={card.card_images[0]?.image_url_small}
          alt={card.name}
          className="field-zone-image"
        />
      ) : null}
    </div>
  );
}

export function FieldArea({
  board,
  onZoneRightClick,
  highlightZones,
}: FieldAreaProps) {
  const isViolation = (z: ZoneId) => highlightZones?.has(z) ?? false;

  return (
    <div className="field-area">
      <div className="field-area-row field-area-row--extra">
        {EXTRA_MONSTER_ZONES.map((z) => (
          <ZoneSlot
            key={z}
            zone={z}
            board={board}
            onZoneRightClick={onZoneRightClick}
            isViolation={isViolation(z)}
          />
        ))}
      </div>
      <div className="field-area-row field-area-row--main">
        {MAIN_MONSTER_ZONES.map((z) => (
          <ZoneSlot
            key={z}
            zone={z}
            board={board}
            onZoneRightClick={onZoneRightClick}
            isViolation={isViolation(z)}
          />
        ))}
      </div>
      <div className="field-area-row field-area-row--backrow">
        {SPELL_TRAP_ZONES.map((z) => (
          <ZoneSlot
            key={z}
            zone={z}
            board={board}
            onZoneRightClick={onZoneRightClick}
            isViolation={isViolation(z)}
          />
        ))}
        {FIELD_ZONE.map((z) => (
          <ZoneSlot
            key={z}
            zone={z}
            board={board}
            onZoneRightClick={onZoneRightClick}
            isViolation={isViolation(z)}
          />
        ))}
      </div>
    </div>
  );
}

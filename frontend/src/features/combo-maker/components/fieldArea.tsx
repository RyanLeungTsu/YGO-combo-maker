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
  onZoneClick?: (zone: ZoneId) => void;
  highlightZones?: Set<ZoneId>;
}

function ZoneSlot({
  zone,
  board,
  onZoneClick,
  isViolation,
}: {
  zone: ZoneId;
  board: Map<ZoneId, Card>;
  onZoneClick?: (z: ZoneId) => void;
  isViolation?: boolean;
}) {
  const card = board.get(zone);
  return (
    <div
      className={`field-zone-slot ${card ? "field-zone-slot--filled" : ""} ${isViolation ? "field-zone-slot--violation" : ""}`}
      onClick={() => onZoneClick?.(zone)}
      title={zone}
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
  onZoneClick,
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
            onZoneClick={onZoneClick}
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
            onZoneClick={onZoneClick}
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
            onZoneClick={onZoneClick}
            isViolation={isViolation(z)}
          />
        ))}
        {FIELD_ZONE.map((z) => (
          <ZoneSlot
            key={z}
            zone={z}
            board={board}
            onZoneClick={onZoneClick}
            isViolation={isViolation(z)}
          />
        ))}
      </div>
    </div>
  );
}

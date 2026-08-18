import { useState } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
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

const ORIENTATION_CYCLE: CardOrientation[] = [
  "face-up",
  "face-up-defense",
  "face-down-defense",
  "face-down",
];

function nextOrientation(current: CardOrientation): CardOrientation {
  const idx = ORIENTATION_CYCLE.indexOf(current);
  return ORIENTATION_CYCLE[(idx + 1) % ORIENTATION_CYCLE.length];
}

function EndBoardSlot({ zone }: { zone: ZoneId }) {
  const placed = useEndBoardStore((s) => s.board[zone]);
  // const clearZone = useEndBoardStore((s) => s.clearZone);
  const setOrientation = useEndBoardStore((s) => s.setOrientation);
  const addMaterial = useEndBoardStore((s) => s.addXyzMaterial);
  const removeMaterial = useEndBoardStore((s) => s.removeXyzMaterial);
  const openPreview = useUiStore((s) => s.openPreview);
  const [showMaterials, setShowMaterials] = useState(false);

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `endboard-${zone}`,
    data: { endBoardZone: zone },
  });
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: `endboard-card-${zone}`,
    data: { endBoardSourceZone: zone, card: placed?.card },
  });

  const isRotated = placed?.orientation.includes("defense");
  const isFaceDown = placed?.orientation.includes("face-down");
  const isXyz = placed?.card.type === "XYZ Monster";

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={(el) => {
          setDropRef(el);
          setDragRef(el);
        }}
        {...(placed ? { ...attributes, ...listeners } : {})}
        className={`field-zone-slot ${placed ? "field-zone-slot--filled" : ""}`}
        style={{
          borderColor: isOver ? "#50a0ff" : undefined,
          opacity: isDragging ? 0.4 : 1,
          cursor: placed ? "grab" : "default",
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (placed) openPreview(placed.card);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          if (placed) setOrientation(zone, nextOrientation(placed.orientation));
        }}
        title={
          placed
            ? `${zone} — drag to move/remove, right-click to rotate/flip`
            : zone
        }
      >
        {placed && (
          <img
            src={placed.card.card_images[0]?.image_url_small}
            alt={placed.card.name}
            className="field-zone-image"
            style={{
              transform: isRotated ? "rotate(90deg) scale(0.75)" : "none",
              filter: isFaceDown ? "brightness(0.3) grayscale(1)" : "none",
            }}
          />
        )}
      </div>

      {placed && isXyz && (
        <button
          className="xyz-material-toggle"
          onClick={(e) => {
            e.stopPropagation();
            setShowMaterials((v) => !v);
          }}
          title="Xyz Material"
        >
          {placed.materials?.length ?? 0}
        </button>
      )}

      {showMaterials && placed && isXyz && (
        <div className="xyz-material-panel">
          <p className="extra-zone-empty" style={{ marginBottom: 4 }}>
            Attached material:
          </p>
          <div className="extra-zone-grid">
            {(placed.materials ?? []).map((m, i) => (
              <img
                key={`${m.id}-${i}`}
                src={m.card_images[0]?.image_url_small}
                alt={m.name}
                className="extra-zone-card"
                onClick={() => openPreview(m)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  removeMaterial(zone, i);
                }}
              />
            ))}
          </div>
          <XyzMaterialDrop
            zone={zone}
            onDrop={(card) => addMaterial(zone, card)}
          />
        </div>
      )}
    </div>
  );
}

function XyzMaterialDrop({
  zone,
}: {
  zone: ZoneId;
  onDrop: (card: import("../../../types/card").Card) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `xyzmaterial-${zone}`,
    data: { xyzMaterialZone: zone },
  });
  return (
    <div
      ref={setNodeRef}
      className="xyz-material-dropzone"
      style={{ borderColor: isOver ? "#50a0ff" : undefined }}
    >
      Drag material here
    </div>
  );
}

const SIDE_ZONE_LABELS: Record<"gy" | "banished", string> = {
  gy: "GY",
  banished: "Banished",
};

function SideZoneColumn({ zone }: { zone: "gy" | "banished" }) {
  const [expanded, setExpanded] = useState(false);
  const cards = useEndBoardStore((s) => s.extraZones[zone]);
  const removeFromExtraZone = useEndBoardStore((s) => s.removeFromExtraZone);
  const openPreview = useUiStore((s) => s.openPreview);
  const { setNodeRef, isOver } = useDroppable({
    id: `extrazone-${zone}`,
    data: { extraBoardZone: zone },
  });

  return (
    <div>
      <button
        ref={setNodeRef}
        onClick={() => setExpanded((v) => !v)}
        className="side-zone-icon"
        style={{
          borderColor: isOver ? "#50a0ff" : expanded ? "#5b8def" : undefined,
        }}
      >
        {SIDE_ZONE_LABELS[zone]} ({cards.length})
      </button>

      {expanded && (
        <div className="side-zone-panel">
          {cards.length === 0 && (
            <p className="extra-zone-empty">Drag cards here</p>
          )}
          <div className="extra-zone-grid">
            {cards.map((card, i) => (
              <img
                key={`${card.id}-${i}`}
                src={card.card_images[0]?.image_url_small}
                alt={card.name}
                className="extra-zone-card"
                onClick={() => openPreview(card)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  removeFromExtraZone(zone, i);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HandZone() {
  const cards = useEndBoardStore((s) => s.extraZones.hand);
  const removeFromExtraZone = useEndBoardStore((s) => s.removeFromExtraZone);
  const openPreview = useUiStore((s) => s.openPreview);
  const { setNodeRef, isOver } = useDroppable({
    id: "extrazone-hand",
    data: { extraBoardZone: "hand" },
  });

  return (
    <div>
      <p className="end-board-hand-label">Hand ({cards.length})</p>
      <div
        ref={setNodeRef}
        className="end-board-hand-strip"
        style={{ borderColor: isOver ? "#50a0ff" : undefined }}
      >
        {cards.length === 0 && (
          <p className="extra-zone-empty">Drag cards here</p>
        )}
        {cards.map((card, i) => (
          <img
            key={`${card.id}-${i}`}
            src={card.card_images[0]?.image_url_small}
            alt={card.name}
            className="extra-zone-card"
            onClick={() => openPreview(card)}
            onContextMenu={(e) => {
              e.preventDefault();
              removeFromExtraZone("hand", i);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function EndBoard() {
  const clearAll = useEndBoardStore((s) => s.clearAll);

  return (
    <div>
      <div className="end-board">

        <div className="end-board-layout">
          <div className="end-board-left-column">
          {FIELD_ZONE.map((z) => (
            <EndBoardSlot key={z} zone={z} />
          ))}
        </div>
          <div className="field-area">
            <div className="field-area-row field-area-row--extra">
              {EXTRA_MONSTER_ZONES.map((z) => (
                <EndBoardSlot key={z} zone={z} />
              ))}
            </div>
            <div className="field-area-row field-area-row--main">
              {MAIN_MONSTER_ZONES.map((z) => (
                <EndBoardSlot key={z} zone={z} />
              ))}
            </div>
            <div className="field-area-row field-area-row--backrow">
              {SPELL_TRAP_ZONES.map((z) => (
                <EndBoardSlot key={z} zone={z} />
              ))}
            </div>
          </div>

          <div className="end-board-right-column">
            <SideZoneColumn zone="gy" />
            <SideZoneColumn zone="banished" />
            <button onClick={clearAll} style={{ marginBottom: 8 }}>
        Clear Board
      </button>
          </div>
        </div>
      </div>

      <HandZone />

      <p style={{ fontSize: 10, opacity: 0.6, marginTop: 6 }}>
        Drag to place/reposition/remove. Right-click to rotate/flip.
      </p>
    </div>
  );
}

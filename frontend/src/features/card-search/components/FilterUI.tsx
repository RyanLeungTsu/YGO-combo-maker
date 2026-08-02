import type { CardSearchFilters } from "../../../types/card";
import { CARD_TYPES, CARD_ATTRIBUTES, CARD_LEVELS } from "../../../lib/constants";
import { useArchetypes } from "../hooks/useArchetypes";

interface FilterUIProps {
  filters: CardSearchFilters;
  onSetFilter: <K extends keyof CardSearchFilters>(key: K, value: CardSearchFilters[K]) => void;
  onClearFilter: (key: keyof CardSearchFilters) => void;
  onClearAll: () => void;
}

export function FilterUI({ filters, onSetFilter, onClearFilter, onClearAll }: FilterUIProps) {
  const { data: archetypes, isLoading: archetypesLoading } = useArchetypes();

  const activeFilterCount = Object.keys(filters).filter(
    (k) => k !== "name" && filters[k as keyof CardSearchFilters] !== undefined
  ).length;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "12px 0" }}>
      {/* type */}
      <select
        value={filters.type ?? ""}
        onChange={(e) =>
          e.target.value ? onSetFilter("type", e.target.value) : onClearFilter("type")
        }
      >
        <option value="">Type: Any</option>
        {CARD_TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      {/* attribute */}
      <select
        value={filters.attribute ?? ""}
        onChange={(e) =>
          e.target.value ? onSetFilter("attribute", e.target.value) : onClearFilter("attribute")
        }
      >
        <option value="">Attribute: Any</option>
        {CARD_ATTRIBUTES.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>

      {/* level */}
      <select
        value={filters.level ?? ""}
        onChange={(e) =>
          e.target.value ? onSetFilter("level", Number(e.target.value)) : onClearFilter("level")
        }
      >
        <option value="">Level: Any</option>
        {CARD_LEVELS.map((lvl) => (
          <option key={lvl} value={lvl}>{lvl}</option>
        ))}
      </select>

      {/* atk */}
      <input
        type="number"
        placeholder="Min ATK"
        value={filters.atk ?? ""}
        onChange={(e) =>
          e.target.value ? onSetFilter("atk", Number(e.target.value)) : onClearFilter("atk")
        }
        style={{ width: 90 }}
      />

      {/* def */}
      <input
        type="number"
        placeholder="Min DEF"
        value={filters.def ?? ""}
        onChange={(e) =>
          e.target.value ? onSetFilter("def", Number(e.target.value)) : onClearFilter("def")
        }
        style={{ width: 90 }}
      />

      {/* archetype */}
      <select
        value={filters.archetype ?? ""}
        onChange={(e) =>
          e.target.value ? onSetFilter("archetype", e.target.value) : onClearFilter("archetype")
        }
        disabled={archetypesLoading}
      >
        <option value="">Archetype: Any</option>
        {archetypes?.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>

      {activeFilterCount > 0 && (
        <button onClick={onClearAll}>Clear filters ({activeFilterCount})</button>
      )}
    </div>
  );
}
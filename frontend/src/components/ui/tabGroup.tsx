import { useState } from "react";
import type { ReactNode } from "react";

interface TabDefinition {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabGroupProps {
  tabs: TabDefinition[];
  defaultTabId?: string;
}

export function TabGroup({ tabs, defaultTabId }: TabGroupProps) {
  const [activeId, setActiveId] = useState(defaultTabId ?? tabs[0]?.id);
  const activeTab = tabs.find((t) => t.id === activeId);

  return (
    <div>
      <div style={{ display: "flex", gap: 4, borderBottom: "1px solid #333" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveId(tab.id)}
            style={{
              padding: "8px 16px",
              background: "transparent",
              border: "none",
              borderBottom: activeId === tab.id ? "2px solid #5b8def" : "2px solid transparent",
              color: activeId === tab.id ? "#fff" : "#888",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ paddingTop: 12 }}>{activeTab?.content}</div>
    </div>
  );
}
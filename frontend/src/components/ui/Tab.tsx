import { useState } from "react";
import type { ReactNode } from "react";

interface TabProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function Tab({ title, defaultOpen = false, children }: TabProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div style={{ border: "1px solid #333", borderRadius: 8, marginBottom: 12 }}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "10px 12px",
          background: "#1a1a1a",
          border: "none",
          borderRadius: isOpen ? "8px 8px 0 0" : 8,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>{title}</span>
        <span>{isOpen ? "▾" : "▸"}</span>
      </button>
      {isOpen && <div style={{ padding: 12 }}>{children}</div>}
    </div>
  );
}
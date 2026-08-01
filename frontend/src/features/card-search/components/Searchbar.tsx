interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="Search cards by name..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ width: "100%", padding: 8, fontSize: 14 }}
    />
  );
}
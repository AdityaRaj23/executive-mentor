export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="h-serif" style={{ fontSize: 32, color: "var(--color-text)", lineHeight: 1 }}>
        {value}
      </div>
      <div className="uc" style={{ fontSize: 10, marginTop: 6 }}>
        {label}
      </div>
    </div>
  );
}

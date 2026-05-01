import type { MilestoneStatus } from "@/types";

const CFG: Record<MilestoneStatus, { label: string; color: string; bg: string }> = {
  done: { label: "Completed", color: "var(--color-muted)", bg: "rgba(130,154,177,0.1)" },
  current: { label: "Active now", color: "var(--color-accent)", bg: "rgba(16,185,129,0.12)" },
  future: { label: "Forecast", color: "var(--color-muted)", bg: "rgba(255,255,255,0.04)" },
  alt: { label: "Alt path", color: "var(--color-sapphire)", bg: "rgba(14,165,233,0.12)" },
};

export function StatusBadge({ status }: { status: MilestoneStatus }) {
  const cfg = CFG[status];
  return (
    <span
      className="uc"
      style={{
        fontSize: 9,
        padding: "3px 8px",
        background: cfg.bg,
        color: cfg.color,
        letterSpacing: "0.14em",
      }}
    >
      {cfg.label}
    </span>
  );
}

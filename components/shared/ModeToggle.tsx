"use client";
import { useThemeMode } from "@/lib/hooks/useThemeMode";

export function ModeToggle() {
  const { mode, setMode } = useThemeMode();
  const isLight = mode === "light";
  return (
    <button
      onClick={() => setMode(isLight ? "dark" : "light")}
      title={isLight ? "Switch to dark" : "Switch to light"}
      aria-label="Toggle dark/light mode"
      style={{
        width: 32,
        height: 32,
        background: "transparent",
        border: "var(--hairline-strong)",
        borderRadius: "var(--radius)",
        color: "var(--color-muted)",
        cursor: "pointer",
        display: "grid",
        placeItems: "center",
        transition: "all 0.18s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--color-text)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--color-muted)";
      }}
    >
      {isLight ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      )}
    </button>
  );
}

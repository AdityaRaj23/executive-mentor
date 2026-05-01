"use client";
import { useState, type CSSProperties, type ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "ghost" | "accent";
type Size = "sm" | "md" | "lg";

const SIZES: Record<Size, CSSProperties> = {
  sm: { padding: "8px 16px", fontSize: 12 },
  md: { padding: "14px 28px", fontSize: 13 },
  lg: { padding: "18px 36px", fontSize: 14 },
};

export function CTA({
  children,
  onClick,
  variant = "primary",
  size = "md",
  icon,
  style: overrideStyle,
  type = "button",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: IconName | null;
  style?: CSSProperties;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const [hover, setHover] = useState(false);

  const variants: Record<Variant, CSSProperties> = {
    primary: {
      background: hover ? "var(--color-sapphire)" : "var(--color-accent)",
      color: "var(--color-bg)",
      border: 0,
    },
    ghost: {
      background: hover ? "rgba(255,255,255,0.06)" : "transparent",
      color: "var(--color-text)",
      border: "var(--hairline-strong)",
    },
    accent: {
      background: hover ? "rgba(16,185,129,0.16)" : "rgba(16,185,129,0.08)",
      color: "var(--color-accent)",
      border: "1px solid rgba(16,185,129,0.4)",
    },
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...SIZES[size],
        ...variants[variant],
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        borderRadius: "var(--radius)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.2s ease",
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        ...overrideStyle,
      }}
    >
      {children}
      {icon && <Icon name={icon} size={14} />}
    </button>
  );
}

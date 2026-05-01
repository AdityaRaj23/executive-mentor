import type { CSSProperties } from "react";

const PATHS: Record<string, string> = {
  arrowRight: "M5 12h14M13 6l6 6-6 6",
  send: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
  sparkle: "M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8",
  chat: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  map: "M9 20l-6-3V4l6 3 6-3 6 3v13l-6-3-6 3zM9 7v13M15 4v13",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  home: "M3 12l9-9 9 9M5 10v10h14V10",
  check: "M5 12l5 5L20 6",
  user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  trend: "M3 17l6-6 4 4 8-8M14 7h7v7",
  target: "M12 12m-9 0a9 9 0 1018 0 9 9 0 10-18 0M12 12m-5 0a5 5 0 1010 0 5 5 0 10-10 0M12 12m-1 0a1 1 0 102 0 1 1 0 10-2 0",
  plus: "M12 5v14M5 12h14",
  filter: "M3 4h18l-7 9v7l-4-2v-5L3 4z",
  download: "M12 3v12M7 10l5 5 5-5M3 21h18",
  bell: "M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0",
  search: "M11 11m-8 0a8 8 0 1016 0 8 8 0 10-16 0M21 21l-4.3-4.3",
  chevronRight: "M9 6l6 6-6 6",
  chevronDown: "M6 9l6 6 6-6",
  spark: "M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8 5.8 21.3l2.4-7.4L2 9.4h7.6L12 2z",
  bolt: "M13 2L3 14h7l-1 8 10-12h-7l1-8z",
  book: "M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z",
  lock: "M5 11h14v10H5zM8 11V7a4 4 0 018 0v4",
  close: "M18 6L6 18M6 6l12 12",
  menu: "M3 6h18M3 12h18M3 18h18",
};

export type IconName = keyof typeof PATHS | string;

export function Icon({ name, size = 16, stroke = 1.5, style }: { name: IconName; size?: number; stroke?: number; style?: CSSProperties }) {
  const d = PATHS[name] || PATHS.arrowRight;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }}>
      <path d={d} />
    </svg>
  );
}

"use client";
import { useEffect, useState, useCallback } from "react";
import type { Mode } from "@/types";

const KEY = "em.mode";

export function useThemeMode() {
  const [mode, setModeState] = useState<Mode>("dark");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(KEY) as Mode | null;
      if (stored === "light" || stored === "dark") {
        setModeState(stored);
        document.documentElement.dataset.mode = stored;
      } else {
        document.documentElement.dataset.mode = "dark";
      }
    } catch {
      document.documentElement.dataset.mode = "dark";
    }
  }, []);

  const setMode = useCallback((next: Mode) => {
    setModeState(next);
    document.documentElement.dataset.mode = next;
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      // ignore
    }
  }, []);

  return { mode, setMode };
}

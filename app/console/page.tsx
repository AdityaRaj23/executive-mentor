"use client";
import dynamic from "next/dynamic";

const ConsoleScreen = dynamic(() => import("@/components/console/ConsoleScreen"), { ssr: false });

export default function ConsolePage() {
  return <ConsoleScreen />;
}

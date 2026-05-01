"use client";
import dynamic from "next/dynamic";

const FirstYearScreen = dynamic(() => import("@/components/firstyear/FirstYearScreen"), { ssr: false });

export default function FirstYearPage() {
  return <FirstYearScreen />;
}

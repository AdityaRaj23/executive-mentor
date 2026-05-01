"use client";
import dynamic from "next/dynamic";

const RoadmapScreen = dynamic(() => import("@/components/roadmap/RoadmapScreen"), { ssr: false });

export default function RoadmapPage() {
  return <RoadmapScreen />;
}

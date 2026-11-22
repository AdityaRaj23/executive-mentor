import { Hero } from "@/components/landing/Hero";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { PullQuote } from "@/components/landing/PullQuote";
import { ClosingCTA } from "@/components/landing/ClosingCTA";

export default function LandingPage() {
  return (
    <div>
      <Hero />
      <FeatureGrid />
      <PullQuote />
      <ClosingCTA />
    </div>
  );
}

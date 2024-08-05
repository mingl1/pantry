"use client";
import LandingPrimary from "@/components/LandingPrimary";
import ScrollingIcons from "@/components/ScrollingIcons";
import IconSection from "@/components/IconSection";

export default function Home() {
  return (
    <main>
      <LandingPrimary />
      <ScrollingIcons />
      <div className="">
        <IconSection />
      </div>
    </main>
  );
}

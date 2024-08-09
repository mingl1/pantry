"use client";
import { LandingPrimaryVideoCtaSection } from "@/components/landing/cta/LandingPrimaryCta";

import { Button } from "@/components/shared/ui/button";

export default function Component() {
  return (
    <LandingPrimaryVideoCtaSection
      title="Time to organize those browser bookmarks🔖"
      description="Find whats important, with PageMark Co."
      autoPlay={false}
      controls={false}
      videoPosition="center"
      videoSrc="https://cache.shipixen.com/features/11-pricing-page-builder.mp4"
      withBackground
      variant="secondary"
      // leadingComponent={<LandingProductHuntAward />}
    >
      <Button size="xl" variant="secondary" asChild>
        <a href="/register">Get started</a>
      </Button>

      <Button size="xl" variant="outlineSecondary">
        <a href="/details">Learn More</a>
      </Button>

      {/* <LandingDiscount
        discountValueText="$50 off"
        discountDescriptionText="for the first 20 customers (5 left)"
      /> */}
    </LandingPrimaryVideoCtaSection>
  );
}

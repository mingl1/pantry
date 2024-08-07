"use client";
import { LandingPrimaryVideoCtaSection } from "@/components/landing/cta/LandingPrimaryCta";
import { LandingDiscount } from "@/components/landing/discount/LandingDiscount";
import { LandingProductHuntAward } from "@/components/landing/social-proof/LandingProductHuntAward";
import { LandingSocialProof } from "@/components/landing/social-proof/LandingSocialProof";

import { Button } from "@/components/shared/ui/button";

export default function Component() {
  const avatarItems = [
    {
      imageSrc: "https://picsum.photos/id/64/100/100",
      name: "John Doe",
    },
    {
      imageSrc: "https://picsum.photos/id/65/100/100",
      name: "Jane Doe",
    },
    {
      imageSrc: "https://picsum.photos/id/669/100/100",
      name: "Alice Doe",
    },
  ];

  return (
    <LandingPrimaryVideoCtaSection
      title="Time to organize those browser bookmarks🔖"
      description="Find whats important, with SupaMark."
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

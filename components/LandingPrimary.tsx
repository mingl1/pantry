"use client";
import { LandingPrimaryVideoCtaSection } from "@/components/landing/cta/LandingPrimaryCta";

import { Button } from "@/components/shared/ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
export default function Component() {
  const [isMounted, setIsMounted] = useState("");
  const theme = useTheme().resolvedTheme!;

  useEffect(() => setIsMounted(theme), [useTheme().theme]);

  return (
    <>
      {isMounted.length > 0 ? (
        <LandingPrimaryVideoCtaSection
          title="Time to organize those browser bookmarks🔖"
          description="Find whats important, with PageMark Co."
          autoPlay={false}
          controls={false}
          videoPosition="center"
          videoSrc="https://cache.shipixen.com/features/11-pricing-page-builder.mp4"
          withBackground
          variant={isMounted == "dark" ? "primary" : "secondary"}
          // leadingComponent={<LandingProductHuntAward />}
        >
          <Button
            size="xl"
            variant={isMounted == "dark" ? "primary" : "secondary"}
            asChild
          >
            <a href="/register">Get started</a>
          </Button>

          <Button
            size="xl"
            variant={
              isMounted == "dark" ? "outlinePrimary" : "outlineSecondary"
            }
          >
            <a href="/details">Learn More</a>
          </Button>
        </LandingPrimaryVideoCtaSection>
      ) : (
        <section
          className={
            "w-full flex flex-col justify-center items-center gap-8 py-12 lg:py-16 h-full"
          }
        >
          <div className="w-full p-6 flex flex-col gap-8 relative container-narrow items-start">
            <div className="flex flex-col gap-4 justify-center w-full">
              <Skeleton className="h-24 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
              <div className="flex flex-wrap gap-4 mt-2 justify-start w-full">
                <Skeleton className="h-12 w-1/6" />
                <Skeleton className="h-12 w-1/6" />
              </div>
            </div>
            <section className="w-full mt-6 md:mt-8 h-[40vh]">
              <div className="w-full hard-shadow rounded-lg overflow-hidden shadow-md h-full">
                <Skeleton className="w-full h-full" />
              </div>
            </section>
          </div>
        </section>
      )}
    </>
  );
}

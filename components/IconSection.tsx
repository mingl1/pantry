import {
  ChromeIcon,
  FramerIcon,
  TwitchIcon,
  TwitterIcon,
  InstagramIcon,
  YoutubeIcon,
  AirplayIcon,
  CctvIcon,
  Tv2Icon,
  CompassIcon,
} from "lucide-react";
import Edge from "../public/edge.svg";
import OldEdge from "../public/oldedge.svg";
import Arc from "../public/arc.svg";
import Firefox from "../public/firefox.png";
import { LandingShowcase } from "@/components/landing/showcase/LandingShowcase";
import { LandingShowcaseItem } from "@/components/landing/showcase/LandingShowcaseItem";
import Image from "next/image";

export default function Component() {
  return (
    <LandingShowcase
      titleComponent={
        <>
          <p className="-mt-12 text-xl font-cursive font-semibold tracking-wider bg-clip-text bg-gradient-to-r text-transparent from-pink-500 via-pink-400 to-pink-500">
            Import
          </p>

          <h2 className="text-4xl font-semibold leading-tight">
            Add bookmarks from anywhere
          </h2>
        </>
      }
      description="All your bookmarks in one place. Import your existing bookmarks from any browser. We will remove the duplicates for you!"
      className="pt-16 px-10 sm:px-12 xl:px-32"
      withBackground
    >
      <LandingShowcaseItem className="bg-secondary-100">
        <ChromeIcon className="w-11 h-11" />
      </LandingShowcaseItem>

      <LandingShowcaseItem className="bg-secondary-100">
        <CompassIcon className="w-11 h-11" />
      </LandingShowcaseItem>

      <LandingShowcaseItem className="bg-secondary-100">
        <Image className="w-11 h-11" alt="Arc browser icon" src={Firefox} />
      </LandingShowcaseItem>
      <LandingShowcaseItem className="bg-secondary-100">
        <Image className="w-11 h-11" alt="Arc browser icon" src={OldEdge} />
      </LandingShowcaseItem>

      <LandingShowcaseItem className="bg-secondary-100">
        <Image className="w-11 h-11" alt="Arc browser icon" src={Edge} />
      </LandingShowcaseItem>

      <LandingShowcaseItem className="bg-secondary-100">
        <Image className="w-11 h-11" alt="Arc browser icon" src={Arc} />
      </LandingShowcaseItem>
    </LandingShowcase>
  );
}

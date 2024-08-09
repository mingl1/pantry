import { LandingMarquee } from "@/components/landing/LandingMarquee";
import { ChromeIcon, CompassIcon } from "lucide-react";
import Image from "next/image";
import Edge from "../public/edge.svg";
import OldEdge from "../public/oldedge.svg";
import Arc from "../public/arc.svg";
import Firefox from "../public/firefox.png";
export default function Component() {
  return (
    <LandingMarquee withBackground>
      <ChromeIcon className="w-12 h-12 mx-8" />
      <CompassIcon className="w-12 h-12 mx-8" />
      <Image
        className="w-12 h-12 mx-8 dark:invert"
        alt="Firefox browser icon"
        src={Firefox}
      />
      <Image
        className="w-12 h-12 mx-8 dark:invert"
        alt="Old Edge browser icon"
        src={OldEdge}
      />
      <Image
        className="w-12 h-12 mx-8 dark:invert"
        alt="Edge browser icon"
        src={Edge}
      />
      <Image
        className="w-12 h-12 mx-8 dark:invert"
        alt="Arc browser icon"
        src={Arc}
      />
    </LandingMarquee>
  );
}

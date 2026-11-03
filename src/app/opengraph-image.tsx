import { ogImage, OG_SIZE } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Afshin Nahian Tripto: Founder, Product Engineer, AI Engineer";

export default function Image() {
  return ogImage({
    kicker: "Founder · Product Engineer · AI Engineer",
    title: "Built for people.",
    accent: "Ready for their agents.",
    footer: "Afshin Nahian Tripto · Dhaka, Bangladesh",
  });
}

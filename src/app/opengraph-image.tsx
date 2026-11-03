import { ogProfile, OG_SIZE } from "@/lib/og";
import { person } from "@/data/site";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Afshin Nahian Tripto: Founder, Product Engineer, AI Engineer";

export default function Image() {
  return ogProfile({
    name: person.name,
    roles: ["Founder", "Product Engineer", "AI Engineer"],
    pitch: "AI-native software for people and their agents, built and run at scale.",
    photo: `${person.photo}?w=336&h=336&fit=fill&f=face&fm=jpg&q=85`,
    stats: [
      { value: "4.7M+", label: "requests served" },
      { value: "8 yrs", label: "running in production" },
      { value: "5+ yrs", label: "shipping products" },
    ],
  });
}

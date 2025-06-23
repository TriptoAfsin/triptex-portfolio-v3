"use client";
import { BackgroundBeams } from "@/components/ui/background-beams";

export function HeroSection() {
  return (
    <div className="h-[40rem] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
          Hey, I&apos;m Afshin Nahian Tripto
        </h1>

        <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
          Software Engineer passionate about AI & Retrieval-Augmented Generation
          (RAG) applications. Proficient in TypeScript/JavaScript with strong
          foundation in front-end and back-end technologies ✨
        </p>
      </div>
      <BackgroundBeams />
    </div>
  );
}

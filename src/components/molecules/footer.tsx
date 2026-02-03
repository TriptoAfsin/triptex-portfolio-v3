import { personalInfo, socialLinks } from "@/data/portfolio";
import { Github, Linkedin, Mail } from "lucide-react";
import Image from "next/image";

const socialIcons: Record<string, typeof Github> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Email: Mail,
};

export function Footer() {
  return (
    <footer className="relative py-16 border-t border-border overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />

      {/* Subtle avatar image */}
      <div className="absolute bottom-0 right-0 md:right-16 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
        <Image
          src={personalInfo.avatar}
          alt=""
          width={300}
          height={300}
          className="grayscale"
        />
      </div>

      <div className="container mx-auto px-6 relative">
        <div className="flex flex-col items-center gap-8">
          {/* Logo and tagline */}
          <div className="flex flex-col items-center gap-4">
            <Image
              src="/favicon.png"
              alt="Logo"
              width={48}
              height={48}
              className="rounded-xl opacity-80"
            />
            <p className="text-sm text-muted-foreground text-center max-w-md text-pretty">
              Building intelligent web experiences with AI and modern technologies.
            </p>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => {
              const Icon = socialIcons[link.label];
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-muted/50 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label={link.label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground" suppressHydrationWarning>
            &copy; {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { personalInfo, socialLinks } from "@/data/portfolio";
import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail, Sparkles } from "lucide-react";

const socialIcons: Record<string, typeof Github> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Email: Mail,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const tagContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const tagVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4 },
  },
};

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-dvh flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Animated gradient orbs - reduced blur for mobile performance */}
      <div className="absolute inset-0 overflow-hidden contain-paint">
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-full blur-xl md:blur-2xl animate-float opacity-60 gpu-accelerate"
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-teal-500/15 to-cyan-500/15 rounded-full blur-xl md:blur-2xl animate-float opacity-50 gpu-accelerate hidden md:block"
          style={{ animationDelay: "-3s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-xl md:blur-2xl animate-float opacity-40 gpu-accelerate"
          style={{ animationDelay: "-1.5s" }}
        />
      </div>

      {/* Grid pattern overlay - hidden on mobile for performance */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] hidden md:block"
        style={{
          backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-8 border border-accent/20">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              Open to new opportunities
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1] text-balance"
          >
            Hi, I&apos;m{" "}
            <span className="gradient-text">{personalInfo.name.split(" ")[0]}</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-foreground/80 mb-4 font-medium text-pretty"
          >
            {personalInfo.tagline}
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed text-pretty"
          >
            {personalInfo.bio}
          </motion.p>

          <motion.div
            variants={tagContainerVariants}
            className="flex flex-wrap items-center justify-center gap-3 mb-12"
          >
            {["RAG Systems", "AI Agents", "Product Engineer", "Full-Stack"].map(
              (tag) => (
                <motion.span
                  key={tag}
                  variants={tagVariants}
                  className="px-4 py-2 text-sm bg-muted/80 rounded-full text-muted-foreground border border-border/50 hover:border-accent/30 hover:text-foreground transition-colors duration-200"
                >
                  {tag}
                </motion.span>
              )
            )}
          </motion.div>

          <motion.div
            variants={tagContainerVariants}
            className="flex items-center justify-center gap-4"
          >
            {socialLinks.map((link) => {
              const Icon = socialIcons[link.label];
              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={tagVariants}
                  className="group p-3.5 rounded-full bg-muted/80 border border-border/50 hover:border-accent/50 hover:bg-accent/10 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label={link.label}
                >
                  <Icon className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                </motion.a>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a
          href="#about"
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-accent transition-colors group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg"
        >
          <span className="text-xs uppercase tracking-widest">Explore</span>
          <ArrowDown className="w-4 h-4 animate-bounce group-hover:text-accent" aria-hidden="true" />
        </a>
      </motion.div>
    </section>
  );
}

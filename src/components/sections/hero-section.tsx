"use client";

import { personalInfo } from "@/data/portfolio";
import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail, Sparkles } from "lucide-react";

const socialLinks = [
  {
    icon: Github,
    href: personalInfo.social.github,
    label: "GitHub",
  },
  {
    icon: Linkedin,
    href: personalInfo.social.linkedin,
    label: "LinkedIn",
  },
  {
    icon: Mail,
    href: personalInfo.social.email,
    label: "Email",
  },
];

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Animated gradient orbs - Supabase-like green theme */}
      <div className="absolute inset-0 overflow-hidden contain-paint">
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-full blur-3xl animate-float opacity-60 gpu-accelerate"
          style={{ willChange: "transform" }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-teal-500/15 to-cyan-500/15 rounded-full blur-3xl animate-float opacity-50 gpu-accelerate"
          style={{ animationDelay: "-3s", willChange: "transform" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl animate-float opacity-40 gpu-accelerate"
          style={{ animationDelay: "-1.5s", willChange: "transform" }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-8 border border-accent/20">
              <Sparkles className="w-4 h-4" />
              Open to new opportunities
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]"
          >
            Hi, I&apos;m{" "}
            <span className="gradient-text">{personalInfo.name.split(" ")[0]}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl md:text-2xl text-foreground/80 mb-4 font-medium"
          >
            {personalInfo.tagline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {personalInfo.bio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center justify-center gap-3 mb-12"
          >
            {["RAG Systems", "AI Agents", "Product Engineer", "Full-Stack"].map(
              (tag, index) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="px-4 py-2 text-sm bg-muted/80 backdrop-blur-sm rounded-full text-muted-foreground border border-border/50 hover:border-accent/30 hover:text-foreground transition-all duration-300"
                >
                  {tag}
                </motion.span>
              )
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center gap-4"
          >
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                className="group p-3.5 rounded-full bg-muted/80 backdrop-blur-sm border border-border/50 hover:border-accent/50 hover:bg-accent/10 transition-all duration-300"
                aria-label={link.label}
              >
                <link.icon className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a
          href="#about"
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-accent transition-colors group"
        >
          <span className="text-xs uppercase tracking-widest">Explore</span>
          <ArrowDown className="w-4 h-4 animate-bounce group-hover:text-accent" />
        </a>
      </motion.div>
    </section>
  );
}

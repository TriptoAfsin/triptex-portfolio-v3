"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

interface SectionTitleProps {
  title: string;
  highlight: string;
  description?: string;
  className?: string;
}

export function SectionTitle({
  title,
  highlight,
  description,
  className,
}: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn("text-center mb-16", className)}
    >
      <h2 className="text-3xl md:text-5xl font-bold mb-6">
        {title} <span className="gradient-text">{highlight}</span>
      </h2>
      {description && (
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}

"use client";

import { cn } from "@/lib/utils/cn";
import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

interface BoxProps extends HTMLMotionProps<"div"> {
  as?: "div" | "section" | "article";
  children: React.ReactNode;
}

export const Box = forwardRef<HTMLDivElement, BoxProps>(
  ({ className, as = "div", children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn("relative", className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Box.displayName = "Box";

interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

export function Container({ className, children }: ContainerProps) {
  return (
    <div className={cn("container mx-auto px-6", className)}>{children}</div>
  );
}

interface SectionProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
}

export function Section({ id, className, children }: SectionProps) {
  return (
    <section id={id} className={cn("py-24 md:py-32 relative", className)}>
      {children}
    </section>
  );
}

"use client";

import { cn } from "@/lib/utils/cn";
import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

interface CardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "interactive" | "glass";
  children: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "bg-card border border-border",
      interactive:
        "bg-card border border-border hover:border-primary/30 transition-all duration-500",
      glass:
        "bg-card/80 backdrop-blur-lg border border-border hover:border-primary/30 transition-all duration-500",
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative p-6 rounded-2xl overflow-hidden",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export function CardHeader({ className, children }: CardHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between mb-4", className)}>
      {children}
    </div>
  );
}

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

export function CardContent({ className, children }: CardContentProps) {
  return <div className={cn("relative", className)}>{children}</div>;
}

interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

export function CardFooter({ className, children }: CardFooterProps) {
  return (
    <div className={cn("pt-4 border-t border-border/50", className)}>
      {children}
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils/cn";

interface TagProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "outline";
  size?: "sm" | "md";
  className?: string;
}

export function Tag({
  children,
  variant = "default",
  size = "sm",
  className,
}: TagProps) {
  const variants = {
    default: "bg-muted/80 text-muted-foreground border border-border/50",
    primary: "bg-primary/10 text-primary border border-primary/20",
    outline: "bg-transparent text-muted-foreground border border-border hover:border-primary/30",
  };

  const sizes = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-md transition-colors",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}

interface TagGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function TagGroup({ children, className }: TagGroupProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>{children}</div>
  );
}

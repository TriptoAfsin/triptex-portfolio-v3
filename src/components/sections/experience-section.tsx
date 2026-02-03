"use client";

import { experience, getYearsOfExperience } from "@/data/portfolio";
import { sectionContainerVariants } from "@/lib/animations";
import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
};

function CompanyLogo({ logo, fallback, company }: { logo?: string; fallback?: string; company: string }) {
  const [imgError, setImgError] = useState(false);

  if (!logo || imgError) {
    return (
      <div className="w-10 h-10 rounded-lg bg-primary/10 border border-border flex items-center justify-center">
        <span className="text-xs font-bold text-primary">{fallback || company.slice(0, 2).toUpperCase()}</span>
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-lg bg-muted/50 border border-border overflow-hidden flex items-center justify-center">
      <Image
        src={logo}
        alt={`${company} logo`}
        width={32}
        height={32}
        className="object-contain"
        onError={() => setImgError(true)}
      />
    </div>
  );
}

export function ExperienceSection() {
  const yearsOfExperience = useMemo(() => {
    const years = getYearsOfExperience();
    return Math.floor(years);
  }, []);

  return (
    <section id="experience" className="py-24 md:py-32 contain-content">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Work <span className="gradient-text">Experience</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-pretty">
            <span className="text-primary font-semibold tabular-nums">{yearsOfExperience}+ years</span> of professional experience building products and leading technical
            initiatives across various companies and personal projects.
          </p>
        </motion.div>

        <motion.div
          variants={{ ...sectionContainerVariants, visible: { ...sectionContainerVariants.visible, transition: { staggerChildren: 0.15 } } }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="max-w-3xl mx-auto"
        >
          {experience.map((exp) => (
            <motion.div
              key={`${exp.company}-${exp.role}`}
              variants={itemVariants}
              className="relative pl-8 pb-12 last:pb-0"
            >
              <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />

              <div className="absolute left-0 top-1 w-2 h-2 -translate-x-[3.5px] rounded-full bg-primary ring-4 ring-background" />

              <div className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <CompanyLogo logo={exp.logo} fallback={exp.logoFallback} company={exp.company} />
                    <div>
                      <h3 className="font-semibold">{exp.company}</h3>
                      <p className="text-sm text-muted-foreground">{exp.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{exp.period}</span>
                    {exp.current && (
                      <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 leading-relaxed text-pretty">
                  {exp.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs bg-muted rounded-md text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

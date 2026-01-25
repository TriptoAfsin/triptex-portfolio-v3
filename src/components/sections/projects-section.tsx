"use client";

import { projects } from "@/data/portfolio";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, Star } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function ProjectsSection() {
  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <section id="projects" className="py-24 md:py-32 relative contain-content">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-muted/30" />
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(var(--foreground) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            A selection of projects that showcase my expertise in AI, full-stack
            development, and open-source contributions.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {featuredProjects.map((project) => (
            <motion.div
              key={project.title}
              variants={itemVariants}
              className="group relative p-6 md:p-8 rounded-2xl bg-card border border-border hover:border-accent/30 transition-all duration-500 overflow-hidden"
            >
              {/* Gradient hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  {project.stars && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground ml-4 bg-muted/80 px-2.5 py-1 rounded-full">
                      <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                      <span>{project.stars}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs font-medium bg-muted/80 rounded-md text-muted-foreground border border-border/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors group/link"
                    >
                      <Github className="w-4 h-4" />
                      <span>Source</span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
                    </a>
                  )}
                  {project.npm && (
                    <a
                      href={project.npm}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors group/link"
                    >
                      <span className="w-4 h-4 flex items-center justify-center text-xs font-bold">npm</span>
                      <span>Package</span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 text-center"
        >
          <a
            href="https://github.com/TriptoAfsin?tab=repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border hover:border-accent/50 rounded-full text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 group"
          >
            <Github className="w-4 h-4" />
            <span>View all projects on GitHub</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

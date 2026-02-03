"use client";

import { skills } from "@/data/portfolio";
import { sectionContainerVariants, sectionItemVariants } from "@/lib/animations";
import { motion } from "framer-motion";
import { Brain, Code2, Database, FileCode, Rocket, Server, Wrench } from "lucide-react";

const skillCategories = [
  {
    title: "Languages",
    icon: FileCode,
    skills: skills.languages,
    gradient: "from-primary to-emerald-400",
  },
  {
    title: "AI & Machine Learning",
    icon: Brain,
    skills: skills.ai,
    gradient: "from-emerald-500 to-green-400",
  },
  {
    title: "Frontend",
    icon: Code2,
    skills: skills.frontend,
    gradient: "from-teal-500 to-cyan-400",
  },
  {
    title: "Backend",
    icon: Server,
    skills: skills.backend,
    gradient: "from-green-500 to-emerald-400",
  },
  {
    title: "Databases",
    icon: Database,
    skills: skills.databases,
    gradient: "from-cyan-500 to-teal-400",
  },
  {
    title: "Tools & DevOps",
    icon: Wrench,
    skills: skills.tools,
    gradient: "from-emerald-400 to-green-500",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 md:py-32 relative contain-content">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed text-pretty">
            I&apos;m a Software Engineer with a passion for building intelligent
            systems. My expertise lies in AI/RAG applications and full-stack
            development, bridging the gap between cutting-edge AI and practical
            web solutions.
          </p>
        </motion.div>

        <motion.div
          variants={sectionContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skillCategories.map((category) => (
            <motion.div
              key={category.title}
              variants={sectionItemVariants}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-accent/30 transition-colors duration-300 overflow-hidden"
            >
              {/* Gradient hover effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

              <div className="relative">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${category.gradient} mb-4`}>
                  <category.icon className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold mb-4 group-hover:text-accent transition-colors">
                  {category.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 text-sm bg-muted/80 rounded-lg text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border/50"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Highlight boxes */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-8 rounded-3xl bg-gradient-to-br from-primary/5 via-emerald-500/5 to-teal-500/5 border border-primary/10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

            <div className="flex flex-col items-center md:items-start gap-4 relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center shadow-lg shadow-primary/20">
                <Brain className="w-8 h-8 text-white" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold mb-2 text-center md:text-left text-balance">
                  Specialized in AI & RAG Systems
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed text-center md:text-left text-pretty">
                  Building intelligent applications using RAG, AI agents, and modern LLM integrations. From vector databases to prompt engineering.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-8 rounded-3xl bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-yellow-500/5 border border-amber-500/10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

            <div className="flex flex-col items-center md:items-start gap-4 relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Rocket className="w-8 h-8 text-white" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold mb-2 text-center md:text-left text-balance">
                  Product-Minded Engineer
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed text-center md:text-left text-pretty">
                  Growth mindset with strong communication and business acumen. I take ownership of products and bridge the gap between technical and business needs.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

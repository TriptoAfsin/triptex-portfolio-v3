"use client";

import { skills } from "@/data/portfolio";
import { motion } from "framer-motion";
import { Brain, Code2, Database, Server, Wrench } from "lucide-react";

const skillCategories = [
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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

export function AboutSection() {
  return (
    <section id="about" className="py-24 md:py-32 relative">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            I&apos;m a Software Engineer with a passion for building intelligent
            systems. My expertise lies in AI/RAG applications and full-stack
            development, bridging the gap between cutting-edge AI and practical
            web solutions.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skillCategories.map((category) => (
            <motion.div
              key={category.title}
              variants={itemVariants}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-accent/30 transition-all duration-500 overflow-hidden"
            >
              {/* Gradient hover effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

              <div className="relative">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${category.gradient} mb-4`}>
                  <category.icon className="w-6 h-6 text-white" />
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 p-8 md:p-10 rounded-3xl bg-gradient-to-br from-primary/5 via-emerald-500/5 to-teal-500/5 border border-primary/10 relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center shadow-lg shadow-primary/20">
                <Brain className="w-12 h-12 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-center md:text-left">
                Specialized in AI & RAG Systems
              </h3>
              <p className="text-muted-foreground leading-relaxed text-center md:text-left">
                I focus on building intelligent applications using Retrieval-Augmented
                Generation (RAG), AI agents, and modern LLM integrations. From vector
                databases to prompt engineering, I help bring AI capabilities to
                production-ready web applications.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

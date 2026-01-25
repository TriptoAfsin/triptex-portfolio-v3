"use client";

import { certifications } from "@/data/portfolio";
import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";
import { SectionTitle } from "@/components/ui";

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
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function CertificationsSection() {
  return (
    <section id="certifications" className="py-24 md:py-32 bg-muted/30 relative contain-content">
      <div className="container mx-auto px-6">
        <SectionTitle
          title="Certifications &"
          highlight="Credentials"
          description="Professional certifications that validate my expertise in AI, software engineering, and emerging technologies."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {certifications.map((cert) => (
            <motion.div
              key={cert.title}
              variants={itemVariants}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-500"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 rounded-xl bg-primary/10 shrink-0">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm leading-tight mb-1 group-hover:text-primary transition-colors">
                    {cert.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{cert.date}</span>
                <div className="flex flex-wrap gap-1.5">
                  {cert.skills.slice(0, 2).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 text-xs bg-muted/80 rounded-md text-muted-foreground"
                    >
                      {skill}
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

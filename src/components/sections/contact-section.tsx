"use client";

import { personalInfo } from "@/data/portfolio";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import Image from "next/image";

const contactLinks = [
  {
    icon: Mail,
    label: "Email",
    value: personalInfo.email,
    href: personalInfo.social.email,
  },
  {
    icon: Github,
    label: "GitHub",
    value: "TriptoAfsin",
    href: personalInfo.social.github,
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "triptoafsin",
    href: personalInfo.social.linkedin,
  },
  {
    icon: MapPin,
    label: "Location",
    value: personalInfo.location,
    href: null,
  },
];

export function ContactSection() {
  return (
    <section id="contact" className="py-24 md:py-32 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get in <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            I&apos;m always open to discussing new opportunities, interesting
            projects, or just having a chat about AI and technology.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-12 max-w-5xl mx-auto">
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative flex-shrink-0"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border-2 border-border  shadow-primary/10">
              <Image
                src={personalInfo.profileImage}
                alt={personalInfo.name}
                fill
                className="object-cover"
                unoptimized
              />
              {/* Gradient overlay */}
              {/* <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" /> */}
            </div>
            {/* Decorative elements */}
            {/* <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" /> */}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1 w-full"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactLinks.map((link) => (
                <div
                  key={link.label}
                  className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <link.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{link.label}</p>
                      {link.href ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {link.value}
                        </a>
                      ) : (
                        <p className="font-medium">{link.value}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 text-center sm:text-left"
            >
              <a
                href={personalInfo.social.email}
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                <Mail className="w-5 h-5" />
                Send me an email
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

import React from "react";
import { motion } from "framer-motion";
import { Terminal, Github, Linkedin, Mail, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { resumeData } from "@/data/resume";

export default function Footer() {
  return (
    <footer className="relative border-t border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Terminal className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-sm text-foreground">
              daniel<span className="text-primary">.dev</span>
            </span>
          </Link>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-muted-foreground flex items-center gap-1"
          >
            Built with <Heart className="w-3 h-3 text-primary" /> by Daniel
          </motion.p>

          <div className="flex items-center gap-3">
            <a href={resumeData.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="p-2 rounded-lg text-muted-foreground hover:text-primary transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href={resumeData.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-2 rounded-lg text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href={resumeData.socials.email} aria-label="Email" className="p-2 rounded-lg text-muted-foreground hover:text-primary transition-colors">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
import React from "react";
import { motion } from "framer-motion";
import { Building2, MapPin, Calendar } from "lucide-react";
import { experienceData } from "@/data/resume";
import SectionHeader from "@/components/portfolio/SectionHeader";

export default function ExperienceSection() {
  return (
    <section id="experience" className="relative py-32 overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/5 dark:bg-primary/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <SectionHeader
          label="Experience"
          title="Career Timeline"
          description="A decade of building impactful software across industries."
        />

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-secondary/30 to-transparent" />

          {experienceData.map((exp, i) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className={`relative flex flex-col md:flex-row gap-8 mb-16 last:mb-0 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Dot */}
              <div className="absolute left-6 md:left-1/2 top-6 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-primary z-10 ring-4 ring-background" />

              <div className={`flex-1 ml-14 md:ml-0 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                <div className={`glass rounded-xl p-6 border border-border hover:border-primary/20 transition-all duration-500 ${i % 2 === 0 ? "md:ml-auto md:mr-8" : "md:ml-8"}`}>
                  {/* Impact badge */}
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 ${i % 2 === 0 ? "md:float-right md:ml-3" : ""}`}>
                    {exp.impact}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Calendar className="w-3.5 h-3.5" />
                    {exp.duration}
                  </div>

                  <h3 className="font-heading font-bold text-lg md:text-xl text-foreground mb-1 tracking-tight">
                    {exp.position}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-secondary mb-1">
                    <Building2 className="w-3.5 h-3.5" />
                    {exp.company}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <MapPin className="w-3 h-3" />
                    {exp.location}
                  </div>

                  <ul className={`space-y-2 mb-4 ${i % 2 === 0 ? "md:text-left" : ""}`}>
                    {exp.responsibilities.slice(0, 3).map((r, j) => (
                      <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-primary/50 mt-2 shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>

                  <div className={`flex flex-wrap gap-1.5 ${i % 2 === 0 ? "md:justify-start" : ""}`}>
                    {exp.stack.map((tech) => (
                      <span key={tech} className="px-2 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground border border-border">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="hidden md:block flex-1" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
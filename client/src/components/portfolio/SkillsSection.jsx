import React, { useState } from "react";
import { motion } from "framer-motion";
import { Monitor, Server, Brain, Cloud, Database, ShoppingCart, Link, CheckCircle, Search } from "lucide-react";
import { skillsData } from "@/data/resume";
import SectionHeader from "@/components/portfolio/SectionHeader";

const iconMap = { Monitor, Server, Brain, Cloud, Database, ShoppingCart, Link, CheckCircle };

function SkillBar({ name, level, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-foreground font-medium">{name}</span>
        <span className="text-xs text-muted-foreground font-mono">{level}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: delay + 0.2, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary relative"
          style={{ boxShadow: hovered ? "0 0 10px hsl(var(--primary) / 0.5)" : "none" }}
        />
      </div>
    </motion.div>
  );
}

export default function SkillsSection() {
  const [search, setSearch] = useState("");

  const filtered = skillsData.map((cat) => ({
    ...cat,
    skills: cat.skills.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.skills.length > 0);

  return (
    <section id="skills" className="relative py-32 overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/5 dark:bg-secondary/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <SectionHeader
          label="Skills"
          title="Technical Arsenal"
          description="Proficient across the entire stack — from pixel-perfect frontends to AI-powered backends."
        />

        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-all"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((category, catIndex) => {
            const Icon = iconMap[category.icon] || Monitor;
            return (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: catIndex * 0.08 }}
                className="glass rounded-xl p-6 border border-border hover:border-primary/20 transition-all duration-500 group hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground tracking-tight">{category.category}</h3>
                </div>
                <div className="space-y-4">
                  {category.skills.map((skill, j) => (
                    <SkillBar key={skill.name} name={skill.name} level={skill.level} delay={j * 0.05} />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">No skills found matching "{search}".</p>
        )}
      </div>
    </section>
  );
}
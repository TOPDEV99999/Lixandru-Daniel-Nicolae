const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { projectsData } from "@/data/resume";
import SectionHeader from "@/components/portfolio/SectionHeader";
import TiltCard from "@/components/portfolio/TiltCard";

const categories = ["All", "AI", "Web", "Shopify", "Blockchain", "Computer Vision"];

const projectImages = {
  dermaiq: "https://picsum.photos/id/1/800/450",
  faceswap: "https://picsum.photos/id/20/800/450",
  "mern-ecommerce": "https://picsum.photos/id/48/800/450",
  "dating-platform": "https://picsum.photos/id/60/800/450",
  "fashion-ecommerce": "https://picsum.photos/id/96/800/450",
  blinkify: "https://picsum.photos/id/119/800/450",
  "chatbot-health": "https://picsum.photos/id/180/800/450",
};

export default function ProjectsSection() {
  const [active, setActive] = useState("All");
  const [expandedId, setExpandedId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);

  const filtered = active === "All"
    ? projectsData
    : projectsData.filter((p) => p.category.includes(active));

  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  const handleCategoryChange = (cat) => {
    setActive(cat);
    setVisibleCount(6);
    setExpandedId(null);
  };

  return (
    <section id="projects" className="relative py-32 overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 dark:bg-primary/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <SectionHeader
          label="Projects"
          title="Featured Work"
          description="A selection of projects that showcase engineering depth and business impact."
        />

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                active === cat
                  ? "bg-foreground text-background"
                  : "bg-card text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project count */}
        <div className="text-center mb-8">
          <span className="text-xs text-muted-foreground font-mono">
            Showing {visible.length} of {filtered.length} projects
          </span>
        </div>

        {/* Project cards - alternating layout */}
        <div className="space-y-12">
          <AnimatePresence mode="popLayout">
            {visible.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <TiltCard
                  intensity={3}
                  className={`flex flex-col md:flex-row gap-8 items-center glass rounded-2xl p-6 md:p-8 border border-border hover:border-primary/20 transition-colors duration-500 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
                >
                  {/* Image with zoom effect */}
                  <div className="relative w-full md:w-1/2 overflow-hidden rounded-xl border border-border group/img">
                    <img
                      src={projectImages[project.id]}
                      alt={`${project.title} — ${project.subtitle}`}
                      loading="lazy"
                      className="w-full h-72 object-cover transition-transform duration-700 group-hover/img:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent pointer-events-none" />
                    <div className="absolute top-3 right-3 flex gap-1.5 flex-wrap justify-end">
                      {project.category.map((c) => (
                        <span key={c} className="px-2 py-0.5 rounded text-[10px] font-mono bg-background/80 text-primary border border-primary/20 backdrop-blur-sm">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full md:w-1/2" style={{ transform: "translateZ(40px)" }}>
                    <div className="text-xs text-muted-foreground font-mono mb-2">{project.duration}</div>
                    <h3 className="font-heading font-bold text-xl md:text-2xl text-foreground mb-2 tracking-tight">
                      {project.title}
                    </h3>
                    <p className="text-sm text-secondary mb-4 font-medium">{project.subtitle}</p>
                    <p className="text-sm text-foreground/90 leading-relaxed mb-4">
                      {project.overview}
                    </p>

                    <AnimatePresence>
                      {expandedId === project.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-border pt-4 mb-4">
                            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Problem</h4>
                            <p className="text-sm text-foreground/90 mb-3 leading-relaxed">{project.problem}</p>
                            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Solution</h4>
                            <p className="text-sm text-foreground/90 leading-relaxed">{project.solution}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.stack.map((tech) => (
                        <span key={tech} className="px-2 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Project Links */}
                    <div className="flex gap-3 mb-4">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary font-medium px-3 py-1.5 rounded-lg bg-muted hover:bg-primary/10 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                          </svg>
                          GitHub
                        </a>
                      )}
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary font-medium px-3 py-1.5 rounded-lg bg-muted hover:bg-primary/10 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Live Demo
                        </a>
                      )}
                    </div>

                    <button
                      onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
                      className="flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
                    >
                      {expandedId === project.id ? "Show Less" : "View Details"}
                      <ChevronDown className={`w-4 h-4 transition-transform ${expandedId === project.id ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="flex justify-center mt-16">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-all duration-300"
            >
              Load More Projects
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
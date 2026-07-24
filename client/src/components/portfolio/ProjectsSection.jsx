const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { projectsData } from "@/data/resume";
import SectionHeader from "@/components/portfolio/SectionHeader";
import TiltCard from "@/components/portfolio/TiltCard";

const categories = ["All", "AI", "Web", "Shopify", "Blockchain", "WordPress", "Design", "Computer Vision"];

const projectImages = {
  dermaiq: "https://media.db.com/images/public/6a529188c8101e17e93a67f6/745bc41d2_generated_image.png",
  faceswap: "https://media.db.com/images/public/6a529188c8101e17e93a67f6/cc09964f1_generated_image.png",
  "mern-ecommerce": "https://media.db.com/images/public/6a529188c8101e17e93a67f6/bc162286e_generated_image.png",
  "dating-platform": "https://media.db.com/images/public/6a529188c8101e17e93a67f6/bfb80df8c_generated_image.png",
  "fashion-ecommerce": "https://media.db.com/images/public/6a529188c8101e17e93a67f6/d9ee1c97b_generated_image.png",
  blinkify: "https://media.db.com/images/public/6a529188c8101e17e93a67f6/0076f58b6_generated_image.png",
  cryptocheckmate: "https://media.db.com/images/public/6a529188c8101e17e93a67f6/b222b3509_generated_image.png",
  "ai-nft": "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?auto=format&fit=crop&w=800&q=80",
  kogaea: "https://images.unsplash.com/photo-1614850523060-8da1d56ae167?auto=format&fit=crop&w=800&q=80",
  topps: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
  "custom-built": "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80",
  sema: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
  buzznerd: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80",
  neurogym: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
  "chatbot-health": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
  bandieredelmondo: "https://media.db.com/images/public/6a529188c8101e17e93a67f6/b7ca04bd8_generated_image.png",
  "ayana-bali": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
  "metaverse-expo": "https://media.db.com/images/public/6a529188c8101e17e93a67f6/dd76fd6ab_generated_image.png",
  "kaho-enterprise": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
  "brazilian-style": "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
  "club-ange": "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80",
  "booty-fitness": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
  "ai-crm": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
  "joie-tv-tabi": "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
  "fanfan-online": "https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=800&q=80",
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
                      className="w-full h-64 object-cover transition-transform duration-700 group-hover/img:scale-110"
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
                    <h3 className="font-heading font-bold text-xl md:text-2xl text-foreground mb-1 tracking-tight">
                      {project.title}
                    </h3>
                    <p className="text-sm text-secondary mb-4">{project.subtitle}</p>
                    <p className="text-sm text-muted-foreground leading-[1.7] mb-4 font-medium">
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
                            <p className="text-sm text-muted-foreground mb-3">{project.problem}</p>
                            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Solution</h4>
                            <p className="text-sm text-muted-foreground">{project.solution}</p>
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
import React from "react";
import { motion } from "framer-motion";
import { Brain, Cpu, Eye, Bot, Sparkles, Workflow, Image } from "lucide-react";
import SectionHeader from "@/components/portfolio/SectionHeader";

const aiCapabilities = [
  { icon: Brain, title: "Large Language Models", desc: "Building intelligent applications with OpenAI GPT, Google Gemini, and Claude for natural language understanding and generation.", color: "from-primary/20 to-primary/5" },
  { icon: Bot, title: "AI Agents & Automation", desc: "Developing autonomous agents that handle complex workflows — from data processing to decision-making pipelines.", color: "from-secondary/20 to-secondary/5" },
  { icon: Eye, title: "Computer Vision", desc: "Real-world applications with YOLO, TensorFlow, and OpenCV — from skin disease detection to facial recognition systems.", color: "from-blue-500/20 to-blue-500/5" },
  { icon: Sparkles, title: "Prompt Engineering", desc: "Crafting precise, context-aware prompts that maximize AI output quality for production applications.", color: "from-amber-500/20 to-amber-500/5" },
  { icon: Workflow, title: "RAG Systems", desc: "Building Retrieval-Augmented Generation pipelines that ground AI responses in domain-specific knowledge bases.", color: "from-green-500/20 to-green-500/5" },
  { icon: Image, title: "Image AI", desc: "Processing, analysis, and generation of images using state-of-the-art machine learning models and pipelines.", color: "from-pink-500/20 to-pink-500/5" },
];

export default function AISection() {
  return (
    <section id="ai" className="relative py-32 overflow-hidden">
      <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-secondary/5 dark:bg-secondary/3 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-primary/5 dark:bg-primary/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <SectionHeader
          label="Artificial Intelligence"
          title="Building with AI"
          description="Practical applications of artificial intelligence — not buzzwords, but production systems that solve real problems."
        />

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-heading font-bold text-xl md:text-2xl text-foreground mb-4 tracking-tight">
              From Research to Production
            </h3>
            <p className="text-muted-foreground text-base md:text-lg leading-[1.75] mb-6 font-medium">
              I bridge the gap between AI research and real-world applications. From healthcare diagnostics with computer vision to conversational AI agents that understand context — my work focuses on building AI systems that deliver measurable business value.
            </p>
            <p className="text-muted-foreground text-base leading-[1.75] font-medium">
              My toolkit spans the full AI landscape: OpenAI and Gemini for language understanding, TensorFlow and OpenCV for computer vision, and custom RAG pipelines for domain-specific intelligence. Every solution is built for production — fast, reliable, and scalable.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-2xl blur-2xl" />
            <div className="relative glass rounded-2xl p-8 border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-foreground">Nova AI Assistant</h4>
                  <p className="text-xs text-muted-foreground">Powered by this portfolio</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span className="text-sm text-muted-foreground">Natural language Q&amp;A about my experience &amp; projects</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                  <span className="text-sm text-muted-foreground">Smart actions — download resume, navigate sections</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span className="text-sm text-muted-foreground">Contextual answers powered by my resume data</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiCapabilities.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass rounded-xl p-6 border border-border hover:border-secondary/30 transition-all duration-500 group hover:-translate-y-1"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <item.icon className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-2 tracking-tight">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionHeader from "@/components/portfolio/SectionHeader";
import { Code2, Cpu, Layers, Users } from "lucide-react";

const highlights = [
  { icon: Code2, title: "Engineering Passion", desc: "8+ years of crafting clean, scalable architectures that solve real business problems — from startups to enterprise." },
  { icon: Cpu, title: "AI Development", desc: "Building intelligent systems with OpenAI, TensorFlow, and OpenCV — from skin disease detection to real-time face recognition." },
  { icon: Layers, title: "Full-Stack Mastery", desc: "End-to-end development across React, Node.js, Python, TypeScript, and cloud infrastructure with a focus on performance." },
  { icon: Users, title: "Business Impact", desc: "Delivering measurable results — 40% performance gains, 35% conversion increases, and 25+ successful product launches." },
];

const stats = [
  { value: 8, suffix: "+", label: "Years Experience" },
  { value: 25, suffix: "+", label: "Projects Delivered" },
  { value: 40, suffix: "%", label: "Avg Performance Gain" },
  { value: 3, suffix: "", label: "Industries Served" },
];

function AnimatedStat({ value, suffix, label, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="font-heading font-extrabold text-3xl md:text-4xl text-gradient tracking-tight">
        {inView ? value : 0}{suffix}
      </div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </motion.div>
  );
}

export default function AboutSection() {
  return (
    <section id="about" className="relative py-32 overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 dark:bg-secondary/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <SectionHeader
          label="About"
          title="The Engineer Behind the Code"
          description="I don't just write software — I architect solutions that drive business growth."
        />

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-muted-foreground text-base md:text-lg leading-[1.75] mb-6 font-medium">
              With over eight years of experience, I've built everything from AI-powered healthcare platforms to blockchain dashboards. My approach combines deep technical expertise with a relentless focus on business outcomes.
            </p>
            <p className="text-muted-foreground text-base md:text-lg leading-[1.75] mb-6 font-medium">
              I specialize in bridging the gap between cutting-edge AI research and production-ready software. Whether it's integrating GPT models into enterprise workflows, building computer vision pipelines, or architecting scalable microservices — I deliver systems that are fast, secure, and maintainable.
            </p>
            <p className="text-muted-foreground text-base md:text-lg leading-[1.75] font-medium">
              I believe in continuous learning, clean code, and the power of collaboration. Every project is an opportunity to push boundaries and create something that genuinely moves the needle.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="glass rounded-2xl p-8 border border-border">
              <div className="grid grid-cols-2 gap-8">
                {stats.map((stat, i) => (
                  <AnimatedStat key={stat.label} {...stat} delay={i * 0.1} />
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-medium text-foreground">Currently Available</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Open to full-time roles and freelance opportunities in AI engineering and full-stack development.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group glass rounded-xl p-6 border border-border hover:border-primary/30 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <item.icon className="w-5 h-5 text-primary" />
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
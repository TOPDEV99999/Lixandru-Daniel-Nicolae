import React from "react";
import { motion } from "framer-motion";

export default function SectionHeader({ label, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="text-center mb-16"
    >
      {label && (
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium tracking-wider uppercase mb-4">
          {label}
        </span>
      )}
      <h2 className="font-heading font-bold text-[28px] md:text-4xl lg:text-5xl tracking-tighter mb-4 text-foreground leading-[1.1]">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-[1.7] font-medium">
          {description}
        </p>
      )}
    </motion.div>
  );
}
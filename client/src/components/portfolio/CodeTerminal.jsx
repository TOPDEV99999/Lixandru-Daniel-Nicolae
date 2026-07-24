import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const codeLines = [
  { text: "const ai = new AIAgent({", color: "text-violet-600 dark:text-violet-400" },
  { text: '  model: "gpt-4-turbo",', color: "text-cyan-600 dark:text-cyan-400" },
  { text: "  context: portfolio.load(),", color: "text-cyan-600 dark:text-cyan-400" },
  { text: "  streaming: true,", color: "text-cyan-600 dark:text-cyan-400" },
  { text: "});", color: "text-violet-600 dark:text-violet-400" },
  { text: "", color: "" },
  { text: "await ai.analyze({", color: "text-green-600 dark:text-green-400" },
  { text: '  task: "Build intelligent systems",', color: "text-amber-600 dark:text-amber-300" },
  { text: '  stack: ["React", "Node", "Python"],', color: "text-amber-600 dark:text-amber-300" },
  { text: '  status: "Executing..." ✓', color: "text-cyan-600 dark:text-cyan-400" },
  { text: "});", color: "text-green-600 dark:text-green-400" },
];

export default function CodeTerminal() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= codeLines.length) {
          setTimeout(() => setVisibleLines(0), 2000);
          return prev;
        }
        return prev + 1;
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="glass rounded-xl overflow-hidden max-w-md w-full border border-border"
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <div className="w-3 h-3 rounded-full bg-red-500/70" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <div className="w-3 h-3 rounded-full bg-green-500/70" />
        <span className="ml-2 text-xs text-muted-foreground font-mono">
          agent.ts
        </span>
      </div>
      <div className="p-4 font-mono text-sm leading-relaxed min-h-[260px]">
        {codeLines.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`${line.color} ${!line.text ? "h-4" : ""}`}
          >
            {line.text}
          </motion.div>
        ))}
        {visibleLines < codeLines.length && (
          <span className="inline-block w-2 h-4 bg-primary animate-pulse" />
        )}
      </div>
    </motion.div>
  );
}
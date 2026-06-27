"use client";

import { motion } from "framer-motion";

interface SectionTitleProps {
  subtitle: string;
  title: string;
  coloredWord?: string;
  coloredWordColor?: string; // e.g. text-[#69C4B5] or text-[#E98BAE]
  description?: string;
  align?: "left" | "center";
}

export default function SectionTitle({
  subtitle,
  title,
  coloredWord,
  coloredWordColor = "text-[#69C4B5]",
  description,
  align = "left"
}: SectionTitleProps) {
  // Find where coloredWord is in the title, and highlight it
  const parts = coloredWord ? title.split(coloredWord) : [title];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`space-y-3 ${align === "center" ? "text-center max-w-xl mx-auto" : "text-left"}`}
    >
      <span className="text-[10px] font-black uppercase tracking-widest text-[#8E7BBE] block">
        {subtitle}
      </span>
      <h2 className="text-3xl md:text-4xl font-bold text-[#4A4A4A] leading-tight">
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < parts.length - 1 && (
              <span className={`font-cursive ${coloredWordColor} text-[1.2em] px-1.5`}>
                {coloredWord}
              </span>
            )}
          </span>
        ))}
      </h2>
      {description && (
        <p className="text-[#4A4A4A]/80 text-xs md:text-sm leading-relaxed font-semibold">
          {description}
        </p>
      )}
    </motion.div>
  );
}

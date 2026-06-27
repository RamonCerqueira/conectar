"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface GradientButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "text" | "purple";
  className?: string;
  type?: "button" | "submit";
}

export default function GradientButton({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button"
}: GradientButtonProps) {
  let styleClasses = "";

  if (variant === "primary") {
    // Green button
    styleClasses = "bg-[#69C4B5] hover:bg-[#58b3a4] text-white shadow-md shadow-[#69C4B5]/10";
  } else if (variant === "secondary") {
    // Pink button
    styleClasses = "bg-[#E98BAE] hover:bg-[#d6799c] text-white shadow-md shadow-[#E98BAE]/10";
  } else if (variant === "purple") {
    // Purple button
    styleClasses = "bg-[#8E7BBE] hover:bg-[#7e6bb0] text-white shadow-md shadow-[#8E7BBE]/10";
  } else if (variant === "outline") {
    // Transparent outline white button
    styleClasses = "border-2 border-white bg-transparent text-white hover:bg-white/5";
  } else if (variant === "text") {
    styleClasses = "text-[#8E7BBE] hover:text-[#7e6bb0] bg-transparent p-0";
  }

  return (
    <motion.button
      type={type}
      whileHover={{ scale: variant !== "text" ? 1.02 : 1 }}
      whileTap={{ scale: variant !== "text" ? 0.98 : 1 }}
      onClick={onClick}
      className={`px-7 py-3 rounded-full font-bold text-xs uppercase tracking-wider transition-all border-0 cursor-pointer ${styleClasses} ${className}`}
    >
      {children}
    </motion.button>
  );
}

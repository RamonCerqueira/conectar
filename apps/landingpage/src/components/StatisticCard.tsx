"use client";

import { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatisticCardProps {
  value: string;
  label: string;
  icon: LucideIcon;
  color: string;
}

export default function StatisticCard({ value, label, icon: Icon, color }: StatisticCardProps) {
  const numericPart = parseInt(value.replace(/[^0-9]/g, "")) || 0;
  const nonNumericPrefix = value.match(/^[^+0-9]+/)?.[0] || "";
  const nonNumericSuffix = value.match(/[^+0-9]+$/)?.[0] || "";
  const hasPlus = value.includes("+");

  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = numericPart;
    const duration = 2; // seconds
    const stepTime = Math.max(Math.floor(120 / end), 1);
    const increment = Math.max(Math.floor(end / 60), 1);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [numericPart]);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="p-4 bg-white border border-[#E7E7E7] rounded-3xl text-center space-y-3 shadow-xs hover:shadow-md transition-all select-none"
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="space-y-0.5">
        <p className="text-xl font-black text-[#4A4A4A]">
          {hasPlus && "+"}
          {count}
          {nonNumericSuffix}
        </p>
        <p className="text-zinc-400 font-extrabold text-[9px] leading-tight">{label}</p>
      </div>
    </motion.div>
  );
}

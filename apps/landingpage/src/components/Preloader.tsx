"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Keep loader visible for 1.8 seconds, then fade out
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            y: "-100%",
            transition: { duration: 0.6, ease: [0.77, 0, 0.175, 1] } 
          }}
          className="fixed inset-0 z-100 bg-white flex flex-col items-center justify-center pointer-events-auto"
        >
          <div className="space-y-6 flex flex-col items-center text-xs">
            {/* Animated Logo SVG Path */}
            <svg 
              width="80" 
              height="80" 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#8E7BBE]"
            >
              {/* Path representing clean connected child mind / neural connection nodes */}
              <motion.path
                d="M50 20 C65 20, 80 35, 80 50 C80 65, 65 80, 50 80 C35 80, 20 65, 20 50 C20 35, 35 20, 50 20 Z"
                stroke="url(#grad)"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              />
              <motion.path
                d="M35 50 Q50 35 65 50 Q50 65 35 50 Z"
                stroke="url(#grad)"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 0.3, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8E7BBE" />
                  <stop offset="50%" stopColor="#E98BAE" />
                  <stop offset="100%" stopColor="#69C4B5" />
                </linearGradient>
              </defs>
            </svg>

            {/* Brand title fading up */}
            <div className="text-center space-y-1">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-[9px] uppercase tracking-widest text-[#8E7BBE] font-black block"
              >
                Instituto
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="text-lg font-black tracking-tight text-[#4A4A4A] uppercase"
              >
                Conectar
              </motion.h1>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

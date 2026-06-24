"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: () => void;
  hover?: boolean;
}

export default function GlassCard({ children, className = "", glow = false, onClick, hover = false }: GlassCardProps) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { scale: 1.02 } : undefined}
      whileTap={hover ? { scale: 0.98 } : undefined}
      className={`
        relative overflow-hidden rounded-2xl border border-white/10
        bg-gradient-to-br from-white/10 to-white/5
        backdrop-blur-xl shadow-xl
        ${glow ? "shadow-primary-500/20 ring-1 ring-primary-500/30" : ""}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
}

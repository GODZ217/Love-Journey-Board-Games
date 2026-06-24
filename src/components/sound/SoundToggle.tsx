"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";

export default function SoundToggle() {
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const toggleSound = useGameStore((s) => s.toggleSound);

  return (
    <motion.button
      onClick={toggleSound}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
    >
      <span className="text-lg">
        {soundEnabled ? "🔊" : "🔇"}
      </span>
    </motion.button>
  );
}

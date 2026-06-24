"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Particles from "@/components/ui/Particles";
import SoundToggle from "@/components/sound/SoundToggle";
import { useGameStore } from "@/store/gameStore";

export default function HomePage() {
  const router = useRouter();
  const resetGame = useGameStore((s) => s.resetGame);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStart = () => {
    resetGame();
    router.push("/play/room");
  };

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-[#0f0a1a] via-[#1a0a2e] to-[#0a1628] overflow-hidden">
      <Particles />
      <SoundToggle />

      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-500/20 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[150px]" />

      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen p-6">
        {/* Logo / Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="text-5xl sm:text-7xl mb-4"
          >
            💕
          </motion.div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-3">
            <span className="text-gradient">Love Journey</span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg sm:text-xl text-white/60 font-light"
          >
            Couple Board Game
          </motion.p>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-12 max-w-sm"
        >
          <p className="text-white/40 text-sm sm:text-base leading-relaxed">
            A romantic journey of questions, laughter, and deeper connection.
            Roll the dice and discover more about each other.
          </p>
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col items-center gap-4"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={handleStart}
            icon="🎮"
            className="text-lg px-10 py-5 rounded-2xl"
          >
            Start Game
          </Button>

          <motion.p
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-white/30 text-xs"
          >
            2 Players Required
          </motion.p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-sm"
        >
          {[
            { icon: "🎲", label: "Board Game" },
            { icon: "💬", label: "400+ Questions" },
            { icon: "💝", label: "Relationship" },
          ].map((feat, i) => (
            <div key={i} className="text-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-2xl sm:text-3xl mb-1"
              >
                {feat.icon}
              </motion.div>
              <p className="text-white/40 text-[10px] sm:text-xs font-medium">{feat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-6 text-white/20 text-xs"
        >
          Made with 💜 for every couple
        </motion.p>
      </div>
    </main>
  );
}

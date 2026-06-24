"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Particles from "@/components/ui/Particles";
import SoundToggle from "@/components/sound/SoundToggle";
import { useGameStore } from "@/store/gameStore";
import { achievements } from "@/data/achievements";
import { CoupleReport } from "@/types";

const categoryLabels: Record<string, string> = {
  funny: "Funny",
  deep: "Deep Talk",
  memory: "Memory",
  challenge: "Challenge",
  intimacy: "Intimacy",
  knowing: "Knowing Each Other",
};

const categoryIcons: Record<string, string> = {
  funny: "😂",
  deep: "💭",
  memory: "📸",
  challenge: "🎯",
  intimacy: "🔥",
  knowing: "💡",
};

function MeterBar({ label, icon, value, color }: { label: string; icon: string; value: number; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-white/70 flex items-center gap-1">
          {icon} {label}
        </span>
        <span className="text-white font-bold">{value}%</span>
      </div>
      <div className="h-3 rounded-full bg-white/5 overflow-hidden border border-white/5">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

export default function ResultPage() {
  const router = useRouter();
  const { phase, report, stats, unlockedAchievements, resetGame } = useGameStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (phase !== "result") {
      router.push("/");
    }
  }, [phase, router]);

  if (!mounted || !report) return null;

  const r: CoupleReport = report;

  const achievementDetails = unlockedAchievements
    .map((id) => achievements.find((a) => a.id === id))
    .filter(Boolean);

  const handlePlayAgain = () => {
    resetGame();
    router.push("/play/room");
  };

  const handleBackToMenu = () => {
    resetGame();
    router.push("/");
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-[#0f0a1a] via-[#1a0a2e] to-[#0a1628] overflow-hidden">
      <Particles />
      <SoundToggle />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary-500/20 rounded-full blur-[100px]" />

      <div className="relative z-20 flex flex-col items-center min-h-screen p-4 sm:p-6 pb-24">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-5xl sm:text-6xl mb-3"
          >
            💕
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-bold">
            <span className="text-gradient">Couple Report</span>
          </h1>
          <p className="text-white/40 mt-2 text-sm">Your Love Journey has been completed!</p>
        </motion.div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-sm mb-4"
        >
          <GlassCard glow className="p-6 text-center">
            <p className="text-white/50 text-sm uppercase tracking-wider mb-1">Total Relationship Score</p>
            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10, delay: 0.5 }}
              className="text-5xl sm:text-6xl font-bold text-gradient"
            >
              {r.totalScore}
            </motion.p>
            <p className="text-white/30 text-xs mt-2">points earned</p>
          </GlassCard>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-sm mb-4"
        >
          <GlassCard className="p-5">
            <h3 className="text-white font-bold text-sm mb-3">Journey Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-2xl">{r.totalSteps}</p>
                <p className="text-white/40 text-xs">Total Steps</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-2xl">{r.questionsAnswered}</p>
                <p className="text-white/40 text-xs">Questions</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-2xl">{categoryIcons[r.favoriteCategory]} {categoryLabels[r.favoriteCategory]}</p>
                <p className="text-white/40 text-xs">Favorite</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-2xl">{unlockedAchievements.length}</p>
                <p className="text-white/40 text-xs">Achievements</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Meters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-sm mb-4"
        >
          <GlassCard className="p-5">
            <h3 className="text-white font-bold text-sm mb-4">Relationship Meters</h3>
            <div className="space-y-3">
              <MeterBar
                label="Romance"
                icon="❤️"
                value={r.romanceMeter}
                color="bg-gradient-to-r from-pink-500 to-rose-500"
              />
              <MeterBar
                label="Fun"
                icon="😂"
                value={r.funMeter}
                color="bg-gradient-to-r from-yellow-500 to-amber-500"
              />
              <MeterBar
                label="Communication"
                icon="💭"
                value={r.communicationMeter}
                color="bg-gradient-to-r from-purple-500 to-violet-500"
              />
              <MeterBar
                label="Compatibility"
                icon="🤝"
                value={r.compatibilityMeter}
                color="bg-gradient-to-r from-teal-500 to-emerald-500"
              />
            </div>
          </GlassCard>
        </motion.div>

        {/* Compatibility Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full max-w-sm mb-4"
        >
          <GlassCard className="p-5">
            <h3 className="text-white font-bold text-sm mb-2">💌 Compatibility Analysis</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              {r.compatibilityAnalysis}
            </p>
          </GlassCard>
        </motion.div>

        {/* Achievements */}
        {achievementDetails.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="w-full max-w-sm mb-6"
          >
            <GlassCard className="p-5">
              <h3 className="text-white font-bold text-sm mb-3">🏆 Achievements Unlocked</h3>
              <div className="grid grid-cols-2 gap-2">
                {achievementDetails.map((a) => (
                  <div key={a!.id} className="bg-white/5 rounded-xl p-3 flex items-center gap-2">
                    <span className="text-xl">{a!.icon}</span>
                    <div>
                      <p className="text-white text-xs font-bold">{a!.name}</p>
                      <p className="text-white/40 text-[10px]">{a!.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="w-full max-w-sm flex flex-col gap-3"
        >
          <Button variant="primary" size="lg" className="w-full" onClick={handlePlayAgain} icon="🔄">
            Play Again
          </Button>
          <Button variant="ghost" size="md" className="w-full" onClick={handleBackToMenu} icon="🏠">
            Back to Menu
          </Button>
        </motion.div>
      </div>
    </main>
  );
}

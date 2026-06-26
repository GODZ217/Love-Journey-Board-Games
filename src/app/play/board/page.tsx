"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Board from "@/components/board/Board";
import Dice from "@/components/dice/Dice";
import QuestionCard from "@/components/questions/QuestionCard";
import PunishmentCard from "@/components/questions/PunishmentCard";
import AchievementPopup from "@/components/ui/AchievementPopup";
import AnimatedCharacter from "@/components/characters/AnimatedCharacter";
import Particles from "@/components/ui/Particles";
import SoundToggle from "@/components/sound/SoundToggle";
import GlassCard from "@/components/ui/GlassCard";
import { useGameStore } from "@/store/gameStore";
import { getCharacterById } from "@/data/characters";

export default function BoardPage() {
  const router = useRouter();

  const {
    phase,
    players,
    currentPlayerIndex,
    diceValue,
    isRolling,
    showQuestion,
    currentQuestion,
    stats,
    unlockedAchievements,
    showPunishment,
    currentPunishment,
    rollDice,
    answerQuestion,
    resetGame,
  } = useGameStore();

  const [showAchievement, setShowAchievement] = useState<string[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (phase === "result") {
      router.push("/play/result");
    } else if (phase === "menu") {
      router.push("/");
    }
  }, [phase, router]);

  const currentPlayer = players[currentPlayerIndex];

  const handleRoll = useCallback(() => {
    if (isRolling || showQuestion) return;
    rollDice();
  }, [isRolling, showQuestion, rollDice]);

  const handleAnswer = useCallback(
    (points: number) => {
      answerQuestion(points);
    },
    [answerQuestion]
  );

  const dismissAchievement = useCallback(() => {
    setShowAchievement([]);
  }, []);

  useEffect(() => {
    if (unlockedAchievements.length > 0) {
      setShowAchievement((prev) => {
        const newOnes = unlockedAchievements.filter((id) => !prev.includes(id));
        return newOnes.length > 0 ? [...prev, ...newOnes] : prev;
      });
    }
  }, [unlockedAchievements]);

  if (!mounted) return null;

  return (
    <main
      className="relative flex flex-col bg-gradient-to-br from-[#0f0a1a] via-[#1a0a2e] to-[#0a1628]"
      style={{ height: "100dvh", overflow: "hidden" }}
    >
      <Particles />
      <SoundToggle />

      <div className="absolute top-0 left-0 w-full h-64 bg-primary-500/10 blur-[100px]" />

      {/* Main content area */}
      <div className="relative z-20 flex flex-col flex-1 min-h-0 p-1 sm:p-2 gap-[2px] sm:gap-1">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-sm sm:text-lg md:text-xl font-bold leading-tight">
            <span className="text-gradient">Love Journey</span>
          </h1>
          <p className="text-white/40 text-[9px] sm:text-[11px] leading-tight">
            {players[0].name} ❤️ {players[1].name}
          </p>
        </motion.div>

        {/* Player info bar */}
        <div className="flex items-center justify-between gap-1 sm:gap-2">
          {players.map((p, i) => {
            const char = getCharacterById(p.characterId);
            const isActive = i === currentPlayerIndex;
            return (
              <motion.div
                key={p.id}
                animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                className={`flex items-center gap-1 p-1 sm:p-1.5 rounded-xl transition-all flex-1 border ${
                  isActive
                    ? "bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border-primary-500/40 shadow-lg shadow-primary-500/10"
                    : "bg-white/5 border-white/5"
                }`}
              >
                <div className="flex-shrink-0">
                  {char ? (
                    <AnimatedCharacter
                      character={char}
                      emotion={isActive ? "happy" : "idle"}
                      size={22}
                    />
                  ) : (
                    <span className="text-base">👤</span>
                  )}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className={`text-[9px] sm:text-xs font-bold truncate ${isActive ? "text-white" : "text-white/50"}`}>
                    {p.name}
                  </p>
                  <p className="text-[7px] sm:text-[9px] text-white/30">Tile {p.position}</p>
                </div>
                {isActive && (
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0"
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Score bar */}
        <GlassCard className="w-full p-1.5 sm:p-2">
          <div className="flex items-center justify-between text-[9px] sm:text-[11px] text-white/60">
            <span className="flex items-center gap-1">
              💖 <span className="text-primary-300 font-bold">{stats.totalScore}</span>
            </span>
            <span className="flex items-center gap-1">
              💬 <span className="text-secondary-300 font-bold">{stats.questionsAnswered}</span>
            </span>
            <button
              onClick={() => setShowStats(!showStats)}
              className="text-white/40 hover:text-white/70 transition-colors text-xs"
            >
              📊
            </button>
          </div>
        </GlassCard>

        {/* Board - fills remaining vertical space, maintains square */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          <div className="h-full aspect-square max-w-full max-h-full">
            <Board />
          </div>
        </div>
      </div>

      {/* Dice bar - fixed at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-30 flex-shrink-0 flex justify-center pb-1 sm:pb-2 pt-[2px]"
      >
        <Dice
          value={diceValue}
          isRolling={isRolling}
          onRoll={handleRoll}
          disabled={showQuestion || isRolling}
        />
      </motion.div>

      {/* Question Card Modal */}
      {showQuestion && currentQuestion && (
        <QuestionCard question={currentQuestion} player={currentPlayer} onAnswer={handleAnswer} />
      )}

      {showPunishment && currentPunishment && (
        <PunishmentCard punishment={currentPunishment} />
      )}

      {/* Achievement Popup */}
      <AchievementPopup unlockedIds={showAchievement} onDismiss={dismissAchievement} />

      {/* Stats Modal */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowStats(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm"
            >
              <GlassCard className="p-4">
                <h3 className="text-white font-bold text-base mb-3 text-center">Game Stats</h3>
                <div className="space-y-1.5 text-xs">
                  {[
                    { label: "😂 Funny", value: stats.funnyCount },
                    { label: "💭 Deep Talk", value: stats.deepCount },
                    { label: "📸 Memory", value: stats.memoryCount },
                    { label: "🎯 Challenge", value: stats.challengeCount },
                    { label: "🔥 Intimacy", value: stats.intimacyCount },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-white/70">
                      <span>{label}</span>
                      <span className="text-white">{value}</span>
                    </div>
                  ))}
                  <div className="border-t border-white/10 pt-1.5 mt-1.5">
                    <div className="flex justify-between text-white/70 font-bold">
                      <span>Total Score</span>
                      <span className="text-primary-300">{stats.totalScore}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowStats(false)}
                  className="w-full mt-3 px-4 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/70 text-xs hover:bg-white/10 transition-all"
                >
                  Close
                </button>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

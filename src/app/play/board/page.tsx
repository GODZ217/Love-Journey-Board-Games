"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Board from "@/components/board/Board";
import Dice from "@/components/dice/Dice";
import QuestionCard from "@/components/questions/QuestionCard";
import AchievementPopup from "@/components/ui/AchievementPopup";
import AnimatedCharacter from "@/components/characters/AnimatedCharacter";
import Particles from "@/components/ui/Particles";
import SoundToggle from "@/components/sound/SoundToggle";
import GlassCard from "@/components/ui/GlassCard";
import { useGameStore } from "@/store/gameStore";
import { getCharacterById } from "@/data/characters";

export default function BoardPage() {
  const router = useRouter();
  const moveTriggered = useRef(false);

  const {
    phase,
    players,
    currentPlayerIndex,
    diceValue,
    isRolling,
    showQuestion,
    currentQuestion,
    currentTile,
    stats,
    unlockedAchievements,
    rollDice,
    movePlayer,
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
    moveTriggered.current = false;
    rollDice();
  }, [isRolling, showQuestion, rollDice]);

  useEffect(() => {
    if (diceValue !== null && !isRolling && !moveTriggered.current) {
      moveTriggered.current = true;
      const timer = setTimeout(() => {
        movePlayer();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [diceValue, isRolling, movePlayer]);

  const handleAnswer = useCallback(
    (points: number) => {
      answerQuestion(points);
    },
    [answerQuestion]
  );

  const dismissAchievement = useCallback(() => {
    setShowAchievement([]);
  }, []);

  // Watch for new achievements
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
    <main className="relative min-h-screen bg-gradient-to-br from-[#0f0a1a] via-[#1a0a2e] to-[#0a1628] overflow-hidden">
      <Particles />
      <SoundToggle />

      <div className="absolute top-0 left-0 w-full h-64 bg-primary-500/10 blur-[100px]" />

      <div className="relative z-20 flex flex-col items-center min-h-screen p-2 sm:p-4 pb-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg text-center mb-2"
        >
          <h1 className="text-xl sm:text-2xl font-bold">
            <span className="text-gradient">Love Journey</span>
          </h1>
          <p className="text-white/40 text-xs">
            {players[0].name} ❤️ {players[1].name}
          </p>
        </motion.div>

        {/* Player info bar */}
        <div className="w-full max-w-lg mb-3">
          <div className="flex items-center justify-between gap-2">
            {players.map((p, i) => {
              const char = getCharacterById(p.characterId);
              const isActive = i === currentPlayerIndex;
              return (
                <motion.div
                  key={p.id}
                  animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                  className={`flex items-center gap-2 p-2 rounded-xl transition-all flex-1 ${
                    isActive
                      ? "bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30"
                      : "bg-white/5 border border-white/5"
                  }`}
                >
                  <div className="flex-shrink-0">
                    {char ? (
                      <AnimatedCharacter
                        character={char}
                        emotion={isActive ? "happy" : "idle"}
                        size={36}
                      />
                    ) : (
                      <span className="text-xl">👤</span>
                    )}
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className={`text-xs sm:text-sm font-bold truncate ${isActive ? "text-white" : "text-white/50"}`}>
                      {p.name}
                      {isActive && (
                        <motion.span
                          animate={{ opacity: [0, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="text-primary-400 ml-1"
                        >
                          ▶
                        </motion.span>
                      )}
                    </p>
                    <p className="text-[10px] text-white/30">Tile {p.position}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Score bar */}
        <GlassCard className="w-full max-w-lg mb-3 p-3">
          <div className="flex items-center justify-between text-xs text-white/60">
            <span className="flex items-center gap-1">
              💖 Score: <span className="text-primary-300 font-bold">{stats.totalScore}</span>
            </span>
            <span className="flex items-center gap-1">
              💬 Questions: <span className="text-secondary-300 font-bold">{stats.questionsAnswered}</span>
            </span>
            <button
              onClick={() => setShowStats(!showStats)}
              className="text-white/40 hover:text-white/70 transition-colors"
            >
              📊
            </button>
          </div>
        </GlassCard>

        {/* Board */}
        <div className="board-container">
          <Board />
        </div>

        {/* Dice - Fixed bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 pb-6 bg-gradient-to-t from-dark via-dark/95 to-transparent z-30"
        >
          <div className="max-w-lg mx-auto">
            <div className="flex flex-col items-center gap-2">
              <Dice
                value={diceValue}
                isRolling={isRolling}
                onRoll={handleRoll}
                disabled={showQuestion || !!diceValue || isRolling}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Question Card Modal */}
      {showQuestion && currentQuestion && (
        <QuestionCard question={currentQuestion} player={currentPlayer} onAnswer={handleAnswer} />
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
              <GlassCard className="p-6">
                <h3 className="text-white font-bold text-lg mb-4 text-center">Game Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-white/70">
                    <span>😂 Funny</span>
                    <span className="text-white">{stats.funnyCount}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>💭 Deep Talk</span>
                    <span className="text-white">{stats.deepCount}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>📸 Memory</span>
                    <span className="text-white">{stats.memoryCount}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>🎯 Challenge</span>
                    <span className="text-white">{stats.challengeCount}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>🔥 Intimacy</span>
                    <span className="text-white">{stats.intimacyCount}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 mt-2">
                    <div className="flex justify-between text-white/70 font-bold">
                      <span>Total Score</span>
                      <span className="text-primary-300">{stats.totalScore}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowStats(false)}
                  className="w-full mt-4 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm hover:bg-white/10 transition-all"
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

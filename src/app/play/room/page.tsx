"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import Particles from "@/components/ui/Particles";
import SoundToggle from "@/components/sound/SoundToggle";
import CharacterSelect from "@/components/characters/CharacterSelect";
import { characters } from "@/data/characters";
import { useGameStore } from "@/store/gameStore";
import { generatePlayerId } from "@/utils/board";

export default function RoomPage() {
  const router = useRouter();
  const setPhase = useGameStore((s) => s.setPhase);
  const setPlayers = useGameStore((s) => s.setPlayers);
  const players = useGameStore((s) => s.players);

  const [step, setStep] = useState<"setup" | "characters">("setup");
  const [player1Name, setPlayer1Name] = useState("");
  const [player2Name, setPlayer2Name] = useState("");
  const [player1Char, setPlayer1Char] = useState("");
  const [player2Char, setPlayer2Char] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setPhase("room");
  }, [setPhase]);

  const handleContinue = () => {
    if (!player1Name.trim() || !player2Name.trim()) {
      setError("Please enter both names");
      return;
    }
    setError("");
    setStep("characters");
  };

  const handleStartGame = () => {
    if (!player1Char || !player2Char) {
      setError("Both players must select a character");
      return;
    }

    setPlayers([
      {
        id: generatePlayerId(),
        name: player1Name.trim(),
        gender: "male",
        characterId: player1Char,
        position: 0,
        isCurrentTurn: true,
      },
      {
        id: generatePlayerId(),
        name: player2Name.trim(),
        gender: "female",
        characterId: player2Char,
        position: 0,
        isCurrentTurn: false,
      },
    ]);

    setPhase("playing");
    router.push("/play/board");
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-[#0f0a1a] via-[#1a0a2e] to-[#0a1628] overflow-hidden">
      <Particles />
      <SoundToggle />

      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-primary-500/15 rounded-full blur-[80px]" />
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-secondary-500/15 rounded-full blur-[80px]" />

      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold">
            <span className="text-gradient">Create Room</span>
          </h1>
          <p className="text-white/40 mt-2 text-sm">Set up your game session</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === "setup" ? (
            <motion.div
              key="setup"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="w-full max-w-md space-y-6"
            >
              <GlassCard className="p-6">
                <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <span>👤</span> Player 1 (Male)
                </h2>
                <input
                  type="text"
                  value={player1Name}
                  onChange={(e) => setPlayer1Name(e.target.value)}
                  placeholder="Enter your name..."
                  maxLength={20}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all"
                />
              </GlassCard>

              <GlassCard className="p-6">
                <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <span>👩</span> Player 2 (Female)
                </h2>
                <input
                  type="text"
                  value={player2Name}
                  onChange={(e) => setPlayer2Name(e.target.value)}
                  placeholder="Enter your name..."
                  maxLength={20}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 transition-all"
                />
              </GlassCard>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm text-center"
                >
                  {error}
                </motion.p>
              )}

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={handleContinue}
                icon="✨"
              >
                Choose Characters
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="characters"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full max-w-lg space-y-6"
            >
              <GlassCard className="p-6">
                <h2 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                  <span>👤</span> {players[0].name || player1Name} - Choose Character
                </h2>
                <CharacterSelect
                  characters={characters}
                  selectedId={player1Char}
                  onSelect={setPlayer1Char}
                  gender="male"
                />
              </GlassCard>

              <GlassCard className="p-6">
                <h2 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                  <span>👩</span> {players[1].name || player2Name} - Choose Character
                </h2>
                <CharacterSelect
                  characters={characters}
                  selectedId={player2Char}
                  onSelect={setPlayer2Char}
                  gender="female"
                />
              </GlassCard>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm text-center"
                >
                  {error}
                </motion.p>
              )}

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => setStep("setup")}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleStartGame}
                  className="flex-1"
                  icon="🎮"
                >
                  Start Game!
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

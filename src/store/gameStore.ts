"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  GameState,
  GamePhase,
  Player,
  Tile,
  CoupleReport,
  GameStats,
  TileType,
  QuestionCategory,
} from "@/types";
import { BOARD_SIZE } from "@/data/board";
import { getRandomQuestion } from "@/data/questions";
import { checkAchievements } from "@/data/achievements";
import {
  getQuestionCategory,
  getSnakeOrLadder,
  getTileType,
} from "@/data/board";
import { soundEngine } from "@/lib/sound";

const initialStats: GameStats = {
  totalSteps: 0,
  questionsAnswered: 0,
  funnyCount: 0,
  deepCount: 0,
  memoryCount: 0,
  challengeCount: 0,
  intimacyCount: 0,
  quizCount: 0,
  totalScore: 0,
  snakesHit: 0,
  laddersHit: 0,
};

interface GameStore extends GameState {
  setPhase: (phase: GamePhase) => void;
  setPlayers: (players: [Player, Player]) => void;
  setCharacter: (playerIndex: number, characterId: string) => void;
  rollDice: () => void;
  movePlayer: () => void;
  answerQuestion: (points: number) => void;
  nextTurn: () => void;
  finishGame: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
  resetGame: () => void;
}

const generateCoupleReport = (stats: GameStats): CoupleReport => {
  const romanceMeter = Math.min(100, Math.round((stats.intimacyCount * 3 + stats.totalScore * 0.5) / 3));
  const funMeter = Math.min(100, Math.round((stats.funnyCount * 2 + stats.challengeCount * 1.5) / 2));
  const communicationMeter = Math.min(100, Math.round((stats.deepCount * 3 + stats.memoryCount * 2) / 3));
  const compatibilityMeter = Math.min(
    100,
    Math.round((romanceMeter + funMeter + communicationMeter) / 3 + stats.totalScore * 0.2)
  );

  let compatibilityAnalysis = "";
  const strongPoints: string[] = [];
  const growthAreas: string[] = [];

  if (stats.deepCount >= 5) strongPoints.push("komunikasi yang sangat baik dan terbuka terhadap diskusi mendalam");
  if (stats.intimacyCount >= 5) strongPoints.push("kedekatan emosional yang kuat dan saling menghargai");
  if (stats.memoryCount >= 5) strongPoints.push("banyak kenangan indah yang kalian bangun bersama");
  if (stats.funnyCount >= 5) strongPoints.push("kemampuan untuk tertawa bersama, tanda hubungan yang sehat");
  if (stats.challengeCount >= 3) strongPoints.push("keberanian untuk menghadapi tantangan bersama");

  if (stats.deepCount < 3) growthAreas.push("meningkatkan komunikasi emosional");
  if (stats.intimacyCount < 3) growthAreas.push("memperdalam keintiman dan afeksi");
  if (stats.memoryCount < 2) growthAreas.push("menciptakan lebih banyak kenangan bersama");
  if (stats.funnyCount < 3) growthAreas.push("lebih banyak momen santai dan lucu berdua");

  if (strongPoints.length > 0 && growthAreas.length > 0) {
    compatibilityAnalysis = `Kalian memiliki ${strongPoints.join(", ")}. Namun, kalian masih bisa ${growthAreas.join(", ")} untuk hubungan yang lebih harmonis.`;
  } else if (strongPoints.length > 0) {
    compatibilityAnalysis = `Kalian memiliki ${strongPoints.join(", ")}. Pertahankan dan terus tumbuh bersama!`;
  } else if (growthAreas.length > 0) {
    compatibilityAnalysis = `Kalian masih bisa ${growthAreas.join(", ")}. Nikmati setiap langkah perjalanan kalian!`;
  } else {
    compatibilityAnalysis = "Kalian adalah pasangan yang seimbang! Teruslah berkomunikasi dan saling mendukung.";
  }

  const categoryCounts: Record<string, number> = {
    funny: stats.funnyCount,
    deep: stats.deepCount,
    memory: stats.memoryCount,
    challenge: stats.challengeCount,
    intimacy: stats.intimacyCount,
  };
  const favoriteCategory = Object.entries(categoryCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "knowing";

  return {
    totalSteps: stats.totalSteps,
    questionsAnswered: stats.questionsAnswered,
    favoriteCategory,
    totalScore: stats.totalScore,
    romanceMeter,
    funMeter,
    communicationMeter,
    compatibilityMeter,
    compatibilityAnalysis,
    achievements: [],
  };
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      phase: "menu",
      players: [
        {
          id: "",
          name: "Player 1",
          gender: "male",
          characterId: "",
          position: 0,
          isCurrentTurn: true,
        },
        {
          id: "",
          name: "Player 2",
          gender: "female",
          characterId: "",
          position: 0,
          isCurrentTurn: false,
        },
      ],
      currentPlayerIndex: 0,
      diceValue: null,
      isRolling: false,
      showQuestion: false,
      currentQuestion: null,
      currentTile: null,
      stats: { ...initialStats },
      report: null,
      unlockedAchievements: [],
      soundEnabled: true,
      boardAnimation: false,
      showVictory: false,

      setPhase: (phase) => set({ phase }),

      setPlayers: (players) => set({ players }),

      setCharacter: (playerIndex, characterId) =>
        set((state) => {
          const newPlayers = [...state.players] as [Player, Player];
          newPlayers[playerIndex] = { ...newPlayers[playerIndex], characterId };
          return { players: newPlayers };
        }),

      rollDice: () => {
        const state = get();
        if (state.isRolling || state.showQuestion) return;
        soundEngine.dice();
        set({ isRolling: true, diceValue: null });

        const value = Math.floor(Math.random() * 6) + 1;
        setTimeout(() => {
          set({ diceValue: value, isRolling: false });
        }, 800);
      },

      movePlayer: () => {
        const state = get();
        if (state.diceValue === null) return;

        const playerIndex = state.currentPlayerIndex;
        const player = state.players[playerIndex];
        const steps = state.diceValue;
        const newPosition = Math.min(player.position + steps, BOARD_SIZE);
        const sl = getSnakeOrLadder(newPosition);

        let finalPosition = newPosition;
        let extraPoints = 0;

        if (sl) {
          finalPosition = sl.end;
          if (sl.type === "ladder") {
            extraPoints = 3;
            soundEngine.ladder();
          } else {
            soundEngine.snake();
          }
        }

        const newPlayers = [...state.players] as [Player, Player];
        newPlayers[playerIndex] = {
          ...player,
          position: finalPosition > newPosition ? finalPosition : finalPosition,
        };

        const newStats = {
          ...state.stats,
          totalSteps: state.stats.totalSteps + steps,
          laddersHit: sl?.type === "ladder" ? state.stats.laddersHit + 1 : state.stats.laddersHit,
          snakesHit: sl?.type === "snake" ? state.stats.snakesHit + 1 : state.stats.snakesHit,
          totalScore: state.stats.totalScore + extraPoints,
        };

        set({
          players: newPlayers,
          boardAnimation: true,
          stats: newStats,
          diceValue: null,
        });

        // After movement, check tile type and show question if needed
        setTimeout(() => {
          const tileType = getTileType(finalPosition);
          const hasSL = !!getSnakeOrLadder(finalPosition);

          if (tileType !== "normal" || hasSL) {
            const currentState = get();
            const currentPlayer = currentState.players[playerIndex];
            const category = getQuestionCategory(tileType) as QuestionCategory;
            const question = getRandomQuestion(category, currentPlayer.gender);

            soundEngine.question();

            set({
              showQuestion: true,
              currentQuestion: question,
              currentTile: {
                id: finalPosition,
                number: finalPosition,
                type: tileType,
                x: 0,
                y: 0,
                hasSnake: sl?.type === "snake" ? { end: sl.end } : undefined,
                hasLadder: sl?.type === "ladder" ? { end: sl.end } : undefined,
              },
              boardAnimation: false,
            });
          } else if (finalPosition >= BOARD_SIZE) {
            set({ boardAnimation: false });
            get().finishGame();
          } else {
            set({ boardAnimation: false });
            get().nextTurn();
          }
        }, 1000);
      },

      answerQuestion: (points) => {
        const state = get();
        const question = state.currentQuestion;
        if (!question) return;

        soundEngine.heart();

        const newStats = { ...state.stats };
        newStats.questionsAnswered += 1;
        newStats.totalScore += points;

        switch (question.category) {
          case "funny":
            newStats.funnyCount += 1;
            break;
          case "deep":
            newStats.deepCount += 1;
            break;
          case "memory":
            newStats.memoryCount += 1;
            break;
          case "challenge":
            newStats.challengeCount += 1;
            break;
          case "intimacy":
            newStats.intimacyCount += 1;
            break;
          case "knowing":
            newStats.quizCount += 1;
            break;
        }

        const newAchievements = checkAchievements(newStats, state.unlockedAchievements);
        if (newAchievements.length > 0) {
          soundEngine.achievement();
        }

        set({
          stats: newStats,
          showQuestion: false,
          currentQuestion: null,
          currentTile: null,
          unlockedAchievements: [...state.unlockedAchievements, ...newAchievements],
        });

        // Check if reached the end
        const currentPlayer = state.players[state.currentPlayerIndex];
        if (currentPlayer.position >= BOARD_SIZE) {
          get().finishGame();
        } else {
          get().nextTurn();
        }
      },

      nextTurn: () => {
        const state = get();
        const nextIndex = state.currentPlayerIndex === 0 ? 1 : 0;
        const newPlayers = [...state.players] as [Player, Player];
        newPlayers[0] = { ...newPlayers[0], isCurrentTurn: nextIndex === 0 };
        newPlayers[1] = { ...newPlayers[1], isCurrentTurn: nextIndex === 1 };

        set({
          currentPlayerIndex: nextIndex,
          players: newPlayers,
          showQuestion: false,
        });
      },

      finishGame: () => {
        const state = get();
        const report = generateCoupleReport(state.stats);
        const achievements = checkAchievements(state.stats, state.unlockedAchievements);

        soundEngine.victory();

        set({
          phase: "result",
          report: {
            ...report,
            achievements: [...state.unlockedAchievements, ...achievements],
          },
          unlockedAchievements: [...state.unlockedAchievements, ...achievements],
          showVictory: true,
        });
      },

      setSoundEnabled: (enabled) => {
        soundEngine.setEnabled(enabled);
        set({ soundEnabled: enabled });
      },

      toggleSound: () => {
        const enabled = soundEngine.toggle();
        set({ soundEnabled: enabled });
      },

      resetGame: () => {
        set({
          phase: "menu",
          players: [
            {
              id: "",
              name: "Player 1",
              gender: "male",
              characterId: "",
              position: 0,
              isCurrentTurn: true,
            },
            {
              id: "",
              name: "Player 2",
              gender: "female",
              characterId: "",
              position: 0,
              isCurrentTurn: false,
            },
          ],
          currentPlayerIndex: 0,
          diceValue: null,
          isRolling: false,
          showQuestion: false,
          currentQuestion: null,
          currentTile: null,
          stats: { ...initialStats },
          report: null,
          unlockedAchievements: [],
          soundEnabled: get().soundEnabled,
          boardAnimation: false,
          showVictory: false,
        });
      },
    }),
    {
      name: "love-journey-storage",
      partialize: (state) => ({
        unlockedAchievements: state.unlockedAchievements,
        soundEnabled: state.soundEnabled,
      }),
    }
  )
);

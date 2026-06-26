"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  GameState,
  GamePhase,
  Player,
  CoupleReport,
  GameStats,
  TileType,
  QuestionCategory,
  Punishment,
} from "@/types";
import { BOARD_SIZE } from "@/data/board";
import { getRandomQuestion } from "@/data/questions";
import { getRandomPunishment } from "@/data/punishments";
import { checkAchievements } from "@/data/achievements";
import {
  getQuestionCategory,
  getSnakeOrLadder,
  getTileType,
  isSlide,
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
};

interface GameStore extends GameState {
  setPhase: (phase: GamePhase) => void;
  setPlayers: (players: [Player, Player]) => void;
  setCharacter: (playerIndex: number, characterId: string) => void;
  rollDice: () => void;
  advanceStep: () => void;
  finishSlide: () => void;
  answerQuestion: (points: number) => void;
  dismissPunishment: () => void;
  finishGame: () => void;
  nextTurn: () => void;
  resetGame: () => void;
  toggleSound: () => void;
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

const TIMING = {
  DICE_ROLL: 800,
  STEP_MOVE: 220,
  SLIDE_PAUSE: 500,
  SLIDE_DURATION: 600,
  POST_MOVE: 400,
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
      showPunishment: false,
      currentPunishment: null,
      isMoving: false,
      movementPath: [],
      movementIndex: 0,
      isSliding: false,
      slideTarget: null,

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
        if (state.isRolling || state.showQuestion || state.showPunishment || state.isMoving || state.isSliding) return;

        soundEngine.dice();
        set({ isRolling: true, diceValue: null, boardAnimation: false });

        const value = Math.floor(Math.random() * 6) + 1;

        setTimeout(() => {
          const current = get();
          const playerIndex = current.currentPlayerIndex;
          const player = current.players[playerIndex];
          const startPos = player.position;

          const path: number[] = [];
          for (let i = 1; i <= value; i++) {
            const pos = startPos + i;
            if (pos > BOARD_SIZE) break;
            path.push(pos);
          }

          set({
            diceValue: value,
            isRolling: false,
            movementPath: path,
            movementIndex: -1,
            isMoving: path.length > 0,
            boardAnimation: path.length > 0,
          });

          if (path.length === 0) {
            get().nextTurn();
            return;
          }

          setTimeout(() => {
            get().advanceStep();
          }, 150);
        }, TIMING.DICE_ROLL);
      },

      advanceStep: () => {
        const state = get();
        if (!state.isMoving) return;

        const nextIdx = state.movementIndex + 1;

        if (nextIdx >= state.movementPath.length) {
          const finalPos = state.movementPath[state.movementPath.length - 1];
          const playerIndex = state.currentPlayerIndex;
          const player = state.players[playerIndex];
          const sl = getSnakeOrLadder(finalPos);

          const newPlayers = [...state.players] as [Player, Player];
          newPlayers[playerIndex] = { ...player, position: finalPos };

          const newStats = {
            ...state.stats,
            totalSteps: state.stats.totalSteps + state.movementPath.length,
            snakesHit: sl?.type === "slide" || sl?.type === "snake" ? state.stats.snakesHit + 1 : state.stats.snakesHit,
          };

          set({
            players: newPlayers,
            stats: newStats,
            isMoving: false,
            movementPath: [],
            movementIndex: 0,
            diceValue: null,
            boardAnimation: true,
          });

          soundEngine.landing();

          if (sl?.type === "slide") {
            setTimeout(() => {
              get().finishSlide();
            }, TIMING.SLIDE_PAUSE);
          } else {
            setTimeout(() => {
              const current = get();
              const tileType = getTileType(finalPos);

              set({ boardAnimation: false });

              if (finalPos >= BOARD_SIZE) {
                get().finishGame();
                return;
              }

              const cp = current.players[playerIndex];
              const category = getQuestionCategory(tileType) as QuestionCategory;
              const question = getRandomQuestion(category, cp.gender);
              soundEngine.question();
              set({
                showQuestion: true,
                currentQuestion: question,
                currentTile: {
                  id: finalPos, number: finalPos, type: tileType,
                  x: 0, y: 0,
                  hasSnake: sl?.type === "snake" ? { end: sl.end } : undefined,
                },
              });
            }, TIMING.POST_MOVE);
          }
          return;
        }

        const stepPos = state.movementPath[nextIdx];
        const playerIndex = state.currentPlayerIndex;
        const player = state.players[playerIndex];
        const newPlayers = [...state.players] as [Player, Player];
        newPlayers[playerIndex] = { ...player, position: stepPos };

        soundEngine.step();

        set({
          players: newPlayers,
          movementIndex: nextIdx,
          boardAnimation: true,
        });

        setTimeout(() => {
          get().advanceStep();
        }, TIMING.STEP_MOVE);
      },

      finishSlide: () => {
        const state = get();
        const playerIndex = state.currentPlayerIndex;
        const player = state.players[playerIndex];
        const sl = getSnakeOrLadder(player.position);
        if (!sl || sl.type !== "slide") return;

        soundEngine.slide();

        const target = sl.end;

        // Keep position at slide start during animation
        set({
          isSliding: true,
          slideTarget: target,
          boardAnimation: true,
        });

        setTimeout(() => {
          const current = get();
          const p = current.players[playerIndex];
          const updatedPlayers = [...current.players] as [Player, Player];
          updatedPlayers[playerIndex] = { ...p, position: target };

          set({
            players: updatedPlayers,
            isSliding: false,
            slideTarget: null,
            boardAnimation: false,
          });

          const punishment = getRandomPunishment();
          set({ showPunishment: true, currentPunishment: punishment });
        }, TIMING.SLIDE_DURATION);
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
          case "funny": newStats.funnyCount += 1; break;
          case "deep": newStats.deepCount += 1; break;
          case "memory": newStats.memoryCount += 1; break;
          case "challenge": newStats.challengeCount += 1; break;
          case "intimacy": newStats.intimacyCount += 1; break;
          case "knowing": newStats.quizCount += 1; break;
        }

        const newAchievements = checkAchievements(newStats, state.unlockedAchievements);
        if (newAchievements.length > 0) soundEngine.achievement();

        set({
          stats: newStats,
          showQuestion: false,
          currentQuestion: null,
          currentTile: null,
          unlockedAchievements: [...state.unlockedAchievements, ...newAchievements],
        });

        const cp = get().players[state.currentPlayerIndex];
        if (cp.position >= BOARD_SIZE) get().finishGame();
        else get().nextTurn();
      },

      dismissPunishment: () => {
        soundEngine.heart();
        set({ showPunishment: false, currentPunishment: null });

        const state = get();
        const cp = state.players[state.currentPlayerIndex];
        if (cp.position >= BOARD_SIZE) get().finishGame();
        else get().nextTurn();
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
          report: { ...report, achievements: [...state.unlockedAchievements, ...achievements] },
          unlockedAchievements: [...state.unlockedAchievements, ...achievements],
          showVictory: true,
        });
      },

      toggleSound: () => {
        const enabled = soundEngine.toggle();
        set({ soundEnabled: enabled });
      },

      resetGame: () => {
        set({
          phase: "menu",
          players: [
            { id: "", name: "Player 1", gender: "male", characterId: "", position: 0, isCurrentTurn: true },
            { id: "", name: "Player 2", gender: "female", characterId: "", position: 0, isCurrentTurn: false },
          ],
          currentPlayerIndex: 0,
          diceValue: null, isRolling: false, showQuestion: false,
          currentQuestion: null, currentTile: null,
          stats: { ...initialStats }, report: null,
          unlockedAchievements: [],
          soundEnabled: get().soundEnabled,
          boardAnimation: false, showVictory: false,
          showPunishment: false, currentPunishment: null,
          isMoving: false, movementPath: [], movementIndex: 0,
          isSliding: false, slideTarget: null,
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

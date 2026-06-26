import { Achievement, GameStats } from "@/types";

export const achievements: Achievement[] = [
  {
    id: "first-step",
    name: "First Step",
    description: "Take your first turn in the game",
    icon: "👣",
    condition: (stats) => stats.totalSteps >= 1,
  },
  {
    id: "first-question",
    name: "First Conversation",
    description: "Answer your first question together",
    icon: "💬",
    condition: (stats) => stats.questionsAnswered >= 1,
  },
  {
    id: "deep-talk-master",
    name: "Deep Talk Master",
    description: "Answer 10 deep talk questions",
    icon: "🌊",
    condition: (stats) => stats.deepCount >= 10,
  },
  {
    id: "romantic-soul",
    name: "Romantic Soul",
    description: "Answer 10 intimacy questions",
    icon: "💕",
    condition: (stats) => stats.intimacyCount >= 10,
  },
  {
    id: "memory-keeper",
    name: "Memory Keeper",
    description: "Answer 8 memory questions",
    icon: "📸",
    condition: (stats) => stats.memoryCount >= 8,
  },
  {
    id: "fun-couple",
    name: "Fun Couple",
    description: "Answer 12 funny questions",
    icon: "😂",
    condition: (stats) => stats.funnyCount >= 12,
  },
  {
    id: "challenge-accepted",
    name: "Challenge Accepted",
    description: "Complete 6 challenges",
    icon: "🎯",
    condition: (stats) => stats.challengeCount >= 6,
  },
  {
    id: "heart-collector",
    name: "Heart Collector",
    description: "Reach 50 relationship score",
    icon: "💖",
    condition: (stats) => stats.totalScore >= 50,
  },
  {
    id: "soulmate-candidate",
    name: "Soulmate Candidate",
    description: "Reach 100 relationship score",
    icon: "💎",
    condition: (stats) => stats.totalScore >= 100,
  },
  {
    id: "lucky-roll",
    name: "Lucky Roll",
    description: "Roll a 6 three times in one game",
    icon: "🎲",
    condition: (_stats: GameStats) => false,
  },
  {
    id: "snake-charmer",
    name: "Snake Charmer",
    description: "Survive 5 snakes",
    icon: "🐍",
    condition: (stats) => stats.snakesHit >= 5,
  },
  {
    id: "halfway-there",
    name: "Halfway There",
    description: "Reach tile 50",
    icon: "🏔️",
    condition: (stats) => stats.totalSteps >= 50,
  },
  {
    id: "full-journey",
    name: "Full Journey",
    description: "Complete the game",
    icon: "🏁",
    condition: (stats) => stats.totalSteps >= 100,
  },
  {
    id: "couple-explorer",
    name: "Couple Explorer",
    description: "Answer questions from every category",
    icon: "🗺️",
    condition: (stats) =>
      stats.funnyCount >= 1 &&
      stats.deepCount >= 1 &&
      stats.memoryCount >= 1 &&
      stats.challengeCount >= 1 &&
      stats.intimacyCount >= 1,
  },
  {
    id: "love-birds",
    name: "Love Birds",
    description: "Score over 75 relationship points",
    icon: "🕊️",
    condition: (stats) => stats.totalScore >= 75,
  },
];

export const checkAchievements = (
  stats: import("@/types").GameStats,
  unlocked: string[]
): string[] => {
  const newlyUnlocked: string[] = [];
  for (const achievement of achievements) {
    if (!unlocked.includes(achievement.id) && achievement.condition(stats)) {
      newlyUnlocked.push(achievement.id);
    }
  }
  return newlyUnlocked;
};

export type Gender = "male" | "female";

export type Player = {
  id: string;
  name: string;
  gender: Gender;
  characterId: string;
  position: number;
  isCurrentTurn: boolean;
};

export type TileType =
  | "normal"
  | "love"
  | "funny"
  | "deep"
  | "memory"
  | "challenge"
  | "intimacy"
  | "quiz";

export type QuestionCategory =
  | "funny"
  | "deep"
  | "knowing"
  | "memory"
  | "challenge"
  | "intimacy";

export type Question = {
  id: number;
  category: QuestionCategory;
  tileType: TileType;
  male: string;
  female: string;
  points: number;
};

export type Tile = {
  id: number;
  number: number;
  type: TileType;
  x: number;
  y: number;
  hasSnake?: { end: number };
};

export type SnakeOrLadder = {
  start: number;
  end: number;
  type: "snake" | "slide";
};

export type Punishment = {
  id: number;
  text: string;
  type: "funny" | "romantic" | "embarrassing" | "sweet";
};

export type CharacterStyle = {
  hairColor: string;
  hairStyle: "male_short" | "male_medium" | "female_long" | "female_ponytail" | "female_twintail";
  eyeColor: string;
  outfitColor: string;
  accentColor: string;
  skinTone: string;
  accessory: "none" | "glasses" | "hat" | "ribbon" | "crown" | "mask" | "earring";
};

export type Character = {
  id: string;
  name: string;
  gender: Gender;
  title: string;
  description: string;
  color: string;
  bgGradient: string;
  emojis: {
    idle: string;
    happy: string;
    embarrassed: string;
    thinking: string;
    victory: string;
  };
  style: CharacterStyle;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (stats: GameStats) => boolean;
};

export type GameStats = {
  totalSteps: number;
  questionsAnswered: number;
  funnyCount: number;
  deepCount: number;
  memoryCount: number;
  challengeCount: number;
  intimacyCount: number;
  quizCount: number;
  totalScore: number;
  snakesHit: number;
};

export type CoupleReport = {
  totalSteps: number;
  questionsAnswered: number;
  favoriteCategory: string;
  totalScore: number;
  romanceMeter: number;
  funMeter: number;
  communicationMeter: number;
  compatibilityMeter: number;
  compatibilityAnalysis: string;
  achievements: string[];
};

export type GamePhase =
  | "menu"
  | "room"
  | "character_select"
  | "playing"
  | "question"
  | "result";

export type GameState = {
  phase: GamePhase;
  players: [Player, Player];
  currentPlayerIndex: number;
  diceValue: number | null;
  isRolling: boolean;
  showQuestion: boolean;
  currentQuestion: Question | null;
  currentTile: Tile | null;
  stats: GameStats;
  report: CoupleReport | null;
  unlockedAchievements: string[];
  soundEnabled: boolean;
  boardAnimation: boolean;
  showVictory: boolean;
  showPunishment: boolean;
  currentPunishment: Punishment | null;
  isMoving: boolean;
  movementPath: number[];
  movementIndex: number;
  isSliding: boolean;
  slideTarget: number | null;
};

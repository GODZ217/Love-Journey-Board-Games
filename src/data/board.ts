import { SnakeOrLadder, TileType } from "@/types";

export const BOARD_SIZE = 100;
export const TILES_PER_ROW = 10;
export const TOTAL_ROWS = 10;

export const snakes: SnakeOrLadder[] = [
  { start: 34, end: 16, type: "snake" },
  { start: 55, end: 37, type: "snake" },
  { start: 62, end: 45, type: "snake" },
  { start: 87, end: 68, type: "snake" },
  { start: 98, end: 86, type: "snake" },
];

export const slides: SnakeOrLadder[] = [
  { start: 17, end: 7, type: "slide" },
  { start: 25, end: 10, type: "slide" },
  { start: 43, end: 26, type: "slide" },
  { start: 74, end: 57, type: "slide" },
  { start: 93, end: 78, type: "slide" },
];

const loveTiles = [6, 18, 32, 48, 58, 70, 82, 96];
const funnyTiles = [4, 15, 27, 39, 51, 64, 76, 88];
const deepTiles = [9, 22, 35, 49, 61, 73, 86, 97];
const memoryTiles = [2, 14, 26, 38, 50, 62, 74, 89];
const challengeTiles = [12, 24, 36, 44, 56, 68, 78, 90];
const intimacyTiles = [7, 19, 31, 45, 59, 71, 84, 94];
const quizTiles = [5, 13, 29, 41, 54, 66, 79, 92];

export const getTileType = (number: number): TileType => {
  if (loveTiles.includes(number)) return "love";
  if (funnyTiles.includes(number)) return "funny";
  if (deepTiles.includes(number)) return "deep";
  if (memoryTiles.includes(number)) return "memory";
  if (challengeTiles.includes(number)) return "challenge";
  if (intimacyTiles.includes(number)) return "intimacy";
  if (quizTiles.includes(number)) return "quiz";
  return "normal";
};

export const getQuestionCategory = (tileType: TileType): string => {
  switch (tileType) {
    case "love":
    case "intimacy":
      return "intimacy";
    case "funny":
      return "funny";
    case "deep":
      return "deep";
    case "memory":
      return "memory";
    case "challenge":
      return "challenge";
    case "quiz":
      return "knowing";
    default:
      return "knowing";
  }
};

export const getTilePosition = (tileNumber: number): { row: number; col: number } => {
  const row = Math.floor((tileNumber - 1) / TILES_PER_ROW);
  const isEvenRow = row % 2 === 0;
  const col = isEvenRow
    ? (tileNumber - 1) % TILES_PER_ROW
    : TILES_PER_ROW - 1 - ((tileNumber - 1) % TILES_PER_ROW);
  return { row, col };
};

export const getSnakeOrLadder = (
  position: number
): SnakeOrLadder | undefined => {
  return [...snakes, ...slides].find((s) => s.start === position);
};

export const isSlide = (position: number): boolean => {
  return slides.some((s) => s.start === position);
};

export const getNextPosition = (current: number, dice: number): number => {
  const next = current + dice;
  return next > BOARD_SIZE ? current : next;
};

import { Tile, TileType, SnakeOrLadder } from "@/types";
import { BOARD_SIZE, TILES_PER_ROW, getTileType, ladders, snakes } from "@/data/board";

export const createBoard = (): Tile[] => {
  const tiles: Tile[] = [];

  for (let i = 1; i <= BOARD_SIZE; i++) {
    const row = Math.floor((i - 1) / TILES_PER_ROW);
    const isEvenRow = row % 2 === 0;
    const col = isEvenRow
      ? (i - 1) % TILES_PER_ROW
      : TILES_PER_ROW - 1 - ((i - 1) % TILES_PER_ROW);

    const type = getTileType(i);

    tiles.push({
      id: i,
      number: i,
      type,
      x: col,
      y: row,
      hasSnake: snakes.find((s) => s.start === i)
        ? { end: snakes.find((s) => s.start === i)!.end }
        : undefined,
      hasLadder: ladders.find((l) => l.start === i)
        ? { end: ladders.find((l) => l.start === i)!.end }
        : undefined,
    });
  }

  return tiles;
};

export const getTileColor = (type: TileType): string => {
  switch (type) {
    case "normal":
      return "from-dark-50 to-dark-200 border-dark-400";
    case "love":
      return "from-pink-900/80 to-rose-900/80 border-pink-500/50 shadow-pink-500/20";
    case "funny":
      return "from-yellow-900/80 to-amber-900/80 border-yellow-500/50 shadow-yellow-500/20";
    case "deep":
      return "from-purple-900/80 to-violet-900/80 border-purple-500/50 shadow-purple-500/20";
    case "memory":
      return "from-blue-900/80 to-cyan-900/80 border-blue-500/50 shadow-blue-500/20";
    case "challenge":
      return "from-orange-900/80 to-red-900/80 border-orange-500/50 shadow-orange-500/20";
    case "intimacy":
      return "from-fuchsia-900/80 to-pink-900/80 border-fuchsia-500/50 shadow-fuchsia-500/20";
    case "quiz":
      return "from-teal-900/80 to-emerald-900/80 border-teal-500/50 shadow-teal-500/20";
  }
};

export const getTileIcon = (type: TileType): string => {
  switch (type) {
    case "love":
      return "❤️";
    case "funny":
      return "😂";
    case "deep":
      return "💭";
    case "memory":
      return "📸";
    case "challenge":
      return "🎯";
    case "intimacy":
      return "🔥";
    case "quiz":
      return "💑";
    default:
      return "";
  }
};

export const getTileLabel = (type: TileType): string => {
  switch (type) {
    case "love":
      return "Love";
    case "funny":
      return "Funny";
    case "deep":
      return "Deep";
    case "memory":
      return "Memory";
    case "challenge":
      return "Challenge";
    case "intimacy":
      return "Intimacy";
    case "quiz":
      return "Quiz";
    default:
      return "";
  }
};

export const generatePlayerId = (): string => {
  return `player_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

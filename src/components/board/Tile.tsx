"use client";

import { motion } from "framer-motion";
import { Tile as TileType } from "@/types";
import { getTileColor, getTileIcon, getTileLabel } from "@/utils/board";
import { ladders, snakes, isSlide } from "@/data/board";

interface TileProps {
  tile: TileType;
  size: number;
  hasPlayer?: boolean;
  isPlayerActive?: boolean;
  playerIndex?: number;
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function Tile({ tile, size, onClick, children }: TileProps) {
  const ladder = ladders.find((l) => l.start === tile.number);
  const snake = snakes.find((s) => s.start === tile.number);
  const isSpecial = tile.type !== "normal";
  const isStart = tile.number === 1;
  const isEnd = tile.number === 100;

  return (
    <motion.button
      onClick={onClick}
      whileHover={isSpecial ? { scale: 1.05 } : undefined}
      whileTap={isSpecial ? { scale: 0.95 } : undefined}
      layout
      className={`
        relative rounded-lg border
        flex flex-col items-center justify-center
        transition-all duration-200
        ${isStart ? "bg-gradient-to-br from-emerald-500/30 to-green-500/30 border-emerald-400/50" : ""}
        ${isEnd ? "bg-gradient-to-br from-yellow-500/30 to-amber-500/30 border-yellow-400/50" : ""}
        ${!isStart && !isEnd ? getTileColor(tile.type) : ""}
        ${isSpecial ? "cursor-pointer" : ""}
        overflow-hidden
      `}
      style={{ width: size, height: size }}
    >
      {/* Special tile glow */}
      {isSpecial && (
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"
        />
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        {/* Number */}
        <span className={`text-[8px] sm:text-[10px] font-bold ${isStart || isEnd ? "text-white" : "text-white/50"}`}>
          {tile.number}
        </span>

        {/* Special tile icon */}
        {isSpecial && (
          <span className="text-xs sm:text-sm">{getTileIcon(tile.type)}</span>
        )}
      </div>

      {/* Snake/Ladder/Slide indicator */}
      {ladder && (
        <motion.span
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute -top-1 right-0 text-[10px] z-10"
        >
          🪜
        </motion.span>
      )}
      {snake && (
        <motion.span
          animate={{ y: [0, 2, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute -bottom-1 right-0 text-[10px] z-10"
        >
          🐍
        </motion.span>
      )}
      {isSlide(tile.number) && (
        <motion.span
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute -bottom-1 right-0 text-[10px] z-10"
        >
          🌈
        </motion.span>
      )}

      {/* Character overlays */}
      {children}

      {/* Start/End label */}
      {isStart && (
        <span className="text-[6px] sm:text-[8px] text-emerald-300 font-bold absolute bottom-0.5 z-10">START</span>
      )}
      {isEnd && (
        <span className="text-[6px] sm:text-[8px] text-yellow-300 font-bold absolute bottom-0.5 z-10">FINISH</span>
      )}
    </motion.button>
  );
}

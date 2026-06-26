"use client";

import { motion } from "framer-motion";
import { Tile as TileType } from "@/types";
import { getTileColor, getTileIcon } from "@/utils/board";
import { ladders, snakes, isSlide } from "@/data/board";

interface TileProps {
  tile: TileType;
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function Tile({ tile, onClick, children }: TileProps) {
  const ladder = ladders.find((l) => l.start === tile.number);
  const snake = snakes.find((s) => s.start === tile.number);
  const slide = isSlide(tile.number);
  const isSpecial = tile.type !== "normal";
  const isStart = tile.number === 1;
  const isEnd = tile.number === 100;

  return (
    <motion.button
      onClick={onClick}
      whileHover={isSpecial ? { scale: 1.08 } : { scale: 1.03 }}
      whileTap={isSpecial ? { scale: 0.92 } : undefined}
      layout
      className={`
        relative w-full h-full rounded-lg border
        flex flex-col items-center justify-center
        transition-all duration-200
        ${isStart ? "bg-gradient-to-br from-emerald-500/40 to-green-500/40 border-emerald-400/60 shadow-lg shadow-emerald-500/20" : ""}
        ${isEnd ? "bg-gradient-to-br from-yellow-500/40 to-amber-500/40 border-yellow-400/60 shadow-lg shadow-yellow-500/20" : ""}
        ${!isStart && !isEnd ? getTileColor(tile.type) : ""}
        ${isSpecial ? "cursor-pointer" : "cursor-default"}
        overflow-visible
      `}
      style={{ boxShadow: isSpecial ? "inset 0 1px 0 rgba(255,255,255,0.1)" : "" }}
    >
      {/* Special tile glow */}
      {isSpecial && (
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/5 to-transparent"
        />
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        {/* Number */}
        <span
          className={`font-bold select-none ${
            isStart || isEnd
              ? "text-white text-[7px] sm:text-[9px]"
              : "text-white/40 text-[6px] sm:text-[8px]"
          }`}
        >
          {tile.number}
        </span>

        {/* Special tile icon */}
        {isSpecial && (
          <span className="text-[9px] sm:text-xs leading-none mt-[1px]">
            {getTileIcon(tile.type)}
          </span>
        )}
      </div>

      {/* Snake/Ladder/Slide indicator */}
      {ladder && (
        <motion.span
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute -top-[6px] -right-[6px] text-[8px] sm:text-[10px] z-20 drop-shadow-lg"
        >
          🪜
        </motion.span>
      )}
      {snake && (
        <motion.span
          animate={{ y: [0, 2, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute -bottom-[6px] -right-[6px] text-[8px] sm:text-[10px] z-20 drop-shadow-lg"
        >
          🐍
        </motion.span>
      )}
      {slide && (
        <motion.span
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute -top-[6px] -left-[6px] text-[8px] sm:text-[10px] z-20 drop-shadow-lg"
        >
          🌈
        </motion.span>
      )}

      {/* Player tokens */}
      {children}

      {/* Start/End label */}
      {isStart && (
        <span className="text-[5px] sm:text-[7px] text-emerald-300 font-bold absolute bottom-0 z-10 leading-none">
          START
        </span>
      )}
      {isEnd && (
        <span className="text-[5px] sm:text-[7px] text-yellow-300 font-bold absolute bottom-0 z-10 leading-none">
          FINISH
        </span>
      )}
    </motion.button>
  );
}

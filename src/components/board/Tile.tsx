"use client";

import { motion } from "framer-motion";
import { Tile as TileType } from "@/types";
import { getTileColor, getTileIcon } from "@/utils/board";
import { snakes, isSlide } from "@/data/board";

interface TileProps {
  tile: TileType;
  onClick?: () => void;
  children?: React.ReactNode;
  highlighted?: boolean;
}

export default function Tile({ tile, onClick, children, highlighted }: TileProps) {
  const snake = snakes.find((s) => s.start === tile.number);
  const slide = isSlide(tile.number);
  const isSpecial = tile.type !== "normal";
  const isStart = tile.number === 1;
  const isEnd = tile.number === 100;

  return (
    <motion.button
      onClick={onClick}
      whileHover={isSpecial ? { scale: 1.06 } : undefined}
      whileTap={isSpecial ? { scale: 0.94 } : undefined}
      layout
      className={`
        relative w-full h-full rounded-lg border
        flex flex-col items-center justify-center
        transition-all duration-200
        ${isStart ? "bg-gradient-to-br from-emerald-500/40 to-green-500/40 border-emerald-400/60 shadow-lg shadow-emerald-500/20" : ""}
        ${isEnd ? "bg-gradient-to-br from-yellow-500/40 to-amber-500/40 border-yellow-400/60 shadow-lg shadow-yellow-500/20" : ""}
        ${!isStart && !isEnd ? getTileColor(tile.type) : ""}
        ${isSpecial ? "cursor-pointer" : "cursor-default"}
        ${highlighted ? "ring-[1.5px] ring-white/40 shadow-lg shadow-white/10" : ""}
      `}
      style={{ boxShadow: isSpecial && !highlighted ? "inset 0 1px 0 rgba(255,255,255,0.08)" : highlighted ? "0 0 12px rgba(255,255,255,0.15)" : "" }}
    >
      {isSpecial && (
        <motion.div
          animate={{ opacity: [0.15, 0.4, 0.15] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/5 to-transparent"
        />
      )}

      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        <span className={`font-bold select-none ${
          isStart || isEnd ? "text-white text-[7px] sm:text-[9px]" : "text-white/40 text-[6px] sm:text-[8px]"
        }`}>
          {tile.number}
        </span>
        {isSpecial && (
          <span className="text-[9px] sm:text-xs leading-none mt-[1px]">{getTileIcon(tile.type)}</span>
        )}
      </div>

      {snake && (
        <motion.span
          animate={{ y: [0, 2, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute -bottom-[5px] -right-[5px] text-[8px] sm:text-[10px] z-20 drop-shadow-lg"
        >
          🐍
        </motion.span>
      )}
      {slide && (
        <motion.span
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute -top-[5px] -left-[5px] text-[8px] sm:text-[10px] z-20 drop-shadow-lg"
        >
          🌈
        </motion.span>
      )}

      {children}

      {isStart && (
        <span className="text-[5px] sm:text-[7px] text-emerald-300 font-bold absolute bottom-0 z-10 leading-none">START</span>
      )}
      {isEnd && (
        <span className="text-[5px] sm:text-[7px] text-yellow-300 font-bold absolute bottom-0 z-10 leading-none">FINISH</span>
      )}
    </motion.button>
  );
}

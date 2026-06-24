"use client";

import { motion } from "framer-motion";
import { Tile as TileType, Player } from "@/types";
import { getTileColor, getTileIcon, getTileLabel } from "@/utils/board";
import { ladders, snakes } from "@/data/board";

interface TileProps {
  tile: TileType;
  players: Player[];
  size: number;
  onClick?: () => void;
}

export default function Tile({ tile, players, size, onClick }: TileProps) {
  const playersHere = players.filter((p) => p.position === tile.number);
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
      style={{
        width: size,
        height: size,
      }}
    >
      {/* Special tile glow */}
      {isSpecial && (
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"
        />
      )}

      {/* Number */}
      <span className={`text-[8px] sm:text-[10px] font-bold ${isStart || isEnd ? "text-white" : "text-white/50"}`}>
        {tile.number}
      </span>

      {/* Special tile icon */}
      {isSpecial && (
        <span className="text-xs sm:text-sm">{getTileIcon(tile.type)}</span>
      )}

      {/* Snake/Ladder indicator */}
      {ladder && (
        <motion.span
          animate={{ y: [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute -top-1 right-0 text-[8px]"
        >
          🪜
        </motion.span>
      )}
      {snake && (
        <motion.span
          animate={{ y: [0, 2, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute -bottom-1 right-0 text-[8px]"
        >
          🐍
        </motion.span>
      )}

      {/* Players on tile */}
      {playersHere.length > 0 && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
          {playersHere.map((p) => (
            <motion.div
              key={p.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-white/50 flex items-center justify-center text-[6px] sm:text-[8px] ${
                p.id === players[0].id
                  ? "bg-primary-500"
                  : "bg-secondary-500"
              }`}
            >
              {p.id === players[0].id ? "P1" : "P2"}
            </motion.div>
          ))}
        </div>
      )}

      {/* Start/End label */}
      {isStart && (
        <span className="text-[6px] sm:text-[8px] text-emerald-300 font-bold absolute top-0.5">START</span>
      )}
      {isEnd && (
        <span className="text-[6px] sm:text-[8px] text-yellow-300 font-bold absolute top-0.5">FINISH</span>
      )}
    </motion.button>
  );
}

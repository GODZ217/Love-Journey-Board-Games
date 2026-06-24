"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Tile from "./Tile";
import { useGameStore } from "@/store/gameStore";
import { createBoard } from "@/utils/board";
import { TILES_PER_ROW } from "@/data/board";

export default function Board() {
  const players = useGameStore((s) => s.players);
  const tiles = useMemo(() => createBoard(), []);
  const boardAnimation = useGameStore((s) => s.boardAnimation);

  const rows: typeof tiles[] = [];
  for (let i = 0; i < tiles.length; i += TILES_PER_ROW) {
    rows.push(tiles.slice(i, i + TILES_PER_ROW).reverse());
  }
  rows.reverse();

  const tileSize = Math.floor((typeof window !== "undefined" ? Math.min(window.innerWidth - 32, 500) : 400) / TILES_PER_ROW);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-2 sm:p-4 rounded-2xl bg-gradient-to-br from-dark/80 via-dark-50/80 to-dark/80 backdrop-blur-xl border border-white/10 shadow-2xl"
    >
      <div className="flex flex-col gap-0.5 sm:gap-1">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex gap-0.5 sm:gap-1"
            style={{ justifyContent: rowIndex % 2 === 0 ? "flex-start" : "flex-end" }}
          >
            {row.map((tile) => (
              <Tile
                key={tile.id}
                tile={tile}
                players={players}
                size={tileSize}
              />
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

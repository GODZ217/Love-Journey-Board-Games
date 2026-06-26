"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Tile from "./Tile";
import BoardCharacter from "../characters/BoardCharacter";
import { useGameStore } from "@/store/gameStore";
import { createBoard } from "@/utils/board";
import { TILES_PER_ROW } from "@/data/board";

export default function Board() {
  const players = useGameStore((s) => s.players);
  const currentPlayerIndex = useGameStore((s) => s.currentPlayerIndex);
  const boardAnimation = useGameStore((s) => s.boardAnimation);
  const tiles = useMemo(() => createBoard(), []);

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
            {row.map((tile) => {
              const playersOnTile = players.filter((p) => p.position === tile.number);

              return (
                <Tile key={tile.id} tile={tile} size={tileSize}>
                  {playersOnTile.length > 0 && (
                    <div className="absolute inset-0 z-20 pointer-events-none">
                      {playersOnTile.map((p, i) => {
                        const isActive = p.id === players[currentPlayerIndex]?.id;
                        const offsetX = playersOnTile.length > 1 && i === 1 ? 8 : 0;
                        const offsetY = playersOnTile.length > 1 && i === 1 ? -4 : 0;
                        return (
                          <div
                            key={p.id}
                            className="absolute"
                            style={{
                              bottom: "-12px",
                              left: "50%",
                              transform: `translateX(calc(-50% + ${offsetX}px)) translateY(${offsetY}px)`,
                            }}
                          >
                            <BoardCharacter
                              characterId={p.characterId}
                              playerName={p.name}
                              position={p.position}
                              isActive={isActive}
                              playerIndex={players.indexOf(p)}
                              isMoving={boardAnimation && isActive}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Tile>
              );
            })}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

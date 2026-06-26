"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Tile from "./Tile";
import SnakeLadderLayer from "./SnakeLadderLayer";
import BoardCharacter from "../characters/BoardCharacter";
import { useGameStore } from "@/store/gameStore";
import { createBoard } from "@/utils/board";
import { getTilePosition } from "@/data/board";
import { Player } from "@/types";

export default function Board() {
  const players = useGameStore((s) => s.players);
  const currentPlayerIndex = useGameStore((s) => s.currentPlayerIndex);
  const boardAnimation = useGameStore((s) => s.boardAnimation);
  const tiles = useMemo(() => createBoard(), []);

  const playersByPosition = useMemo(() => {
    const map = new Map<number, Player[]>();
    players.forEach((p) => {
      const existing = map.get(p.position) || [];
      existing.push(p);
      map.set(p.position, existing);
    });
    return map;
  }, [players]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-full rounded-2xl bg-gradient-to-br from-dark/80 via-dark-50/80 to-dark/80 backdrop-blur-xl border border-white/10 shadow-2xl p-[2px] sm:p-1"
    >
      <div className="relative w-full h-full">
        <SnakeLadderLayer />

        <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 gap-[1px]" style={{ zIndex: 2 }}>
          {tiles.map((tile) => {
            const pos = getTilePosition(tile.number);
            const tilePlayers = playersByPosition.get(tile.number) || [];

            return (
              <div
                key={tile.id}
                className="relative"
                style={{
                  gridRow: 10 - pos.row,
                  gridColumn: pos.col + 1,
                }}
              >
                <Tile tile={tile}>
                  {tilePlayers.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-[1px] pb-[1px]">
                      {tilePlayers.map((p, i) => {
                        const isActive = p.id === players[currentPlayerIndex]?.id;
                        return (
                          <div
                            key={p.id}
                            className={`flex flex-col items-center ${
                              tilePlayers.length === 2 && i === 0 ? "-ml-1 sm:-ml-2" : ""
                            } ${tilePlayers.length === 2 && i === 1 ? "-mr-1 sm:-mr-2" : ""}`}
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
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

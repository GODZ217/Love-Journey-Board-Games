"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Tile from "./Tile";
import SnakeLadderLayer from "./SnakeLadderLayer";
import BoardCharacter from "../characters/BoardCharacter";
import { useGameStore } from "@/store/gameStore";
import { createBoard } from "@/utils/board";
import { getTilePosition } from "@/data/board";

function getPct(tileNumber: number) {
  const pos = getTilePosition(tileNumber);
  return {
    left: `${(pos.col + 0.5) * 10}%`,
    top: `${(9 - pos.row + 0.5) * 10}%`,
  };
}

function computeSlidePath(from: number, to: number) {
  const f = getTilePosition(from);
  const t = getTilePosition(to);
  const sx = (f.col + 0.5) * 10;
  const sy = (9 - f.row + 0.5) * 10;
  const ex = (t.col + 0.5) * 10;
  const ey = (9 - t.row + 0.5) * 10;
  const dx = ex - sx;
  const dy = ey - sy;

  const cp1x = sx + dx * 0.25 + dy * 0.15;
  const cp1y = sy + dy * 0.25 - dx * 0.15;
  const cp2x = sx + dx * 0.75 - dy * 0.15;
  const cp2y = sy + dy * 0.75 + dx * 0.15;

  const steps = 12;
  const lefts: string[] = [];
  const tops: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const mt = 1 - t;
    const x = mt * mt * mt * sx + 3 * mt * mt * t * cp1x + 3 * mt * t * t * cp2x + t * t * t * ex;
    const y = mt * mt * mt * sy + 3 * mt * mt * t * cp1y + 3 * mt * t * t * cp2y + t * t * t * ey;
    lefts.push(`${x}%`);
    tops.push(`${y}%`);
  }
  return { lefts, tops };
}

export default function Board() {
  const players = useGameStore((s) => s.players);
  const currentPlayerIndex = useGameStore((s) => s.currentPlayerIndex);
  const boardAnimation = useGameStore((s) => s.boardAnimation);
  const isMoving = useGameStore((s) => s.isMoving);
  const isSliding = useGameStore((s) => s.isSliding);
  const slideTarget = useGameStore((s) => s.slideTarget);
  const tiles = useMemo(() => createBoard(), []);

  const slidePath = useMemo(() => {
    if (!isSliding || slideTarget === null) return null;
    const p = players[currentPlayerIndex];
    if (!p) return null;
    return computeSlidePath(p.position, slideTarget);
  }, [isSliding, slideTarget, players, currentPlayerIndex]);

  const playerTiles = useMemo(() => {
    const set = new Set<number>();
    players.forEach((p) => set.add(p.position));
    return set;
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
            return (
              <div
                key={tile.id}
                className="relative"
                style={{
                  gridRow: 10 - pos.row,
                  gridColumn: pos.col + 1,
                }}
              >
                <Tile tile={tile} highlighted={playerTiles.has(tile.number)} />
              </div>
            );
          })}
        </div>

        {/* Player overlay */}
        <div className="absolute inset-0 z-[3] pointer-events-none" style={{ zIndex: 3 }}>
          {players.map((player, index) => {
            const isCurrent = index === currentPlayerIndex;
            const isSlidingPlayer = isSliding && isCurrent && slidePath;

            if (isSlidingPlayer) {
              return (
                <motion.div
                  key={player.id}
                  className="absolute"
                  animate={{
                    left: slidePath!.lefts,
                    top: slidePath!.tops,
                    x: "-50%",
                    y: "-50%",
                  }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <BoardCharacter
                    characterId={player.characterId}
                    playerName={player.name}
                    position={player.position}
                    isActive={isCurrent}
                    playerIndex={index}
                    isMoving={false}
                  />
                </motion.div>
              );
            }

            const pct = getPct(player.position);

            return (
              <motion.div
                key={player.id}
                className="absolute"
                animate={{
                  left: pct.left,
                  top: pct.top,
                  x: "-50%",
                  y: "-50%",
                }}
                transition={{
                  duration: 0.2,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
              >
                <BoardCharacter
                  characterId={player.characterId}
                  playerName={player.name}
                  position={player.position}
                  isActive={isCurrent}
                  playerIndex={index}
                  isMoving={isMoving && isCurrent}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

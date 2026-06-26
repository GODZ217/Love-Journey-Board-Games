"use client";

import { motion, AnimatePresence } from "framer-motion";
import AnimatedCharacter, { CharEmotion } from "./AnimatedCharacter";
import { Character } from "@/types";
import { getCharacterById } from "@/data/characters";

interface BoardCharacterProps {
  characterId: string;
  playerName: string;
  position: number;
  isActive: boolean;
  playerIndex: number;
  isMoving: boolean;
}

export default function BoardCharacter({
  characterId,
  playerName,
  position,
  isActive,
  playerIndex,
  isMoving,
}: BoardCharacterProps) {
  const character = getCharacterById(characterId);
  if (!character) return null;

  const emotion: CharEmotion = isMoving ? "walking" : isActive ? "happy" : "idle";

  return (
    <motion.div
      layout
      className="absolute z-20 flex flex-col items-center pointer-events-none"
      style={{
        bottom: "100%",
        left: "50%",
        transform: "translateX(-50%)",
      }}
      animate={isActive ? { scale: 1.1 } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <AnimatedCharacter
        character={character}
        emotion={emotion}
        size={36}
        isMoving={isMoving}
      />
      <div
        className={`
          mt-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-bold whitespace-nowrap
          ${playerIndex === 0
            ? "bg-primary-500/80 text-white"
            : "bg-secondary-500/80 text-white"
          }
          border border-white/20
        `}
      >
        {playerName}
      </div>
    </motion.div>
  );
}

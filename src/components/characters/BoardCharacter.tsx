"use client";

import { motion } from "framer-motion";
import AnimatedCharacter, { CharEmotion } from "./AnimatedCharacter";
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
      className="relative flex flex-col items-center"
      animate={
        isMoving
          ? { y: [0, -8, 0], scale: [1, 1.1, 1] }
          : isActive
          ? { y: [0, -3, 0] }
          : { y: 0 }
      }
      transition={{
        duration: isMoving ? 0.4 : 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {/* Active glow ring */}
      {isActive && (
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary-500/30 to-secondary-500/30 blur-sm"
        />
      )}

      {/* Character */}
      <div className="relative" style={{ filter: isActive ? "brightness(1.2)" : "brightness(0.9)" }}>
        <AnimatedCharacter
          character={character}
          emotion={emotion}
          size={52}
          isMoving={isMoving}
        />
      </div>

      {/* Name label */}
      <div
        className={`
          mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap border
          ${playerIndex === 0
            ? "bg-primary-600/90 text-white border-primary-400/50"
            : "bg-secondary-600/90 text-white border-secondary-400/50"
          }
          shadow-lg
        `}
      >
        {playerName}
      </div>
    </motion.div>
  );
}

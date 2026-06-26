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
  size?: number;
}

export default function BoardCharacter({
  characterId,
  playerName,
  isActive,
  playerIndex,
  isMoving,
  size = 32,
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
          ? { y: [0, -6, 0], scale: [1, 1.08, 1] }
          : isActive
          ? { y: [0, -2, 0] }
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
          animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.12, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute -inset-[3px] rounded-full bg-gradient-to-r from-primary-500/25 to-secondary-500/25 blur-[2px]"
        />
      )}

      {/* Character */}
      <div className="relative" style={{ filter: isActive ? "brightness(1.15)" : "brightness(0.85)" }}>
        <AnimatedCharacter
          character={character}
          emotion={emotion}
          size={size}
          isMoving={isMoving}
        />
      </div>

      {/* Name label */}
      <div
        className={`
          mt-[1px] px-1.5 py-[1px] rounded-full text-[6px] sm:text-[7px] font-bold whitespace-nowrap border leading-tight
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

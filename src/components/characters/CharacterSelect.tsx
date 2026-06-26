"use client";

import { motion } from "framer-motion";
import { Character } from "@/types";
import AnimatedCharacter from "./AnimatedCharacter";

interface CharacterSelectProps {
  characters: Character[];
  selectedId: string;
  onSelect: (id: string) => void;
  gender: "male" | "female";
}

export default function CharacterSelect({
  characters,
  selectedId,
  onSelect,
  gender,
}: CharacterSelectProps) {
  const filtered = characters.filter((c) => c.gender === gender);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {filtered.map((char, index) => (
        <motion.button
          key={char.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSelect(char.id)}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          className={`
            relative overflow-hidden rounded-2xl p-4
            border-2 transition-all duration-300
            ${
              selectedId === char.id
                ? "border-primary-400 shadow-lg shadow-primary-500/30"
                : "border-white/10 hover:border-white/30"
            }
            bg-gradient-to-br ${char.bgGradient}
          `}
        >
          <div className="flex flex-col items-center gap-2">
            <AnimatedCharacter
              character={char}
              emotion={selectedId === char.id ? "happy" : "idle"}
              size={64}
            />
            <div className="text-center">
              <p className="text-white font-bold text-sm sm:text-base truncate">
                {char.name}
              </p>
              <p className="text-white/60 text-xs">{char.title}</p>
            </div>
            {selectedId === char.id && (
              <motion.div
                layoutId="selected"
                className="absolute inset-0 border-2 border-primary-400 rounded-2xl"
                style={{ boxShadow: "inset 0 0 20px rgba(236, 72, 153, 0.3)" }}
              />
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
}

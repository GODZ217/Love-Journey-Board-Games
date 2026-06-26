"use client";

import { motion } from "framer-motion";
import { Character } from "@/types";

export type CharEmotion = "idle" | "happy" | "embarrassed" | "thinking" | "victory" | "walking";

interface AnimatedCharacterProps {
  character: Character;
  emotion?: CharEmotion;
  size?: number;
  className?: string;
  isMoving?: boolean;
}

function Hair({ style, color }: { style: string; color: string }) {
  switch (style) {
    case "male_short":
      return (
        <g>
          <path d="M22 10 Q18 4 24 2 Q30 0 34 4 Q38 8 36 12" fill={color} />
          <path d="M20 12 Q16 6 22 4 Q28 2 32 6 Q36 10 34 14" fill={color} opacity={0.8} />
        </g>
      );
    case "male_medium":
      return (
        <g>
          <path d="M20 10 Q16 2 24 0 Q32 -2 38 4 Q42 10 38 14 L36 10 Q32 4 26 4 Q20 6 20 10Z" fill={color} />
          <path d="M20 12 Q14 4 22 2 Q30 0 36 6 Q40 12 36 16" fill={color} opacity={0.7} />
        </g>
      );
    case "female_long":
      return (
        <g>
          <path d="M18 10 Q14 0 24 -2 Q34 -4 40 4 Q44 10 40 16 Q36 22 34 30 Q32 36 30 40" fill={color} stroke={color} strokeWidth="2" />
          <path d="M18 10 Q14 2 22 0 Q30 -2 36 6 Q40 12 36 18 Q32 24 30 32 Q28 38 26 42" fill={color} opacity={0.8} />
          <path d="M20 12 Q16 4 24 2 Q34 0 38 8 Q42 14 38 20" fill={color} opacity={0.6} />
        </g>
      );
    case "female_ponytail":
      return (
        <g>
          <path d="M18 10 Q14 2 22 0 Q30 -2 38 6 Q42 12 38 16" fill={color} />
          <path d="M28 -2 Q32 -8 36 -4 Q40 0 36 6" fill={color} />
          <path d="M20 12 Q16 4 24 2 Q32 0 36 8" fill={color} opacity={0.7} />
        </g>
      );
    case "female_twintail":
      return (
        <g>
          <path d="M18 10 Q14 2 22 0 Q30 -2 38 6 Q42 12 38 16" fill={color} />
          <path d="M16 4 Q10 -6 8 -2 Q6 2 14 8" fill={color} transform="rotate(-15 12 2)" />
          <path d="M40 6 Q46 -4 48 0 Q50 4 42 10" fill={color} transform="rotate(15 44 2)" />
          <path d="M16 6 Q12 -4 10 0 Q8 4 14 8" fill={color} opacity={0.7} />
          <path d="M40 8 Q44 -2 46 2 Q48 6 42 10" fill={color} opacity={0.7} />
        </g>
      );
    case "female_ponytail":
      return (
        <g>
          <path d="M18 10 Q14 2 22 0 Q30 -2 38 6 Q42 12 38 16" fill={color} />
          <ellipse cx="34" cy="-4" rx="6" ry="8" fill={color} />
          <path d="M32 -6 Q34 -12 36 -6" fill={color} />
          <path d="M20 12 Q16 4 24 2 Q32 0 36 8" fill={color} opacity={0.7} />
        </g>
      );
    default:
      return null;
  }
}

function Eyes({ color, emotion }: { color: string; emotion: CharEmotion }) {
  const isHappy = emotion === "happy" || emotion === "victory";
  const isEmbarrassed = emotion === "embarrassed";
  const isThinking = emotion === "thinking";

  if (isHappy) {
    return (
      <g>
        <path d="M26 14 Q28 12 30 14" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M34 14 Q36 12 38 14" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>
    );
  }

  if (isEmbarrassed) {
    return (
      <g>
        <ellipse cx="28" cy="13" rx="2.5" ry="3" fill="#333" />
        <ellipse cx="36" cy="13" rx="2.5" ry="3" fill="#333" />
        <path d="M24 15 Q28 18 32 15" stroke="#ff8a80" strokeWidth="1" fill="none" />
        <path d="M32 15 Q36 18 40 15" stroke="#ff8a80" strokeWidth="1" fill="none" />
        <ellipse cx="28" cy="13" rx="1" ry="1.5" fill="white" />
        <ellipse cx="36" cy="13" rx="1" ry="1.5" fill="white" />
      </g>
    );
  }

  if (isThinking) {
    return (
      <g>
        <ellipse cx="27" cy="13" rx="2.5" ry="3" fill="#333" />
        <ellipse cx="35" cy="13" rx="2.5" ry="3" fill="#333" />
        <ellipse cx="27" cy="13" rx="1" ry="1.5" fill="white" />
        <ellipse cx="35" cy="13" rx="1" ry="1.5" fill="white" />
        <circle cx="40" cy="8" r="2" fill="none" stroke="#333" strokeWidth="1" />
        <circle cx="43" cy="5" r="1.5" fill="none" stroke="#333" strokeWidth="1" />
      </g>
    );
  }

  return (
    <g>
      <ellipse cx="28" cy="13" rx="3" ry="3.5" fill="#333" />
      <ellipse cx="36" cy="13" rx="3" ry="3.5" fill="#333" />
      <ellipse cx="28" cy="13" rx="1.2" ry="1.8" fill="white" />
      <ellipse cx="36" cy="13" rx="1.2" ry="1.8" fill="white" />
      <ellipse cx="29" cy="12" rx="0.5" ry="0.8" fill={color} />
      <ellipse cx="37" cy="12" rx="0.5" ry="0.8" fill={color} />
    </g>
  );
}

function Mouth({ emotion }: { emotion: CharEmotion }) {
  switch (emotion) {
    case "happy":
    case "victory":
      return <path d="M26 18 Q30 22 34 18" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />;
    case "embarrassed":
      return <path d="M27 18 Q30 20 33 18" stroke="#333" strokeWidth="1" fill="none" strokeLinecap="round" />;
    case "thinking":
      return <circle cx="30" cy="18" r="1.5" fill="#333" />;
    case "walking":
    case "idle":
    default:
      return <path d="M27 18 Q30 20 33 18" stroke="#333" strokeWidth="1.2" fill="none" strokeLinecap="round" />;
  }
}

function Accessory({ type, color }: { type: string; color: string }) {
  switch (type) {
    case "glasses":
      return (
        <g>
          <ellipse cx="28" cy="13" rx="4.5" ry="4" fill="none" stroke={color} strokeWidth="0.8" />
          <ellipse cx="36" cy="13" rx="4.5" ry="4" fill="none" stroke={color} strokeWidth="0.8" />
          <line x1="32.5" y1="12" x2="31.5" y2="12" stroke={color} strokeWidth="0.8" />
        </g>
      );
    case "hat":
      return (
        <g>
          <ellipse cx="30" cy="4" rx="12" ry="3" fill="#5d4037" />
          <rect x="24" y="0" width="12" height="5" rx="2" fill="#5d4037" />
          <rect x="25" y="1" width="10" height="2" rx="1" fill="#795548" />
        </g>
      );
    case "ribbon":
      return (
        <g>
          <path d="M24 4 Q28 0 30 2 Q32 0 36 4" stroke={color} strokeWidth="2" fill="none" />
          <path d="M24 4 Q22 6 24 8" stroke={color} strokeWidth="1.5" fill="none" />
          <path d="M36 4 Q38 6 36 8" stroke={color} strokeWidth="1.5" fill="none" />
        </g>
      );
    case "earring":
      return (
        <g>
          <circle cx="22" cy="14" r="1.5" fill={color} />
          <circle cx="38" cy="14" r="1.5" fill={color} />
        </g>
      );
    default:
      return null;
  }
}

function Blush({ emotion }: { emotion: CharEmotion }) {
  if (emotion === "embarrassed" || emotion === "happy") {
    return (
      <g>
        <ellipse cx="22" cy="16" rx="3" ry="2" fill="#ff8a80" opacity="0.4" />
        <ellipse cx="38" cy="16" rx="3" ry="2" fill="#ff8a80" opacity="0.4" />
      </g>
    );
  }
  return null;
}

export default function AnimatedCharacter({
  character,
  emotion = "idle",
  size = 60,
  className = "",
  isMoving = false,
}: AnimatedCharacterProps) {
  const s = size / 60;
  const { style: cs } = character;

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      animate={
        isMoving || emotion === "walking"
          ? { y: [0, -4, 0] }
          : emotion === "happy" || emotion === "victory"
          ? { scale: [1, 1.1, 1] }
          : emotion === "thinking"
          ? { rotate: [0, -5, 0, 5, 0] }
          : { y: [0, -1, 0] }
      }
      transition={{
        duration: isMoving || emotion === "walking" ? 0.4 : 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shadow */}
        <ellipse cx="30" cy="52" rx="12" ry="2" fill="rgba(0,0,0,0.15)" />

        {/* Legs */}
        <g>
          {isMoving || emotion === "walking" ? (
            <>
              <motion.rect
                x="23" y="44" width="4" height="6" rx="2" fill={cs.outfitColor}
                animate={{ x: [0, 2, 0], rotate: [0, -5, 0] }}
                transition={{ duration: 0.4, repeat: Infinity }}
              />
              <motion.rect
                x="33" y="44" width="4" height="6" rx="2" fill={cs.outfitColor}
                animate={{ x: [0, -2, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 0.4, repeat: Infinity }}
              />
            </>
          ) : (
            <>
              <rect x="24" y="44" width="4" height="6" rx="2" fill={cs.outfitColor} />
              <rect x="32" y="44" width="4" height="6" rx="2" fill={cs.outfitColor} />
            </>
          )}
        </g>

        {/* Body */}
        <rect x="21" y="30" width="18" height="16" rx="5" fill={cs.outfitColor} />

        {/* Body accent */}
        <rect x="24" y="33" width="12" height="4" rx="2" fill={cs.accentColor} opacity="0.5" />

        {/* Arms */}
        <g>
          {isMoving || emotion === "walking" ? (
            <>
              <motion.rect
                x="15" y="32" width="5" height="10" rx="2.5" fill={cs.skinTone}
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 0.4, repeat: Infinity }}
              />
              <motion.rect
                x="40" y="32" width="5" height="10" rx="2.5" fill={cs.skinTone}
                animate={{ rotate: [0, -10, 0] }}
                transition={{ duration: 0.4, repeat: Infinity }}
              />
            </>
          ) : emotion === "happy" || emotion === "victory" ? (
            <>
              <rect x="15" y="30" width="5" height="10" rx="2.5" fill={cs.skinTone} transform="rotate(-20 17 35)" />
              <rect x="40" y="30" width="5" height="10" rx="2.5" fill={cs.skinTone} transform="rotate(20 42 35)" />
            </>
          ) : (
            <>
              <rect x="16" y="32" width="5" height="10" rx="2.5" fill={cs.skinTone} />
              <rect x="39" y="32" width="5" height="10" rx="2.5" fill={cs.skinTone} />
            </>
          )}
        </g>

        {/* Neck */}
        <rect x="27" y="28" width="6" height="3" rx="1" fill={cs.skinTone} />

        {/* Head */}
        <ellipse cx="30" cy="15" rx="13" ry="12" fill={cs.skinTone} />

        {/* Hair */}
        <Hair style={cs.hairStyle} color={cs.hairColor} />

        {/* Eyes */}
        <Eyes color={cs.eyeColor} emotion={emotion} />

        {/* Eyebrows */}
        {emotion === "thinking" && (
          <>
            <line x1="24" y1="9" x2="28" y2="10" stroke="#333" strokeWidth="1" strokeLinecap="round" />
            <line x1="36" y1="9" x2="32" y2="10" stroke="#333" strokeWidth="1" strokeLinecap="round" />
          </>
        )}

        {/* Blush */}
        <Blush emotion={emotion} />

        {/* Mouth */}
        <Mouth emotion={emotion} />

        {/* Accessories */}
        <Accessory type={cs.accessory} color={cs.accentColor} />
      </svg>
    </motion.div>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";

interface DiceProps {
  value: number | null;
  isRolling: boolean;
  onRoll: () => void;
  disabled: boolean;
}

const diceDots: Record<number, number[][]> = {
  1: [[1, 1]],
  2: [[0, 2], [2, 0]],
  3: [[0, 2], [1, 1], [2, 0]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
};

const diceFaces = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

export default function Dice({ value, isRolling, onRoll, disabled }: DiceProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <motion.button
        onClick={onRoll}
        disabled={disabled || isRolling}
        whileHover={!disabled && !isRolling ? { scale: 1.1 } : undefined}
        whileTap={!disabled && !isRolling ? { scale: 0.9 } : undefined}
        className={`
          relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl
          bg-gradient-to-br from-white/20 to-white/5
          backdrop-blur-xl border border-white/20
          shadow-2xl shadow-primary-500/20
          flex items-center justify-center
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-300
          ${!disabled && !isRolling ? "hover:shadow-primary-500/40 cursor-pointer" : ""}
        `}
      >
        <AnimatePresence mode="wait">
          {isRolling ? (
            <motion.div
              key="rolling"
              animate={{ rotate: [0, 360, 720], scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-4xl sm:text-5xl"
            >
              🎲
            </motion.div>
          ) : value ? (
            <motion.div
              key={value}
              initial={{ scale: 0, rotateX: -180, opacity: 0 }}
              animate={{ scale: 1, rotateX: 0, opacity: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="relative"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-white/30 to-white/10 rounded-xl p-2 border border-white/10">
                <div className="grid grid-cols-3 grid-rows-3 w-full h-full gap-0.5">
                  {Array.from({ length: 9 }).map((_, i) => {
                    const row = Math.floor(i / 3);
                    const col = i % 3;
                    const hasDot = diceDots[value]?.some(([r, c]) => r === row && c === col);
                    return (
                      <div key={i} className="flex items-center justify-center">
                        {hasDot && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.05, type: "spring" }}
                            className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full shadow-lg shadow-white/30"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-3xl sm:text-4xl text-white/60"
            >
              🎲
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {!isRolling && !value && !disabled && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-white/50 font-medium"
        >
          Tap to roll
        </motion.p>
      )}

      {value && !isRolling && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-bold text-white/80"
        >
          {value} step{value > 1 ? "s" : ""}
        </motion.p>
      )}
    </div>
  );
}

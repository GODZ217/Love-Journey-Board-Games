"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { achievements } from "@/data/achievements";

interface AchievementPopupProps {
  unlockedIds: string[];
  onDismiss: () => void;
}

export default function AchievementPopup({ unlockedIds, onDismiss }: AchievementPopupProps) {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (unlockedIds.length === 0) return;

    const timer = setInterval(() => {
      if (current < unlockedIds.length - 1) {
        setVisible(false);
        setTimeout(() => {
          setCurrent((c) => c + 1);
          setVisible(true);
        }, 300);
      } else {
        clearInterval(timer);
        setTimeout(onDismiss, 3000);
      }
    }, 2500);

    return () => clearInterval(timer);
  }, [unlockedIds, current, onDismiss]);

  if (unlockedIds.length === 0) return null;

  const achievement = achievements.find((a) => a.id === unlockedIds[current]);

  return (
    <AnimatePresence>
      {visible && achievement && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed top-20 right-4 z-[60]"
        >
          <div className="bg-gradient-to-r from-yellow-600/90 to-amber-600/90 backdrop-blur-xl border border-yellow-400/30 rounded-2xl p-4 shadow-2xl shadow-yellow-500/30 max-w-[280px]">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-3xl"
              >
                {achievement.icon}
              </motion.div>
              <div>
                <p className="text-yellow-200 text-xs font-medium uppercase tracking-wider">Achievement Unlocked!</p>
                <p className="text-white font-bold">{achievement.name}</p>
                <p className="text-white/70 text-xs">{achievement.description}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

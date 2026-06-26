"use client";

import { motion } from "framer-motion";
import { Punishment } from "@/types";
import Button from "@/components/ui/Button";
import { useGameStore } from "@/store/gameStore";

export default function PunishmentCard({ punishment }: { punishment: Punishment }) {
  const dismissPunishment = useGameStore((s) => s.dismissPunishment);
  const players = useGameStore((s) => s.players);
  const currentPlayerIndex = useGameStore((s) => s.currentPlayerIndex);

  const player = players[currentPlayerIndex];
  const opponent = players[currentPlayerIndex === 0 ? 1 : 0];

  const typeConfig = {
    funny: { icon: "😂", color: "from-yellow-600 to-amber-600" },
    romantic: { icon: "💕", color: "from-pink-600 to-rose-600" },
    embarrassing: { icon: "😳", color: "from-orange-600 to-red-600" },
    sweet: { icon: "🥰", color: "from-fuchsia-600 to-pink-600" },
  };

  const cfg = typeConfig[punishment.type] || typeConfig.funny;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="w-full max-w-sm"
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/20 shadow-2xl shadow-primary-500/20">
          <div className={`bg-gradient-to-r ${cfg.color} p-6 text-center`}>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-5xl block mb-2"
            >
              🌈
            </motion.span>
            <p className="text-white/80 text-sm font-medium uppercase tracking-wider">
              PEROSOTAN! TURUN KE BAWAH!
            </p>
            <p className="text-white text-lg font-bold mt-1">
              {player.name} kena!
            </p>
          </div>

          <div className="bg-gradient-to-br from-dark-50/95 to-dark/95 backdrop-blur-xl p-6">
            <div className="text-center mb-2">
              <p className="text-white/50 text-xs uppercase tracking-wider font-medium">
                Hukuman: {opponent.name} punya 1 permintaan!
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 rounded-2xl p-4 border border-white/10"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{cfg.icon}</span>
                <p className="text-white text-base font-medium leading-relaxed">
                  {punishment.text}
                </p>
              </div>
            </motion.div>

            <Button
              variant="primary"
              size="lg"
              className="w-full mt-4"
              onClick={dismissPunishment}
              icon="✅"
            >
              Siap! Laksanakan
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

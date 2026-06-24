"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Question, Player } from "@/types";
import Button from "@/components/ui/Button";

interface QuestionCardProps {
  question: Question;
  player: Player;
  onAnswer: (points: number) => void;
}

const categoryConfig: Record<string, { icon: string; label: string; gradient: string; points: number }> = {
  funny: { icon: "😂", label: "Funny", gradient: "from-yellow-600/80 to-amber-600/80", points: 1 },
  deep: { icon: "💭", label: "Deep Talk", gradient: "from-purple-600/80 to-violet-600/80", points: 3 },
  knowing: { icon: "💡", label: "Knowing Each Other", gradient: "from-blue-600/80 to-cyan-600/80", points: 2 },
  memory: { icon: "📸", label: "Memory", gradient: "from-indigo-600/80 to-blue-600/80", points: 2 },
  challenge: { icon: "🎯", label: "Challenge", gradient: "from-orange-600/80 to-red-600/80", points: 2 },
  intimacy: { icon: "🔥", label: "Intimacy", gradient: "from-pink-600/80 to-fuchsia-600/80", points: 3 },
};

export default function QuestionCard({ question, player, onAnswer }: QuestionCardProps) {
  const config = categoryConfig[question.category] || categoryConfig.knowing;
  const text = player.gender === "male" ? question.male : question.female;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => {}} // prevent closing by clicking outside during question
        />

        <motion.div
          className="relative w-full max-w-md"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          {/* Question Card */}
          <div className="relative overflow-hidden rounded-3xl border border-white/20 shadow-2xl shadow-primary-500/20">
            {/* Header gradient */}
            <div className={`bg-gradient-to-r ${config.gradient} p-6 text-center`}>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-4xl mb-2"
              >
                {config.icon}
              </motion.div>
              <p className="text-white/80 text-sm font-medium uppercase tracking-wider">
                {player.name}'s Turn
              </p>
              <p className="text-white text-lg font-bold">{config.label} Question</p>
            </div>

            {/* Question body */}
            <div className="bg-gradient-to-br from-dark-50/95 to-dark/95 backdrop-blur-xl p-6">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-white text-lg sm:text-xl font-medium text-center leading-relaxed min-h-[80px] flex items-center justify-center"
              >
                {text}
              </motion.p>

              <div className="mt-6 space-y-3">
                {question.category === "challenge" ? (
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={() => onAnswer(config.points)}
                    icon="✅"
                  >
                    Done! ({config.points} pts)
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={() => onAnswer(config.points)}
                    icon="💬"
                  >
                    Answer ({config.points} pts)
                  </Button>
                )}
              </div>

              <p className="text-center text-white/30 text-xs mt-4">
                +{config.points} Relationship Points
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

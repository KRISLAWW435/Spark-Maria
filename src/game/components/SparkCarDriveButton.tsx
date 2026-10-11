import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

interface SparkCarDriveButtonProps {
  onClick: () => void;
  disabled?: boolean;
  nudgeActive?: boolean;
  label?: string;
  theme?: 'amber' | 'purple' | 'rose';
}

export const SparkCarDriveButton: React.FC<SparkCarDriveButtonProps> = ({
  onClick,
  disabled = false,
  nudgeActive = false,
  label = 'Поехать к Мари',
  theme = 'amber',
}) => {
  // Theme gradients for the caption pill
  const pillGradient = {
    amber: 'from-amber-400 via-amber-500 to-orange-500 text-slate-950 shadow-amber-500/40 border-amber-300',
    purple: 'from-purple-500 via-indigo-500 to-blue-600 text-white shadow-purple-500/40 border-purple-300/80',
    rose: 'from-rose-500 via-pink-500 to-amber-500 text-white shadow-pink-500/40 border-pink-300/80',
  }[theme];

  // Neon contour pulsation keyframes for each theme
  const neonGlowFrames = {
    amber: [
      'drop-shadow(0 0 6px rgba(251, 191, 36, 0.8)) drop-shadow(0 0 14px rgba(245, 158, 11, 0.6)) drop-shadow(0 0 22px rgba(236, 72, 153, 0.45))',
      'drop-shadow(0 0 12px rgba(251, 191, 36, 1)) drop-shadow(0 0 24px rgba(245, 158, 11, 0.95)) drop-shadow(0 0 38px rgba(236, 72, 153, 0.75))',
      'drop-shadow(0 0 6px rgba(251, 191, 36, 0.8)) drop-shadow(0 0 14px rgba(245, 158, 11, 0.6)) drop-shadow(0 0 22px rgba(236, 72, 153, 0.45))',
    ],
    purple: [
      'drop-shadow(0 0 6px rgba(168, 85, 247, 0.8)) drop-shadow(0 0 14px rgba(129, 140, 248, 0.6)) drop-shadow(0 0 22px rgba(59, 130, 246, 0.45))',
      'drop-shadow(0 0 12px rgba(168, 85, 247, 1)) drop-shadow(0 0 24px rgba(129, 140, 248, 0.95)) drop-shadow(0 0 38px rgba(59, 130, 246, 0.75))',
      'drop-shadow(0 0 6px rgba(168, 85, 247, 0.8)) drop-shadow(0 0 14px rgba(129, 140, 248, 0.6)) drop-shadow(0 0 22px rgba(59, 130, 246, 0.45))',
    ],
    rose: [
      'drop-shadow(0 0 6px rgba(244, 63, 94, 0.8)) drop-shadow(0 0 14px rgba(236, 72, 153, 0.6)) drop-shadow(0 0 22px rgba(251, 191, 36, 0.45))',
      'drop-shadow(0 0 12px rgba(244, 63, 94, 1)) drop-shadow(0 0 24px rgba(236, 72, 153, 0.95)) drop-shadow(0 0 38px rgba(251, 191, 36, 0.75))',
      'drop-shadow(0 0 6px rgba(244, 63, 94, 0.8)) drop-shadow(0 0 14px rgba(236, 72, 153, 0.6)) drop-shadow(0 0 22px rgba(251, 191, 36, 0.45))',
    ],
  }[theme];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group relative flex flex-col items-center justify-center py-2 px-4 rounded-3xl transition-all duration-300 cursor-pointer select-none outline-none active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
        nudgeActive ? 'animate-bounce' : ''
      }`}
      title="Нажми на машинку, чтобы поехать к Мари!"
    >
      {/* Background ambient pulsing neon aura */}
      <motion.div
        animate={{
          scale: [0.95, 1.15, 0.95],
          opacity: [0.35, 0.7, 0.35],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute w-48 sm:w-56 h-24 my-auto bg-gradient-to-r from-amber-400/30 via-pink-500/30 to-indigo-500/30 rounded-full blur-2xl pointer-events-none"
      />

      {/* THE CAR ITSELF AS THE MAIN INTERACTIVE BUTTON */}
      <motion.div
        animate={{
          scale: [1, 1.055, 1],
          y: [0, -5, 0],
          filter: neonGlowFrames,
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative z-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-1"
      >
        <img
          src="/assets/spark_car.webp"
          alt="Машинка Спарка"
          className="w-44 sm:w-52 max-h-24 sm:max-h-28 object-contain cursor-pointer"
          draggable={false}
        />
      </motion.div>

      {/* TEXT DIRECTLY UNDER THE CAR: "Поехать к Мари" */}
      <div className="relative z-10 mt-1 sm:mt-2">
        <div
          className={`px-6 py-2 rounded-full bg-gradient-to-r ${pillGradient} font-black text-sm sm:text-base shadow-xl border-2 flex items-center gap-2 tracking-wide group-hover:scale-105 group-hover:shadow-2xl transition-all duration-300`}
        >
          <Sparkles className="w-4 h-4 animate-spin [animation-duration:4s]" />
          <span>{label}</span>
          <ArrowRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1.5 transition-transform" />
        </div>
      </div>
    </button>
  );
};

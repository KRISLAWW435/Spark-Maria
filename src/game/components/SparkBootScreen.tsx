import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '../engine/SoundEngine';
import { Sparkles } from 'lucide-react';

interface SparkBootScreenProps {
  onComplete: () => void;
  accentColor?: string;
}

export const SparkBootScreen: React.FC<SparkBootScreenProps> = ({
  onComplete,
  accentColor = '#8b5cf6',
}) => {
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('Запуск ядра Spark OS…');

  useEffect(() => {
    soundEngine.playBoot();

    const t1 = setTimeout(() => {
      setProgressPercent(35);
      setStatusText('Инициализация графических модулей…');
    }, 500);

    const t2 = setTimeout(() => {
      setProgressPercent(75);
      setStatusText('Загрузка шрифтов и холста дизайнера…');
    }, 1100);

    const t3 = setTimeout(() => {
      setProgressPercent(100);
      setStatusText('Система готова!');
    }, 1750);

    const t4 = setTimeout(() => {
      soundEngine.playSuccess();
      onComplete();
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[9999] bg-gradient-to-b from-[#0b0f19] via-[#090d16] to-[#050810] flex flex-col items-center justify-center p-6 text-white text-center select-none overflow-hidden"
    >
      {/* Background Subtle Ambient Glows */}
      <div className="absolute w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none -top-10 -left-10 animate-pulse" />
      <div className="absolute w-96 h-96 rounded-full bg-pink-500/15 blur-3xl pointer-events-none -bottom-10 -right-10 animate-pulse" />

      {/* Central Brand Box */}
      <motion.div
        initial={{ scale: 0.8, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 0.1 }}
        className="flex flex-col items-center gap-4 mb-8 relative z-10"
      >
        {/* Animated Glowing Logo */}
        <div className="relative">
          <div
            style={{
              background: `radial-gradient(circle, ${accentColor} 0%, rgba(236,72,153,0.8) 100%)`,
            }}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl shadow-[0_0_50px_rgba(139,92,246,0.6)] border-2 border-white/30 transform hover:scale-105 transition-transform"
          >
            ⚡
          </div>
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        {/* Big Bold OS Title */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 drop-shadow-[0_2px_15px_rgba(255,255,255,0.2)] font-sans">
            SPARK PRO
          </h1>
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-extrabold text-indigo-300/80 tracking-widest uppercase">
            <span>STUDIO OPERATING SYSTEM</span>
          </div>
        </div>

        {/* Small Status Text with Pulsing Animation */}
        <p className="text-xs sm:text-sm text-slate-400 font-semibold tracking-wide h-5">
          {statusText}
        </p>
      </motion.div>

      {/* Animated Loading Bar & Dots */}
      <div className="w-64 sm:w-80 space-y-3 relative z-10">
        {/* Sleek Gradient Progress Bar */}
        <div className="h-2.5 bg-slate-900/90 rounded-full overflow-hidden p-0.5 border border-white/15 shadow-inner">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-pink-500 to-amber-400 shadow-[0_0_15px_rgba(236,72,153,0.8)]"
            style={{ width: `${progressPercent}%` }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
          />
        </div>

        {/* Three Animated Pulsing Dots */}
        <div className="flex justify-center items-center gap-2 pt-1">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>

      {/* Quick Skip Button */}
      <button
        onClick={() => {
          soundEngine.playSuccess();
          onComplete();
        }}
        className="absolute bottom-6 right-6 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-bold transition-all border border-white/10 active:scale-95 cursor-pointer flex items-center gap-1.5"
      >
        <span>Пропустить</span>
        <span>➔</span>
      </button>
    </motion.div>
  );
};

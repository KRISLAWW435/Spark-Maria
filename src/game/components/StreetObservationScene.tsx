import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SparkSprite } from './SparkSprite';
import { soundEngine } from '../engine/SoundEngine';
import { GAME_ASSETS } from '../assets';
import { Search, Eye, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface StreetObservationSceneProps {
  onComplete: () => void;
}

export const StreetObservationScene: React.FC<StreetObservationSceneProps> = ({ onComplete }) => {
  const [visitedHotspots, setVisitedHotspots] = useState<string[]>([]);
  const [activeObservation, setActiveObservation] = useState<{
    id: string;
    title: string;
    text: string;
    icon: string;
  } | null>(null);

  const hotspots = [
    {
      id: 'sign',
      top: '32%',
      left: '38%',
      label: 'Старая вывеска',
      icon: '🔍',
      title: 'Улика 1: Маленькая и блеклая вывеска',
      text: 'Старая табличка крошечная и блеклая. На сером кирпичном фасаде здания её совершенно не видно прохожим!',
    },
    {
      id: 'window',
      top: '52%',
      left: '42%',
      label: 'Витрина',
      icon: '🔍',
      title: 'Улика 2: Бликующие витрины',
      text: 'Внутри на полках лежат свежие круассаны, но дневное солнце бликует на стекле, и снаружи витрина кажется пустой!',
    },
    {
      id: 'poster',
      top: '54%',
      left: '68%',
      label: 'Афиша и прохожие',
      icon: '🔍',
      title: 'Улика 3: Спешащие прохожие',
      text: 'Люди идут быстрым шагом и не вчитываются. Чтобы за 1 секунду понять, что это кондитерская, нужен контраст и аппетитная иконка!',
    },
  ];

  const handleHotspotClick = (spot: typeof hotspots[0]) => {
    soundEngine.playPop();
    if (!visitedHotspots.includes(spot.id)) {
      const next = [...visitedHotspots, spot.id];
      setVisitedHotspots(next);
      if (next.length === 3) {
        soundEngine.playSuccess();
      }
    }
    setActiveObservation({
      id: spot.id,
      title: spot.title,
      text: spot.text,
      icon: spot.icon,
    });
  };

  const allVisited = visitedHotspots.length >= 3;

  return (
    <div className="relative w-full h-screen bg-sky-200 overflow-hidden flex flex-col justify-between p-4 md:p-6 select-none font-sans">
      {/* Full Bright Bakery Street Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={GAME_ASSETS.backgrounds.bakeryStreet}
          alt="Улица кондитерской Мари"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-bottom"
        />
      </div>

      {/* Top Detective Header Banner */}
      <div className="relative z-20 max-w-xl mx-auto bg-slate-900/90 backdrop-blur-md px-6 py-3 rounded-full border border-amber-400/50 shadow-2xl text-center mt-12 sm:mt-14 text-white">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl">🕵️‍♂️</span>
          <h2 className="text-sm sm:text-base font-black text-amber-300 tracking-wide uppercase">
            Режим Шерлок: Поиск улик ({visitedHotspots.length} / 3)
          </h2>
        </div>
        <p className="text-xs text-slate-300 mt-0.5">
          {allVisited
            ? '🎉 Все 3 улики найдены! Теперь мы точно знаем, как решить задачу.'
            : 'Нажимай на мерцающие лупы на улице, чтобы найти все причины!'}
        </p>
      </div>

      {/* 3 Interactive Hotspots (Magnifying glasses) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {hotspots.map((spot) => {
          const isVisited = visitedHotspots.includes(spot.id);

          return (
            <button
              key={spot.id}
              type="button"
              onClick={() => handleHotspotClick(spot)}
              style={{ top: spot.top, left: spot.left }}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto flex items-center gap-2 p-3 rounded-full shadow-2xl transition-all duration-300 group cursor-pointer ${
                isVisited
                  ? 'bg-white text-emerald-700 border-2 border-emerald-400 ring-4 ring-emerald-300/40 scale-100'
                  : 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black animate-bounce ring-4 ring-amber-300/80 hover:scale-125'
              }`}
              title={spot.label}
            >
              {isVisited ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              ) : (
                <Search className="w-6 h-6 text-slate-950 animate-pulse" />
              )}
              <span className="text-xs font-black pr-1 hidden sm:inline">{spot.label}</span>
            </button>
          );
        })}
      </div>

      {/* Detective Spark Floating with Dialogue Bubble */}
      <div className="relative z-30 flex items-end justify-between max-w-4xl mx-auto w-full mt-auto mb-4 pointer-events-none">
        {/* Spark Sprite with rainbow glow and detective vibe */}
        <div className="relative shrink-0 pointer-events-auto">
          {/* Rainbow halo */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-pink-400/30 via-purple-400/30 to-sky-400/30 blur-xl pointer-events-none" />
          <div
            style={{
              filter:
                'drop-shadow(0 0 10px rgba(244,114,182,0.45)) drop-shadow(0 0 20px rgba(167,139,250,0.4)) drop-shadow(0 0 32px rgba(56,189,248,0.35))',
            }}
            className="h-44 sm:h-56 md:h-64 w-auto"
          >
            <SparkSprite emotion={allVisited ? 'excited' : 'thinking'} size="100%" className="h-full w-auto" />
          </div>
        </div>

        {/* Speech Dialogue Box */}
        <div className="flex-1 ml-4 pointer-events-auto">
          <AnimatePresence mode="wait">
            {activeObservation ? (
              <motion.div
                key={activeObservation.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white/95 border-2 border-amber-400 p-5 rounded-3xl shadow-2xl backdrop-blur-md text-slate-900"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-slate-900 font-extrabold text-sm sm:text-base flex items-center gap-2">
                    <Eye className="w-5 h-5 text-amber-600" /> {activeObservation.title}
                  </h3>
                  <button
                    onClick={() => setActiveObservation(null)}
                    className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold hover:bg-amber-200 transition-colors cursor-pointer"
                  >
                    Понятно ✓
                  </button>
                </div>
                <p className="text-slate-700 text-xs sm:text-sm font-semibold leading-relaxed">
                  {activeObservation.text}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={allVisited ? 'all-visited' : 'need-clues'}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="p-5 rounded-3xl bg-white/95 backdrop-blur-md border-2 border-indigo-200 shadow-2xl text-slate-900"
              >
                <div className="flex items-center gap-1.5 mb-1.5 text-[11px] font-black uppercase tracking-wider text-indigo-600">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  <span>Спарк · Искра творчества</span>
                </div>

                <p className="text-xs sm:text-sm md:text-base font-bold text-slate-900 leading-relaxed">
                  {allVisited
                    ? '«Всё ясно! Возвращаемся в студию — будем делать дизайн.» ✨'
                    : '«Нажимай на лупы и ищи улики. Нам нужно понять все 3 причины!» 🔍'}
                </p>

                {allVisited && (
                  <div className="mt-3.5 pt-2.5 border-t border-indigo-100 flex justify-end">
                    <button
                      onClick={() => {
                        soundEngine.playSuccess();
                        onComplete();
                      }}
                      className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:brightness-110 text-white font-black text-xs sm:text-sm shadow-xl flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
                    >
                      <span>Возвращаемся в студию</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignDesign, PosterDesign, StickersDesign, ZONES } from '../types';
import { BakeryFacadeView } from './BakeryFacadeView';
import { SparkSprite } from './SparkSprite';
import { soundEngine } from '../engine/SoundEngine';
import { Search, CheckCircle2, ArrowRight, X } from 'lucide-react';

interface StreetObservationSceneProps {
  orderNumber?: 1 | 2 | 3;
  signDesign?: SignDesign | null;
  posterDesign?: PosterDesign | null;
  stickersDesign?: StickersDesign | null;
  onComplete: () => void;
}

interface ProblemDetail {
  id: 'sign' | 'poster' | 'windows';
  label: string;
  problemTitle: string;
  explanation: string;
  emoji: string;
  zoneKey: 'sign' | 'poster' | 'window';
}

const PROBLEMS: ProblemDetail[] = [
  {
    id: 'sign',
    label: 'Вывеска',
    problemTitle: 'Нет вывески!',
    explanation: 'Над дверью совсем пусто. Люди идут по улице и не понимают, что здесь пекарня!',
    emoji: '🏷️',
    zoneKey: 'sign',
  },
  {
    id: 'poster',
    label: 'Афиша',
    problemTitle: 'Нет афиши!',
    explanation: 'На стене пусто! Прохожие не знают, какие вкусные эклеры и выпечку готовят внутри.',
    emoji: '📜',
    zoneKey: 'poster',
  },
  {
    id: 'windows',
    label: 'Окна',
    problemTitle: 'Окна пустые!',
    explanation: 'Витрина без картинок и наклеек. Не хватает уюта и аппетитного настроения!',
    emoji: '🪟',
    zoneKey: 'window',
  },
];

const getZoneCenter = (zoneKey: 'sign' | 'poster' | 'window') => {
  const zone = ZONES[zoneKey];
  if (zoneKey === 'poster') {
    // Lift poster button higher up inside the poster frame
    const top = `calc(${zone.top} + (${zone.height} * 0.28))`;
    const left = `calc(${zone.left} + (${zone.width} / 2))`;
    return { top, left };
  }
  const top = `calc(${zone.top} + (${zone.height} / 2))`;
  const left = `calc(${zone.left} + (${zone.width} / 2))`;
  return { top, left };
};

export const StreetObservationScene: React.FC<StreetObservationSceneProps> = ({
  signDesign,
  posterDesign,
  stickersDesign,
  onComplete,
}) => {
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [activeCardProblem, setActiveCardProblem] = useState<ProblemDetail | null>(null);

  const allFound = foundIds.length >= 3;

  const handleInspect = (problem: ProblemDetail) => {
    soundEngine.playPop();
    if (!foundIds.includes(problem.id)) {
      setFoundIds((prev) => [...prev, problem.id]);
    }
    setActiveCardProblem(problem);
  };

  const handleInspectDoor = () => {
    soundEngine.playPop();
    setActiveCardProblem({
      id: 'windows',
      label: 'Дверь',
      problemTitle: 'Дверь в порядке!',
      explanation: 'Входная дверь деревянная и чистая. Но обрати внимание: над дверью совсем нет вывески, рядом на стене нет афиши, а в витрине окна пусто!',
      emoji: '🚪',
      zoneKey: 'window',
    });
  };

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden flex flex-col justify-between p-4 md:p-6 select-none font-sans bg-slate-950">
      {/* Facade View Background with interactive zones in Sherlock mode */}
      <div className="absolute inset-0 z-0">
        <BakeryFacadeView
          signDesign={null}
          posterDesign={null}
          stickersDesign={null}
          isSherlockMode={true}
          activeZones={['sign', 'poster', 'window', 'door']}
          onZoneClick={(zone) => {
            if (zone === 'sign') {
              const p = PROBLEMS.find((item) => item.id === 'sign');
              if (p) handleInspect(p);
            } else if (zone === 'poster') {
              const p = PROBLEMS.find((item) => item.id === 'poster');
              if (p) handleInspect(p);
            } else if (zone === 'window' || zone === 'windowR') {
              const p = PROBLEMS.find((item) => item.id === 'windows');
              if (p) handleInspect(p);
            } else if (zone === 'door') {
              handleInspectDoor();
            }
          }}
        >
          {/* 3 LARGE BUTTONS WITH MAGNIFYING GLASS (Strictly bound to Facade 2752x1536 aspect container) */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            {PROBLEMS.map((problem) => {
              const isFound = foundIds.includes(problem.id);
              const center = getZoneCenter(problem.zoneKey);

              return (
                <div
                  key={problem.id}
                  style={{
                    top: center.top,
                    left: center.left,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className="absolute pointer-events-auto"
                >
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => handleInspect(problem)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-full font-black text-sm sm:text-base shadow-2xl border-2 transition-all cursor-pointer ${
                      isFound
                        ? 'bg-emerald-600 text-white border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                        : 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-white shadow-[0_0_25px_rgba(245,158,11,0.6)] animate-bounce'
                    }`}
                    title={`Нажми, чтобы осмотреть: ${problem.label}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isFound ? 'bg-emerald-700 text-white' : 'bg-white text-amber-600 shadow-sm'}`}>
                      {isFound ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Search className="w-5 h-5 stroke-[2.5]" />
                      )}
                    </div>
                    <span>{problem.label}</span>
                    {isFound && <span className="text-xs opacity-90">✓</span>}
                  </motion.button>
                </div>
              );
            })}
          </div>
        </BakeryFacadeView>
      </div>

      {/* Top-Left Floating Badge: Mode & Progress (Compact capsule in top-left, does NOT cover sign or Studio pill) */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-40 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl border border-amber-400/70 shadow-2xl text-white select-none pointer-events-auto flex items-center gap-3 max-w-sm sm:max-w-md">
        <span className="text-2xl sm:text-3xl shrink-0">🕵️‍♂️</span>
        <div className="text-left">
          <h2 className="text-xs sm:text-sm font-black text-amber-300 tracking-wide uppercase leading-tight">
            Режим «Шерлок» • Найди 3 проблемы на фасаде
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-300 font-semibold leading-tight mt-1">
            Найдено проблем: <strong className="text-amber-400 font-black">{foundIds.length}</strong> из 3
          </p>
        </div>
      </div>

      {/* BOTTOM SPARK & DIALOGUE (Compact & unobtrusive) */}
      <div className="relative z-30 flex items-end justify-between max-w-3xl mx-auto w-full mt-auto mb-2 sm:mb-4 pointer-events-none px-2">
        {/* Spark Sprite */}
        <div className="relative shrink-0 pointer-events-auto">
          <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-pink-400/25 via-purple-400/25 to-sky-400/25 blur-lg pointer-events-none" />
          <div className="h-32 sm:h-40 md:h-44 w-auto drop-shadow-2xl">
            <SparkSprite emotion={allFound ? 'excited' : 'thinking'} size="100%" className="h-full w-auto" />
          </div>
        </div>

        {/* Dialogue Box */}
        <div className="flex-1 ml-3 sm:ml-4 pointer-events-auto">
          <div className="bg-white/95 border-2 border-amber-400 p-3.5 sm:p-4.5 rounded-2xl sm:rounded-3xl shadow-2xl backdrop-blur-md text-slate-900">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black uppercase text-amber-600 tracking-wider">
                Спарк
              </span>
              {allFound && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            </div>

            <p className="text-xs sm:text-sm md:text-base font-extrabold text-slate-900 leading-snug">
              {allFound
                ? 'Всё ясно! Все 3 проблемы найдены. Возвращаемся в студию делать вывеску!'
                : 'Посмотри на фасад пекарни. Нажимай на большие кнопки с лупой, чтобы найти проблемы!'}
            </p>
          </div>
        </div>
      </div>

      {/* MODAL 1: EXPLANATION CARD FOR A FOUND PROBLEM */}
      <AnimatePresence>
        {activeCardProblem && !allFound && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-2 border-amber-400 text-slate-900 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{activeCardProblem.emoji}</span>
                  <div>
                    <span className="text-xs font-black uppercase text-rose-600 tracking-wider">
                      Проблема найдена
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900">
                      {activeCardProblem.problemTitle}
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveCardProblem(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-semibold">
                {activeCardProblem.explanation}
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveCardProblem(null)}
                  className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm uppercase tracking-wide shadow-lg transition-transform hover:scale-102 cursor-pointer"
                >
                  Продолжить поиск
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: ALL 3 FOUND -> "ЧТО ХОЧЕТ МАРИЯ" SUMMARY CARD */}
      <AnimatePresence>
        {allFound && (
          <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <motion.div
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 240 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border-4 border-amber-400 text-slate-900 space-y-5"
            >
              <div className="text-center space-y-1">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 text-3xl shadow-sm mb-2">
                  📋
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  Что хочет Мария
                </h3>
                <p className="text-xs font-bold text-amber-700">
                  Все 3 проблемы найдены! Вот главное задание:
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-sm text-slate-800 space-y-2">
                <div className="flex items-start gap-2.5">
                  <span className="text-lg">🎯</span>
                  <p className="font-extrabold text-slate-900 leading-snug">
                    Сделать вывеску над дверью, чтобы прохожие издалека понимали: здесь пекут свежие круассаны и эклеры!
                  </p>
                </div>
                <div className="text-xs text-slate-600 pl-7 space-y-1 pt-1 border-t border-amber-200/60">
                  <p>• Чёткое название пекарни</p>
                  <p>• Аппетитная иконка выпечки</p>
                  <p>• Контрастный цвет для заметности</p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 flex items-center gap-3">
                <span className="text-2xl">⚡</span>
                <p className="text-xs text-indigo-950 font-bold">
                  Спарк: «Всё ясно! Возвращаемся в студию.»
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playSuccess();
                  onComplete();
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-base uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-102 cursor-pointer"
              >
                <span>Поехать в студию</span>
                <ArrowRight className="w-5 h-5 stroke-[3]" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

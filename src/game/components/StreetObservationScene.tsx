import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignDesign, PosterDesign, StickersDesign } from '../types';
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
  positionClass: string;
}

const PROBLEMS: ProblemDetail[] = [
  {
    id: 'sign',
    label: 'Вывеска',
    problemTitle: 'Нет вывески!',
    explanation: 'Над дверью совсем пусто. Люди идут по улице и не понимают, что здесь пекарня!',
    emoji: '🏷️',
    positionClass: 'top-[18%] left-[48%] -translate-x-1/2 -translate-y-1/2',
  },
  {
    id: 'poster',
    label: 'Афиша',
    problemTitle: 'Нет афиши!',
    explanation: 'На стене пусто! Прохожие не знают, какие вкусные эклеры и выпечку готовят внутри.',
    emoji: '📜',
    positionClass: 'top-[42%] left-[78%] -translate-x-1/2 -translate-y-1/2',
  },
  {
    id: 'windows',
    label: 'Окна',
    problemTitle: 'Окна пустые!',
    explanation: 'Витрина без картинок и наклеек. Не хватает уюта и аппетитного настроения!',
    emoji: '🪟',
    positionClass: 'top-[46%] left-[21%] -translate-x-1/2 -translate-y-1/2',
  },
];

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

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col justify-between p-4 md:p-6 select-none font-sans bg-slate-950">
      {/* Facade View Background */}
      <div className="absolute inset-0 z-0">
        <BakeryFacadeView
          signDesign={signDesign}
          posterDesign={posterDesign}
          stickersDesign={stickersDesign}
        />
      </div>

      {/* Top Banner: Mode & Progress */}
      <div className="relative z-30 max-w-xl mx-auto bg-slate-900/90 backdrop-blur-md px-6 py-3 rounded-full border border-amber-400/60 shadow-2xl text-center mt-12 sm:mt-14 text-white">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl">🕵️‍♂️</span>
          <h2 className="text-sm sm:text-base font-black text-amber-300 tracking-wide uppercase">
            Режим «Шерлок» • Найди 3 проблемы на фасаде
          </h2>
        </div>
        <p className="text-xs text-slate-300 mt-1 font-semibold">
          Найдено проблем: <strong className="text-amber-400">{foundIds.length}</strong> из 3
        </p>
      </div>

      {/* 3 LARGE BUTTONS WITH MAGNIFYING GLASS ON THE FACADE */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {PROBLEMS.map((problem) => {
          const isFound = foundIds.includes(problem.id);

          return (
            <div
              key={problem.id}
              className={`absolute pointer-events-auto ${problem.positionClass}`}
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

      {/* BOTTOM SPARK & DIALOGUE */}
      <div className="relative z-30 flex items-end justify-between max-w-4xl mx-auto w-full mt-auto mb-4 pointer-events-none">
        {/* Spark Sprite */}
        <div className="relative shrink-0 pointer-events-auto">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-pink-400/30 via-purple-400/30 to-sky-400/30 blur-xl pointer-events-none" />
          <div className="h-40 sm:h-52 md:h-60 w-auto drop-shadow-2xl">
            <SparkSprite emotion={allFound ? 'excited' : 'thinking'} size="100%" className="h-full w-auto" />
          </div>
        </div>

        {/* Dialogue Box */}
        <div className="flex-1 ml-4 pointer-events-auto">
          <div className="bg-white/95 border-2 border-amber-400 p-5 rounded-3xl shadow-2xl backdrop-blur-md text-slate-900">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black uppercase text-amber-600 tracking-wider">
                Спарк
              </span>
              {allFound && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            </div>

            <p className="text-sm sm:text-base font-extrabold text-slate-900">
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

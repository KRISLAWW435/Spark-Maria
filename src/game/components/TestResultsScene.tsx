import React from 'react';
import { TestResult } from '../types';
import { SignRender } from './SignRender';
import { PosterRender } from './PosterRender';
import { BakeryFacadeView } from './BakeryFacadeView';
import { MarieSprite } from './MarieSprite';
import { SparkSprite } from './SparkSprite';
import { soundEngine } from '../engine/SoundEngine';
import {
  Eye,
  CheckCircle,
  ShoppingBag,
  Sparkles,
  RefreshCw,
  Award,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';

interface TestResultsSceneProps {
  testResult: TestResult;
  onImprove: () => void;
  onKeepAndFinish: () => void;
}

export const TestResultsScene: React.FC<TestResultsSceneProps> = ({
  testResult,
  onImprove,
  onKeepAndFinish,
}) => {
  const {
    versionNumber,
    signDesign,
    posterDesign,
    stickersDesign,
    orderNumber = 1,
    noticedCount,
    readCount,
    understoodCount,
    enteredCount,
    totalVisitors,
    visitorReactions,
    sparkCommentary,
    educationalTakeaway,
  } = testResult;

  const orderTitles = {
    1: 'ДАННЫЕ ЭКСПЕРИМЕНТА: ВЫВЕСКА МАРИ',
    2: 'ДАННЫЕ ЭКСПЕРИМЕНТА: АФИША С ЭКЛЕРАМИ',
    3: 'ФИНАЛЬНЫЙ ТРИУМФ: ВИТРИНА И ДВЕРЬ ПЕКАРНИ!',
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-60px)] bg-slate-900 text-white p-4 md:p-8 select-none overflow-y-auto font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Result Header Banner */}
        <div className="bg-slate-800/90 backdrop-blur-md p-6 rounded-3xl border border-amber-500/40 shadow-2xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black uppercase">
                Заказ #{orderNumber} • Версия #{versionNumber}
              </span>
              <span className="text-xs text-amber-300 font-bold">Тест на улице завершен</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-amber-200">
              {orderTitles[orderNumber] || orderTitles[1]}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundEngine.playPop();
                onImprove();
              }}
              className="px-5 py-3 rounded-2xl bg-slate-700 hover:bg-slate-600 text-amber-200 font-extrabold text-sm border border-slate-600 shadow-md flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> ИЗМЕНИТЬ ДИЗАЙН
            </button>

            <button
              onClick={() => {
                soundEngine.playSuccess();
                onKeepAndFinish();
              }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm md:text-base shadow-xl flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
            >
              <span>Поехать в студию</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Two-Column Display: Left Side Artwork & Stats, Right Side Spark Takeaways */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Artwork Preview & Visual Metrics */}
          <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 shadow-xl flex flex-col justify-between space-y-6">
            <div className="text-center">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                {orderNumber === 1
                  ? 'Протестированная Вывеска'
                  : orderNumber === 2
                  ? 'Протестированная Афиша'
                  : 'Праздничный Фасад Мари'}
              </h3>
              <div className="flex justify-center p-4 bg-slate-950/80 rounded-2xl border border-slate-800 shadow-inner">
                {orderNumber === 1 && <SignRender design={signDesign} scale={1.1} />}
                {orderNumber === 2 && posterDesign && <PosterRender design={posterDesign} scale={0.9} />}
                {orderNumber === 3 && (
                  <div className="w-full h-56 rounded-xl overflow-hidden shadow-md">
                    <BakeryFacadeView
                      signDesign={signDesign}
                      posterDesign={posterDesign}
                      stickersDesign={stickersDesign}
                      celebrationMode={true}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Visual Metrics Bars */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-extrabold text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-amber-400" /> Заметили с улицы:
                  </span>
                  <span className="text-amber-400">{noticedCount} из {totalVisitors}</span>
                </div>
                <div className="w-full bg-slate-700/60 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all"
                    style={{ width: `${Math.round((noticedCount / totalVisitors) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-extrabold text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Поняли, что это заведение:
                  </span>
                  <span className="text-emerald-400">{understoodCount} из {totalVisitors}</span>
                </div>
                <div className="w-full bg-slate-700/60 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all"
                    style={{ width: `${Math.round((understoodCount / totalVisitors) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-extrabold text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-rose-400" /> Зашли внутрь:
                  </span>
                  <span className="text-rose-400">{enteredCount} из {totalVisitors}</span>
                </div>
                <div className="w-full bg-slate-700/60 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-400 h-full rounded-full transition-all"
                    style={{ width: `${Math.round((enteredCount / totalVisitors) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Spark Advice & Dialogue */}
          <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
                <SparkSprite emotion="excited" size={60} />
                <div>
                  <h4 className="text-base font-extrabold text-white">Вывод дизайн-эксперимента</h4>
                  <p className="text-xs text-amber-300 font-bold">{educationalTakeaway.title}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-100 text-xs sm:text-sm leading-relaxed">
                {sparkCommentary}
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-700 text-slate-300 text-xs leading-relaxed space-y-2">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase tracking-wide">
                  <Lightbulb className="w-4 h-4" /> Главный секрет дизайнера:
                </div>
                <p>{educationalTakeaway.explanation}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-center gap-3">
              <MarieSprite emotion="proud" size={60} />
              <div className="text-xs text-rose-100">
                <span className="font-bold text-rose-300 block mb-0.5">Мари:</span>
                «Отличная работа! Давай утвердим проект и добавим его в наше портфолио!»
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { TestResult } from '../types';
import { SignRender } from './SignRender';
import { MarieSprite } from './MarieSprite';
import { SparkSprite } from './SparkSprite';
import { soundEngine } from '../engine/SoundEngine';
import {
  Eye,
  BookOpen,
  CheckCircle,
  ShoppingBag,
  Sparkles,
  RefreshCw,
  Award,
  Lightbulb,
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
    noticedCount,
    readCount,
    understoodCount,
    enteredCount,
    totalVisitors,
    visitorReactions,
    sparkCommentary,
    educationalTakeaway,
  } = testResult;

  return (
    <div className="relative w-full min-h-[calc(100vh-60px)] bg-slate-900 text-white p-4 md:p-8 select-none overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Result Header Banner */}
        <div className="bg-slate-800/90 backdrop-blur-md p-6 rounded-3xl border border-amber-500/40 shadow-2xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black uppercase">
                Результаты Версии #{versionNumber}
              </span>
              <span className="text-xs text-amber-300 font-bold">Эксперимент на улице завершен</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-amber-200">
              ДАННЫЕ ЭКСПЕРИМЕНТА ВЫВЕСКИ
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundEngine.playPop();
                onImprove();
              }}
              className="px-5 py-3 rounded-2xl bg-slate-700 hover:bg-slate-600 text-amber-200 font-extrabold text-sm border border-slate-600 shadow-md flex items-center gap-2 transition-transform hover:scale-105"
            >
              <RefreshCw className="w-4 h-4" /> ИЗМЕНИТЬ В ХОЛСТЕ
            </button>

            <button
              onClick={() => {
                soundEngine.playSuccess();
                onKeepAndFinish();
              }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-sm md:text-base shadow-xl flex items-center gap-2 transition-transform hover:scale-105"
            >
              <Award className="w-5 h-5" /> УСТАНОВИТЬ ЭТУ ВЕРСИЮ!
            </button>
          </div>
        </div>

        {/* Two-Column Display: Left Side Sign & Stats, Right Side Spark Takeaways */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Sign Preview & Visual Metrics */}
          <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 shadow-xl flex flex-col justify-between space-y-6">
            <div className="text-center">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                Протестированная Вывеска
              </h3>
              <div className="flex justify-center p-4 bg-slate-950/80 rounded-2xl border border-slate-800 shadow-inner">
                <SignRender design={signDesign} scale={1.1} />
              </div>
            </div>

            {/* Visual Metrics Bars */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-extrabold text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-amber-400" /> Заметили с улицы:</span>
                  <span className="text-amber-400">{noticedCount} из {totalVisitors}</span>
                </div>
                <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="bg-amber-500 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${(noticedCount / totalVisitors) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-extrabold text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-blue-400" /> Смогли прочитать:</span>
                  <span className="text-blue-400">{readCount} из {totalVisitors}</span>
                </div>
                <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="bg-blue-500 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${(readCount / totalVisitors) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-extrabold text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-purple-400" /> Поняли, что это сладости:</span>
                  <span className="text-purple-400">{understoodCount} из {totalVisitors}</span>
                </div>
                <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="bg-purple-500 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${(understoodCount / totalVisitors) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-extrabold text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5"><ShoppingBag className="w-4 h-4 text-emerald-400" /> Зашли в пекарню:</span>
                  <span className="text-emerald-400">{enteredCount} из {totalVisitors}</span>
                </div>
                <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${(enteredCount / totalVisitors) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Educational Concept & Spark Analogy */}
          <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 shadow-xl flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-amber-400 font-extrabold uppercase tracking-wider">
                    UX Понятие: {educationalTakeaway.concept}
                  </span>
                  <h3 className="text-xl font-extrabold text-white">
                    {educationalTakeaway.title}
                  </h3>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-sm text-slate-300 leading-relaxed">
                {educationalTakeaway.explanation}
              </div>

              {/* Spark Analogy Box */}
              <div className="p-4 rounded-2xl bg-amber-950/80 border border-amber-600/50 flex items-start gap-3 text-amber-200">
                <SparkSprite emotion="laughing" size={70} />
                <div className="text-xs md:text-sm font-semibold leading-snug italic">
                  Спарк: {educationalTakeaway.sparkAnalogy}
                </div>
              </div>
            </div>

            {/* Marie's Reaction */}
            <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800/40 flex items-center gap-3 text-rose-100">
              <MarieSprite emotion={enteredCount >= 4 ? 'excited' : 'thinking'} size={80} />
              <div className="text-xs font-semibold leading-snug">
                Мари: «{sparkCommentary}»
              </div>
            </div>
          </div>
        </div>

        {/* Visitor Reactions Highlights Strip */}
        <div className="bg-slate-800/80 p-5 rounded-3xl border border-slate-700">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> Реакции Прохожих
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {visitorReactions.slice(0, 4).map((r) => (
              <div key={r.visitorId} className="p-3 rounded-2xl bg-slate-900/80 border border-slate-700/60 text-xs">
                <div className="font-extrabold text-amber-300 mb-1">{r.name}</div>
                <p className="text-slate-300 text-[11px] leading-tight italic">"{r.dialogueBubble}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

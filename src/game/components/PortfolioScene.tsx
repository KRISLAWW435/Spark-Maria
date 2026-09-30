import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { PlayerProgress } from '../types';
import { SignRender } from './SignRender';
import { MarieSprite } from './MarieSprite';
import { SparkSprite } from './SparkSprite';
import { soundEngine } from '../engine/SoundEngine';
import { Award, Coins, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

interface PortfolioSceneProps {
  progress: PlayerProgress;
  onReturnToMap: () => void;
}

export const PortfolioScene: React.FC<PortfolioSceneProps> = ({ progress, onReturnToMap }) => {
  const portfolio = progress.portfolio;

  useEffect(() => {
    soundEngine.playSuccess();
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // fallback
    }
  }, []);

  if (!portfolio || !progress.finalDesign) {
    return (
      <div className="p-8 text-center text-amber-200">
        <p>Портфолио создается...</p>
        <button onClick={onReturnToMap} className="mt-4 px-4 py-2 bg-amber-500 text-slate-900 font-bold rounded-xl">
          На карту
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[calc(100vh-60px)] bg-slate-900 text-white p-4 md:p-8 select-none overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Congratulations Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 p-6 rounded-3xl text-slate-950 shadow-2xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-slate-950 text-amber-300 text-xs font-black uppercase">
              ПРОЕКТ №1 ЗАВЕРШЕН!
            </span>
            <h2 className="text-2xl md:text-3xl font-black mt-1">
              🏆 ПОЗДРАВЛЯЕМ! ВЫВЕСКА УСТАНОВЛЕНА!
            </h2>
            <p className="text-xs md:text-sm font-extrabold text-slate-900/90 mt-0.5">
              Кондитерская Мари открылась с новой понятной вывеской!
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-2xl text-amber-300 font-extrabold">
            <div className="flex items-center gap-1">
              <Award className="w-5 h-5 text-amber-400" /> +100 XP
            </div>
            <div className="w-px h-5 bg-slate-700" />
            <div className="flex items-center gap-1 text-yellow-400">
              <Coins className="w-5 h-5" /> +50 монет
            </div>
          </div>
        </div>

        {/* Portfolio Project Card */}
        <div className="bg-slate-800/90 border-2 border-amber-500/40 p-6 md:p-8 rounded-3xl shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-700 pb-4">
            <div>
              <span className="text-xs text-amber-400 font-extrabold uppercase tracking-wider">
                Карточка Работы
              </span>
              <h3 className="text-2xl font-black text-amber-200">{portfolio.title}</h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Клиент</span>
              <div className="font-extrabold text-white text-sm">{portfolio.client}</div>
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Задача проекта
                </h4>
                <p className="text-sm font-semibold text-slate-200">{portfolio.task}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Эксперименты & Исследования
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Подобран оптимальный размер вывески
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Выбран контрастный сочетающийся цвет
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Протестирован читаемый шрифт
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Выбрана узнаваемая иконка сладостей
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                  Прогресс Привлечения Прохожих
                </h4>
                <div className="flex items-center justify-around text-center">
                  <div>
                    <span className="text-xs text-slate-400 block">Было:</span>
                    <span className="text-xl font-extrabold text-rose-400">{portfolio.beforeNoticed} человек</span>
                  </div>
                  <div className="text-amber-400 font-black text-lg">➔</div>
                  <div>
                    <span className="text-xs text-slate-400 block">Стало:</span>
                    <span className="text-xl font-extrabold text-emerald-400">{portfolio.afterNoticed} человек</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Sign Render Box */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-950/90 rounded-2xl border border-slate-800 shadow-inner space-y-4">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                Финальная Вывеска
              </span>
              <SignRender design={portfolio.finalDesign} scale={1.1} />
              <div className="text-xs text-slate-400 font-semibold text-center mt-2">
                Протестировано версий: <span className="text-amber-300 font-bold">{portfolio.versionsTested}</span>
              </div>
            </div>
          </div>

          {/* Client Testimonial & Characters */}
          <div className="p-5 rounded-2xl bg-amber-950/80 border border-amber-600/40 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <MarieSprite emotion="proud" size={100} />
              <div>
                <span className="text-xs text-amber-400 font-bold">Мари:</span>
                <p className="text-xs md:text-sm text-amber-100 font-medium italic">
                  «Теперь люди издалека знают, куда идут! Эклеры раскупают за считанные минуты!»
                </p>
              </div>
            </div>

            <SparkSprite emotion="laughing" size={90} className="hidden sm:block" />
          </div>
        </div>

        {/* Return to Map Button */}
        <div className="text-center pt-2">
          <button
            onClick={() => {
              soundEngine.playSuccess();
              onReturnToMap();
            }}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black text-base md:text-lg shadow-2xl hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
          >
            <MapPin className="w-5 h-5" /> ВЕРНУТЬСЯ НА КАРТУ РАЙОНА ➔
          </button>
          <p className="text-xs text-amber-300/80 mt-2">
            ✨ Открылась новая локация: <span className="font-bold text-amber-200">«Студия иллюстрации»</span>!
          </p>
        </div>
      </div>
    </div>
  );
};

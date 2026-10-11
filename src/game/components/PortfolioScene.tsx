import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { PlayerProgress, PortfolioItem } from '../types';
import { SignRender } from './SignRender';
import { PosterRender } from './PosterRender';
import { BakeryFacadeView } from './BakeryFacadeView';
import { MarieSprite } from './MarieSprite';
import { SparkSprite } from './SparkSprite';
import { soundEngine } from '../engine/SoundEngine';
import {
  Award,
  Coins,
  Sparkles,
  CheckCircle2,
  Lock,
  Download,
  Maximize2,
  X,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface PortfolioSceneProps {
  progress: PlayerProgress;
  onReturnToStudio: () => void;
}

export const PortfolioScene: React.FC<PortfolioSceneProps> = ({ progress, onReturnToStudio }) => {
  const [fullscreenItem, setFullscreenItem] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    soundEngine.playSuccess();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // fallback
    }
  }, []);

  const orders = progress.mariaOrders || {
    order1: progress.completedModules?.includes('bakery_marie') ? 'completed' : 'available',
    order2: 'locked',
    order3: 'locked',
    signDesign: progress.finalDesign || null,
    posterDesign: null,
    stickersDesign: null,
  };

  // Build the 3 project card models
  const projects: Array<{
    id: string;
    orderNum: 1 | 2 | 3;
    title: string;
    subtitle: string;
    status: 'completed' | 'available' | 'locked';
    task: string;
    client: string;
    renderPreview: () => React.ReactNode;
    renderFullscreen: () => React.ReactNode;
  }> = [
    {
      id: 'order-1',
      orderNum: 1,
      title: 'Вывеска Мари',
      subtitle: 'Заметность и понятность с улицы',
      status: orders.order1 === 'completed' ? 'completed' : 'available',
      client: 'Пекарня Мари',
      task: 'Разработать контрастную прямоугольную вывеску с понятной иконкой сладостей.',
      renderPreview: () =>
        orders.signDesign ? (
          <div className="transform scale-75 origin-center">
            <SignRender design={orders.signDesign} scale={0.7} />
          </div>
        ) : (
          <div className="text-slate-400 text-xs italic">Вывеска в разработке</div>
        ),
      renderFullscreen: () =>
        orders.signDesign ? (
          <div className="p-6 bg-slate-950 rounded-3xl flex items-center justify-center">
            <SignRender design={orders.signDesign} scale={1.3} />
          </div>
        ) : null,
    },
    {
      id: 'order-2',
      orderNum: 2,
      title: 'Афиша Мари',
      subtitle: 'Реклама свежих эклеров',
      status: orders.order2 === 'completed' ? 'completed' : orders.order2 === 'locked' ? 'locked' : 'available',
      client: 'Пекарня Мари',
      task: 'Сделать вертикальную афишу (2:3) с эклерами, призывом к действию и расписанием.',
      renderPreview: () =>
        orders.posterDesign ? (
          <div className="transform scale-75 origin-center">
            <PosterRender design={orders.posterDesign} scale={0.65} />
          </div>
        ) : orders.order2 === 'locked' ? (
          <div className="flex flex-col items-center gap-1.5 text-slate-500">
            <Lock className="w-8 h-8 opacity-60" />
            <span className="text-xs font-bold">Сначала выполни Заказ №1</span>
          </div>
        ) : (
          <div className="text-amber-400 text-xs font-bold">Готово к разработке на ноутбуке!</div>
        ),
      renderFullscreen: () =>
        orders.posterDesign ? (
          <div className="p-6 bg-slate-950 rounded-3xl flex items-center justify-center">
            <PosterRender design={orders.posterDesign} scale={1.2} />
          </div>
        ) : null,
    },
    {
      id: 'order-3',
      orderNum: 3,
      title: 'Витрина и дверь Мари',
      subtitle: 'Праздничное оформление наклейками',
      status: orders.order3 === 'completed' ? 'completed' : orders.order3 === 'locked' ? 'locked' : 'available',
      client: 'Пекарня Мари',
      task: 'Украсить окна и дверь стильными наклейками с персонажами и иконками сладостей.',
      renderPreview: () =>
        orders.stickersDesign ? (
          <div className="w-full h-36 rounded-2xl overflow-hidden shadow-inner">
            <BakeryFacadeView
              signDesign={orders.signDesign}
              posterDesign={orders.posterDesign}
              stickersDesign={orders.stickersDesign}
              celebrationMode={true}
            />
          </div>
        ) : orders.order3 === 'locked' ? (
          <div className="flex flex-col items-center gap-1.5 text-slate-500">
            <Lock className="w-8 h-8 opacity-60" />
            <span className="text-xs font-bold">Сначала выполни Заказы №1 и №2</span>
          </div>
        ) : (
          <div className="text-amber-400 text-xs font-bold">Готово к разработке на ноутбуке!</div>
        ),
      renderFullscreen: () => (
        <div className="w-full h-80 rounded-3xl overflow-hidden shadow-2xl">
          <BakeryFacadeView
            signDesign={orders.signDesign}
            posterDesign={orders.posterDesign}
            stickersDesign={orders.stickersDesign}
            celebrationMode={true}
          />
        </div>
      ),
    },
  ];

  // Helper for PNG Download
  const handleDownloadPNG = (title: string) => {
    soundEngine.playSuccess();
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1200, 800);
    gradient.addColorStop(0, '#0F172A');
    gradient.addColorStop(1, '#1E1B4B');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 800);

    // Decorative frame
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 12;
    ctx.strokeRect(40, 40, 1120, 720);

    // Title text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ДИЗАЙН-СТУДИЯ «СПАРК»', 600, 120);

    ctx.fillStyle = '#FBBF24';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(title.toUpperCase(), 600, 180);

    ctx.fillStyle = '#CBD5E1';
    ctx.font = '24px sans-serif';
    ctx.fillText('Клиент: Пекарня Мари • Проект подтвержден и проверен на улице', 600, 230);

    // Signature
    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText(`Дата создания: ${new Date().toLocaleDateString('ru-RU')}`, 600, 700);

    // Export & Download
    const a = document.createElement('a');
    a.download = `${title.replace(/\s+/g, '_')}_Spark_Design.png`;
    a.href = canvas.toDataURL('image/png');
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const completedCount = projects.filter((p) => p.status === 'completed').length;

  return (
    <div className="relative w-full min-h-[calc(100vh-60px)] bg-slate-900 text-white p-4 md:p-8 select-none overflow-y-auto font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 p-6 rounded-3xl text-slate-950 shadow-2xl flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-slate-950 text-amber-300 text-xs font-black uppercase">
              ПОРТФОЛИО ДИЗАЙН-СТУДИИ • {completedCount} ИЗ 3 РАБОТ
            </span>
            <h2 className="text-2xl md:text-3xl font-black mt-1">
              🏆 ПРОЕКТЫ КОНДИТЕРСКОЙ МАРИ
            </h2>
            <p className="text-xs md:text-sm font-extrabold text-slate-900/90 mt-0.5">
              Все три заказа от Мари сохраняются в твоё личное портфолио!
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-4 py-2.5 rounded-2xl text-amber-300 font-extrabold">
            <div className="flex items-center gap-1.5">
              <Award className="w-5 h-5 text-amber-400" />
              <span>+{progress.xp || 100} XP</span>
            </div>
            <div className="w-px h-5 bg-slate-700" />
            <div className="flex items-center gap-1.5 text-yellow-400">
              <Coins className="w-5 h-5" />
              <span>+{progress.coins || 50} монет</span>
            </div>
          </div>
        </div>

        {/* 3 Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((proj) => {
            const isDone = proj.status === 'completed';
            const isLock = proj.status === 'locked';

            return (
              <div
                key={proj.id}
                className={`bg-slate-800/90 border-2 rounded-3xl p-5 flex flex-col justify-between shadow-xl transition-all ${
                  isDone
                    ? 'border-amber-400/60 ring-2 ring-amber-400/20'
                    : isLock
                    ? 'border-slate-700 opacity-75'
                    : 'border-indigo-400/60 animate-pulse'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">
                      Заказ #{proj.orderNum}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                        isDone
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                          : isLock
                          ? 'bg-slate-700 text-slate-400'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                      }`}
                    >
                      {isDone ? 'ВЫПОЛНЕНО' : isLock ? 'ЗАБЛОКИРОВАНО' : 'ДОСТУПНО'}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-white">{proj.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 leading-snug">{proj.subtitle}</p>

                  {/* Preview Area */}
                  <div className="h-44 my-4 bg-slate-950/80 rounded-2xl border border-slate-700/80 flex items-center justify-center p-2 overflow-hidden">
                    {proj.renderPreview()}
                  </div>

                  <div className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed mb-4">
                    {proj.task}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="space-y-2 pt-2 border-t border-slate-700/60">
                  {isDone ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playPop();
                          setFullscreenItem({
                            id: proj.id,
                            title: proj.title,
                            orderNumber: proj.orderNum,
                            type: proj.orderNum === 1 ? 'sign' : proj.orderNum === 2 ? 'poster' : 'stickers',
                            client: proj.client,
                            task: proj.task,
                            beforeNoticed: 3,
                            afterNoticed: 18,
                            versionsTested: 1,
                            finalDesign: orders.signDesign || undefined,
                            posterDesign: orders.posterDesign || undefined,
                            stickersDesign: orders.stickersDesign || undefined,
                            completedAt: new Date().toLocaleDateString('ru-RU'),
                          });
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-black text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5" /> Во весь экран
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadPNG(proj.title)}
                        className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black flex items-center gap-1 shadow-md transition-colors cursor-pointer"
                        title="Скачать в PNG"
                      >
                        <Download className="w-3.5 h-3.5" /> PNG
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onReturnToStudio()}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-black flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Открыть заказ на ноутбуке</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Client & Spark Happy Comment Box */}
        <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <MarieSprite emotion="proud" size={90} />
            <div>
              <span className="text-xs text-amber-400 font-black">Мари (Владелица пекарни):</span>
              <p className="text-xs sm:text-sm text-slate-200 font-medium italic mt-0.5 max-w-lg">
                «Благодаря твоей дизайн-студии у нас всегда очередь за круассанами и эклерами! Все три работы смотрятся потрясающе!»
              </p>
            </div>
          </div>

          <SparkSprite emotion="laughing" size={85} className="hidden sm:block" />
        </div>

        {/* Return Button */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => {
              soundEngine.playSuccess();
              onReturnToStudio();
            }}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:scale-105 text-slate-950 font-black text-sm sm:text-base shadow-2xl transition-transform flex items-center gap-2 mx-auto cursor-pointer"
          >
            <Sparkles className="w-5 h-5" /> ВЕРНУТЬСЯ В СТУДИЮ ДИЗАЙНА ➔
          </button>
        </div>
      </div>

      {/* Fullscreen Project Modal Lightbox */}
      {fullscreenItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-400/80 max-w-3xl w-full rounded-3xl p-6 shadow-2xl space-y-4 relative animate-scaleUp">
            <button
              type="button"
              onClick={() => setFullscreenItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                Полноэкранный просмотр • Заказ #{fullscreenItem.orderNumber}
              </span>
              <h3 className="text-2xl font-black text-white">{fullscreenItem.title}</h3>
              <p className="text-xs text-slate-400">{fullscreenItem.task}</p>
            </div>

            {/* Large Preview */}
            <div className="min-h-[280px] bg-slate-950 rounded-2xl flex items-center justify-center p-6 border border-slate-800">
              {fullscreenItem.orderNumber === 1 && orders.signDesign && (
                <SignRender design={orders.signDesign} scale={1.3} />
              )}
              {fullscreenItem.orderNumber === 2 && orders.posterDesign && (
                <PosterRender design={orders.posterDesign} scale={1.2} />
              )}
              {fullscreenItem.orderNumber === 3 && (
                <div className="w-full h-72 rounded-2xl overflow-hidden shadow-xl">
                  <BakeryFacadeView
                    signDesign={orders.signDesign}
                    posterDesign={orders.posterDesign}
                    stickersDesign={orders.stickersDesign}
                    celebrationMode={true}
                  />
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                Завершено: {fullscreenItem.completedAt}
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadPNG(fullscreenItem.title)}
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Скачать в PNG
                </button>
                <button
                  type="button"
                  onClick={() => setFullscreenItem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

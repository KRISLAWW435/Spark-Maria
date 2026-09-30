import React from 'react';
import { PlayerProgress } from '../types';
import { soundEngine } from '../engine/SoundEngine';
import { GAME_ASSETS } from '../assets';
import { Map, Trophy, Briefcase, User, Compass, Check, Lock, Play } from 'lucide-react';

interface WorldMapProps {
  progress: PlayerProgress;
  onSelectLocation: (locId: string) => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({ progress, onSelectLocation }) => {
  const isBakeryCompleted = progress.completedModules.includes('bakery_marie');

  // Exact locations matching the reference image layout
  const mapNodes = [
    {
      id: 'bakery_marie',
      title: 'DIGITAL DISTRICT',
      subtitle: 'Кондитерская Мари',
      icon: '🧁',
      bgColor: 'bg-indigo-600',
      status: isBakeryCompleted ? 'completed' : 'available',
      top: '22%',
      left: '48%',
    },
    {
      id: 'illustration_studio',
      title: 'CREATIVE BLOCK',
      subtitle: 'Студия иллюстрации',
      icon: '🎨',
      bgColor: 'bg-purple-600',
      status: isBakeryCompleted ? 'available' : 'locked',
      top: '28%',
      left: '20%',
    },
    {
      id: 'brand_avenue',
      title: 'BRAND AVENUE',
      subtitle: 'Web Lab',
      icon: '📦',
      bgColor: 'bg-amber-500',
      status: 'locked',
      top: '55%',
      left: '18%',
    },
    {
      id: 'spark_studio_hub',
      title: 'SPARK STUDIO',
      subtitle: 'Главный Хаб',
      icon: '✦',
      bgColor: 'bg-indigo-900',
      status: 'available',
      top: '42%',
      left: '48%',
    },
    {
      id: 'motion_lab',
      title: 'MOTION LAB',
      subtitle: 'Анимационная студия',
      icon: '▶',
      bgColor: 'bg-rose-500',
      status: 'locked',
      top: '60%',
      left: '58%',
    },
    {
      id: 'game_district',
      title: 'GAME DISTRICT',
      subtitle: 'Игровой интерфейс',
      icon: '🎮',
      bgColor: 'bg-indigo-600',
      status: 'locked',
      top: '25%',
      left: '82%',
    },
    {
      id: 'future_lab',
      title: 'FUTURE LAB',
      subtitle: 'Дизайн будущего',
      icon: '⚛',
      bgColor: 'bg-cyan-500',
      status: 'locked',
      top: '55%',
      left: '82%',
    },
  ];

  return (
    <div className="relative w-full h-screen bg-sky-200 overflow-hidden select-none">
      {/* FULL-BRIGHT REALISTIC MAP BACKGROUND (NO DARKENING OVERLAY!) */}
      <img
        src={GAME_ASSETS.backgrounds.worldMap}
        alt="Archipelago UX Map"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover object-center"
      />

      {/* Floating Map Nodes (White Pills matching Reference) */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {mapNodes.map((node) => {
          const isAvailable = node.status === 'available';
          const isCompleted = node.status === 'completed';
          const isLocked = node.status === 'locked';

          return (
            <div
              key={node.id}
              style={{ top: node.top, left: node.left }}
              onClick={() => {
                if (node.id === 'bakery_marie' || node.id === 'illustration_studio') {
                  if (isAvailable || isCompleted) {
                    soundEngine.playSuccess();
                    onSelectLocation('bakery_marie');
                  }
                } else {
                  soundEngine.playPop();
                }
              }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group"
            >
              {/* Outer Pulsing Halo if Available */}
              {isAvailable && (
                <span className="absolute -inset-2 rounded-full bg-amber-400/50 animate-ping pointer-events-none" />
              )}

              {/* White Floating Pill Container */}
              <div
                className={`relative px-4 py-2 rounded-full shadow-2xl border flex items-center gap-2.5 transition-all duration-300 transform group-hover:scale-108 ${
                  isCompleted
                    ? 'bg-white text-slate-900 border-emerald-400 ring-2 ring-emerald-400/50'
                    : isAvailable
                    ? 'bg-white text-slate-900 border-amber-400 ring-4 ring-amber-400/40'
                    : 'bg-white/80 text-slate-500 border-slate-200 opacity-75'
                }`}
              >
                {/* Icon Circle */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-extrabold text-xs shadow-md ${node.bgColor}`}
                >
                  {node.icon}
                </div>

                {/* Title & Status */}
                <div className="flex flex-col text-left pr-1">
                  <span className="font-black text-xs md:text-sm tracking-wider text-slate-800 uppercase leading-none">
                    {node.title}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold mt-0.5">
                    {node.subtitle}
                  </span>
                </div>

                {/* Status Badge Icon */}
                {isCompleted && (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                {isAvailable && !isCompleted && (
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] animate-bounce">
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </div>
                )}
                {isLocked && (
                  <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px]">
                    <Lock className="w-3 h-3" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom-Left Navigation Bar (White Pill matching reference) */}
      <div className="fixed bottom-6 left-6 z-20 bg-white/95 backdrop-blur-md rounded-full px-5 py-2.5 shadow-2xl border border-white/80 flex items-center gap-6">
        <button
          onClick={() => soundEngine.playClick()}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 font-extrabold text-xs shadow-sm"
        >
          <Map className="w-4 h-4" /> Карта
        </button>

        <button
          onClick={() => soundEngine.playClick()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-xs transition-colors"
        >
          <Trophy className="w-4 h-4" /> Награды
        </button>

        <button
          onClick={() => soundEngine.playClick()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-xs transition-colors"
        >
          <Briefcase className="w-4 h-4" /> Портфолио
        </button>

        <button
          onClick={() => soundEngine.playClick()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-xs transition-colors"
        >
          <User className="w-4 h-4" /> Профиль
        </button>
      </div>

      {/* Bottom-Right Compass Widget (White Circle matching reference) */}
      <div className="fixed bottom-6 right-6 z-20">
        <button
          onClick={() => soundEngine.playPop()}
          className="w-12 h-12 rounded-full bg-white/95 backdrop-blur-md shadow-2xl border border-white/80 flex items-center justify-center text-indigo-600 hover:rotate-45 transition-transform duration-300 hover:scale-110"
          title="Навигационный компас"
        >
          <Compass className="w-6 h-6 stroke-[2]" />
        </button>
      </div>
    </div>
  );
};

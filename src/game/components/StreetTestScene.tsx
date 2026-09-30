import React, { useState, useEffect } from 'react';
import { SignDesign, TestResult } from '../types';
import { SignRender } from './SignRender';
import { VisitorSprite } from './VisitorSprite';
import { MarieSprite } from './MarieSprite';
import { SparkSprite } from './SparkSprite';
import { soundEngine } from '../engine/SoundEngine';
import { GAME_ASSETS } from '../assets';
import { Sparkles, FastForward } from 'lucide-react';

interface StreetTestSceneProps {
  testResult: TestResult;
  onFinishTest: () => void;
}

export const StreetTestScene: React.FC<StreetTestSceneProps> = ({ testResult, onFinishTest }) => {
  const [visitorIndex, setVisitorIndex] = useState(0);
  const [visitorPos, setVisitorPos] = useState(-20);
  const [isHalting, setIsHalting] = useState(false);

  const currentReaction = testResult.visitorReactions[visitorIndex];
  const progressPercent = Math.round(((visitorIndex + 1) / testResult.totalVisitors) * 100);

  useEffect(() => {
    if (!currentReaction) return;

    setVisitorPos(-20);
    setIsHalting(false);

    const walkTimer = setTimeout(() => {
      setVisitorPos(48);

      const haltTimer = setTimeout(() => {
        setIsHalting(true);
        if (currentReaction.noticed) {
          soundEngine.playPop();
        }

        const leaveTimer = setTimeout(() => {
          setIsHalting(false);
          setVisitorPos(115);

          const nextTimer = setTimeout(() => {
            if (visitorIndex < testResult.totalVisitors - 1) {
              setVisitorIndex(visitorIndex + 1);
            } else {
              onFinishTest();
            }
          }, 600);

          return () => clearTimeout(nextTimer);
        }, 3200);

        return () => clearTimeout(haltTimer);
      }, 1000);

      return () => clearTimeout(haltTimer);
    }, 100);

    return () => clearTimeout(walkTimer);
  }, [visitorIndex]);

  return (
    <div className="relative w-full h-screen bg-sky-200 overflow-hidden flex flex-col justify-between p-4 md:p-6 select-none">
      {/* Full Bright Bakery Street Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={GAME_ASSETS.backgrounds.bakeryStreet}
          alt="Улица кондитерской Мари"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-bottom"
        />

        {/* Dynamically mounted sign board child designed! */}
        <div className="absolute top-[28%] left-[40%] transform -translate-x-1/2 -translate-y-1/2 z-10 filter drop-shadow-2xl">
          <SignRender design={testResult.signDesign} scale={0.85} />
        </div>
      </div>

      {/* Top Test Progress Bar */}
      <div className="relative z-20 max-w-xl mx-auto bg-white/95 backdrop-blur-md px-6 py-3 rounded-full border border-white/80 shadow-2xl flex items-center gap-4 mt-16 text-slate-800">
        <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
        <div className="flex-1">
          <div className="flex justify-between text-xs font-black text-slate-700 mb-1">
            <span className="uppercase tracking-wide">Тестирование на улице</span>
            <span>Прохожий {visitorIndex + 1} из {testResult.totalVisitors}</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
            <div
              className="bg-gradient-to-r from-amber-500 to-rose-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <button
          onClick={onFinishTest}
          className="text-xs px-4 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black transition-colors flex items-center gap-1 shadow-sm"
        >
          <FastForward className="w-3.5 h-3.5" /> Итоги
        </button>
      </div>

      {/* Walking Visitor Layer */}
      {currentReaction && (
        <div
          style={{ left: `${visitorPos}%`, bottom: '130px' }}
          className="absolute z-20 transform -translate-x-1/2 transition-all duration-1000 ease-linear pointer-events-none"
        >
          {/* Reaction Dialogue Bubble when halting */}
          {isHalting && (
            <div className="absolute -top-28 left-1/2 transform -translate-x-1/2 bg-white text-slate-900 px-4 py-2.5 rounded-3xl shadow-2xl border-2 border-amber-400 font-bold text-xs md:text-sm min-w-[260px] text-center animate-bounce z-30">
              <div className="text-amber-800 text-[10px] uppercase font-black tracking-wider mb-0.5">
                {currentReaction.name} • {currentReaction.role}
              </div>
              {currentReaction.dialogueBubble}
              <div className="w-3 h-3 bg-white border-r-2 border-b-2 border-amber-400 transform rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
            </div>
          )}

          <VisitorSprite
            visitorId={currentReaction.visitorId}
            emotion={currentReaction.emotion}
            size={300}
          />
        </div>
      )}

      {/* Side Marie & Spark Real-time Spectator Comments */}
      <div className="relative z-20 w-full max-w-5xl mx-auto flex items-end justify-between px-6 mb-4 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-rose-200 flex items-center gap-3 max-w-xs text-slate-800 shadow-xl pointer-events-auto">
          <MarieSprite emotion={currentReaction?.noticed ? 'surprised' : 'worried'} size={95} />
          <p className="text-xs font-bold leading-snug">
            Мари: {currentReaction?.noticed ? 'Ой! Смотри, остановился!' : 'Прошёл мимо… Наверное, не заметил.'}
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-amber-300 flex items-center gap-3 max-w-xs text-slate-800 shadow-xl pointer-events-auto">
          <SparkSprite emotion={currentReaction?.entered ? 'excited' : 'thinking'} size={90} />
          <p className="text-xs font-bold leading-snug">
            Спарк: {testResult.sparkCommentary}
          </p>
        </div>
      </div>
    </div>
  );
};

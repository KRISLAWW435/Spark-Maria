import React from 'react';
import { SignDesign, PosterDesign, StickersDesign, ZONES } from '../types';
import { GAME_ASSETS } from '../assets';
import { SignRender } from './SignRender';
import { PosterRender } from './PosterRender';
import { StickersRender } from './StickersRender';
import { Search, Sparkles } from 'lucide-react';

export type FacadeZoneKey = 'sign' | 'poster' | 'windowL' | 'windowR' | 'door';

interface BakeryFacadeViewProps {
  signDesign?: SignDesign | null;
  posterDesign?: PosterDesign | null;
  stickersDesign?: StickersDesign | null;
  activeZones?: FacadeZoneKey[];
  onZoneClick?: (zone: FacadeZoneKey) => void;
  celebrationMode?: boolean;
  className?: string;
  isSherlockMode?: boolean;
}

export const BakeryFacadeView: React.FC<BakeryFacadeViewProps> = ({
  signDesign,
  posterDesign,
  stickersDesign,
  activeZones = [],
  onZoneClick,
  celebrationMode = false,
  className = '',
  isSherlockMode = false,
}) => {
  return (
    <div className={`relative w-full h-full overflow-hidden select-none bg-sky-200 ${className}`}>
      {/* Background Street/Facade Image */}
      <img
        src={GAME_ASSETS.backgrounds.bakeryStreet}
        alt="Фасад пекарни Мари"
        className={`w-full h-full object-cover object-bottom transition-all duration-700 ${
          celebrationMode ? 'brightness-110 saturate-125' : ''
        }`}
      />

      {/* Celebration Festive Garland and Fairy Lights */}
      {celebrationMode && (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          <div className="absolute top-2 left-0 right-0 flex justify-around text-2xl animate-pulse">
            <span>✨</span><span>🎉</span><span>🌟</span><span>✨</span><span>🎊</span><span>🌟</span>
          </div>
          <div className="absolute top-10 left-0 right-0 flex justify-around text-lg opacity-80 animate-bounce">
            <span>🧁</span><span>💖</span><span>🥐</span><span>✨</span><span>🎂</span><span>🍪</span>
          </div>
        </div>
      )}

      {/* ================= ZONE 1: SIGN (Над дверью) ================= */}
      <div
        style={{
          top: ZONES.sign.top,
          left: ZONES.sign.left,
          width: ZONES.sign.width,
          height: ZONES.sign.height,
        }}
        onClick={() => activeZones.includes('sign') && onZoneClick?.('sign')}
        className={`absolute z-10 flex items-center justify-center transition-all ${
          activeZones.includes('sign')
            ? 'cursor-pointer ring-4 ring-amber-400 ring-offset-2 ring-offset-black/50 animate-pulse bg-amber-400/20 rounded-2xl'
            : ''
        }`}
      >
        {signDesign ? (
          <div className="transform scale-90 sm:scale-100 filter drop-shadow-2xl">
            <SignRender design={signDesign} scale={0.85} />
          </div>
        ) : isSherlockMode && activeZones.includes('sign') ? (
          <div className="bg-amber-400/90 text-slate-950 font-black px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 border-2 border-white animate-bounce">
            <Search className="w-5 h-5" />
            <span className="text-xs sm:text-sm">Пустое место для вывески!</span>
          </div>
        ) : null}
      </div>

      {/* ================= ZONE 2: POSTER (Рамка на стене) ================= */}
      <div
        style={{
          top: ZONES.poster.top,
          left: ZONES.poster.left,
          width: ZONES.poster.width,
          height: ZONES.poster.height,
        }}
        onClick={() => activeZones.includes('poster') && onZoneClick?.('poster')}
        className={`absolute z-10 flex items-center justify-center transition-all ${
          activeZones.includes('poster')
            ? 'cursor-pointer ring-4 ring-amber-400 ring-offset-2 ring-offset-black/50 animate-pulse bg-amber-400/20 rounded-2xl'
            : ''
        }`}
      >
        {posterDesign ? (
          <div className="transform scale-90 sm:scale-100 filter drop-shadow-2xl">
            <PosterRender design={posterDesign} scale={0.75} />
          </div>
        ) : isSherlockMode && activeZones.includes('poster') ? (
          <div className="bg-amber-400/90 text-slate-950 font-black px-3 py-2 rounded-2xl shadow-xl flex items-center gap-2 border-2 border-white animate-bounce text-center">
            <Search className="w-4 h-4 shrink-0" />
            <span className="text-[11px] sm:text-xs">Рамка для афиши!</span>
          </div>
        ) : (
          /* Empty subtle frame on wall if order 2 not done yet */
          <div className="w-20 h-28 border-2 border-dashed border-slate-600/40 rounded-xl bg-slate-900/10 pointer-events-none" />
        )}
      </div>

      {/* ================= ZONE 3: WINDOW LEFT ================= */}
      <div
        style={{
          top: ZONES.windowL.top,
          left: ZONES.windowL.left,
          width: ZONES.windowL.width,
          height: ZONES.windowL.height,
        }}
        onClick={() => activeZones.includes('windowL') && onZoneClick?.('windowL')}
        className={`absolute z-10 transition-all ${
          activeZones.includes('windowL')
            ? 'cursor-pointer ring-4 ring-amber-400 ring-offset-2 ring-offset-black/50 animate-pulse bg-amber-400/20 rounded-2xl'
            : ''
        }`}
      >
        {stickersDesign && (
          <StickersRender design={stickersDesign} zone="windowL" scale={0.75} />
        )}
        {isSherlockMode && activeZones.includes('windowL') && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 border border-white">
              <Search className="w-3.5 h-3.5" /> Левое окно
            </span>
          </div>
        )}
      </div>

      {/* ================= ZONE 4: WINDOW RIGHT ================= */}
      <div
        style={{
          top: ZONES.windowR.top,
          left: ZONES.windowR.left,
          width: ZONES.windowR.width,
          height: ZONES.windowR.height,
        }}
        onClick={() => activeZones.includes('windowR') && onZoneClick?.('windowR')}
        className={`absolute z-10 transition-all ${
          activeZones.includes('windowR')
            ? 'cursor-pointer ring-4 ring-amber-400 ring-offset-2 ring-offset-black/50 animate-pulse bg-amber-400/20 rounded-2xl'
            : ''
        }`}
      >
        {stickersDesign && (
          <StickersRender design={stickersDesign} zone="windowR" scale={0.75} />
        )}
        {isSherlockMode && activeZones.includes('windowR') && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-amber-400 text-slate-950 font-black text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 border border-white">
              <Search className="w-3.5 h-3.5" /> Правое окно
            </span>
          </div>
        )}
      </div>

      {/* ================= ZONE 5: DOOR ================= */}
      <div
        style={{
          top: ZONES.door.top,
          left: ZONES.door.left,
          width: ZONES.door.width,
          height: ZONES.door.height,
        }}
        onClick={() => activeZones.includes('door') && onZoneClick?.('door')}
        className={`absolute z-10 transition-all ${
          activeZones.includes('door')
            ? 'cursor-pointer ring-4 ring-amber-400 ring-offset-2 ring-offset-black/50 animate-pulse bg-amber-400/20 rounded-2xl'
            : ''
        }`}
      >
        {stickersDesign && (
          <StickersRender design={stickersDesign} zone="door" scale={0.7} />
        )}
        {isSherlockMode && activeZones.includes('door') && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-1 rounded-full shadow-lg border border-white">
              🚪 Дверь
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { SignDesign, PosterDesign, StickersDesign, ZONES } from '../types';
import { GAME_ASSETS } from '../assets';
import { SignRender } from './SignRender';
import { PosterRender } from './PosterRender';
import { StickersRender } from './StickersRender';
import { Search, Sparkles } from 'lucide-react';

export type FacadeZoneKey = 'sign' | 'poster' | 'window' | 'door' | 'windowL' | 'windowR';

interface BakeryFacadeViewProps {
  signDesign?: SignDesign | null;
  posterDesign?: PosterDesign | null;
  stickersDesign?: StickersDesign | null;
  activeZones?: FacadeZoneKey[];
  onZoneClick?: (zone: FacadeZoneKey) => void;
  celebrationMode?: boolean;
  className?: string;
  isSherlockMode?: boolean;
  showSignZoneGuide?: boolean;
  zoom?: number;
  children?: React.ReactNode;
  selectedSignIconId?: string | null;
  onSignIconPointerDown?: (id: string, e: React.PointerEvent) => void;
  onSignIconClick?: (id: string, e: React.MouseEvent) => void;
  signContainerRef?: React.Ref<HTMLDivElement>;
  signOffsetY?: number;
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
  showSignZoneGuide = false,
  zoom = 1,
  children,
  selectedSignIconId = null,
  onSignIconPointerDown,
  onSignIconClick,
  signContainerRef,
  signOffsetY,
}) => {
  // Calm highlight without blinking (sign has no highlight)
  const getZoneHighlight = (key: FacadeZoneKey) => {
    if (key === 'sign') return '';
    if (isSherlockMode) {
      return activeZones.includes(key) ? 'cursor-pointer' : '';
    }
    return activeZones.includes(key)
      ? 'cursor-pointer ring-2 ring-amber-400/80 ring-offset-2 ring-offset-black/50 rounded-2xl'
      : '';
  };

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden select-none bg-slate-950 [container-type:size] ${className}`}>
      {/* 1. Full-Bleed Street/Facade Image (fills 100% of viewport/container without black bars) */}
      <img
        src={GAME_ASSETS.backgrounds.bakeryStreet}
        alt="Фасад пекарни Мари"
        className={`absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none transition-all duration-700 ${
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

      {/* 2. 16:9 Safe Zone Container (Desktop 1920x1080 Standard)
          Strictly locked to 16:9, centered horizontally & vertically.
          Coordinates from Figma 1920x1080 map 1:1 onto this container. */}
      <div
        className="relative w-full h-full max-w-full max-h-full flex items-center justify-center pointer-events-none transition-transform duration-200"
        style={{
          aspectRatio: '16 / 9',
          maxWidth: 'min(100%, calc(100cqh * (16 / 9)), calc(100vh * (16 / 9)))',
          maxHeight: 'min(100%, calc(100cqw * (9 / 16)), calc(100vw * (9 / 16)))',
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
        <div className="relative w-full h-full pointer-events-auto">
          {/* ================= ZONE 1: SIGN (Над дверью) ================= */}
          <div
            style={{
              top: signOffsetY
                ? `calc(${ZONES.sign.top} ${signOffsetY < 0 ? '-' : '+'} ${Math.abs(signOffsetY)}px)`
                : ZONES.sign.top,
              left: ZONES.sign.left,
              width: ZONES.sign.width,
              height: ZONES.sign.height,
            }}
            onClick={() => activeZones.includes('sign') && onZoneClick?.('sign')}
            className="absolute z-10 flex items-center justify-center transition-all"
          >
            {!isSherlockMode && signDesign && (
              <div className="w-full h-full flex items-center justify-center filter drop-shadow-2xl">
                <SignRender
                  design={signDesign}
                  fitContainer={true}
                  selectedIconId={selectedSignIconId}
                  onIconPointerDown={onSignIconPointerDown}
                  onIconClick={onSignIconClick}
                  containerRef={signContainerRef}
                />
              </div>
            )}
          </div>

          {/* ================= ZONE 2: POSTER (Рамка на стене) ================= */}
          {(posterDesign || activeZones.includes('poster')) && (
            <div
              style={{
                top: ZONES.poster.top,
                left: ZONES.poster.left,
                width: ZONES.poster.width,
                height: ZONES.poster.height,
              }}
              onClick={() => activeZones.includes('poster') && onZoneClick?.('poster')}
              className={`absolute z-10 flex items-center justify-center transition-all ${getZoneHighlight('poster')}`}
            >
              {!isSherlockMode && posterDesign ? (
                <div className="transform scale-90 sm:scale-100 filter drop-shadow-2xl">
                  <PosterRender design={posterDesign} scale={0.75} />
                </div>
              ) : null}
            </div>
          )}

          {/* ================= ZONE 4: WINDOW ================= */}
          <div
            style={{
              top: ZONES.window.top,
              left: ZONES.window.left,
              width: ZONES.window.width,
              height: ZONES.window.height,
            }}
            onClick={() => (activeZones.includes('window') || activeZones.includes('windowR')) && onZoneClick?.('window')}
            className={`absolute z-10 transition-all ${getZoneHighlight('window')}`}
          >
            {!isSherlockMode && stickersDesign && (
              <StickersRender design={stickersDesign} zone="window" scale={0.75} />
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
            className={`absolute z-10 transition-all ${getZoneHighlight('door')}`}
          >
            {!isSherlockMode && stickersDesign && (
              <StickersRender design={stickersDesign} zone="door" scale={0.7} />
            )}
          </div>

          {/* Optional Children overlaid directly on facade coordinate space */}
          {children}
        </div>
      </div>
    </div>
  );
};

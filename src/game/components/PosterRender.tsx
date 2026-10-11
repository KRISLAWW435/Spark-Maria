import React from 'react';
import { PosterDesign } from '../types';
import { getStickerSrc } from '../constants/stickers';

interface PosterRenderProps {
  design: PosterDesign;
  scale?: number;
  className?: string;
  onClick?: () => void;
  showHandles?: boolean;
}

export const PosterRender: React.FC<PosterRenderProps> = ({
  design,
  scale = 1.0,
  className = '',
  onClick,
  showHandles = false,
}) => {
  const {
    template = 'top',
    title = 'СВЕЖИЕ ЭКЛЕРЫ!',
    subtitle = 'Каждое утро с 8:00',
    image = 'icon12',
    cta = 'Заходи!',
    background = '#FFF1F2',
  } = design;

  // Aspect ratio 2:3. Base width 200px, height 300px
  const widthPx = Math.round(200 * scale);
  const heightPx = Math.round(300 * scale);
  const imgSrc = getStickerSrc(image);

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: background,
        width: `${widthPx}px`,
        height: `${heightPx}px`,
      }}
      className={`relative rounded-2xl shadow-xl border-4 border-white/90 overflow-hidden select-none flex flex-col justify-between p-3.5 transition-all group ${className}`}
    >
      {/* Handles */}
      {showHandles && (
        <>
          <div className="absolute inset-0 border-2 border-dashed border-indigo-400 pointer-events-none rounded-2xl" />
          <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-indigo-500 rounded-full border-2 border-white shadow-sm" />
          <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-indigo-500 rounded-full border-2 border-white shadow-sm" />
          <div className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-indigo-500 rounded-full border-2 border-white shadow-sm" />
          <div className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-indigo-500 rounded-full border-2 border-white shadow-sm" />
        </>
      )}

      {/* Decorative frame inner border */}
      <div className="absolute inset-1.5 border border-slate-900/10 rounded-xl pointer-events-none" />

      {template === 'top' && (
        <div className="flex-1 flex flex-col justify-between items-center text-center z-10">
          {/* Picture on top */}
          <div className="w-full flex-1 flex items-center justify-center p-1">
            <img
              src={imgSrc}
              alt="Афиша"
              className="max-h-[85%] max-w-[85%] object-contain drop-shadow-md group-hover:scale-105 transition-transform"
            />
          </div>

          {/* Texts below */}
          <div className="w-full space-y-1 mb-2">
            <h3
              style={{ fontSize: `${Math.max(12, 17 * scale)}px` }}
              className="font-black text-slate-900 uppercase tracking-tight leading-tight px-1"
            >
              {title}
            </h3>
            <p
              style={{ fontSize: `${Math.max(9, 11 * scale)}px` }}
              className="font-bold text-slate-600 leading-snug px-1"
            >
              {subtitle}
            </p>
          </div>

          {/* CTA Button */}
          <div className="w-full pt-1">
            <div
              style={{ fontSize: `${Math.max(10, 12 * scale)}px` }}
              className="w-full py-1.5 px-3 rounded-xl bg-slate-900 text-white font-black uppercase tracking-wider text-center shadow-md group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors"
            >
              {cta}
            </div>
          </div>
        </div>
      )}

      {template === 'center' && (
        <div className="flex-1 flex flex-col justify-between items-center text-center z-10">
          {/* Header on top */}
          <div className="w-full pt-1">
            <h3
              style={{ fontSize: `${Math.max(12, 18 * scale)}px` }}
              className="font-black text-slate-900 uppercase tracking-tight leading-tight px-1"
            >
              {title}
            </h3>
            <p
              style={{ fontSize: `${Math.max(9, 11 * scale)}px` }}
              className="font-semibold text-slate-600 mt-0.5 px-1"
            >
              {subtitle}
            </p>
          </div>

          {/* Picture in center */}
          <div className="w-full flex-1 flex items-center justify-center p-2">
            <img
              src={imgSrc}
              alt="Афиша"
              className="max-h-[90%] max-w-[90%] object-contain drop-shadow-lg group-hover:scale-110 transition-transform"
            />
          </div>

          {/* CTA Button bottom */}
          <div className="w-full pb-1">
            <div
              style={{ fontSize: `${Math.max(10, 12 * scale)}px` }}
              className="w-full py-2 px-3 rounded-xl bg-amber-500 border-b-2 border-amber-600 text-slate-950 font-black uppercase tracking-wider text-center shadow-md"
            >
              {cta}
            </div>
          </div>
        </div>
      )}

      {template === 'diagonal' && (
        <div className="flex-1 flex flex-col justify-between z-10 relative overflow-hidden">
          {/* Diagonal ribbon background element */}
          <div className="absolute -right-12 -top-12 w-32 h-32 bg-white/40 transform rotate-45 pointer-events-none rounded-2xl" />

          {/* Top Title Left aligned */}
          <div className="text-left pt-1">
            <span
              style={{ fontSize: `${Math.max(8, 10 * scale)}px` }}
              className="px-2 py-0.5 rounded-full bg-slate-900 text-white font-bold uppercase tracking-wider inline-block mb-1"
            >
              Рекомендуем!
            </span>
            <h3
              style={{ fontSize: `${Math.max(13, 17 * scale)}px` }}
              className="font-black text-slate-900 uppercase tracking-tight leading-tight"
            >
              {title}
            </h3>
          </div>

          {/* Image tilted slightly */}
          <div className="w-full flex-1 flex items-center justify-center p-1">
            <img
              src={imgSrc}
              alt="Афиша"
              className="max-h-[85%] max-w-[85%] object-contain drop-shadow-md transform -rotate-3 group-hover:rotate-0 transition-transform"
            />
          </div>

          {/* Subtitle and button */}
          <div className="space-y-1.5 pb-1">
            <p
              style={{ fontSize: `${Math.max(9, 11 * scale)}px` }}
              className="font-bold text-slate-700 text-center"
            >
              {subtitle}
            </p>
            <div
              style={{ fontSize: `${Math.max(10, 12 * scale)}px` }}
              className="w-full py-1.5 px-3 rounded-xl bg-rose-500 text-white font-black uppercase tracking-wider text-center shadow-md group-hover:bg-rose-600 transition-colors"
            >
              {cta}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { StickerItem, StickersDesign } from '../types';
import { getStickerSrc } from '../constants/stickers';

interface StickersRenderProps {
  design: StickersDesign;
  zone?: 'windowL' | 'windowR' | 'door';
  scale?: number;
  className?: string;
  onStickerClick?: (sticker: StickerItem) => void;
  selectedStickerId?: string | null;
}

export const SingleStickerRender: React.FC<{
  sticker: StickerItem;
  scale?: number;
  isSelected?: boolean;
  onClick?: () => void;
}> = ({ sticker, scale = 1.0, isSelected = false, onClick }) => {
  const { shape, image, color, text } = sticker;
  const imgSrc = getStickerSrc(image);

  let shapeClasses = 'flex flex-col items-center justify-center transition-transform';
  if (shape === 'circle') shapeClasses += ' rounded-full aspect-square p-2';
  else if (shape === 'oval') shapeClasses += ' rounded-[50px] px-3 py-1.5';
  else if (shape === 'cloud') shapeClasses += ' rounded-3xl p-2.5';
  else if (shape === 'star') shapeClasses += ' rounded-2xl p-2 border-dashed';

  const baseSize = 64 * scale;

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: color || '#FEF3C7',
        minWidth: `${baseSize}px`,
      }}
      className={`relative shadow-md border-2 border-white/90 select-none ${shapeClasses} ${
        isSelected ? 'ring-4 ring-amber-400 scale-105 z-20' : 'hover:scale-105'
      }`}
    >
      <img
        src={imgSrc}
        alt={text || 'наклейка'}
        style={{ width: `${36 * scale}px`, height: `${36 * scale}px` }}
        className="object-contain drop-shadow-sm pointer-events-none"
      />
      {text && (
        <span
          style={{ fontSize: `${Math.max(8, 10 * scale)}px` }}
          className="font-black text-slate-900 tracking-tight leading-none mt-1 px-1 bg-white/70 rounded-full"
        >
          {text}
        </span>
      )}
    </div>
  );
};

export const StickersRender: React.FC<StickersRenderProps> = ({
  design,
  zone,
  scale = 1.0,
  className = '',
  onStickerClick,
  selectedStickerId,
}) => {
  const stickers = zone
    ? design.stickers.filter((s) => !s.targetZone || s.targetZone === zone)
    : design.stickers;

  return (
    <div className={`relative w-full h-full pointer-events-none ${className}`}>
      {stickers.map((stk) => {
        const posX = Math.max(5, Math.min(85, stk.position.x));
        const posY = Math.max(5, Math.min(85, stk.position.y));

        return (
          <div
            key={stk.id}
            style={{
              left: `${posX}%`,
              top: `${posY}%`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute pointer-events-auto cursor-pointer"
          >
            <SingleStickerRender
              sticker={stk}
              scale={scale}
              isSelected={selectedStickerId === stk.id}
              onClick={() => onStickerClick?.(stk)}
            />
          </div>
        );
      })}
    </div>
  );
};

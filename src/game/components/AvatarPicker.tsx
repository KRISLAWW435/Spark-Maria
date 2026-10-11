import React, { useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AvatarShape } from '../types';
import { SVG_AVATAR_SHAPES, getShapeMaskStyle } from '../shapes';
import { soundEngine } from '../engine/SoundEngine';
import { InlineColorWheel } from './InlineColorWheel';
import {
  Upload,
  Check,
  Shapes,
  UserCheck,
  Palette,
  ZoomIn,
  ZoomOut,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  MoveVertical,
  MoveHorizontal,
  Move,
} from 'lucide-react';

export interface AvatarItem {
  id: string;
  label: string;
  src: string;
}

export const PRESET_AVATARS: AvatarItem[] = [
  { id: 'avatar1', label: 'Аватар 1', src: '/assets/avatars/avatar1.png' },
  { id: 'avatar2', label: 'Аватар 2', src: '/assets/avatars/avatar2.png' },
  { id: 'avatar3', label: 'Аватар 3', src: '/assets/avatars/avatar3.png' },
  { id: 'avatar4', label: 'Аватар 4', src: '/assets/avatars/avatar4.png' },
  { id: 'avatar5', label: 'Аватар 5', src: '/assets/avatars/avatar5.png' },
  { id: 'avatar6', label: 'Аватар 6', src: '/assets/avatars/avatar6.png' },
  { id: 'avatar7', label: 'Аватар 7', src: '/assets/avatars/avatar7.png' },
  { id: 'avatar8', label: 'Аватар 8', src: '/assets/avatars/avatar8.png' },
];

export const STUDIO_COLORS = [
  '#5834f5', // Фиолетовый
  '#2970ff', // Синий
  '#10b981', // Зелёный
  '#ffb738', // Жёлтый
  '#ff5c47', // Оранжевый
  '#e11d48', // Красный
];

interface AvatarPickerProps {
  selectedAvatar: string;
  onSelectAvatar: (avatarId: string) => void;
  selectedAvatarScale: number;
  onSelectAvatarScale: (scale: number) => void;
  selectedAvatarOffsetY: number;
  onSelectAvatarOffsetY: (offsetY: number) => void;
  selectedAvatarOffsetX?: number;
  onSelectAvatarOffsetX: (offsetX: number) => void;
  selectedShape: AvatarShape;
  onSelectShape: (shape: AvatarShape) => void;
  selectedColor: string;
  onSelectColor: (color: string) => void;
  customAvatarUrl: string | null;
  onUploadCustomAvatar: (dataUrl: string) => void;
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({
  selectedAvatar,
  onSelectAvatar,
  selectedAvatarScale = 1,
  onSelectAvatarScale,
  selectedAvatarOffsetY = 0,
  onSelectAvatarOffsetY,
  selectedAvatarOffsetX = 0,
  onSelectAvatarOffsetX,
  selectedShape,
  onSelectShape,
  selectedColor,
  onSelectColor,
  customAvatarUrl,
  onUploadCustomAvatar,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isColorWheelOpen, setIsColorWheelOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawDataUrl = event.target?.result as string;
        if (!rawDataUrl) return;

        // Resize and optimize image through canvas to keep size under ~40KB
        // This guarantees localStorage never exceeds quota and avatar never resets/crashes
        const img = new Image();
        img.onload = () => {
          const maxDim = 480;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
            onUploadCustomAvatar(optimizedDataUrl);
            soundEngine.playPop();
          } else {
            onUploadCustomAvatar(rawDataUrl);
            soundEngine.playPop();
          }
        };
        img.onerror = () => {
          onUploadCustomAvatar(rawDataUrl);
          soundEngine.playPop();
        };
        img.src = rawDataUrl;
      };
      reader.readAsDataURL(file);
    }
    // Clear input so user can pick same or new file again
    e.target.value = '';
  };

  const maskStyle = getShapeMaskStyle(selectedShape);
  const isPresetColor = STUDIO_COLORS.some(
    (c) => c.toLowerCase() === selectedColor.toLowerCase()
  );

  const isPositionShifted = selectedAvatarOffsetX !== 0 || selectedAvatarOffsetY !== 0;

  return (
    <div className="space-y-4">
      {/* 1. SELECTION OF SVG SHAPES: 2 ROWS OF 4 SHAPES (ENLARGED FOR CLARITY) */}
      <div className="space-y-2">
        <label className="text-sm font-extrabold text-indigo-900 flex items-center gap-1.5">
          <Shapes className="w-4 h-4 text-indigo-500" /> Форма аватара
        </label>

        <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
          {SVG_AVATAR_SHAPES.map((shape) => {
            const isSelected = selectedShape === shape.id;
            return (
              <button
                key={shape.id}
                type="button"
                onClick={() => {
                  soundEngine.playPop();
                  onSelectShape(shape.id);
                }}
                className={`group h-14 sm:h-16 rounded-2xl border transition-all flex items-center justify-center shadow-xs cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300'
                    : 'bg-white text-slate-700 border-indigo-100 hover:border-indigo-300 hover:bg-slate-50'
                }`}
                title={shape.label}
              >
                {/* SVG Silhouette Clean Preview - Enlarged */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center">
                  <svg
                    viewBox={shape.viewBox}
                    className="w-full h-full max-h-8 sm:max-h-9 transition-transform group-hover:scale-115"
                    fill="currentColor"
                  >
                    <path
                      d={shape.pathD}
                      fillRule={shape.fillRule || 'nonzero'}
                      clipRule={shape.fillRule || 'nonzero'}
                    />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. AVATAR SELECTION (CLIPPED BY SELECTED SHAPE MASK WITH STUDIO COLOR FILL) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-extrabold text-indigo-900 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-indigo-500" /> Твой аватар
          </label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" /> Загрузить своё фото
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* 8 Preset Avatars Grid - Enlarged */}
        <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
          {PRESET_AVATARS.map((item) => {
            const isSelected = selectedAvatar === item.id && !customAvatarUrl;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  soundEngine.playPop();
                  onSelectAvatar(item.id);
                }}
                className={`relative w-full aspect-square max-w-[76px] sm:max-w-[82px] h-17 sm:h-20 rounded-2xl overflow-hidden transition-transform duration-200 hover:scale-108 active:scale-95 shadow-sm p-0.5 flex items-center justify-center cursor-pointer ${
                  isSelected
                    ? 'ring-3 ring-indigo-600 shadow-md scale-105'
                    : 'hover:bg-slate-50 opacity-90 hover:opacity-100'
                }`}
              >
                {/* Masked Preview of Avatar with studio color fill and complete image display */}
                <div
                  style={{
                    ...maskStyle,
                    backgroundColor: selectedColor,
                  }}
                  className="w-full h-full flex items-center justify-center overflow-hidden transition-colors duration-300"
                >
                  <img
                    src={item.src}
                    alt={item.label}
                    referrerPolicy="no-referrer"
                    style={{
                      transform: isSelected
                        ? `translate(${selectedAvatarOffsetX}px, ${selectedAvatarOffsetY}px) scale(${selectedAvatarScale})`
                        : 'scale(1)',
                      transition: 'transform 0.15s ease-out',
                    }}
                    className="w-full h-full object-contain p-1 select-none origin-center"
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Uploaded Avatar Indicator & Quick Actions */}
        {customAvatarUrl && (
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 shadow-xs">
            <div className="flex items-center gap-3">
              <div
                style={{ ...maskStyle, backgroundColor: selectedColor, width: 48, height: 48 }}
                className="overflow-hidden shrink-0 flex items-center justify-center shadow-xs"
              >
                <img
                  src={customAvatarUrl}
                  alt="Custom Avatar"
                  style={{
                    transform: `translate(${selectedAvatarOffsetX}px, ${selectedAvatarOffsetY}px) scale(${selectedAvatarScale})`,
                    transition: 'transform 0.15s ease-out',
                  }}
                  className="w-full h-full object-cover select-none origin-center"
                />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-black text-indigo-950 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> Своё фото сохранено
                </span>
                <p className="text-[11px] text-slate-500 font-medium">
                  Используется для аватара студии
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-xl text-xs font-bold text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 transition-colors cursor-pointer shadow-2xs"
                title="Выбрать другое изображение"
              >
                Заменить
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playPop();
                  onSelectAvatar('avatar1');
                  onUploadCustomAvatar('');
                }}
                className="px-2.5 py-1 rounded-xl text-xs font-bold text-rose-600 bg-white border border-rose-200 hover:bg-rose-50 transition-colors cursor-pointer shadow-2xs"
                title="Удалить своё фото и выбрать персонажа"
              >
                Удалить
              </button>
            </div>
          </div>
        )}

        {/* Avatar Zoom / Scaling */}
        <div className="p-2.5 sm:p-3 bg-indigo-50/80 rounded-2xl border border-indigo-100/90 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
              <ZoomIn className="w-3.5 h-3.5 text-indigo-600" /> Масштаб картинки
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-indigo-600 bg-white px-2 py-0.5 rounded-full border border-indigo-200/90 shadow-2xs">
                {Math.round(selectedAvatarScale * 100)}%
              </span>
              {selectedAvatarScale !== 1 && (
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playPop();
                    onSelectAvatarScale(1);
                  }}
                  className="text-[11px] font-extrabold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                  title="Вернуть исходный масштаб"
                >
                  Сброс
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                soundEngine.playPop();
                onSelectAvatarScale(Math.max(0.6, Number((selectedAvatarScale - 0.1).toFixed(2))));
              }}
              disabled={selectedAvatarScale <= 0.6}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl border-2 flex items-center justify-center transition-all shrink-0 ${
                selectedAvatarScale <= 0.6
                  ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50 shadow-xs cursor-pointer active:scale-90'
              }`}
              title="Уменьшить"
            >
              <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="flex-1 px-1 py-1 flex items-center">
              <input
                type="range"
                min="0.6"
                max="2.2"
                step="0.05"
                value={selectedAvatarScale}
                onChange={(e) => onSelectAvatarScale(parseFloat(e.target.value))}
                className="kid-slider"
                aria-label="Масштаб картинки"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                soundEngine.playPop();
                onSelectAvatarScale(Math.min(2.2, Number((selectedAvatarScale + 0.1).toFixed(2))));
              }}
              disabled={selectedAvatarScale >= 2.2}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl border-2 flex items-center justify-center transition-all shrink-0 ${
                selectedAvatarScale >= 2.2
                  ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                  : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50 shadow-xs cursor-pointer active:scale-90'
              }`}
              title="Увеличить"
            >
              <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Avatar Position (Up / Down & Left / Right) - Simple and Kid Friendly */}
        <div className="p-3 sm:p-3.5 bg-indigo-50/80 rounded-2xl border border-indigo-100/90 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
              <Move className="w-3.5 h-3.5 text-indigo-600" /> Положение картинки
            </label>
            {isPositionShifted && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playPop();
                  onSelectAvatarOffsetY(0);
                  onSelectAvatarOffsetX(0);
                }}
                className="text-[11px] font-extrabold text-indigo-600 bg-white px-2.5 py-1 rounded-full border border-indigo-200 shadow-2xs hover:bg-indigo-50 transition-colors cursor-pointer"
                title="Вернуть картинку ровно по центру"
              >
                По центру
              </button>
            )}
          </div>

          {/* Vertical: Up / Down */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1">
                <MoveVertical className="w-3.5 h-3.5 text-indigo-500" /> Вверх / Вниз:
              </span>
              <span className="text-indigo-700 font-extrabold text-xs">
                {selectedAvatarOffsetY === 0
                  ? 'По центру'
                  : selectedAvatarOffsetY < 0
                  ? 'Вверх'
                  : 'Вниз'}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playPop();
                  onSelectAvatarOffsetY(Math.max(-50, selectedAvatarOffsetY - 4));
                }}
                disabled={selectedAvatarOffsetY <= -50}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl border-2 flex items-center justify-center transition-all shrink-0 ${
                  selectedAvatarOffsetY <= -50
                    ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                    : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50 shadow-xs cursor-pointer active:scale-90'
                }`}
                title="Поднять выше"
              >
                <ArrowUp className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
              </button>

              <div className="flex-1 px-1 py-1 flex items-center">
                <input
                  type="range"
                  min="-50"
                  max="50"
                  step="2"
                  value={selectedAvatarOffsetY}
                  onChange={(e) => onSelectAvatarOffsetY(parseInt(e.target.value, 10))}
                  className="kid-slider"
                  aria-label="Положение вверх / вниз"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playPop();
                  onSelectAvatarOffsetY(Math.min(50, selectedAvatarOffsetY + 4));
                }}
                disabled={selectedAvatarOffsetY >= 50}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl border-2 flex items-center justify-center transition-all shrink-0 ${
                  selectedAvatarOffsetY >= 50
                    ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                    : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50 shadow-xs cursor-pointer active:scale-90'
                }`}
                title="Опустить ниже"
              >
                <ArrowDown className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Horizontal: Left / Right */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1">
                <MoveHorizontal className="w-3.5 h-3.5 text-indigo-500" /> Влево / Вправо:
              </span>
              <span className="text-indigo-700 font-extrabold text-xs">
                {selectedAvatarOffsetX === 0
                  ? 'По центру'
                  : selectedAvatarOffsetX < 0
                  ? 'Влево'
                  : 'Вправо'}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playPop();
                  onSelectAvatarOffsetX(Math.max(-50, selectedAvatarOffsetX - 4));
                }}
                disabled={selectedAvatarOffsetX <= -50}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl border-2 flex items-center justify-center transition-all shrink-0 ${
                  selectedAvatarOffsetX <= -50
                    ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                    : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50 shadow-xs cursor-pointer active:scale-90'
                }`}
                title="Сдвинуть влево"
              >
                <ArrowLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
              </button>

              <div className="flex-1 px-1 py-1 flex items-center">
                <input
                  type="range"
                  min="-50"
                  max="50"
                  step="2"
                  value={selectedAvatarOffsetX}
                  onChange={(e) => onSelectAvatarOffsetX(parseInt(e.target.value, 10))}
                  className="kid-slider"
                  aria-label="Положение влево / вправо"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playPop();
                  onSelectAvatarOffsetX(Math.min(50, selectedAvatarOffsetX + 4));
                }}
                disabled={selectedAvatarOffsetX >= 50}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl border-2 flex items-center justify-center transition-all shrink-0 ${
                  selectedAvatarOffsetX >= 50
                    ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                    : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50 shadow-xs cursor-pointer active:scale-90'
                }`}
                title="Сдвинуть вправо"
              >
                <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. AVATAR BACKGROUND COLOR (WITH INLINE COLOR WHEEL) */}
      <div className="space-y-2">
        <label className="text-sm font-extrabold text-indigo-900 flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-indigo-500" /> Цвет фона аватара
        </label>
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          {STUDIO_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => {
                soundEngine.playPop();
                onSelectColor(color);
                setIsColorWheelOpen(false);
              }}
              style={{ backgroundColor: color }}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full transition-all transform hover:scale-110 shadow-md flex items-center justify-center cursor-pointer ${
                selectedColor.toLowerCase() === color.toLowerCase()
                  ? 'ring-4 ring-indigo-600 scale-110'
                  : 'opacity-90 hover:opacity-100'
              }`}
            >
              {selectedColor.toLowerCase() === color.toLowerCase() && (
                <Check className="w-5 h-5 text-white stroke-[3] drop-shadow-md" />
              )}
            </button>
          ))}

          {/* Custom Color Wheel Toggle Button (+) */}
          <button
            type="button"
            title={isColorWheelOpen ? 'Скрыть цветовой круг' : 'Выбрать свой цвет на круге'}
            onClick={() => {
              soundEngine.playPop();
              setIsColorWheelOpen((prev) => !prev);
            }}
            className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-full cursor-pointer transition-all transform hover:scale-110 shadow-md flex items-center justify-center shrink-0 border-2 border-white ${
              !isPresetColor || isColorWheelOpen
                ? 'ring-4 ring-indigo-600 scale-110 shadow-lg'
                : 'hover:opacity-100 ring-2 ring-slate-200'
            }`}
            style={{
              background: !isPresetColor
                ? selectedColor
                : 'conic-gradient(from 180deg at 50% 50%, #FF0055 0deg, #FFA500 51deg, #FFE600 102deg, #00E676 153deg, #00B0FF 204deg, #651FFF 255deg, #D500F9 306deg, #FF0055 360deg)',
            }}
          >
            {!isPresetColor && !isColorWheelOpen ? (
              <Check className="w-5 h-5 text-white stroke-[3] drop-shadow-md pointer-events-none" />
            ) : (
              <span className="text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)] font-black text-xl leading-none pointer-events-none">
                {isColorWheelOpen ? '✕' : '+'}
              </span>
            )}
          </button>
        </div>

        {/* Inline Color Wheel Panel (Smooth 0.3s Unfold) */}
        <AnimatePresence>
          {isColorWheelOpen && (
            <InlineColorWheel
              color={selectedColor}
              onChangeColor={(newColor) => {
                onSelectColor(newColor);
              }}
              onClose={() => {
                setIsColorWheelOpen(false);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

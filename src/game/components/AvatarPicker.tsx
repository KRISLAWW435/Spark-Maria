import React, { useRef } from 'react';
import { AvatarShape } from '../types';
import { SVG_AVATAR_SHAPES, getShapeMaskStyle } from '../shapes';
import { soundEngine } from '../engine/SoundEngine';
import { Upload, Check, Shapes, UserCheck, Palette } from 'lucide-react';

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
  '#5834f5', // Vibrant Indigo / Purple
  '#2970ff', // Electric Blue
  '#c7e834', // Lime Chartreuse
  '#ffb738', // Amber Gold
  '#ff5c47', // Coral Red-Orange
  '#f43f5e', // Rose Pink
];

interface AvatarPickerProps {
  selectedAvatar: string;
  onSelectAvatar: (avatarId: string) => void;
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
  selectedShape,
  onSelectShape,
  selectedColor,
  onSelectColor,
  customAvatarUrl,
  onUploadCustomAvatar,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          onUploadCustomAvatar(result);
          soundEngine.playPop();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const maskStyle = getShapeMaskStyle(selectedShape);

  return (
    <div className="space-y-6">
      {/* 1. SELECTION OF SVG SHAPES (NO TEXT LABELS, NO SVG-МАСКИ) */}
      <div className="space-y-2.5">
        <label className="text-sm font-extrabold text-indigo-900 flex items-center gap-1.5">
          <Shapes className="w-4 h-4 text-indigo-500" /> Форма аватара
        </label>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-1.5">
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
                className={`group h-12 rounded-2xl border transition-all flex items-center justify-center shadow-xs ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300'
                    : 'bg-white text-slate-700 border-indigo-100 hover:border-indigo-300 hover:bg-slate-50'
                }`}
                title={shape.label}
              >
                {/* SVG Silhouette Clean Preview */}
                <div className="w-7 h-7 flex items-center justify-center">
                  <svg
                    viewBox={shape.viewBox}
                    className="w-full h-full max-h-6 transition-transform group-hover:scale-115"
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
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-extrabold text-indigo-900 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-indigo-500" /> Твой аватар
          </label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" /> Загрузить свой
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* 8 Preset Avatars Grid */}
        <div className="grid grid-cols-4 gap-2.5">
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
                className={`relative w-15 h-15 rounded-2xl overflow-hidden transition-all transform hover:scale-105 shadow-sm p-0.5 flex items-center justify-center cursor-pointer ${
                  isSelected
                    ? 'ring-3 ring-indigo-600 shadow-md scale-105'
                    : 'hover:bg-slate-50 opacity-90 hover:opacity-100'
                }`}
                title={item.label}
              >
                {/* Masked Preview of Avatar with studio color fill and no border */}
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
                    className="w-full h-full object-cover select-none"
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Uploaded Avatar Indicator */}
        {customAvatarUrl && (
          <div className="flex items-center justify-between p-2.5 bg-indigo-50 rounded-2xl border border-indigo-200">
            <div className="flex items-center gap-3">
              <div
                style={{ ...maskStyle, backgroundColor: selectedColor, width: 44, height: 44 }}
                className="overflow-hidden shrink-0 flex items-center justify-center"
              >
                <img
                  src={customAvatarUrl}
                  alt="Custom Avatar"
                  className="w-full h-full object-cover select-none"
                />
              </div>
              <span className="text-xs font-bold text-indigo-900">
                Собственный аватар выбран
              </span>
            </div>
            <button
              type="button"
              onClick={() => onSelectAvatar('avatar1')}
              className="text-xs font-bold text-rose-500 hover:text-rose-700 cursor-pointer"
            >
              Сбросить
            </button>
          </div>
        )}
      </div>

      {/* 3. STUDIO COLOR (APPLIES TO SHAPE BACKDROP) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-extrabold text-indigo-900 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-indigo-500" /> Цвет студии
          </label>
          <span className="text-[11px] font-semibold text-slate-500">
            Цвет фона аватара
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          {STUDIO_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => {
                soundEngine.playPop();
                onSelectColor(color);
              }}
              style={{ backgroundColor: color }}
              className={`w-12 h-12 rounded-full transition-all transform hover:scale-110 shadow-md flex items-center justify-center ${
                selectedColor === color
                  ? 'ring-4 ring-slate-900/30 scale-110'
                  : 'opacity-90 hover:opacity-100'
              }`}
            >
              {selectedColor === color && (
                <Check className="w-5 h-5 text-white stroke-[3] drop-shadow-md" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

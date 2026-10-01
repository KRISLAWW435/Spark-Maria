import React from 'react';
import { AvatarShape } from '../types';
import { getShapeMaskStyle } from '../shapes';
import { PRESET_AVATARS } from './AvatarPicker';
import { Pencil, Sparkles } from 'lucide-react';

interface StudioWallProps {
  isCreated: boolean;
  isEditing: boolean;
  name: string;
  font: string;
  avatar: string;
  customAvatarUrl: string | null;
  shape: AvatarShape;
  color: string;
  permanentNameColor: string;
  onOpenEditPanel: () => void;
}

export const StudioWall: React.FC<StudioWallProps> = ({
  isCreated,
  isEditing,
  name,
  font,
  avatar,
  customAvatarUrl,
  shape,
  color,
  permanentNameColor,
  onOpenEditPanel,
}) => {
  const maskStyle = getShapeMaskStyle(shape);

  // Render avatar image inside masked container
  const renderAvatarContent = () => {
    if (customAvatarUrl && avatar === 'custom') {
      return (
        <img
          src={customAvatarUrl}
          alt="Avatar"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      );
    }
    const preset = PRESET_AVATARS.find((a) => a.id === avatar) || PRESET_AVATARS[0];
    return (
      <img
        src={preset.src}
        alt={preset.label}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover"
      />
    );
  };

  const showUnconfiguredState = !isCreated && !isEditing;

  return (
    <div className="absolute top-[10%] sm:top-[12%] md:top-[14%] left-[50%] md:left-[52%] -translate-x-1/2 z-35 pointer-events-auto select-none">
      {showUnconfiguredState ? (
        /* UNCONFIGURED: Pulsing '+' with «Создай свою студию» */
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenEditPanel();
          }}
          className="group cursor-pointer flex flex-col items-center transition-all duration-300 transform hover:scale-105 active:scale-95 border-0 bg-transparent outline-none focus:ring-4 focus:ring-indigo-400/50 rounded-full p-2"
          title="Нажми, чтобы создать свою студию"
        >
          {/* Pulsing Dashed Circle with Rainbow Glowing Ambient Ring */}
          <div className="relative">
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-pink-500 via-indigo-500 to-cyan-400 opacity-40 blur-lg animate-pulse" />
            
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full bg-white/95 backdrop-blur-md border-[3.5px] border-dashed border-indigo-400 flex items-center justify-center shadow-2xl group-hover:border-indigo-600 group-hover:bg-white transition-all">
              <span className="text-6xl md:text-7xl font-light text-indigo-500 group-hover:text-indigo-700 transition-colors leading-none select-none">
                +
              </span>
            </div>
          </div>

          {/* Prompt: «Создай свою студию» */}
          <span className="mt-3 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-black text-xs sm:text-sm shadow-lg flex items-center gap-1.5 animate-bounce ring-2 ring-white/60">
            <Sparkles className="w-4 h-4 text-amber-300" /> Создай свою студию
          </span>

          {/* Title below */}
          <span
            style={{
              fontFamily: font,
              color: permanentNameColor,
            }}
            className="mt-1.5 text-base sm:text-lg md:text-xl font-black drop-shadow-[0_2px_4px_rgba(255,255,255,0.95)] tracking-wide group-hover:brightness-110 transition-colors text-center px-4"
          >
            Название студии
          </span>
        </button>
      ) : (
        /* CONFIGURED / EDITING: Static avatar masked by user's SVG shape */
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (!isEditing) onOpenEditPanel();
          }}
          className="group cursor-pointer flex flex-col items-center transition-all duration-300 transform hover:scale-105 active:scale-95"
          title="Нажмите для редактирования студии"
        >
          {/* Outer Masked Shape Container with Drop-Shadow */}
          <div
            style={{
              filter: 'drop-shadow(0 14px 28px rgba(0,0,0,0.25))',
            }}
            className="relative transition-transform duration-300"
          >
            {/* Single borderless shape with studio color fill and avatar */}
            <div
              style={{
                ...maskStyle,
                backgroundColor: color,
              }}
              className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 overflow-hidden flex items-center justify-center transition-colors duration-300 relative border-0 outline-none"
            >
              {renderAvatarContent()}
            </div>

            {/* Edit Pencil Badge */}
            <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-white text-slate-800 shadow-lg flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all border border-slate-200">
              <Pencil className="w-4 h-4 text-indigo-600" />
            </div>
          </div>

          {/* Studio Name in Permanent Violet/Blue Color */}
          <span
            style={{
              fontFamily: font,
              color: permanentNameColor,
            }}
            className="mt-3.5 text-lg sm:text-xl md:text-2xl font-black drop-shadow-[0_2px_6px_rgba(255,255,255,0.95)] tracking-wide group-hover:brightness-110 transition-all text-center px-4 max-w-sm truncate"
          >
            {name}
          </span>
        </div>
      )}
    </div>
  );
};

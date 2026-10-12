import React from 'react';
import { AvatarShape, StudioFontSize, getAssetUrl } from '../types';
import { getShapeMaskStyle } from '../shapes';
import { PRESET_AVATARS } from './AvatarPicker';
import { Pencil, Sparkles } from 'lucide-react';

interface StudioWallProps {
  isCreated: boolean;
  isEditing: boolean;
  name: string;
  font: string;
  fontSize?: StudioFontSize;
  avatar: string;
  avatarScale?: number;
  avatarOffsetY?: number;
  avatarOffsetX?: number;
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
  fontSize = 'md',
  avatar,
  avatarScale = 1,
  avatarOffsetY = 0,
  avatarOffsetX = 0,
  customAvatarUrl,
  shape,
  color,
  permanentNameColor,
  onOpenEditPanel,
}) => {
  const maskStyle = getShapeMaskStyle(shape);

  // Converts hex color into a soft neon glow filter in the matching background color
  const getAvatarNeonGlow = (hexColor: string) => {
    if (hexColor && hexColor.startsWith('#') && hexColor.length === 7) {
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);
      return `drop-shadow(0 0 6px rgba(${r}, ${g}, ${b}, 0.65)) drop-shadow(0 0 16px rgba(${r}, ${g}, ${b}, 0.35))`;
    }
    return `drop-shadow(0 0 6px ${hexColor}) drop-shadow(0 0 14px ${hexColor})`;
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-base sm:text-lg md:text-xl lg:text-2xl';
      case 'lg':
        return 'text-xl sm:text-2xl md:text-3xl lg:text-4xl';
      case 'md':
      default:
        return 'text-lg sm:text-xl md:text-2xl lg:text-3xl';
    }
  };

  // Render avatar image inside masked container with scale and offset (X / Y)
  const renderAvatarContent = () => {
    const imgStyle: React.CSSProperties = {
      transform: `translate(${avatarOffsetX}px, ${avatarOffsetY}px) scale(${avatarScale})`,
      transition: 'transform 0.12s ease-out',
    };

    const isCustom =
      avatar === 'custom' ||
      Boolean(customAvatarUrl) ||
      avatar.startsWith('data:') ||
      avatar.startsWith('http');
    const customSrc =
      customAvatarUrl ||
      (avatar.startsWith('data:') || avatar.startsWith('http') ? avatar : null);

    if (isCustom && customSrc) {
      return (
        <img
          src={customSrc}
          alt="Avatar"
          referrerPolicy="no-referrer"
          style={imgStyle}
          className="w-full h-full object-cover select-none origin-center"
        />
      );
    }
    const preset = PRESET_AVATARS.find((a) => a.id === avatar) || PRESET_AVATARS[0];
    return (
      <img
        src={getAssetUrl(preset.src)}
        alt={preset.label}
        referrerPolicy="no-referrer"
        style={imgStyle}
        className="w-full h-full object-contain p-1 select-none origin-center"
      />
    );
  };

  const showUnconfiguredState = !isCreated && !isEditing;

  return (
    <div className="absolute top-[2%] sm:top-[2.5%] md:top-[3%] left-[50%] md:left-[51%] -translate-x-1/2 z-35 pointer-events-auto select-none origin-top">
      {showUnconfiguredState ? (
        /* UNCONFIGURED: Pulsing '+' with «Создай свою студию» */
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenEditPanel();
          }}
          className="group cursor-pointer flex flex-col items-center transition-all duration-300 transform hover:scale-105 active:scale-95 border-0 bg-transparent outline-none focus:ring-4 focus:ring-indigo-400/50 rounded-full p-2"
        >
          {/* Pulsing Dashed Circle with Rainbow Glowing Ambient Ring */}
          <div className="relative">
            <div className="absolute -inset-2.5 rounded-full bg-gradient-to-r from-pink-500 via-indigo-500 to-cyan-400 opacity-40 blur-lg animate-pulse" />
            
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-white/95 backdrop-blur-md border-3 border-dashed border-indigo-400 flex items-center justify-center shadow-xl group-hover:border-indigo-600 group-hover:bg-white transition-all">
              <span className="text-4xl sm:text-5xl md:text-6xl font-light text-indigo-500 group-hover:text-indigo-700 transition-colors leading-none select-none">
                +
              </span>
            </div>
          </div>

          {/* Prompt: «Создай свою студию» */}
          <span className="mt-2.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-black text-xs sm:text-sm shadow-lg flex items-center gap-1.5 animate-bounce ring-2 ring-white/60">
            <Sparkles className="w-4 h-4 text-amber-300" /> Создай свою студию
          </span>

          {/* Title below */}
          <span
            style={{
              fontFamily: font,
              color: permanentNameColor,
            }}
            className="mt-1.5 text-sm sm:text-base md:text-lg lg:text-xl font-black drop-shadow-[0_2px_6px_rgba(255,255,255,0.95)] tracking-wide group-hover:brightness-110 transition-colors text-center px-4"
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
        >
          {/* Outer Masked Shape Container with Dynamic Neon Glow matching background color */}
          <div
            style={{
              filter: getAvatarNeonGlow(color),
            }}
            className="relative transition-all duration-300"
          >
            {/* Single borderless shape with studio color fill and avatar */}
            <div
              style={{
                ...maskStyle,
                backgroundColor: color,
              }}
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-52 lg:h-52 overflow-hidden flex items-center justify-center transition-colors duration-300 relative border-0 outline-none"
            >
              {renderAvatarContent()}
            </div>

            {/* Edit Pencil Button with Label: Hidden by default, appears ONLY on hover */}
            {!isEditing && (
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 scale-95 group-hover:scale-100 transition-all duration-200 pointer-events-none z-20">
                <div className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/95 backdrop-blur-md text-indigo-700 shadow-xl border border-indigo-200/90 flex items-center gap-1.5 text-[11px] sm:text-xs font-black whitespace-nowrap">
                  <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-600" />
                  <span>Редактировать</span>
                </div>
              </div>
            )}
          </div>

          {/* Studio Name in Permanent Violet/Blue Color */}
          <span
            style={{
              fontFamily: font,
              color: permanentNameColor,
            }}
            className={`mt-2.5 sm:mt-3 ${getFontSizeClass()} font-black drop-shadow-[0_2px_6px_rgba(255,255,255,0.98)] tracking-wide group-hover:brightness-110 transition-all text-center px-4 max-w-sm sm:max-w-md md:max-w-lg truncate`}
          >
            {name}
          </span>
        </div>
      )}
    </div>
  );
};

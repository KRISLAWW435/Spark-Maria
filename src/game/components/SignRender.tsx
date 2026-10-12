import React from 'react';
import { SignDesign, SignIconItem } from '../types';
import { SignIcon, getFontFamilyClass } from './SignVectorAssets';

interface SignRenderProps {
  design: SignDesign;
  scale?: number;
  className?: string;
  onClick?: () => void;
  showHandles?: boolean;
  fitContainer?: boolean;
  selectedIconId?: string | null;
  onIconPointerDown?: (id: string, e: React.PointerEvent) => void;
  onIconClick?: (id: string, e: React.MouseEvent) => void;
  containerRef?: React.Ref<HTMLDivElement>;
}

export const SignRender: React.FC<SignRenderProps> = ({
  design,
  scale = 1.0,
  className = '',
  onClick,
  showHandles = false,
  fitContainer = false,
  selectedIconId = null,
  onIconPointerDown,
  onIconClick,
  containerRef,
}) => {
  const {
    text,
    subtext,
    fontSize,
    fontStyle,
    shape,
    icon,
    iconSize,
    bgColor,
    textColor,
    borderColor,
    signWidth,
    signHeight,
    subtextSize,
    subtextAlign,
  } = design;

  const widthPx = Math.max(180, signWidth * scale);
  const heightPx = Math.max(80, signHeight * scale);

  let shapeStyle: React.CSSProperties = fitContainer
    ? {
        backgroundColor: bgColor,
        borderColor: borderColor,
        color: textColor,
        width: '100%',
        height: '100%',
        borderWidth: `${Math.max(2, Math.round(4 * scale))}px`,
        borderStyle: 'solid',
      }
    : {
        backgroundColor: bgColor,
        borderColor: borderColor,
        color: textColor,
        width: `${widthPx}px`,
        minHeight: `${heightPx}px`,
        borderWidth: `${Math.max(3, 5 * scale)}px`,
        borderStyle: 'solid',
      };

  let shapeClass = fitContainer
    ? 'w-full h-full flex flex-col items-center justify-center p-2 sm:p-4 transition-all duration-200 shadow-2xl relative select-none rounded-xl overflow-hidden [container-type:size]'
    : 'flex flex-col items-center justify-center p-4 transition-all duration-200 shadow-2xl relative select-none';

  switch (shape) {
    case 'rounded':
      shapeClass += ' rounded-3xl';
      break;
    case 'oval':
      shapeClass += ' rounded-[100px] px-8';
      break;
    case 'badge':
      shapeClass += ' rounded-[36px] border-double';
      break;
    case 'banner':
      shapeClass += ' rounded-2xl border-b-8';
      break;
    case 'rectangle':
    default:
      shapeClass += ' rounded-xl';
      break;
  }

  const fontFamily = getFontFamilyClass(fontStyle);
  const calculatedFontSize = Math.max(14, fontSize * scale * 1.1);

  const currentTitleFontSize = fontSize || 24;
  const titleScaleFactor = (currentTitleFontSize / 24).toFixed(2);

  const currentSubtextSize = subtextSize || 16;
  const subtextScaleFactor = (currentSubtextSize / 16).toFixed(2);

  // Normalize icons list: if design.icons exists, use it; else convert legacy icon
  let activeIcons: SignIconItem[] = [];
  if (design.icons && Array.isArray(design.icons)) {
    activeIcons = design.icons;
  } else if (icon && icon !== 'none') {
    activeIcons = [
      { id: 'icon-main', icon, x: 20, y: 50, size: iconSize || 48 },
    ];
  }

  const effectiveSubtextAlign = subtextAlign || 'center';

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      style={shapeStyle}
      className={`${shapeClass} ${className} cursor-pointer group relative`}
    >
      {/* Selection Bounding Box Handles */}
      {showHandles && (
        <>
          <div className="absolute inset-0 border-2 border-dashed border-indigo-400 pointer-events-none rounded-inherit" />
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-indigo-500 rounded-full border-2 border-white shadow-md" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-indigo-500 rounded-full border-2 border-white shadow-md" />
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-indigo-500 rounded-full border-2 border-white shadow-md" />
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-indigo-500 rounded-full border-2 border-white shadow-md" />
        </>
      )}

      {/* Decorative inner border line */}
      <div
        className="absolute inset-2 border-2 border-current opacity-15 pointer-events-none rounded-inherit"
        style={{ borderColor: textColor }}
      />

      {/* Title & Subtitle block always clearly centered on the sign */}
      <div className="z-10 inline-flex flex-col items-center justify-center leading-tight max-w-[85%] px-2 text-center pointer-events-none">
        <span
          className={`${fontFamily} font-black transition-all duration-150 tracking-wide break-words text-inherit`}
          style={{
            fontSize: fitContainer
              ? `calc(clamp(14px, 4.4cqh, 44px) * ${titleScaleFactor})`
              : `${calculatedFontSize}px`,
            lineHeight: 1.15,
          }}
        >
          {text || 'НАЗВАНИЕ'}
        </span>

        {subtext && subtext.trim().length > 0 && (
          <span
            className={`${fontFamily} font-bold opacity-85 mt-1 sm:mt-1.5 break-words ${
              effectiveSubtextAlign === 'left'
                ? 'self-start text-left'
                : effectiveSubtextAlign === 'right'
                ? 'self-end text-right'
                : 'self-center text-center'
            }`}
            style={{
              fontSize: fitContainer
                ? `calc(clamp(12px, 3.2cqh, 28px) * ${subtextScaleFactor})`
                : `${Math.max(12, Math.round(currentSubtextSize * scale * 1.15))}px`,
              lineHeight: 1.25,
            }}
          >
            {subtext}
          </span>
        )}
      </div>

      {/* Freeform draggable icons overlaid across the sign layout */}
      {activeIcons.map((ic) => {
        if (!ic.icon || ic.icon === 'none') return null;
        const isSelected = selectedIconId === ic.id;
        const pixelSize = fitContainer
          ? Math.max(20, Math.round(ic.size * 0.95))
          : Math.max(20, Math.round(ic.size * scale));

        return (
          <div
            key={ic.id}
            onPointerDown={(e) => onIconPointerDown?.(ic.id, e)}
            onClick={(e) => {
              e.stopPropagation();
              onIconClick?.(ic.id, e);
            }}
            style={{
              left: `${ic.x}%`,
              top: `${ic.y}%`,
              transform: 'translate(-50%, -50%)',
              width: pixelSize,
              height: pixelSize,
            }}
            className={`absolute z-20 flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform touch-none select-none ${
              isSelected
                ? 'ring-3 ring-amber-400 ring-offset-2 ring-offset-black/20 rounded-xl scale-110 shadow-lg'
                : 'hover:scale-110'
            }`}
            title="Иконка (нажми и тяни, чтобы переместить)"
          >
            <SignIcon icon={ic.icon} size={pixelSize} color={textColor} />
            {isSelected && onIconPointerDown && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border border-white shadow-xs pointer-events-none" />
            )}
          </div>
        );
      })}
    </div>
  );
};

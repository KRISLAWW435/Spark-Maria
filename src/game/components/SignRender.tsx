import React from 'react';
import { SignDesign } from '../types';
import { SignIcon, getFontFamilyClass } from './SignVectorAssets';

interface SignRenderProps {
  design: SignDesign;
  scale?: number;
  className?: string;
  onClick?: () => void;
  showHandles?: boolean;
}

export const SignRender: React.FC<SignRenderProps> = ({
  design,
  scale = 1.0,
  className = '',
  onClick,
  showHandles = false,
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
  } = design;

  const widthPx = Math.max(180, signWidth * scale);
  const heightPx = Math.max(80, signHeight * scale);

  let shapeStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    borderColor: borderColor,
    color: textColor,
    width: `${widthPx}px`,
    minHeight: `${heightPx}px`,
    borderWidth: `${Math.max(3, 5 * scale)}px`,
    borderStyle: 'solid',
  };

  let shapeClass = 'flex flex-col items-center justify-center p-4 transition-all duration-200 shadow-2xl relative select-none';

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

  return (
    <div
      onClick={onClick}
      style={shapeStyle}
      className={`${shapeClass} ${className} cursor-pointer group`}
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

      {/* Content layout */}
      <div className="flex items-center justify-center gap-3 z-10 w-full px-2 text-center">
        {icon !== 'none' && (
          <div className="shrink-0 flex items-center justify-center transform transition-transform group-hover:scale-110">
            <SignIcon icon={icon} size={Math.max(28, iconSize * scale * 1.15)} color={textColor} />
          </div>
        )}

        <div className="flex flex-col items-center justify-center leading-tight">
          <span
            className={`${fontFamily} font-black transition-all duration-150 tracking-wide break-words text-center`}
            style={{
              fontSize: `${calculatedFontSize}px`,
              lineHeight: 1.15,
            }}
          >
            {text || 'НАЗВАНИЕ'}
          </span>

          {subtext && (
            <span
              className={`${fontFamily} font-bold opacity-85 mt-1 text-center`}
              style={{
                fontSize: `${Math.max(10, calculatedFontSize * 0.52)}px`,
              }}
            >
              {subtext}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

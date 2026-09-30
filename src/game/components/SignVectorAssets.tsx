import React from 'react';
import { IconType, FontStyle } from '../types';

export const SignIcon: React.FC<{ icon: IconType; size?: number; color?: string }> = ({
  icon,
  size = 40,
  color = '#4A2810',
}) => {
  switch (icon) {
    case 'cupcake':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <path d="M 16 36 L 48 36 L 44 58 L 20 58 Z" fill="#D97706" stroke={color} strokeWidth="3" />
          <path d="M 12 36 Q 32 10 52 36 Z" fill="#F43F5E" stroke={color} strokeWidth="3" />
          <circle cx="32" cy="18" r="6" fill="#DC2626" />
          <path d="M 22 42 L 22 52 M 32 42 L 32 52 M 42 42 L 42 52" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'croissant':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <path
            d="M 12 38 C 8 20, 24 10, 32 18 C 40 10, 56 20, 52 38 C 46 52, 18 52, 12 38 Z"
            fill="#F59E0B"
            stroke={color}
            strokeWidth="3"
          />
          <path d="M 20 28 C 24 22, 40 22, 44 28" stroke="#D97706" strokeWidth="3" fill="none" />
          <path d="M 24 38 C 28 32, 36 32, 40 38" stroke="#D97706" strokeWidth="3" fill="none" />
        </svg>
      );

    case 'shrimp':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <path
            d="M 16 48 Q 10 24, 30 14 Q 52 8, 52 30 Q 52 50, 36 50 Q 24 50, 22 36"
            fill="#F87171"
            stroke={color}
            strokeWidth="3"
          />
          <circle cx="44" cy="22" r="3" fill="#1E293B" />
          <path d="M 44 14 Q 52 6, 60 8" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 20 28 Q 30 32, 38 28 M 22 36 Q 30 40, 38 36" stroke="#FFFFFF" strokeWidth="2" />
        </svg>
      );

    case 'tire':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="26" fill="#334155" stroke={color} strokeWidth="3" />
          <circle cx="32" cy="32" r="14" fill="#94A3B8" stroke="#1E293B" strokeWidth="3" />
          <circle cx="32" cy="32" r="6" fill="#334155" />
          {/* Tread marks */}
          <path d="M 32 6 L 32 12 M 32 52 L 32 58 M 6 32 L 12 32 M 52 32 L 58 32" stroke="#FFFFFF" strokeWidth="3" />
        </svg>
      );

    case 'wrench':
      return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
          <path
            d="M 12 52 L 36 28 C 32 20, 38 10, 48 10 C 52 10, 56 12, 56 12 L 46 22 L 52 28 L 62 18 C 62 18, 64 22, 64 26 C 64 36, 54 42, 46 38 Z"
            fill="#64748B"
            stroke={color}
            strokeWidth="3"
          />
          <circle cx="16" cy="48" r="4" fill="#1E293B" />
        </svg>
      );

    case 'none':
    default:
      return null;
  }
};

export const getFontFamilyClass = (style: FontStyle): string => {
  switch (style) {
    case 'sweet':
      return 'font-serif tracking-wide font-bold';
    case 'handwritten':
      return 'font-sans italic tracking-widest';
    case 'bold':
      return 'font-sans font-black uppercase tracking-wider';
    case 'technical':
      return 'font-mono uppercase tracking-tight font-semibold';
  }
};

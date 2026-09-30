import React from 'react';
import { GAME_ASSETS } from '../assets';
import { TransparentSprite } from './TransparentSprite';

interface VisitorSpriteProps {
  visitorId: string;
  emotion: 'searching' | 'happy' | 'confused' | 'distracted' | 'amused' | 'interested';
  className?: string;
  size?: number;
}

export const VisitorSprite: React.FC<VisitorSpriteProps> = ({ visitorId, emotion, className = '', size = 260 }) => {
  switch (visitorId) {
    case 'chef':
      if (GAME_ASSETS.characters.npcChef) {
        return (
          <TransparentSprite
            src={GAME_ASSETS.characters.npcChef}
            alt="Шеф-повар Пьер"
            height={size}
            className={className}
          />
        );
      }
      break;

    case 'girl':
      if (GAME_ASSETS.characters.npcGirl) {
        return (
          <TransparentSprite
            src={GAME_ASSETS.characters.npcGirl}
            alt="Девочка Алиса"
            height={size * 0.9}
            className={className}
          />
        );
      }
      break;

    case 'driver':
      if (GAME_ASSETS.characters.npcDriver) {
        return (
          <TransparentSprite
            src={GAME_ASSETS.characters.npcDriver}
            alt="Дядя Валера"
            height={size}
            className={className}
          />
        );
      }
      break;

    default:
      break;
  }

  // Fallback vector render for other visitors
  return (
    <div className={`relative inline-block select-none filter drop-shadow-lg ${className}`}>
      <svg width={size * 0.65} height={size * 0.9} viewBox="0 0 160 240" fill="none">
        <ellipse cx="80" cy="232" rx="35" ry="5" fill="rgba(0,0,0,0.15)" />
        <rect x="48" y="100" width="64" height="120" rx="10" fill="#3B82F6" />
        <circle cx="80" cy="75" rx="22" ry="22" fill="#FFDFC4" />
        <circle cx="72" cy="74" r="3.5" fill="#1E1B4B" />
        <circle cx="88" cy="74" r="3.5" fill="#1E1B4B" />
        <path d="M 70 86 Q 80 96 90 86" stroke="#1E1B4B" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
};

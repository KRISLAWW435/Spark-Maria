import React from 'react';
import { MarieEmotion } from '../types';
import { GAME_ASSETS } from '../assets';
import { TransparentSprite } from './TransparentSprite';

interface MarieSpriteProps {
  emotion: MarieEmotion;
  className?: string;
  size?: number;
}

export const MarieSprite: React.FC<MarieSpriteProps> = ({
  emotion,
  className = '',
  size = 624,
}) => {
  return (
    <TransparentSprite
      src={GAME_ASSETS.characters.marie}
      alt={`Мари (${emotion})`}
      height={size}
      className={className}
    />
  );
};

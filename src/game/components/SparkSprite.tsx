import React from 'react';
import { SparkEmotion } from '../types';
import { GAME_ASSETS } from '../assets';
import { TransparentSprite } from './TransparentSprite';

interface SparkSpriteProps {
  emotion: SparkEmotion;
  className?: string;
  size?: number;
}

export const SparkSprite: React.FC<SparkSpriteProps> = ({
  emotion,
  className = '',
  size = 580,
}) => {
  return (
    <TransparentSprite
      src={GAME_ASSETS.characters.spark}
      alt={`Спарк (${emotion})`}
      height={size}
      className={className}
    />
  );
};

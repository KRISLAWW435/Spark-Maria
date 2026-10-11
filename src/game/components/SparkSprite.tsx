import React from 'react';
import { SparkEmotion } from '../types';
import { SparkCharacter, SparkState } from './SparkCharacter';

interface SparkSpriteProps {
  emotion: SparkEmotion;
  className?: string;
  size?: number | string;
}

export const SparkSprite: React.FC<SparkSpriteProps> = ({
  emotion,
  className = '',
  size = 560,
}) => {
  const isDynamicActive =
    emotion === 'excited' || emotion === 'laughing' || emotion === 'happy';
  const sparkState: SparkState = isDynamicActive ? 'active' : 'idle';

  return (
    <SparkCharacter
      state={sparkState}
      size={size}
      className={className}
      interactive={true}
      title={`Спарк (${emotion})`}
    />
  );
};

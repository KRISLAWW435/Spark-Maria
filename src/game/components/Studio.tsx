import React from 'react';
import { SparkStudioScene } from './SparkStudioScene';
import { PlayerProgress } from '../types';

export interface StudioProps {
  progress: PlayerProgress;
  onStartMarieLevel: () => void;
  onOpenPortfolio: () => void;
  hasObservedStreet?: boolean;
  onOpenCanvasEditor?: () => void;
}

/**
 * Studio Component
 * Interactive workspace scene where player customizes their studio,
 * interacts with Spark, and manages client contracts via the simulated Windows laptop.
 */
export const Studio: React.FC<StudioProps> = (props) => {
  return <SparkStudioScene {...props} />;
};

export default Studio;
export { SparkStudioScene };

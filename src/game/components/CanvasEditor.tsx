import React from 'react';
import { SignDesign, PosterDesign, StickersDesign } from '../types';
import { SignEditorView } from './SignEditorView';
import { PosterEditorView } from './PosterEditorView';
import { StickersEditorView } from './StickersEditorView';
import { defaultPosterDesign, defaultStickersDesign } from '../engine/SaveEngine';

interface CanvasEditorProps {
  initialDesign: SignDesign;
  onTestDesign: (design: SignDesign) => void;
  versionNumber?: number;
  isWindowMode?: boolean;
  onClose?: () => void;
  orderNumber?: 1 | 2 | 3;
  posterDesign?: PosterDesign | null;
  stickersDesign?: StickersDesign | null;
  onTestPoster?: (design: PosterDesign) => void;
  onTestStickers?: (design: StickersDesign) => void;
}

export const CanvasEditor: React.FC<CanvasEditorProps> = ({
  initialDesign,
  onTestDesign,
  versionNumber = 1,
  isWindowMode = false,
  onClose,
  orderNumber = 1,
  posterDesign,
  stickersDesign,
  onTestPoster,
  onTestStickers,
}) => {
  if (orderNumber === 2) {
    return (
      <PosterEditorView
        initialDesign={posterDesign || defaultPosterDesign}
        onTestDesign={(p) => (onTestPoster ? onTestPoster(p) : onTestDesign(initialDesign))}
        isWindowMode={isWindowMode}
        onClose={onClose}
      />
    );
  }

  if (orderNumber === 3) {
    return (
      <StickersEditorView
        initialDesign={stickersDesign || defaultStickersDesign}
        onTestDesign={(s) => (onTestStickers ? onTestStickers(s) : onTestDesign(initialDesign))}
        isWindowMode={isWindowMode}
        onClose={onClose}
      />
    );
  }

  return (
    <SignEditorView
      initialDesign={initialDesign}
      onTestDesign={onTestDesign}
      versionNumber={versionNumber}
      isWindowMode={isWindowMode}
      onClose={onClose}
    />
  );
};

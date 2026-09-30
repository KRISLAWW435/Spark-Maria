import React from 'react';

interface TransparentSpriteProps {
  src: string;
  alt: string;
  height?: number;
  className?: string;
}

export const TransparentSprite: React.FC<TransparentSpriteProps> = ({
  src,
  alt,
  height = 540,
  className = '',
}) => {
  return (
    <div
      className={`relative inline-block select-none filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.4)] transition-all duration-300 ${className}`}
      style={{ height: `${height}px` }}
    >
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        className="h-full w-auto object-contain pointer-events-none"
      />
    </div>
  );
};

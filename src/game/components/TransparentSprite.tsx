import React from 'react';

interface TransparentSpriteProps {
  src: string;
  alt: string;
  height?: number | string;
  className?: string;
}

export const TransparentSprite: React.FC<TransparentSpriteProps> = ({
  src,
  alt,
  height = 540,
  className = '',
}) => {
  const heightStyle = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`relative inline-block select-none filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.14)] brightness-[1.02] transition-all duration-300 ${className}`}
      style={{ height: heightStyle }}
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

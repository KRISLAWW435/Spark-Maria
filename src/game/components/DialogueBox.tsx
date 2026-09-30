import React, { useState, useEffect } from 'react';
import { soundEngine } from '../engine/SoundEngine';

interface DialogueBoxProps {
  speakerName: string;
  text: string;
  speakerTagBg?: string;
  onNext: () => void;
  isLast?: boolean;
  nextButtonLabel?: string;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  speakerName,
  text,
  speakerTagBg = 'bg-amber-500 text-slate-950',
  onNext,
  isLast = false,
  nextButtonLabel = 'Дальше ➔',
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 18);

    return () => clearInterval(timer);
  }, [text]);

  const handleBoxClick = () => {
    soundEngine.playClick();
    if (isTyping) {
      setDisplayedText(text);
      setIsTyping(false);
    } else {
      onNext();
    }
  };

  return (
    <div
      onClick={handleBoxClick}
      className="w-[95vw] max-w-6xl mx-auto cursor-pointer select-none transition-transform duration-200 hover:scale-[1.004] relative z-40"
      style={{
        background: 'rgba(255, 255, 255, 0.96)',
        border: '3px solid rgba(226, 232, 240, 0.9)',
        borderRadius: '28px',
        boxShadow: '0 20px 48px rgba(0, 0, 0, 0.22)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div className="p-6 md:p-8 relative flex flex-col justify-between min-h-[140px]">
        {/* Speaker Name Tag */}
        <div className="absolute -top-5 left-8">
          <span className={`px-6 py-2 rounded-2xl text-sm md:text-base font-black tracking-wide shadow-md border-2 border-white ${speakerTagBg}`}>
            {speakerName}
          </span>
        </div>

        {/* Dialogue Text - Large & Highly Readable */}
        <p className="mt-3 text-slate-900 text-lg sm:text-xl md:text-2xl font-bold leading-relaxed tracking-wide">
          {displayedText}
          {isTyping && <span className="animate-pulse font-black text-amber-500">|</span>}
        </p>

        {/* Footer Next Button */}
        <div className="mt-4 flex justify-end items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleBoxClick();
            }}
            className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-[#58CC02] hover:bg-[#46A302] border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 text-white font-black text-sm md:text-base uppercase tracking-wider transition-all shadow-md cursor-pointer"
          >
            <span>{isTyping ? 'Пропустить ➔' : nextButtonLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

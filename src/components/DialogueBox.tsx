import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine } from '../game/engine/SoundEngine';

export interface DialogueBoxProps {
  speaker?: 'Мари' | 'Спарк' | 'Пьер' | 'Валера' | 'Степан' | 'Алиса' | string;
  speakerName?: string;    // обратная совместимость
  text: string;
  emotion?: string;        // необязательно, для отладки
  onNext: () => void;      // переход к следующей реплике
  isLast?: boolean;        // если true — показать «Продолжить» вместо стрелки
  speed?: number;          // скорость печати, по умолчанию 35 мс
  nextButtonLabel?: string;
  speakerTagBg?: string;
  className?: string;
}

// Определение визуальных параметров бейджа персонажа
function parseSpeaker(rawSpeaker?: string) {
  if (!rawSpeaker) {
    return {
      name: 'Спарк',
      bg: 'bg-[#A855F7]',
      textColor: 'text-white',
      icon: '⚡',
    };
  }

  // Очистка от скобок и титулов: "Мари (Владелица Кондитерской)" -> "Мари"
  let clean = rawSpeaker.replace(/[\(（].*?[\)）]/g, '').trim();
  clean = clean.replace(/\s*[-—–]\s*.*$/, '').trim();

  const lower = clean.toLowerCase();

  if (lower.includes('спарк') && lower.includes('мари')) {
    return {
      name: 'Мари & Спарк',
      bg: 'bg-gradient-to-r from-[#D4A574] to-[#A855F7]',
      textColor: 'text-white',
      icon: '🧁⚡',
    };
  }
  if (lower.includes('мари')) {
    return {
      name: 'Мари',
      bg: 'bg-[#D4A574]',
      textColor: 'text-[#3A2418]',
      icon: '🧁',
    };
  }
  if (lower.includes('спарк')) {
    return {
      name: 'Спарк',
      bg: 'bg-[#A855F7]',
      textColor: 'text-white',
      icon: '⚡',
    };
  }
  if (lower.includes('пьер')) {
    return {
      name: 'Пьер',
      bg: 'bg-[#4A5568]',
      textColor: 'text-white',
      icon: '👨‍🍳',
    };
  }
  if (lower.includes('валера')) {
    return {
      name: 'Валера',
      bg: 'bg-[#4A5568]',
      textColor: 'text-white',
      icon: '🚐',
    };
  }
  if (lower.includes('степан')) {
    return {
      name: 'Степан',
      bg: 'bg-[#4A5568]',
      textColor: 'text-white',
      icon: '🔧',
    };
  }
  if (lower.includes('алиса')) {
    return {
      name: 'Алиса',
      bg: 'bg-[#4A5568]',
      textColor: 'text-white',
      icon: '🎀',
    };
  }

  return {
    name: clean,
    bg: 'bg-[#4A5568]',
    textColor: 'text-white',
    icon: undefined,
  };
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  speaker,
  speakerName,
  text,
  emotion,
  onNext,
  isLast = false,
  speed = 35,
  nextButtonLabel,
  speakerTagBg,
  className = '',
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const character = parseSpeaker(speaker || speakerName);

  // Typewriter effect
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let index = 0;

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  // Фокус на плашке при появлении
  useEffect(() => {
    containerRef.current?.focus({ preventScroll: true });
  }, []);

  const handleAction = () => {
    try {
      soundEngine.playClick();
    } catch {
      // sound fallback safe
    }

    if (isTyping) {
      // Клик во время печати — мгновенно показать весь текст
      setDisplayedText(text);
      setIsTyping(false);
    } else {
      // Клик после окончания печати — переход к следующей реплике
      onNext();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleAction();
    }
  };

  // Адаптивный размер шрифта при большой длине текста (> 120 символов)
  const isLongText = text.length > 120;

  return (
    <motion.div
      ref={containerRef}
      role="dialog"
      aria-live="polite"
      aria-label={`Реплика: ${character.name}`}
      data-emotion={emotion}
      tabIndex={0}
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={handleAction}
      onKeyDown={handleKeyDown}
      className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-48px)] max-w-5xl min-h-[110px] md:min-h-[140px] p-4 sm:p-5 md:p-6 rounded-3xl bg-[#1A1A2E]/85 backdrop-blur-md border-2 border-[#A855F7]/60 shadow-[0_8px_32px_rgba(168,85,247,0.25)] ring-1 ring-white/10 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[#C4FF3D]/70 transition-colors duration-150 ${className}`}
    >
      {/* Speaker Name Badge */}
      <div className="absolute -top-4 left-8 z-10 pointer-events-none">
        <span
          className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-bold text-sm shadow-md border border-white/20 select-none ${character.bg} ${character.textColor}`}
        >
          {character.icon && (
            <span className="text-xs leading-none" aria-hidden="true">
              {character.icon}
            </span>
          )}
          <span>{character.name}</span>
        </span>
      </div>

      {/* Dialogue Text with AnimatePresence transitions */}
      <div className="min-h-[56px] flex flex-col justify-center pr-8 sm:pr-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={text}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            <p
              className={`text-white font-medium leading-relaxed tracking-wide ${
                isLongText ? 'text-base leading-snug md:leading-relaxed' : 'text-base sm:text-lg'
              }`}
            >
              {displayedText}
              {isTyping && (
                <span className="inline-block w-1.5 h-4 ml-1 bg-[#C4FF3D] animate-pulse align-middle" />
              )}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Continuation Indicator */}
      {!isTyping && (
        <div className="absolute bottom-4 right-6 flex items-center justify-center min-h-[48px] min-w-[48px] pointer-events-none">
          {isLast ? (
            <span className="text-[#C4FF3D] font-bold text-sm sm:text-base animate-pulse tracking-wide flex items-center gap-1">
              {nextButtonLabel || 'Продолжить →'}
            </span>
          ) : (
            <span className="text-[#C4FF3D] animate-bounce flex items-center justify-center">
              <svg
                className="w-5 h-5 fill-current"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default DialogueBox;

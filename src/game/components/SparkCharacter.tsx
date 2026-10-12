import React, { useState, useEffect, useRef } from 'react';
import { getAssetUrl } from '../types';

export type SparkState = 'idle' | 'active' | 'greeting';
export type SparkSize = 'small' | 'medium' | 'large' | number | string;

export interface SparkCharacterProps {
  state?: SparkState;
  size?: SparkSize;
  className?: string;
  interactive?: boolean;
  idleNudge?: boolean;
  idleTimeoutMs?: number; // Inactivity time before spark2.gif triggers (default: 20000ms = 20s)
  onClick?: () => void;
  title?: string;
}

const SPARK_IDLE_GIF = getAssetUrl('/assets/spark/animations/spark1.gif');
const SPARK_ACTIVE_GIF = getAssetUrl('/assets/spark/animations/spark2.gif');
const SPARK_GREETING_GIF = getAssetUrl('/assets/spark/animations/spark_greeting.gif');

// Contour edge #1D005A smoothly diffusing outward as #A981FF gradient
const UNIFORM_SPARK_GLOW =
  'drop-shadow(0 0 1.5px #1D005A) drop-shadow(0 0 3px rgba(29, 0, 90, 0.95)) drop-shadow(0 0 6px rgba(169, 129, 255, 0.8)) drop-shadow(0 0 12px rgba(169, 129, 255, 0.45))';

export const SparkCharacter: React.FC<SparkCharacterProps> = ({
  state: controlledState,
  size = 'medium',
  className = '',
  interactive = true,
  idleNudge = true,
  idleTimeoutMs = 20000, // 20 seconds as requested
  onClick,
  title = 'Спарк',
}) => {
  const [isNudgeActive, setIsNudgeActive] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const nudgeDurationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // spark1.gif runs constantly by default.
  // spark_greeting.gif runs when controlledState === 'greeting'.
  // spark2.gif turns on ONLY when the player is idle for ~20 seconds (or if parent explicitly overrides via state prop 'active').
  const currentState: SparkState = controlledState
    ? controlledState
    : isNudgeActive
    ? 'active'
    : 'idle';

  // 20-second inactivity detection
  useEffect(() => {
    if (!idleNudge) return;

    const resetIdleTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (nudgeDurationTimerRef.current) clearTimeout(nudgeDurationTimerRef.current);

      idleTimerRef.current = setTimeout(() => {
        // Player has been idle for ~20 seconds -> switch to spark2.gif
        setIsNudgeActive(true);

        // Play active animation for 3 seconds, then return to spark1.gif and reset 20s timer
        nudgeDurationTimerRef.current = setTimeout(() => {
          setIsNudgeActive(false);
          resetIdleTimer();
        }, 3000);
      }, idleTimeoutMs);
    };

    resetIdleTimer();

    // User interaction immediately returns Spark to spark1.gif and restarts the 20s counter
    const handleUserActivity = () => {
      setIsNudgeActive(false);
      resetIdleTimer();
    };

    window.addEventListener('mousemove', handleUserActivity, { passive: true });
    window.addEventListener('mousedown', handleUserActivity, { passive: true });
    window.addEventListener('keydown', handleUserActivity, { passive: true });
    window.addEventListener('touchstart', handleUserActivity, { passive: true });
    window.addEventListener('scroll', handleUserActivity, { passive: true });

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (nudgeDurationTimerRef.current) clearTimeout(nudgeDurationTimerRef.current);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('mousedown', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
    };
  }, [idleNudge, idleTimeoutMs]);

  // Size style classes and style objects
  const getSizeStyles = (): { className: string; style?: React.CSSProperties } => {
    if (typeof size === 'number') {
      return {
        className: 'w-auto',
        style: { height: `${size}px` },
      };
    }

    if (typeof size === 'string' && size !== 'small' && size !== 'medium' && size !== 'large') {
      return {
        className: 'w-auto',
        style: { height: size },
      };
    }

    switch (size) {
      case 'small':
        return { className: 'h-20 sm:h-24 md:h-28 w-auto' };
      case 'large':
        return { className: 'h-72 sm:h-84 md:h-96 lg:h-[420px] w-auto' };
      case 'medium':
      default:
        return { className: 'h-40 sm:h-48 md:h-56 w-auto' };
    }
  };

  const { className: sizeClass, style: sizeStyle } = getSizeStyles();

  return (
    <div
      onClick={onClick}
      title={title}
      className={`relative inline-flex items-center justify-center select-none bg-transparent border-0 outline-none ${
        interactive && onClick ? 'cursor-pointer active:scale-95' : ''
      } ${sizeClass} ${className}`}
      style={{
        ...sizeStyle,
        filter: UNIFORM_SPARK_GLOW, // Identical uniform glow filter everywhere
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* 
        Clean, flicker-free single-silhouette rendering:
        Only ONE animated GIF is visible at any moment.
        This prevents double-exposure ghosting and drop-shadow jitter during state changes.
      */}

      {/* 1. CONSTANT BASE STATE: spark1.gif */}
      <img
        src={SPARK_IDLE_GIF}
        alt="Спарк"
        loading="eager"
        draggable={false}
        className={`w-auto h-full object-contain pointer-events-none select-none border-none bg-transparent ${
          currentState === 'idle' ? 'block' : 'hidden pointer-events-none'
        }`}
      />

      {/* 2. 20-SEC INACTIVITY STATE: spark2.gif */}
      <img
        src={SPARK_ACTIVE_GIF}
        alt="Спарк (Активный)"
        loading="eager"
        draggable={false}
        className={`w-auto h-full object-contain pointer-events-none select-none border-none bg-transparent ${
          currentState === 'active' ? 'block' : 'hidden pointer-events-none'
        }`}
      />

      {/* 3. GREETING STATE: spark_greeting.gif */}
      <img
        src={SPARK_GREETING_GIF}
        alt="Спарк (Приветствие)"
        loading="eager"
        draggable={false}
        className={`w-auto h-full object-contain pointer-events-none select-none border-none bg-transparent ${
          currentState === 'greeting' ? 'block' : 'hidden pointer-events-none'
        }`}
      />
    </div>
  );
};

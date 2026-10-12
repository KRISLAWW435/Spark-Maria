import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { assetPreloader } from '../engine/AssetPreloader';
import { getAssetUrl } from '../types';

interface VideoTransitionProps {
  src?: string;
  onCovered?: () => void;
  onComplete: () => void;
}

export const VideoTransition: React.FC<VideoTransitionProps> = ({
  src = getAssetUrl('/assets/avatars/videos/transition-drive-to-client.webm'),
  onCovered,
  onComplete,
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isFinishedRef = useRef(false);
  const isCoveredRef = useRef(false);
  const lastProgressTimeRef = useRef(Date.now());
  const effectiveSrc = assetPreloader.getVideoUrl(getAssetUrl(src));

  // Notify parent that screen is completely covered so destination scene mounts underneath
  const triggerCovered = useCallback(() => {
    if (isCoveredRef.current) return;
    isCoveredRef.current = true;
    onCovered?.();
  }, [onCovered]);

  // Complete and fade out safely (preventing duplicate calls)
  const handleFinish = useCallback(() => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;

    // Ensure destination scene is mounted underneath BEFORE fading out
    triggerCovered();

    setIsExiting(true);

    // Fade out duration 0.5s, then trigger final completion
    setTimeout(() => {
      onComplete();
    }, 500);
  }, [triggerCovered, onComplete]);

  // Handle video playback progress
  const handleTimeUpdate = useCallback(() => {
    lastProgressTimeRef.current = Date.now();
    const video = videoRef.current;
    if (video && video.duration > 0) {
      // If video has essentially finished (within 100ms of end)
      if (video.currentTime >= video.duration - 0.1) {
        handleFinish();
      }
    }
  }, [handleFinish]);

  useEffect(() => {
    // 1. Once the fade-in overlay is 100% opaque black (300ms),
    // switch scene underneath to intro_bakery so it renders during the 4-second video
    const coverTimer = setTimeout(() => {
      triggerCovered();
    }, 320);

    // 2. Play video immediately with promise handling
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise) {
        playPromise.catch((err) => {
          console.warn('Video auto-play waiting or interrupted:', err);
        });
      }
    }

    // 3. Robust watchdog: check every second if video made progress.
    // Only terminates if video is genuinely stalled/frozen for >8s without any time progress.
    // This NEVER prematurely cuts off a playing 4-second video!
    const watchdogInterval = setInterval(() => {
      if (Date.now() - lastProgressTimeRef.current > 8000) {
        console.warn('Video transition watchdog triggered fallback');
        handleFinish();
      }
    }, 1000);

    return () => {
      clearTimeout(coverTimer);
      clearInterval(watchdogInterval);
    };
  }, [triggerCovered, handleFinish]);

  return (
    <AnimatePresence>
      <motion.div
        key="video-transition-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: isExiting ? 0.5 : 0.3,
          ease: isExiting ? 'easeOut' : 'easeInOut',
        }}
        className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden select-none"
      >
        {/* Fullscreen Video with pre-buffering & hardware acceleration */}
        <video
          ref={videoRef}
          src={effectiveSrc}
          autoPlay
          playsInline
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleFinish}
          onError={(e) => {
            console.error('Video transition error:', e);
            handleFinish();
          }}
          className="w-full h-full object-cover transform-gpu"
          style={{ willChange: 'transform, opacity' }}
        />

        {/* Skip Button in Bottom Right Corner */}
        <div className="absolute bottom-6 right-6 z-50">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleFinish();
            }}
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-black/60 hover:bg-black/85 active:bg-black/95 backdrop-blur-md text-white/90 hover:text-white border border-white/25 text-xs sm:text-sm font-black shadow-2xl transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 hover:border-white/50"
            title="Пропустить видео"
          >
            <span>Пропустить ➡️</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Square, X, Copy } from 'lucide-react';
import { soundEngine } from '../engine/SoundEngine';

export interface WindowProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isActive: boolean;
  zIndex: number;
  accentColor?: string;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: string | number; height: string | number };
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  children: React.ReactNode;
  boundsRef?: React.RefObject<HTMLDivElement | null>;
}

export const Window: React.FC<WindowProps> = ({
  id,
  title,
  icon,
  isOpen,
  isMinimized,
  isMaximized,
  isActive,
  zIndex,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {!isMinimized && (
        <motion.div
          key={id}
          onPointerDown={onFocus}
          initial={{
            scale: 0.94,
            opacity: 0,
          }}
          animate={
            isMaximized
              ? {
                  scale: 1,
                  opacity: 1,
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: '100%',
                  height: '100%',
                  x: 0,
                  y: 0,
                }
              : {
                  scale: 1,
                  opacity: 1,
                  top: '4%',
                  left: '4%',
                  right: '4%',
                  bottom: '4%',
                  width: '92%',
                  height: '92%',
                  x: 0,
                  y: 0,
                }
          }
          exit={{
            scale: 0.88,
            opacity: 0,
            transition: { duration: 0.15, ease: 'easeIn' },
          }}
          transition={{
            type: 'spring',
            stiffness: 340,
            damping: 30,
            mass: 0.7,
          }}
          style={{
            zIndex,
            position: 'absolute',
          }}
          className={`flex flex-col overflow-hidden bg-[#F8F9FC] transition-shadow duration-150 ${
            isMaximized
              ? 'rounded-none border-none shadow-none inset-0'
              : 'rounded-2xl border border-slate-300/80 shadow-2xl'
          } ${isActive && !isMaximized ? 'ring-2 ring-indigo-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.35)]' : 'opacity-98 hover:opacity-100'}`}
        >
          {/* WINDOW HEADER / TITLE BAR (FIXED CENTERED, NO DRAG) */}
          <div
            onPointerDown={() => {
              onFocus();
            }}
            onDoubleClick={() => {
              soundEngine.playPop();
              onMaximize();
            }}
            className="h-10 sm:h-11 bg-[#EDF1F7] border-b border-slate-200/90 flex items-center justify-between px-3 sm:px-4 select-none shrink-0 cursor-default"
          >
            {/* Left: Icon & Title */}
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 pointer-events-none">
              <div className="w-5 h-5 flex items-center justify-center shrink-0 text-slate-700">
                {icon}
              </div>
              <span className="text-xs sm:text-sm font-extrabold text-slate-800 truncate tracking-tight">
                {title}
              </span>
            </div>

            {/* Right: Window Controls (Minimize, Maximize/Restore, Close) */}
            <div className="flex items-center h-full pointer-events-auto shrink-0 -mr-3 sm:-mr-4">
              {/* Minimize Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onMinimize();
                }}
                className="w-11 h-full hover:bg-slate-200/80 active:bg-slate-300/80 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                title="Свернуть"
              >
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              {/* Maximize / Restore Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onMaximize();
                }}
                className="w-11 h-full hover:bg-slate-200/80 active:bg-slate-300/80 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                title={isMaximized ? 'Восстановить размер' : 'Развернуть на весь экран'}
              >
                {isMaximized ? (
                  <Copy className="w-3 h-3 stroke-[2.5] rotate-180" />
                ) : (
                  <Square className="w-3 h-3 stroke-[2.5]" />
                )}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="w-12 h-full hover:bg-[#e81123] hover:text-white active:bg-rose-700 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                title="Закрыть"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* WINDOW CONTENT BODY */}
          <div className="flex-1 relative overflow-hidden bg-white text-slate-900 flex flex-col">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

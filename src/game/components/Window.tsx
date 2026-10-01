import React from 'react';
import { motion, useDragControls, AnimatePresence } from 'framer-motion';
import { Minus, Square, X, Copy } from 'lucide-react';

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
  accentColor = '#7C3AED',
  initialPosition = { x: 40, y: 20 },
  initialSize = { width: '85%', height: '82%' },
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  children,
  boundsRef,
}) => {
  const dragControls = useDragControls();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {!isMinimized && (
        <motion.div
          key={id}
          onPointerDown={onFocus}
          drag={!isMaximized}
          dragControls={dragControls}
          dragListener={false}
          dragConstraints={boundsRef}
          dragElastic={0.02}
          dragMomentum={false}
          initial={{
            scale: 0.88,
            opacity: 0,
            y: initialPosition.y + 20,
            x: initialPosition.x,
          }}
          animate={{
            scale: 1,
            opacity: 1,
            x: isMaximized ? 0 : initialPosition.x,
            y: isMaximized ? 0 : initialPosition.y,
            width: isMaximized ? '100%' : initialSize.width,
            height: isMaximized ? '100%' : initialSize.height,
          }}
          exit={{
            scale: 0.85,
            opacity: 0,
            y: 40,
            transition: { duration: 0.18, ease: 'easeIn' },
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 28,
            mass: 0.8,
          }}
          style={{
            zIndex,
            position: 'absolute',
            top: 0,
            left: 0,
          }}
          className={`flex flex-col overflow-hidden bg-[#F8F9FC] border transition-shadow duration-200 ${
            isMaximized ? 'rounded-none border-none shadow-none' : 'rounded-2xl border-slate-300/80 shadow-2xl'
          } ${isActive ? 'ring-2 ring-indigo-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.35)]' : 'opacity-98 shadow-md hover:opacity-100'}`}
        >
          {/* WINDOW HEADER / TITLE BAR (DRAGGABLE) */}
          <div
            onPointerDown={(e) => {
              onFocus();
              if (!isMaximized) {
                dragControls.start(e);
              }
            }}
            className={`h-10 sm:h-11 bg-[#EDF1F7] border-b border-slate-200/90 flex items-center justify-between px-3 sm:px-4 select-none shrink-0 ${
              isMaximized ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
            }`}
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
                className="w-12 h-full hover:bg-[#e81123] hover:text-white active:bg-rose-700 flex items-center justify-center text-slate-600 transition-colors cursor-pointer rounded-tr-2xl"
                title="Закрыть"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* WINDOW CONTENT BODY */}
          <div className="flex-1 relative overflow-hidden bg-white text-slate-900">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

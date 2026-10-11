import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { soundEngine } from '../engine/SoundEngine';

interface InlineColorWheelProps {
  color: string;
  onChangeColor: (color: string) => void;
  onClose: () => void;
}

// Convert Hex to HSV (h: 0-360, s: 0-1, v: 0-1)
function hexToHsv(hex: string): { h: number; s: number; v: number } {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  }
  const r = parseInt(c.substring(0, 2), 16) / 255 || 0;
  const g = parseInt(c.substring(2, 4), 16) / 255 || 0;
  const b = parseInt(c.substring(4, 6), 16) / 255 || 0;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  if (diff !== 0) {
    if (max === r) {
      h = ((g - b) / diff) % 6;
    } else if (max === g) {
      h = (b - r) / diff + 2;
    } else {
      h = (r - g) / diff + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : diff / max;
  const v = max;

  return { h, s, v };
}

// Convert HSV to Hex
function hsvToHex(h: number, s: number, v: number): string {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  const toHex = (num: number) => {
    const val = Math.round((num + m) * 255);
    return Math.max(0, Math.min(255, val)).toString(16).padStart(2, '0');
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export const InlineColorWheel: React.FC<InlineColorWheelProps> = ({
  color,
  onChangeColor,
  onClose,
}) => {
  const [hsv, setHsv] = useState(() => hexToHsv(color || '#5834f5'));
  const hsvRef = useRef(hsv);
  hsvRef.current = hsv;
  const wheelRef = useRef<HTMLDivElement>(null);
  const squareRef = useRef<HTMLDivElement>(null);
  const isDraggingHue = useRef(false);
  const isDraggingSV = useRef(false);

  // Sync internal HSV if color prop changes externally
  useEffect(() => {
    const currentHex = hsvToHex(hsvRef.current.h, hsvRef.current.s, hsvRef.current.v);
    if (color && color.toLowerCase() !== currentHex.toLowerCase()) {
      const nextHsv = hexToHsv(color);
      hsvRef.current = nextHsv;
      setHsv(nextHsv);
    }
  }, [color]);

  const currentColor = hsvToHex(hsv.h, hsv.s, hsv.v);
  const pureHueColor = hsvToHex(hsv.h, 1, 1);

  // Handle Hue Ring Drag
  const updateHue = useCallback(
    (clientX: number, clientY: number) => {
      if (!wheelRef.current) return;
      const rect = wheelRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = clientX - centerX;
      const dy = clientY - centerY;

      // Calculate angle from 12 o'clock (TOP) clockwise in degrees (0 to 360)
      let angle = Math.atan2(dx, -dy) * (180 / Math.PI);
      if (angle < 0) angle += 360;

      const newH = Math.round(angle);
      const nextHsv = { ...hsvRef.current, h: newH };
      hsvRef.current = nextHsv;
      setHsv(nextHsv);

      const newHex = hsvToHex(nextHsv.h, nextHsv.s, nextHsv.v);
      onChangeColor(newHex);
    },
    [onChangeColor]
  );

  // Handle Saturation / Value Square Drag
  const updateSV = useCallback(
    (clientX: number, clientY: number) => {
      if (!squareRef.current) return;
      const rect = squareRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

      const s = x / rect.width;
      const v = 1 - y / rect.height;

      const nextHsv = { ...hsvRef.current, s, v };
      hsvRef.current = nextHsv;
      setHsv(nextHsv);

      const newHex = hsvToHex(nextHsv.h, nextHsv.s, nextHsv.v);
      onChangeColor(newHex);
    },
    [onChangeColor]
  );

  // Global mouse / touch move & up listeners while dragging
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (isDraggingHue.current) {
        updateHue(clientX, clientY);
      } else if (isDraggingSV.current) {
        updateSV(clientX, clientY);
      }
    };

    const handlePointerUp = () => {
      isDraggingHue.current = false;
      isDraggingSV.current = false;
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [updateHue, updateSV]);

  // Knob position for Hue Wheel (radius ~82px on 190px wheel, 0° at 12 o'clock clockwise)
  const wheelRadius = 82;
  const angleRad = (hsv.h * Math.PI) / 180;
  const knobX = 95 + wheelRadius * Math.sin(angleRad);
  const knobY = 95 - wheelRadius * Math.cos(angleRad);

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="overflow-hidden"
    >
      <div className="mt-2.5 p-3.5 bg-white/95 backdrop-blur-xs rounded-2xl border-2 border-indigo-100 shadow-sm flex flex-col items-center select-none">
        {/* Header Bar with Live Preview Box & Hide Button */}
        <div className="w-full flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            {/* 40x40px Live Selected Color Preview Box */}
            <div
              className="w-10 h-10 rounded-xl border-2 border-white shadow-md transition-colors duration-100 flex items-center justify-center shrink-0"
              style={{
                backgroundColor: currentColor,
                boxShadow: `0 0 16px ${currentColor}80`,
              }}
              title="Выбранный цвет"
            >
              <Sparkles className="w-4 h-4 text-white/90 drop-shadow-xs pointer-events-none" />
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-black text-indigo-950 leading-tight">
                Свой оттенок
              </span>
              <span className="text-[10px] font-bold text-slate-500 leading-tight">
                Крути круг и выбирай цвет
              </span>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
            title="Скрыть цветовой круг"
          >
            <X className="w-3.5 h-3.5" />
            <span>Скрыть</span>
          </button>
        </div>

        {/* INLINE HUE WHEEL & SV SQUARE (~190x190px) */}
        <div
          ref={wheelRef}
          onMouseDown={(e) => {
            isDraggingHue.current = true;
            updateHue(e.clientX, e.clientY);
          }}
          onTouchStart={(e) => {
            isDraggingHue.current = true;
            updateHue(e.touches[0].clientX, e.touches[0].clientY);
          }}
          className="relative w-[190px] h-[190px] rounded-full my-1 cursor-pointer touch-none flex items-center justify-center shrink-0"
          style={{
            background:
              'conic-gradient(from 0deg, #ff0000 0deg, #ffff00 60deg, #00ff00 120deg, #00ffff 180deg, #0000ff 240deg, #ff00ff 300deg, #ff0000 360deg)',
            boxShadow: '0 4px 14px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(255,255,255,0.4)',
          }}
        >
          {/* Cutout Ring Mask for Hue */}
          <div className="absolute inset-[24px] rounded-full bg-white shadow-inner flex items-center justify-center pointer-events-none" />

          {/* Hue Indicator Knob on the Wheel */}
          <div
            className="absolute w-5 h-5 rounded-full border-2 border-white shadow-[0_2px_8px_rgba(0,0,0,0.4)] pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
            style={{
              left: `${knobX}px`,
              top: `${knobY}px`,
              backgroundColor: pureHueColor,
            }}
          />

          {/* Inner Saturation / Value Gradient Box (~90x90px) */}
          <div
            ref={squareRef}
            onMouseDown={(e) => {
              e.stopPropagation();
              isDraggingSV.current = true;
              updateSV(e.clientX, e.clientY);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              isDraggingSV.current = true;
              updateSV(e.touches[0].clientX, e.touches[0].clientY);
            }}
            className="relative w-[90px] h-[90px] rounded-xl overflow-hidden cursor-crosshair shadow-md border-2 border-white/90"
            style={{
              backgroundColor: pureHueColor,
            }}
          >
            {/* White horizontal gradient (Saturation) */}
            <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent pointer-events-none" />
            {/* Black vertical gradient (Value / Brightness) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent pointer-events-none" />

            {/* SV Selector Knob */}
            <div
              className="absolute w-4 h-4 rounded-full border-2 border-white shadow-[0_2px_6px_rgba(0,0,0,0.5)] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                left: `${hsv.s * 100}%`,
                top: `${(1 - hsv.v) * 100}%`,
                backgroundColor: currentColor,
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

import React, { useState, useRef } from 'react';
import { StickersDesign, StickerItem } from '../types';
import { ALL_STICKERS } from '../constants/stickers';
import { SingleStickerRender } from './StickersRender';
import { SparkSprite } from './SparkSprite';
import { soundEngine } from '../engine/SoundEngine';
import { CompositionAssistant } from '../engine/CompositionAssistant';
import {
  Rocket,
  Grid,
  Sparkles,
  Plus,
  Trash2,
  Move,
  Type,
  Palette,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Undo2,
  Redo2,
  X,
} from 'lucide-react';

interface StickersEditorViewProps {
  initialDesign: StickersDesign;
  onTestDesign: (design: StickersDesign) => void;
  isWindowMode?: boolean;
  onClose?: () => void;
}

export const STICKER_SHAPES: Array<{
  id: 'circle' | 'oval' | 'cloud' | 'star';
  label: string;
  icon: string;
}> = [
  { id: 'circle', label: 'Круг', icon: '⭕' },
  { id: 'oval', label: 'Овал', icon: '⬭' },
  { id: 'cloud', label: 'Облачко', icon: '☁️' },
  { id: 'star', label: 'Звёздочка', icon: '⭐' },
];

export const STICKER_PALETTE = [
  { name: 'Лимонный', hex: '#FEF08A' },
  { name: 'Нежно-розовый', hex: '#FCE7F3' },
  { name: 'Мятный', hex: '#DCFCE7' },
  { name: 'Небесный', hex: '#E0F2FE' },
  { name: 'Лавандовый', hex: '#F3E8FF' },
  { name: 'Персиковый', hex: '#FFEDD5' },
  { name: 'Белоснежный', hex: '#FFFFFF' },
];

export const StickersEditorView: React.FC<StickersEditorViewProps> = ({
  initialDesign,
  onTestDesign,
  isWindowMode = true,
  onClose,
}) => {
  const [stickers, setStickers] = useState<StickerItem[]>(
    initialDesign.stickers && initialDesign.stickers.length > 0
      ? initialDesign.stickers
      : [
          {
            id: 'stk-1',
            shape: 'cloud',
            image: 'icon1',
            color: '#FEF08A',
            text: 'Свежее',
            position: { x: 30, y: 35 },
            targetZone: 'windowL',
          },
          {
            id: 'stk-2',
            shape: 'star',
            image: 'icon2',
            color: '#FCE7F3',
            text: 'Уют',
            position: { x: 65, y: 45 },
            targetZone: 'windowR',
          },
        ]
  );

  const [activeZone, setActiveZone] = useState<'windowL' | 'windowR' | 'door'>('windowL');
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(stickers[0]?.id || null);
  const [showGrid, setShowGrid] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const selectedSticker = stickers.find((s) => s.id === selectedStickerId) || stickers[0];

  const updateSticker = (id: string, patch: Partial<StickerItem>) => {
    soundEngine.playPop();
    setStickers((prev) =>
      prev.map((stk) => (stk.id === id ? { ...stk, ...patch } : stk))
    );
  };

  const handleAddSticker = () => {
    soundEngine.playSuccess();
    const newId = `stk-${Date.now()}`;
    const newSticker: StickerItem = {
      id: newId,
      shape: 'cloud',
      image: 'icon16', // cute bakery cat
      color: '#FEF08A',
      text: 'Любовь',
      position: { x: 50, y: 50 },
      targetZone: activeZone,
    };
    setStickers((prev) => [...prev, newSticker]);
    setSelectedStickerId(newId);
  };

  const handleDeleteSticker = (id: string) => {
    soundEngine.playPop();
    const remaining = stickers.filter((s) => s.id !== id);
    setStickers(remaining);
    setSelectedStickerId(remaining[0]?.id || null);
  };

  // Dragging inside zone
  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    setSelectedStickerId(id);
    setIsDragging(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const onPointerMove = (moveEv: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const xPercent = Math.max(10, Math.min(85, ((moveEv.clientX - rect.left) / rect.width) * 100));
      const yPercent = Math.max(10, Math.min(85, ((moveEv.clientY - rect.top) / rect.height) * 100));

      setStickers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, position: { x: xPercent, y: yPercent } } : s))
      );
    };

    const onPointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const feedback = CompositionAssistant.evaluateStickers(stickers);

  return (
    <div className={`${onClose ? 'fixed inset-0 z-50 w-screen h-screen' : `w-full ${isWindowMode ? 'h-full' : 'h-screen'}`} bg-[#F7F9FC] text-slate-800 flex flex-col justify-between overflow-hidden select-none font-sans`}>
      {/* Top Header */}
      <div className="bg-white border-b-2 border-slate-200 px-4 py-2 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-xl bg-rose-500 text-white font-black text-xs flex items-center gap-1.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ЗАКАЗ №3 • НАКЛЕЙКИ НА ВИТРИНУ И ДВЕРЬ</span>
          </div>
          <span className="text-xs font-bold text-slate-500 hidden sm:inline">
            Всего наклеек: {stickers.length}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowGrid(!showGrid)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 border transition-all cursor-pointer ${
              showGrid ? 'bg-indigo-100 border-indigo-300 text-indigo-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Grid className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Сетка</span>
          </button>

          <button
            type="button"
            onClick={handleAddSticker}
            className="px-3 py-1 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black flex items-center gap-1 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Добавить наклейку
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playTestStart();
              onTestDesign({ stickers });
            }}
            className="px-4 py-1.5 rounded-xl bg-[#58CC02] border-b-2 border-[#46A302] hover:bg-[#46A302] active:translate-y-0.5 text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Rocket className="w-3.5 h-3.5" /> Проверить на улице ➔
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shadow-xs ml-1"
              title="Закрыть редактор"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row p-3 gap-3 overflow-hidden">
        {/* LEFT COLUMN: Zone Switcher & Sticker List */}
        <div className="w-full md:w-56 bg-white border border-slate-200 rounded-2xl p-3 flex flex-col justify-between shrink-0 shadow-xs">
          <div>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-2 px-1">
              Зона украшения
            </span>
            <div className="grid grid-cols-3 gap-1 mb-3">
              {[
                { id: 'windowL', label: 'Левое окно' },
                { id: 'door', label: 'Дверь' },
                { id: 'windowR', label: 'Правое окно' },
              ].map((z) => (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveZone(z.id as any);
                  }}
                  className={`py-2 px-1 rounded-xl text-center text-xs font-black transition-all cursor-pointer ${
                    activeZone === z.id
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {z.label}
                </button>
              ))}
            </div>

            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-1.5 px-1">
              Наклейки в этой зоне:
            </span>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {stickers
                .filter((s) => !s.targetZone || s.targetZone === activeZone)
                .map((stk) => (
                  <div
                    key={stk.id}
                    onClick={() => {
                      soundEngine.playPop();
                      setSelectedStickerId(stk.id);
                    }}
                    className={`p-2 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      selectedStickerId === stk.id
                        ? 'border-rose-400 bg-rose-50 font-black'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        style={{ backgroundColor: stk.color }}
                        className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center text-xs"
                      >
                        🏷️
                      </div>
                      <span className="text-xs text-slate-800">{stk.text || 'Без текста'}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSticker(stk.id);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white"
                      title="Удалить"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Spark Tip box */}
          <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2">
            <SparkSprite emotion="excited" size={40} className="shrink-0" />
            <div className="text-[11px] leading-snug">
              <span className="font-black text-rose-900 block mb-0.5">Помощник Спарк:</span>
              <p className="text-rose-800">{feedback.sparkMessage}</p>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Glass Window Simulator Canvas */}
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between items-center relative overflow-hidden shadow-xs">
          {/* Glass Canvas Header */}
          <div className="w-full flex items-center justify-between text-xs text-slate-500 z-10 mb-2">
            <span className="font-bold flex items-center gap-1.5 text-rose-700">
              🪟 Стекло: {activeZone === 'door' ? 'Дверь' : activeZone === 'windowL' ? 'Левая витрина' : 'Правая витрина'}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black flex items-center gap-1 ${
              feedback.guideBorderColor === 'green'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}>
              {feedback.guideBorderColor === 'green' ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <AlertCircle className="w-3 h-3 text-amber-600" />}
              {feedback.guideBorderColor === 'green' ? 'Хорошая композиция' : 'Совет по композиции'}
            </span>
          </div>

          {/* Glass Window Pane Area with Drag Boundaries */}
          <div className="flex-1 w-full flex items-center justify-center p-2 z-10">
            <div
              ref={canvasRef}
              className={`relative ${
                activeZone === 'door' ? 'w-52 h-80' : 'w-80 h-72'
              } rounded-3xl border-4 border-slate-400/60 shadow-2xl overflow-hidden transition-all bg-gradient-to-b from-sky-100/50 via-sky-50/30 to-amber-50/40`}
            >
              {/* Sunlight Reflection glare on glass */}
              <div className="absolute -top-10 -right-10 w-44 h-96 bg-white/20 transform rotate-12 pointer-events-none" />

              {/* Grid lines if enabled */}
              {showGrid && (
                <div
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, #ec4899 1px, transparent 1px), linear-gradient(to bottom, #ec4899 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />
              )}

              {/* Guide Lines on Drag */}
              {isDragging && (
                <>
                  <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-rose-400/60 pointer-events-none" />
                  <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-rose-400/60 pointer-events-none" />
                </>
              )}

              {/* Stickers in this active zone */}
              {stickers
                .filter((s) => !s.targetZone || s.targetZone === activeZone)
                .map((stk) => {
                  const posX = Math.max(10, Math.min(85, stk.position.x));
                  const posY = Math.max(10, Math.min(85, stk.position.y));
                  const isSelected = stk.id === selectedStickerId;

                  return (
                    <div
                      key={stk.id}
                      onPointerDown={(e) => handlePointerDown(stk.id, e)}
                      style={{
                        left: `${posX}%`,
                        top: `${posY}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                      className="absolute touch-none cursor-grab active:cursor-grabbing"
                    >
                      <SingleStickerRender
                        sticker={stk}
                        scale={1.15}
                        isSelected={isSelected}
                      />
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-medium z-10 flex items-center gap-1">
            <Move className="w-3 h-3" /> Перетаскивай наклейку мышкой или пальцем внутри стекла
          </div>
        </div>

        {/* RIGHT COLUMN: Selected Sticker Properties */}
        <div className="w-full md:w-72 bg-white border border-slate-200 rounded-2xl p-3 flex flex-col justify-between shrink-0 shadow-xs overflow-y-auto">
          {selectedSticker ? (
            <div className="space-y-4">
              {/* 1. Shape of backing */}
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide mb-2">
                  1. Форма подложки
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {STICKER_SHAPES.map((sh) => (
                    <button
                      key={sh.id}
                      type="button"
                      onClick={() => updateSticker(selectedSticker.id, { shape: sh.id })}
                      className={`p-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                        selectedSticker.shape === sh.id
                          ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-300 font-black'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-base">{sh.icon}</span>
                      <span className="text-xs text-slate-800">{sh.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Sticker Image (All 24 icons + characters!) */}
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide mb-1">
                  2. Картинка (24 на выбор)
                </h4>
                <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1">
                  {ALL_STICKERS.map((stk) => (
                    <button
                      key={stk.id}
                      type="button"
                      onClick={() => updateSticker(selectedSticker.id, { image: stk.id })}
                      className={`p-1.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                        selectedSticker.image === stk.id
                          ? 'border-rose-500 bg-rose-100 ring-2 ring-rose-300 scale-105'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <img src={stk.filename} alt={stk.name} className="w-8 h-8 object-contain" />
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Color of backing */}
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide mb-2">
                  3. Цвет подложки
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {STICKER_PALETTE.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => updateSticker(selectedSticker.id, { color: c.hex })}
                      style={{ backgroundColor: c.hex }}
                      className={`h-8 rounded-xl border-2 transition-all cursor-pointer ${
                        selectedSticker.color === c.hex
                          ? 'border-rose-500 ring-2 ring-rose-300 scale-105'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* 4. Short Text */}
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide mb-1.5">
                  4. Короткий текст
                </h4>
                <input
                  type="text"
                  value={selectedSticker.text}
                  onChange={(e) => updateSticker(selectedSticker.id, { text: e.target.value })}
                  maxLength={15}
                  placeholder="Свежее..."
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 focus:border-rose-500 font-black text-xs text-slate-900 outline-none"
                />
                <div className="flex gap-1 mt-1.5">
                  {['Свежее', 'Уют', 'Любовь', '100% Вкусно'].map((tx) => (
                    <button
                      key={tx}
                      type="button"
                      onClick={() => updateSticker(selectedSticker.id, { text: tx })}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-[10px] font-bold text-slate-700"
                    >
                      {tx}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-6 text-slate-400 text-xs">
              Нажми на наклейку, чтобы настроить её свойства
            </div>
          )}

          {/* Quick zone change */}
          {selectedSticker && (
            <div className="pt-3 border-t border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block mb-1">
                Перенести наклейку в другую зону:
              </span>
              <div className="grid grid-cols-3 gap-1">
                {['windowL', 'door', 'windowR'].map((z) => (
                  <button
                    key={z}
                    type="button"
                    onClick={() => updateSticker(selectedSticker.id, { targetZone: z as any })}
                    className={`py-1 text-[10px] font-bold rounded-lg border ${
                      selectedSticker.targetZone === z
                        ? 'border-rose-400 bg-rose-50 text-rose-900'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {z === 'door' ? 'Дверь' : z === 'windowL' ? 'Окно Л' : 'Окно П'}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

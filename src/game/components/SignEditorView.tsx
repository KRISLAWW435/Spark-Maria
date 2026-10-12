import React, { useState, useRef } from 'react';
import { SignDesign, FontStyle, SignIconItem } from '../types';
import { SIGN_ICONS, getStickerSrc } from '../constants/stickers';
import { SignRender } from './SignRender';
import { BakeryFacadeView } from './BakeryFacadeView';
import { SparkSprite } from './SparkSprite';
import { soundEngine } from '../engine/SoundEngine';
import { CompositionAssistant } from '../engine/CompositionAssistant';
import {
  Rocket,
  Grid,
  Sparkles,
  Check,
  Type,
  Palette,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Square,
  Undo2,
  Redo2,
  Store,
} from 'lucide-react';

interface SignEditorViewProps {
  initialDesign: SignDesign;
  onTestDesign: (design: SignDesign) => void;
  versionNumber?: number;
  isWindowMode?: boolean;
  onClose?: () => void;
}

export const SIGN_BG_COLORS = [
  { name: 'Кремовый', hex: '#FFF7ED', border: '#FED7AA' },
  { name: 'Солнечный', hex: '#FEF3C7', border: '#FDE047' },
  { name: 'Нежно-розовый', hex: '#FFE4E6', border: '#FDA4AF' },
  { name: 'Мятный', hex: '#E0F2FE', border: '#BAE6FD' },
  { name: 'Шоколад', hex: '#381E11', border: '#23120A' },
  { name: 'Яркий индиго', hex: '#4F46E5', border: '#3730A3' },
  { name: 'Ванильный', hex: '#FEF08A', border: '#FDE047' },
  { name: 'Персиковый', hex: '#FFEDD5', border: '#FDBA74' },
  { name: 'Фисташковый', hex: '#ECFDF5', border: '#A7F3D0' },
  { name: 'Небесный', hex: '#EFF6FF', border: '#BFDBFE' },
];

export const SIGN_TEXT_COLORS = [
  { name: 'Эспрессо', hex: '#2A1B12' },
  { name: 'Спелая вишня', hex: '#991B1B' },
  { name: 'Карамель', hex: '#D97706' },
  { name: 'Тёмно-синий', hex: '#0F172A' },
  { name: 'Белоснежный', hex: '#FFFFFF' },
  { name: 'Малиновый', hex: '#E11D48' },
  { name: 'Золотой', hex: '#F59E0B' },
  { name: 'Изумрудный', hex: '#059669' },
];

export const SIGN_FONTS: Array<{ id: FontStyle; label: string; desc: string; sample: string }> = [
  { id: 'sweet', label: 'Сладкий', desc: 'Мягкий и аппетитный', sample: 'Пекарня Мари' },
  { id: 'bold', label: 'Заметный', desc: 'Видно издалека', sample: 'СВЕЖИЕ ЭКЛЕРЫ' },
  { id: 'handwritten', label: 'Рукописный', desc: 'Уютный домашний стиль', sample: 'Мари и Сладости' },
  { id: 'technical', label: 'Строгий', desc: 'Современный лаконичный', sample: 'MARIE BAKERY' },
  { id: 'playful', label: 'Игривый', desc: 'Веселый и дружелюбный', sample: 'Вкусные Радости' },
  { id: 'elegant', label: 'Элегантный', desc: 'Изысканный французский', sample: 'Pâtisserie Marie' },
];

export const SIGN_HARMONY_PAIRS = [
  { name: 'Кремовый + Эспрессо', bg: '#FFF7ED', text: '#2A1B12' },
  { name: 'Солнечный + Тёмно-синий', bg: '#FEF3C7', text: '#0F172A' },
  { name: 'Мятный + Шоколад', bg: '#ECFDF5', text: '#381E11' },
  { name: 'Персиковый + Какао', bg: '#FFEDD5', text: '#5D4037' },
  { name: 'Небесный + Тёмно-синий', bg: '#EFF6FF', text: '#0F172A' },
];

export const SignEditorView: React.FC<SignEditorViewProps> = ({
  initialDesign,
  onTestDesign,
  versionNumber = 1,
  isWindowMode = true,
  onClose,
}) => {
  const initialIcons: SignIconItem[] = initialDesign.icons && Array.isArray(initialDesign.icons) && initialDesign.icons.length > 0
    ? initialDesign.icons
    : initialDesign.icon && initialDesign.icon !== 'none'
    ? [{ id: 'icon-main', icon: initialDesign.icon, x: 20, y: 50, size: initialDesign.iconSize || 48 }]
    : [{ id: 'icon-main', icon: 'icon1', x: 20, y: 50, size: 48 }];

  const [design, setDesign] = useState<SignDesign>({
    ...initialDesign,
    shape: 'rectangle',
    background: initialDesign.background || initialDesign.bgColor || '#FFF7ED',
    bgColor: initialDesign.background || initialDesign.bgColor || '#FFF7ED',
    font: initialDesign.font || 'sweet',
    fontStyle: initialDesign.fontStyle || 'sweet',
    textColor: initialDesign.textColor || '#2A1B12',
    icon: initialDesign.icon || initialIcons[0]?.icon || 'icon1',
    icons: initialIcons,
    iconSize: initialDesign.iconSize || 48,
  });

  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [showFigmaGuide, setShowFigmaGuide] = useState(true);
  const [history, setHistory] = useState<SignDesign[]>([design]);
  const [historyIdx, setHistoryIdx] = useState(0);

  const [selectedIconId, setSelectedIconId] = useState<string | null>(initialIcons[0]?.id || null);
  const [isDragging, setIsDragging] = useState(false);
  const signContainerRef = useRef<HTMLDivElement>(null);

  const update = (patch: Partial<SignDesign>) => {
    soundEngine.playPop();
    const next = { ...design, ...patch };
    if (patch.background) next.bgColor = patch.background;
    if (patch.font) next.fontStyle = patch.font as FontStyle;
    setDesign(next);

    const newHist = history.slice(0, historyIdx + 1);
    newHist.push(next);
    setHistory(newHist);
    setHistoryIdx(newHist.length - 1);
  };

  // Dragging icons freely across the sign layout
  const handleIconPointerDown = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    setSelectedIconId(id);
    setIsDragging(true);

    const container = signContainerRef.current;
    if (!container) return;

    const onPointerMove = (moveEv: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const xPercent = Math.max(8, Math.min(92, Math.round(((moveEv.clientX - rect.left) / rect.width) * 100)));
      const yPercent = Math.max(12, Math.min(88, Math.round(((moveEv.clientY - rect.top) / rect.height) * 100)));

      setDesign((prev) => {
        const currentList = prev.icons || [];
        const nextIcons = currentList.map((ic) =>
          ic.id === id ? { ...ic, x: xPercent, y: yPercent } : ic
        );
        return { ...prev, icons: nextIcons };
      });
    };

    const onPointerUp = () => {
      setIsDragging(false);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      // Record in undo history
      setDesign((latest) => {
        const newHist = history.slice(0, historyIdx + 1);
        newHist.push(latest);
        setHistory(newHist);
        setHistoryIdx(newHist.length - 1);
        return latest;
      });
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const handleAddIcon = (iconId: string) => {
    soundEngine.playSuccess();
    const newId = `icon-${Date.now()}`;
    const newIconItem: SignIconItem = {
      id: newId,
      icon: iconId,
      x: 75,
      y: 50,
      size: 48,
    };
    const currentList = design.icons || [];
    const updated = [...currentList, newIconItem];
    update({ icons: updated, icon: iconId });
    setSelectedIconId(newId);
  };

  const handleDeleteIcon = (id: string) => {
    soundEngine.playPop();
    const currentList = design.icons || [];
    const remaining = currentList.filter((ic) => ic.id !== id);
    update({ icons: remaining, icon: remaining[0]?.icon || 'none' });
    setSelectedIconId(remaining[0]?.id || null);
  };

  const handleUpdateSelectedIcon = (patch: Partial<SignIconItem>) => {
    if (!selectedIconId) return;
    const currentList = design.icons || [];
    const updated = currentList.map((ic) =>
      ic.id === selectedIconId ? { ...ic, ...patch } : ic
    );
    update({ icons: updated, icon: patch.icon || design.icon });
  };

  const handleUndo = () => {
    if (historyIdx > 0) {
      soundEngine.playClick();
      setHistoryIdx(historyIdx - 1);
      setDesign(history[historyIdx - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIdx < history.length - 1) {
      soundEngine.playClick();
      setHistoryIdx(historyIdx + 1);
      setDesign(history[historyIdx + 1]);
    }
  };

  const feedback = CompositionAssistant.evaluateSign(design);

  const steps = [
    { id: 1, title: 'Цвета', icon: <Palette className="w-5 h-5" /> },
    { id: 2, title: 'Текст', icon: <Type className="w-5 h-5" /> },
    { id: 3, title: 'Шрифт', icon: <Type className="w-5 h-5" /> },
    { id: 4, title: 'Иконки', icon: <ImageIcon className="w-5 h-5" /> },
  ];



  return (
    <div className={`${onClose ? 'fixed inset-0 z-50 w-screen h-screen' : `w-full ${isWindowMode ? 'h-full' : 'h-screen'}`} bg-[#F7F9FC] text-slate-800 flex flex-col justify-between overflow-hidden select-none font-sans`}>
      {/* Top Bar */}
      <div className="bg-white border-b-2 border-slate-200 px-4 py-2 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ЗАКАЗ №1 • ВЫВЕСКА МАРИ</span>
          </div>
          <span className="text-xs font-bold text-slate-500 hidden sm:inline">
            Версия #{versionNumber}
          </span>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={historyIdx <= 0}
            className={`p-1.5 rounded-xl border text-xs cursor-pointer ${
              historyIdx > 0 ? 'bg-white border-slate-300 text-slate-700' : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            title="Отменить"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={historyIdx >= history.length - 1}
            className={`p-1.5 rounded-xl border text-xs cursor-pointer ${
              historyIdx < history.length - 1 ? 'bg-white border-slate-300 text-slate-700' : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            title="Повторить"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>

          {/* Test on street button */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playTestStart();
              onTestDesign(design);
            }}
            className="px-4 py-1.5 rounded-xl bg-[#58CC02] border-b-2 border-[#46A302] hover:bg-[#46A302] active:translate-y-0.5 text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Rocket className="w-3.5 h-3.5" /> Проверить на улице ➔
          </button>

          {/* Close Fullscreen Button (✕) */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-11 h-11 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white shadow-xl flex items-center justify-center font-black text-xl cursor-pointer ml-1 transition-transform active:scale-95 shrink-0"
              title="Закрыть редактор"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Steps Icon Panel at Top */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-center gap-3 z-10 shrink-0">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">Шаги:</span>
        {steps.map((st) => {
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setActiveStep(st.id as any);
              }}
              className={`px-3.5 py-2 rounded-2xl flex items-center gap-2 transition-all cursor-pointer relative ${
                activeStep === st.id
                  ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300 font-black scale-105'
                  : 'bg-slate-100 hover:bg-amber-100 text-slate-700 font-bold'
              }`}
              title={st.title}
            >
              {st.icon}
              <span className="text-xs">{st.title}</span>
              {activeStep > st.id && (
                <div className="absolute -top-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5 shadow-xs">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row p-3 gap-3 overflow-hidden">
        {/* CENTER COLUMN: Expanded Live Canvas Preview */}
        <div className="flex-1 bg-slate-950 rounded-2xl relative overflow-hidden flex items-center justify-center shadow-inner border border-slate-800">
          <BakeryFacadeView
            signDesign={design}
            showSignZoneGuide={showFigmaGuide}
            activeZones={['sign']}
            className="w-full h-full"
            selectedSignIconId={selectedIconId}
            onSignIconPointerDown={handleIconPointerDown}
            onSignIconClick={(id) => setSelectedIconId(id)}
            signContainerRef={signContainerRef}
          />

          {/* Spark Design Tip Box in Bottom-Left Corner */}
          <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md border border-amber-200 p-3 rounded-2xl shadow-xl flex items-start gap-2.5 max-w-xs pointer-events-auto">
            <SparkSprite emotion={feedback.status === 'good' ? 'happy' : 'thinking'} size={38} className="shrink-0" />
            <div className="text-[11px] leading-snug">
              <span className="font-black text-amber-900 block mb-0.5">Совет Спарк:</span>
              <p className="text-amber-800">{feedback.sparkMessage}</p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Tool Controls for active step */}
        <div className="w-full md:w-72 bg-white border border-slate-200 rounded-2xl p-3 flex flex-col justify-between shrink-0 shadow-xs overflow-y-auto">
          <div>
            {/* Step 1: Colors (Background & Text Color) */}
            {activeStep === 1 && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide mb-2">
                    Цвет фона вывески (10 цветов)
                  </h4>
                  <div className="grid grid-cols-5 gap-2">
                    {SIGN_BG_COLORS.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => update({ background: c.hex, bgColor: c.hex })}
                        style={{ backgroundColor: c.hex }}
                        className={`h-9 rounded-xl border-2 transition-all cursor-pointer shadow-xs ${
                          design.background === c.hex || design.bgColor === c.hex
                            ? 'border-amber-500 ring-2 ring-amber-300 scale-110'
                            : 'border-slate-300 hover:scale-105'
                        }`}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide mb-2">
                    Цвет текста (8 цветов)
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    {SIGN_TEXT_COLORS.map((tc) => (
                      <button
                        key={tc.hex}
                        type="button"
                        onClick={() => update({ textColor: tc.hex })}
                        style={{ backgroundColor: tc.hex }}
                        className={`h-9 rounded-xl border-2 transition-all cursor-pointer ${
                          design.textColor === tc.hex
                            ? 'border-amber-500 ring-2 ring-amber-300 scale-110'
                            : 'border-slate-300 hover:scale-105'
                        }`}
                        title={tc.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Text Input & Layout */}
            {/* Step 2: Text Input & Layout */}
            {activeStep === 2 && (
              <div className="space-y-3.5">
                {/* 1. Main Title Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                      Название вывески
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400">
                      {design.text?.length || 0}/30
                    </span>
                  </div>
                  <input
                    type="text"
                    value={design.text}
                    onChange={(e) => update({ text: e.target.value })}
                    maxLength={30}
                    placeholder="Введи название (например: Пекарня Мари)..."
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 focus:border-amber-500 font-black text-sm text-slate-900 outline-none transition-all shadow-xs"
                  />
                </div>

                {/* 2. Main Title Size (Размер текста названия) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                      Размер текста названия:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => update({ fontSize: Math.max(14, (design.fontSize || 24) - 2) })}
                        className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                        title="Уменьшить на 2px"
                      >
                        -
                      </button>
                      <span className="text-xs font-black text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200 min-w-12 text-center shadow-xs">
                        {design.fontSize || 24}px
                      </span>
                      <button
                        type="button"
                        onClick={() => update({ fontSize: Math.min(44, (design.fontSize || 24) + 2) })}
                        className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                        title="Увеличить на 2px"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* 2 columns so words never spill out */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { size: 18, label: 'Мелкий', badge: '18px' },
                      { size: 24, label: 'Средний', badge: '24px' },
                      { size: 30, label: 'Крупный', badge: '30px' },
                      { size: 38, label: 'Огромный', badge: '38px' },
                    ].map((sz) => (
                      <button
                        key={sz.size}
                        type="button"
                        onClick={() => update({ fontSize: sz.size })}
                        className={`py-2 px-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          (design.fontSize || 24) === sz.size
                            ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm ring-2 ring-amber-300 font-black'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 font-bold'
                        }`}
                      >
                        <span className="text-xs">{sz.label}</span>
                        <span className="text-[10px] opacity-75 font-mono">{sz.badge}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Presets for Title */}
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                    Быстрые варианты названия:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {['Пекарня Мари', 'Свежие Эклеры', 'Французская Пекарня', 'Sweet Bakery'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => update({ text: preset })}
                        className={`text-left px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer truncate ${
                          design.text === preset
                            ? 'bg-amber-100 border-amber-400 text-amber-950 font-black'
                            : 'bg-slate-50 border-slate-200 hover:bg-amber-50 text-slate-700'
                        }`}
                        title={preset}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subtitle (Подзаголовок) - Optional Supplement (Дополнение) */}
                <div className="pt-3 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                      <span>Подзаголовок</span>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                        не обязательно
                      </span>
                    </h4>
                    {design.subtext && design.subtext.trim().length > 0 && (
                      <button
                        type="button"
                        onClick={() => update({ subtext: '' })}
                        className="text-[11px] text-rose-600 hover:text-rose-800 font-bold hover:underline cursor-pointer"
                        title="Удалить подзаголовок"
                      >
                        Убрать ✕
                      </button>
                    )}
                  </div>

                  {design.subtext && design.subtext.trim().length > 0 ? (
                    <div className="space-y-2.5 animate-fadeIn">
                      <input
                        type="text"
                        value={design.subtext}
                        onChange={(e) => update({ subtext: e.target.value })}
                        maxLength={40}
                        placeholder="Например: Свежая выпечка каждый день..."
                        className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 focus:border-amber-500 font-bold text-xs text-slate-900 outline-none shadow-xs"
                      />

                      {/* Subtitle Font Size (Увеличен диапазон: 12px - 26px) */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold text-slate-600">
                            Размер подзаголовка:
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => update({ subtextSize: Math.max(12, (design.subtextSize || 16) - 1) })}
                              className="w-5 h-5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                              title="Уменьшить"
                            >
                              -
                            </button>
                            <span className="text-[11px] font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 min-w-10 text-center font-mono">
                              {design.subtextSize || 16}px
                            </span>
                            <button
                              type="button"
                              onClick={() => update({ subtextSize: Math.min(26, (design.subtextSize || 16) + 1) })}
                              className="w-5 h-5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                              title="Увеличить"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { size: 14, label: 'Компактный' },
                            { size: 18, label: 'Стандарт' },
                            { size: 24, label: 'Крупный' },
                          ].map((sz) => (
                            <button
                              key={sz.size}
                              type="button"
                              onClick={() => update({ subtextSize: sz.size })}
                              className={`py-1.5 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                (design.subtextSize || 16) === sz.size
                                  ? 'bg-amber-300 text-slate-950 border-amber-400 font-black shadow-xs'
                                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {sz.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Subtitle Alignment (Выравнивание подзаголовка) */}
                      <div>
                        <span className="text-[11px] font-bold text-slate-600 block mb-1">
                          Выравнивание подзаголовка:
                        </span>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { id: 'left', label: 'Слева' },
                            { id: 'center', label: 'По центру' },
                            { id: 'right', label: 'Справа' },
                          ].map((align) => (
                            <button
                              key={align.id}
                              type="button"
                              onClick={() => update({ subtextAlign: align.id as any })}
                              className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                (design.subtextAlign || design.textAlign || 'center') === align.id
                                  ? 'bg-amber-300 text-slate-950 border-amber-400 shadow-xs font-black'
                                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {align.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quick Subtitle Presets */}
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block mb-1">
                          Варианты подзаголовка:
                        </span>
                        <div className="grid grid-cols-1 gap-1">
                          {[
                            'Свежая выпечка каждый день',
                            'Эклеры и круассаны с 8:00',
                            'Французские десерты и кофе',
                          ].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => update({ subtext: preset })}
                              className={`text-left px-2.5 py-1.5 rounded-lg text-[10px] font-medium border transition-colors cursor-pointer truncate ${
                                design.subtext === preset
                                  ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                                  : 'bg-slate-50 border-slate-200 hover:bg-amber-50 text-slate-600'
                              }`}
                            >
                              {preset}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => update({ subtext: 'Свежая выпечка каждый день', subtextSize: 14 })}
                      className="w-full py-2.5 px-3 rounded-xl border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/50 hover:bg-amber-50 text-amber-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>➕ Добавить подзаголовок (девиз)</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Font (6 fonts with Cyrillic) */}
            {activeStep === 3 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide mb-2">
                  Шрифт (6 стилей)
                </h4>
                {SIGN_FONTS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => update({ font: f.id, fontStyle: f.id })}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                      design.font === f.id || design.fontStyle === f.id
                        ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-300 font-black'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{f.label}</span>
                      <span className="text-[10px] text-slate-400">{f.desc}</span>
                    </div>
                    <div className="text-xs text-amber-800 mt-1 truncate font-medium">
                      {f.sample}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 4: Icon & Decor - Full custom positioning, resizing, moving across the sign */}
            {activeStep === 4 && (
              <div className="space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                    Иконки на вывеске
                  </h4>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    Всего: {design.icons?.length || 0} шт
                  </span>
                </div>

                {/* Helpful kid tip for dragging */}
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-2 flex items-center gap-2 text-[11px] font-bold text-amber-900">
                  <span className="text-base shrink-0">👆</span>
                  <span>Нажимай на иконку прямо на вывеске и перетаскивай куда угодно!</span>
                </div>

                {/* Selected Icon Controls */}
                {selectedIconId && design.icons?.some((ic) => ic.id === selectedIconId) ? (
                  <div className="bg-white border-2 border-amber-400 rounded-xl p-2.5 space-y-2.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wide">
                        Выбранная иконка
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteIcon(selectedIconId)}
                        className="text-[11px] text-rose-600 hover:text-rose-800 font-black hover:underline cursor-pointer"
                        title="Удалить выбранную иконку"
                      >
                        Удалить ✕
                      </button>
                    </div>

                    {/* Resizing current icon */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-slate-600">Размер этой иконки:</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              const curr = design.icons?.find((ic) => ic.id === selectedIconId);
                              if (curr) handleUpdateSelectedIcon({ size: Math.max(20, curr.size - 6) });
                            }}
                            className="w-5 h-5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                            title="Уменьшить"
                          >
                            -
                          </button>
                          <span className="text-[11px] font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 min-w-10 text-center font-mono">
                            {design.icons?.find((ic) => ic.id === selectedIconId)?.size || 48}px
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const curr = design.icons?.find((ic) => ic.id === selectedIconId);
                              if (curr) handleUpdateSelectedIcon({ size: Math.min(80, curr.size + 6) });
                            }}
                            className="w-5 h-5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
                            title="Увеличить"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-1">
                        {[
                          { sz: 28, label: 'Маленькая' },
                          { sz: 48, label: 'Средняя' },
                          { sz: 68, label: 'Большая' },
                        ].map((s) => {
                          const curr = design.icons?.find((ic) => ic.id === selectedIconId);
                          return (
                            <button
                              key={s.sz}
                              type="button"
                              onClick={() => handleUpdateSelectedIcon({ size: s.sz })}
                              className={`py-1 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                                (curr?.size || 48) === s.sz
                                  ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-xs font-black'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {s.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Quick Move Buttons */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Быстрое перемещение:
                      </span>
                      <div className="grid grid-cols-4 gap-1">
                        {[
                          { pos: { x: 18, y: 50 }, label: 'Слева', icon: '⬅️' },
                          { pos: { x: 82, y: 50 }, label: 'Справа', icon: '➡️' },
                          { pos: { x: 50, y: 20 }, label: 'Сверху', icon: '⬆️' },
                          { pos: { x: 50, y: 80 }, label: 'Снизу', icon: '⬇️' },
                        ].map((p) => (
                          <button
                            key={p.label}
                            type="button"
                            onClick={() => handleUpdateSelectedIcon(p.pos)}
                            className="py-1 px-1 rounded-xl text-[10px] font-bold border border-slate-200 bg-slate-50 hover:bg-amber-100 text-slate-700 flex flex-col items-center gap-0.5 cursor-pointer active:scale-95 transition-all"
                          >
                            <span className="text-xs">{p.icon}</span>
                            <span>{p.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-center">
                    Выбери картинку ниже, чтобы добавить её на вывеску!
                  </div>
                )}

                {/* Add New Icon from Palette */}
                <div>
                  <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wide block mb-1">
                    Добавить иконку на вывеску:
                  </span>
                  <div className="grid grid-cols-4 gap-1.5 max-h-48 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                    {SIGN_ICONS.map((ic) => (
                      <button
                        key={ic.id}
                        type="button"
                        onClick={() => handleAddIcon(ic.id)}
                        className="h-13 rounded-xl border-2 border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50 flex items-center justify-center transition-all cursor-pointer p-1 active:scale-95 shadow-2xs"
                        title="Нажми, чтобы добавить на вывеску"
                      >
                        <img
                          src={getStickerSrc(ic.id)}
                          alt={ic.name}
                          className="w-9 h-9 object-contain drop-shadow-xs pointer-events-none"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear all icons */}
                {design.icons && design.icons.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playPop();
                      update({ icons: [], icon: 'none' });
                      setSelectedIconId(null);
                    }}
                    className="w-full py-1.5 px-3 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                  >
                    🗑️ Очистить все иконки
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Next step button */}
          <div className="pt-3 border-t border-slate-200 flex justify-between">
            <button
              type="button"
              disabled={activeStep <= 1}
              onClick={() => setActiveStep((prev) => Math.max(1, prev - 1) as any)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 disabled:opacity-40"
            >
              Назад
            </button>
            <button
              type="button"
              disabled={activeStep >= 4}
              onClick={() => setActiveStep((prev) => Math.min(4, prev + 1) as any)}
              className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black disabled:opacity-40 shadow-xs"
            >
              Далее ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

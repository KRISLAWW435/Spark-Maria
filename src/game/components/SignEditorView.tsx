import React, { useState } from 'react';
import { SignDesign, FontStyle } from '../types';
import { SIGN_ICONS } from '../constants/stickers';
import { SignRender } from './SignRender';
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
} from 'lucide-react';

interface SignEditorViewProps {
  initialDesign: SignDesign;
  onTestDesign: (design: SignDesign) => void;
  versionNumber?: number;
  isWindowMode?: boolean;
}

export const SIGN_BG_COLORS = [
  { name: 'Кремовый', hex: '#FFF7ED', border: '#FED7AA' },
  { name: 'Солнечный', hex: '#FEF3C7', border: '#FDE047' },
  { name: 'Нежно-розовый', hex: '#FFE4E6', border: '#FDA4AF' },
  { name: 'Мятный', hex: '#E0F2FE', border: '#BAE6FD' },
  { name: 'Шоколад', hex: '#381E11', border: '#23120A' },
  { name: 'Яркий индиго', hex: '#4F46E5', border: '#3730A3' },
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

export const SignEditorView: React.FC<SignEditorViewProps> = ({
  initialDesign,
  onTestDesign,
  versionNumber = 1,
  isWindowMode = true,
}) => {
  const [design, setDesign] = useState<SignDesign>({
    ...initialDesign,
    shape: 'rectangle', // Form is strictly rectangular as per TZ
    background: initialDesign.background || initialDesign.bgColor || '#FFF7ED',
    bgColor: initialDesign.background || initialDesign.bgColor || '#FFF7ED',
    font: initialDesign.font || 'sweet',
    fontStyle: initialDesign.fontStyle || 'sweet',
    textColor: initialDesign.textColor || '#2A1B12',
    icon: initialDesign.icon || 'icon1',
  });

  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [showGrid, setShowGrid] = useState(false);
  const [history, setHistory] = useState<SignDesign[]>([design]);
  const [historyIdx, setHistoryIdx] = useState(0);

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
    { id: 1, title: '1. Фон (6 цветов)', icon: <Palette className="w-4 h-4" /> },
    { id: 2, title: '2. Название (текст)', icon: <Type className="w-4 h-4" /> },
    { id: 3, title: '3. Шрифт (6 стилей)', icon: <Type className="w-4 h-4" /> },
    { id: 4, title: '4. Цвет букв (8 цветов)', icon: <Palette className="w-4 h-4" /> },
    { id: 5, title: '5. Иконка (20 на выбор)', icon: <ImageIcon className="w-4 h-4" /> },
  ];

  return (
    <div className={`w-full ${isWindowMode ? 'h-full' : 'h-screen'} bg-[#F7F9FC] text-slate-800 flex flex-col justify-between overflow-hidden select-none font-sans`}>
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

        {/* Undo / Redo & Grid Toggle */}
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
        </div>
      </div>

      {/* Main Workspace (3 columns on wide screens) */}
      <div className="flex-1 flex flex-col md:flex-row p-3 gap-3 overflow-hidden">
        {/* LEFT COLUMN: Steps */}
        <div className="w-full md:w-56 bg-white border border-slate-200 rounded-2xl p-3 flex flex-col justify-between shrink-0 shadow-xs">
          <div>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-2 px-1">
              Шаги разработки
            </span>
            <div className="space-y-1.5">
              {steps.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveStep(st.id as 1 | 2 | 3 | 4 | 5);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    activeStep === st.id
                      ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {st.icon}
                    <span>{st.title}</span>
                  </div>
                  {activeStep > st.id && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Spark Tip box */}
          <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2">
            <SparkSprite emotion={feedback.status === 'good' ? 'happy' : 'thinking'} size={40} className="shrink-0" />
            <div className="text-[11px] leading-snug">
              <span className="font-black text-amber-900 block mb-0.5">Совет Спарк:</span>
              <p className="text-amber-800">{feedback.sparkMessage}</p>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Live Canvas Preview with Composition Frame */}
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between items-center relative overflow-hidden shadow-xs">
          {/* Grid lines if enabled */}
          {showGrid && (
            <div
              className="absolute inset-0 pointer-events-none opacity-25"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
          )}

          {/* Guidelines info badge */}
          <div className="w-full flex items-center justify-between text-xs text-slate-500 z-10 mb-2">
            <span className="flex items-center gap-1 font-bold">
              <Square className="w-3.5 h-3.5 text-amber-500" /> Форма: Прямоугольная
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black flex items-center gap-1 ${
              feedback.guideBorderColor === 'green'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}>
              {feedback.guideBorderColor === 'green' ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <AlertCircle className="w-3 h-3 text-amber-600" />}
              {feedback.guideBorderColor === 'green' ? 'Композиция сбалансирована' : 'Можно улучшить'}
            </span>
          </div>

          {/* Sign Board Centerpiece */}
          <div className="flex-1 w-full flex items-center justify-center p-4 z-10">
            <div className={`p-4 rounded-3xl transition-all ${
              feedback.guideBorderColor === 'green'
                ? 'ring-4 ring-emerald-400/40 shadow-xl'
                : 'ring-4 ring-amber-400/40 shadow-xl'
            }`}>
              <SignRender design={design} scale={1.2} />
            </div>
          </div>

          {/* Bottom auto-align info */}
          <div className="text-[11px] text-slate-400 font-medium z-10">
            Иконка выравнивается слева от текста • Текст строго по центру
          </div>
        </div>

        {/* RIGHT COLUMN: Tool Controls for active step */}
        <div className="w-full md:w-72 bg-white border border-slate-200 rounded-2xl p-3 flex flex-col justify-between shrink-0 shadow-xs overflow-y-auto">
          <div>
            {/* Step 1: Background (6 colors) */}
            {activeStep === 1 && (
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                  Фон вывески (6 цветов)
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {SIGN_BG_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => update({ background: c.hex, bgColor: c.hex })}
                      style={{ backgroundColor: c.hex }}
                      className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                        design.background === c.hex || design.bgColor === c.hex
                          ? 'border-amber-500 ring-2 ring-amber-300 scale-102'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className={`text-xs font-black ${['#381E11', '#4F46E5'].includes(c.hex) ? 'text-white' : 'text-slate-900'}`}>
                        {c.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Text Input */}
            {activeStep === 2 && (
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                  Название пекарни
                </h4>
                <input
                  type="text"
                  value={design.text}
                  onChange={(e) => update({ text: e.target.value })}
                  maxLength={30}
                  placeholder="Введи название..."
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 focus:border-amber-500 font-black text-sm text-slate-900 outline-none"
                />

                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
                    Быстрые варианты:
                  </span>
                  <div className="space-y-1">
                    {['Пекарня Мари', 'Свежие Эклеры', 'Французская Пекарня', 'Sweet Bakery'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => update({ text: preset })}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-amber-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
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

            {/* Step 4: Text Color (8 colors) */}
            {activeStep === 4 && (
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                  Цвет текста (8 вариантов)
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {SIGN_TEXT_COLORS.map((tc) => (
                    <button
                      key={tc.hex}
                      type="button"
                      onClick={() => update({ textColor: tc.hex })}
                      className={`p-2.5 rounded-xl border-2 flex items-center gap-2 transition-all cursor-pointer ${
                        design.textColor === tc.hex
                          ? 'border-amber-500 ring-2 ring-amber-300 bg-amber-50'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div
                        style={{ backgroundColor: tc.hex }}
                        className="w-5 h-5 rounded-full border border-slate-300 shrink-0"
                      />
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {tc.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Icon (20 icons, NO characters) */}
            {activeStep === 5 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                    Иконка (20 на выбор)
                  </h4>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    Только выпечка и предметы
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto p-1">
                  {SIGN_ICONS.map((ic) => (
                    <button
                      key={ic.id}
                      type="button"
                      onClick={() => update({ icon: ic.id })}
                      className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                        design.icon === ic.id
                          ? 'border-amber-500 bg-amber-100 ring-2 ring-amber-300 scale-105'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                      title={ic.name}
                    >
                      <img
                        src={ic.filename}
                        alt={ic.name}
                        className="w-9 h-9 object-contain drop-shadow-xs"
                      />
                      <span className="text-[9px] font-bold text-slate-600 truncate mt-1 max-w-[50px]">
                        {ic.name}
                      </span>
                    </button>
                  ))}
                </div>
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
              disabled={activeStep >= 5}
              onClick={() => setActiveStep((prev) => Math.min(5, prev + 1) as any)}
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

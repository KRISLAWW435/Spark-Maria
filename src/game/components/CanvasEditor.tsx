import React, { useState } from 'react';
import { SignDesign, FontStyle, ShapeType, IconType } from '../types';
import { SignRender } from './SignRender';
import { SparkSprite } from './SparkSprite';
import { soundEngine } from '../engine/SoundEngine';
import { getContrastRatio } from '../engine/DesignEvaluation';
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  CheckCircle2,
  Edit3,
  Rocket,
  Undo2,
  Redo2,
  Smile,
  Type,
  Palette,
  Square,
  Eye,
  Sliders,
} from 'lucide-react';

interface CanvasEditorProps {
  initialDesign: SignDesign;
  onTestDesign: (design: SignDesign) => void;
  versionNumber: number;
  isWindowMode?: boolean;
}

export type StepKey = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const CanvasEditor: React.FC<CanvasEditorProps> = ({
  initialDesign,
  onTestDesign,
  versionNumber,
  isWindowMode = false,
}) => {
  const [design, setDesign] = useState<SignDesign>({ ...initialDesign });
  const [history, setHistory] = useState<SignDesign[]>([{ ...initialDesign }]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [currentStep, setCurrentStep] = useState<StepKey>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);

  const updateDesign = (next: Partial<SignDesign>) => {
    soundEngine.playPop();
    const updated = { ...design, ...next };
    setDesign(updated);

    const newHistory = history.slice(0, historyIdx + 1);
    newHistory.push(updated);
    setHistory(newHistory);
    setHistoryIdx(newHistory.length - 1);

    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
  };

  const handleStepChange = (step: StepKey) => {
    soundEngine.playClick();
    setCurrentStep(step);
    if (!completedSteps.includes(step)) {
      setCompletedSteps((prev) => [...prev, step]);
    }
  };

  const handleUndo = () => {
    if (historyIdx > 0) {
      soundEngine.playClick();
      const prev = history[historyIdx - 1];
      setHistoryIdx(historyIdx - 1);
      setDesign(prev);
    }
  };

  const handleRedo = () => {
    if (historyIdx < history.length - 1) {
      soundEngine.playClick();
      const next = history[historyIdx + 1];
      setHistoryIdx(historyIdx + 1);
      setDesign(next);
    }
  };

  const contrast = getContrastRatio(design.bgColor, design.textColor);
  const isGoodContrast = contrast >= 4.0;
  const isFairContrast = contrast >= 2.5 && contrast < 4.0;

  const stepList = [
    {
      id: 1 as StepKey,
      title: 'Шаг 1: Форма вывески',
      shortTitle: 'Форма',
      icon: <Square className="w-4 h-4" />,
      sparkTip: 'Выбери форму вывески. Овальная, скругленная или классическая?',
    },
    {
      id: 2 as StepKey,
      title: 'Шаг 2: Название',
      shortTitle: 'Название',
      icon: <Edit3 className="w-4 h-4" />,
      sparkTip: 'Напиши название. Как прохожие узнают нашу пекарню?',
    },
    {
      id: 3 as StepKey,
      title: 'Шаг 3: Шрифт',
      shortTitle: 'Шрифт',
      icon: <Type className="w-4 h-4" />,
      sparkTip: 'Выбери шрифт. Важно, чтобы надпись легко читалась на ходу!',
    },
    {
      id: 4 as StepKey,
      title: 'Шаг 4: Цвет фона',
      shortTitle: 'Цвет фона',
      icon: <Palette className="w-4 h-4 text-amber-500" />,
      sparkTip: 'Выбери цвет фона. Аппетитный пастельный или яркий контрастный?',
    },
    {
      id: 5 as StepKey,
      title: 'Шаг 5: Цвет текста',
      shortTitle: 'Цвет текста',
      icon: <Palette className="w-4 h-4 text-rose-500" />,
      sparkTip: 'Выбери цвет текста. Помни про контраст между буквами и фоном!',
    },
    {
      id: 6 as StepKey,
      title: 'Шаг 6: Иконка',
      shortTitle: 'Иконка',
      icon: <Smile className="w-4 h-4" />,
      sparkTip: 'Добавь иконку. Круассан или кекс сразу подскажут, что здесь сладости!',
    },
    {
      id: 7 as StepKey,
      title: 'Шаг 7: Проверка контраста',
      shortTitle: 'Контраст',
      icon: <Eye className="w-4 h-4" />,
      sparkTip: 'Проверь контраст. Если всё отлично — нажимай "Проверить на улице"!',
    },
  ];

  const currentStepData = stepList.find((s) => s.id === currentStep) || stepList[0];

  const shapeCards: Array<{ id: ShapeType; label: string; icon: string; bg: string; border: string }> = [
    { id: 'rounded', label: 'Скругленная', icon: '▢', bg: 'bg-sky-50 text-sky-700', border: 'border-sky-400' },
    { id: 'oval', label: 'Овальная', icon: '⬭', bg: 'bg-purple-50 text-purple-700', border: 'border-purple-400' },
    { id: 'rectangle', label: 'Классика', icon: '▬', bg: 'bg-emerald-50 text-emerald-700', border: 'border-emerald-400' },
    { id: 'badge', label: 'Ретро-герб', icon: '✦', bg: 'bg-amber-50 text-amber-700', border: 'border-amber-400' },
    { id: 'banner', label: 'Баннер', icon: '▭', bg: 'bg-rose-50 text-rose-700', border: 'border-rose-400' },
  ];

  const bgColorPalette = [
    { name: 'Кремовый', hex: '#FFF7ED', border: '#FED7AA' },
    { name: 'Солнечный', hex: '#FEF3C7', border: '#FDE047' },
    { name: 'Нежно-розовый', hex: '#FFE4E6', border: '#FDA4AF' },
    { name: 'Мятный', hex: '#E0F2FE', border: '#BAE6FD' },
    { name: 'Яркий индиго', hex: '#4F46E5', border: '#3730A3' },
    { name: 'Шоколад', hex: '#381E11', border: '#23120A' },
    { name: 'Коралл', hex: '#F43F5E', border: '#E11D48' },
    { name: 'Белоснежный', hex: '#FFFFFF', border: '#CBD5E1' },
  ];

  const textColorPalette = [
    { name: 'Эспрессо', hex: '#2A1B12', border: '#170E0A' },
    { name: 'Спелая вишня', hex: '#991B1B', border: '#7F1D1D' },
    { name: 'Карамель', hex: '#D97706', border: '#B45309' },
    { name: 'Тёмно-синий', hex: '#0F172A', border: '#020617' },
    { name: 'Белоснежный', hex: '#FFFFFF', border: '#CBD5E1' },
    { name: 'Малиновый', hex: '#E11D48', border: '#BE123C' },
    { name: 'Золотой', hex: '#F59E0B', border: '#D97706' },
  ];

  const fontCards: Array<{ id: FontStyle; label: string; desc: string; sample: string }> = [
    { id: 'sweet', label: 'Сладкий (Круглый)', desc: 'Мягкий и аппетитный', sample: 'Кондитерская Мари' },
    { id: 'bold', label: 'Жирный (Заметный)', desc: 'Видно с большого расстояния', sample: 'КОНДИТЕРСКАЯ' },
    { id: 'handwritten', label: 'Рукописный', desc: 'Уютный домашний стиль', sample: 'Мари & Эклеры' },
    { id: 'technical', label: 'Строгий', desc: 'Лаконичный современный стиль', sample: 'BAKERY & CO' },
  ];

  const iconOptions: Array<{ id: IconType; label: string; emoji: string; desc: string; bg: string }> = [
    { id: 'cupcake', label: 'Кексик', emoji: '🧁', desc: 'Идеально для сладостей', bg: 'bg-rose-100 border-rose-300 text-rose-900' },
    { id: 'croissant', label: 'Круассан', emoji: '🥐', desc: 'Свежая выпечка', bg: 'bg-amber-100 border-amber-300 text-amber-900' },
    { id: 'shrimp', label: 'Креветка', emoji: '🦐', desc: 'Забавный эксперимент', bg: 'bg-orange-100 border-orange-300 text-orange-900' },
    { id: 'tire', label: 'Шина', emoji: '🛞', desc: 'Ассоциация с автосервисом', bg: 'bg-slate-100 border-slate-300 text-slate-900' },
    { id: 'wrench', label: 'Ключ', emoji: '🔧', desc: 'Ремонт и инструменты', bg: 'bg-blue-100 border-blue-300 text-blue-900' },
    { id: 'none', label: 'Без иконки', emoji: '🚫', desc: 'Только название', bg: 'bg-slate-100 border-slate-300 text-slate-700' },
  ];

  const presetTexts = ['Кондитерская Мари', 'Свежие Эклеры', 'Сладости у Мари', 'Sweet Marie 🥐'];

  return (
    <div className={`relative w-full ${isWindowMode ? 'h-full' : 'h-screen'} bg-[#F7F9FC] text-slate-800 overflow-hidden select-none flex flex-col justify-between font-sans`}>
      {/* TOP HEADER */}
      <header className="bg-white border-b-2 border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-2xl bg-[#FFC800] border-b-3 border-[#E5A500] text-slate-950 font-black text-xs md:text-sm flex items-center gap-2 shadow-xs">
            <Sparkles className="w-4 h-4 fill-current" />
            <span>ХОЛСТ ДИЗАЙНЕРА • ВЕРСИЯ #{versionNumber}</span>
          </div>
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={historyIdx <= 0}
            className={`px-3 py-1.5 rounded-xl border-2 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              historyIdx > 0
                ? 'bg-white border-slate-300 border-b-3 text-slate-700 hover:bg-slate-50 active:border-b-2 active:translate-y-0.5'
                : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Undo2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Отменить</span>
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={historyIdx >= history.length - 1}
            className={`px-3 py-1.5 rounded-xl border-2 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              historyIdx < history.length - 1
                ? 'bg-white border-slate-300 border-b-3 text-slate-700 hover:bg-slate-50 active:border-b-2 active:translate-y-0.5'
                : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Redo2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Повторить</span>
          </button>
        </div>

        {/* Primary Green Button to Launch Test */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playTestStart();
            onTestDesign(design);
          }}
          className="px-5 py-2 rounded-2xl bg-[#58CC02] border-b-3 border-[#46A302] hover:bg-[#46A302] active:border-b-0 active:translate-y-0.5 text-white font-black text-xs md:text-sm uppercase tracking-wider shadow-md flex items-center gap-2 transition-all cursor-pointer"
        >
          <Rocket className="w-4 h-4 fill-current" /> Проверить на улице ➔
        </button>
      </header>

      {/* MAIN WORKSPACE: 3 COLUMNS OR 2 COLUMNS */}
      <main className={`flex-1 flex flex-col md:flex-row w-full ${isWindowMode ? 'h-[calc(100%-55px)]' : 'h-[calc(100vh-65px)]'} p-3 md:p-4 gap-3 md:gap-4 overflow-hidden`}>
        {/* ================= LEFT COLUMN: STEP NAVIGATION CHECKLIST (7 STEPS) ================= */}
        <div className="w-full md:w-64 bg-white border-2 border-slate-200 rounded-[28px] shadow-sm p-4 flex flex-col justify-between overflow-y-auto shrink-0">
          <div>
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 px-1">
              Шаги разработки ({completedSteps.length}/7)
            </h4>
            <div className="space-y-1.5">
              {stepList.map((step) => {
                const isCurrent = currentStep === step.id;
                const isDone = completedSteps.includes(step.id);

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => handleStepChange(step.id)}
                    className={`w-full p-2.5 rounded-2xl text-left flex items-center justify-between text-xs font-bold transition-all cursor-pointer border ${
                      isCurrent
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-200'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                        isCurrent ? 'bg-white text-indigo-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {step.id}
                      </span>
                      <span>{step.shortTitle}</span>
                    </div>

                    {isDone && (
                      <CheckCircle2 className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-emerald-500'}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-2">
            <button
              type="button"
              onClick={() => {
                soundEngine.playTestStart();
                onTestDesign(design);
              }}
              className="w-full py-3 rounded-2xl bg-[#58CC02] hover:bg-[#46A302] text-white font-black text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <span>Проверить на улице</span>
              <Rocket className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ================= MIDDLE: GIANT INTERACTIVE DESIGN CANVAS ================= */}
        <div className="flex-1 bg-white border-4 border-slate-200 rounded-[36px] shadow-sm flex flex-col items-center justify-between p-6 relative overflow-hidden">
          {/* Top Spark Advice Speech Bubble */}
          <div className="relative z-10 w-full max-w-2xl bg-[#FFFBEB] border-3 border-[#FDE047] rounded-3xl p-4 shadow-sm flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-[#FEF08A] border-2 border-[#EAB308] flex items-center justify-center shadow-xs">
                <SparkSprite emotion="happy" size={48} />
              </div>
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-black uppercase text-[#B45309] tracking-wider mb-0.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 fill-current" /> Совет от Спарк:
              </div>
              <p className="text-xs md:text-sm font-bold text-slate-800 leading-snug">
                {currentStepData.sparkTip}
              </p>
            </div>
          </div>

          {/* Center Giant Sign Display */}
          <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center py-4">
            <div className="w-full flex items-center justify-center p-6 md:p-10 rounded-[32px] bg-[#F8FAFC] border-2 border-dashed border-slate-300">
              <div className="transform transition-transform duration-200 hover:scale-105 filter drop-shadow-xl">
                <SignRender design={design} scale={1.75} showHandles={true} />
              </div>
            </div>

            {/* Bottom Status Tags: Dimensions & Contrast Indicator */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <div className="px-4 py-1.5 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-extrabold text-xs shadow-xs">
                Размер: <span className="text-indigo-600 font-black">{design.signWidth} × {design.signHeight} px</span>
              </div>

              <div
                className={`px-4 py-1.5 rounded-2xl font-black text-xs flex items-center gap-1.5 border-2 shadow-xs ${
                  isGoodContrast
                    ? 'bg-[#DCFCE7] border-[#86EFAC] text-[#15803D]'
                    : isFairContrast
                    ? 'bg-[#FEF9C3] border-[#FDE047] text-[#A16207]'
                    : 'bg-[#FFE4E6] border-[#FDA4AF] text-[#BE123C] animate-bounce'
                }`}
              >
                {isGoodContrast ? '🟢 Отличный контраст: легко читать!' : isFairContrast ? '🟡 Средний контраст' : '🔴 Низкий контраст: буквы сливаются!'}
              </div>
            </div>
          </div>

          {/* Canvas Bottom Navigation between Steps */}
          <div className="relative z-10 w-full flex items-center justify-between pt-2">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={() => handleStepChange((currentStep - 1) as StepKey)}
              className={`px-4 py-2 rounded-2xl border-2 font-black text-xs flex items-center gap-1.5 cursor-pointer ${
                currentStep > 1
                  ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <ArrowLeft className="w-4 h-4" /> Назад
            </button>

            <span className="text-slate-400 text-xs font-bold">
              Шаг {currentStep} из 7
            </span>

            {currentStep < 7 ? (
              <button
                type="button"
                onClick={() => handleStepChange((currentStep + 1) as StepKey)}
                className="px-5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Далее</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTestStart();
                  onTestDesign(design);
                }}
                className="px-5 py-2 rounded-2xl bg-[#58CC02] hover:bg-[#46A302] text-white font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>На улицу!</span>
                <Rocket className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ================= RIGHT COLUMN: STEP SPECIFIC CONTROLS ================= */}
        <div className="w-full md:w-80 bg-white border-4 border-slate-200 rounded-[36px] shadow-sm flex flex-col justify-between p-6 overflow-hidden shrink-0">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b-2 border-slate-100 mb-4">
              <div className="p-2 rounded-2xl bg-slate-100">
                {currentStepData.icon}
              </div>
              <h3 className="text-sm font-black text-slate-900">
                {currentStepData.title}
              </h3>
            </div>

            {/* Step Controls */}
            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
              {/* STEP 1: SHAPE */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wide block">
                    Выбери форму:
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {shapeCards.map((s) => (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => updateDesign({ shape: s.id })}
                        className={`p-3 rounded-2xl border-2 text-xs font-black flex items-center gap-3 transition-all cursor-pointer ${
                          design.shape === s.id
                            ? `${s.bg} ${s.border} border-b-4 ring-2 ring-indigo-200 scale-102`
                            : 'bg-white border-slate-200 border-b-4 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-xl font-bold">{s.icon}</span>
                        <span>{s.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between text-xs font-black text-slate-700 mb-1">
                      <span>Ширина: {design.signWidth} px</span>
                    </div>
                    <input
                      type="range"
                      min="180"
                      max="420"
                      value={design.signWidth}
                      onChange={(e) => updateDesign({ signWidth: Number(e.target.value) })}
                      className="w-full accent-indigo-600 h-2.5 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: NAME / TEXT */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wide block">
                    Текст на вывеске:
                  </label>
                  <div className="relative flex items-center">
                    <Edit3 className="w-4 h-4 text-indigo-500 absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      value={design.text}
                      onChange={(e) => updateDesign({ text: e.target.value })}
                      placeholder="Название пекарни..."
                      className="w-full pl-10 pr-3 py-3 rounded-2xl bg-slate-50 border-2 border-slate-200 text-slate-800 text-sm font-black focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                      maxLength={28}
                    />
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-black text-slate-400">Быстрые варианты:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {presetTexts.map((txt) => (
                        <button
                          type="button"
                          key={txt}
                          onClick={() => updateDesign({ text: txt })}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 border-2 border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 text-xs font-bold transition-all cursor-pointer"
                        >
                          + {txt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: FONT */}
              {currentStep === 3 && (
                <div className="space-y-3 animate-fadeIn">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wide block">
                    Стиль шрифта:
                  </label>
                  <div className="space-y-2">
                    {fontCards.map((f) => (
                      <button
                        type="button"
                        key={f.id}
                        onClick={() => updateDesign({ fontStyle: f.id })}
                        className={`w-full p-3 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                          design.fontStyle === f.id
                            ? 'bg-indigo-50 border-indigo-500 border-b-4 shadow-xs'
                            : 'bg-white border-slate-200 hover:bg-slate-50 border-b-4'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-black text-xs text-slate-800">{f.label}</span>
                          {design.fontStyle === f.id && <Check className="w-4 h-4 text-indigo-600" />}
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">{f.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: BACKGROUND COLOR */}
              {currentStep === 4 && (
                <div className="space-y-3 animate-fadeIn">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wide block">
                    Цвет фона вывески:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {bgColorPalette.map((c) => (
                      <button
                        type="button"
                        key={c.hex}
                        onClick={() => updateDesign({ bgColor: c.hex })}
                        className={`p-2 rounded-2xl border-2 border-b-4 font-black text-xs flex items-center gap-2 cursor-pointer transition-all ${
                          design.bgColor === c.hex
                            ? 'bg-indigo-50 border-indigo-400 text-indigo-950 shadow-xs'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-lg border border-slate-300 shrink-0 flex items-center justify-center shadow-xs"
                          style={{ backgroundColor: c.hex }}
                        >
                          {design.bgColor === c.hex && (
                            <Check className={`w-3 h-3 font-bold ${c.hex === '#FFFFFF' || c.hex === '#FFF7ED' ? 'text-slate-900' : 'text-white'}`} />
                          )}
                        </span>
                        <span className="truncate">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: TEXT COLOR */}
              {currentStep === 5 && (
                <div className="space-y-3 animate-fadeIn">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wide block">
                    Цвет букв:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {textColorPalette.map((c) => (
                      <button
                        type="button"
                        key={c.hex}
                        onClick={() => updateDesign({ textColor: c.hex })}
                        className={`p-2 rounded-2xl border-2 border-b-4 font-black text-xs flex items-center gap-2 cursor-pointer transition-all ${
                          design.textColor === c.hex
                            ? 'bg-rose-50 border-rose-400 text-rose-950 shadow-xs'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-lg border border-slate-300 shrink-0 flex items-center justify-center shadow-xs"
                          style={{ backgroundColor: c.hex }}
                        >
                          {design.textColor === c.hex && (
                            <Check className={`w-3 h-3 font-bold ${c.hex === '#FFFFFF' ? 'text-slate-900' : 'text-white'}`} />
                          )}
                        </span>
                        <span className="truncate">{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 6: ICON */}
              {currentStep === 6 && (
                <div className="space-y-3 animate-fadeIn">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wide block">
                    Символ на вывеске:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {iconOptions.map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => updateDesign({ icon: item.id })}
                        className={`p-2.5 rounded-2xl border-2 border-b-4 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                          design.icon === item.id
                            ? `${item.bg} border-b-4 ring-2 ring-indigo-300 scale-102`
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="text-2xl">{item.emoji}</span>
                        <span className="text-xs font-extrabold">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 7: CONTRAST CHECK */}
              {currentStep === 7 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className={`p-4 rounded-2xl border-2 ${
                    isGoodContrast ? 'bg-emerald-50 border-emerald-300' : isFairContrast ? 'bg-amber-50 border-amber-300' : 'bg-rose-50 border-rose-300'
                  }`}>
                    <h5 className="font-black text-xs uppercase mb-1">
                      {isGoodContrast ? '✅ Высокий контраст' : isFairContrast ? '⚠️ Средний контраст' : '❌ Буквы сливаются!'}
                    </h5>
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                      {isGoodContrast
                        ? 'Отличная читаемость! Прохожие с расстояния 10 метров четко увидят надпись за долю секунды.'
                        : 'Рекомендуем сделать буквы темнее, а фон светлее (или наоборот), чтобы прохожим было легче прочитать.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playTestStart();
                      onTestDesign(design);
                    }}
                    className="w-full py-4 rounded-2xl bg-[#58CC02] border-b-4 border-[#46A302] hover:bg-[#46A302] text-white font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
                  >
                    <Rocket className="w-5 h-5 fill-current" /> Проверить на улице ➔
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

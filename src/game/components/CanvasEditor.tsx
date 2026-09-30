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
  Edit3,
  Rocket,
  Undo2,
  Redo2,
  Smile,
  Type,
  Palette,
  Square,
} from 'lucide-react';

interface CanvasEditorProps {
  initialDesign: SignDesign;
  onTestDesign: (design: SignDesign) => void;
  versionNumber: number;
}

type StepKey = 1 | 2 | 3 | 4 | 5;

export const CanvasEditor: React.FC<CanvasEditorProps> = ({
  initialDesign,
  onTestDesign,
  versionNumber,
}) => {
  const [design, setDesign] = useState<SignDesign>({ ...initialDesign });
  const [history, setHistory] = useState<SignDesign[]>([{ ...initialDesign }]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [currentStep, setCurrentStep] = useState<StepKey>(1);

  const updateDesign = (next: Partial<SignDesign>) => {
    soundEngine.playPop();
    const updated = { ...design, ...next };
    setDesign(updated);

    const newHistory = history.slice(0, historyIdx + 1);
    newHistory.push(updated);
    setHistory(newHistory);
    setHistoryIdx(newHistory.length - 1);
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

  const stepInfo = {
    1: {
      title: 'Шаг 1: Форма и Размер',
      icon: <Square className="w-5 h-5 text-sky-500" />,
      color: 'text-sky-600',
      sparkTip: 'Для начала выберем форму! Овальная, скруглённая или классическая? Подбери размер, чтобы было видно с десяти метров!',
    },
    2: {
      title: 'Шаг 2: Цвета и Контраст',
      icon: <Palette className="w-5 h-5 text-amber-500" />,
      color: 'text-amber-600',
      sparkTip: 'Главный секрет читаемости — контраст! Тёмные буквы на светлом или светлые на тёмном читаются сразу.',
    },
    3: {
      title: 'Шаг 3: Название, Шрифт и Цвет Букв',
      icon: <Type className="w-5 h-5 text-rose-500" />,
      color: 'text-rose-600',
      sparkTip: 'Что напишем? Выбирай аппетитный и понятный шрифт, который легко прочесть на ходу!',
    },
    4: {
      title: 'Шаг 4: Символ и Иконка',
      icon: <Smile className="w-5 h-5 text-purple-500" />,
      color: 'text-purple-600',
      sparkTip: 'Иконка — главная подсказка! Прохожий за полсекунды поймёт, что здесь сладости!',
    },
    5: {
      title: 'Шаг 5: Проверка и Запуск',
      icon: <Rocket className="w-5 h-5 text-emerald-500" />,
      color: 'text-emerald-600',
      sparkTip: 'Отлично! Вывеска готова. Повесим её на фасад и проверим реакцию горожан!',
    },
  };

  const shapeCards: Array<{ id: ShapeType; label: string; icon: string; bg: string; border: string }> = [
    { id: 'rounded', label: 'Скругленная', icon: '▢', bg: 'bg-sky-50 text-sky-700', border: 'border-sky-400' },
    { id: 'oval', label: 'Овальная', icon: '⬭', bg: 'bg-purple-50 text-purple-700', border: 'border-purple-400' },
    { id: 'rectangle', label: 'Классика', icon: '▬', bg: 'bg-emerald-50 text-emerald-700', border: 'border-emerald-400' },
    { id: 'badge', label: 'Ретро-герб', icon: '✦', bg: 'bg-amber-50 text-amber-700', border: 'border-amber-400' },
    { id: 'banner', label: 'Баннер', icon: '▭', bg: 'bg-rose-50 text-rose-700', border: 'border-rose-400' },
  ];

  const colorPalette = [
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

  const presetTexts = ['Кондитерская Мари', 'Свежие Эклеры', 'Сладости у Мари'];

  return (
    <div className="relative w-full h-screen bg-[#F7F9FC] text-slate-800 overflow-hidden select-none flex flex-col justify-between font-sans">
      
      {/* TOP HEADER: Duolingo Style Light Bar */}
      <header className="bg-white border-b-2 border-slate-200 px-6 py-3 flex items-center justify-between z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-[#FFC800] border-b-4 border-[#E5A500] text-slate-950 font-black text-xs md:text-sm flex items-center gap-2 shadow-xs">
            <Sparkles className="w-4 h-4 fill-current" />
            <span>ВЕРСИЯ ВЫВЕСКИ #{versionNumber}</span>
          </div>
        </div>

        {/* Undo / Redo Duolingo Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={historyIdx <= 0}
            className={`px-3.5 py-2 rounded-2xl border-2 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              historyIdx > 0
                ? 'bg-white border-slate-300 border-b-4 text-slate-700 hover:bg-slate-50 active:border-b-2 active:translate-y-0.5'
                : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Undo2 className="w-4 h-4" /> <span className="hidden sm:inline">Отменить</span>
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={historyIdx >= history.length - 1}
            className={`px-3.5 py-2 rounded-2xl border-2 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              historyIdx < history.length - 1
                ? 'bg-white border-slate-300 border-b-4 text-slate-700 hover:bg-slate-50 active:border-b-2 active:translate-y-0.5'
                : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Redo2 className="w-4 h-4" /> <span className="hidden sm:inline">Повторить</span>
          </button>
        </div>

        {/* Primary Duolingo Green Button to Launch Test */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playTestStart();
            onTestDesign(design);
          }}
          className="px-6 py-2.5 rounded-2xl bg-[#58CC02] border-b-4 border-[#46A302] hover:bg-[#46A302] active:border-b-0 active:translate-y-1 text-white font-black text-xs md:text-sm uppercase tracking-wider shadow-sm flex items-center gap-2 transition-all cursor-pointer"
        >
          <Rocket className="w-4 h-4 fill-current" /> Протестировать ➔
        </button>
      </header>

      {/* MAIN WORKSPACE: LEFT BIG CANVAS (60%) + RIGHT TOOLS PANEL (40%) */}
      <main className="flex-1 flex flex-col md:flex-row w-full h-[calc(100vh-65px)] p-4 md:p-6 gap-6 overflow-hidden">
        
        {/* ================= LEFT SIDE: GIANT INTERACTIVE DESIGN CANVAS ================= */}
        <div className="flex-[3] bg-white border-4 border-slate-200 rounded-[36px] shadow-sm flex flex-col items-center justify-between p-6 relative overflow-hidden">
          
          {/* Top Spark Advice Speech Bubble (Duolingo Owl Style) */}
          <div className="relative z-10 w-full max-w-2xl bg-[#FFFBEB] border-3 border-[#FDE047] rounded-3xl p-4 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF08A] border-2 border-[#EAB308] flex items-center justify-center shrink-0 shadow-xs">
              <SparkSprite emotion="happy" size={48} />
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-black uppercase text-[#B45309] tracking-wider mb-0.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 fill-current" /> Совет от Спарк:
              </div>
              <p className="text-xs md:text-sm font-bold text-slate-800 leading-snug">
                {stepInfo[currentStep].sparkTip}
              </p>
            </div>
          </div>

          {/* Center Giant Sign Display (Spacious, Crisp & Unclipped) */}
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

          {/* Canvas Bottom Helper */}
          <div className="relative z-10 text-slate-400 text-xs font-bold text-center">
            ✨ Изменяй параметры справа — вывеска на холсте сразу преображается!
          </div>
        </div>

        {/* ================= RIGHT SIDE: DUOLINGO-STYLE SEQUENTIAL TOOLS ================= */}
        <div className="flex-[2] max-w-lg bg-white border-4 border-slate-200 rounded-[36px] shadow-sm flex flex-col justify-between p-6 overflow-hidden">
          
          {/* Step Header & Step Number Buttons */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-2xl bg-slate-100">
                  {stepInfo[currentStep].icon}
                </div>
                <h3 className={`text-sm md:text-base font-black ${stepInfo[currentStep].color}`}>
                  {stepInfo[currentStep].title}
                </h3>
              </div>

              {/* Step Numbers 1 to 5 */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
                {([1, 2, 3, 4, 5] as StepKey[]).map((stepNum) => (
                  <button
                    type="button"
                    key={stepNum}
                    onClick={() => {
                      soundEngine.playClick();
                      setCurrentStep(stepNum);
                    }}
                    className={`w-8 h-8 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center ${
                      currentStep === stepNum
                        ? 'bg-[#1CB0F6] border-b-3 border-[#1899D6] text-white shadow-xs scale-105'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    {stepNum}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Step Content */}
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
              
              {/* STEP 1: SHAPE & SIZE */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-fadeIn">
                  <div>
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wide block mb-2">
                      Выбери форму вывески:
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {shapeCards.map((s) => (
                        <button
                          type="button"
                          key={s.id}
                          onClick={() => updateDesign({ shape: s.id })}
                          className={`p-3 rounded-2xl border-2 text-xs font-black flex items-center gap-2.5 transition-all cursor-pointer ${
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
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-black text-slate-700 mb-1">
                      <span>Ширина вывески:</span>
                      <span className="text-sky-600 font-extrabold">{design.signWidth} px</span>
                    </div>
                    <input
                      type="range"
                      min="180"
                      max="420"
                      value={design.signWidth}
                      onChange={(e) => updateDesign({ signWidth: Number(e.target.value) })}
                      className="w-full accent-sky-500 h-3 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 font-bold mt-1">
                      <span>Компактная</span>
                      <span>Оптимальная</span>
                      <span>Широкая</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-black text-slate-700 mb-1">
                      <span>Высота вывески:</span>
                      <span className="text-sky-600 font-extrabold">{design.signHeight} px</span>
                    </div>
                    <input
                      type="range"
                      min="70"
                      max="180"
                      value={design.signHeight}
                      onChange={(e) => updateDesign({ signHeight: Number(e.target.value) })}
                      className="w-full accent-sky-500 h-3 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: COLORS & CONTRAST */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-fadeIn">
                  <div>
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wide block mb-2">
                      Цвет фона вывески:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {colorPalette.map((c) => (
                        <button
                          type="button"
                          key={c.hex}
                          onClick={() => updateDesign({ bgColor: c.hex })}
                          className={`p-2.5 rounded-2xl border-2 border-b-4 font-black text-xs flex items-center gap-2 cursor-pointer transition-all ${
                            design.bgColor === c.hex
                              ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-xs'
                              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span
                            className="w-6 h-6 rounded-xl border border-slate-300 shrink-0 flex items-center justify-center shadow-xs"
                            style={{ backgroundColor: c.hex }}
                          >
                            {design.bgColor === c.hex && (
                              <Check className={`w-3.5 h-3.5 font-bold ${c.hex === '#FFFFFF' || c.hex === '#FFF7ED' ? 'text-slate-900' : 'text-white'}`} />
                            )}
                          </span>
                          <span>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wide block mb-2">
                      Цвет букв:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {textColorPalette.map((c) => (
                        <button
                          type="button"
                          key={c.hex}
                          onClick={() => updateDesign({ textColor: c.hex })}
                          className={`p-2.5 rounded-2xl border-2 border-b-4 font-black text-xs flex items-center gap-2 cursor-pointer transition-all ${
                            design.textColor === c.hex
                              ? 'bg-rose-50 border-rose-400 text-rose-950 shadow-xs'
                              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span
                            className="w-6 h-6 rounded-xl border border-slate-300 shrink-0 flex items-center justify-center shadow-xs"
                            style={{ backgroundColor: c.hex }}
                          >
                            {design.textColor === c.hex && (
                              <Check className={`w-3.5 h-3.5 font-bold ${c.hex === '#FFFFFF' ? 'text-slate-900' : 'text-white'}`} />
                            )}
                          </span>
                          <span>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: TEXT, FONT & TEXT COLOR */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wide block mb-1">
                      Текст на вывеске:
                    </label>
                    <div className="relative flex items-center">
                      <Edit3 className="w-4 h-4 text-rose-500 absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        value={design.text}
                        onChange={(e) => updateDesign({ text: e.target.value })}
                        placeholder="Название пекарни..."
                        className="w-full pl-10 pr-3 py-3 rounded-2xl bg-slate-50 border-2 border-slate-200 text-slate-800 text-sm font-black focus:outline-none focus:border-rose-500 focus:bg-white transition-all shadow-inner"
                        maxLength={28}
                      />
                    </div>

                    {/* Presets Badges */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {presetTexts.map((txt) => (
                        <button
                          type="button"
                          key={txt}
                          onClick={() => updateDesign({ text: txt })}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 border-2 border-slate-200 border-b-3 hover:bg-rose-50 hover:border-rose-300 text-slate-700 hover:text-rose-700 text-xs font-extrabold transition-all cursor-pointer"
                        >
                          + {txt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Letter Color Choice directly on Step 3 */}
                  <div>
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wide block mb-2">
                      Цвет букв:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {textColorPalette.map((c) => (
                        <button
                          type="button"
                          key={c.hex}
                          onClick={() => updateDesign({ textColor: c.hex })}
                          className={`p-2.5 rounded-2xl border-2 border-b-4 font-black text-xs flex items-center gap-2 cursor-pointer transition-all ${
                            design.textColor === c.hex
                              ? 'bg-rose-50 border-rose-400 text-rose-950 shadow-xs'
                              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span
                            className="w-6 h-6 rounded-xl border border-slate-300 shrink-0 flex items-center justify-center shadow-xs"
                            style={{ backgroundColor: c.hex }}
                          >
                            {design.textColor === c.hex && (
                              <Check className={`w-3.5 h-3.5 font-bold ${c.hex === '#FFFFFF' ? 'text-slate-900' : 'text-white'}`} />
                            )}
                          </span>
                          <span>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wide block mb-1.5">
                      Стиль шрифта:
                    </label>
                    <div className="space-y-2">
                      {fontCards.map((f) => (
                        <button
                          type="button"
                          key={f.id}
                          onClick={() => updateDesign({ fontStyle: f.id })}
                          className={`w-full p-3 rounded-2xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${
                            design.fontStyle === f.id
                              ? 'bg-rose-50 border-rose-400 border-b-4 text-rose-950'
                              : 'bg-white border-slate-200 border-b-4 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <div className="text-xs font-black">{f.label}</div>
                            <div className="text-[11px] text-slate-500 font-semibold">{f.desc}</div>
                          </div>
                          {design.fontStyle === f.id && <Check className="w-5 h-5 text-rose-600 font-bold" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: ICON */}
              {currentStep === 4 && (
                <div className="space-y-3 animate-fadeIn">
                  <label className="text-xs font-black text-slate-700 uppercase tracking-wide block mb-1">
                    Выбери иконку-символ:
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {iconOptions.map((ic) => (
                      <button
                        type="button"
                        key={ic.id}
                        onClick={() => updateDesign({ icon: ic.id })}
                        className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                          design.icon === ic.id
                            ? `${ic.bg} border-b-4 ring-2 ring-purple-300 scale-102`
                            : 'bg-white border-slate-200 border-b-4 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-3xl">{ic.emoji}</span>
                        <span className="text-xs font-black">{ic.label}</span>
                        <span className="text-[10px] text-slate-500 font-semibold text-center">{ic.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5: READY TO TEST */}
              {currentStep === 5 && (
                <div className="space-y-4 animate-fadeIn text-slate-800">
                  <div className="bg-[#ECFDF5] border-2 border-[#A7F3D0] rounded-2xl p-4 space-y-2">
                    <h4 className="text-xs font-black text-[#065F46] uppercase flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600 fill-current" /> Проверка готовности вывески
                    </h4>
                    <ul className="text-xs space-y-2 font-black text-slate-700">
                      <li className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center text-xs">✓</span>
                        Форма: {design.shape} ({design.signWidth} × {design.signHeight} px)
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center text-xs">✓</span>
                        Контраст: {isGoodContrast ? 'Отличный (высокая читаемость)' : 'Выбран'}
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center text-xs">✓</span>
                        Текст: «{design.text}»
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center text-xs">✓</span>
                        Иконка: {design.icon}
                      </li>
                    </ul>
                  </div>

                  <p className="text-xs font-bold text-slate-500 text-center leading-relaxed">
                    Нажми зеленую кнопку ниже, чтобы повесить вывеску над пекарней и увидеть реакции прохожих!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Action Controls (Duolingo 3D Tactile Buttons) */}
          <div className="pt-4 border-t-2 border-slate-100 flex items-center justify-between gap-3 mt-3">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setCurrentStep((prev) => (prev - 1) as StepKey);
                }}
                className="px-5 py-3 rounded-2xl bg-white border-2 border-slate-300 border-b-4 hover:bg-slate-50 active:border-b-2 active:translate-y-0.5 text-slate-700 font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" /> Назад
              </button>
            ) : <div />}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playSuccess();
                  setCurrentStep((prev) => (prev + 1) as StepKey);
                }}
                className="ml-auto px-7 py-3 rounded-2xl bg-[#1CB0F6] border-b-4 border-[#1899D6] hover:bg-[#1899D6] active:border-b-0 active:translate-y-1 text-white font-black text-sm uppercase tracking-wider shadow-sm flex items-center gap-2 transition-all cursor-pointer transform"
              >
                <span>Дальше</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playTestStart();
                  onTestDesign(design);
                }}
                className="w-full py-4 rounded-2xl bg-[#58CC02] border-b-4 border-[#46A302] hover:bg-[#46A302] active:border-b-0 active:translate-y-1 text-white font-black text-sm md:text-base uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer transform animate-pulse"
              >
                <Rocket className="w-5 h-5 fill-current" /> Протестировать на улице!
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

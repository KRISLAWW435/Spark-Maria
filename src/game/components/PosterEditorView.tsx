import React, { useState } from 'react';
import { PosterDesign } from '../types';
import { ALL_STICKERS } from '../constants/stickers';
import { PosterRender } from './PosterRender';
import { SparkSprite } from './SparkSprite';
import { soundEngine } from '../engine/SoundEngine';
import { CompositionAssistant } from '../engine/CompositionAssistant';
import {
  Rocket,
  Grid,
  Sparkles,
  Layout,
  Type,
  Palette,
  Image as ImageIcon,
  MousePointerClick,
  CheckCircle2,
  Check,
  Undo2,
  Redo2,
  X,
} from 'lucide-react';

interface PosterEditorViewProps {
  initialDesign: PosterDesign;
  onTestDesign: (design: PosterDesign) => void;
  isWindowMode?: boolean;
  onClose?: () => void;
}

export const POSTER_PASTEL_COLORS = [
  { name: 'Нежно-розовый', hex: '#FFF1F2', border: '#FECDD3' },
  { name: 'Солнечный персик', hex: '#FFF7ED', border: '#FED7AA' },
  { name: 'Мятная свежесть', hex: '#F0FDF4', border: '#BBF7D0' },
  { name: 'Лавандовый сон', hex: '#FAF5FF', border: '#E9D5FF' },
];

export const POSTER_TEMPLATES: Array<{
  id: 'top' | 'center' | 'diagonal';
  title: string;
  desc: string;
  icon: string;
}> = [
  {
    id: 'top',
    title: 'Картинка сверху',
    desc: 'Большой аппетитный десерт сверху + текст внизу',
    icon: '🖼️',
  },
  {
    id: 'center',
    title: 'Картинка по центру',
    desc: 'Заголовок сверху + картинка в центре + кнопка снизу',
    icon: '🎯',
  },
  {
    id: 'diagonal',
    title: 'Диагональный макет',
    desc: 'Динамичный современный стиль с наклоном',
    icon: '📐',
  },
];

export const POSTER_CTA_OPTIONS = [
  'Заходи!',
  'Попробуй!',
  'Купи 2 = 3!',
  'Спеши попробовать!',
  'Скидка 20%!',
];

export const PosterEditorView: React.FC<PosterEditorViewProps> = ({
  initialDesign,
  onTestDesign,
  isWindowMode = true,
  onClose,
}) => {
  const [design, setDesign] = useState<PosterDesign>({
    template: initialDesign.template || 'top',
    title: initialDesign.title || 'СВЕЖИЕ ЭКЛЕРЫ!',
    subtitle: initialDesign.subtitle || 'Каждое утро с 8:00',
    image: initialDesign.image || 'icon12',
    cta: initialDesign.cta || 'Заходи!',
    background: initialDesign.background || '#FFF1F2',
  });

  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [showGrid, setShowGrid] = useState(false);
  const [history, setHistory] = useState<PosterDesign[]>([design]);
  const [historyIdx, setHistoryIdx] = useState(0);

  const update = (patch: Partial<PosterDesign>) => {
    soundEngine.playPop();
    const next = { ...design, ...patch };
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

  const feedback = CompositionAssistant.evaluatePoster(design);

  const steps = [
    { id: 1, title: '1. Шаблон (3 макета)', icon: <Layout className="w-4 h-4" /> },
    { id: 2, title: '2. Заголовок (текст)', icon: <Type className="w-4 h-4" /> },
    { id: 3, title: '3. Подзаголовок', icon: <Type className="w-4 h-4" /> },
    { id: 4, title: '4. Картинка (24 ассета)', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 5, title: '5. Кнопка CTA', icon: <MousePointerClick className="w-4 h-4" /> },
    { id: 6, title: '6. Пастельный фон', icon: <Palette className="w-4 h-4" /> },
  ];

  return (
    <div className={`${onClose ? 'fixed inset-0 z-50 w-screen h-screen' : `w-full ${isWindowMode ? 'h-full' : 'h-screen'}`} bg-[#F7F9FC] text-slate-800 flex flex-col justify-between overflow-hidden select-none font-sans`}>
      {/* Top Bar */}
      <div className="bg-white border-b-2 border-slate-200 px-4 py-2 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-xl bg-purple-500 text-white font-black text-xs flex items-center gap-1.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ЗАКАЗ №2 • АФИША С ЭКЛЕРАМИ</span>
          </div>
          <span className="text-xs font-bold text-slate-500 hidden sm:inline">
            Формат 2:3
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
            onClick={handleUndo}
            disabled={historyIdx <= 0}
            className="p-1.5 rounded-xl border text-xs cursor-pointer bg-white border-slate-200 disabled:opacity-40"
            title="Отменить"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={historyIdx >= history.length - 1}
            className="p-1.5 rounded-xl border text-xs cursor-pointer bg-white border-slate-200 disabled:opacity-40"
            title="Повторить"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>

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

      {/* Main Content (3 Columns) */}
      <div className="flex-1 flex flex-col md:flex-row p-3 gap-3 overflow-hidden">
        {/* LEFT COLUMN: Steps */}
        <div className="w-full md:w-56 bg-white border border-slate-200 rounded-2xl p-3 flex flex-col justify-between shrink-0 shadow-xs">
          <div>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block mb-2 px-1">
              Шаги афиши
            </span>
            <div className="space-y-1.5">
              {steps.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveStep(st.id as any);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    activeStep === st.id
                      ? 'bg-purple-500 text-white font-black shadow-sm'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {st.icon}
                    <span>{st.title}</span>
                  </div>
                  {activeStep > st.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Spark helper feedback */}
          <div className="mt-3 p-3 rounded-xl bg-purple-50 border border-purple-200 flex items-start gap-2">
            <SparkSprite emotion="happy" size={40} className="shrink-0" />
            <div className="text-[11px] leading-snug">
              <span className="font-black text-purple-900 block mb-0.5">Помощник Спарк:</span>
              <p className="text-purple-800">{feedback.sparkMessage}</p>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Live Poster Preview */}
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between items-center relative overflow-hidden shadow-xs">
          {showGrid && (
            <div
              className="absolute inset-0 pointer-events-none opacity-25"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #a855f7 1px, transparent 1px), linear-gradient(to bottom, #a855f7 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
          )}

          <div className="w-full flex items-center justify-between text-xs text-slate-500 z-10 mb-2">
            <span className="font-bold flex items-center gap-1 text-purple-700">
              📐 Вертикальный формат 2:3
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Все элементы привязаны к сетке
            </span>
          </div>

          <div className="flex-1 w-full flex items-center justify-center p-2 z-10">
            <div className="p-3 rounded-3xl ring-4 ring-purple-300/40 shadow-2xl">
              <PosterRender design={design} scale={1.25} />
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-medium z-10">
            Прохожие прочитают афишу на улице всего за пару секунд!
          </div>
        </div>

        {/* RIGHT COLUMN: Tool panels */}
        <div className="w-full md:w-72 bg-white border border-slate-200 rounded-2xl p-3 flex flex-col justify-between shrink-0 shadow-xs overflow-y-auto">
          <div>
            {/* Step 1: Template choice (3 options) */}
            {activeStep === 1 && (
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                  Шаблон композиции (3 варианта)
                </h4>
                <div className="space-y-2">
                  {POSTER_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => update({ template: tmpl.id })}
                      className={`w-full text-left p-3 rounded-xl border-2 transition-all cursor-pointer ${
                        design.template === tmpl.id
                          ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-300 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{tmpl.icon}</span>
                        <span className="text-xs font-black text-slate-900">{tmpl.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-snug">{tmpl.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Main Title */}
            {activeStep === 2 && (
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                  Главный заголовок
                </h4>
                <input
                  type="text"
                  value={design.title}
                  onChange={(e) => update({ title: e.target.value })}
                  maxLength={30}
                  placeholder="Заголовок афиши..."
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 focus:border-purple-500 font-black text-sm text-slate-900 outline-none"
                />

                <span className="text-[11px] font-bold text-slate-400 block mb-1">
                  Быстрые идеи:
                </span>
                <div className="space-y-1">
                  {['СВЕЖИЕ ЭКЛЕРЫ!', 'ХРУСТЯЩИЕ КРУАССАНЫ', 'СЛАДОСТИ У МАРИ', 'ГОРЯЧАЯ ВЫПЕЧКА!'].map(
                    (txt) => (
                      <button
                        key={txt}
                        type="button"
                        onClick={() => update({ title: txt })}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-purple-50 text-xs font-bold text-slate-700 cursor-pointer"
                      >
                        {txt}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Subtitle */}
            {activeStep === 3 && (
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                  Подзаголовок афиши
                </h4>
                <input
                  type="text"
                  value={design.subtitle}
                  onChange={(e) => update({ subtitle: e.target.value })}
                  maxLength={40}
                  placeholder="Каждое утро с 8:00..."
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-slate-300 focus:border-purple-500 font-bold text-xs text-slate-900 outline-none"
                />

                <span className="text-[11px] font-bold text-slate-400 block mb-1">
                  Быстрые варианты:
                </span>
                <div className="space-y-1">
                  {[
                    'Каждое утро с 8:00',
                    'С натуральным сливочным кремом',
                    'Только из печи!',
                    'Уют и радость в каждом кусочке',
                  ].map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => update({ subtitle: sub })}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-purple-50 text-xs font-bold text-slate-700 cursor-pointer"
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Image (All 24 icons & characters!) */}
            {activeStep === 4 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                    Картинка афиши (24 на выбор)
                  </h4>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                    Иконки + Персонажи
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto p-1">
                  {ALL_STICKERS.map((stk) => (
                    <button
                      key={stk.id}
                      type="button"
                      onClick={() => update({ image: stk.id })}
                      className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                        design.image === stk.id
                          ? 'border-purple-500 bg-purple-100 ring-2 ring-purple-300 scale-105'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                      title={stk.name}
                    >
                      <img
                        src={stk.filename}
                        alt={stk.name}
                        className="w-9 h-9 object-contain drop-shadow-xs"
                      />
                      <span className="text-[9px] font-bold text-slate-600 truncate mt-1 max-w-[50px]">
                        {stk.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: CTA Button */}
            {activeStep === 5 && (
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                  Призыв к действию (Кнопка CTA)
                </h4>
                <div className="space-y-2">
                  {POSTER_CTA_OPTIONS.map((ctaOption) => (
                    <button
                      key={ctaOption}
                      type="button"
                      onClick={() => update({ cta: ctaOption })}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        design.cta === ctaOption
                          ? 'border-purple-500 bg-purple-50 font-black ring-2 ring-purple-300'
                          : 'border-slate-200 hover:bg-slate-50 font-bold'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-900">{ctaOption}</span>
                        {design.cta === ctaOption && (
                          <Check className="w-4 h-4 text-purple-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Pastel Background (4 colors) */}
            {activeStep === 6 && (
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                  Фон (4 пастельных цвета)
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {POSTER_PASTEL_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => update({ background: c.hex })}
                      style={{ backgroundColor: c.hex }}
                      className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                        design.background === c.hex
                          ? 'border-purple-500 ring-2 ring-purple-300 scale-102'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs font-black text-slate-900">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
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
              disabled={activeStep >= 6}
              onClick={() => setActiveStep((prev) => Math.min(6, prev + 1) as any)}
              className="px-4 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-xs font-black disabled:opacity-40 shadow-xs"
            >
              Далее ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

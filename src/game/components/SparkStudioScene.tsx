import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { PlayerProgress, StudioData, AvatarShape, SignDesign } from '../types';
import { soundEngine } from '../engine/SoundEngine';
import { GAME_ASSETS } from '../assets';
import { WindowsLaptopSimulator } from './WindowsLaptopSimulator';
import { StudioWall } from './StudioWall';
import { AvatarPicker } from './AvatarPicker';
import { SparkSprite } from './SparkSprite';
import {
  Pencil,
  X,
  Sparkles,
  Laptop,
  Type,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

const STUDIO_STORAGE_KEY = 'spark_studio_data';

// Permanent Purple/Blue Color for Studio Name - Studio color never changes this!
const STUDIO_NAME_PERMANENT_COLOR = '#7C3AED';

const VALID_SHAPES: AvatarShape[] = [
  'circle',
  'oval',
  'blob_2',
  'polygon',
  'blob_15',
  'cloud',
  'summertime_sadness',
  'heart_2',
  'blob_11',
];

const DEFAULT_STUDIO: StudioData = {
  isCreated: false,
  name: 'Моя Студия',
  font: 'Nunito',
  avatar: 'avatar1',
  shape: 'blob_2',
  color: '#5834f5',
  decorations: [],
};

// Available Studio Fonts
const STUDIO_FONTS = [
  { id: 'Nunito', name: 'Nunito' },
  { id: 'Comfortaa', name: 'Comfortaa' },
  { id: 'Montserrat', name: 'Montserrat' },
  { id: 'Raleway', name: 'Raleway' },
  { id: 'Poppins', name: 'Poppins' },
];

// Creative Studio Name Suggestions
const STUDIO_NAME_SUGGESTIONS = [
  { name: 'Пиксель Магия', emoji: '✨' },
  { name: 'Искра Дизайн', emoji: '⚡' },
  { name: 'Сладкий Брендинг', emoji: '🧁' },
  { name: 'КотоДизайн', emoji: '🐱' },
  { name: 'Яркая Лаборатория', emoji: '🎨' },
  { name: 'Космос Арт', emoji: '🚀' },
  { name: 'Студия Снов', emoji: '🌙' },
  { name: 'Вкусный Пиксель', emoji: '🥐' },
];

// Tutorial creation dialogue steps
type CreationDialogueStep =
  | 'welcome_1'
  | 'welcome_2'
  | 'welcome_3'
  | 'editing_intro'
  | 'editing_name'
  | 'editing_shape'
  | 'editing_color'
  | 'editing_font'
  | 'editing_ready'
  | 'done_celebrate'
  | 'done_letter_arrived'
  | 'done_look_who'
  | 'idle';

interface SparkStudioSceneProps {
  progress: PlayerProgress;
  onStartMarieLevel: () => void;
  onOpenPortfolio: () => void;
  hasObservedStreet?: boolean;
  currentDesign?: SignDesign;
  onTestDesign?: (design: SignDesign) => void;
  versionNumber?: number;
}

export const SparkStudioScene: React.FC<SparkStudioSceneProps> = ({
  progress,
  onStartMarieLevel,
  onOpenPortfolio,
  hasObservedStreet = false,
  currentDesign,
  onTestDesign,
  versionNumber = 1,
}) => {
  // Load studio data from localStorage
  const [studio, setStudio] = useState<StudioData>(() => {
    try {
      const saved = localStorage.getItem(STUDIO_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const resolvedShape = VALID_SHAPES.includes(parsed.shape) ? parsed.shape : 'blob_2';
        return {
          ...DEFAULT_STUDIO,
          ...parsed,
          isCreated: Boolean(parsed.isCreated ?? parsed.isConfigured),
          shape: resolvedShape,
        };
      }
    } catch {
      // ignore
    }
    return DEFAULT_STUDIO;
  });

  // Edit panel open state
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);

  // Windows laptop simulator open state
  const [isLaptopOpen, setIsLaptopOpen] = useState(false);

  // Tutorial dialogue state machine
  const [dialogueStep, setDialogueStep] = useState<CreationDialogueStep>(() => {
    return studio.isCreated ? 'idle' : 'welcome_1';
  });

  // State flag for animated letter appearance after creation
  const [hasLetterPopped, setHasLetterPopped] = useState(() => studio.isCreated);

  // Form draft state while editing
  const [draftName, setDraftName] = useState(studio.name);
  const [draftFont, setDraftFont] = useState(studio.font);
  const [draftAvatar, setDraftAvatar] = useState(studio.avatar);
  const [draftShape, setDraftShape] = useState<AvatarShape>(studio.shape || 'blob_2');
  const [draftColor, setDraftColor] = useState(studio.color);
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string | null>(null);

  // Sync draft when edit panel opens
  useEffect(() => {
    if (isEditPanelOpen) {
      setDraftName(studio.name);
      setDraftFont(studio.font);
      setDraftAvatar(studio.avatar);
      setDraftShape(VALID_SHAPES.includes(studio.shape) ? studio.shape : 'blob_2');
      setDraftColor(studio.color);
    }
  }, [isEditPanelOpen, studio]);

  // Handle clicking '+' or opening panel from tutorial
  const handleOpenEditPanel = () => {
    soundEngine.playClick();
    setIsEditPanelOpen(true);
    if (!studio.isCreated) {
      setDialogueStep('editing_intro');
    }
  };

  // Save studio action
  const handleSaveStudio = () => {
    soundEngine.playSuccess();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}

    const updated: StudioData = {
      isCreated: true,
      name: draftName.trim() || 'Моя Студия',
      font: draftFont,
      avatar: customAvatarUrl || draftAvatar,
      shape: draftShape,
      color: draftColor,
      decorations: studio.decorations || [],
    };
    setStudio(updated);
    try {
      localStorage.setItem(STUDIO_STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    setIsEditPanelOpen(false);

    // Transition to post-creation Spark dialogue
    setDialogueStep('done_celebrate');
  };

  const isBakeryCompleted = progress.completedModules.includes('bakery_marie');

  // Spark dialogue text and actions based on current step
  const getDialogueContent = () => {
    switch (dialogueStep) {
      case 'welcome_1':
        return {
          text: 'Привет! Добро пожаловать в твою студию! ✨',
          emotion: 'happy' as const,
          showNext: true,
          onNext: () => {
            soundEngine.playPop();
            setDialogueStep('welcome_2');
          },
          nextLabel: 'Далее',
        };
      case 'welcome_2':
        return {
          text: 'Это твоё рабочее место. Здесь ты будешь создавать дизайн для разных клиентов. 🎨',
          emotion: 'happy' as const,
          showNext: true,
          onNext: () => {
            soundEngine.playPop();
            setDialogueStep('welcome_3');
          },
          nextLabel: 'Далее',
        };
      case 'welcome_3':
        return {
          text: 'Но сначала давай сделаем её твоей. Нажми на плюс на стене! ➕',
          emotion: 'thinking' as const,
          showNext: true,
          onNext: () => {
            handleOpenEditPanel();
          },
          nextLabel: 'Открыть панель ➕',
          highlightWall: true,
        };
      case 'editing_intro':
        return {
          text: 'Отлично! Теперь выбери, как будет выглядеть твоя студия.',
          emotion: 'happy' as const,
          showNext: true,
          onNext: () => {
            soundEngine.playPop();
            setDialogueStep('editing_name');
          },
          nextLabel: 'Продолжить',
        };
      case 'editing_name':
        return {
          text: 'Сначала придумай название. Как будет называться твоя студия? ✏️',
          emotion: 'thinking' as const,
          showNext: true,
          onNext: () => {
            soundEngine.playPop();
            setDialogueStep('editing_shape');
          },
          nextLabel: 'Далее (Аватар)',
        };
      case 'editing_shape':
        return {
          text: 'Теперь выбери форму аватара. Тут такое разнообразие! 🌟',
          emotion: 'happy' as const,
          showNext: true,
          onNext: () => {
            soundEngine.playPop();
            setDialogueStep('editing_color');
          },
          nextLabel: 'Далее (Цвет)',
        };
      case 'editing_color':
        return {
          text: 'Класс! Теперь выбери цвет студии — как отражение твоего стиля! 🎨',
          emotion: 'excited' as const,
          showNext: true,
          onNext: () => {
            soundEngine.playPop();
            setDialogueStep('editing_font');
          },
          nextLabel: 'Далее (Шрифт)',
        };
      case 'editing_font':
        return {
          text: 'Ну и последнее, выбери шрифт. Какой тебе ближе? 🔤',
          emotion: 'thinking' as const,
          showNext: true,
          onNext: () => {
            soundEngine.playPop();
            setDialogueStep('editing_ready');
          },
          nextLabel: 'Почти готово',
        };
      case 'editing_ready':
        return {
          text: 'Супер! Нажимай “Готово”. 🎉',
          emotion: 'excited' as const,
          showNext: false,
        };
      case 'done_celebrate':
        return {
          text: 'Ух ты! Теперь это твоя студия. Выглядит здорово! 🥳',
          emotion: 'excited' as const,
          showNext: true,
          onNext: () => {
            soundEngine.playNotification();
            setHasLetterPopped(true);
            setDialogueStep('done_letter_arrived');
          },
          nextLabel: 'Что дальше?',
        };
      case 'done_letter_arrived':
        return {
          text: 'Смотри, на ноутбуке появилось письмо. Кажется, у нас первый клиент! ✉️',
          emotion: 'excited' as const,
          showNext: true,
          onNext: () => {
            soundEngine.playPop();
            setDialogueStep('done_look_who');
          },
          nextLabel: 'Давай!',
        };
      case 'done_look_who':
        return {
          text: 'Смотри, пришло письмо от Марии. Нажми на него, чтобы прочитать. ✉️',
          emotion: 'happy' as const,
          showNext: false,
          highlightLaptop: true,
        };
      case 'idle':
      default:
        if (hasObservedStreet && !isBakeryCompleted) {
          return {
            text: 'Открывай ноутбук. Запускай приложение "Холст Дизайнера"! 🎨',
            emotion: 'excited' as const,
            showNext: false,
            highlightLaptop: true,
          };
        }
        if (studio.isCreated && !isBakeryCompleted) {
          return {
            text: 'Смотри, пришло письмо от Марии. Нажми на него, чтобы прочитать. ✉️',
            emotion: 'happy' as const,
            showNext: false,
            highlightLaptop: true,
          };
        }
        return null;
    }
  };

  const dialogue = getDialogueContent();

  // Live values displayed while editing or saved
  const liveName = isEditPanelOpen
    ? (draftName.trim() || 'Название студии')
    : (studio.isCreated ? studio.name : 'Название студии');

  const liveFont = isEditPanelOpen ? draftFont : studio.font;
  const liveAvatarColor = isEditPanelOpen ? draftColor : studio.color;
  const liveAvatarKey = isEditPanelOpen ? draftAvatar : studio.avatar;
  const activeShapeId: AvatarShape = isEditPanelOpen ? draftShape : (studio.shape || 'blob_2');

  const shouldShowMailBadge = !isBakeryCompleted && (studio.isCreated || hasLetterPopped || dialogueStep === 'done_letter_arrived' || dialogueStep === 'done_look_who');

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden select-none font-sans">
      {/* Studio Background Image */}
      <img
        src={GAME_ASSETS.backgrounds.studioSpark}
        alt="Spark Design Studio"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover object-center"
      />

      {/* WALL BRANDING IN THE CENTER (StudioWall component) */}
      <StudioWall
        isCreated={studio.isCreated}
        isEditing={isEditPanelOpen}
        name={liveName}
        font={liveFont}
        avatar={liveAvatarKey}
        customAvatarUrl={customAvatarUrl}
        shape={activeShapeId}
        color={liveAvatarColor}
        permanentNameColor={STUDIO_NAME_PERMANENT_COLOR}
        onOpenEditPanel={handleOpenEditPanel}
      />

      {/* SPARK TUTORIAL GUIDE FLOATING WITH DELICATE RAINBOW NEON GLOW */}
      <AnimatePresence>
        {dialogue && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 180 }}
            className={`fixed z-30 pointer-events-none flex items-end ${
              isEditPanelOpen
                ? 'bottom-6 right-6 sm:bottom-8 sm:right-10 md:right-14 flex-row gap-4 max-w-md'
                : 'bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-8 md:left-12 flex-col sm:flex-row items-center sm:items-end gap-3 sm:gap-5 max-w-lg'
            }`}
          >
            {/* Spark Animated Floating Character with Soft Rainbow Neon Aura */}
            <motion.div
              animate={{
                y: [0, -14, 0],
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 3.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className={`relative shrink-0 pointer-events-auto cursor-pointer select-none ${
                isEditPanelOpen
                  ? 'h-40 sm:h-52 md:h-60'
                  : 'h-64 sm:h-80 md:h-96 lg:h-[420px]'
              }`}
            >
              {/* Soft Rainbow Neon Ambient Halo Glow (Delicate & Shimmering) */}
              <div className="absolute -inset-4 sm:-inset-8 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(244,114,182,0.4)_0%,_rgba(167,139,250,0.35)_35%,_rgba(56,189,248,0.3)_65%,_transparent_100%)] blur-2xl animate-pulse pointer-events-none" />

              {/* Spark Sprite with Layered Multi-Color Drop Shadow */}
              <div
                style={{
                  filter:
                    'drop-shadow(0 0 10px rgba(244,114,182,0.45)) drop-shadow(0 0 20px rgba(167,139,250,0.4)) drop-shadow(0 0 32px rgba(56,189,248,0.35)) drop-shadow(0 14px 28px rgba(0,0,0,0.5))',
                }}
                className="relative h-full w-auto"
              >
                <SparkSprite emotion={dialogue.emotion} size="100%" className="h-full w-auto" />
              </div>
            </motion.div>

            {/* Spark Speech Dialogue Bubble */}
            <motion.div
              key={dialogueStep}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.25 }}
              className="relative pointer-events-auto max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-5 rounded-3xl bg-white/95 backdrop-blur-md border-2 border-indigo-200/90 shadow-[0_20px_50px_rgba(30,27,75,0.4)] text-slate-800 flex flex-col justify-between"
            >
              {/* Little Speech Triangle Tail */}
              {!isEditPanelOpen && (
                <div className="hidden sm:block absolute -left-3 bottom-12 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white/95" />
              )}

              {/* Spark Header */}
              <div className="flex items-center gap-1.5 mb-1.5 text-[11px] font-black uppercase tracking-wider text-indigo-600">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span>Спарк · Искра творчества</span>
              </div>

              {/* Speech Text */}
              <p className="text-xs sm:text-sm md:text-base font-bold text-slate-900 leading-relaxed drop-shadow-xs">
                {dialogue.text}
              </p>

              {/* Next Button or Interactive Action */}
              {dialogue.showNext && dialogue.onNext && (
                <div className="mt-3 pt-2.5 border-t border-indigo-100 flex justify-end">
                  <button
                    onClick={dialogue.onNext}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black text-xs sm:text-sm shadow-lg flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
                  >
                    <span>{dialogue.nextLabel || 'Далее'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LAPTOP HOTSPOT ON THE WOODEN DESK (Visible ONLY after studio is created: isCreated === true) */}
      <AnimatePresence>
        {studio.isCreated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.75, y: 20 }}
            transition={{ type: 'spring', damping: 18, stiffness: 180 }}
            onClick={() => {
              soundEngine.playClick();
              setIsLaptopOpen(true);
              if (dialogueStep === 'done_letter_arrived' || dialogueStep === 'done_look_who') {
                setDialogueStep('idle');
              }
            }}
            className="absolute bottom-[28%] sm:bottom-[30%] left-[48%] md:left-[50%] z-20 cursor-pointer group flex flex-col items-center justify-center transition-all duration-300"
            title="Открыть рабочий стол ноутбука"
          >
            {/* Floating Callout Button with Shimmering Rainbow Neon Border */}
            <div className="relative transform group-hover:scale-110 active:scale-95 transition-all duration-300">
              {/* Animated 3D Floating Mail Badge hovering OVER the button (if not returned from street) */}
              {shouldShowMailBadge && !hasObservedStreet && (
                <motion.div
                  initial={{ scale: 0, y: -20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: 'spring', damping: 14, stiffness: 200 }}
                  className="absolute -top-8 -right-3 sm:-right-5 z-30 animate-bounce flex items-center justify-center pointer-events-none"
                  title="Новое входящее письмо от Мари!"
                >
                  {/* 3D Envelope Badge */}
                  <div className="relative w-12 h-10 sm:w-14 sm:h-11 rounded-xl bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 shadow-[0_10px_25px_rgba(245,158,11,0.65),0_3px_8px_rgba(0,0,0,0.5)] border-2 border-white/90 flex items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform">
                    <div className="absolute inset-x-1 top-1 h-3.5 bg-gradient-to-b from-white/60 to-transparent rounded-t-lg pointer-events-none" />
                    <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-amber-950 drop-shadow-[0_1px_2px_rgba(255,255,255,0.7)]" />

                    {/* Glowing Notification Ping Counter */}
                    <div className="absolute -top-1.5 -right-1.5 flex items-center justify-center">
                      <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-black text-[10px] flex items-center justify-center shadow-lg border-2 border-white">
                        1
                      </span>
                      <span className="absolute w-5 h-5 rounded-full bg-rose-500 animate-ping opacity-75" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Rainbow Neon Border Outer Glow Ring */}
              <div className="rainbow-neon-border p-[3.5px] rounded-full shadow-[0_0_30px_rgba(236,72,153,0.55),0_0_45px_rgba(99,102,241,0.5)]">
                {/* Inner Light Button Body */}
                <div className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-white/95 backdrop-blur-md text-slate-900 flex items-center gap-3 border border-white/90 shadow-xl">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 shadow-xs">
                    <Laptop className="w-4 h-4 text-indigo-700" />
                  </div>
                  <span className="text-sm sm:text-base font-black tracking-wide text-slate-900 drop-shadow-xs">
                    {hasObservedStreet ? 'Холст Дизайнера' : 'Открыть ноутбук'}
                  </span>
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SLIDING EDIT PANEL ON THE LEFT SIDE (FRAMER MOTION ANIMATED) */}
      <AnimatePresence>
        {isEditPanelOpen && (
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed top-0 left-0 bottom-0 w-full sm:w-[420px] md:w-[480px] bg-[#f7f8ff] z-40 shadow-[25px_0_60px_rgba(0,0,0,0.35)] border-r border-indigo-100 flex flex-col justify-between overflow-y-auto"
          >
            {/* Panel Content Container */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Header with Close Button */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-indigo-600 tracking-tight">
                    Создай дизайн
                    <br />
                    своей студии
                  </h2>
                  <p className="text-xs text-indigo-900/60 font-semibold mt-1">
                    Настрой внешний вид и стиль студии
                  </p>
                </div>
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setIsEditPanelOpen(false);
                    if (!studio.isCreated) setDialogueStep('welcome_3');
                  }}
                  className="w-9 h-9 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-700 transition-colors shadow-xs cursor-pointer"
                  title="Закрыть панель"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Input: Название студии with live typing update */}
              <div className="space-y-2.5">
                <label className="text-sm font-extrabold text-indigo-900 flex items-center gap-1.5">
                  <Pencil className="w-4 h-4 text-indigo-500" /> Название студии
                </label>
                <div className="relative flex items-center px-4 py-3.5 bg-white rounded-2xl border border-indigo-200 shadow-sm focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-400 transition-all">
                  <input
                    type="text"
                    value={draftName}
                    onChange={(e) => {
                      setDraftName(e.target.value);
                      if (dialogueStep === 'editing_name' || dialogueStep === 'editing_intro') {
                        setDialogueStep('editing_shape');
                      }
                    }}
                    placeholder="Название студии"
                    maxLength={24}
                    className="w-full bg-transparent text-slate-800 font-bold placeholder:text-indigo-300/80 outline-none text-base"
                  />
                </div>

                {/* Creative Quick Suggestion Pills */}
                <div className="pt-1 space-y-1.5">
                  <span className="text-[11px] font-extrabold text-indigo-900/70 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Креативные варианты для выбора:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {STUDIO_NAME_SUGGESTIONS.map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => {
                          soundEngine.playPop();
                          setDraftName(item.name);
                          if (dialogueStep === 'editing_name' || dialogueStep === 'editing_intro') {
                            setDialogueStep('editing_shape');
                          }
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all active:scale-95 flex items-center gap-1 shadow-xs border cursor-pointer ${
                          draftName === item.name
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm ring-2 ring-indigo-300'
                            : 'bg-white text-indigo-700 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/80'
                        }`}
                      >
                        <span>{item.emoji}</span>
                        <span>{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* AvatarPicker Component (SVG Shape Masking, Avatar Selection, Studio Color) */}
              <AvatarPicker
                selectedAvatar={draftAvatar}
                onSelectAvatar={(id) => {
                  setDraftAvatar(id);
                  setCustomAvatarUrl(null);
                  if (dialogueStep === 'editing_shape') {
                    setDialogueStep('editing_color');
                  }
                }}
                selectedShape={draftShape}
                onSelectShape={(shape) => {
                  setDraftShape(shape);
                  if (dialogueStep === 'editing_shape') {
                    setDialogueStep('editing_color');
                  }
                }}
                selectedColor={draftColor}
                onSelectColor={(color) => {
                  setDraftColor(color);
                  if (dialogueStep === 'editing_color') {
                    setDialogueStep('editing_font');
                  }
                }}
                customAvatarUrl={customAvatarUrl}
                onUploadCustomAvatar={(dataUrl) => {
                  setCustomAvatarUrl(dataUrl);
                  setDraftAvatar('custom');
                  if (dialogueStep === 'editing_shape') {
                    setDialogueStep('editing_color');
                  }
                }}
              />

              {/* Section: Выбор шрифта */}
              <div className="space-y-2.5">
                <label className="text-sm font-extrabold text-indigo-900 flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-indigo-500" /> Шрифт студии
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {STUDIO_FONTS.map((font) => (
                    <button
                      key={font.id}
                      onClick={() => {
                        soundEngine.playPop();
                        setDraftFont(font.id);
                        if (dialogueStep === 'editing_font') {
                          setDialogueStep('editing_ready');
                        }
                      }}
                      style={{ fontFamily: font.id }}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center truncate cursor-pointer ${
                        draftFont === font.id
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300'
                          : 'bg-white text-slate-700 border-indigo-100 hover:border-indigo-300'
                      }`}
                    >
                      {font.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Action: Кнопка "Готово" */}
            <div className="p-6 sm:p-8 pt-0">
              <button
                onClick={handleSaveStudio}
                style={{ backgroundColor: draftColor }}
                className="w-full py-4 rounded-full text-white font-black text-base shadow-xl hover:brightness-110 active:scale-95 transition-all text-center tracking-wide cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                <span>Готово</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Windows Laptop Simulator Modal */}
      <WindowsLaptopSimulator
        isOpen={isLaptopOpen}
        onClose={() => setIsLaptopOpen(false)}
        onStartMarieLevel={onStartMarieLevel}
        progress={progress}
        onOpenPortfolio={onOpenPortfolio}
        studio={studio}
        hasObservedStreet={hasObservedStreet}
        currentDesign={currentDesign}
        onTestDesign={onTestDesign}
        versionNumber={versionNumber}
      />
    </div>
  );
};

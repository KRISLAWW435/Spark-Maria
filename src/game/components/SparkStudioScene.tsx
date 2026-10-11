import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  PlayerProgress,
  StudioData,
  AvatarShape,
  StudioFontSize,
  SignDesign,
  PosterDesign,
  StickersDesign,
} from '../types';
import { soundEngine } from '../engine/SoundEngine';
import { GAME_ASSETS } from '../assets';
import { WindowsLaptopSimulator } from './WindowsLaptopSimulator';
import { StudioWall } from './StudioWall';
import { AvatarPicker } from './AvatarPicker';
import { SparkSprite } from './SparkSprite';
import { SparkCharacter } from './SparkCharacter';
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
  Check,
} from 'lucide-react';

const STUDIO_STORAGE_KEY = 'spark_studio_data';
const CUSTOM_AVATAR_STORAGE_KEY = 'spark_custom_avatar_data';

// Permanent Purple/Blue Color for Studio Name - Studio color never changes this!
const STUDIO_NAME_PERMANENT_COLOR = '#7C3AED';

const VALID_SHAPES: AvatarShape[] = [
  'circle',
  'oval',
  'blob_2',
  'polygon',
  'blob_15',
  'cloud',
  'heart_2',
  'blob_11',
];

const DEFAULT_STUDIO: StudioData = {
  isCreated: false,
  name: 'Моя Студия',
  font: 'Nunito',
  fontSize: 'md',
  avatar: 'avatar1',
  avatarScale: 1,
  avatarOffsetY: 0,
  avatarOffsetX: 0,
  customAvatarUrl: null,
  shape: 'blob_2',
  color: '#5834f5',
  decorations: [],
};

// Available Studio Fonts with descriptions
const STUDIO_FONTS = [
  { id: 'Poppins', name: 'Poppins', desc: 'современный', emoji: '⚡' },
  { id: 'Nunito', name: 'Nunito', desc: 'дружелюбный', emoji: '🧸' },
  { id: 'Comfortaa', name: 'Comfortaa', desc: 'круглый', emoji: '🪐' },
  { id: 'Russo One', name: 'Russo One', desc: 'смелый', emoji: '💥' },
  { id: 'Montserrat', name: 'Montserrat', desc: 'строгий', emoji: '📐' },
];

// Creative Studio Name Suggestions (Updated per user request)
const STUDIO_NAME_SUGGESTIONS = [
  { name: 'Студия Ярких Идей', emoji: '💡' },
  { name: 'Мастерская Цвета', emoji: '🎨' },
  { name: 'Дизайн-Лаборатория', emoji: '🔬' },
  { name: 'Творческая Студия', emoji: '✨' },
  { name: 'Пиксель и Креатив', emoji: '🚀' },
];

// Spark Dynamic Studio Design Creation Replies
export const SPARK_STUDIO_REPLIES = {
  step1: {
    initial: 'Сначала придумай название. Как будет называться твоя студия? ✏️',
    onCustomName: (name?: string) => {
      const clean = name?.trim();
      return clean ? `${clean} — звучит как начало большой истории!` : 'Моя Студия — звучит как начало большой истории!';
    },
    onPresetName: 'О, ярко! Мне нравится. Идём дальше?',
    nextButton: 'А теперь давай выберем аватар — лицо твоей студии.',
  },
  step2: {
    initial: 'Выбери аватар и цвет настроения. Это то, как тебя будут узнавать.',
    onAvatarSelect: 'Отличный выбор! Этот аватар запомнится.',
    onColorSelect: 'Теперь твоя студия имеет свой цвет. На карте её сразу найдут!',
    nextButton: 'Последний штрих — шрифт. Он задаёт характер.',
  },
  step3: {
    initial: 'Шрифт — это голос студии. Выбери тот, который звучит как ты.',
    onFontSelect: 'Смотри, как меняется настроение! Этот шрифт — твой.',
    doneButton: 'Всё готово! Теперь открой ноутбук — там первое письмо от клиента.',
  },
};

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
  onStartMarieLevel: (orderNumber?: 1 | 2 | 3) => void;
  onOpenPortfolio: () => void;
  hasObservedStreet?: boolean;
  currentDesign?: SignDesign;
  onTestDesign?: (design: SignDesign) => void;
  versionNumber?: number;
  posterDesign?: PosterDesign | null;
  stickersDesign?: StickersDesign | null;
  onTestPoster?: (design: PosterDesign) => void;
  onTestStickers?: (design: StickersDesign) => void;
  activeOrder?: 1 | 2 | 3;
}

export const SparkStudioScene: React.FC<SparkStudioSceneProps> = ({
  progress,
  onStartMarieLevel,
  onOpenPortfolio,
  hasObservedStreet = false,
  currentDesign,
  onTestDesign,
  versionNumber = 1,
  posterDesign,
  stickersDesign,
  onTestPoster,
  onTestStickers,
  activeOrder = 1,
}) => {
  // Load studio data from localStorage
  const [studio, setStudio] = useState<StudioData>(() => {
    try {
      const saved = localStorage.getItem(STUDIO_STORAGE_KEY);
      const savedCustomAvatar = localStorage.getItem(CUSTOM_AVATAR_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const resolvedShape = VALID_SHAPES.includes(parsed.shape) ? parsed.shape : 'blob_2';
        const customUrl =
          parsed.customAvatarUrl ||
          savedCustomAvatar ||
          (parsed.avatar?.startsWith('data:') ? parsed.avatar : null);
        return {
          ...DEFAULT_STUDIO,
          ...parsed,
          avatar: customUrl ? 'custom' : parsed.avatar || 'avatar1',
          customAvatarUrl: customUrl || null,
          avatarScale: typeof parsed.avatarScale === 'number' ? parsed.avatarScale : 1,
          avatarOffsetY: typeof parsed.avatarOffsetY === 'number' ? parsed.avatarOffsetY : 0,
          avatarOffsetX: typeof parsed.avatarOffsetX === 'number' ? parsed.avatarOffsetX : 0,
          isCreated: Boolean(parsed.isCreated ?? parsed.isConfigured),
          shape: resolvedShape,
        };
      } else if (savedCustomAvatar) {
        return {
          ...DEFAULT_STUDIO,
          avatar: 'custom',
          customAvatarUrl: savedCustomAvatar,
        };
      }
    } catch {
      // ignore
    }
    return DEFAULT_STUDIO;
  });

  // Edit panel open state
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);

  // 3-step studio configuration state: 1: Name, 2: Avatar + color, 3: Font
  const [panelStep, setPanelStep] = useState<1 | 2 | 3>(1);

  // Windows laptop simulator open state
  const [isLaptopOpen, setIsLaptopOpen] = useState(false);

  // Tutorial dialogue state machine
  const [dialogueStep, setDialogueStep] = useState<CreationDialogueStep>(() => {
    return studio.isCreated ? 'idle' : 'welcome_1';
  });

  // State flag for animated letter appearance after creation
  const [hasLetterPopped, setHasLetterPopped] = useState(() => studio.isCreated);

  // Dynamic Spark reply during studio creation & editing
  const [sparkStudioReply, setSparkStudioReply] = useState<string>(
    SPARK_STUDIO_REPLIES.step1.initial
  );

  // Form draft state while editing
  const [draftName, setDraftName] = useState(studio.name);
  const [draftFont, setDraftFont] = useState(studio.font);
  const [draftFontSize, setDraftFontSize] = useState<StudioFontSize>(studio.fontSize || 'md');
  const [draftAvatar, setDraftAvatar] = useState(studio.avatar);
  const [draftAvatarScale, setDraftAvatarScale] = useState<number>(studio.avatarScale || 1);
  const [draftAvatarOffsetY, setDraftAvatarOffsetY] = useState<number>(studio.avatarOffsetY || 0);
  const [draftAvatarOffsetX, setDraftAvatarOffsetX] = useState<number>(studio.avatarOffsetX || 0);
  const [draftShape, setDraftShape] = useState<AvatarShape>(
    VALID_SHAPES.includes(studio.shape) ? studio.shape : 'blob_2'
  );
  const [draftColor, setDraftColor] = useState(studio.color);
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string | null>(() => {
    try {
      return (
        studio.customAvatarUrl ||
        (studio.avatar?.startsWith('data:') ? studio.avatar : null) ||
        localStorage.getItem(CUSTOM_AVATAR_STORAGE_KEY)
      );
    } catch {
      return studio.customAvatarUrl || (studio.avatar?.startsWith('data:') ? studio.avatar : null);
    }
  });

  // Sync draft only when edit panel initially opens
  useEffect(() => {
    if (isEditPanelOpen) {
      setDraftName(studio.name);
      setDraftFont(studio.font);
      setDraftFontSize(studio.fontSize || 'md');
      setDraftAvatar(studio.avatar);
      setDraftAvatarScale(studio.avatarScale || 1);
      setDraftAvatarOffsetY(studio.avatarOffsetY || 0);
      setDraftAvatarOffsetX(studio.avatarOffsetX || 0);
      setDraftShape(VALID_SHAPES.includes(studio.shape) ? studio.shape : 'blob_2');
      setDraftColor(studio.color);
      try {
        setCustomAvatarUrl(
          studio.customAvatarUrl ||
            (studio.avatar?.startsWith('data:') ? studio.avatar : null) ||
            localStorage.getItem(CUSTOM_AVATAR_STORAGE_KEY)
        );
      } catch {
        setCustomAvatarUrl(studio.customAvatarUrl || (studio.avatar?.startsWith('data:') ? studio.avatar : null));
      }
    }
  }, [isEditPanelOpen]);

  // Auto-save changes immediately if studio is already created
  useEffect(() => {
    if (!studio.isCreated || !isEditPanelOpen) return;

    const effectiveCustom =
      customAvatarUrl ||
      (draftAvatar === 'custom' && studio.customAvatarUrl ? studio.customAvatarUrl : null);
    const resolvedAvatar = effectiveCustom ? 'custom' : draftAvatar;

    const updated: StudioData = {
      ...studio,
      isCreated: true,
      name: draftName.trim() || studio.name || 'Моя Студия',
      font: draftFont,
      fontSize: draftFontSize,
      avatar: resolvedAvatar,
      avatarScale: draftAvatarScale,
      avatarOffsetY: draftAvatarOffsetY,
      avatarOffsetX: draftAvatarOffsetX,
      customAvatarUrl: effectiveCustom || null,
      shape: draftShape,
      color: draftColor,
    };

    setStudio((prev) => {
      if (
        prev.name === updated.name &&
        prev.font === updated.font &&
        prev.fontSize === updated.fontSize &&
        prev.avatar === updated.avatar &&
        prev.avatarScale === updated.avatarScale &&
        prev.avatarOffsetY === updated.avatarOffsetY &&
        prev.avatarOffsetX === updated.avatarOffsetX &&
        prev.customAvatarUrl === updated.customAvatarUrl &&
        prev.shape === updated.shape &&
        prev.color === updated.color
      ) {
        return prev;
      }
      try {
        localStorage.setItem(STUDIO_STORAGE_KEY, JSON.stringify(updated));
        if (effectiveCustom) {
          localStorage.setItem(CUSTOM_AVATAR_STORAGE_KEY, effectiveCustom);
        } else {
          localStorage.removeItem(CUSTOM_AVATAR_STORAGE_KEY);
        }
      } catch (err) {
        console.warn('Storage save warning:', err);
      }
      return updated;
    });
  }, [
    isEditPanelOpen,
    studio.isCreated,
    draftName,
    draftFont,
    draftFontSize,
    draftAvatar,
    draftAvatarScale,
    draftAvatarOffsetY,
    draftAvatarOffsetX,
    draftShape,
    draftColor,
    customAvatarUrl,
  ]);

  // Handle clicking '+' or opening panel from tutorial
  const handleOpenEditPanel = () => {
    soundEngine.playClick();
    setPanelStep(1);
    setSparkStudioReply(SPARK_STUDIO_REPLIES.step1.initial);
    setIsEditPanelOpen(true);
    if (!studio.isCreated) {
      setDialogueStep('editing_name');
    }
  };

  // Save studio action
  const handleSaveStudio = () => {
    soundEngine.playSuccess();
    try {
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const interval: ReturnType<typeof setInterval> = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        const particleCount = 40 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: 0.2 + Math.random() * 0.6, y: Math.random() - 0.2 },
        });
      }, 250);
    } catch {}

    const effectiveCustom =
      customAvatarUrl ||
      (draftAvatar === 'custom' && studio.customAvatarUrl ? studio.customAvatarUrl : null);
    const resolvedAvatar = effectiveCustom ? 'custom' : draftAvatar;

    const updated: StudioData = {
      isCreated: true,
      name: draftName.trim() || 'Моя Студия',
      font: draftFont,
      fontSize: draftFontSize,
      avatar: resolvedAvatar,
      avatarScale: draftAvatarScale,
      avatarOffsetY: draftAvatarOffsetY,
      avatarOffsetX: draftAvatarOffsetX,
      customAvatarUrl: effectiveCustom || null,
      shape: draftShape,
      color: draftColor,
      decorations: studio.decorations || [],
    };
    setStudio(updated);
    try {
      localStorage.setItem(STUDIO_STORAGE_KEY, JSON.stringify(updated));
      if (effectiveCustom) {
        localStorage.setItem(CUSTOM_AVATAR_STORAGE_KEY, effectiveCustom);
      } else {
        localStorage.removeItem(CUSTOM_AVATAR_STORAGE_KEY);
      }
    } catch (err) {
      console.warn('Storage save warning:', err);
    }

    const isFirstCreation = !studio.isCreated;
    setIsEditPanelOpen(false);

    // Transition to post-creation Spark dialogue
    if (isFirstCreation) {
      setDialogueStep('done_celebrate');
    } else {
      setDialogueStep('idle');
    }
  };

  const isBakeryCompleted = progress.completedModules.includes('bakery_marie');

  // Spark dialogue text and actions based on current step
  const getDialogueContent = () => {
    // While studio edit panel is open, Spark provides dynamic interactive feedback
    if (isEditPanelOpen) {
      return {
        text: sparkStudioReply || SPARK_STUDIO_REPLIES.step1.initial,
        emotion:
          sparkStudioReply === SPARK_STUDIO_REPLIES.step3.doneButton
            ? ('excited' as const)
            : sparkStudioReply === SPARK_STUDIO_REPLIES.step1.initial
            ? ('thinking' as const)
            : ('happy' as const),
        showNext: false,
        highlightLaptop: false,
      };
    }

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
      case 'editing_name':
        return {
          text: SPARK_STUDIO_REPLIES.step1.initial,
          emotion: 'thinking' as const,
          showNext: false,
        };
      case 'editing_shape':
      case 'editing_color':
        return {
          text: SPARK_STUDIO_REPLIES.step2.initial,
          emotion: 'happy' as const,
          showNext: false,
        };
      case 'editing_font':
      case 'editing_ready':
        return {
          text: SPARK_STUDIO_REPLIES.step3.initial,
          emotion: 'excited' as const,
          showNext: false,
        };
      case 'done_celebrate':
        return {
          text: 'Всё готово! Теперь открой ноутбук — там первое письмо от клиента.',
          emotion: 'excited' as const,
          showNext: true,
          onNext: () => {
            soundEngine.playClick();
            setIsLaptopOpen(true);
            setDialogueStep('idle');
            setHasLetterPopped(true);
          },
          nextLabel: 'Открыть ноутбук →',
          hasMailIcon: true,
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
          text: 'Загляни в ноутбук, там пришло письмо! ✉️💻',
          emotion: 'happy' as const,
          showNext: false,
          highlightLaptop: true,
        };
      case 'idle':
      default:
        if (hasObservedStreet && !isBakeryCompleted) {
          return {
            text: 'Открывай ноутбук. Запускай программу для дизайна.',
            emotion: 'excited' as const,
            showNext: false,
            highlightLaptop: true,
          };
        }
        if (studio.isCreated && !isBakeryCompleted) {
          return {
            text: 'Загляни в ноутбук, там пришло письмо! ✉️💻',
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
  const liveFontSize = isEditPanelOpen ? draftFontSize : studio.fontSize || 'md';
  const liveAvatarColor = isEditPanelOpen ? draftColor : studio.color;
  const liveAvatarKey = isEditPanelOpen
    ? (customAvatarUrl ? 'custom' : draftAvatar)
    : (studio.customAvatarUrl || studio.avatar?.startsWith('data:') ? 'custom' : studio.avatar);
  const liveCustomAvatarUrl = isEditPanelOpen
    ? customAvatarUrl
    : (studio.customAvatarUrl || (studio.avatar?.startsWith('data:') ? studio.avatar : null));
  const liveAvatarScale = isEditPanelOpen ? draftAvatarScale : (studio.avatarScale || 1);
  const liveAvatarOffsetY = isEditPanelOpen ? draftAvatarOffsetY : (studio.avatarOffsetY || 0);
  const liveAvatarOffsetX = isEditPanelOpen ? draftAvatarOffsetX : (studio.avatarOffsetX || 0);
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
        fontSize={liveFontSize}
        avatar={liveAvatarKey}
        avatarScale={liveAvatarScale}
        avatarOffsetY={liveAvatarOffsetY}
        avatarOffsetX={liveAvatarOffsetX}
        customAvatarUrl={liveCustomAvatarUrl}
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
                ? 'bottom-10 sm:bottom-14 left-auto right-3 sm:right-auto sm:left-[470px] md:left-[530px] flex-col sm:flex-row items-center sm:items-end gap-3 sm:gap-5 max-w-lg'
                : 'bottom-12 sm:bottom-16 md:bottom-20 left-12 sm:left-20 md:left-28 lg:left-36 flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 max-w-xl'
            }`}
          >
            {/* Spark Animated Floating Character Container */}
            <motion.div
              animate={{
                y: [0, -6, 0],
              }}
              transition={{
                duration: 3.6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className={`relative shrink-0 pointer-events-auto cursor-pointer select-none origin-bottom-left ${
                isEditPanelOpen
                  ? 'h-52 sm:h-64 md:h-72 lg:h-[340px]'
                  : 'h-60 sm:h-76 md:h-88 lg:h-[400px]'
              }`}
            >
              {/* Ethereal Living Purple Aura Glow - Compact & Refined */}
              <motion.div
                animate={{
                  opacity: [0.25, 0.45, 0.25],
                  scale: [0.96, 1.04, 0.96],
                }}
                transition={{
                  duration: 4.0,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -inset-2 sm:-inset-3 rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(169,129,255,0.35)_0%,_rgba(29,0,90,0.25)_50%,_transparent_75%)] blur-lg pointer-events-none"
              />

              {/* Sparkle Twinkle 1 (Above Head / Tiara Aura) */}
              <motion.div
                animate={{
                  y: [0, -8, -14],
                  opacity: [0, 0.85, 0],
                  scale: [0.3, 1.05, 0.3],
                  rotate: [0, 45, 90],
                }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.1,
                }}
                className="absolute top-[2%] left-[45%] select-none pointer-events-none filter drop-shadow-[0_0_5px_rgba(255,255,255,0.95)] text-white z-10"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
                </svg>
              </motion.div>

              {/* Sparkle Twinkle 2 (Outer Right Hair / Aura) */}
              <motion.div
                animate={{
                  y: [2, -6, -12],
                  opacity: [0, 0.8, 0],
                  scale: [0.25, 0.95, 0.25],
                  rotate: [15, 60, 105],
                }}
                transition={{
                  duration: 3.0,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.9,
                }}
                className="absolute top-[22%] right-[14%] select-none pointer-events-none filter drop-shadow-[0_0_4px_rgba(255,255,255,0.9)] text-white/90 z-10"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
                </svg>
              </motion.div>

              {/* Sparkle Twinkle 3 (Outer Left Hair / Aura) */}
              <motion.div
                animate={{
                  y: [1, -7, -13],
                  opacity: [0, 0.75, 0],
                  scale: [0.25, 0.9, 0.25],
                  rotate: [0, 45, 90],
                }}
                transition={{
                  duration: 2.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1.5,
                }}
                className="absolute top-[18%] left-[14%] select-none pointer-events-none filter drop-shadow-[0_0_4px_rgba(255,255,255,0.85)] text-white/85 z-10"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
                </svg>
              </motion.div>

              {/* Sparkle Twinkle 4 (Right Wing / Sparkle Wand) */}
              <motion.div
                animate={{
                  y: [1, -7, -13],
                  opacity: [0, 0.8, 0],
                  scale: [0.25, 0.95, 0.25],
                  rotate: [0, 30, 60],
                }}
                transition={{
                  duration: 2.7,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1.8,
                }}
                className="absolute top-[48%] right-[14%] select-none pointer-events-none filter drop-shadow-[0_0_5px_rgba(255,255,255,0.9)] text-white/90 z-10"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
                </svg>
              </motion.div>

              {/* Sparkle Twinkle 5 (Left Wing / Ribbon) */}
              <motion.div
                animate={{
                  y: [2, -6, -12],
                  opacity: [0, 0.75, 0],
                  scale: [0.2, 0.85, 0.2],
                  rotate: [20, 65, 110],
                }}
                transition={{
                  duration: 3.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1.2,
                }}
                className="absolute top-[46%] left-[12%] select-none pointer-events-none filter drop-shadow-[0_0_4px_rgba(255,255,255,0.85)] text-white/85 z-10"
              >
                <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
                </svg>
              </motion.div>

              {/* Sparkle Twinkle 6 (Lower Left Fairy Swirl) */}
              <motion.div
                animate={{
                  y: [1, -6, -11],
                  opacity: [0, 0.75, 0],
                  scale: [0.2, 0.85, 0.2],
                  rotate: [10, 50, 90],
                }}
                transition={{
                  duration: 2.9,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 2.1,
                }}
                className="absolute bottom-[22%] left-[32%] select-none pointer-events-none filter drop-shadow-[0_0_4px_rgba(255,255,255,0.85)] text-white/85 z-10"
              >
                <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
                </svg>
              </motion.div>

              {/* Sparkle Twinkle 7 (Lower Right Hem) */}
              <motion.div
                animate={{
                  y: [1, -7, -12],
                  opacity: [0, 0.7, 0],
                  scale: [0.2, 0.8, 0.2],
                  rotate: [25, 70, 115],
                }}
                transition={{
                  duration: 2.7,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1.4,
                }}
                className="absolute bottom-[18%] right-[24%] select-none pointer-events-none filter drop-shadow-[0_0_4px_rgba(255,255,255,0.8)] text-white/80 z-10"
              >
                <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
                </svg>
              </motion.div>

              {/* Sparkle Twinkle 8 (Bottom Fairy Dust Trail) */}
              <motion.div
                animate={{
                  y: [2, -6, -11],
                  opacity: [0, 0.75, 0],
                  scale: [0.25, 0.9, 0.25],
                  rotate: [30, 75, 120],
                }}
                transition={{
                  duration: 3.1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.6,
                }}
                className="absolute bottom-[8%] left-[48%] select-none pointer-events-none filter drop-shadow-[0_0_5px_rgba(255,255,255,0.9)] text-white/85 z-10"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
                </svg>
              </motion.div>

              {/* Spark Sprite */}
              <div className="relative h-full w-auto">
                <SparkCharacter
                  size="100%"
                  className="h-full w-auto"
                  interactive={true}
                  idleNudge={true}
                  idleTimeoutMs={20000}
                  onClick={() => {
                    soundEngine.playClick();
                    if (dialogue?.showNext && dialogue?.onNext) {
                      dialogue.onNext();
                    } else if (!isEditPanelOpen && studio.isCreated) {
                      setDialogueStep('done_look_who');
                    }
                  }}
                  title="Спарк"
                />
              </div>
            </motion.div>

            {/* Spark Speech Dialogue Bubble */}
            <motion.div
              key={isEditPanelOpen ? sparkStudioReply : dialogueStep}
              initial={{ opacity: 0, scale: 0.96, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -4 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative pointer-events-auto w-full sm:w-auto max-w-sm sm:max-w-md md:max-w-[420px] lg:max-w-[450px] mb-2 sm:mb-6 sm:-translate-y-4 p-5 sm:p-6 rounded-[28px] sm:rounded-[32px] bg-white/95 backdrop-blur-md border-2 border-indigo-200/90 shadow-[0_16px_40px_rgba(30,27,75,0.25)] text-slate-800 flex flex-col justify-between"
            >
              {/* Refined Smooth Speech Tail */}
              {!isEditPanelOpen && (
                <svg
                  className="hidden sm:block absolute -left-3 bottom-7 w-4 h-4 text-white/95 filter drop-shadow-[-1px_0_0_rgba(199,210,254,0.9)] pointer-events-none"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                >
                  <path d="M16 0 C10 4 3 10 0 16 C6 14 12 12 16 10 Z" />
                </svg>
              )}

              {/* Spark Header (No icon) */}
              <div className="mb-2 text-xs font-black uppercase tracking-wider text-indigo-600">
                <span>Спарк · Искра творчества</span>
              </div>

              {/* Speech Text */}
              <p className="text-base sm:text-[17px] md:text-lg font-bold text-slate-900 leading-relaxed drop-shadow-xs">
                {dialogue.text}
              </p>

              {/* Next Button or Interactive Action */}
              {dialogue.showNext && dialogue.onNext && (
                <div className="mt-3 pt-2.5 border-t border-indigo-100 flex justify-end">
                  <button
                    onClick={dialogue.onNext}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-black text-sm sm:text-base shadow-lg flex items-center gap-2.5 transition-transform active:scale-95 cursor-pointer"
                  >
                    <span>{dialogue.nextLabel || 'Далее'}</span>
                    {dialogue.hasMailIcon ? (
                      <Mail className="w-5 h-5 text-amber-300 drop-shadow-xs" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
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
            className="fixed top-0 left-0 bottom-0 w-full sm:w-[440px] md:w-[480px] bg-[#f7f8ff] z-40 shadow-[25px_0_60px_rgba(0,0,0,0.35)] border-r border-indigo-100 flex flex-col justify-between overflow-hidden"
          >
            {/* Panel Header & Stepper */}
            <div className="p-5 sm:p-6 pb-3 shrink-0 border-b border-indigo-100/90 bg-white/80 backdrop-blur-xs">
              <div className="flex items-center justify-between mb-3.5 sm:mb-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <h2 className="text-xl sm:text-2xl font-black text-indigo-950 tracking-tight leading-tight">
                    Создай дизайн студии
                  </h2>
                  <p className="text-xs sm:text-sm text-indigo-700/80 font-bold leading-normal">
                    {panelStep === 1 && 'Шаг 1 из 3: Название студии'}
                    {panelStep === 2 && 'Шаг 2 из 3: Аватар + цвет'}
                    {panelStep === 3 && 'Шаг 3 из 3: Шрифт студии'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setIsEditPanelOpen(false);
                    if (!studio.isCreated) setDialogueStep('welcome_3');
                  }}
                  className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors shadow-xs cursor-pointer"
                  title="Закрыть панель"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 3 Step Indicator Tabs */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {[
                  { step: 1, label: '1. Название' },
                  { step: 2, label: '2. Аватар' },
                  { step: 3, label: '3. Шрифт' },
                ].map((item) => (
                  <button
                    key={item.step}
                    type="button"
                    onClick={() => {
                      soundEngine.playPop();
                      const stepNum = item.step as 1 | 2 | 3;
                      setPanelStep(stepNum);
                      if (stepNum === 1) {
                        setSparkStudioReply(SPARK_STUDIO_REPLIES.step1.initial);
                        if (!studio.isCreated) setDialogueStep('editing_name');
                      } else if (stepNum === 2) {
                        setSparkStudioReply(SPARK_STUDIO_REPLIES.step2.initial);
                        if (!studio.isCreated) setDialogueStep('editing_shape');
                      } else if (stepNum === 3) {
                        setSparkStudioReply(SPARK_STUDIO_REPLIES.step3.initial);
                        if (!studio.isCreated) setDialogueStep('editing_font');
                      }
                    }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer text-center ${
                      panelStep === item.step
                        ? 'bg-indigo-600 text-white shadow-md'
                        : panelStep > item.step
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step Content Area (No scrolling required) */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between overflow-y-auto">
              {/* STEP 1: НАЗВАНИЕ СТУДИИ */}
              {panelStep === 1 && (
                <div className="space-y-4 pt-1 sm:pt-2">
                  <div className="space-y-2">
                    <label className="text-sm font-extrabold text-indigo-950 flex items-center gap-2">
                      <Pencil className="w-4 h-4 text-indigo-600" /> Назови свою студию
                    </label>
                    <div className="relative flex items-center px-4 py-3.5 bg-white rounded-2xl border-2 border-indigo-200 shadow-sm focus-within:border-indigo-600 transition-all">
                      <input
                        type="text"
                        value={draftName}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDraftName(val);
                          if (val.trim()) {
                            setSparkStudioReply(SPARK_STUDIO_REPLIES.step1.onCustomName(val));
                          }
                        }}
                        placeholder="Название студии"
                        maxLength={26}
                        className="w-full bg-transparent text-slate-900 font-extrabold placeholder:text-indigo-300 outline-none text-base"
                      />
                    </div>
                  </div>

                  {/* Creative Suggestions (The 5 requested studio names) */}
                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-extrabold text-indigo-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" /> Выбери один из вариантов:
                    </span>
                    <div className="flex flex-col gap-2">
                      {STUDIO_NAME_SUGGESTIONS.map((item) => (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => {
                            soundEngine.playPop();
                            setDraftName(item.name);
                            setSparkStudioReply(SPARK_STUDIO_REPLIES.step1.onPresetName);
                          }}
                          className={`w-full px-4 py-3 rounded-2xl text-sm font-extrabold transition-all flex items-center justify-between border cursor-pointer ${
                            draftName === item.name
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300'
                              : 'bg-white text-slate-800 border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50/50 shadow-xs'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <span className="text-lg">{item.emoji}</span>
                            <span>{item.name}</span>
                          </span>
                          {draftName === item.name && (
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: АВАТАР И ЦВЕТ ФОНА */}
              {panelStep === 2 && (
                <div className="space-y-3 pt-1 sm:pt-2">
                  <AvatarPicker
                    selectedAvatar={draftAvatar}
                    onSelectAvatar={(id) => {
                      setDraftAvatar(id);
                      setSparkStudioReply(SPARK_STUDIO_REPLIES.step2.onAvatarSelect);
                      if (id !== 'custom') {
                        setCustomAvatarUrl(null);
                      }
                    }}
                    selectedAvatarScale={draftAvatarScale}
                    onSelectAvatarScale={setDraftAvatarScale}
                    selectedAvatarOffsetY={draftAvatarOffsetY}
                    onSelectAvatarOffsetY={setDraftAvatarOffsetY}
                    selectedAvatarOffsetX={draftAvatarOffsetX}
                    onSelectAvatarOffsetX={setDraftAvatarOffsetX}
                    selectedShape={draftShape}
                    onSelectShape={(shape) => {
                      setDraftShape(shape);
                      setSparkStudioReply(SPARK_STUDIO_REPLIES.step2.onAvatarSelect);
                    }}
                    selectedColor={draftColor}
                    onSelectColor={(color) => {
                      setDraftColor(color);
                      setSparkStudioReply(SPARK_STUDIO_REPLIES.step2.onColorSelect);
                    }}
                    customAvatarUrl={customAvatarUrl}
                    onUploadCustomAvatar={(dataUrl) => {
                      if (dataUrl) {
                        setCustomAvatarUrl(dataUrl);
                        setDraftAvatar('custom');
                        setSparkStudioReply(SPARK_STUDIO_REPLIES.step2.onAvatarSelect);
                      } else {
                        setCustomAvatarUrl(null);
                        setDraftAvatar('avatar1');
                      }
                    }}
                  />
                </div>
              )}

              {/* STEP 3: ШРИФТ И РАЗМЕР ШРИФТА НАЗВАНИЯ СТУДИИ */}
              {panelStep === 3 && (
                <div className="space-y-3 pt-1 sm:pt-2">
                  <div className="space-y-1">
                    <label className="text-sm font-extrabold text-indigo-950 flex items-center gap-2">
                      <Type className="w-4 h-4 text-indigo-600" /> Выбери шрифт названия студии
                    </label>
                    <p className="text-xs text-slate-500 font-medium">
                      Каждый шрифт передает свой характер и стиль
                    </p>
                  </div>

                  {/* 5 Fonts List with Live Preview */}
                  <div className="space-y-1.5 sm:space-y-2">
                    {STUDIO_FONTS.map((font) => {
                      const isSelected = draftFont === font.id;
                      return (
                        <button
                          key={font.id}
                          type="button"
                          onClick={() => {
                            soundEngine.playPop();
                            setDraftFont(font.id);
                            setSparkStudioReply(SPARK_STUDIO_REPLIES.step3.onFontSelect);
                          }}
                          className={`w-full p-2.5 sm:p-3 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-300'
                              : 'bg-white text-slate-800 border-indigo-100 hover:border-indigo-300 hover:bg-slate-50 shadow-xs'
                          }`}
                        >
                          <div className="text-left min-w-0 pr-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-base">{font.emoji}</span>
                              <span
                                style={{ fontFamily: font.id }}
                                className="text-base font-bold"
                              >
                                {font.name}
                              </span>
                              <span
                                className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                  isSelected
                                    ? 'bg-white/25 text-white'
                                    : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                }`}
                              >
                                {font.desc}
                              </span>
                            </div>
                            <div
                              style={{ fontFamily: font.id }}
                              className={`mt-0.5 truncate text-xs sm:text-sm font-semibold transition-colors ${
                                isSelected ? 'text-indigo-100' : 'text-slate-600'
                              }`}
                            >
                              {draftName.trim() || 'Название студии'}
                            </div>
                          </div>

                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'border-white bg-white text-indigo-600'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* FONT SIZE CONTROLS: 3 OPTIMAL SIZES (sm, md, lg) WITH BUTTONS */}
                  <div className="space-y-1.5 pt-2.5 border-t border-indigo-100/90">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-extrabold text-indigo-950 flex items-center gap-1.5">
                        <span className="text-base">📏</span> Выбери размер шрифта
                      </label>
                      <span className="text-xs font-black text-indigo-600">
                        {draftFontSize === 'sm' && 'Маленький'}
                        {draftFontSize === 'md' && 'Средний'}
                        {draftFontSize === 'lg' && 'Крупный'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Decrease Font Size Button (-) */}
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playPop();
                          if (draftFontSize === 'lg') setDraftFontSize('md');
                          else if (draftFontSize === 'md') setDraftFontSize('sm');
                          setSparkStudioReply(SPARK_STUDIO_REPLIES.step3.onFontSelect);
                        }}
                        disabled={draftFontSize === 'sm'}
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center font-black text-lg transition-all ${
                          draftFontSize === 'sm'
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50'
                            : 'bg-white hover:bg-indigo-50 text-indigo-700 border-indigo-200 cursor-pointer shadow-xs active:scale-95'
                        }`}
                        title="Уменьшить шрифт"
                      >
                        -
                      </button>

                      {/* 3 Size Choice Buttons */}
                      <div className="flex-1 grid grid-cols-3 gap-1.5 bg-slate-100/90 p-1 rounded-2xl border border-slate-200">
                        {[
                          { id: 'sm', label: 'Маленький', icon: 'A-' },
                          { id: 'md', label: 'Средний', icon: 'A' },
                          { id: 'lg', label: 'Крупный', icon: 'A+' },
                        ].map((sizeOpt) => {
                          const isSelected = draftFontSize === sizeOpt.id;
                          return (
                            <button
                              key={sizeOpt.id}
                              type="button"
                              onClick={() => {
                                soundEngine.playPop();
                                setDraftFontSize(sizeOpt.id as StudioFontSize);
                                setSparkStudioReply(SPARK_STUDIO_REPLIES.step3.onFontSelect);
                              }}
                              className={`py-1.5 px-2 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center cursor-pointer ${
                                isSelected
                                  ? 'bg-indigo-600 text-white shadow-sm'
                                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                              }`}
                            >
                              <span className="font-extrabold text-sm leading-tight">{sizeOpt.icon}</span>
                              <span className="text-[10px] leading-tight opacity-90">{sizeOpt.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Increase Font Size Button (+) */}
                      <button
                        type="button"
                        onClick={() => {
                          soundEngine.playPop();
                          if (draftFontSize === 'sm') setDraftFontSize('md');
                          else if (draftFontSize === 'md') setDraftFontSize('lg');
                          setSparkStudioReply(SPARK_STUDIO_REPLIES.step3.onFontSelect);
                        }}
                        disabled={draftFontSize === 'lg'}
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center font-black text-lg transition-all ${
                          draftFontSize === 'lg'
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50'
                            : 'bg-white hover:bg-indigo-50 text-indigo-700 border-indigo-200 cursor-pointer shadow-xs active:scale-95'
                        }`}
                        title="Увеличить шрифт"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Navigation Buttons */}
            <div className="p-5 sm:p-6 pt-3 border-t border-indigo-100/90 bg-white/80 backdrop-blur-xs">
              {studio.isCreated ? (
                /* REPEATED EDITING: AUTO-SAVED IMMEDIATELY, NO NEED TO FLIP THROUGH ALL STEPS */
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-black text-emerald-700 bg-emerald-50 px-3.5 py-2.5 rounded-2xl border border-emerald-200/90 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Сохранено автоматически</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playSuccess();
                      setIsEditPanelOpen(false);
                      setDialogueStep('idle');
                    }}
                    className="px-6 py-2.5 sm:py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm sm:text-base shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    <span>Готово</span>
                  </button>
                </div>
              ) : (
                /* INITIAL CREATION: 3-STEP WIZARD */
                <div className="flex items-center gap-3">
                  {panelStep > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        const prev = (panelStep - 1) as 1 | 2;
                        setPanelStep(prev);
                        if (prev === 1) {
                          setSparkStudioReply(SPARK_STUDIO_REPLIES.step1.initial);
                          setDialogueStep('editing_name');
                        } else {
                          setSparkStudioReply(SPARK_STUDIO_REPLIES.step2.initial);
                          setDialogueStep('editing_shape');
                        }
                      }}
                      className="px-4 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Назад</span>
                    </button>
                  )}

                  {panelStep === 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playPop();
                        setPanelStep(2);
                        setSparkStudioReply(SPARK_STUDIO_REPLIES.step1.nextButton);
                        setDialogueStep('editing_shape');
                      }}
                      className="flex-1 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm sm:text-base shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                    >
                      <span>Далее: Аватар + цвет →</span>
                    </button>
                  )}

                  {panelStep === 2 && (
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playPop();
                        setPanelStep(3);
                        setSparkStudioReply(SPARK_STUDIO_REPLIES.step2.nextButton);
                        setDialogueStep('editing_font');
                      }}
                      className="flex-1 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm sm:text-base shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                    >
                      <span>Далее: Шрифт →</span>
                    </button>
                  )}

                  {panelStep === 3 && (
                    <button
                      type="button"
                      onClick={handleSaveStudio}
                      className="flex-1 py-3.5 rounded-2xl bg-[#A855F7] hover:bg-[#9333EA] text-white font-black text-base shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                    >
                      <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                      <span>Готово ✓</span>
                    </button>
                  )}
                </div>
              )}
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
        posterDesign={posterDesign}
        stickersDesign={stickersDesign}
        onTestPoster={onTestPoster}
        onTestStickers={onTestStickers}
        activeOrder={activeOrder}
      />
    </div>
  );
};

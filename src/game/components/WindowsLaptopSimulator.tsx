import React, { useState, useEffect, useRef } from 'react';
import { PlayerProgress, StudioData, AvatarShape, SignDesign } from '../types';
import { soundEngine } from '../engine/SoundEngine';
import { MarieSprite } from './MarieSprite';
import { SVG_AVATAR_SHAPES } from '../shapes';
import { CanvasEditor } from './CanvasEditor';
import { Window } from './Window';
import {
  Mail,
  Folder,
  X,
  Minus,
  Square,
  Search,
  Settings,
  Power,
  Wifi,
  Volume2,
  Bell,
  ArrowRight,
  BookOpen,
  Upload,
  Palette,
  Check,
  Laptop,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Star,
  Eye,
  Zap,
  CheckCircle2,
  Paintbrush,
  Trash2,
  Pipette,
  Sun,
  Layers,
} from 'lucide-react';

import teen3dUnderwaterImg from '../../assets/images/teen_3d_underwater_1790876604765.jpg';
import teenMinecraftVoxelImg from '../../assets/images/teen_minecraft_voxel_1790876619023.jpg';
import teen2dCosmosImg from '../../assets/images/teen_2d_cosmos_1790876631533.jpg';
import teen2dFantasyNatureImg from '../../assets/images/teen_2d_fantasy_nature_1790876643358.jpg';
import teenRetroPixelGameImg from '../../assets/images/teen_retro_pixel_game_1790876655588.jpg';
import teen3dCyberCityImg from '../../assets/images/teen_3d_cyber_city_1790876667677.jpg';
import teen3dClayPopImg from '../../assets/images/teen_3d_clay_pop_1790876679237.jpg';
import teenAnimeLofiSunsetImg from '../../assets/images/teen_anime_lofi_sunset_1790876691833.jpg';
import teen3dHoloChromeImg from '../../assets/images/teen_3d_holo_chrome_1790876711336.jpg';
import teenStreetGraffitiImg from '../../assets/images/teen_street_graffiti_1790876723775.jpg';
import teenPixelRpgQuestImg from '../../assets/images/teen_pixel_rpg_quest_1790876735551.jpg';
import teen3dCyberPetImg from '../../assets/images/teen_3d_cyber_pet_1790876747793.jpg';

interface WindowsLaptopSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  onStartMarieLevel: () => void;
  progress: PlayerProgress;
  onOpenPortfolio?: () => void;
  studio?: StudioData;
  hasObservedStreet?: boolean;
  currentDesign?: SignDesign;
  onTestDesign?: (design: SignDesign) => void;
  versionNumber?: number;
}

export type AppId = 'mail' | 'portfolio' | 'settings' | 'book' | 'canvas';
export type IconStyle = 'cyber' | 'cartoon' | 'bubble' | 'classic';

export interface WindowMeta {
  id: AppId;
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  initialPos: { x: number; y: number };
  initialSize: { width: string | number; height: string | number };
}

export interface ThemePreset {
  id: string;
  name: string;
  wallpaper: string;
  accent: string;
  desc: string;
  emoji: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: '3d_underwater',
    name: '3D Подводный Океан',
    wallpaper: teen3dUnderwaterImg,
    accent: '#00d2ff',
    desc: '3D мультяшные коралловые рифы, сияющие рыбки и глубина',
    emoji: '🐠',
  },
  {
    id: 'minecraft_voxel',
    name: 'Майнкрафт Закат',
    wallpaper: teenMinecraftVoxelImg,
    accent: '#f59e0b',
    desc: 'Кубические сакуровые горы, воксельный водопад и фонари',
    emoji: '⛏️',
  },
  {
    id: '2d_cosmos',
    name: '2D Аниме Космос',
    wallpaper: teen2dCosmosImg,
    accent: '#8b5cf6',
    desc: 'Эпическая туманность, планетарные кольца и космонавт',
    emoji: '🚀',
  },
  {
    id: '2d_fantasy_nature',
    name: '2D Фэнтези Природа',
    wallpaper: teen2dFantasyNatureImg,
    accent: '#10b981',
    desc: 'Парящие изумрудные острова, водопады и древо духов',
    emoji: '🌿',
  },
  {
    id: 'retro_pixel_arcade',
    name: 'Пиксель-Арт Гейминг',
    wallpaper: teenRetroPixelGameImg,
    accent: '#ff007f',
    desc: '16-битный ретро-аркадный зал, неон и геймерский вайб',
    emoji: '👾',
  },
  {
    id: '3d_cyber_city',
    name: '3D Кибер-Город',
    wallpaper: teen3dCyberCityImg,
    accent: '#00f5d4',
    desc: 'Футуристичные улицы, голограммы и летающие спидеры',
    emoji: '🏙️',
  },
  {
    id: '3d_clay_pop',
    name: '3D Поп-Арт & Сникеры',
    wallpaper: teen3dClayPopImg,
    accent: '#ff5400',
    desc: 'Глянцевый виниловый 3D мир, сникеры и смайлы',
    emoji: '👟',
  },
  {
    id: 'anime_lofi_sunset',
    name: 'Аниме Лоу-фай Закат',
    wallpaper: teenAnimeLofiSunsetImg,
    accent: '#ec4899',
    desc: 'Атмосферный вечер на крыше с ноутбуком и огнями города',
    emoji: '🌆',
  },
  {
    id: '3d_holo_chrome',
    name: '3D Голографический Хром',
    wallpaper: teen3dHoloChromeImg,
    accent: '#a855f7',
    desc: 'Жидкие хромированные 3D волны с радужным переливом',
    emoji: '🔮',
  },
  {
    id: 'street_graffiti',
    name: 'Уличный Стрит-Арт',
    wallpaper: teenStreetGraffitiImg,
    accent: '#e11d48',
    desc: 'Яркое баллонное граффити, поп-арт символы и стикеры',
    emoji: '🎨',
  },
  {
    id: 'pixel_rpg_quest',
    name: 'Pixel RPG Квест',
    wallpaper: teenPixelRpgQuestImg,
    accent: '#10b981',
    desc: 'Ретро 8-битный замок, дракон и таинственные сундуки',
    emoji: '⚔️',
  },
  {
    id: '3d_cyber_pet',
    name: '3D Неоновый Питомец',
    wallpaper: teen3dCyberPetImg,
    accent: '#06b6d4',
    desc: 'Мультяшный робо-киберкот с неоновыми наушниками',
    emoji: '🤖',
  },
];

export const ICON_STYLES = [
  { id: 'cyber' as IconStyle, name: 'Киберпанк', desc: 'Тёмный неоновый глянец', emoji: '⚡' },
  { id: 'cartoon' as IconStyle, name: 'Мультяшный', desc: 'Яркие поп-иконки с 3D-рамкой', emoji: '🎨' },
  { id: 'bubble' as IconStyle, name: 'Стеклянные пузыри', desc: 'Полупрозрачный глассморфизм', emoji: '🫧' },
  { id: 'classic' as IconStyle, name: 'Классика', desc: 'Строгий плоский стиль', emoji: '💻' },
];

const CURATED_PALETTE = [
  '#00d2ff',
  '#ff007f',
  '#8b5cf6',
  '#00f5d4',
  '#f59e0b',
  '#ff5400',
  '#10b981',
  '#ec4899',
  '#70e000',
  '#a855f7',
];

const WALLPAPER_STORAGE_KEY = 'windows10_wallpaper';
const ACCENT_STORAGE_KEY = 'windows10_accent';
const ICON_STYLE_STORAGE_KEY = 'windows10_icon_style';

export const WindowsLaptopSimulator: React.FC<WindowsLaptopSimulatorProps> = ({
  isOpen,
  onClose,
  onStartMarieLevel,
  progress,
  onOpenPortfolio,
  hasObservedStreet,
  currentDesign,
  onTestDesign,
  versionNumber = 1,
}) => {
  const [selectedEmailId, setSelectedEmailId] = useState<string>('marie_order');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [emailNudgeActive, setEmailNudgeActive] = useState<boolean>(false);

  // Designer Handbook Page State (1, 2, 3)
  const [bookPage, setBookPage] = useState<number>(1);

  // Booting animation state
  const [isBooting, setIsBooting] = useState<boolean>(true);
  const [bootStep, setBootStep] = useState<number>(1);

  // Wallpaper state with persistence
  const [currentWallpaper, setCurrentWallpaper] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(WALLPAPER_STORAGE_KEY);
      if (saved) return saved;
    } catch {
      // ignore
    }
    return THEME_PRESETS[0].wallpaper;
  });

  // Personalization accent color
  const [accentColor, setAccentColor] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(ACCENT_STORAGE_KEY);
      if (saved) return saved;
    } catch {
      // ignore
    }
    return THEME_PRESETS[0].accent;
  });

  // Icon style state with persistence
  const [iconStyle, setIconStyle] = useState<IconStyle>(() => {
    try {
      const saved = localStorage.getItem(ICON_STYLE_STORAGE_KEY);
      if (saved && ['cyber', 'cartoon', 'bubble', 'classic'].includes(saved)) {
        return saved as IconStyle;
      }
    } catch {
      // ignore
    }
    return 'cyber';
  });

  const wallpaperFileInputRef = useRef<HTMLInputElement>(null);
  const desktopRef = useRef<HTMLDivElement>(null);

  const isBakeryCompleted = progress.completedModules.includes('bakery_marie');

  // WINDOW SYSTEM STATE (All 5 apps as draggable, minimizable, maximizable windows)
  const [maxZIndex, setMaxZIndex] = useState<number>(100);
  const [activeAppId, setActiveAppId] = useState<AppId | null>(
    hasObservedStreet ? 'canvas' : 'mail'
  );

  const [windows, setWindows] = useState<Record<AppId, WindowMeta>>(() => ({
    canvas: {
      id: 'canvas',
      title: 'Холст Дизайнера • Разработка вывески',
      icon: <Paintbrush className="w-4 h-4 text-pink-500" />,
      isOpen: !!hasObservedStreet,
      isMinimized: false,
      isMaximized: false,
      zIndex: hasObservedStreet ? 100 : 10,
      initialPos: { x: 35, y: 15 },
      initialSize: { width: '88%', height: '84%' },
    },
    mail: {
      id: 'mail',
      title: 'Почта • Входящие письма',
      icon: <Mail className="w-4 h-4 text-amber-500" />,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: hasObservedStreet ? 10 : 100,
      initialPos: { x: 50, y: 25 },
      initialSize: { width: '82%', height: '80%' },
    },
    book: {
      id: 'book',
      title: 'Книга Дизайна • Обучающее руководство',
      icon: <BookOpen className="w-4 h-4 text-amber-500" />,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 15,
      initialPos: { x: 65, y: 30 },
      initialSize: { width: '78%', height: '80%' },
    },
    portfolio: {
      id: 'portfolio',
      title: 'Проводник • Портфолио проектов',
      icon: <Folder className="w-4 h-4 text-amber-500 fill-current" />,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 12,
      initialPos: { x: 80, y: 35 },
      initialSize: { width: '75%', height: '78%' },
    },
    settings: {
      id: 'settings',
      title: 'Параметры • Темы и стиль интерфейса',
      icon: <Palette className="w-4 h-4 text-indigo-500" />,
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      zIndex: 14,
      initialPos: { x: 95, y: 40 },
      initialSize: { width: '76%', height: '78%' },
    },
  }));

  // Window Management Actions
  const openApp = (id: AppId) => {
    soundEngine.playPop();
    setMaxZIndex((prev) => {
      const nextZ = prev + 1;
      setWindows((prevWin) => ({
        ...prevWin,
        [id]: {
          ...prevWin[id],
          isOpen: true,
          isMinimized: false,
          zIndex: nextZ,
        },
      }));
      return nextZ;
    });
    setActiveAppId(id);
  };

  const focusApp = (id: AppId) => {
    setMaxZIndex((prev) => {
      const nextZ = prev + 1;
      setWindows((prevWin) => ({
        ...prevWin,
        [id]: {
          ...prevWin[id],
          isMinimized: false,
          zIndex: nextZ,
        },
      }));
      return nextZ;
    });
    setActiveAppId(id);
  };

  const minimizeApp = (id: AppId) => {
    soundEngine.playPop();
    setWindows((prevWin) => {
      const updated = {
        ...prevWin,
        [id]: {
          ...prevWin[id],
          isMinimized: true,
        },
      };
      const remaining = Object.values(updated).filter((w) => w.isOpen && !w.isMinimized);
      if (remaining.length > 0) {
        remaining.sort((a, b) => b.zIndex - a.zIndex);
        setActiveAppId(remaining[0].id);
      } else {
        setActiveAppId(null);
      }
      return updated;
    });
  };

  const toggleMaximizeApp = (id: AppId) => {
    soundEngine.playPop();
    setWindows((prevWin) => ({
      ...prevWin,
      [id]: {
        ...prevWin[id],
        isMaximized: !prevWin[id].isMaximized,
      },
    }));
    focusApp(id);
  };

  const closeApp = (id: AppId) => {
    soundEngine.playClick();
    setWindows((prevWin) => {
      const updated = {
        ...prevWin,
        [id]: {
          ...prevWin[id],
          isOpen: false,
          isMinimized: false,
          isMaximized: false,
        },
      };
      const remaining = Object.values(updated).filter((w) => w.isOpen && !w.isMinimized);
      if (remaining.length > 0) {
        remaining.sort((a, b) => b.zIndex - a.zIndex);
        setActiveAppId(remaining[0].id);
      } else {
        setActiveAppId(null);
      }
      return updated;
    });
  };

  const handleDockIconClick = (id: AppId) => {
    soundEngine.playClick();
    setIsStartMenuOpen(false);
    const win = windows[id];

    if (!win.isOpen) {
      openApp(id);
    } else if (win.isMinimized) {
      focusApp(id);
    } else if (activeAppId === id) {
      minimizeApp(id);
    } else {
      focusApp(id);
    }
  };

  const minimizeAll = () => {
    soundEngine.playClick();
    setWindows((prev) => {
      const updated = { ...prev };
      for (const key in updated) {
        updated[key as AppId] = {
          ...updated[key as AppId],
          isMinimized: true,
        };
      }
      return updated;
    });
    setActiveAppId(null);
  };

  // 5-second timer to nudge the child if they haven't clicked "Поехать к Марии"
  useEffect(() => {
    if (isOpen && activeAppId === 'mail' && selectedEmailId === 'marie_order' && windows.mail.isOpen && !windows.mail.isMinimized) {
      setEmailNudgeActive(false);
      const timer = setTimeout(() => {
        setEmailNudgeActive(true);
        soundEngine.playPop();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, activeAppId, selectedEmailId, windows.mail.isOpen, windows.mail.isMinimized]);

  // Bring canvas to front when opening laptop if user has observed street
  useEffect(() => {
    if (isOpen && hasObservedStreet) {
      openApp('canvas');
    }
  }, [isOpen, hasObservedStreet]);

  // Trigger boot sequence whenever laptop is opened
  useEffect(() => {
    if (isOpen) {
      setIsBooting(true);
      setBootStep(1);
      soundEngine.playPop();

      const timer1 = setTimeout(() => setBootStep(2), 650);
      const timer2 = setTimeout(() => setBootStep(3), 1350);
      const timer3 = setTimeout(() => {
        setIsBooting(false);
        soundEngine.playSuccess();
      }, 2050);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
      setCurrentDate(
        now.toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      );
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleApplyTheme = (theme: ThemePreset) => {
    soundEngine.playSuccess();
    setCurrentWallpaper(theme.wallpaper);
    setAccentColor(theme.accent);
    try {
      localStorage.setItem(WALLPAPER_STORAGE_KEY, theme.wallpaper);
      localStorage.setItem(ACCENT_STORAGE_KEY, theme.accent);
    } catch {
      // ignore
    }
  };

  const handleSelectIconStyle = (style: IconStyle) => {
    soundEngine.playPop();
    setIconStyle(style);
    try {
      localStorage.setItem(ICON_STYLE_STORAGE_KEY, style);
    } catch {
      // ignore
    }
  };

  const handleCustomWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          soundEngine.playPop();
          setCurrentWallpaper(result);
          try {
            localStorage.setItem(WALLPAPER_STORAGE_KEY, result);
          } catch {
            // ignore
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const renderDesktopIconContainer = (bgGradient: string, iconNode: React.ReactNode, badge?: React.ReactNode) => {
    if (iconStyle === 'cartoon') {
      return (
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border-4 border-amber-300 shadow-[0_8px_20px_rgba(0,0,0,0.3)] flex items-center justify-center text-slate-800 transform group-hover:scale-110 group-hover:rotate-3 transition-transform">
          {iconNode}
          {badge}
        </div>
      );
    }

    if (iconStyle === 'bubble') {
      return (
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(31,38,135,0.37)] flex items-center justify-center text-white transform group-hover:scale-110 transition-transform">
          {iconNode}
          {badge}
        </div>
      );
    }

    if (iconStyle === 'classic') {
      return (
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-800 border border-slate-600 shadow-md flex items-center justify-center text-white transform group-hover:scale-105 transition-transform">
          {iconNode}
          {badge}
        </div>
      );
    }

    return (
      <div
        style={{ background: bgGradient }}
        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white shadow-[0_10px_25px_rgba(0,0,0,0.5)] border border-white/30 transform group-hover:scale-110 transition-transform"
      >
        {iconNode}
        {badge}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn select-none">
      {/* LAPTOP OUTER SHASSIS FRAME */}
      <div className="relative w-full max-w-6xl h-[92vh] max-h-[820px] bg-[#1a1d24] rounded-[28px] sm:rounded-[36px] p-3 sm:p-5 shadow-[0_30px_90px_rgba(0,0,0,0.9),0_0_0_2px_rgba(255,255,255,0.08)] flex flex-col overflow-hidden border border-slate-700/60">
        
        {/* TOP SCREEN BEZEL & WEBCAM */}
        <div className="h-5 sm:h-6 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-700" />
            <span className="w-2 h-2 rounded-full bg-slate-700" />
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-0.5 rounded-full border border-slate-700/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase">
              HD CAMERA
            </span>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="text-xs font-extrabold text-slate-400 hover:text-white px-3 py-0.5 rounded-full bg-slate-800/80 hover:bg-rose-600 transition-colors cursor-pointer flex items-center gap-1.5"
            title="Закрыть ноутбук"
          >
            <span>Закрыть</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* SCREEN DISPLAY AREA */}
        <div
          style={{
            backgroundImage: `url('${currentWallpaper}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          className="relative flex-1 rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col border border-slate-800/80 shadow-inner"
        >
          {/* BOOTING SCREEN OVERLAY */}
          {isBooting && (
            <div className="absolute inset-0 z-50 bg-[#0d1117] flex flex-col items-center justify-center p-6 text-white text-center animate-fadeIn">
              <div className="mb-8 flex flex-col items-center gap-3">
                <div
                  style={{ backgroundColor: accentColor }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center text-3xl sm:text-4xl shadow-[0_0_35px_rgba(99,102,241,0.6)] animate-pulse"
                >
                  ⚡
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-2">
                  Spark OS v10.4
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Загрузка модулей студии и шрифтов...
                </p>
              </div>

              <div className="w-64 sm:w-80 h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/10 shadow-inner">
                <div
                  className="rainbow-neon-border h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(236,72,153,0.8)]"
                  style={{
                    width: bootStep === 1 ? '35%' : bootStep === 2 ? '78%' : '100%',
                  }}
                />
              </div>

              <button
                onClick={() => setIsBooting(false)}
                className="absolute bottom-5 right-5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Войти в систему ➔
              </button>
            </div>
          )}

          {/* DESKTOP WORKSPACE CONSTRAINED BOUNDS AREA */}
          <div
            ref={desktopRef}
            onContextMenu={(e) => {
              e.preventDefault();
              setContextMenuPos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
              setIsContextMenuOpen(true);
            }}
            onClick={() => {
              if (isContextMenuOpen) setIsContextMenuOpen(false);
            }}
            className="relative flex-1 p-4 sm:p-6 flex overflow-hidden"
          >
            {/* Desktop Shortcuts Column (Left Side) */}
            <div className="flex flex-col gap-4 sm:gap-5 z-10 w-28 sm:w-32">
              {/* Shortcut 1: Холст Дизайнера */}
              <button
                onClick={() => openApp('canvas')}
                className={`flex flex-col items-center p-2 rounded-2xl text-white text-center hover:bg-white/15 transition-all cursor-pointer group ${
                  hasObservedStreet ? 'ring-4 ring-pink-400 bg-pink-500/20 animate-pulse' : ''
                } ${windows.canvas.isOpen && !windows.canvas.isMinimized ? 'bg-white/20 ring-2 ring-white/50' : ''}`}
                title="Программа дизайна: Холст Дизайнера"
              >
                {renderDesktopIconContainer(
                  'linear-gradient(135deg, #ec4899, #f43f5e, #f59e0b)',
                  <Paintbrush className="w-8 h-8 sm:w-9 sm:h-9" />,
                  hasObservedStreet && (
                    <div className="absolute -top-1.5 -right-1.5 z-30 flex items-center justify-center pointer-events-none" title="Запусти холст!">
                      <span className="w-4 h-4 rounded-full bg-amber-400 animate-ping opacity-80" />
                    </div>
                  )
                )}
                <span className="text-xs sm:text-sm font-black mt-2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                  Холст Дизайнера
                </span>
              </button>

              {/* Shortcut 2: Почта */}
              <button
                onClick={() => openApp('mail')}
                className={`flex flex-col items-center p-2 rounded-2xl text-white text-center hover:bg-white/15 transition-all cursor-pointer group ${
                  windows.mail.isOpen && !windows.mail.isMinimized ? 'bg-white/20 ring-2 ring-white/50' : ''
                }`}
                title="Почта"
              >
                {renderDesktopIconContainer(
                  accentColor,
                  <Mail className="w-8 h-8 sm:w-9 sm:h-9" />,
                  !isBakeryCompleted && (
                    <div className="absolute -top-1.5 -right-1.5 z-30 flex items-center justify-center pointer-events-none" title="Новое письмо от Мари!">
                      <span className="relative w-6 h-6 rounded-full bg-rose-600 text-white font-black text-xs flex items-center justify-center shadow-[0_3px_10px_rgba(225,29,72,0.8)] border-2 border-white animate-bounce">
                        1
                      </span>
                      <span className="absolute w-6 h-6 rounded-full bg-rose-500 animate-ping opacity-75" />
                    </div>
                  )
                )}
                <span className="text-xs sm:text-sm font-black mt-2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                  Почта
                </span>
              </button>

              {/* Shortcut 3: Книга дизайна */}
              <button
                onClick={() => openApp('book')}
                className={`flex flex-col items-center p-2 rounded-2xl text-white text-center hover:bg-white/15 transition-all cursor-pointer group ${
                  windows.book.isOpen && !windows.book.isMinimized ? 'bg-white/20 ring-2 ring-white/50' : ''
                }`}
                title="Книга юного дизайнера"
              >
                {renderDesktopIconContainer(
                  'linear-gradient(135deg, #f59e0b, #d97706)',
                  <BookOpen className="w-8 h-8 sm:w-9 sm:h-9" />
                )}
                <span className="text-xs sm:text-sm font-black mt-2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                  Книга дизайна
                </span>
              </button>

              {/* Shortcut 4: Портфолио */}
              <button
                onClick={() => openApp('portfolio')}
                className={`flex flex-col items-center p-2 rounded-2xl text-white text-center hover:bg-white/15 transition-all cursor-pointer group ${
                  windows.portfolio.isOpen && !windows.portfolio.isMinimized ? 'bg-white/20 ring-2 ring-white/50' : ''
                }`}
                title="Папка Портфолио"
              >
                {renderDesktopIconContainer(
                  'linear-gradient(135deg, #10b981, #059669)',
                  <Folder className="w-8 h-8 sm:w-9 sm:h-9 text-amber-300 fill-current" />
                )}
                <span className="text-xs sm:text-sm font-black mt-2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                  Портфолио
                </span>
              </button>

              {/* Shortcut 5: Темы и стиль */}
              <button
                onClick={() => openApp('settings')}
                className={`flex flex-col items-center p-2 rounded-2xl text-white text-center hover:bg-white/15 transition-all cursor-pointer group ${
                  windows.settings.isOpen && !windows.settings.isMinimized ? 'bg-white/20 ring-2 ring-white/50' : ''
                }`}
                title="Темы и оформление"
              >
                {renderDesktopIconContainer(
                  'linear-gradient(135deg, #6366f1, #a855f7)',
                  <Palette className="w-8 h-8 sm:w-9 sm:h-9" />
                )}
                <span className="text-xs sm:text-sm font-black mt-2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                  Темы и стиль
                </span>
              </button>
            </div>

            {/* ALL 5 APPS OPEN AS INDEPENDENT WINDOWS */}

            {/* WINDOW 1: ХОЛСТ ДИЗАЙНЕРА */}
            <Window
              id="canvas"
              title="Холст Дизайнера • Создание вывески для Мари"
              icon={<Paintbrush className="w-4 h-4 text-pink-500" />}
              isOpen={windows.canvas.isOpen}
              isMinimized={windows.canvas.isMinimized}
              isMaximized={windows.canvas.isMaximized}
              isActive={activeAppId === 'canvas'}
              zIndex={windows.canvas.zIndex}
              accentColor={accentColor}
              initialPosition={windows.canvas.initialPos}
              initialSize={windows.canvas.initialSize}
              onClose={() => closeApp('canvas')}
              onMinimize={() => minimizeApp('canvas')}
              onMaximize={() => toggleMaximizeApp('canvas')}
              onFocus={() => focusApp('canvas')}
              boundsRef={desktopRef}
            >
              <CanvasEditor
                initialDesign={currentDesign || {
                  text: 'Кондитерская Мари',
                  subtext: 'Свежая выпечка каждый день',
                  fontSize: 28,
                  fontStyle: 'sweet',
                  shape: 'rounded',
                  icon: 'cupcake',
                  iconSize: 48,
                  bgColor: '#FEF3C7',
                  textColor: '#2A1B12',
                  borderColor: '#FDE047',
                  signWidth: 320,
                  signHeight: 120,
                  posX: 0,
                  posY: 0,
                }}
                onTestDesign={(design) => {
                  soundEngine.playTestStart();
                  onClose();
                  onTestDesign?.(design);
                }}
                versionNumber={versionNumber || 1}
                isWindowMode={true}
              />
            </Window>

            {/* WINDOW 2: ПОЧТА */}
            <Window
              id="mail"
              title="Почта • Входящие письма"
              icon={<Mail style={{ color: accentColor }} className="w-4 h-4" />}
              isOpen={windows.mail.isOpen}
              isMinimized={windows.mail.isMinimized}
              isMaximized={windows.mail.isMaximized}
              isActive={activeAppId === 'mail'}
              zIndex={windows.mail.zIndex}
              accentColor={accentColor}
              initialPosition={windows.mail.initialPos}
              initialSize={windows.mail.initialSize}
              onClose={() => closeApp('mail')}
              onMinimize={() => minimizeApp('mail')}
              onMaximize={() => toggleMaximizeApp('mail')}
              onFocus={() => focusApp('mail')}
              boundsRef={desktopRef}
            >
              <div className="w-full h-full flex flex-col bg-white overflow-hidden">
                <div className="flex-1 flex overflow-hidden">
                  <div className="w-64 sm:w-72 border-r border-slate-200 bg-[#fbfbfb] overflow-y-auto p-2 space-y-1.5 shrink-0">
                    <div className="px-2 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Входящие ({isBakeryCompleted ? '2' : '1'})
                    </div>

                    <div
                      onClick={() => {
                        soundEngine.playClick();
                        setSelectedEmailId('marie_order');
                      }}
                      className={`p-3 rounded-xl cursor-pointer transition-all border ${
                        selectedEmailId === 'marie_order'
                          ? 'bg-amber-50 border-amber-300 shadow-sm'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                          <span>🥐</span>
                          <span>Мари (Кондитер)</span>
                        </span>
                        {!isBakeryCompleted && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-black text-[10px] animate-pulse">
                            СРОЧНО
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-xs text-slate-800 line-clamp-1">
                        Спасите мою кондитерскую!
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        Прохожие пройдут мимо, если нет вывески...
                      </div>
                    </div>

                    <div
                      onClick={() => {
                        soundEngine.playClick();
                        setSelectedEmailId('spark_welcome');
                      }}
                      className={`p-3 rounded-xl cursor-pointer transition-all border ${
                        selectedEmailId === 'spark_welcome'
                          ? 'bg-amber-50 border-amber-300 shadow-sm'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          <span>⚡</span>
                          <span>Спарк</span>
                        </span>
                        <span className="text-[10px] text-slate-400">Вчера</span>
                      </div>
                      <div className="font-bold text-xs text-slate-800 line-clamp-1">
                        Добро пожаловать в студию!
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        Уроки дизайна, правила и вдохновение.
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 p-5 overflow-y-auto bg-white">
                    {selectedEmailId === 'marie_order' && (
                      <div className="space-y-4">
                        <div className="flex items-start gap-4 border-b border-slate-200 pb-4">
                          <MarieSprite emotion="worried" size="md" />
                          <div>
                            <h3 className="font-extrabold text-base text-slate-900">
                              Мари • Владелица уютной кондитерской
                            </h3>
                            <p className="text-xs text-slate-500">marie@sweet-bakery.city</p>
                            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                              Заказ: Разработка секретной вывески
                            </span>
                          </div>
                        </div>

                        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
                          <p>
                            Привет! Я открыла самую уютную кондитерскую в городе, но у меня большая беда: прохожие не видят моё заведение и проходят мимо! 😭
                          </p>
                          <p>
                            Мне очень нужна вывеска, которую видно издалека! Спарк сказал, что ты лучшая студия дизайна в городе.
                          </p>
                        </div>

                        <div className="pt-2">
                          <button
                            onClick={() => {
                              soundEngine.playSuccess();
                              onClose();
                              onStartMarieLevel();
                            }}
                            className={`w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                              emailNudgeActive ? 'ring-4 ring-amber-300 animate-bounce' : ''
                            }`}
                          >
                            <span>Поехать к Мари и изучить улицу</span>
                            <ArrowRight className="w-4 h-4 stroke-[3]" />
                          </button>
                        </div>
                      </div>
                    )}

                    {selectedEmailId === 'spark_welcome' && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                          <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center text-2xl shadow-sm">
                            ⚡
                          </div>
                          <div>
                            <h3 className="font-bold text-base text-slate-900">
                              Спарк • Главный наставник
                            </h3>
                            <p className="text-xs text-slate-500">spark@design.city</p>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          Поздравляю с открытием собственной дизайн-студии! 🎉 Здесь ты будешь принимать заказы от жителей города, проводить визуальные исследования и тестировать свои работы прямо на улицах города.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Window>

            {/* WINDOW 3: КНИГА ДИЗАЙНА */}
            <Window
              id="book"
              title="Книга Дизайна • Обучающее руководство"
              icon={<BookOpen className="w-4 h-4 text-amber-500" />}
              isOpen={windows.book.isOpen}
              isMinimized={windows.book.isMinimized}
              isMaximized={windows.book.isMaximized}
              isActive={activeAppId === 'book'}
              zIndex={windows.book.zIndex}
              accentColor={accentColor}
              initialPosition={windows.book.initialPos}
              initialSize={windows.book.initialSize}
              onClose={() => closeApp('book')}
              onMinimize={() => minimizeApp('book')}
              onMaximize={() => toggleMaximizeApp('book')}
              onFocus={() => focusApp('book')}
              boundsRef={desktopRef}
            >
              <div className="w-full h-full flex flex-col bg-[#fdfbf7] overflow-hidden">
                <div className="px-6 py-2.5 bg-amber-100/60 border-b border-amber-200 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        soundEngine.playPop();
                        setBookPage(1);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        bookPage === 1 ? 'bg-amber-600 text-white shadow-sm' : 'bg-white/80 text-amber-900'
                      }`}
                    >
                      1. Правило 1.5 секунды
                    </button>
                    <button
                      onClick={() => {
                        soundEngine.playPop();
                        setBookPage(2);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        bookPage === 2 ? 'bg-amber-600 text-white shadow-sm' : 'bg-white/80 text-amber-900'
                      }`}
                    >
                      2. Форма и цвет
                    </button>
                    <button
                      onClick={() => {
                        soundEngine.playPop();
                        setBookPage(3);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        bookPage === 3 ? 'bg-amber-600 text-white shadow-sm' : 'bg-white/80 text-amber-900'
                      }`}
                    >
                      3. Знаки без слов
                    </button>
                  </div>
                  <span className="text-xs font-extrabold text-amber-800">
                    Страница {bookPage} из 3
                  </span>
                </div>

                <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-[#fffefc] to-[#faf6ed]">
                  {bookPage === 1 && (
                    <div className="max-w-3xl mx-auto space-y-5 animate-fadeIn">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center text-3xl shadow-md shrink-0">
                          ⚡
                        </div>
                        <div>
                          <h2 className="text-xl sm:text-2xl font-black text-amber-950">
                            Секрет 1.5 секунды и супер-контраст
                          </h2>
                          <p className="text-xs text-amber-800">
                            Как заставить любого прохожего мгновенно заметить вывеску
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-900 leading-relaxed">
                        Люди спешат по улице. У твоей вывески есть <strong className="text-amber-700 font-black">ровно 1.5 секунды</strong>, чтобы зацепить взгляд. Если текст не контрастный — вывеску никто не заметит!
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white border-2 border-emerald-400 shadow-md space-y-2">
                          <span className="text-xs font-black text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> ИДЕАЛЬНЫЙ КОНТРАСТ
                          </span>
                          <div className="h-20 rounded-xl bg-slate-900 flex items-center justify-center shadow-inner">
                            <span className="text-amber-300 font-black text-lg tracking-wider drop-shadow">
                              SWEET MARIE 🥐
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">
                            Светлые тёплые буквы на тёмном фоне считываются мозгом моментально!
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-white border-2 border-rose-300 shadow-md space-y-2">
                          <span className="text-xs font-black text-rose-600 flex items-center gap-1">
                            <X className="w-4 h-4 text-rose-500" /> ОШИБКА НОВИЧКА
                          </span>
                          <div className="h-20 rounded-xl bg-yellow-100 flex items-center justify-center border border-yellow-200">
                            <span className="text-yellow-300 font-light text-base tracking-tight">
                              Круассаны и десерты
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">
                            Жёлтый на белом сливается на солнце, прохожие не видят надпись.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {bookPage === 2 && (
                    <div className="max-w-3xl mx-auto space-y-5 animate-fadeIn">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-purple-500 text-white flex items-center justify-center text-3xl shadow-md shrink-0">
                          🎨
                        </div>
                        <div>
                          <h2 className="text-xl sm:text-2xl font-black text-purple-950">
                            Магия формы и цвета
                          </h2>
                          <p className="text-xs text-purple-800">
                            Форма рассказывает историю ещё до прочтения слов
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-2xl bg-white border border-purple-200 shadow-sm space-y-2 text-center">
                          <div className="w-12 h-12 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-2xl shadow-xs">
                            ☁️
                          </div>
                          <h4 className="font-black text-xs text-slate-900">Облако и Блобы</h4>
                          <p className="text-[11px] text-slate-600">
                            Ассоциируются со сладостями, выпечкой, уютом и радостью.
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-white border border-purple-200 shadow-sm space-y-2 text-center">
                          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl shadow-xs">
                            ⬭
                          </div>
                          <h4 className="font-black text-xs text-slate-900">Овал и Круг</h4>
                          <p className="text-[11px] text-slate-600">
                            Гармония, дружелюбие, мягкие формы привлекают взгляд.
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-white border border-purple-200 shadow-sm space-y-2 text-center">
                          <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl shadow-xs">
                            ▬
                          </div>
                          <h4 className="font-black text-xs text-slate-900">Прямоугольник</h4>
                          <p className="text-[11px] text-slate-600">
                            Строгость, точность, надежность и стиль.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {bookPage === 3 && (
                    <div className="max-w-3xl mx-auto space-y-5 animate-fadeIn">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-3xl shadow-md shrink-0">
                          🥐
                        </div>
                        <div>
                          <h2 className="text-xl sm:text-2xl font-black text-emerald-950">
                            Специконки: Знаки без слов
                          </h2>
                          <p className="text-xs text-emerald-800">
                            Одна иконка заменит тысячу слов в шуме города
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-900 leading-relaxed">
                        Когда человек идёт по улице, он сначала видит <strong className="text-emerald-800 font-bold">иконку-символ</strong> (круассан, кексик, кофе), и только потом читает название!
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-6 py-3 bg-[#fbf5e8] border-t border-amber-200 flex items-center justify-between shrink-0">
                  <button
                    disabled={bookPage <= 1}
                    onClick={() => {
                      soundEngine.playPop();
                      setBookPage((p) => Math.max(1, p - 1));
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                      bookPage <= 1 ? 'opacity-40 cursor-default text-slate-400' : 'bg-white text-amber-900 border border-amber-200 shadow-xs cursor-pointer'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" /> Назад
                  </button>

                  <div className="flex items-center gap-2">
                    {[1, 2, 3].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          soundEngine.playPop();
                          setBookPage(num);
                        }}
                        className={`w-7 h-7 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          bookPage === num ? 'bg-amber-600 text-white shadow-sm' : 'bg-white text-amber-800'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={bookPage >= 3}
                    onClick={() => {
                      soundEngine.playPop();
                      setBookPage((p) => Math.min(3, p + 1));
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
                      bookPage >= 3 ? 'opacity-40 cursor-default text-slate-400' : 'bg-amber-600 text-white shadow-sm cursor-pointer'
                    }`}
                  >
                    Вперёд <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Window>

            {/* WINDOW 4: ПОРТФОЛИО */}
            <Window
              id="portfolio"
              title="Проводник • Портфолио выполненных работ"
              icon={<Folder className="w-4 h-4 text-amber-500 fill-current" />}
              isOpen={windows.portfolio.isOpen}
              isMinimized={windows.portfolio.isMinimized}
              isMaximized={windows.portfolio.isMaximized}
              isActive={activeAppId === 'portfolio'}
              zIndex={windows.portfolio.zIndex}
              accentColor={accentColor}
              initialPosition={windows.portfolio.initialPos}
              initialSize={windows.portfolio.initialSize}
              onClose={() => closeApp('portfolio')}
              onMinimize={() => minimizeApp('portfolio')}
              onMaximize={() => toggleMaximizeApp('portfolio')}
              onFocus={() => focusApp('portfolio')}
              boundsRef={desktopRef}
            >
              <div className="w-full h-full p-6 overflow-y-auto bg-white">
                {progress.portfolio ? (
                  <div className="max-w-xl mx-auto p-5 rounded-2xl bg-amber-50/90 border border-amber-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-amber-900">
                        {progress.portfolio.title}
                      </span>
                      <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
                        Завершено
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {progress.portfolio.task}
                    </p>
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-700 bg-white p-3 rounded-xl border border-amber-100">
                      <div>
                        Было замечено: <span className="text-rose-600">{progress.portfolio.beforeNoticed}</span>
                      </div>
                      <div>➔</div>
                      <div>
                        Стало: <span className="text-emerald-600 text-sm font-black">{progress.portfolio.afterNoticed}</span> из 10
                      </div>
                    </div>
                    {onOpenPortfolio && (
                      <button
                        onClick={() => {
                          soundEngine.playClick();
                          onClose();
                          onOpenPortfolio();
                        }}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        Открыть полный кейс
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl mb-3">
                      📁
                    </div>
                    <h4 className="font-bold text-base text-slate-800 mb-1">
                      Папка «Портфолио» пуста
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm">
                      Откройте почту или Холст дизайна, чтобы разработать первую вывеску!
                    </p>
                  </div>
                )}
              </div>
            </Window>

            {/* WINDOW 5: ПАРАМЕТРЫ И ТЕМЫ */}
            <Window
              id="settings"
              title="Параметры • Темы оформления и стили иконок"
              icon={<Palette style={{ color: accentColor }} className="w-4 h-4" />}
              isOpen={windows.settings.isOpen}
              isMinimized={windows.settings.isMinimized}
              isMaximized={windows.settings.isMaximized}
              isActive={activeAppId === 'settings'}
              zIndex={windows.settings.zIndex}
              accentColor={accentColor}
              initialPosition={windows.settings.initialPos}
              initialSize={windows.settings.initialSize}
              onClose={() => closeApp('settings')}
              onMinimize={() => minimizeApp('settings')}
              onMaximize={() => toggleMaximizeApp('settings')}
              onFocus={() => focusApp('settings')}
              boundsRef={desktopRef}
            >
              <div className="w-full h-full p-6 overflow-y-auto space-y-6 bg-[#f8f9fc]">
                {/* Section 1: Icon Style Selection */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>Стиль иконок рабочего стола</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {ICON_STYLES.map((st) => {
                      const isSelected = iconStyle === st.id;
                      return (
                        <div
                          key={st.id}
                          onClick={() => handleSelectIconStyle(st.id)}
                          className={`p-3.5 rounded-2xl border-2 transition-colors cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-indigo-50 border-indigo-600 shadow-sm ring-2 ring-indigo-400/40'
                              : 'bg-white border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{st.emoji}</span>
                            {isSelected && (
                              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-black text-xs text-slate-900">{st.name}</div>
                            <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{st.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section 2: Custom Color Palette */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
                    <Pipette className="w-4 h-4 text-indigo-600" />
                    <span>Палитра акцентного цвета (панель, плитки, кнопки)</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    {CURATED_PALETTE.map((col) => (
                      <button
                        key={col}
                        onClick={() => {
                          soundEngine.playPop();
                          setAccentColor(col);
                          try {
                            localStorage.setItem(ACCENT_STORAGE_KEY, col);
                          } catch {}
                        }}
                        style={{ backgroundColor: col }}
                        className={`w-9 h-9 rounded-full shadow transition-colors cursor-pointer flex items-center justify-center ${
                          accentColor.toLowerCase() === col.toLowerCase()
                            ? 'ring-4 ring-slate-900/40 shadow-lg'
                            : 'opacity-90 hover:opacity-100'
                        }`}
                      >
                        {accentColor.toLowerCase() === col.toLowerCase() && (
                          <Check className="w-4 h-4 text-white stroke-[3]" />
                        )}
                      </button>
                    ))}

                    <label
                      className="px-3.5 py-1.5 rounded-full bg-white border border-slate-300 hover:border-indigo-400 text-slate-700 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                      title="Выбрать свой уникальный цвет"
                    >
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => {
                          setAccentColor(e.target.value);
                          try {
                            localStorage.setItem(ACCENT_STORAGE_KEY, e.target.value);
                          } catch {}
                        }}
                        className="w-5 h-5 rounded cursor-pointer border-0 p-0"
                      />
                      <span>Свой цвет</span>
                    </label>
                  </div>
                </div>

                {/* Section 3: Wallpaper Themes */}
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-2">
                    <Sun className="w-4 h-4 text-indigo-600" />
                    <span>Крутые обои для рабочего стола</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {THEME_PRESETS.map((t) => {
                      const isActiveTheme = currentWallpaper === t.wallpaper && accentColor === t.accent;
                      return (
                        <div
                          key={t.id}
                          onClick={() => handleApplyTheme(t)}
                          className={`group p-3 rounded-2xl bg-white border-2 transition-colors cursor-pointer shadow-sm hover:shadow-md ${
                            isActiveTheme
                              ? 'border-indigo-600 ring-2 ring-indigo-400/40'
                              : 'border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          <div className="h-32 rounded-xl overflow-hidden relative mb-2.5 shadow-inner bg-slate-100">
                            <img
                              src={t.wallpaper}
                              alt={t.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <div
                              style={{ backgroundColor: t.accent }}
                              className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-black text-white shadow"
                            >
                              Акцент
                            </div>
                            {isActiveTheme && (
                              <div className="absolute inset-0 bg-indigo-900/35 backdrop-blur-xs flex items-center justify-center">
                                <span className="px-3.5 py-1.5 rounded-full bg-white text-indigo-950 font-black text-xs shadow-lg flex items-center gap-1.5 border border-indigo-200">
                                  <Check className="w-4 h-4 stroke-[3] text-indigo-600" />
                                  <span>Установлено</span>
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                            <span>{t.emoji}</span>
                            <span>{t.name}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{t.desc}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Wallpaper Upload */}
                <div className="pt-4 border-t border-slate-200 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => wallpaperFileInputRef.current?.click()}
                    className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl font-bold text-xs shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Upload style={{ color: accentColor }} className="w-4 h-4" />
                    <span>Загрузить своё фото для фона</span>
                  </button>
                  <span className="text-xs text-slate-500">
                    Любое изображение JPG / PNG
                  </span>
                  <input
                    type="file"
                    ref={wallpaperFileInputRef}
                    onChange={handleCustomWallpaperUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
            </Window>

          </div>

          {/* DESKTOP CONTEXT MENU (RIGHT CLICK) */}
          {isContextMenuOpen && (
            <div
              style={{
                top: contextMenuPos.y,
                left: contextMenuPos.x,
              }}
              className="absolute z-50 w-60 bg-[#f2f2f2] border border-slate-300 rounded-xl shadow-2xl py-1 text-xs text-slate-800"
            >
              <div
                onClick={() => {
                  soundEngine.playClick();
                  setIsContextMenuOpen(false);
                }}
                className="px-4 py-2 hover:bg-[#91c9f7] cursor-pointer"
              >
                Обновить
              </div>
              <div className="h-px bg-slate-300 my-1" />
              <div
                onClick={() => {
                  openApp('canvas');
                  setIsContextMenuOpen(false);
                }}
                className="px-4 py-2 hover:bg-[#91c9f7] cursor-pointer font-bold flex items-center gap-2"
              >
                <Paintbrush className="w-4 h-4 text-pink-600" />
                <span>Открыть Холст Дизайна</span>
              </div>
              <div
                onClick={() => {
                  openApp('settings');
                  setIsContextMenuOpen(false);
                }}
                className="px-4 py-2 hover:bg-[#91c9f7] cursor-pointer font-bold flex items-center gap-2"
              >
                <Palette style={{ color: accentColor }} className="w-4 h-4" />
                <span>Темы и стили иконок</span>
              </div>
            </div>
          )}

          {/* START MENU (ПУСК) */}
          {isStartMenuOpen && (
            <div className="absolute bottom-14 sm:bottom-16 left-0 z-50 w-[480px] sm:w-[560px] max-h-[560px] bg-[#141923]/98 backdrop-blur-2xl border border-slate-600/80 shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex text-white select-none animate-scaleIn rounded-tr-2xl overflow-hidden">
              {/* Leftmost narrow column: Power, Settings */}
              <div className="w-14 bg-black/50 flex flex-col justify-between py-4 items-center border-r border-white/10">
                <div
                  style={{ backgroundColor: accentColor }}
                  className="w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-sm shadow-md"
                >
                  ⚡
                </div>
                <div className="flex flex-col gap-4 text-slate-400">
                  <button
                    onClick={() => {
                      openApp('settings');
                      setIsStartMenuOpen(false);
                    }}
                    className="p-2.5 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                    title="Темы оформления"
                  >
                    <Palette className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setIsStartMenuOpen(false);
                      onClose();
                    }}
                    className="p-2.5 hover:text-rose-400 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
                    title="Закрыть ноутбук"
                  >
                    <Power className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Middle column: All Apps */}
              <div className="w-52 p-4 overflow-y-auto text-xs sm:text-sm space-y-2 border-r border-white/10">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  Программы студии
                </span>
                <button
                  onClick={() => {
                    openApp('canvas');
                    setIsStartMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 rounded-xl text-left transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-pink-500 to-rose-500 flex items-center justify-center text-white shadow-sm">
                    <Paintbrush className="w-4 h-4" />
                  </div>
                  <span className="truncate font-black">Холст дизайна</span>
                </button>
                <button
                  onClick={() => {
                    openApp('mail');
                    setIsStartMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 rounded-xl text-left transition-colors cursor-pointer"
                >
                  <div
                    style={{ backgroundColor: accentColor }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm"
                  >
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <span className="truncate font-black">Почта</span>
                </button>
                <button
                  onClick={() => {
                    openApp('book');
                    setIsStartMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 rounded-xl text-left transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-white shadow-sm">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="truncate font-black">Книга дизайна</span>
                </button>
                <button
                  onClick={() => {
                    openApp('portfolio');
                    setIsStartMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 rounded-xl text-left transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-sm">
                    <Folder className="w-4 h-4 fill-current" />
                  </div>
                  <span className="truncate font-black">Портфолио</span>
                </button>
                <button
                  onClick={() => {
                    openApp('settings');
                    setIsStartMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 rounded-xl text-left transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center text-white shadow-sm">
                    <Palette className="w-4 h-4" />
                  </div>
                  <span className="truncate font-black">Параметры</span>
                </button>
              </div>

              {/* Right column: Live Tiles */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  Быстрый доступ
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <div
                    onClick={() => {
                      openApp('canvas');
                      setIsStartMenuOpen(false);
                    }}
                    className="p-3 rounded-2xl bg-gradient-to-br from-pink-600 to-rose-700 cursor-pointer hover:scale-105 transition-all shadow-md flex flex-col justify-between h-24"
                  >
                    <Paintbrush className="w-6 h-6 text-white" />
                    <div>
                      <div className="font-black text-xs text-white">Холст</div>
                      <div className="text-[10px] text-pink-200">Вывески v3.0</div>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      openApp('mail');
                      setIsStartMenuOpen(false);
                    }}
                    style={{ backgroundColor: accentColor }}
                    className="p-3 rounded-2xl cursor-pointer hover:scale-105 transition-all shadow-md flex flex-col justify-between h-24"
                  >
                    <Mail className="w-6 h-6 text-white" />
                    <div>
                      <div className="font-black text-xs text-white">Почта</div>
                      <div className="text-[10px] text-white/80">
                        {isBakeryCompleted ? '2 сообщения' : 'Заказ от Мари'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DOCK / TASKBAR (5 APPS + SYSTEM TRAY) */}
          <div className="h-12 sm:h-14 bg-[#10141d]/90 backdrop-blur-xl border-t border-white/15 flex items-center justify-between px-2 sm:px-4 z-40 select-none shrink-0">
            <div className="flex items-center h-full gap-1 sm:gap-2">
              {/* Start Button (Пуск) */}
              <button
                onClick={() => {
                  soundEngine.playPop();
                  setIsStartMenuOpen(!isStartMenuOpen);
                }}
                style={{
                  backgroundColor: isStartMenuOpen ? accentColor : undefined,
                }}
                className={`h-10 sm:h-11 px-3 sm:px-4 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  isStartMenuOpen ? 'text-white shadow-lg' : 'hover:bg-white/10 text-slate-300'
                }`}
                title="Пуск (Все приложения)"
              >
                <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                  <span className="bg-current rounded-[1px]" />
                  <span className="bg-current rounded-[1px]" />
                  <span className="bg-current rounded-[1px]" />
                  <span className="bg-current rounded-[1px]" />
                </div>
              </button>

              {/* Taskbar Search Input */}
              <div className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl border border-white/10 text-xs text-slate-300 w-44 transition-colors">
                <Search className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">Поиск программ...</span>
              </div>

              {/* TASKBAR DOCK APPS (All 5 Apps) */}
              <div className="flex items-center h-full ml-1 sm:ml-2">
                {/* 1. Canvas Dock Icon */}
                <button
                  onClick={() => handleDockIconClick('canvas')}
                  className={`relative w-12 sm:w-14 h-full flex items-center justify-center transition-colors cursor-pointer ${
                    activeAppId === 'canvas' && !windows.canvas.isMinimized
                      ? 'bg-white/20 border-b-4 border-pink-500'
                      : windows.canvas.isOpen
                      ? 'bg-white/10 border-b-2 border-pink-400'
                      : 'hover:bg-white/10'
                  }`}
                  title="Холст дизайна"
                >
                  <Paintbrush className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
                  {windows.canvas.isMinimized && (
                    <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-amber-400 animate-ping shadow" />
                  )}
                </button>

                {/* 2. Mail Dock Icon */}
                <button
                  onClick={() => handleDockIconClick('mail')}
                  className={`relative w-12 sm:w-14 h-full flex items-center justify-center transition-colors cursor-pointer ${
                    activeAppId === 'mail' && !windows.mail.isMinimized
                      ? 'bg-white/20 border-b-4'
                      : windows.mail.isOpen
                      ? 'bg-white/10 border-b-2'
                      : 'hover:bg-white/10'
                  }`}
                  style={{
                    borderColor: (activeAppId === 'mail' || windows.mail.isOpen) ? accentColor : undefined,
                  }}
                  title="Почта"
                >
                  <Mail style={{ color: accentColor }} className="w-5 h-5 sm:w-6 sm:h-6" />
                  {windows.mail.isMinimized && (
                    <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-rose-500 animate-ping shadow" />
                  )}
                  {!isBakeryCompleted && !windows.mail.isMinimized && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  )}
                </button>

                {/* 3. Book Dock Icon */}
                <button
                  onClick={() => handleDockIconClick('book')}
                  className={`relative w-12 sm:w-14 h-full flex items-center justify-center transition-colors cursor-pointer ${
                    activeAppId === 'book' && !windows.book.isMinimized
                      ? 'bg-white/20 border-b-4 border-amber-400'
                      : windows.book.isOpen
                      ? 'bg-white/10 border-b-2 border-amber-300'
                      : 'hover:bg-white/10'
                  }`}
                  title="Книга дизайна"
                >
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
                  {windows.book.isMinimized && (
                    <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-amber-400 animate-ping shadow" />
                  )}
                </button>

                {/* 4. Portfolio Dock Icon */}
                <button
                  onClick={() => handleDockIconClick('portfolio')}
                  className={`relative w-12 sm:w-14 h-full flex items-center justify-center transition-colors cursor-pointer ${
                    activeAppId === 'portfolio' && !windows.portfolio.isMinimized
                      ? 'bg-white/20 border-b-4 border-emerald-400'
                      : windows.portfolio.isOpen
                      ? 'bg-white/10 border-b-2 border-emerald-300'
                      : 'hover:bg-white/10'
                  }`}
                  title="Портфолио"
                >
                  <Folder className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 fill-current" />
                  {windows.portfolio.isMinimized && (
                    <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-ping shadow" />
                  )}
                </button>

                {/* 5. Settings Dock Icon */}
                <button
                  onClick={() => handleDockIconClick('settings')}
                  className={`relative w-12 sm:w-14 h-full flex items-center justify-center transition-colors cursor-pointer ${
                    activeAppId === 'settings' && !windows.settings.isMinimized
                      ? 'bg-white/20 border-b-4'
                      : windows.settings.isOpen
                      ? 'bg-white/10 border-b-2'
                      : 'hover:bg-white/10'
                  }`}
                  style={{
                    borderColor: (activeAppId === 'settings' || windows.settings.isOpen) ? accentColor : undefined,
                  }}
                  title="Темы и стиль"
                >
                  <Palette style={{ color: accentColor }} className="w-5 h-5 sm:w-6 sm:h-6" />
                  {windows.settings.isMinimized && (
                    <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-indigo-400 animate-ping shadow" />
                  )}
                </button>
              </div>
            </div>

            {/* Right: System Tray & Clock */}
            <div className="flex items-center h-full text-white text-xs sm:text-sm">
              <div className="flex items-center gap-3 px-3 h-full cursor-default text-slate-300">
                <Wifi className="w-4 h-4 sm:w-5 sm:h-5" />
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              <div className="px-3 h-full flex items-center cursor-default font-bold text-slate-300">
                РУС
              </div>

              <div className="px-3.5 h-full flex flex-col justify-center items-center text-center leading-tight cursor-default">
                <span className="font-extrabold tracking-wider text-xs sm:text-sm">
                  {currentTime || '15:30'}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400">
                  {currentDate || '01.10.2026'}
                </span>
              </div>

              <div className="px-3 h-full flex items-center cursor-default text-slate-300">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              {/* Show Desktop / Minimize All Button */}
              <div
                onClick={minimizeAll}
                className="w-3 h-full hover:bg-white/40 border-l border-white/20 cursor-pointer transition-colors"
                title="Свернуть все окна (Показать рабочий стол)"
              />
            </div>
          </div>
        </div>

        {/* BOTTOM METALLIC CHASSIS CHIN */}
        <div className="h-3.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-white/10 flex items-center justify-between px-6 mt-1 text-[8px] text-slate-500 font-bold select-none shrink-0">
          <div className="flex items-center gap-1 opacity-40">
            <span className="w-1 h-1 rounded-full bg-slate-400" />
            <span className="w-1 h-1 rounded-full bg-slate-400" />
            <span className="w-1 h-1 rounded-full bg-slate-400" />
            <span className="w-1 h-1 rounded-full bg-slate-400" />
            <span className="w-1 h-1 rounded-full bg-slate-400" />
          </div>

          <span className="tracking-widest uppercase text-slate-400/70 font-black text-[8px]">
            SPARK PRO RETINA DISPLAY 120Hz
          </span>

          <div className="flex items-center gap-1 opacity-40">
            <span className="w-1 h-1 rounded-full bg-slate-400" />
            <span className="w-1 h-1 rounded-full bg-slate-400" />
            <span className="w-1 h-1 rounded-full bg-slate-400" />
            <span className="w-1 h-1 rounded-full bg-slate-400" />
            <span className="w-1 h-1 rounded-full bg-slate-400" />
          </div>
        </div>

      </div>
    </div>
  );
};

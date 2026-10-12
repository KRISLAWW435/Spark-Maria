export type GameScene =
  | 'studio'
  | 'intro_bakery'
  | 'street_observation'
  | 'brief'
  | 'canvas_editor'
  | 'fullscreen_editor'
  | 'laptop_simulator'
  | 'street_test'
  | 'test_results'
  | 'portfolio'
  | 'final_celebration';

export type AvatarShape =
  | 'circle'
  | 'oval'
  | 'blob_2'
  | 'polygon'
  | 'blob_15'
  | 'cloud'
  | 'summertime_sadness'
  | 'heart_2'
  | 'blob_11';

export type StudioFontSize = 'sm' | 'md' | 'lg';

export interface StudioData {
  name: string;
  avatar: string;
  avatarScale?: number;
  avatarOffsetY?: number;
  avatarOffsetX?: number;
  customAvatarUrl?: string | null;
  shape: AvatarShape;
  color: string;
  font: string;
  fontSize?: StudioFontSize;
  isCreated: boolean;
  decorations: string[];
}

export type MarieEmotion =
  | 'neutral'
  | 'worried'
  | 'thinking'
  | 'hopeful'
  | 'surprised'
  | 'confused'
  | 'embarrassed'
  | 'laughing'
  | 'disappointed'
  | 'excited'
  | 'happy'
  | 'proud';

export type SparkEmotion =
  | 'neutral'
  | 'happy'
  | 'thinking'
  | 'surprised'
  | 'laughing'
  | 'confused'
  | 'excited'
  | 'disappointed';

export type IconType = string;

export type FontStyle = 'sweet' | 'handwritten' | 'bold' | 'technical' | 'playful' | 'elegant';

export type ShapeType = 'rectangle' | 'rounded' | 'oval' | 'badge' | 'banner';

export interface SignIconItem {
  id: string;
  icon: string; // 'icon1'..'icon24'
  x: number; // percentage (0 to 100) inside sign layout
  y: number; // percentage (0 to 100) inside sign layout
  size: number; // size in px (e.g. 24, 36, 48, 64)
}

export interface SignDesign {
  background: string;
  text: string;
  font: string;
  textColor: string;
  icon: string; // primary icon (backward-compatible)
  icons?: SignIconItem[]; // freeform positioned icons on sign layout
  textAlign?: 'left' | 'center' | 'right';
  iconPosition?: 'left' | 'right' | 'top' | 'bottom';
  extraIconsCount?: number; // 0 to 4
  // backward-compatible fields:
  fontSize: number; // 12 - 48
  fontStyle: FontStyle;
  shape: ShapeType;
  iconSize: number; // 20 - 80
  bgColor: string;
  borderColor: string;
  signWidth: number; // 120 - 450 (px)
  signHeight: number; // 60 - 220 (px)
  posX: number; // offset percent from center
  posY: number; // offset percent
  subtext?: string;
  subtextSize?: number;
  subtextAlign?: 'left' | 'center' | 'right';
}

export interface PosterDesign {
  template: 'top' | 'center' | 'diagonal';
  title: string;
  subtitle: string;
  image: string; // any of 24 icons/characters
  cta: string;
  background: string;
}

export interface StickerItem {
  id: string;
  shape: 'circle' | 'oval' | 'cloud' | 'star';
  image: string; // any of 24
  color: string;
  text: string;
  position: { x: number; y: number }; // % inside zone
  targetZone?: 'window' | 'door' | 'windowL' | 'windowR';
}

export interface StickersDesign {
  stickers: StickerItem[];
}

export interface MariaOrders {
  order1: 'locked' | 'available' | 'in_progress' | 'completed';
  order2: 'locked' | 'available' | 'in_progress' | 'completed';
  order3: 'locked' | 'available' | 'in_progress' | 'completed';
  signDesign: SignDesign | null;
  posterDesign: PosterDesign | null;
  stickersDesign: StickersDesign | null;
}

export const ZONES = {
  sign:    { top: '3.2%', left: '8.0%', width: '84.0%', height: '21.0%' },
  door:    { top: '31.8%', left: '12.9%', width: '10.8%', height: '33.7%' },
  poster:  { top: '33.1%', left: '29.3%', width: '12.3%', height: '30.4%' },
  window:  { top: '26.6%', left: '45.3%', width: '44.3%', height: '41.1%' },
};

export interface VisitorReaction {
  visitorId: string;
  name: string;
  role: string;
  emotion: 'searching' | 'happy' | 'confused' | 'distracted' | 'amused' | 'interested';
  noticed: boolean;
  read: boolean;
  understood: boolean;
  entered: boolean;
  dialogueBubble: string;
  specialEvent?: 'chef_shrimp' | 'driver_tire' | 'plumber_wrench' | 'girl_cupcake' | 'tiny_sign' | 'huge_sign' | 'low_contrast';
}

export interface TestResult {
  versionNumber: number;
  signDesign: SignDesign;
  noticedCount: number;
  readCount: number;
  understoodCount: number;
  enteredCount: number;
  totalVisitors: number;
  visitorReactions: VisitorReaction[];
  sparkCommentary: string;
  educationalTakeaway: {
    title: string;
    concept: string;
    explanation: string;
    sparkAnalogy: string;
  };
  timestamp: number;
  orderNumber?: 1 | 2 | 3;
  posterDesign?: PosterDesign;
  stickersDesign?: StickersDesign;
}

export interface LocationState {
  id: string;
  title: string;
  subtitle: string;
  district: string;
  status: 'available' | 'in_progress' | 'completed' | 'locked';
  icon: string;
  requiredXp: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  orderNumber: 1 | 2 | 3;
  type: 'sign' | 'poster' | 'stickers';
  client: string;
  task: string;
  beforeNoticed: number;
  afterNoticed: number;
  versionsTested: number;
  finalDesign?: SignDesign;
  posterDesign?: PosterDesign;
  stickersDesign?: StickersDesign;
  completedAt: string;
  rating?: number;
}

export interface PlayerProgress {
  xp: number;
  coins: number;
  completedModules: string[];
  unlockedLocations: string[];
  savedVersions: TestResult[];
  finalDesign?: SignDesign;
  portfolio: {
    title: string;
    client: string;
    task: string;
    beforeNoticed: number;
    afterNoticed: number;
    versionsTested: number;
    finalDesign: SignDesign;
    completedAt: string;
  } | null;
  portfolioItems?: PortfolioItem[];
  mariaOrders?: MariaOrders;
  activeOrder?: 1 | 2 | 3;
}


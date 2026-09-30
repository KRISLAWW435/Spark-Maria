export type GameScene =
  | 'world_map'
  | 'intro_bakery'
  | 'street_observation'
  | 'brief'
  | 'canvas_editor'
  | 'street_test'
  | 'test_results'
  | 'portfolio'
  | 'final_celebration';

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

export type IconType = 'cupcake' | 'croissant' | 'shrimp' | 'tire' | 'wrench' | 'none';

export type FontStyle = 'sweet' | 'handwritten' | 'bold' | 'technical';

export type ShapeType = 'rectangle' | 'rounded' | 'oval' | 'badge' | 'banner';

export interface SignDesign {
  text: string;
  subtext: string;
  fontSize: number; // 12 - 48
  fontStyle: FontStyle;
  shape: ShapeType;
  icon: IconType;
  iconSize: number; // 20 - 80
  bgColor: string;
  textColor: string;
  borderColor: string;
  signWidth: number; // 120 - 450 (px)
  signHeight: number; // 60 - 220 (px)
  posX: number; // offset percent from center
  posY: number; // offset percent
}

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
}

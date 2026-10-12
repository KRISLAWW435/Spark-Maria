import { PlayerProgress, TestResult, SignDesign, MariaOrders, PosterDesign, StickersDesign, PortfolioItem } from '../types';

const STORAGE_KEY = 'spark_studio_save_v3';

export const defaultSignDesign: SignDesign = {
  background: '#FFF7ED',
  text: 'КОНДИТЕРСКАЯ МАРИ',
  font: 'sweet',
  textColor: '#2A1B12',
  icon: 'icon1',
  icons: [
    { id: 'icon-main', icon: 'icon1', x: 18, y: 50, size: 48 },
  ],
  subtext: '',
  subtextSize: 14,
  fontSize: 24,
  fontStyle: 'sweet',
  shape: 'rectangle',
  iconSize: 48,
  bgColor: '#FFF7ED',
  borderColor: '#E89038',
  signWidth: 280,
  signHeight: 110,
  posX: 0,
  posY: 0,
};

export const defaultPosterDesign: PosterDesign = {
  template: 'top',
  title: 'СВЕЖИЕ ЭКЛЕРЫ!',
  subtitle: 'Каждое утро с 8:00',
  image: 'icon12',
  cta: 'Заходи!',
  background: '#FFF1F2',
};

export const defaultStickersDesign: StickersDesign = {
  stickers: [
    {
      id: 'stk-1',
      shape: 'cloud',
      image: 'icon1',
      color: '#FEF3C7',
      text: 'Свежее',
      position: { x: 30, y: 35 },
      targetZone: 'windowL',
    },
    {
      id: 'stk-2',
      shape: 'star',
      image: 'icon2',
      color: '#FCE7F3',
      text: 'Уют',
      position: { x: 65, y: 45 },
      targetZone: 'windowR',
    },
  ],
};

export const defaultMariaOrders: MariaOrders = {
  order1: 'available',
  order2: 'locked',
  order3: 'locked',
  signDesign: null,
  posterDesign: null,
  stickersDesign: null,
};

export const defaultPlayerProgress: PlayerProgress = {
  xp: 0,
  coins: 0,
  completedModules: [],
  unlockedLocations: ['bakery_marie'],
  savedVersions: [],
  finalDesign: undefined,
  portfolio: null,
  portfolioItems: [],
  mariaOrders: defaultMariaOrders,
  activeOrder: 1,
};

export class SaveEngine {
  static loadProgress(): PlayerProgress {
    try {
      const data = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('spark_studio_save_v2');
      if (data) {
        const parsed = JSON.parse(data);
        // Ensure mariaOrders structure
        if (!parsed.mariaOrders) {
          const isBakeryDone = parsed.completedModules?.includes('bakery_marie');
          parsed.mariaOrders = {
            order1: isBakeryDone ? 'completed' : 'available',
            order2: isBakeryDone ? 'available' : 'locked',
            order3: 'locked',
            signDesign: parsed.finalDesign || null,
            posterDesign: null,
            stickersDesign: null,
          };
          parsed.activeOrder = isBakeryDone ? 2 : 1;
        }
        if (!parsed.portfolioItems) {
          parsed.portfolioItems = [];
          if (parsed.portfolio) {
            parsed.portfolioItems.push({
              id: 'order-1-sign',
              title: 'Вывеска Мари',
              orderNumber: 1,
              type: 'sign',
              client: 'Мари',
              task: 'Сделать пекарню заметной и понятной прохожим с улицы',
              beforeNoticed: parsed.portfolio.beforeNoticed || 3,
              afterNoticed: parsed.portfolio.afterNoticed || 18,
              versionsTested: parsed.portfolio.versionsTested || 1,
              finalDesign: parsed.portfolio.finalDesign,
              completedAt: parsed.portfolio.completedAt || new Date().toLocaleDateString('ru-RU'),
            });
          }
        }
        const normalized: PlayerProgress = {
          ...defaultPlayerProgress,
          ...parsed,
          completedModules: Array.isArray(parsed.completedModules) ? parsed.completedModules : [],
          savedVersions: Array.isArray(parsed.savedVersions) ? parsed.savedVersions : [],
          portfolioItems: Array.isArray(parsed.portfolioItems) ? parsed.portfolioItems : [],
          unlockedLocations: Array.isArray(parsed.unlockedLocations) ? parsed.unlockedLocations : ['bakery_marie'],
          mariaOrders: {
            ...defaultMariaOrders,
            ...(parsed.mariaOrders || {}),
          },
          activeOrder: (parsed.activeOrder === 1 || parsed.activeOrder === 2 || parsed.activeOrder === 3) ? parsed.activeOrder : 1,
        };
        return normalized;
      }
    } catch (e) {
      console.warn('Failed to load spark studio save:', e);
    }
    return defaultPlayerProgress;
  }

  static saveProgress(progress: PlayerProgress): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn('Failed to save spark studio progress:', e);
    }
  }

  static exportSparkFile(progress: PlayerProgress): void {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(progress, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `player_save_${Date.now()}.spark`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  static importSparkFile(file: File): Promise<PlayerProgress> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          if (parsed && typeof parsed === 'object') {
            SaveEngine.saveProgress(parsed);
            resolve(parsed);
          } else {
            reject(new Error('Неверный формат файла .spark'));
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Ошибка чтения файла'));
      reader.readAsText(file);
    });
  }
}


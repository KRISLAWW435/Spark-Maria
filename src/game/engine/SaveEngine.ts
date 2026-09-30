import { PlayerProgress, TestResult, SignDesign } from '../types';

const STORAGE_KEY = 'spark_studio_save_v2';

export const defaultSignDesign: SignDesign = {
  text: 'КОНДИТЕРСКАЯ МАРИ',
  subtext: 'СВЕЖИЕ ЭКЛЕРЫ & КЕКСЫ',
  fontSize: 24,
  fontStyle: 'sweet',
  shape: 'rounded',
  icon: 'cupcake',
  iconSize: 48,
  bgColor: '#FFF5EB',
  textColor: '#4A2810',
  borderColor: '#E89038',
  signWidth: 260,
  signHeight: 120,
  posX: 0,
  posY: 0,
};

export const defaultPlayerProgress: PlayerProgress = {
  xp: 0,
  coins: 0,
  completedModules: [],
  unlockedLocations: ['bakery_marie'],
  savedVersions: [],
  finalDesign: undefined,
  portfolio: null,
};

export class SaveEngine {
  static loadProgress(): PlayerProgress {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
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

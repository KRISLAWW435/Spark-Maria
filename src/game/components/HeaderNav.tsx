import React, { useRef } from 'react';
import { PlayerProgress } from '../types';
import { SaveEngine } from '../engine/SaveEngine';
import { soundEngine } from '../engine/SoundEngine';
import { Sparkles, Download, Upload, RefreshCw, Settings, Award } from 'lucide-react';

interface HeaderNavProps {
  progress: PlayerProgress;
  onOpenMap: () => void;
  onProgressUpdate: (newProgress: PlayerProgress) => void;
  onResetProgress: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  progress,
  onOpenMap,
  onProgressUpdate,
  onResetProgress,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    soundEngine.playPop();
    SaveEngine.exportSparkFile(progress);
  };

  const handleImportClick = () => {
    soundEngine.playClick();
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const loaded = await SaveEngine.importSparkFile(file);
        onProgressUpdate(loaded);
        soundEngine.playSuccess();
        alert('Игровой прогресс успешно загружен!');
      } catch (err) {
        alert('Ошибка при загрузке файла: ' + (err as Error).message);
      }
    }
  };

  return (
    <header className="fixed top-4 left-4 right-4 z-50 pointer-events-none flex items-center justify-between gap-4 select-none">
      {/* Top-Left Pill: SPARK STUDIO Logo */}
      <div
        onClick={() => {
          soundEngine.playClick();
          onOpenMap();
        }}
        className="pointer-events-auto bg-white/95 backdrop-blur-md text-slate-900 px-4 py-2 rounded-full shadow-xl border border-white/80 flex items-center gap-2.5 cursor-pointer hover:scale-105 transition-transform"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 flex items-center justify-center text-white shadow-sm">
          <Sparkles className="w-4 h-4 fill-current" />
        </div>
        <span className="font-extrabold text-sm tracking-wide text-slate-900">
          SPARK STUDIO
        </span>
      </div>

      {/* Top-Right Pill: Player Stats & Actions */}
      <div className="pointer-events-auto bg-white/95 backdrop-blur-md text-slate-800 px-4 py-2 rounded-full shadow-xl border border-white/80 flex items-center gap-3 text-xs md:text-sm font-extrabold">
        {/* Avatar */}
        <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-amber-950 font-black shadow-inner">
          ⚡
        </div>

        {/* XP */}
        <div className="flex items-center gap-1 text-purple-600 font-extrabold">
          <Award className="w-4 h-4" />
          <span>{progress.xp} XP</span>
        </div>

        <div className="w-px h-4 bg-slate-200" />

        {/* Coins */}
        <div className="flex items-center gap-1 text-amber-600 font-black">
          <span className="w-4 h-4 rounded-full bg-amber-400 text-amber-950 text-[10px] flex items-center justify-center font-black">
            $
          </span>
          <span>{progress.coins}</span>
        </div>

        <div className="w-px h-4 bg-slate-200" />

        {/* Export / Import Controls */}
        <button
          onClick={handleExport}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
          title="Сохранить .spark"
        >
          <Download className="w-4 h-4" />
        </button>

        <button
          onClick={handleImportClick}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
          title="Загрузить .spark"
        >
          <Upload className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            if (confirm('Сбросить весь сохраненный прогресс и начать заново?')) {
              onResetProgress();
            }
          }}
          className="p-1.5 rounded-full hover:bg-rose-100 text-rose-600 transition-colors"
          title="Сбросить прогресс"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        <button
          onClick={() => alert('Spark Studio UI v2.0 • Архипелаг UX')}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
          title="Настройки"
        >
          <Settings className="w-4 h-4" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".spark,.json"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </header>
  );
};

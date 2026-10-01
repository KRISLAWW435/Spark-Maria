import React, { useRef, useState } from 'react';
import { PlayerProgress } from '../types';
import { SaveEngine } from '../engine/SaveEngine';
import { soundEngine } from '../engine/SoundEngine';
import { Sparkles, Download, Upload, RefreshCw, Settings, Award, CheckCircle2 } from 'lucide-react';

interface HeaderNavProps {
  progress: PlayerProgress;
  onOpenStudio: () => void;
  onProgressUpdate: (newProgress: PlayerProgress) => void;
  onResetProgress: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  progress,
  onOpenStudio,
  onProgressUpdate,
  onResetProgress,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExport = () => {
    soundEngine.playPop();
    SaveEngine.exportSparkFile(progress);
    showToast('Файл .spark сохранён');
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
        showToast('Игровой прогресс успешно загружен!');
      } catch (err) {
        showToast('Ошибка при загрузке файла: ' + (err as Error).message);
      }
    }
  };

  return (
    <>
      <header className="fixed top-4 left-4 right-4 z-50 pointer-events-none flex items-center justify-between gap-4 select-none">
        {/* Top-Left: Empty spacer - no button/pill as requested */}
        <div className="w-8 pointer-events-none" />

        {/* Toast Notification */}
        {toastMessage && (
          <div className="pointer-events-auto fixed top-18 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-slate-900/90 text-white font-extrabold text-xs shadow-2xl border border-white/20 flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

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

          {/* Reset Progress Button - Opens In-App Modal */}
          <button
            onClick={() => {
              soundEngine.playPop();
              setShowResetConfirm(true);
            }}
            className="p-1.5 rounded-full hover:bg-rose-100 text-rose-600 transition-colors"
            title="Сбросить прогресс"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              soundEngine.playPop();
              showToast('Spark Studio UI v2.5 • Архипелаг UX');
            }}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
            title="О студии"
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

      {/* In-App Confirmation Modal for Progress Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
              <RefreshCw className="w-7 h-7 animate-spin-once" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900">Сбросить прогресс?</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Это вернёт студию к начальному виду (кружок «+» на стене), обнулит опыт, монеты и заново откроет заказ от Мари.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  soundEngine.playSuccess();
                  setShowResetConfirm(false);
                  onResetProgress();
                  showToast('Прогресс и студия успешно сброшены!');
                }}
                className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs transition-colors shadow-lg shadow-rose-200"
              >
                Да, сбросить всё
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

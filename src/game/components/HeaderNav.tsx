import React, { useRef, useState, useEffect } from 'react';
import { PlayerProgress } from '../types';
import { SaveEngine } from '../engine/SaveEngine';
import { soundEngine } from '../engine/SoundEngine';
import { FullscreenManager } from '../engine/FullscreenManager';
import { Download, Upload, RefreshCw, CheckCircle2, Maximize, Minimize, ExternalLink } from 'lucide-react';

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
  const [isFullscreen, setIsFullscreen] = useState(() => FullscreenManager.isFullscreen());
  const [isVirtual, setIsVirtual] = useState(() => FullscreenManager.isVirtualFullscreen());
  const [isInIframe, setIsInIframe] = useState(() => FullscreenManager.isInIframe());

  useEffect(() => {
    return FullscreenManager.addFullscreenChangeListener((full, virt) => {
      setIsFullscreen(full);
      setIsVirtual(virt);
    });
  }, []);

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
      <header className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 pointer-events-none select-none">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="pointer-events-auto fixed top-14 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full bg-slate-900/90 text-white font-extrabold text-xs shadow-2xl border border-white/20 flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top-Right Compact Pill: Player Actions */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md text-slate-800 px-2.5 py-1 rounded-full shadow-lg border border-white/80 flex items-center gap-2 text-xs sm:text-sm font-extrabold">
          {/* Avatar Icon */}
          <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-amber-950 font-black text-xs shadow-inner shrink-0">
            ⚡
          </div>

          <span className="text-[11px] font-black text-indigo-900 pr-1">Студия</span>

          <div className="w-px h-3.5 bg-slate-200" />

          {/* Export / Import Controls */}
          <button
            onClick={handleExport}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            title="Сохранить .spark"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleImportClick}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            title="Загрузить .spark"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => {
              soundEngine.playPop();
              FullscreenManager.toggleFullscreen();
            }}
            className={`p-1 rounded-full transition-colors cursor-pointer ${
              isFullscreen ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' : 'hover:bg-slate-100 text-slate-600'
            }`}
            title={isFullscreen ? 'Выйти из полноэкранного режима' : 'Во весь экран'}
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          </button>

          {/* Standalone Tab Button (if inside iframe preview) */}
          {isInIframe && (
            <a
              href={typeof window !== 'undefined' ? window.location.href : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
              title="Открыть игру в отдельной вкладке браузера (для аппаратного F11 полноэкранного режима)"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {/* Reset Progress Button - Opens In-App Modal */}
          <button
            onClick={() => {
              soundEngine.playPop();
              setShowResetConfirm(true);
            }}
            className="p-1 rounded-full hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
            title="Сбросить прогресс"
          >
            <RefreshCw className="w-3.5 h-3.5" />
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

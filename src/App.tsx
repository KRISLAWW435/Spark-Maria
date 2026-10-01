import React, { useState, useEffect } from 'react';
import { GameScene, PlayerProgress, SignDesign, TestResult } from './game/types';
import { SaveEngine, defaultSignDesign, defaultPlayerProgress } from './game/engine/SaveEngine';
import { evaluateDesign } from './game/engine/DesignEvaluation';
import { HeaderNav } from './game/components/HeaderNav';
import { SparkStudioScene } from './game/components/SparkStudioScene';
import { BakeryInteriorScene } from './game/components/BakeryInteriorScene';
import { StreetObservationScene } from './game/components/StreetObservationScene';
import { BriefScene } from './game/components/BriefScene';
import { CanvasEditor } from './game/components/CanvasEditor';
import { StreetTestScene } from './game/components/StreetTestScene';
import { TestResultsScene } from './game/components/TestResultsScene';
import { PortfolioScene } from './game/components/PortfolioScene';
import { Smartphone, RotateCw } from 'lucide-react';

export default function App() {
  const [progress, setProgress] = useState<PlayerProgress>(() => SaveEngine.loadProgress());
  const [currentScene, setCurrentScene] = useState<GameScene>('studio');
  const [currentDesign, setCurrentDesign] = useState<SignDesign>(defaultSignDesign);
  const [currentTestResult, setCurrentTestResult] = useState<TestResult | null>(null);
  const [versionCounter, setVersionCounter] = useState(1);
  const [studioResetKey, setStudioResetKey] = useState(0);
  const [hasObservedStreet, setHasObservedStreet] = useState<boolean>(() => {
    return progress.completedModules.includes('bakery_marie');
  });

  // Check portrait orientation on mobile devices
  const [isPortrait, setIsPortrait] = useState<boolean>(() => {
    return typeof window !== 'undefined' && window.innerHeight > window.innerWidth && window.innerWidth < 850;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth && window.innerWidth < 850);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Auto-save player progress whenever it changes
  useEffect(() => {
    SaveEngine.saveProgress(progress);
  }, [progress]);

  const handleStartMarieLevel = () => {
    setCurrentScene('intro_bakery');
  };

  const handleTestDesign = (designToTest: SignDesign) => {
    setCurrentDesign(designToTest);
    const result = evaluateDesign(designToTest, versionCounter);
    setCurrentTestResult(result);

    // Save version in progress history
    const updatedSaved = [...progress.savedVersions, result];
    setProgress({
      ...progress,
      savedVersions: updatedSaved,
    });

    setCurrentScene('street_test');
  };

  const handleFinishStreetTest = () => {
    setCurrentScene('test_results');
  };

  const handleImproveDesign = () => {
    setVersionCounter((prev) => prev + 1);
    setCurrentScene('studio');
  };

  const handleKeepAndFinish = () => {
    if (!currentTestResult) return;

    const finalResult = currentTestResult;
    const isAlreadyCompleted = progress.completedModules.includes('bakery_marie');

    const newXp = progress.xp + (isAlreadyCompleted ? 20 : 100);
    const newCoins = progress.coins + (isAlreadyCompleted ? 10 : 50);

    const updatedModules = isAlreadyCompleted ? progress.completedModules : [...progress.completedModules, 'bakery_marie'];
    const updatedUnlocked = progress.unlockedLocations.includes('illustration_studio')
      ? progress.unlockedLocations
      : [...progress.unlockedLocations, 'illustration_studio'];

    const portfolioCard = {
      title: 'Секретная вывеска кондитерской Мари',
      client: 'Мари',
      task: 'Сделать кондитерскую заметной и понятной прохожим с улицы',
      beforeNoticed: 3,
      afterNoticed: finalResult.noticedCount,
      versionsTested: versionCounter,
      finalDesign: finalResult.signDesign,
      completedAt: new Date().toLocaleDateString('ru-RU'),
    };

    const newProgress: PlayerProgress = {
      ...progress,
      xp: newXp,
      coins: newCoins,
      completedModules: updatedModules,
      unlockedLocations: updatedUnlocked,
      finalDesign: finalResult.signDesign,
      portfolio: portfolioCard,
    };

    setProgress(newProgress);
    setCurrentScene('portfolio');
  };

  const handleResetProgress = () => {
    try {
      localStorage.removeItem('spark_studio_data');
    } catch {
      // ignore
    }
    const reset = defaultPlayerProgress;
    setProgress(reset);
    SaveEngine.saveProgress(reset);
    setCurrentDesign(defaultSignDesign);
    setVersionCounter(1);
    setHasObservedStreet(false);
    setStudioResetKey((prev) => prev + 1);
    setCurrentScene('studio');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header Navigation */}
      <HeaderNav
        progress={progress}
        onOpenStudio={() => setCurrentScene('studio')}
        onProgressUpdate={(newProg) => {
          setProgress(newProg);
          setCurrentScene('studio');
        }}
        onResetProgress={handleResetProgress}
      />

      {/* Landscape Orientation Recommendation Overlay for Mobile / Tablet */}
      {isPortrait && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-white text-center animate-fadeIn select-none">
          <div className="relative mb-6">
            <div className="w-16 h-28 rounded-2xl border-4 border-indigo-400/80 bg-indigo-950/40 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.5)]">
              <Smartphone className="w-10 h-10 text-indigo-300" />
            </div>
            <RotateCw className="w-8 h-8 text-amber-300 absolute -top-3 -right-3 animate-spin [animation-duration:3s]" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-pink-200 to-indigo-200">
            Поверните устройство горизонтально
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xs leading-relaxed">
            Дизайн-студия и ноутбук лучше всего работают в альбомном (горизонтальном) режиме! 🔄
          </p>
          <button
            onClick={() => setIsPortrait(false)}
            className="mt-6 px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-300 transition-colors"
          >
            Продолжить в вертикальном режиме
          </button>
        </div>
      )}

      {/* Main Game Router View */}
      <main className="flex-1 relative flex flex-col">
        {currentScene === 'studio' && (
          <SparkStudioScene
            key={studioResetKey}
            progress={progress}
            onStartMarieLevel={handleStartMarieLevel}
            onOpenPortfolio={() => setCurrentScene('portfolio')}
            hasObservedStreet={hasObservedStreet}
            currentDesign={currentDesign}
            onTestDesign={handleTestDesign}
            versionNumber={versionCounter}
          />
        )}

        {currentScene === 'intro_bakery' && (
          <BakeryInteriorScene onComplete={() => setCurrentScene('street_observation')} />
        )}

        {currentScene === 'street_observation' && (
          <StreetObservationScene
            onComplete={() => {
              setHasObservedStreet(true);
              setCurrentScene('studio');
            }}
          />
        )}

        {currentScene === 'canvas_editor' && (
          <CanvasEditor
            initialDesign={currentDesign}
            onTestDesign={handleTestDesign}
            versionNumber={versionCounter}
          />
        )}

        {currentScene === 'street_test' && currentTestResult && (
          <StreetTestScene
            testResult={currentTestResult}
            onFinishTest={handleFinishStreetTest}
          />
        )}

        {currentScene === 'test_results' && currentTestResult && (
          <TestResultsScene
            testResult={currentTestResult}
            onImprove={handleImproveDesign}
            onKeepAndFinish={handleKeepAndFinish}
          />
        )}

        {currentScene === 'portfolio' && (
          <PortfolioScene
            progress={progress}
            onReturnToStudio={() => setCurrentScene('studio')}
          />
        )}
      </main>
    </div>
  );
}

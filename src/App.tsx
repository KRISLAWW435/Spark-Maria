import React, { useState, useEffect } from 'react';
import { GameScene, PlayerProgress, SignDesign, TestResult } from './game/types';
import { SaveEngine, defaultSignDesign, defaultPlayerProgress } from './game/engine/SaveEngine';
import { evaluateDesign } from './game/engine/DesignEvaluation';
import { HeaderNav } from './game/components/HeaderNav';
import { WorldMap } from './game/components/WorldMap';
import { BakeryInteriorScene } from './game/components/BakeryInteriorScene';
import { StreetObservationScene } from './game/components/StreetObservationScene';
import { BriefScene } from './game/components/BriefScene';
import { CanvasEditor } from './game/components/CanvasEditor';
import { StreetTestScene } from './game/components/StreetTestScene';
import { TestResultsScene } from './game/components/TestResultsScene';
import { PortfolioScene } from './game/components/PortfolioScene';

export default function App() {
  const [progress, setProgress] = useState<PlayerProgress>(() => SaveEngine.loadProgress());
  const [currentScene, setCurrentScene] = useState<GameScene>('world_map');
  const [currentDesign, setCurrentDesign] = useState<SignDesign>(defaultSignDesign);
  const [currentTestResult, setCurrentTestResult] = useState<TestResult | null>(null);
  const [versionCounter, setVersionCounter] = useState(1);

  // Auto-save player progress whenever it changes
  useEffect(() => {
    SaveEngine.saveProgress(progress);
  }, [progress]);

  const handleSelectLocation = (locId: string) => {
    if (locId === 'bakery_marie') {
      setCurrentScene('intro_bakery');
    }
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
    setCurrentScene('canvas_editor');
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
    const reset = defaultPlayerProgress;
    setProgress(reset);
    SaveEngine.saveProgress(reset);
    setCurrentDesign(defaultSignDesign);
    setVersionCounter(1);
    setCurrentScene('world_map');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header Navigation */}
      <HeaderNav
        progress={progress}
        onOpenMap={() => setCurrentScene('world_map')}
        onProgressUpdate={(newProg) => {
          setProgress(newProg);
          setCurrentScene('world_map');
        }}
        onResetProgress={handleResetProgress}
      />

      {/* Main Game Router View */}
      <main className="flex-1 relative flex flex-col">
        {currentScene === 'world_map' && (
          <WorldMap progress={progress} onSelectLocation={handleSelectLocation} />
        )}

        {currentScene === 'intro_bakery' && (
          <BakeryInteriorScene onComplete={() => setCurrentScene('street_observation')} />
        )}

        {currentScene === 'street_observation' && (
          <StreetObservationScene onComplete={() => setCurrentScene('brief')} />
        )}

        {currentScene === 'brief' && (
          <BriefScene onComplete={() => setCurrentScene('canvas_editor')} />
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
            onReturnToMap={() => setCurrentScene('world_map')}
          />
        )}
      </main>
    </div>
  );
}

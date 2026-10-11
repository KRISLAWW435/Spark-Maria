import React, { useState, useEffect } from 'react';
import {
  GameScene,
  PlayerProgress,
  SignDesign,
  TestResult,
  PosterDesign,
  StickersDesign,
  PortfolioItem,
} from './game/types';
import {
  SaveEngine,
  defaultSignDesign,
  defaultPosterDesign,
  defaultStickersDesign,
  defaultPlayerProgress,
  defaultMariaOrders,
} from './game/engine/SaveEngine';
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
import { VideoTransition } from './game/components/VideoTransition';
import { assetPreloader } from './game/engine/AssetPreloader';
import { Smartphone, RotateCw } from 'lucide-react';

export default function App() {
  const [progress, setProgress] = useState<PlayerProgress>(() => SaveEngine.loadProgress());
  const [currentScene, setCurrentScene] = useState<GameScene>('studio');

  // Multi-order states
  const [activeOrder, setActiveOrder] = useState<1 | 2 | 3>(() => {
    const orders = progress.mariaOrders;
    if (!orders || orders.order1 !== 'completed') return 1;
    if (orders.order2 !== 'completed') return 2;
    return 3;
  });

  const [currentDesign, setCurrentDesign] = useState<SignDesign>(() => {
    return progress.mariaOrders?.signDesign || progress.finalDesign || defaultSignDesign;
  });

  const [posterDesign, setPosterDesign] = useState<PosterDesign>(() => {
    return progress.mariaOrders?.posterDesign || defaultPosterDesign;
  });

  const [stickersDesign, setStickersDesign] = useState<StickersDesign>(() => {
    return progress.mariaOrders?.stickersDesign || defaultStickersDesign;
  });

  const [currentTestResult, setCurrentTestResult] = useState<TestResult | null>(null);
  const [versionCounter, setVersionCounter] = useState(1);
  const [studioResetKey, setStudioResetKey] = useState(0);
  const [hasObservedStreet, setHasObservedStreet] = useState<boolean>(() => {
    return Boolean(progress.completedModules?.includes('bakery_marie'));
  });

  // Check portrait orientation on mobile handheld touch devices only
  const [isPortrait, setIsPortrait] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const isMobileTouch = ('ontouchstart' in window || navigator.maxTouchPoints > 1) && window.innerWidth < 640;
    return Boolean(isMobileTouch && window.innerHeight > window.innerWidth);
  });

  useEffect(() => {
    const handleResize = () => {
      const isMobileTouch = ('ontouchstart' in window || navigator.maxTouchPoints > 1) && window.innerWidth < 640;
      setIsPortrait(Boolean(isMobileTouch && window.innerHeight > window.innerWidth));
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    // Preload video and scene background images in background
    assetPreloader.preloadAll();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Video Transition Overlay state
  const [showVideoTransition, setShowVideoTransition] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  // Auto-save player progress whenever it changes
  useEffect(() => {
    SaveEngine.saveProgress(progress);
  }, [progress]);

  // Order Flow: Trip to Marie (plays Drive video transition)
  const handleStartMarieLevel = (orderNumber: 1 | 2 | 3 = 1) => {
    if (isTransitioning) return; // Prevent double trigger
    setIsTransitioning(true);
    setActiveOrder(orderNumber);
    setShowVideoTransition(true);
  };

  // Called as soon as the screen is 100% covered by the video (at ~300ms)
  // Switches the scene to intro_bakery underneath so all images decode while video plays
  const handleVideoTransitionCovered = () => {
    setCurrentScene('intro_bakery');
  };

  // Called after the fadeout finishes (bakery is already revealed smoothly)
  const handleVideoTransitionComplete = () => {
    setShowVideoTransition(false);
    setIsTransitioning(false);
  };

  // Order 1: Sign Test
  const handleTestDesign = (designToTest: SignDesign) => {
    setCurrentDesign(designToTest);
    const result = evaluateDesign(designToTest, versionCounter);
    result.orderNumber = 1;
    setCurrentTestResult(result);

    const updatedSaved = [...(progress.savedVersions || []), result];
    setProgress((prev) => ({
      ...prev,
      savedVersions: updatedSaved,
    }));

    setCurrentScene('street_test');
  };

  // Order 2: Poster Test
  const handleTestPoster = (designToTest: PosterDesign) => {
    setPosterDesign(designToTest);
    const result: TestResult = {
      versionNumber: versionCounter,
      signDesign: currentDesign,
      posterDesign: designToTest,
      orderNumber: 2,
      noticedCount: 16,
      readCount: 14,
      understoodCount: 14,
      enteredCount: 12,
      totalVisitors: 18,
      sparkCommentary:
        'Восхитительно! Прохожие издалека видят крупные аппетитные эклеры и сразу читают заголовок!',
      educationalTakeaway: {
        title: 'Сила визуальной иерархии в афише',
        concept: 'Правило взгляда: Картинка ➔ Заголовок ➔ Призыв к действию',
        explanation:
          'На вертикальном постере взгляд человека скользит сверху вниз: сначала глаз цепляется за фото эклеров, затем мозг читает текст, и в конце видит кнопку с призывом зайти!',
        sparkAnalogy: 'Афиша как стрела: направляет внимание прямо в пекарню!',
      },
      timestamp: Date.now(),
      visitorReactions: [
        {
          visitorId: 'npcGirl',
          name: 'Лера',
          role: 'Студентка',
          emotion: 'happy',
          noticed: true,
          read: true,
          understood: true,
          entered: true,
          dialogueBubble: 'Ой, свежие эклеры каждое утро! Обязательно забегу перед парами!',
        },
        {
          visitorId: 'npcChef',
          name: 'Шеф Антуан',
          role: 'Кулинарный критик',
          emotion: 'interested',
          noticed: true,
          read: true,
          understood: true,
          entered: true,
          dialogueBubble: 'Прекрасный постер! Лаконично, аппетитно и понятно.',
        },
        {
          visitorId: 'npcDriver',
          name: 'Максим',
          role: 'Водитель',
          emotion: 'amused',
          noticed: true,
          read: true,
          understood: true,
          entered: true,
          dialogueBubble: 'Купи 2 = 3? Возьму коробку к чаю для коллег!',
        },
      ],
    };

    setCurrentTestResult(result);
    setCurrentScene('street_test');
  };

  // Order 3: Stickers Test
  const handleTestStickers = (designToTest: StickersDesign) => {
    setStickersDesign(designToTest);
    const result: TestResult = {
      versionNumber: versionCounter,
      signDesign: currentDesign,
      posterDesign: posterDesign,
      stickersDesign: designToTest,
      orderNumber: 3,
      noticedCount: 20,
      readCount: 19,
      understoodCount: 19,
      enteredCount: 18,
      totalVisitors: 20,
      sparkCommentary:
        'Потрясающий финал! Витрина и дверь сияют, как в сказке! Вся улица в восторге!',
      educationalTakeaway: {
        title: 'Уют и атмосфера витрины',
        concept: 'Декоративная гармония стекла и пространства',
        explanation:
          'Наклейки не перегружают обзор, а создают дружелюбное настроение и приглашают зайти внутрь.',
        sparkAnalogy: 'Как праздничные огоньки: дарят тепло каждому прохожему!',
      },
      timestamp: Date.now(),
      visitorReactions: [
        {
          visitorId: 'npcGirl',
          name: 'Лера',
          role: 'Студентка',
          emotion: 'happy',
          noticed: true,
          read: true,
          understood: true,
          entered: true,
          dialogueBubble: 'Какой милый котик на стекле! Самая уютная пекарня в городе!',
        },
        {
          visitorId: 'npcChef',
          name: 'Шеф Антуан',
          role: 'Кулинарный критик',
          emotion: 'happy',
          noticed: true,
          read: true,
          understood: true,
          entered: true,
          dialogueBubble: 'Браво юному дизайнеру! Фасад преобразился до неузнаваемости!',
        },
      ],
    };

    setCurrentTestResult(result);
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

    const orderNum = currentTestResult.orderNumber || activeOrder;
    const currentOrders = progress.mariaOrders || defaultMariaOrders;

    const newXp = progress.xp + 100;
    const newCoins = progress.coins + 50;

    let updatedOrders = { ...currentOrders };
    let newPortfolioItem: PortfolioItem;

    if (orderNum === 1) {
      updatedOrders.order1 = 'completed';
      if (updatedOrders.order2 === 'locked') updatedOrders.order2 = 'available';
      updatedOrders.signDesign = currentDesign;

      newPortfolioItem = {
        id: 'order-1-sign',
        title: 'Вывеска Мари',
        orderNumber: 1,
        type: 'sign',
        client: 'Пекарня Мари',
        task: 'Сделать пекарню заметной и понятной прохожим с улицы',
        beforeNoticed: 3,
        afterNoticed: currentTestResult.noticedCount,
        versionsTested: versionCounter,
        finalDesign: currentDesign,
        completedAt: new Date().toLocaleDateString('ru-RU'),
      };
      setActiveOrder(2);
    } else if (orderNum === 2) {
      updatedOrders.order2 = 'completed';
      if (updatedOrders.order3 === 'locked') updatedOrders.order3 = 'available';
      updatedOrders.posterDesign = posterDesign;

      newPortfolioItem = {
        id: 'order-2-poster',
        title: 'Афиша Мари',
        orderNumber: 2,
        type: 'poster',
        client: 'Пекарня Мари',
        task: 'Разработать вертикальную афишу (2:3) с эклерами и расписанием выпечки',
        beforeNoticed: 5,
        afterNoticed: currentTestResult.noticedCount,
        versionsTested: versionCounter,
        posterDesign: posterDesign,
        completedAt: new Date().toLocaleDateString('ru-RU'),
      };
      setActiveOrder(3);
    } else {
      updatedOrders.order3 = 'completed';
      updatedOrders.stickersDesign = stickersDesign;

      newPortfolioItem = {
        id: 'order-3-stickers',
        title: 'Витрина и дверь Мари',
        orderNumber: 3,
        type: 'stickers',
        client: 'Пекарня Мари',
        task: 'Украсить окна и дверь уютными наклейками со сладостями и персонажами',
        beforeNoticed: 8,
        afterNoticed: currentTestResult.noticedCount,
        versionsTested: versionCounter,
        stickersDesign: stickersDesign,
        completedAt: new Date().toLocaleDateString('ru-RU'),
      };
    }

    const updatedPortfolioItems = [
      ...(progress.portfolioItems || []).filter((p) => p.orderNumber !== orderNum),
      newPortfolioItem,
    ];

    const existingModules = progress.completedModules || [];
    const updatedModules = existingModules.includes('bakery_marie')
      ? existingModules
      : [...existingModules, 'bakery_marie'];

    const newProgress: PlayerProgress = {
      ...progress,
      xp: newXp,
      coins: newCoins,
      completedModules: updatedModules,
      finalDesign: currentDesign,
      mariaOrders: updatedOrders,
      activeOrder: orderNum === 1 ? 2 : orderNum === 2 ? 3 : 3,
      portfolioItems: updatedPortfolioItems,
      portfolio: {
        title: newPortfolioItem.title,
        client: newPortfolioItem.client,
        task: newPortfolioItem.task,
        beforeNoticed: newPortfolioItem.beforeNoticed,
        afterNoticed: newPortfolioItem.afterNoticed,
        versionsTested: newPortfolioItem.versionsTested,
        finalDesign: currentDesign,
        completedAt: newPortfolioItem.completedAt,
      },
    };

    setProgress(newProgress);
    SaveEngine.saveProgress(newProgress);
    setHasObservedStreet(false);
    setCurrentScene('studio');
  };

  const handleResetProgress = () => {
    try {
      localStorage.removeItem('spark_studio_save_v3');
      localStorage.removeItem('spark_studio_save_v2');
      localStorage.removeItem('spark_studio_data');
    } catch {
      // ignore
    }
    const reset = defaultPlayerProgress;
    setProgress(reset);
    SaveEngine.saveProgress(reset);
    setCurrentDesign(defaultSignDesign);
    setPosterDesign(defaultPosterDesign);
    setStickersDesign(defaultStickersDesign);
    setVersionCounter(1);
    setActiveOrder(1);
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

      {/* Landscape Orientation Recommendation Overlay */}
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
            posterDesign={posterDesign}
            stickersDesign={stickersDesign}
            onTestPoster={handleTestPoster}
            onTestStickers={handleTestStickers}
            activeOrder={activeOrder}
          />
        )}

        {currentScene === 'intro_bakery' && (
          <BakeryInteriorScene onComplete={() => setCurrentScene('street_observation')} />
        )}

        {currentScene === 'brief' && (
          <BriefScene
            orderNumber={activeOrder}
            onComplete={() => setCurrentScene('street_observation')}
          />
        )}

        {currentScene === 'street_observation' && (
          <StreetObservationScene
            orderNumber={activeOrder}
            signDesign={currentDesign}
            posterDesign={posterDesign}
            stickersDesign={stickersDesign}
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
            orderNumber={activeOrder}
            posterDesign={posterDesign}
            stickersDesign={stickersDesign}
            onTestPoster={handleTestPoster}
            onTestStickers={handleTestStickers}
          />
        )}

        {currentScene === 'street_test' && currentTestResult && (
          <StreetTestScene
            testResult={currentTestResult}
            onFinishTest={handleFinishStreetTest}
            posterDesign={posterDesign}
            stickersDesign={stickersDesign}
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

        {/* Fullscreen Video Transition: Drive to Client */}
        {showVideoTransition && (
          <VideoTransition
            onCovered={handleVideoTransitionCovered}
            onComplete={handleVideoTransitionComplete}
          />
        )}
      </main>
    </div>
  );
}

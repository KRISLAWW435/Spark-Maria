import React, { useState } from 'react';
import { MarieSprite } from './MarieSprite';
import { SparkSprite } from './SparkSprite';
import { DialogueBox } from './DialogueBox';
import { GAME_ASSETS } from '../assets';

interface BriefSceneProps {
  onComplete: () => void;
}

export const BriefScene: React.FC<BriefSceneProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const script = [
    {
      speaker: 'marie' as const,
      speakerName: 'Мари (Заказчик)',
      text: 'Слушай, мне не нужна самая огромная или пафосная вывеска в городе…',
      marieEmotion: 'thinking' as const,
      sparkEmotion: 'neutral' as const,
      tagBg: 'bg-rose-500 text-white',
    },
    {
      speaker: 'marie' as const,
      speakerName: 'Мари (Заказчик)',
      text: 'Мне нужно, чтобы прохожий издалека её заметил, за секунду понял, что здесь пекут эклеры и кексы, и зашёл с улыбкой!',
      marieEmotion: 'hopeful' as const,
      sparkEmotion: 'happy' as const,
      tagBg: 'bg-rose-500 text-white',
    },
    {
      speaker: 'spark' as const,
      speakerName: 'Спарк (ИИ-Наставница)',
      text: 'Вот именно! Вывеска решает три задачи: 1) заметность, 2) контраст и читаемость, 3) узнаваемость символов!',
      marieEmotion: 'neutral' as const,
      sparkEmotion: 'excited' as const,
      tagBg: 'bg-amber-500 text-slate-950 font-extrabold',
    },
    {
      speaker: 'marie' as const,
      speakerName: 'Мари (Заказчик)',
      text: 'Вот именно! Красота радует глаз, а понятность и контраст приводят новых гостей.',
      marieEmotion: 'happy' as const,
      sparkEmotion: 'excited' as const,
      tagBg: 'bg-rose-500 text-white',
    },
    {
      speaker: 'spark' as const,
      speakerName: 'Спарк (ИИ-Наставница)',
      text: 'Прекрасно! Переходим в наш дизайнерский холст. Подбирай цвета, настраивай размер, выбирай читаемый шрифт и узнаваемую иконку!',
      marieEmotion: 'excited' as const,
      sparkEmotion: 'excited' as const,
      tagBg: 'bg-amber-500 text-slate-950 font-extrabold',
    },
  ];

  const current = script[step];

  const handleNext = () => {
    if (step < script.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden select-none flex flex-col justify-between font-sans">
      {/* LAYER 1: Full Desktop Studio Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={GAME_ASSETS.backgrounds.designStudio}
          alt="Дизайн-студия"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-bottom"
        />
      </div>

      {/* Brief Card Summary Banner Header */}
      <div className="relative z-10 max-w-2xl mx-auto mt-12 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-2xl text-slate-900">
        <div className="flex items-center gap-3 mb-1">
          <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black uppercase">
            Заказ №1
          </span>
          <h2 className="text-lg font-extrabold text-slate-900">БРИФ: СЕКРЕТНАЯ ВЫВЕСКА ДЛЯ МАРИ</h2>
        </div>
        <p className="text-xs text-slate-600 font-bold">
          Цель юного дизайнера: привлечь прохожих в кондитерскую Мари с помощью понятной, контрастной и заметной вывески.
        </p>
      </div>

      {/* LAYER 2: Characters Positioning (Desktop) - ONLY ONE PER SLIDE */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        {/* Marie: Grounded lower down by 76px, shifted 100px right */}
        {current.speaker === 'marie' && (
          <div className="absolute left-[0%] sm:left-[3%] md:left-[6%] translate-x-[100px] bottom-[-96px] md:bottom-[-111px] transition-all duration-300 z-20">
            <MarieSprite emotion={current.marieEmotion} size={1020} />
          </div>
        )}

        {/* Spark: Shifted more to the left and enlarged, light soft shadow */}
        {current.speaker === 'spark' && (
          <div className="absolute right-[16%] md:right-[24%] bottom-[12%] md:bottom-[16%] animate-float transition-all duration-300 z-20">
            <SparkSprite emotion={current.sparkEmotion} size={540} />
          </div>
        )}
      </div>

      {/* LAYER 3: Dialogue Box Overlay */}
      <DialogueBox
        speaker={current.speaker === 'marie' ? 'Мари' : 'Спарк'}
        text={current.text}
        onNext={handleNext}
        isLast={step === script.length - 1}
        nextButtonLabel={step === script.length - 1 ? 'Открыть Холст Редактора ➔' : 'Дальше ➔'}
      />
    </div>
  );
};

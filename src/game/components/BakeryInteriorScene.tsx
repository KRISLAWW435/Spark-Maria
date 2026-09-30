import React, { useState } from 'react';
import { MarieEmotion, SparkEmotion } from '../types';
import { MarieSprite } from './MarieSprite';
import { SparkSprite } from './SparkSprite';
import { DialogueBox } from './DialogueBox';
import { GAME_ASSETS } from '../assets';

interface BakeryInteriorSceneProps {
  onComplete: () => void;
}

export const BakeryInteriorScene: React.FC<BakeryInteriorSceneProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  // Visual Novel Dialogue Script
  const script: Array<{
    speaker: 'marie' | 'spark';
    speakerName: string;
    text: string;
    marieEmotion: MarieEmotion;
    sparkEmotion: SparkEmotion;
    tagBg: string;
  }> = [
    {
      speaker: 'marie',
      speakerName: 'Мари (Владелица Кондитерской)',
      text: 'Привет! Я Мари. У меня маленькая уютная кондитерская. Внутри тепло, на витринах — свежие эклеры. Но люди на улице почему-то проходят мимо…',
      marieEmotion: 'worried',
      sparkEmotion: 'neutral',
      tagBg: 'bg-rose-500 text-white',
    },
    {
      speaker: 'spark',
      speakerName: 'Спарк (ИИ-Наставница)',
      text: 'Потому что вывеска — это первое впечатление и главный «интерфейс» магазина! Если прохожий не замечает её за секунду, кондитерской для него не существует.',
      marieEmotion: 'worried',
      sparkEmotion: 'thinking',
      tagBg: 'bg-amber-500 text-slate-950 font-extrabold',
    },
    {
      speaker: 'marie',
      speakerName: 'Мари (Владелица Кондитерской)',
      text: 'Значит, нам нужна вывеска, которая не просто красивая, а решает конкретную задачу?',
      marieEmotion: 'hopeful',
      sparkEmotion: 'happy',
      tagBg: 'bg-rose-500 text-white',
    },
    {
      speaker: 'spark',
      speakerName: 'Спарк (ИИ-Наставница)',
      text: 'Вот именно! Вывеска решает три задачи: 1) заметность, 2) контраст и читаемость, 3) узнаваемость символов!',
      marieEmotion: 'happy',
      sparkEmotion: 'excited',
      tagBg: 'bg-amber-500 text-slate-950 font-extrabold',
    },
    {
      speaker: 'marie',
      speakerName: 'Мари (Владелица Кондитерской)',
      text: 'А что, если наш дизайнер выберет необычный цвет, сделает её огромной или добавит неожиданную иконку?',
      marieEmotion: 'surprised',
      sparkEmotion: 'laughing',
      tagBg: 'bg-rose-500 text-white',
    },
    {
      speaker: 'spark',
      speakerName: 'Спарк (ИИ-Наставница)',
      text: 'В нашей лаборатории нет ошибок и двоек! Любое решение — это творческая гипотеза. Соберём вывеску, протестируем на прохожих и узнаем их реакцию!',
      marieEmotion: 'excited',
      sparkEmotion: 'excited',
      tagBg: 'bg-amber-500 text-slate-950 font-extrabold',
    },
    {
      speaker: 'marie',
      speakerName: 'Мари (Владелица Кондитерской)',
      text: 'Звучит здорово! Пойдём на улицу и посмотрим на наше место со стороны!',
      marieEmotion: 'proud',
      sparkEmotion: 'happy',
      tagBg: 'bg-rose-500 text-white',
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
    <div className="relative w-full h-screen bg-amber-50 overflow-hidden select-none flex flex-col justify-between font-sans">
      {/* LAYER 1: Bakery Interior Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={GAME_ASSETS.backgrounds.bakeryInterior}
          alt="Интерьер кондитерской Мари"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-bottom"
        />
      </div>

      {/* LAYER 2: Characters - ONLY ONE CHARACTER PER SLIDE */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        {/* Marie: Grounded at bottom left (absolute left-[15%] bottom-[20%]), Desktop Size ~624px */}
        {current.speaker === 'marie' && (
          <div className="absolute left-[10%] md:left-[15%] bottom-[16%] md:bottom-[20%] transition-all duration-300 filter drop-shadow-2xl z-20">
            <MarieSprite emotion={current.marieEmotion} size={624} />
          </div>
        )}

        {/* Spark: Positioned on the right & lower down (absolute right-[18%] bottom-[22%] animate-float) */}
        {current.speaker === 'spark' && (
          <div className="absolute right-[12%] md:right-[18%] bottom-[18%] md:bottom-[22%] animate-float transition-all duration-300 filter drop-shadow-2xl z-20">
            <SparkSprite emotion={current.sparkEmotion} size={440} />
          </div>
        )}
      </div>

      {/* LAYER 3: Dialogue Box Overlay */}
      <div className="absolute bottom-4 left-0 right-0 z-30 px-4">
        <DialogueBox
          speakerName={current.speakerName}
          text={current.text}
          speakerTagBg={current.tagBg}
          onNext={handleNext}
          isLast={step === script.length - 1}
          nextButtonLabel={step === script.length - 1 ? 'Выйти на улицу ➔' : 'Дальше ➔'}
        />
      </div>
    </div>
  );
};

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
      text: 'Привет! Спасибо, что приехали так быстро! У меня маленькая уютная кондитерская: мы с утра выпекаем нежнейшие круассаны и эклеры...',
      marieEmotion: 'worried',
      sparkEmotion: 'neutral',
      tagBg: 'bg-rose-500 text-white',
    },
    {
      speaker: 'marie',
      speakerName: 'Мари (Владелица Кондитерской)',
      text: 'Но на улице люди почему-то просто проходят мимо нашей двери и не заходят внутрь. Мы совсем теряем гостей!',
      marieEmotion: 'worried',
      sparkEmotion: 'thinking',
      tagBg: 'bg-rose-500 text-white',
    },
    {
      speaker: 'spark',
      speakerName: 'Спарк · Искра творчества',
      text: 'Не переживай, Мари! Вывеска — это первое впечатление и главный интерфейс магазина. Пойдём на улицу, посмотрим, что не так!',
      marieEmotion: 'hopeful',
      sparkEmotion: 'excited',
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

      {/* LAYER 2: Characters */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        {/* Marie */}
        {current.speaker === 'marie' && (
          <div className="absolute left-[0%] sm:left-[3%] md:left-[6%] translate-x-[100px] bottom-[-96px] md:bottom-[-111px] transition-all duration-300 z-20">
            <MarieSprite emotion={current.marieEmotion} size={1020} />
          </div>
        )}

        {/* Spark with subtle rainbow neon glow */}
        {current.speaker === 'spark' && (
          <div className="absolute right-[16%] md:right-[24%] bottom-[12%] md:bottom-[16%] animate-float transition-all duration-300 z-20">
            <div
              style={{
                filter:
                  'drop-shadow(0 0 10px rgba(244,114,182,0.45)) drop-shadow(0 0 20px rgba(167,139,250,0.4)) drop-shadow(0 0 32px rgba(56,189,248,0.35))',
              }}
            >
              <SparkSprite emotion={current.sparkEmotion} size={540} />
            </div>
          </div>
        )}
      </div>

      {/* LAYER 3: Dialogue Box Overlay */}
      <DialogueBox
        speaker={current.speaker === 'marie' ? 'Мари' : 'Спарк'}
        text={current.text}
        onNext={handleNext}
        isLast={step === script.length - 1}
        nextButtonLabel={step === script.length - 1 ? 'Пойти на улицу ➔' : 'Дальше ➔'}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { MarieSprite } from './MarieSprite';
import { SparkSprite } from './SparkSprite';
import { DialogueBox } from './DialogueBox';
import { GAME_ASSETS } from '../assets';

interface BriefSceneProps {
  orderNumber?: 1 | 2 | 3;
  onComplete: () => void;
}

export const BriefScene: React.FC<BriefSceneProps> = ({ orderNumber = 1, onComplete }) => {
  const [step, setStep] = useState(0);

  const scriptsByOrder = {
    1: [
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
        text: 'Мне нужно, чтобы прохожий издалека её заметил, за 1.5 секунды понял, что здесь пекут эклеры и кексы, и зашёл с улыбкой!',
        marieEmotion: 'hopeful' as const,
        sparkEmotion: 'happy' as const,
        tagBg: 'bg-rose-500 text-white',
      },
      {
        speaker: 'spark' as const,
        speakerName: 'Спарк (Наставница)',
        text: 'Отличная задача! Давай сначала осмотрим фасад пекарни в режиме Шерлок и найдем место для вывески!',
        marieEmotion: 'excited' as const,
        sparkEmotion: 'excited' as const,
        tagBg: 'bg-amber-500 text-slate-950 font-extrabold',
      },
    ],
    2: [
      {
        speaker: 'marie' as const,
        speakerName: 'Мари (Заказчик)',
        text: 'Ура! Твоя вывеска отлично работает, но прохожие всё ещё не знают, что внутри у нас свежайшие французские эклеры!',
        marieEmotion: 'happy' as const,
        sparkEmotion: 'happy' as const,
        tagBg: 'bg-rose-500 text-white',
      },
      {
        speaker: 'spark' as const,
        speakerName: 'Спарк (Наставница)',
        text: 'Сделаем яркую вертикальную афишу с эклерами, призывом к действию и временем выпечки!',
        marieEmotion: 'excited' as const,
        sparkEmotion: 'excited' as const,
        tagBg: 'bg-amber-500 text-slate-950 font-extrabold',
      },
      {
        speaker: 'spark' as const,
        speakerName: 'Спарк (Наставница)',
        text: 'Пойдем на улицу и найдем лучшую рамку на стене для размещения афиши!',
        marieEmotion: 'hopeful' as const,
        sparkEmotion: 'excited' as const,
        tagBg: 'bg-amber-500 text-slate-950 font-extrabold',
      },
    ],
    3: [
      {
        speaker: 'marie' as const,
        speakerName: 'Мари (Заказчик)',
        text: 'Остался последний финальный штрих! Стёкла на витрине и двери выглядят пустыми. Хочется праздника и уюта!',
        marieEmotion: 'thinking' as const,
        sparkEmotion: 'neutral' as const,
        tagBg: 'bg-rose-500 text-white',
      },
      {
        speaker: 'spark' as const,
        speakerName: 'Спарк (Наставница)',
        text: 'Мы украсим окна и дверь стильными наклейками с персонажами и сладостями!',
        marieEmotion: 'happy' as const,
        sparkEmotion: 'excited' as const,
        tagBg: 'bg-amber-500 text-slate-950 font-extrabold',
      },
      {
        speaker: 'marie' as const,
        speakerName: 'Мари (Заказчик)',
        text: 'Давай осмотрим витрину в режиме Шерлок и выберем зоны для декораций!',
        marieEmotion: 'excited' as const,
        sparkEmotion: 'excited' as const,
        tagBg: 'bg-rose-500 text-white',
      },
    ],
  };

  const script = scriptsByOrder[orderNumber] || scriptsByOrder[1];
  const current = script[step] || script[0];

  const handleNext = () => {
    if (step < script.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden flex flex-col justify-between p-4 md:p-8 select-none font-sans">
      {/* Background with warm bakery ambience */}
      <div className="absolute inset-0 z-0">
        <img
          src={GAME_ASSETS.backgrounds.bakeryInterior}
          alt="Интерьер пекарни Мари"
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
      </div>

      {/* Top Banner */}
      <div className="relative z-10 max-w-xl mx-auto bg-slate-900/85 backdrop-blur-md px-6 py-2.5 rounded-full border border-amber-400/50 shadow-2xl text-center mt-12 sm:mt-14 text-white">
        <span className="text-xs sm:text-sm font-black text-amber-300 tracking-wide uppercase">
          📋 Что хочет Мария • Заказ #{orderNumber}
        </span>
      </div>

      {/* Sprites Showcase */}
      <div className="relative z-10 flex items-end justify-between max-w-4xl mx-auto w-full mt-auto mb-2 pointer-events-none">
        <div className="relative shrink-0 pointer-events-auto transform transition-transform duration-300">
          <MarieSprite emotion={current.marieEmotion} size={540} />
        </div>

        <div className="relative shrink-0 pointer-events-auto transform transition-transform duration-300">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-pink-400/30 via-purple-400/30 to-sky-400/30 blur-xl pointer-events-none" />
          <div className="h-44 sm:h-56 md:h-64 w-auto drop-shadow-2xl">
            <SparkSprite emotion={current.sparkEmotion} size="100%" className="h-full w-auto" />
          </div>
        </div>
      </div>

      {/* Dialogue Box */}
      <div className="relative z-20 max-w-3xl mx-auto w-full">
        <DialogueBox
          speakerName={current.speakerName}
          text={current.text}
          onNext={handleNext}
          isLast={step === script.length - 1}
        />
      </div>
    </div>
  );
};

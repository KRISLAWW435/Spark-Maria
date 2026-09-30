import React, { useState } from 'react';
import { DialogueBox } from './DialogueBox';
import { soundEngine } from '../engine/SoundEngine';
import { GAME_ASSETS } from '../assets';
import { Search, Eye, Sparkles } from 'lucide-react';

interface StreetObservationSceneProps {
  onComplete: () => void;
}

export const StreetObservationScene: React.FC<StreetObservationSceneProps> = ({ onComplete }) => {
  const [visitedHotspots, setVisitedHotspots] = useState<string[]>([]);
  const [activeObservation, setActiveObservation] = useState<{
    title: string;
    text: string;
  } | null>(null);

  const hotspots = [
    {
      id: 'old_sign',
      top: '32%',
      left: '38%',
      label: 'Старая вывеска',
      icon: '🔍',
      title: 'Бледная и крошечная вывеска',
      text: 'Старая табличка слишком маленькая и бледная. На сером кирпичном фасаде она полностью теряется из виду!',
    },
    {
      id: 'window',
      top: '52%',
      left: '42%',
      label: 'Витрина',
      icon: '🧁',
      title: 'Бликующие витрины',
      text: 'Внутри на полках лежат аппетитные эклеры, но дневное солнце бликует на стекле, и снаружи витрина кажется пустой.',
    },
    {
      id: 'passerby',
      top: '68%',
      left: '60%',
      label: 'Спешащий прохожий',
      icon: '🚶',
      title: 'Быстрый шаг горожан',
      text: 'Люди идут на работу или смотрят в телефоны. Чтобы привлечь их взгляд, нужен яркий, понятный и контрастный акцент!',
    },
    {
      id: 'neighbor',
      top: '36%',
      left: '72%',
      label: 'Соседняя вывеска',
      icon: '✨',
      title: 'Заметный соседний магазин',
      text: 'У магазина рядом крупные контрастные буквы и понятный символ. Поэтому его замечают даже с противоположной стороны улицы!',
    },
  ];

  const handleHotspotClick = (spot: typeof hotspots[0]) => {
    soundEngine.playPop();
    if (!visitedHotspots.includes(spot.id)) {
      setVisitedHotspots([...visitedHotspots, spot.id]);
    }
    setActiveObservation({
      title: spot.title,
      text: spot.text,
    });
  };

  const allVisited = visitedHotspots.length >= 3;

  return (
    <div className="relative w-full h-screen bg-sky-200 overflow-hidden flex flex-col justify-between p-4 md:p-6 select-none">
      {/* Full Bright Bakery Street Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={GAME_ASSETS.backgrounds.bakeryStreet}
          alt="Улица кондитерской Мари"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-bottom"
        />
      </div>

      {/* Observation Banner Header */}
      <div className="relative z-20 max-w-xl mx-auto bg-white/95 backdrop-blur-md px-6 py-3 rounded-full border border-white/80 shadow-2xl text-center mt-16">
        <h2 className="text-base md:text-lg font-black text-slate-800 flex items-center justify-center gap-2">
          <Search className="w-5 h-5 text-amber-500" /> Исследуй улицу ({visitedHotspots.length} из {hotspots.length})
        </h2>
        <p className="text-xs text-slate-600 mt-0.5">
          Нажимай на мерцающие <span className="text-amber-600 font-bold">точки наблюдения</span>, чтобы найти причины!
        </p>
      </div>

      {/* Interactive Hotspots Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {hotspots.map((spot) => {
          const isVisited = visitedHotspots.includes(spot.id);

          return (
            <button
              key={spot.id}
              onClick={() => handleHotspotClick(spot)}
              style={{ top: spot.top, left: spot.left }}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto flex items-center gap-2 p-2.5 rounded-full shadow-2xl transition-all duration-300 group ${
                isVisited
                  ? 'bg-white/95 text-slate-700 border border-slate-200 ring-2 ring-slate-300/50'
                  : 'bg-amber-500 text-slate-950 font-black animate-bounce ring-4 ring-amber-400/60 hover:scale-110'
              }`}
            >
              <span className="text-lg">{spot.icon}</span>
              <span className="text-xs font-bold pr-1 hidden sm:inline">{spot.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Observation Card Modal / Bottom Box */}
      <div className="relative z-20 w-full max-w-3xl mx-auto mt-auto mb-4">
        {activeObservation ? (
          <div className="bg-white/95 border-2 border-amber-400 p-5 rounded-3xl shadow-2xl backdrop-blur-md text-slate-900">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-slate-900 font-extrabold text-base md:text-lg flex items-center gap-2">
                <Eye className="w-5 h-5 text-amber-600" /> {activeObservation.title}
              </h3>
              <button
                onClick={() => setActiveObservation(null)}
                className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold hover:bg-amber-200 transition-colors"
              >
                Закрыть
              </button>
            </div>
            <p className="text-slate-700 text-sm md:text-base font-medium leading-relaxed">{activeObservation.text}</p>
          </div>
        ) : (
          <DialogueBox
            speakerName="Мари & Спарк"
            text={
              visitedHotspots.length === 0
                ? 'Мари: «Посмотри на улицу. Нажимай на подсвеченные точки и пойми, почему нас не замечают!»'
                : 'Спарк: «Отличные наблюдения! Теперь мы точно знаем, на что обратить внимание при создании новой вывески.»'
            }
            speakerTagBg="bg-rose-500 text-white"
            onNext={() => {
              if (allVisited || visitedHotspots.length > 0) {
                onComplete();
              }
            }}
            nextButtonLabel="К брифу заказа ➔"
          />
        )}
      </div>

      {/* Complete Step Floating Action Button */}
      {visitedHotspots.length > 0 && (
        <div className="relative z-30 text-center pb-2">
          <button
            onClick={() => {
              soundEngine.playSuccess();
              onComplete();
            }}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white font-extrabold text-sm md:text-base shadow-xl hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
          >
            <Sparkles className="w-5 h-5" /> Всё понятно! Создаём вывеску ➔
          </button>
        </div>
      )}
    </div>
  );
};

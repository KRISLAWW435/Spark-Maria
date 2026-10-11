export interface StickerAsset {
  id: string; // 'icon1' .. 'icon24'
  filename: string;
  name: string;
  category: 'icon' | 'character';
  isFoodOrBakery?: boolean;
  isHumorous?: boolean;
  emoji: string;
}

export const ALL_STICKERS: StickerAsset[] = [
  { id: 'icon1', filename: '/assets/stickers/icon1.webp', name: 'Кекс с вишенкой', category: 'icon', isFoodOrBakery: true, emoji: '🧁' },
  { id: 'icon2', filename: '/assets/stickers/icon2.webp', name: 'Французский круассан', category: 'icon', isFoodOrBakery: true, emoji: '🥐' },
  { id: 'icon3', filename: '/assets/stickers/icon3.webp', name: 'Креветка', category: 'icon', isHumorous: true, emoji: '🦐' },
  { id: 'icon4', filename: '/assets/stickers/icon4.webp', name: 'Автомобильная шина', category: 'icon', isHumorous: true, emoji: '🛞' },
  { id: 'icon5', filename: '/assets/stickers/icon5.webp', name: 'Гаечный ключ', category: 'icon', isHumorous: true, emoji: '🔧' },
  { id: 'icon6', filename: '/assets/stickers/icon6.webp', name: 'Ароматный кофе', category: 'icon', isFoodOrBakery: true, emoji: '☕' },
  { id: 'icon7', filename: '/assets/stickers/icon7.webp', name: 'Шоколадный торт', category: 'icon', isFoodOrBakery: true, emoji: '🎂' },
  { id: 'icon8', filename: '/assets/stickers/icon8.webp', name: 'Французский багет', category: 'icon', isFoodOrBakery: true, emoji: '🥖' },
  { id: 'icon9', filename: '/assets/stickers/icon9.webp', name: 'Глазированный пончик', category: 'icon', isFoodOrBakery: true, emoji: '🍩' },
  { id: 'icon10', filename: '/assets/stickers/icon10.webp', name: 'Клубничное пирожное', category: 'icon', isFoodOrBakery: true, emoji: '🍰' },
  { id: 'icon11', filename: '/assets/stickers/icon11.webp', name: 'Печенье с шоколадом', category: 'icon', isFoodOrBakery: true, emoji: '🍪' },
  { id: 'icon12', filename: '/assets/stickers/icon12.webp', name: 'Свежий эклер', category: 'icon', isFoodOrBakery: true, emoji: '🥖' },
  { id: 'icon13', filename: '/assets/stickers/icon13.webp', name: 'Капучино с пенкой', category: 'icon', isFoodOrBakery: true, emoji: '☕' },
  { id: 'icon14', filename: '/assets/stickers/icon14.webp', name: 'Горячий чайничек', category: 'icon', isFoodOrBakery: true, emoji: '🫖' },
  { id: 'icon15', filename: '/assets/stickers/icon15.webp', name: 'Пшеничный колосок', category: 'icon', isFoodOrBakery: true, emoji: '🌾' },
  { id: 'icon16', filename: '/assets/stickers/icon16.webp', name: 'Котёнок-пекарь', category: 'character', isFoodOrBakery: false, emoji: '🐱' },
  { id: 'icon17', filename: '/assets/stickers/icon17.webp', name: 'Весёлый поварёнок', category: 'character', isFoodOrBakery: false, emoji: '🧑‍🍳' },
  { id: 'icon18', filename: '/assets/stickers/icon18.webp', name: 'Имбирный пряник', category: 'icon', isFoodOrBakery: true, emoji: '🍪' },
  { id: 'icon19', filename: '/assets/stickers/icon19.webp', name: 'Золотая звезда', category: 'icon', isFoodOrBakery: false, emoji: '⭐' },
  { id: 'icon20', filename: '/assets/stickers/icon20.webp', name: 'Яркое сердечко', category: 'icon', isFoodOrBakery: false, emoji: '💖' },
  { id: 'icon21', filename: '/assets/stickers/icon21.webp', name: 'Скалка для теста', category: 'icon', isFoodOrBakery: true, emoji: '🪵' },
  { id: 'icon22', filename: '/assets/stickers/icon22.webp', name: 'Колпак кондитера', category: 'icon', isFoodOrBakery: true, emoji: '👨‍🍳' },
  { id: 'icon23', filename: '/assets/stickers/icon23.webp', name: 'Девочка-сладкоежка', category: 'character', isFoodOrBakery: false, emoji: '👧' },
  { id: 'icon24', filename: '/assets/stickers/icon24.webp', name: 'Пёсик с круассаном', category: 'character', isFoodOrBakery: false, emoji: '🐶' },
];

// Icons allowed for Sign Editor (20 icons: icon1-15, icon18-22, NO characters!)
export const SIGN_ICONS = ALL_STICKERS.filter(s => s.category === 'icon');

// Characters only (icon16, icon17, icon23, icon24)
export const CHARACTER_STICKERS = ALL_STICKERS.filter(s => s.category === 'character');

export const getStickerSrc = (id: string): string => {
  const match = ALL_STICKERS.find(s => s.id === id);
  if (match) return match.filename;
  if (id.startsWith('/')) return id;
  return `/assets/stickers/${id}.webp`;
};

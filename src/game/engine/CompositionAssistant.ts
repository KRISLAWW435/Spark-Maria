import { SignDesign, PosterDesign, StickersDesign, StickerItem } from '../types';
import { getContrastRatio } from './DesignEvaluation';

export interface CompositionFeedback {
  status: 'good' | 'warning' | 'info';
  sparkMessage: string;
  guideBorderColor: 'green' | 'yellow' | 'none';
  hasNearEdge?: boolean;
  hasTooClose?: boolean;
  isOvercrowded?: boolean;
  isEmpty?: boolean;
  isLowContrast?: boolean;
}

export class CompositionAssistant {
  // Sign Composition Feedback
  static evaluateSign(design: SignDesign): CompositionFeedback {
    const bg = design.background || design.bgColor || '#FFF7ED';
    const textColor = design.textColor || '#2A1B12';
    const contrast = getContrastRatio(bg, textColor);

    if (contrast < 3.0) {
      return {
        status: 'warning',
        sparkMessage: 'Ой, кажется ничего не видно — текст сливается с фоном!',
        guideBorderColor: 'yellow',
        isLowContrast: true,
      };
    }

    if (!design.text || design.text.trim().length === 0) {
      return {
        status: 'warning',
        sparkMessage: 'На вывеске пока нет названия пекарни. Добавим надпись?',
        guideBorderColor: 'yellow',
        isEmpty: true,
      };
    }

    return {
      status: 'good',
      sparkMessage: 'Отлично! Выглядит сбалансированно: иконка слева и четкий текст по центру.',
      guideBorderColor: 'green',
    };
  }

  // Poster Composition Feedback
  static evaluatePoster(design: PosterDesign): CompositionFeedback {
    if (!design.title || design.title.trim().length === 0) {
      return {
        status: 'warning',
        sparkMessage: 'Здесь пока пусто. Добавим яркий заголовок?',
        guideBorderColor: 'yellow',
        isEmpty: true,
      };
    }

    return {
      status: 'good',
      sparkMessage: 'Замечательный макет! Все элементы идеально выровнены по сетке.',
      guideBorderColor: 'green',
    };
  }

  // Stickers Composition Feedback
  static evaluateStickers(stickers: StickerItem[]): CompositionFeedback {
    if (stickers.length === 0) {
      return {
        status: 'info',
        sparkMessage: 'Здесь пока пусто. Добавим что-нибудь на витрину?',
        guideBorderColor: 'yellow',
        isEmpty: true,
      };
    }

    if (stickers.length > 8) {
      return {
        status: 'warning',
        sparkMessage: 'Кажется, немного перегружено. Оставим самое главное?',
        guideBorderColor: 'yellow',
        isOvercrowded: true,
      };
    }

    // Check near edges (< 10% or > 80%)
    for (const stk of stickers) {
      if (stk.position.x < 12 || stk.position.x > 82 || stk.position.y < 12 || stk.position.y > 82) {
        return {
          status: 'warning',
          sparkMessage: 'Смотри, наклейка почти выходит за край. Подвинем её чуть ближе к центру?',
          guideBorderColor: 'yellow',
          hasNearEdge: true,
        };
      }
    }

    // Check proximity between stickers
    for (let i = 0; i < stickers.length; i++) {
      for (let j = i + 1; j < stickers.length; j++) {
        const a = stickers[i];
        const b = stickers[j];
        if (a.targetZone === b.targetZone) {
          const dx = a.position.x - b.position.x;
          const dy = a.position.y - b.position.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 15) {
            return {
              status: 'warning',
              sparkMessage: 'Давай чуть раздвинем наклейки, чтобы каждую было хорошо видно!',
              guideBorderColor: 'yellow',
              hasTooClose: true,
            };
          }
        }
      }
    }

    return {
      status: 'good',
      sparkMessage: 'Отлично! Выглядит гармонично и сбалансированно!',
      guideBorderColor: 'green',
    };
  }
}

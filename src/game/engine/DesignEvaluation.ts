import { SignDesign, TestResult, VisitorReaction } from '../types';

// Helper to convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map((x) => x + x).join('');
  }
  const num = parseInt(c, 16) || 0;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// Helper to calculate relative luminance
function getLuminance(rgb: { r: number; g: number; b: number }): number {
  const a = [rgb.r, rgb.g, rgb.b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Calculate color contrast ratio (1 to 21)
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);
  const brightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export function evaluateDesign(design: SignDesign, versionNumber: number): TestResult {
  const contrast = getContrastRatio(design.bgColor, design.textColor);
  const area = design.signWidth * design.signHeight;
  
  // Noticeability score (0 - 1) based on sign dimensions
  let visibilityScore = Math.min(1.0, area / 35000);
  if (design.signWidth < 160 || design.signHeight < 70) {
    visibilityScore = 0.25;
  } else if (design.signWidth > 360) {
    visibilityScore = 0.98;
  }

  // Readability score (0 - 1) based on contrast and font size
  let contrastScore = Math.min(1.0, contrast / 4.5);
  if (contrast < 1.8) contrastScore = 0.15;

  let fontLegibility = 0.8;
  if (design.fontStyle === 'sweet' || design.fontStyle === 'bold') fontLegibility = 1.0;
  if (design.fontStyle === 'handwritten') fontLegibility = 0.7;
  if (design.fontStyle === 'technical') fontLegibility = 0.6;

  const textReadabilityScore = Math.min(1.0, contrastScore * fontLegibility * (design.fontSize / 24));

  // Business understanding score (0 - 1)
  let iconRelevance = 0.5;
  if (design.icon === 'cupcake' || design.icon === 'croissant') iconRelevance = 1.0;
  if (design.icon === 'shrimp') iconRelevance = 0.3;
  if (design.icon === 'tire') iconRelevance = 0.2;
  if (design.icon === 'wrench') iconRelevance = 0.2;

  const textContainsBakery = design.text.toLowerCase().includes('кондитер') || design.text.toLowerCase().includes('сладост') || design.text.toLowerCase().includes('мари') || design.subtext.toLowerCase().includes('экл');

  // Visitor reactions generation
  const visitorList = [
    { id: 'chef', name: 'Шеф-повар Пьер', role: 'Ценитель выпечки' },
    { id: 'driver', name: 'Дядя Валера', role: 'Водитель' },
    { id: 'plumber', name: 'Сантехник Степан', role: 'Мастер на все руки' },
    { id: 'girl', name: 'Девочка Алиса', role: 'Сладкоежка' },
    { id: 'teen', name: 'Подросток Максим', role: 'Школьник с наушниками' },
    { id: 'woman', name: 'Анна с малышом', role: 'Прохожая' },
    { id: 'elderly', name: 'Дедушка Иван', role: 'Местный житель' },
    { id: 'techie', name: 'Девушка с телефоном', role: 'Студентка' },
  ];

  const reactions: VisitorReaction[] = visitorList.map((v) => {
    const noticed = Math.random() < (visibilityScore + 0.15);
    let read = false;
    let understood = false;
    let entered = false;
    let dialogue = 'Проходит мимо, спешит по делам...';
    let emotion: VisitorReaction['emotion'] = 'distracted';
    let specialEvent: VisitorReaction['specialEvent'] = undefined;

    if (noticed) {
      emotion = 'searching';
      read = Math.random() < textReadabilityScore;
      
      if (v.id === 'chef' && design.icon === 'shrimp') {
        read = true;
        understood = false;
        entered = true;
        emotion = 'confused';
        specialEvent = 'chef_shrimp';
        dialogue = '«Мон дьё! Креветка! Я думал, тут морепродукты! А это кондитерская? Тогда беру эклер!»';
      } else if (v.id === 'driver' && design.icon === 'tire') {
        read = true;
        understood = false;
        entered = true;
        emotion = 'amused';
        specialEvent = 'driver_tire';
        dialogue = '«Четыре зимние шины, пожалуйста! Только круассаны? Колесо ими не починишь… но настроение — точно!»';
      } else if (v.id === 'plumber' && design.icon === 'wrench') {
        read = true;
        understood = false;
        entered = true;
        emotion = 'confused';
        specialEvent = 'plumber_wrench';
        dialogue = '«Гаечный ключ на двенадцать есть? Багет? А он на какой размер? На вкусный!»';
      } else if (v.id === 'girl' && (design.icon === 'cupcake' || design.icon === 'croissant')) {
        read = true;
        understood = true;
        entered = true;
        emotion = 'happy';
        specialEvent = 'girl_cupcake';
        dialogue = '«О! Тут сладости! Кекс на вывеске видно издалека!»';
      } else if (read) {
        if (design.icon === 'cupcake' || design.icon === 'croissant' || textContainsBakery) {
          understood = true;
          entered = Math.random() < (iconRelevance * textReadabilityScore + 0.2);
          emotion = entered ? 'happy' : 'interested';
          dialogue = entered ? '«Заметил, прочитал и зашёл за свежим эклером!»' : '«Заметил! В следующий раз обязательно зайду.»';
        } else {
          understood = Math.random() < 0.4;
          entered = Math.random() < 0.3;
          emotion = 'confused';
          dialogue = '«Вывеску видно, но не понятно, что внутри…»';
        }
      } else {
        dialogue = '«Доску видно, а текст не разглядеть — слишком низкий контраст.»';
        if (design.signWidth < 160) {
          dialogue = '«Вывеска слишком маленькая — чуть не наступил на неё!»';
        }
      }
    }

    return {
      visitorId: v.id,
      name: v.name,
      role: v.role,
      emotion,
      noticed,
      read,
      understood,
      entered,
      dialogueBubble: dialogue,
      specialEvent,
    };
  });

  const noticedCount = reactions.filter((r) => r.noticed).length;
  const readCount = reactions.filter((r) => r.read).length;
  const understoodCount = reactions.filter((r) => r.understood || r.entered).length;
  const enteredCount = reactions.filter((r) => r.entered).length;

  // Generate Spark commentary based on results
  let commentary = '';
  let concept = 'Заметность';
  let title = 'Размер и положение';
  let explanation = 'Чем крупнее и удачнее расположена вывеска, тем лёгче прохожим заметить её с улицы.';
  let sparkAnalogy = '«Представь яблоко в траве: маленькое легко потерять, а крупное видно сразу!»';

  if (design.signWidth < 170 || design.signHeight < 75) {
    commentary = '«Маленькая вывеска — как шёпот на шумной улице. Сделай её крупнее!»';
    concept = 'Заметность';
    title = 'Маленький размер';
    explanation = 'Слишком маленькая вывеска сливается с фасадом и прохожие проходят мимо.';
    sparkAnalogy = '«Маленькая вывеска — как шёпот на шумной улице. Сделай её крупнее!»';
  } else if (design.signWidth > 380) {
    commentary = '«Ого! Вывеску видно издалека! Проверим, легко ли прочитать название.»';
    concept = 'Пропорции';
    title = 'Большой размер';
    explanation = 'Большая вывеска отлично привлекает внимание с большого расстояния.';
    sparkAnalogy = '«Вывеску видно издалека! Теперь проверим, легко ли прочитать название.»';
  } else if (contrast < 2.0) {
    commentary = '«Жёлтый сок на жёлтой скатерти не видно. Сделай текст тёмным на светлом или наоборот!»';
    concept = 'Контраст';
    title = 'Низкий контраст';
    explanation = 'Цвет текста слишком похож на фон. Чтобы текст «читался», нужен высокий контраст.';
    sparkAnalogy = '«Жёлтый сок на жёлтой скатерти не видно. Сделай текст тёмным на светлом или наоборот!»';
  } else if (design.icon === 'shrimp') {
    commentary = '«Креветка привлекла клиента! Правда, он искал рыбу, но ушел с эклером.»';
    concept = 'Узнаваемость';
    title = 'Иконка и ожидания';
    explanation = 'Иконка — это быстрая подсказка. Она создаёт у прохожего ожидание того, что внутри.';
    sparkAnalogy = '«Иконка — как дорожный знак. Кекс скажет о сладостях лучше слов!»';
  } else if (design.icon === 'tire') {
    commentary = '«Дядя Валера искал шины, а нашел круассаны! Настроение починили!»';
    concept = 'Узнаваемость';
    title = 'Ассоциации и символы';
    explanation = 'Шина ассоциируется с автосервисом, а не со свежей выпечкой.';
    sparkAnalogy = '«Иконка — как дорожный знак. Кекс скажет о сладостях лучше слов!»';
  } else if (design.icon === 'wrench') {
    commentary = '«Сантехник пришел за ключом, а ушел с багетом!»';
    concept = 'Узнаваемость';
    title = 'Ассоциации';
    explanation = 'Инструменты подсказывают repair shop. Для пекарни лучше подойдут кекс или круассан.';
    sparkAnalogy = '«Иконка — как дорожный знак. Кекс скажет о сладостях лучше слов!»';
  } else if (enteredCount >= 5) {
    commentary = '«Отличная работа! Вывеска заметная, контрастная, а иконка кекса сразу говорит о сладостях!»';
    concept = 'Понятность UX';
    title = 'Идеальный дизайн';
    explanation = 'Гармония размера, контраста, читаемого шрифта и правильной иконки создаёт идеальный поток клиентов!';
    sparkAnalogy = '«Иконка — как дорожный знак. Кекс скажет о сладостях лучше слов!»';
  } else {
    commentary = '«Эксперимент прошёл успешно! Давай посмотрим на данные и подумаем, как привлечь ещё больше людей.»';
    concept = 'Читаемость';
    title = 'Баланс элементов';
    explanation = 'Сочетание контрастного цвета и понятного шрифта помогает прохожим легко прочитать текст.';
    sparkAnalogy = '«Дизайн — это поиск лучшего сочетания размера, цвета и символов!»';
  }

  return {
    versionNumber,
    signDesign: { ...design },
    noticedCount,
    readCount,
    understoodCount,
    enteredCount,
    totalVisitors: visitorList.length,
    visitorReactions: reactions,
    sparkCommentary: commentary,
    educationalTakeaway: {
      title,
      concept,
      explanation,
      sparkAnalogy,
    },
    timestamp: Date.now(),
  };
}

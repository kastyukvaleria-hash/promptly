// src/utils/iconUtils.jsx
import React from 'react';
// --- ИЗМЕНЕНИЕ: Импортируем 15 новых иконок ---
import { 
    IoText, IoImageOutline, IoCodeSlash, IoBulbOutline, IoChatbubblesOutline,
    IoAnalyticsOutline, IoFilmOutline, IoFlaskOutline, IoBriefcaseOutline,
    IoShieldCheckmarkOutline, IoGameControllerOutline, IoMusicalNotesOutline,
    IoShareSocialOutline, IoApertureOutline, IoCloudOutline, IoTimerOutline,
    IoColorPaletteOutline, IoLeafOutline, IoHardwareChipOutline, IoBookOutline
} from 'react-icons/io5';

const iconConfig = {
  // --- СТАРЫЕ 5 СТИЛЕЙ ---
  1: {
    name: "Текст",
    icon: <IoText />, 
    gradient: 'linear-gradient(90deg, #D475F1, #986BF8)',
    labelBg: 'rgba(212, 117, 241, 0.2)',
    labelColor: '#F0D4FF',
  },
  2: {
    name: "Изображения",
    icon: <IoImageOutline />,
    gradient: 'linear-gradient(90deg, #F5AF19, #F12711)',
    labelBg: 'rgba(245, 175, 25, 0.2)',
    labelColor: '#FFEBCB',
  },
  3: {
    name: "Код",
    icon: <IoCodeSlash />,
    gradient: 'linear-gradient(90deg, #628EFF, #8B58F9)',
    labelBg: 'rgba(98, 142, 255, 0.2)',
    labelColor: '#D4E0FF',
  },
  4: {
    name: "Идеи",
    icon: <IoBulbOutline />,
    gradient: 'linear-gradient(90deg, #86FF99, #25D366)',
    labelBg: 'rgba(134, 255, 153, 0.2)',
    labelColor: '#D4FFDC',
  },
  5: {
    name: "Общение",
    icon: <IoChatbubblesOutline />,
    gradient: 'linear-gradient(90deg, #FFB8E0, #FF69B4)',
    labelBg: 'rgba(255, 184, 224, 0.2)',
    labelColor: '#FFEBF5',
  },
  // --- НОВЫЕ 15 СТИЛЕЙ ---
  6: {
    name: "Аналитика",
    icon: <IoAnalyticsOutline />,
    gradient: 'linear-gradient(90deg, #2AF598, #009EFD)',
    labelBg: 'rgba(0, 158, 253, 0.2)',
    labelColor: '#D4F8FF',
  },
  7: {
    name: "Видео",
    icon: <IoFilmOutline />,
    gradient: 'linear-gradient(90deg, #DA22FF, #9733EE)',
    labelBg: 'rgba(218, 34, 255, 0.2)',
    labelColor: '#FAD4FF',
  },
  8: {
    name: "Наука",
    icon: <IoFlaskOutline />,
    gradient: 'linear-gradient(90deg, #43E97B, #38F9D7)',
    labelBg: 'rgba(56, 249, 215, 0.2)',
    labelColor: '#D4FFF6',
  },
  9: {
    name: "Бизнес",
    icon: <IoBriefcaseOutline />,
    gradient: 'linear-gradient(90deg, #FDC830, #F37335)',
    labelBg: 'rgba(243, 115, 53, 0.2)',
    labelColor: '#FFF0D4',
  },
  10: {
    name: "Безопасность",
    icon: <IoShieldCheckmarkOutline />,
    gradient: 'linear-gradient(90deg, #5C6BC0, #3F51B5)',
    labelBg: 'rgba(92, 107, 192, 0.2)',
    labelColor: '#D4D9FF',
  },
  11: {
    name: "Игры",
    icon: <IoGameControllerOutline />,
    gradient: 'linear-gradient(90deg, #4776E6, #8E54E9)',
    labelBg: 'rgba(142, 84, 233, 0.2)',
    labelColor: '#EAD4FF',
  },
  12: {
    name: "Музыка",
    icon: <IoMusicalNotesOutline />,
    gradient: 'linear-gradient(90deg, #f43b47, #453a94)',
    labelBg: 'rgba(244, 59, 71, 0.2)',
    labelColor: '#FFD4D6',
  },
  13: {
    name: "Соцсети",
    icon: <IoShareSocialOutline />,
    gradient: 'linear-gradient(90deg, #2193b0, #6dd5ed)',
    labelBg: 'rgba(33, 147, 176, 0.2)',
    labelColor: '#D4F1FF',
  },
  14: {
    name: "AI",
    icon: <IoApertureOutline />,
    gradient: 'linear-gradient(90deg, #00C9FF, #92FE9D)',
    labelBg: 'rgba(0, 201, 255, 0.2)',
    labelColor: '#D4F9FF',
  },
  15: {
    name: "Данные",
    icon: <IoCloudOutline />,
    gradient: 'linear-gradient(90deg, #E0EAFC, #CFDEF3)',
    labelBg: 'rgba(207, 222, 243, 0.5)',
    labelColor: '#333A47',
  },
  16: {
    name: "Время",
    icon: <IoTimerOutline />,
    gradient: 'linear-gradient(90deg, #FFD194, #D1913C)',
    labelBg: 'rgba(209, 145, 60, 0.2)',
    labelColor: '#FFF5D4',
  },
  17: {
    name: "Арт",
    icon: <IoColorPaletteOutline />,
    gradient: 'linear-gradient(90deg, #ff7e5f, #feb47b)',
    labelBg: 'rgba(255, 126, 95, 0.2)',
    labelColor: '#FFEAD4',
  },
  18: {
    name: "Природа",
    icon: <IoLeafOutline />,
    gradient: 'linear-gradient(90deg, #56ab2f, #a8e063)',
    labelBg: 'rgba(86, 171, 47, 0.2)',
    labelColor: '#E0FFD4',
  },
  19: {
    name: "Технологии",
    icon: <IoHardwareChipOutline />,
    gradient: 'linear-gradient(90deg, #bdc3c7, #2c3e50)',
    labelBg: 'rgba(44, 62, 80, 0.3)',
    labelColor: '#E8EAED',
  },
  20: {
    name: "Книги",
    icon: <IoBookOutline />,
    gradient: 'linear-gradient(90deg, #a17f64, #d3a88c)',
    labelBg: 'rgba(161, 127, 100, 0.2)',
    labelColor: '#FFEFE1',
  },
};

export const getIconConfigById = (id) => {
  return iconConfig[id] || iconConfig[1];
};

export const getAllIconConfigs = () => {
  return Object.entries(iconConfig).map(([id, config]) => ({
    id: parseInt(id, 10),
    ...config,
  }));
};
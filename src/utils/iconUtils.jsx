import React from 'react';
import { IoText, IoImageOutline, IoCodeSlash, IoBulbOutline, IoChatbubblesOutline } from 'react-icons/io5';

const iconConfig = {
  1: {
    name: "Текст",
    // --- УБРАЛИ size={24} ---
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
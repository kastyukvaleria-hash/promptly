// src/utils/iconUtils.jsx
import React from 'react';
// Импортируем все 60 иконок
import { 
    IoText, IoImageOutline, IoCodeSlash, IoBulbOutline, IoChatbubblesOutline,
    IoAnalyticsOutline, IoFilmOutline, IoFlaskOutline, IoBriefcaseOutline,
    IoShieldCheckmarkOutline, IoGameControllerOutline, IoMusicalNotesOutline,
    IoShareSocialOutline, IoApertureOutline, IoCloudOutline, IoTimerOutline,
    IoColorPaletteOutline, IoLeafOutline, IoHardwareChipOutline, IoBookOutline,
    IoPlanetOutline, IoWaterOutline, IoBonfireOutline, IoTrendingUpOutline,
    IoWalletOutline, IoKeyOutline, IoMapOutline, IoCompassOutline, IoRocketOutline,
    IoGiftOutline, IoStarOutline, IoSettingsOutline, IoLibraryOutline, IoSchoolOutline,
    IoHomeOutline, IoPeopleOutline, IoStorefrontOutline, IoCalculatorOutline,
    IoFlowerOutline, IoThunderstormOutline, IoBrushOutline, IoMicOutline, 
    IoCameraOutline, IoVideocamOutline, IoNewspaperOutline, IoMedkitOutline, 
    IoHeartCircleOutline, IoRestaurantOutline, IoBicycleOutline, IoServerOutline,
    IoTerminalOutline, IoBarChartOutline, IoPieChartOutline, IoCubeOutline, 
    IoBuildOutline, IoBasketballOutline, IoBusinessOutline, IoEarthOutline,
    IoExtensionPuzzleOutline, IoFingerPrintOutline
} from 'react-icons/io5';

const iconConfig = {
  // --- СТАРЫЕ 20 СТИЛЕЙ ---
  1: { name: "Текст", icon: <IoText />, gradient: 'linear-gradient(90deg, #D475F1, #986BF8)', labelBg: 'rgba(212, 117, 241, 0.2)', labelColor: '#F0D4FF' },
  2: { name: "Изображения", icon: <IoImageOutline />, gradient: 'linear-gradient(90deg, #F5AF19, #F12711)', labelBg: 'rgba(245, 175, 25, 0.2)', labelColor: '#FFEBCB' },
  3: { name: "Код", icon: <IoCodeSlash />, gradient: 'linear-gradient(90deg, #628EFF, #8B58F9)', labelBg: 'rgba(98, 142, 255, 0.2)', labelColor: '#D4E0FF' },
  4: { name: "Идеи", icon: <IoBulbOutline />, gradient: 'linear-gradient(90deg, #86FF99, #25D366)', labelBg: 'rgba(134, 255, 153, 0.2)', labelColor: '#D4FFDC' },
  5: { name: "Общение", icon: <IoChatbubblesOutline />, gradient: 'linear-gradient(90deg, #FFB8E0, #FF69B4)', labelBg: 'rgba(255, 184, 224, 0.2)', labelColor: '#FFEBF5' },
  6: { name: "Аналитика", icon: <IoAnalyticsOutline />, gradient: 'linear-gradient(90deg, #2AF598, #009EFD)', labelBg: 'rgba(0, 158, 253, 0.2)', labelColor: '#D4F8FF' },
  7: { name: "Видео", icon: <IoFilmOutline />, gradient: 'linear-gradient(90deg, #DA22FF, #9733EE)', labelBg: 'rgba(218, 34, 255, 0.2)', labelColor: '#FAD4FF' },
  8: { name: "Наука", icon: <IoFlaskOutline />, gradient: 'linear-gradient(90deg, #43E97B, #38F9D7)', labelBg: 'rgba(56, 249, 215, 0.2)', labelColor: '#D4FFF6' },
  9: { name: "Бизнес", icon: <IoBriefcaseOutline />, gradient: 'linear-gradient(90deg, #FDC830, #F37335)', labelBg: 'rgba(243, 115, 53, 0.2)', labelColor: '#FFF0D4' },
  10: { name: "Безопасность", icon: <IoShieldCheckmarkOutline />, gradient: 'linear-gradient(90deg, #5C6BC0, #3F51B5)', labelBg: 'rgba(92, 107, 192, 0.2)', labelColor: '#D4D9FF' },
  11: { name: "Игры", icon: <IoGameControllerOutline />, gradient: 'linear-gradient(90deg, #4776E6, #8E54E9)', labelBg: 'rgba(142, 84, 233, 0.2)', labelColor: '#EAD4FF' },
  12: { name: "Музыка", icon: <IoMusicalNotesOutline />, gradient: 'linear-gradient(90deg, #f43b47, #453a94)', labelBg: 'rgba(244, 59, 71, 0.2)', labelColor: '#FFD4D6' },
  13: { name: "Соцсети", icon: <IoShareSocialOutline />, gradient: 'linear-gradient(90deg, #2193b0, #6dd5ed)', labelBg: 'rgba(33, 147, 176, 0.2)', labelColor: '#D4F1FF' },
  14: { name: "AI", icon: <IoApertureOutline />, gradient: 'linear-gradient(90deg, #00C9FF, #92FE9D)', labelBg: 'rgba(0, 201, 255, 0.2)', labelColor: '#D4F9FF' },
  15: { name: "Данные", icon: <IoCloudOutline />, gradient: 'linear-gradient(90deg, #E0EAFC, #CFDEF3)', labelBg: 'rgba(207, 222, 243, 0.5)', labelColor: '#333A47' },
  16: { name: "Время", icon: <IoTimerOutline />, gradient: 'linear-gradient(90deg, #FFD194, #D1913C)', labelBg: 'rgba(209, 145, 60, 0.2)', labelColor: '#FFF5D4' },
  17: { name: "Арт", icon: <IoColorPaletteOutline />, gradient: 'linear-gradient(90deg, #ff7e5f, #feb47b)', labelBg: 'rgba(255, 126, 95, 0.2)', labelColor: '#FFEAD4' },
  18: { name: "Природа", icon: <IoLeafOutline />, gradient: 'linear-gradient(90deg, #56ab2f, #a8e063)', labelBg: 'rgba(86, 171, 47, 0.2)', labelColor: '#E0FFD4' },
  19: { name: "Технологии", icon: <IoHardwareChipOutline />, gradient: 'linear-gradient(90deg, #bdc3c7, #2c3e50)', labelBg: 'rgba(44, 62, 80, 0.3)', labelColor: '#E8EAED' },
  20: { name: "Книги", icon: <IoBookOutline />, gradient: 'linear-gradient(90deg, #a17f64, #d3a88c)', labelBg: 'rgba(161, 127, 100, 0.2)', labelColor: '#FFEFE1' },
  
  // --- НОВЫЕ 40 ЯРКИХ СТИЛЕЙ ---
  21: { name: "Космос", icon: <IoPlanetOutline />, gradient: 'linear-gradient(90deg, #4e54c8, #8f94fb)', labelBg: 'rgba(143, 148, 251, 0.2)', labelColor: '#E2E3FF' },
  22: { name: "Вода", icon: <IoWaterOutline />, gradient: 'linear-gradient(90deg, #4facfe, #00f2fe)', labelBg: 'rgba(0, 242, 254, 0.2)', labelColor: '#D0FBFF' },
  23: { name: "Огонь", icon: <IoBonfireOutline />, gradient: 'linear-gradient(90deg, #ff416c, #ff4b2b)', labelBg: 'rgba(255, 75, 43, 0.2)', labelColor: '#FFD9D4' },
  24: { name: "Финансы", icon: <IoTrendingUpOutline />, gradient: 'linear-gradient(90deg, #11998e, #38ef7d)', labelBg: 'rgba(56, 239, 125, 0.2)', labelColor: '#D5FFDF' },
  25: { name: "Кошелек", icon: <IoWalletOutline />, gradient: 'linear-gradient(90deg, #8360c3, #2ebf91)', labelBg: 'rgba(46, 191, 145, 0.2)', labelColor: '#D4FFF0' },
  26: { name: "Ключ", icon: <IoKeyOutline />, gradient: 'linear-gradient(90deg, #f2fcfe, #1c92d2)', labelBg: 'rgba(28, 146, 210, 0.2)', labelColor: '#D3EFFF' },
  27: { name: "Карта", icon: <IoMapOutline />, gradient: 'linear-gradient(90deg, #ffc500, #c21500)', labelBg: 'rgba(255, 197, 0, 0.2)', labelColor: '#FFF6D1' },
  28: { name: "Компас", icon: <IoCompassOutline />, gradient: 'linear-gradient(90deg, #5f72bd, #9b23ea)', labelBg: 'rgba(155, 35, 234, 0.2)', labelColor: '#F0D6FF' },
  29: { name: "Ракета", icon: <IoRocketOutline />, gradient: 'linear-gradient(90deg, #3a6186, #89253e)', labelBg: 'rgba(137, 37, 62, 0.2)', labelColor: '#FFD4DD' },
  30: { name: "Подарок", icon: <IoGiftOutline />, gradient: 'linear-gradient(90deg, #c0392b, #8e44ad)', labelBg: 'rgba(192, 57, 43, 0.2)', labelColor: '#FFD6D2' },
  31: { name: "Звезда", icon: <IoStarOutline />, gradient: 'linear-gradient(90deg, #f7b733, #fc4a1a)', labelBg: 'rgba(252, 74, 26, 0.2)', labelColor: '#FFE5D2' },
  32: { name: "Настройки", icon: <IoSettingsOutline />, gradient: 'linear-gradient(90deg, #757f9a, #d7dde8)', labelBg: 'rgba(215, 221, 232, 0.5)', labelColor: '#4C5164' },
  33: { name: "Библиотека", icon: <IoLibraryOutline />, gradient: 'linear-gradient(90deg, #1e3c72, #2a5298)', labelBg: 'rgba(42, 82, 152, 0.3)', labelColor: '#D3DFFF' },
  34: { name: "Обучение", icon: <IoSchoolOutline />, gradient: 'linear-gradient(90deg, #005aa7, #fffde4)', labelBg: 'rgba(0, 90, 167, 0.2)', labelColor: '#D1E8FF' },
  35: { name: "Дом", icon: <IoHomeOutline />, gradient: 'linear-gradient(90deg, #02aab0, #00cdac)', labelBg: 'rgba(0, 205, 172, 0.2)', labelColor: '#D0FFFA' },
  36: { name: "Команда", icon: <IoPeopleOutline />, gradient: 'linear-gradient(90deg, #d38312, #a83279)', labelBg: 'rgba(168, 50, 121, 0.2)', labelColor: '#FFD6F1' },
  37: { name: "Магазин", icon: <IoStorefrontOutline />, gradient: 'linear-gradient(90deg, #283c86, #45a247)', labelBg: 'rgba(69, 162, 71, 0.2)', labelColor: '#D9FFDA' },
  38: { name: "Математика", icon: <IoCalculatorOutline />, gradient: 'linear-gradient(90deg, #5614B0, #13547A)', labelBg: 'rgba(19, 84, 122, 0.2)', labelColor: '#D2E7F2' },
  39: { name: "Цветок", icon: <IoFlowerOutline />, gradient: 'linear-gradient(90deg, #ff7b7b, #f53896)', labelBg: 'rgba(245, 56, 150, 0.2)', labelColor: '#FFD6EA' },
  40: { name: "Погода", icon: <IoThunderstormOutline />, gradient: 'linear-gradient(90deg, #1f4037, #99f2c8)', labelBg: 'rgba(153, 242, 200, 0.3)', labelColor: '#1F4037' },
  41: { name: "Рисование", icon: <IoBrushOutline />, gradient: 'linear-gradient(90deg, #ee0979, #ff6a00)', labelBg: 'rgba(255, 106, 0, 0.2)', labelColor: '#FFEAD1' },
  42: { name: "Подкаст", icon: <IoMicOutline />, gradient: 'linear-gradient(90deg, #3e5151, #decba4)', labelBg: 'rgba(62, 81, 81, 0.3)', labelColor: '#F5F2EC' },
  43: { name: "Фото", icon: <IoCameraOutline />, gradient: 'linear-gradient(90deg, #9796f0, #fbc7d4)', labelBg: 'rgba(151, 150, 240, 0.2)', labelColor: '#EBEBFF' },
  44: { name: "Съемка", icon: <IoVideocamOutline />, gradient: 'linear-gradient(90deg, #ef473a, #cb2d3e)', labelBg: 'rgba(203, 45, 62, 0.2)', labelColor: '#FFD7DB' },
  45: { name: "Новости", icon: <IoNewspaperOutline />, gradient: 'linear-gradient(90deg, #77a1d3, #79cbca)', labelBg: 'rgba(121, 203, 202, 0.3)', labelColor: '#466485' },
  46: { name: "Здоровье", icon: <IoMedkitOutline />, gradient: 'linear-gradient(90deg, #e53935, #e35d5b)', labelBg: 'rgba(229, 57, 53, 0.2)', labelColor: '#FFD7D6' },
  47: { name: "Жизнь", icon: <IoHeartCircleOutline />, gradient: 'linear-gradient(90deg, #ff5f6d, #ffc371)', labelBg: 'rgba(255, 95, 109, 0.2)', labelColor: '#FFDADF' },
  48: { name: "Еда", icon: <IoRestaurantOutline />, gradient: 'linear-gradient(90deg, #e65c00, #f9d423)', labelBg: 'rgba(249, 212, 35, 0.2)', labelColor: '#FFF8D4' },
  49: { name: "Спорт", icon: <IoBicycleOutline />, gradient: 'linear-gradient(90deg, #159957, #155799)', labelBg: 'rgba(21, 87, 153, 0.2)', labelColor: '#D2E8FF' },
  50: { name: "Сервер", icon: <IoServerOutline />, gradient: 'linear-gradient(90deg, #4b6cb7, #182848)', labelBg: 'rgba(24, 40, 72, 0.4)', labelColor: '#DDE3F1' },
  51: { name: "Терминал", icon: <IoTerminalOutline />, gradient: 'linear-gradient(90deg, #0f2027, #2c5364)', labelBg: 'rgba(15, 32, 39, 0.5)', labelColor: '#DAE1E4' },
  52: { name: "График", icon: <IoBarChartOutline />, gradient: 'linear-gradient(90deg, #42275a, #734b6d)', labelBg: 'rgba(115, 75, 109, 0.3)', labelColor: '#F0E2EE' },
  53: { name: "Диаграмма", icon: <IoPieChartOutline />, gradient: 'linear-gradient(90deg, #b24592, #f15f79)', labelBg: 'rgba(241, 95, 121, 0.2)', labelColor: '#FFDEE4' },
  54: { name: "3D", icon: <IoCubeOutline />, gradient: 'linear-gradient(90deg, #1c4966, #296d98)', labelBg: 'rgba(41, 109, 152, 0.3)', labelColor: '#D3E6F1' },
  55: { name: "Инструменты", icon: <IoBuildOutline />, gradient: 'linear-gradient(90deg, #606c88, #3f4c6b)', labelBg: 'rgba(63, 76, 107, 0.4)', labelColor: '#E1E4EB' },
  56: { name: "Баскетбол", icon: <IoBasketballOutline />, gradient: 'linear-gradient(90deg, #f27022, #f55b00)', labelBg: 'rgba(242, 112, 34, 0.2)', labelColor: '#FFEBE0' },
  57: { name: "Корпорация", icon: <IoBusinessOutline />, gradient: 'linear-gradient(90deg, #1e2ad2, #5663e2)', labelBg: 'rgba(86, 99, 226, 0.2)', labelColor: '#E0E3FF' },
  58: { name: "Планета", icon: <IoEarthOutline />, gradient: 'linear-gradient(90deg, #2196f3, #4caf50)', labelBg: 'rgba(76, 175, 80, 0.2)', labelColor: '#E4F4E4' },
  59: { name: "Логика", icon: <IoExtensionPuzzleOutline />, gradient: 'linear-gradient(90deg, #ff5722, #ff9800)', labelBg: 'rgba(255, 152, 0, 0.2)', labelColor: '#FFF2E0' },
  60: { name: "Биометрия", icon: <IoFingerPrintOutline />, gradient: 'linear-gradient(90deg, #00bcd4, #009688)', labelBg: 'rgba(0, 150, 136, 0.2)', labelColor: '#E0F2F1' },
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
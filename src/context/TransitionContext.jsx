import React, { createContext, useState, useContext, useCallback } from 'react';

// Вспомогательная функция, чтобы не писать setTimeout везде
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const TransitionContext = createContext(null);

export const TransitionProvider = ({ children }) => {
  // `isTransitioning` отвечает за черный оверлей (затемнение)
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // `showWelcome` отвечает за показ экрана "Добро пожаловать"
  const [showWelcome, setShowWelcome] = useState(false);

  // --- ВОТ ОНА, ГЛАВНАЯ ЛОГИКА АНИМАЦИИ ---
  const transitionToApp = useCallback(async (action) => {
    // 1. Начинаем затемнение
    setIsTransitioning(true);
    await wait(400); // Ждем, пока экран потемнеет (длительность из CSS)

    // 2. Выполняем само действие (логин/регистрацию и навигацию)
    await action();
    
    // 3. ПОКАЗЫВАЕМ экран "Добро пожаловать"
    setShowWelcome(true);

    // 4. Убираем затемнение, чтобы проявить экран приветствия
    setIsTransitioning(false);

    // 5. ДЕРЖИМ экран приветствия 1.5 секунды
    await wait(1500);

    // 6. Плавно скрываем "Добро пожаловать". 
    // Наш роутер среагирует на это и покажет основную страницу.
    setShowWelcome(false); 
  }, []);

  const value = { 
    isTransitioning, 
    showWelcome, 
    transitionToApp // Передаем нашу функцию в контекст
  };

  return (
    <TransitionContext.Provider value={value}>
      {children}
    </TransitionContext.Provider>
  );
};

export const useTransition = () => {
  return useContext(TransitionContext);
};
import React from 'react';
import { motion } from 'framer-motion';

// Определяем варианты анимации
const animations = {
  // Начальное состояние: экран находится за пределами видимости (внизу)
  initial: { opacity: 0, y: "100vh" }, 
  
  // Конечное состояние: экран на своем месте
  animate: { opacity: 1, y: 0 },
  
  // --- ИЗМЕНЕНИЕ ЗДЕСЬ: Состояние при выходе ---
  // Теперь экран уходит обратно ВНИЗ, откуда и появился
  exit: { opacity: 0, y: "100vh" },
};

const AnimatedPage = ({ children }) => {
  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      // --- ИЗМЕНЕНИЕ ЗДЕСЬ: Увеличиваем длительность для плавности ---
      transition={{ duration: 0.5, ease: [0.2, 0.2, 0.3, 0.1] }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
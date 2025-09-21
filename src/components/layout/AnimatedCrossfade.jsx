import React from 'react';
import { motion } from 'framer-motion';

const animations = {
  // Начальное состояние: полностью прозрачно
  initial: { opacity: 0 },
  // Активное состояние: полностью видимо
  animate: { opacity: 1 },
  // Состояние при выходе: снова полностью прозрачно
  exit: { opacity: 0 },
};

const AnimatedCrossfade = ({ children }) => {
  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      // Длительность 0.5 секунды
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCrossfade;
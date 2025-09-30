// src/components/common/SegmentedControl.jsx
import React from 'react';
import { motion } from 'framer-motion'; // <-- Импортируем motion
import styles from './SegmentedControl.module.css';

const SegmentedControl = ({ options, selected, onSelect }) => {
  return (
    <div className={styles.container}>
      {options.map(option => (
        <button
          key={option.value}
          className={`${styles.button} ${selected === option.value ? styles.selected : ''}`}
          onClick={() => onSelect(option.value)}
        >
          {/* --- ИЗМЕНЕНИЕ: Добавляем анимированный ползунок --- */}
          {selected === option.value && (
            <motion.div
              className={styles.slider}
              layoutId="segmented-control-slider" // Уникальный ID для анимации
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;
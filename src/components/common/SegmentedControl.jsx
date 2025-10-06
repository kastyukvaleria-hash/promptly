// src/components/common/SegmentedControl.jsx
import React from 'react';
import { motion } from 'framer-motion';
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
          {selected === option.value && (
            <motion.div
              className={styles.slider}
              layoutId="segmented-control-slider" // Магия переезда
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <span className={styles.label}>{option.label}</span>
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;

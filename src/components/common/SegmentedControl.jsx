// src/components/common/SegmentedControl.jsx
import React from 'react';
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
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;
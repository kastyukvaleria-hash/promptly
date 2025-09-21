import React from 'react';
import { useTransition } from '../../context/TransitionContext.jsx';
import styles from './TransitionOverlay.module.css';

const TransitionOverlay = () => {
  const { isTransitioning } = useTransition();

  // Мы добавляем класс 'visible', когда isTransitioning === true
  return (
    <div 
      className={`${styles.overlay} ${isTransitioning ? styles.visible : ''}`} 
    />
  );
};

export default TransitionOverlay;
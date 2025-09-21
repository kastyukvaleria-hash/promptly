import React from 'react';
import styles from './WelcomeScreen.module.css';

const WelcomeScreen = ({ isVisible }) => {
  return (
    <div className={`${styles.container} ${isVisible ? styles.visible : ''}`}>
      <h1 className={styles.title}>Добро пожаловать</h1>
    </div>
  );
};

export default WelcomeScreen;
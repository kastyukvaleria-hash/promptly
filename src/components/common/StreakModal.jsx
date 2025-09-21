import React from 'react';
import Lottie from 'react-lottie';
import styles from './StreakModal.module.css';

// Импортируй сюда свою скачанную Lottie-анимацию
import streakAnimationData from '../../assets/animations/streak-fire.json'; 

const StreakModal = ({ isOpen, onClose, streakDays }) => {
  if (!isOpen) {
    return null;
  }

  const defaultOptions = {
    loop: false,
    autoplay: true, 
    animationData: streakAnimationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <Lottie options={defaultOptions} height={200} width={200} />
        <h2 className={styles.title}>Огонь!</h2>
        <p className={styles.subtitle}>
          Твоя серия продлена: <span>{streakDays} {streakDays > 4 ? 'дней' : 'дня'} подряд!</span>
        </p>
        <button onClick={onClose} className={styles.closeButton}>Продолжить</button>
      </div>
    </div>
  );
};

export default StreakModal;
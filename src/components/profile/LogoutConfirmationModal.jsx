// src/components/profile/LogoutConfirmationModal.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LogoutConfirmationModal.module.css';

const LogoutConfirmationModal = ({ onClose, onLogout, isAccountLinked }) => {
  const navigate = useNavigate();

  const handleLinkAccount = () => {
    onClose();
    navigate('/link-account');
  };

  if (!isAccountLinked) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Вы уверены?</h3>
        <p className={styles.subtitle}>
          Ваш аккаунт не привязан к почте. Если вы выйдете, вы можете потерять свой прогресс навсегда.
        </p>
        <div className={styles.actions}>
          <button onClick={handleLinkAccount} className={styles.primaryButton}>
            Привязать аккаунт
          </button>
          <button onClick={onLogout} className={styles.secondaryButton}>
            Все равно выйти
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Выйти из аккаунта?</h3>
      <p className={styles.subtitle}>Вы уверены, что хотите выйти?</p>
      <div className={styles.actions}>
        <button onClick={onClose} className={styles.secondaryButton}>
          Отмена
        </button>
        <button onClick={onLogout} className={styles.primaryButton}>
          Выйти
        </button>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;
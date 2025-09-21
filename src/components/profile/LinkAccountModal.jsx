import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LinkAccountModal.module.css';
import { IoMailUnreadOutline } from 'react-icons/io5';

const LinkAccountModal = ({ onClose }) => {
  const navigate = useNavigate();

  const handleLink = () => {
    onClose();
    navigate('/link-account');
  };

  return (
    <div className={styles.modalContent}>
      <div className={styles.iconWrapper}>
        <IoMailUnreadOutline size={40} />
      </div>
      <h2 className={styles.title}>Привяжите вашу почту</h2>
      <p className={styles.subtitle}>
        Это позволит вам сохранять прогресс и входить в аккаунт через сайт,
        даже если вы потеряете доступ к Telegram.
      </p>
      <div className={styles.actions}>
        <button onClick={onClose} className={styles.secondaryButton}>Позже</button>
        <button onClick={handleLink} className={styles.primaryButton}>Привязать</button>
      </div>
    </div>
  );
};

export default LinkAccountModal;
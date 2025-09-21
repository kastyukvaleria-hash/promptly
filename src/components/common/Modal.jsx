import React from 'react';
import { IoClose } from 'react-icons/io5';
import styles from './Modal.module.css';

const Modal = ({ isOpen, onClose, title, children }) => {
  // Если модальное окно не должно быть открыто, ничего не рендерим
  if (!isOpen) {
    return null;
  }

  return (
    // "Портал" для рендера оверлея поверх всего
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <header className={styles.modalHeader}>
          <h2>{title}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <IoClose size={24} />
          </button>
        </header>
        <main className={styles.modalBody}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Modal;
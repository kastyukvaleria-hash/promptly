// src/components/courses/SectionCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { getIconConfigById } from '../../utils/iconUtils.jsx';
import { IoLockClosed } from 'react-icons/io5'; // <-- Импортируем иконку замка
import styles from './SectionCard.module.css';

const SectionCard = ({ section, index }) => {
  // Достаем новое поле isPremium из данных
  const { id, title, description, progressPercentage, unlocked, iconId, chapters, isPremium } = section;
  const config = getIconConfigById(iconId);

  const totalLessons = chapters.reduce((sum, chapter) => sum + chapter.lectures.length, 0);
  const completedLessons = Math.round((totalLessons * progressPercentage) / 100);

  const CardInnerContent = (
    <>
      <div className={styles.mainGrid}>
        <div className={styles.iconWrapper} style={{ background: config.gradient }}>
          {config.icon}
        </div>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.progressLabel} style={{ backgroundColor: config.labelBg, color: config.labelColor }}>
          {/* Если раздел платный и заблокирован, показываем замок. Иначе - прогресс. */}
          {isPremium && !unlocked ? <IoLockClosed /> : `${completedLessons}/${totalLessons}`}
        </div>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar} style={{ width: `${progressPercentage}%`, background: config.gradient }} />
      </div>
    </>
  );

  // Логика блокировки остается прежней. Бэкенд сам решает, прислать unlocked: true или false.
  if (!unlocked) {
    return <div className={`${styles.card} ${styles.locked}`}>{CardInnerContent}</div>;
  }

  return (
    <Link to={`/section/${id}`} className={styles.card}>
      {CardInnerContent}
    </Link>
  );
};

export default SectionCard;
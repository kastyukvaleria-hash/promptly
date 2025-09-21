// src/components/courses/SectionCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { getIconConfigById } from '../../utils/iconUtils.jsx';
import styles from './SectionCard.module.css';

const SectionCard = ({ section, index }) => {
  const { id, title, description, progressPercentage, unlocked, iconId, chapters } = section;
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
          {completedLessons}/{totalLessons}
        </div>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar} style={{ width: `${progressPercentage}%`, background: config.gradient }} />
      </div>
    </>
  );

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

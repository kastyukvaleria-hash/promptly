// src/components/common/HomePageSkeleton.jsx

import React from 'react';
import styles from './HomePageSkeleton.module.css';

const HomePageSkeleton = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.livesWrapper}>
          <div className={`${styles.placeholder} ${styles.lives}`} />
        </div>
        <div className={styles.titleWrapper}>
          <div className={`${styles.placeholder} ${styles.title}`} />
          <div className={`${styles.placeholder} ${styles.subtitle}`} />
        </div>
      </header>

      <div className={`${styles.placeholder} ${styles.overallProgress}`} />

      <main className={styles.sectionsList}>
        <div className={`${styles.placeholder} ${styles.sectionCard}`} />
        <div className={`${styles.placeholder} ${styles.sectionCard}`} />
        <div className={`${styles.placeholder} ${styles.sectionCard}`} />
      </main>
    </div>
  );
};

export default HomePageSkeleton;
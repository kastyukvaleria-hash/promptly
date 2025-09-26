// src/components/profile/ProfilePageSkeleton.jsx
import React from 'react';
import styles from './ProfilePageSkeleton.module.css';

const ProfilePageSkeleton = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={`${styles.placeholder} ${styles.lives}`} />
      </header>

      <main>
        <section className={styles.userCard}>
          <div className={styles.userInfo}>
            <div className={`${styles.placeholder} ${styles.avatar}`} />
            <div className={styles.userText}>
              <div className={`${styles.placeholder} ${styles.nickname}`} />
              <div className={`${styles.placeholder} ${styles.bio}`} />
              <div className={styles.badges}>
                <div className={`${styles.placeholder} ${styles.badge}`} />
                <div className={`${styles.placeholder} ${styles.badge}`} />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.statsGrid}>
          <div className={`${styles.placeholder} ${styles.statCard}`} />
          <div className={`${styles.placeholder} ${styles.statCard}`} />
          <div className={`${styles.placeholder} ${styles.statCard}`} />
        </section>

        <section className={styles.promptsSection}>
          <div className={`${styles.placeholder} ${styles.sectionTitle}`} />
          <div className={`${styles.placeholder} ${styles.accordionItem}`} />
        </section>
      </main>
    </div>
  );
};

export default ProfilePageSkeleton;